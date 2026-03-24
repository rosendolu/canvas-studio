import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Layer, Rect, Stage, Text, Transformer } from 'react-konva'
import cloneDeep from 'lodash-es/cloneDeep'
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
  /** Video timeline mode: filter by currentFrame */
  currentFrame?: number
}

/**
 * Konva Stage Player
 * 通用画布播放器，支持以下元素类型：
 * - background / background-video (背景图/视频帧)
 * - avatar (数字人，支持圆形蒙版)
 * - sticker / product (贴图/商品)
 * - bubbleText (气泡文字，可编辑)
 * - picture-scrolling (无缝滚动轮播)
 * - slideshow (幻灯片切换)
 * - apng (APNG 动态贴图)
 * - solid-color (纯色背景)
 */
export default function Player({
  width,
  height,
  elements,
  activeUid,
  bgColor = 'transparent',
  onSyncPos,
  onSetActive,
}: PlayerProps) {
  const { spinning } = useContext(PlayerContext)
  const transformRef = useRef<any>(null)
  const stageRef = useRef<any>(null)
  const transformRectRef = useRef<any>(null)
  const [focusUid, setFocusUid] = useState('')

  function syncPosToState(e: any) {
    const target = e.target
    const [left, top] = [target.x(), target.y()]
    const [scaleX, scaleY] = [target.scaleX(), target.scaleY()]
    const [uid, shapeType] = (target.attrs.id?.split('$$') || []) as string[]
    const obj = elements.find(el => el.uid === uid)
    if (!obj) return

    const updates: Partial<CanvasElement> = {}
    if (shapeType === 'mask' && obj.mask) {
      obj.mask.left = left; obj.mask.top = top
      obj.mask.scaleX = scaleX || 1; obj.mask.scaleY = scaleY || 1
    } else if (shapeType === 'group') {
      if (String(target?.attrs?.name || '').endsWith('bubbleText')) {
        updates.left = left; updates.top = top
      } else {
        updates.offsetX = left || 0; updates.offsetY = top || 0
      }
      if (e.type === 'transformend') { updates.scaleX = scaleX || 1; updates.scaleY = scaleY || 1 }
    } else {
      updates.left = left; updates.top = top
      updates.scaleX = scaleX || 1; updates.scaleY = scaleY || 1
    }
    const rotation = target.rotation() || 0
    updates.rotation = rotation < 0 ? 360 + rotation : rotation
    onSyncPos(uid, updates)
  }

  function setActiveUid(type = '', uid = '') {
    onSetActive(type, uid)
  }

  // Attach transformer to active element
  useEffect(() => {
    const tNode = transformRef.current
    if (!activeUid) {
      tNode?.nodes([]); tNode?.getLayer()?.batchDraw(); transformRectRef.current?.hide(); return
    }
    let active = stageRef.current?.findOne(`#${activeUid}`)
    if (String(active?.attrs?.name || '').endsWith('bubbleText')) {
      active = stageRef.current?.findOne(`#${activeUid}$$group`)
    }
    if (active) {
      const shape = transformRectRef.current
      if (shape) {
        shape.position(active.position())
        shape.width(active.width())
        shape.height(active.height())
        shape.scale(active.scale())
        shape.show()
        tNode?.nodes([active, shape])
        tNode?.getLayer()?.batchDraw()
      }
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
      <div style={{ width, height, position: 'relative', overflow: 'hidden' }}>
        <Stage ref={stageRef} width={width} height={height} onMouseDown={checkDeselect}>
          <Layer>
            <Rect width={width} height={height} fill={bgColor} />
            {elements.map(obj => (
              <RenderElement key={obj.uid} item={obj} />
            ))}
            <Rect
              visible={false}
              onDblClick={activeEditText}
              onClick={toggleShapeSelect}
              draggable
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
                if (anchorName === 'top-center' || anchorName === 'bottom-center') e.target.scaleX(e.target.scaleY())
                else if (anchorName === 'middle-left' || anchorName === 'middle-right') e.target.scaleY(e.target.scaleX())
              }}
              rotateEnabled={false}
              enabledAnchors={['top-left','top-center','top-right','middle-left','middle-right','bottom-left','bottom-center','bottom-right']}
              boundBoxFunc={(oldBox: any, newBox: any) => {
                if ((oldBox.width < 20 && newBox.width < oldBox.width) || (oldBox.height < 20 && newBox.height < oldBox.height)) return oldBox
                return newBox
              }}
            />
          </Layer>
        </Stage>

        {elements.length === 0 && !spinning && <EmptyPlaceholder />}
        {focusUid && <CanvasInputLayer elements={elements} focusUid={focusUid} setFocusUid={setFocusUid} onUpdateElements={(elements) => {
          // This will be handled by parent
        }} />}
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

function EmptyPlaceholder() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64 }}>🎬</div>
        <div style={{ marginTop: 8, fontSize: 14 }}>点击左侧添加元素</div>
      </div>
    </div>
  )
}
