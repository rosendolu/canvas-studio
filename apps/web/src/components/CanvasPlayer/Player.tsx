import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Layer, Rect, Stage, Text, Transformer } from 'react-konva'
import { useMantineColorScheme } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { ElementsContext, PlayerContext } from './context'
import { StaticImage } from '../CanvasElements/StaticImage'
import { BubbleText } from '../CanvasElements/BubbleText'
import { AvatarElement } from '../CanvasElements/AvatarElement'
import { ApngCanvas } from '../CanvasElements/ApngCanvas'
import { Carousel } from '../CanvasElements/Carousel'
import { Slide } from '../CanvasElements/Slide'
import { CanvasInputLayer } from './CanvasInputLayer'
import type { CanvasElement } from '@canvas-studio/canvas-core'

interface PlayerProps {
  width: number
  height: number
  elements: CanvasElement[]
  activeUid: string
  bgColor?: string
  onSyncPos: (uid: string, updates: Partial<CanvasElement>) => void
  onSetActive: (type: string, uid: string) => void
  onDeleteElement?: (uid: string) => void
}

export default function Player({
  width,
  height,
  elements,
  activeUid,
  bgColor = 'transparent',
  onSyncPos,
  onSetActive,
  onDeleteElement,
}: PlayerProps) {
  const { spinning } = useContext(PlayerContext)
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'
  const transformRef = useRef<any>(null)
  const stageRef = useRef<any>(null)
  const transformRectRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [focusUid, setFocusUid] = useState('')

  // ── Keyboard: Delete / Backspace ──
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return
      if ((e.key === 'Backspace' || e.key === 'Delete') && activeUid) {
        e.preventDefault()
        onDeleteElement?.(activeUid)
      }
    }
    el.addEventListener('keydown', handleKeyDown)
    return () => el.removeEventListener('keydown', handleKeyDown)
  }, [activeUid, onDeleteElement])

  function syncPosToState(e: any) {
    const target = e.target
    const id: string = target.attrs.id || ''
    const [uid, shapeType] = id.split('$$') as [string, string | undefined]
    const obj = elements.find(el => el.uid === uid)
    if (!obj) return

    const left = target.x(), top = target.y()
    const scaleX = target.scaleX(), scaleY = target.scaleY()
    const updates: Partial<CanvasElement> = {}

    if (shapeType === 'mask' && obj.mask) {
      const radius = target.radius?.() ?? target.getWidth?.() / 2 ?? 0
      updates.mask = {
        ...obj.mask,
        left, top,
        scaleX: scaleX || 1, scaleY: scaleY || 1,
        width: radius * 2, height: radius * 2,
      }
    } else if (shapeType === 'group') {
      updates.left = left
      updates.top = top
      if (e.type === 'transformend') {
        updates.scaleX = scaleX || 1
        updates.scaleY = scaleY || 1
      }
    } else if (id.endsWith('bubbleText')) {
      updates.left = left; updates.top = top
    } else {
      updates.left = left; updates.top = top
      updates.scaleX = scaleX || 1; updates.scaleY = scaleY || 1
    }

    const rotation = target.rotation() || 0
    if (!('mask' in updates)) {
      updates.rotation = rotation < 0 ? 360 + rotation : rotation
    }
    onSyncPos(uid, updates)
  }

  function setActiveUid(type = '', uid = '') {
    onSetActive(type, uid)
  }

  // ── Attach Transformer to active element ──
  useEffect(() => {
    const tNode = transformRef.current
    if (!activeUid) {
      tNode?.nodes([])
      tNode?.getLayer()?.batchDraw()
      transformRectRef.current?.hide()
      return
    }
    let active = stageRef.current?.findOne(`#${activeUid}`)
    if (String(active?.attrs?.name || '').endsWith('bubbleText')) {
      active = stageRef.current?.findOne(`#${activeUid}$$group`)
    }

    // avatar (mask element) does not support rotation
    if (active && String(active?.attrs?.name || '').endsWith('avatar')) {
      transformRef.current?.rotateEnabled(false)
    } else {
      transformRef.current?.rotateEnabled(true)
    }

    if (active) {
      const w = active.width()
      if (w) {
        // Attach Transformer directly to the real node — no mirror rect.
        // Transformer reads the node's full transform (position/scale/rotation)
        // and draws the selection box correctly even when rotated.
        tNode?.nodes([active])
        tNode?.getLayer()?.batchDraw()
      }
    } else {
      tNode?.nodes([])
      tNode?.getLayer()?.batchDraw()
    }
  }, [activeUid, elements])

  const checkDeselect = (e: any) => {
    if (e.target === e.target.getStage()) {
      setActiveUid('', '')
      setFocusUid('')
    }
  }

  function toggleShapeSelect(e: any) {
    transformRectRef.current?.hide()
    setTimeout(() => {
      const shape = stageRef.current?.getIntersection({ x: e.evt.offsetX, y: e.evt.offsetY })
      const uid = shape?.attrs?.id
      uid && setActiveUid('', uid)
    }, 100)
  }

  function activeEditText() {
    const obj = elements.find(item => item.uid === activeUid)
    if (obj?.type === 'bubbleText') setFocusUid(activeUid)
  }

  const syncPosWrapper = useCallback(syncPosToState, [elements, onSyncPos])
  const setActiveWrapper = useCallback(setActiveUid, [onSetActive])

  return (
    <ElementsContext.Provider value={{
      syncPosToState: syncPosWrapper,
      activeUid,
      focusUid,
      setFocusUid,
      stageRef,
      setActiveUid: setActiveWrapper,
    }}>
      {/*
        overflow: visible — same as nnk-24h-live Player.tsx
        Allows Konva Stage canvas to render outside this div's bounds
        (outer CanvasPlayer div uses overflow: hidden to clip content)
      */}
      <div
        ref={containerRef}
        tabIndex={0}
        style={{ width, height, position: 'relative', overflow: 'visible', outline: 'none' }}
      >
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          onMouseDown={checkDeselect}
        >
          <Layer>
            <Rect width={width} height={height} fill={bgColor} />
            {elements.map(obj => <RenderElement key={obj.uid} item={obj} />)}
            <Rect
              visible={false}
              onDblClick={activeEditText}
              onClick={toggleShapeSelect}
              ref={transformRectRef}
            />
            <Transformer
              key="shapeTransform"
              id="shapeTransform"
              visible={!!activeUid}
              ref={transformRef}
              keepRatio
              rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
              flipEnabled={false}
              anchorFill="#fff"
              anchorStroke="#fff"
              borderEnabled
              anchorSize={10}
              borderStrokeWidth={2}
              borderStroke="#FF000D"
              onTransform={(e: any) => {
                const anchorName = e.currentTarget.getActiveAnchor()
                if (anchorName === 'top-center' || anchorName === 'bottom-center')
                  e.target.scaleX(e.target.scaleY())
                else if (anchorName === 'middle-left' || anchorName === 'middle-right')
                  e.target.scaleY(e.target.scaleX())
              }}
              rotateEnabled
              enabledAnchors={[
                'top-left', 'top-center', 'top-right',
                'middle-left', 'middle-right',
                'bottom-left', 'bottom-center', 'bottom-right',
              ]}
              boundBoxFunc={(oldBox: any, newBox: any) => {
                if (
                  (oldBox.width < 20 && newBox.width < oldBox.width) ||
                  (oldBox.height < 20 && newBox.height < oldBox.height)
                ) return oldBox
                return newBox
              }}
              anchorStyleFunc={(anchor: any) => {
                if (
                  anchor.hasName('top-left') || anchor.hasName('top-right') ||
                  anchor.hasName('bottom-left') || anchor.hasName('bottom-right')
                ) {
                  anchor.width(12); anchor.height(12); anchor.cornerRadius(6)
                }
                if (anchor.hasName('top-center') || anchor.hasName('bottom-center')) {
                  anchor.width(16); anchor.height(8); anchor.cornerRadius(4)
                }
                if (anchor.hasName('middle-left') || anchor.hasName('middle-right')) {
                  anchor.width(8); anchor.height(16); anchor.cornerRadius(4)
                }
                if (anchor.hasName('rotater')) {
                  anchor.width(16); anchor.height(16)
                  anchor.offsetY(8); anchor.offsetX(8)
                  anchor.cornerRadius(8)
                  anchor.fill('#FF000D'); anchor.stroke('#FF000D')
                }
              }}
            />
          </Layer>
        </Stage>

        {elements.length === 0 && !spinning && <EmptyPlaceholder isDark={isDark} />}

        {focusUid && (
          <CanvasInputLayer
            elements={elements}
            focusUid={focusUid}
            setFocusUid={setFocusUid}
            onUpdateElements={() => {}}
          />
        )}
      </div>
    </ElementsContext.Provider>
  )
}

function RenderElement({ item }: { item: CanvasElement }) {
  if (item.type === 'picture-scrolling') return <Carousel item={item} />
  if (item.type === 'slideshow') return <Slide item={item} />
  if (item.src?.endsWith?.('.apng')) return <ApngCanvas item={item} />
  if (item.type === 'avatar') return <AvatarElement item={item} />
  if (item.type === 'bubbleText') return <BubbleText item={item} />
  if (/background|sticker|product/.test(item.type)) return <StaticImage item={item} />
  return <Text fill="red" text="未知元素类型" />
}

function EmptyPlaceholder({ isDark }: { isDark: boolean }) {
  const { t } = useTranslation()
  const iconColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.18)'
  const textColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 9,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
        gap: 10,
      }}
    >
      <div style={{ fontSize: 48, lineHeight: 1, color: iconColor }}>🎨</div>
      <div style={{ fontSize: 13, color: textColor, letterSpacing: 0.3 }}>
        {t('canvas.emptyHint')}
      </div>
    </div>
  )
}
