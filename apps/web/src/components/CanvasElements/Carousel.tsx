import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Image } from 'react-konva'
import { ElementsContext } from '../CanvasPlayer/context'
import type { CanvasElement } from '@canvas-studio/canvas-core'

interface CarouselProps {
  item: CanvasElement
  draggable?: boolean
}

/**
 * 图片无缝滚动（picture-scrolling 类型）
 * 使用原生 Canvas 2D API + requestAnimationFrame 实现无限滚动效果
 * 支持水平/垂直两个方向，速度可配置
 */
export function Carousel({ item, draggable = true }: CarouselProps) {
  const { syncPosToState, setActiveUid } = useContext(ElementsContext)
  const { horizontal = 0, vertical = 0 } = item as any
  const targetRef = useRef<any>(null)

  const sourceURL = useMemo(() => {
    return item.src ? item.src + '?imageView2/2/format/webp' : ''
  }, [item.src])

  const canvasEle = useMemo(() => {
    const el = document.createElement('canvas')
    el.width = item.originalWidth
    el.height = item.originalHeight
    return el
  }, [item.originalWidth, item.originalHeight])

  const [refresh, setRefresh] = useState(0)
  const imageEle = useMemo(() => {
    if (!sourceURL) return null
    const img = new window.Image()
    img.onload = () => setRefresh(Math.random())
    img.src = sourceURL
    img.crossOrigin = 'anonymous'
    return img
  }, [sourceURL])

  useEffect(() => {
    if (!imageEle) return
    const ctx = canvasEle.getContext('2d')!
    let w = item.originalWidth, h = item.originalHeight
    let offsetX = 0, offsetY = 0
    let nextFrameId = 0

    function draw() {
      ctx.clearRect(0, 0, w, h)
      const dx = offsetX % w
      const dx2 = horizontal > 0 ? dx - w : dx + w
      const dy = offsetY % h
      const dy2 = vertical > 0 ? dy - h : dy + h

      ctx.drawImage(imageEle!, dx, dy, w, h)
      ctx.drawImage(imageEle!, dx2, dy, w, h)
      ctx.drawImage(imageEle!, dx, dy2, w, h)
      ctx.drawImage(imageEle!, dx2, dy2, w, h)

      offsetX = (offsetX + horizontal) % w
      offsetY = (offsetY + vertical) % h

      targetRef.current?.getLayer()?.draw()
      if ((horizontal === 0 && vertical === 0) || !item.visible) return
      nextFrameId = requestAnimationFrame(draw)
    }

    draw()
    return () => { nextFrameId && cancelAnimationFrame(nextFrameId) }
  }, [horizontal, vertical, refresh, item.visible, item.scaleX, canvasEle, imageEle, item.originalWidth, item.originalHeight])

  return (
    <Image
      ref={targetRef}
      visible={item.visible}
      id={item.uid}
      name={item.uid + item.type}
      draggable={draggable}
      onMouseDown={() => setActiveUid(item.type, item.uid)}
      width={item.width}
      height={item.height}
      x={item.left}
      y={item.top}
      scaleX={item.scaleX}
      scaleY={item.scaleY}
      rotation={item.rotation}
      image={canvasEle}
      onDragEnd={syncPosToState}
      onTransformEnd={syncPosToState}
    />
  )
}
