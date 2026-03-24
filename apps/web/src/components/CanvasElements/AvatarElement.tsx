import { useContext, useEffect, useRef } from 'react'
import { Circle, Group, Transformer } from 'react-konva'
import { StaticImage } from './StaticImage'
import { ElementsContext } from '../CanvasPlayer/context'
import type { CanvasElement } from '@canvas-studio/canvas-core'

interface AvatarElementProps {
  item: CanvasElement
}

/**
 * 数字人元素
 * - 支持圆形蒙版裁剪（mask.type === 'circle'）
 * - 蒙版可拖拽和缩放
 * - 蒙版颜色可配置
 */
export function AvatarElement({ item }: AvatarElementProps) {
  const { syncPosToState, setActiveUid, activeUid, stageRef } = useContext(ElementsContext)
  const mask = item.mask || null
  const hasMask = !!mask?.type
  const maskTransformRef = useRef<any>(null)
  const maskShapeRef = useRef<any>(null)

  const clipFunc = hasMask
    ? (ctx: any) => {
        const maskShape = maskShapeRef.current
        if (maskShape) {
          const x = maskShape.x(), y = maskShape.y()
          const radius = (maskShape.getWidth() / 2) * maskShape.scaleX()
          ctx.arc(x, y, radius, 0, Math.PI * 2, false)
        }
      }
    : undefined

  useEffect(() => {
    const tNode = maskTransformRef.current
    if (!tNode) return
    if (activeUid === item.uid && hasMask) {
      const activeShape = stageRef.current?.findOne(`#${item.uid}$$mask`)
      if (activeShape) {
        tNode.nodes([activeShape])
        tNode.getLayer()?.batchDraw()
      }
    } else {
      tNode.nodes([])
      tNode.getLayer()?.batchDraw()
    }
  }, [activeUid, item.uid, hasMask, stageRef])

  return (
    <Group
      x={item.offsetX || 0}
      y={item.offsetY || 0}
      draggable
      onDragEnd={syncPosToState}
      id={item.uid + '$$group'}
    >
      <Group
        id={item.uid + '$$clipGroup'}
        onMouseDown={() => setActiveUid(item.type, item.uid)}
        clipFunc={clipFunc}
      >
        <StaticImage draggable={false} item={item} />
      </Group>

      {hasMask && (
        <Circle
          perfectDrawEnabled={false}
          onTransformEnd={syncPosToState}
          onMouseDown={() => setActiveUid(item.type, item.uid)}
          draggable
          ref={maskShapeRef}
          id={item.uid + '$$mask'}
          x={mask!.left}
          y={mask!.top}
          scaleX={mask!.scaleX}
          scaleY={mask!.scaleY}
          radius={mask!.width / 2}
        />
      )}

      <Transformer
        key="maskTransform"
        visible
        ref={maskTransformRef}
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
        boundBoxFunc={(oldBox, newBox) => {
          if (Math.abs(newBox.width) < 50 || Math.abs(newBox.height) < 50) return oldBox
          return newBox
        }}
      />
    </Group>
  )
}
