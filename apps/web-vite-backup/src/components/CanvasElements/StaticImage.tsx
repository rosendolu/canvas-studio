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
  const isDraggable = draggable && !item.locked

  const sourceURL = useMemo(() => {
    if (!item.src) return ''
    // Add webp suffix for CDN optimization
    return item.src.includes('?') ? item.src : item.src + '?imageView2/2/format/webp'
  }, [item.src])

  const [image] = useImage(sourceURL, 'anonymous')
  const isBubbleText = item.type === 'bubbleText'

  return (
    <Image
      visible={item.visible}
      opacity={item.opacity ?? 1}
      id={item.uid}
      name={item.uid + item.type}
      draggable={isDraggable}
      onMouseDown={() => !item.locked && setActiveUid(item.type, item.uid)}
      width={item.width}
      height={item.height}
      x={isBubbleText ? 0 : item.left}
      y={isBubbleText ? 0 : item.top}
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
