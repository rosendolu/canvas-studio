import { useContext, useMemo } from 'react'
import useImage from 'use-image'
import { Image } from 'react-konva'
import { ElementsContext } from '../CanvasPlayer/context'
import type { CanvasElement } from '@canvas-studio/canvas-core'

interface StaticImageProps {
  item: CanvasElement
  draggable?: boolean
}

/**
 * 静态图片元素（背景/贴图/数字人等）
 */
export function StaticImage({ item, draggable = true }: StaticImageProps) {
  const { syncPosToState, setActiveUid } = useContext(ElementsContext)

  const sourceURL = useMemo(() => {
    if (!item.src) return ''
    // Add webp suffix for CDN optimization
    return item.src.includes('?') ? item.src : item.src + '?imageView2/2/format/webp'
  }, [item.src])

  const [image] = useImage(sourceURL, 'anonymous')
  const isBubbleText = item.type === 'bubbleText'

  // offsetX/offsetY = half size → Konva scales/rotates around element center
  // x/y compensated so visual top-left = item.left / item.top
  const ox = isBubbleText ? 0 : item.width  / 2
  const oy = isBubbleText ? 0 : item.height / 2

  return (
    <Image
      visible={item.visible}
      id={item.uid}
      name={item.uid + item.type}
      draggable={draggable}
      onMouseDown={() => setActiveUid(item.type, item.uid)}
      width={item.width}
      height={item.height}
      offsetX={ox}
      offsetY={oy}
      x={isBubbleText ? 0 : item.left + ox}
      y={isBubbleText ? 0 : item.top  + oy}
      scaleX={isBubbleText ? 1 : item.scaleX}
      scaleY={isBubbleText ? 1 : item.scaleY}
      rotation={isBubbleText ? 0 : item.rotation}
      fill={item.mask?.background || 'transparent'}
      image={image}
      onDragEnd={syncPosToState}
      onTransformEnd={syncPosToState}
    />
  )
}
