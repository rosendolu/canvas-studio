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

// Extra space around canvas so Transformer anchors at edges are never clipped
const UI_PAD = 64

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

  const contentStageRef = useRef<any>(null)  // elements stage
  const uiStageRef      = useRef<any>(null)  // transformer stage
  const transformRef    = useRef<any>(null)  // Transformer node
  const mirrorRectRef   = useRef<any>(null)  // invisible mirror Rect in UI stage
  const containerRef    = useRef<HTMLDivElement>(null)
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

  // ── Sync element position/scale back to store ──
  function syncPosToState(e: any) {
    const target = e.target
    const id: string = target.attrs.id || mirrorRectRef.current?.attrs?.id || ''
    const [uid, shapeType] = id.split('$$') as [string, string | undefined]
    const obj = elements.find(el => el.uid === uid)
    if (!obj) return

    // mirrorRect coordinates are in UI stage space (offset by UI_PAD).
    // StaticImage uses offsetX/offsetY = w/2, h/2 so node.x() = item.left + w/2.
    // We compensate: stored left = node.x() - UI_PAD - offsetX
    const rawX   = target.x()
    const rawY   = target.y()
    const scaleX = target.scaleX() || 1
    const scaleY = target.scaleY() || 1
    const offsetX = target.offsetX?.() ?? 0
    const offsetY = target.offsetY?.() ?? 0

    const updates: Partial<CanvasElement> = {}

    if (shapeType === 'group') {
      // Avatar group — no offsetX/offsetY
      updates.left = rawX - UI_PAD
      updates.top  = rawY - UI_PAD
      if (e.type === 'transformend') { updates.scaleX = scaleX; updates.scaleY = scaleY }
    } else if (id.endsWith('bubbleText')) {
      updates.left = rawX - UI_PAD - offsetX
      updates.top  = rawY - UI_PAD - offsetY
    } else {
      // StaticImage: x = left + offsetX  →  left = x - offsetX
      updates.left   = rawX - UI_PAD - offsetX
      updates.top    = rawY - UI_PAD - offsetY
      updates.scaleX = scaleX
      updates.scaleY = scaleY
    }

    const rotation = target.rotation() || 0
    updates.rotation = rotation < 0 ? 360 + rotation : rotation
    onSyncPos(uid, updates)
  }

  // Also handle mask sync from content stage (AvatarElement handles its own Transformer)
  function syncMaskToState(uid: string, maskUpdates: Partial<CanvasElement['mask'] & {}>) {
    const obj = elements.find(el => el.uid === uid)
    if (!obj?.mask) return
    onSyncPos(uid, { mask: { ...obj.mask, ...maskUpdates } })
  }

  function setActiveUid(type = '', uid = '') {
    onSetActive(type, uid)
  }

  // ── Mirror active element's geometry onto mirrorRect, then attach Transformer ──
  useEffect(() => {
    const tNode = transformRef.current
    const mirror = mirrorRectRef.current
    if (!tNode || !mirror) return

    if (!activeUid) {
      tNode.nodes([])
      tNode.getLayer()?.batchDraw()
      mirror.visible(false)
      return
    }

    // Look up real element in content stage
    let realNode = contentStageRef.current?.findOne(`#${activeUid}`)
    if (!realNode) realNode = contentStageRef.current?.findOne(`#${activeUid}$$group`)
    if (!realNode) return

    // Copy geometry to mirror rect (UI stage coords = content stage coords + UI_PAD)
    // getAbsolutePosition() already accounts for offsetX/offsetY, so x() here = item.left + ox
    const absPos = realNode.getAbsolutePosition()
    mirror.x(absPos.x + UI_PAD)
    mirror.y(absPos.y + UI_PAD)
    mirror.offsetX(realNode.offsetX?.() ?? 0)
    mirror.offsetY(realNode.offsetY?.() ?? 0)
    mirror.width(realNode.width())
    mirror.height(realNode.height())
    mirror.scaleX(realNode.scaleX())
    mirror.scaleY(realNode.scaleY())
    mirror.rotation(realNode.rotation())
    mirror.id(realNode.attrs.id)
    mirror.visible(true)
    mirror.getLayer()?.batchDraw()

    tNode.nodes([mirror])
    tNode.getLayer()?.batchDraw()
  }, [activeUid, elements])

  const checkDeselectContent = (e: any) => {
    if (e.target === e.target.getStage()) {
      setActiveUid('', '')
      setFocusUid('')
    }
  }

  const checkDeselectUI = (e: any) => {
    // Click on UI stage background (not on transformer/mirror) → deselect
    if (e.target === e.target.getStage()) {
      setActiveUid('', '')
      setFocusUid('')
    }
  }

  function activeEditText() {
    const obj = elements.find(item => item.uid === activeUid)
    if (obj?.type === 'bubbleText') setFocusUid(activeUid)
  }

  const syncPosWrapper  = useCallback(syncPosToState, [elements, onSyncPos])
  const setActiveWrapper = useCallback(setActiveUid, [onSetActive])

  const uiW = width  + UI_PAD * 2
  const uiH = height + UI_PAD * 2

  return (
    <ElementsContext.Provider value={{
      syncPosToState: syncPosWrapper,
      activeUid,
      focusUid,
      setFocusUid,
      stageRef: contentStageRef,
      setActiveUid: setActiveWrapper,
    }}>
      {/*
        Outer wrapper: overflow visible — allows UI Stage to bleed outside canvas edges.
        Width/height matches canvas so layout is not disrupted.
      */}
      <div
        ref={containerRef}
        tabIndex={0}
        style={{
          width, height,
          position: 'relative',
          overflow: 'visible',
          outline: 'none',
        }}
      >
        {/* ── Content Stage: clips to canvas — elements only ── */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <Stage
            ref={contentStageRef}
            width={width}
            height={height}
            onMouseDown={checkDeselectContent}
          >
            <Layer>
              <Rect width={width} height={height} fill={bgColor} />
              {elements.map(obj => <RenderElement key={obj.uid} item={obj} />)}
            </Layer>
          </Stage>
        </div>

        {/*
          ── UI Stage: Transformer + mirror Rect ──
          Positioned UI_PAD outside canvas on all sides.
          pointer-events: none on wrapper so content stage receives normal mouse events;
          Konva handles pointer events internally for Transformer anchors.
        */}
        <div
          style={{
            position: 'absolute',
            top: -UI_PAD,
            left: -UI_PAD,
            width: uiW,
            height: uiH,
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          <Stage
            ref={uiStageRef}
            width={uiW}
            height={uiH}
            onMouseDown={checkDeselectUI}
            onDblClick={activeEditText}
          >
            <Layer>
              {/*
                Mirror Rect — invisible, sits in UI stage coordinate space.
                Transformer is attached to this node; drag/transform events come here.
                Actual element in content stage stays in sync via useEffect above.
              */}
              <Rect
                ref={mirrorRectRef}
                visible={false}
                fill="transparent"
                draggable
                onDragMove={(e: any) => {
                  // Live-update the real element position while dragging
                  // mirror.x() is center-point (has offsetX), so real node x = mirror.x()
                  const mirror = e.target
                  const id: string = mirror.attrs.id || ''
                  const [uid] = id.split('$$')
                  const realNode = contentStageRef.current?.findOne(`#${uid}`)
                    || contentStageRef.current?.findOne(`#${uid}$$group`)
                  if (realNode) {
                    // mirror and realNode share same offsetX/offsetY, so x maps directly
                    realNode.x(mirror.x() - UI_PAD)
                    realNode.y(mirror.y() - UI_PAD)
                    realNode.getLayer()?.batchDraw()
                  }
                }}
                onDragEnd={syncPosWrapper}
                onTransform={(e: any) => {
                  // Live-update scale/rotation while transforming
                  const mirror = e.target
                  const id: string = mirror.attrs.id || ''
                  const [uid] = id.split('$$')
                  const realNode = contentStageRef.current?.findOne(`#${uid}`)
                    || contentStageRef.current?.findOne(`#${uid}$$group`)
                  if (realNode) {
                    realNode.x(mirror.x() - UI_PAD)
                    realNode.y(mirror.y() - UI_PAD)
                    realNode.scaleX(mirror.scaleX())
                    realNode.scaleY(mirror.scaleY())
                    realNode.rotation(mirror.rotation())
                    realNode.getLayer()?.batchDraw()
                  }
                }}
                onTransformEnd={syncPosWrapper}
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
                rotateEnabled={false}
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
              />
            </Layer>
          </Stage>
        </div>

        {/* Empty placeholder */}
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
