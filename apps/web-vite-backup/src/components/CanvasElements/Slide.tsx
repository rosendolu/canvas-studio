import { useContext, useEffect, useMemo, useRef } from 'react'
import { Image } from 'react-konva'
import { ElementsContext } from '../CanvasPlayer/context'
import { containScale } from '@canvas-studio/canvas-core'
import type { CanvasElement } from '@canvas-studio/canvas-core'

interface SlideProps {
  item: CanvasElement
  draggable?: boolean
}

// Timing functions
const TimeFn = {
  linear: (t: number) => t,
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
}

/**
 * 幻灯片切换元素（slideshow 类型）
 * 使用 Canvas 2D API 绘制多张图片轮播，带滑入过渡动画
 */
export function Slide({ item, draggable = true }: SlideProps) {
  const { syncPosToState, setActiveUid } = useContext(ElementsContext)
  const { imageList = [], config = { time: 5000, transitionDuration: 500 } } = item
  const targetRef = useRef<any>(null)

  const canvasEle = useMemo(() => {
    const el = document.createElement('canvas')
    el.width = item.originalWidth
    el.height = item.originalHeight
    return el
  }, [item.originalWidth, item.originalHeight])

  const imgList = useMemo(
    () =>
      imageList.map(obj => {
        const img = new window.Image()
        img.src = obj.src
        img.crossOrigin = 'anonymous'
        return { ...obj, img }
      }),
    [imageList]
  )

  const animateConf = useRef({
    currentImageIndex: 0,
    lastSwitchTime: performance.now(),
    isTransitioning: false,
    transitionStartTime: 0,
    startXPos: 0,
    endXPos: item.originalWidth,
  }).current

  useEffect(() => {
    if (!imgList.length) return
    const ctx = canvasEle.getContext('2d')!
    const totalImages = imgList.length
    const displayDuration = config.time / totalImages
    const transitionDuration = config.transitionDuration
    const w = item.originalWidth, h = item.originalHeight
    let nextFrameId = 0

    function draw(timestamp: number) {
      ctx.clearRect(0, 0, w, h)
      const elapsed = timestamp - animateConf.lastSwitchTime

      if (elapsed >= displayDuration && !animateConf.isTransitioning) {
        animateConf.isTransitioning = true
        animateConf.transitionStartTime = timestamp
        animateConf.currentImageIndex = (animateConf.currentImageIndex + 1) % totalImages
      }

      if (animateConf.isTransitioning) {
        const transitionElapsed = timestamp - animateConf.transitionStartTime
        const progress = Math.min(transitionElapsed / transitionDuration, 1)
        const xOffset = w * TimeFn.easeInOut(progress)

        const prevImg = imgList[(animateConf.currentImageIndex - 1 + totalImages) % totalImages]
        const { offsetX: ox1, offsetY: oy1, drawWidth: dw1, drawHeight: dh1 } = containScale(
          { width: w, height: h }, { width: prevImg.originalWidth, height: prevImg.originalHeight }
        )
        ctx.drawImage(prevImg.img, animateConf.startXPos - xOffset + ox1, oy1, dw1, dh1)

        const curImg = imgList[animateConf.currentImageIndex]
        const { offsetX: ox2, offsetY: oy2, drawWidth: dw2, drawHeight: dh2 } = containScale(
          { width: w, height: h }, { width: curImg.originalWidth, height: curImg.originalHeight }
        )
        ctx.drawImage(curImg.img, animateConf.endXPos - xOffset + ox2, oy2, dw2, dh2)

        if (progress === 1) {
          animateConf.isTransitioning = false
          animateConf.lastSwitchTime = timestamp
          animateConf.startXPos = 0
          animateConf.endXPos = w
        }
      } else {
        const curImg = imgList[animateConf.currentImageIndex]
        const { offsetX, offsetY, drawWidth, drawHeight } = containScale(
          { width: w, height: h }, { width: curImg.originalWidth, height: curImg.originalHeight }
        )
        ctx.drawImage(curImg.img, offsetX, offsetY, drawWidth, drawHeight)
      }

      targetRef.current?.getLayer()?.draw()
      if (!item.visible) return
      nextFrameId = requestAnimationFrame(draw)
    }

    nextFrameId = requestAnimationFrame(draw)
    return () => { nextFrameId && cancelAnimationFrame(nextFrameId) }
  }, [imgList, config, item.visible, item.scaleX, canvasEle, item.originalWidth, item.originalHeight])

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
