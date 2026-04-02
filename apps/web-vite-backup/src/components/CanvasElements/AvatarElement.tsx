import { useContext, useEffect, useRef } from 'react'
import { Circle, Group, Transformer, Image as KonvaImage } from 'react-konva'
import useImage from 'use-image'
import { ElementsContext } from '../CanvasPlayer/context'
import type { CanvasElement } from '@canvas-studio/canvas-core'

interface AvatarElementProps {
  item: CanvasElement
}

/**
 * Image Mask Element
 *
 * Layout (all in canvas coords, no offsetX/offsetY on Group):
 *   - Group at (item.left, item.top), draggable → id=uid$$group
 *     - KonvaImage: full image rendered at (0, 0), size=width×height
 *       clipped by clipFunc reading maskShapeRef
 *     - Circle (mask handle): at (mask.left, mask.top), radius=mask.width/2
 *       draggable, transforms with its own Transformer (blue dashed)
 *
 * syncPosToState flow:
 *   - group dragEnd  → updates item.offsetX / item.offsetY (Player.tsx)
 *   - mask dragEnd   → updates mask.left / mask.top
 *   - mask transformEnd → updates mask.scaleX / mask.scaleY
 */
export function AvatarElement({ item }: AvatarElementProps) {
  const { syncPosToState, setActiveUid, activeUid, stageRef } = useContext(ElementsContext)
  const mask = item.mask ?? null
  const hasMask = !!mask?.type

  const maskTransformRef = useRef<any>(null)
  const maskShapeRef     = useRef<any>(null)
  const imageRef         = useRef<any>(null)

  // Load image
  const srcUrl = item.src
    ? (item.src.includes('?') ? item.src : item.src + '?imageView2/2/format/webp')
    : ''
  const [image] = useImage(srcUrl, 'anonymous')

  // clipFunc: circle clip following the mask Circle shape
  const clipFunc = hasMask
    ? (ctx: CanvasRenderingContext2D) => {
        const shape = maskShapeRef.current
        if (!shape) return
        const x      = shape.x()
        const y      = shape.y()
        const radius = (shape.radius() || shape.getWidth() / 2) * shape.scaleX()
        ctx.arc(x, y, radius, 0, Math.PI * 2, false)
      }
    : undefined

  // Attach mask Transformer when this element is active
  useEffect(() => {
    const tNode = maskTransformRef.current
    if (!tNode) return
    if (activeUid === item.uid && hasMask) {
      const maskShape = stageRef.current?.findOne(`#${item.uid}$$mask`)
      if (maskShape) {
        tNode.nodes([maskShape])
        tNode.getLayer()?.batchDraw()
      }
    } else {
      tNode.nodes([])
      tNode.getLayer()?.batchDraw()
    }
  }, [activeUid, item.uid, hasMask, stageRef])

  // Initial mask position: center of image if mask.left/top are 0
  const maskX = (mask?.left != null && mask.left !== 0) ? mask.left : item.width / 2
  const maskY = (mask?.top  != null && mask.top  !== 0) ? mask.top  : item.height / 2
  const maskRadius = mask ? (mask.width / 2) * (mask.scaleX || 1) : Math.min(item.width, item.height) / 2

  return (
    <Group
      x={item.left}
      y={item.top}
      draggable
      onDragEnd={syncPosToState}
      id={item.uid + '$$group'}
      name={item.uid + '$$group'}
      onMouseDown={() => setActiveUid(item.type, item.uid)}
    >
      {/* Clipped image */}
      <Group clipFunc={clipFunc}>
        <KonvaImage
          ref={imageRef}
          id={item.uid}
          image={image}
          width={item.width}
          height={item.height}
          scaleX={item.scaleX}
          scaleY={item.scaleY}
          rotation={item.rotation || 0}
          visible={item.visible}
        />
      </Group>

      {/* Mask handle circle — draggable, resizable */}
      {hasMask && (
        <Circle
          perfectDrawEnabled={false}
          ref={maskShapeRef}
          id={item.uid + '$$mask'}
          x={maskX}
          y={maskY}
          radius={maskRadius}
          scaleX={1}
          scaleY={1}
          draggable
          fill="rgba(64,158,255,0.08)"
          stroke="rgba(64,158,255,0.5)"
          strokeWidth={1.5}
          dash={[6, 4]}
          onDragEnd={syncPosToState}
          onTransformEnd={syncPosToState}
          onMouseDown={() => setActiveUid(item.type, item.uid)}
        />
      )}

      {/* Mask Transformer — only shown when element is active */}
      <Transformer
        ref={maskTransformRef}
        visible
        centeredScaling
        rotateEnabled={false}
        flipEnabled={false}
        anchorFill="#409eff"
        anchorStroke="#409eff"
        borderEnabled
        anchorSize={10}
        borderDash={[8, 12]}
        borderStroke="#409eff"
        enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
        boundBoxFunc={(oldBox: any, newBox: any) => {
          if (Math.abs(newBox.width) < 40 || Math.abs(newBox.height) < 40) return oldBox
          // Keep square
          const size = Math.max(Math.abs(newBox.width), Math.abs(newBox.height))
          return { ...newBox, width: size, height: size }
        }}
      />
    </Group>
  )
}
