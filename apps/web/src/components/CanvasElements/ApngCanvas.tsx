import { useContext, useEffect, useMemo, useRef } from 'react'
import { Image } from 'react-konva'
import parseAPNG from 'apng-js'
import Konva from 'konva'
import { ElementsContext } from '../CanvasPlayer/context'
import type { CanvasElement } from '@canvas-studio/canvas-core'

interface ApngCanvasProps {
  item: CanvasElement
}

/**
 * APNG 动态贴图元素
 * 使用 apng-js 解析 APNG 帧并通过 Konva.Animation 驱动刷新
 */
export function ApngCanvas({ item }: ApngCanvasProps) {
  const { syncPosToState, setActiveUid } = useContext(ElementsContext)
  const imageRef = useRef<any>(null)

  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = item.originalWidth
    c.height = item.originalHeight
    return c
  }, [item.originalWidth, item.originalHeight])

  useEffect(() => {
    let anim: any, player: any

    async function run() {
      const response = await fetch(item.src)
      const buffer = await response.arrayBuffer()
      const apng: any = parseAPNG(buffer)
      if (apng.getPlayer) {
        const context = canvas.getContext('2d')
        if (context) {
          player = await apng.getPlayer(context, true)
          const layer = imageRef.current?.parent
          anim = new Konva.Animation(() => {}, layer)
          anim.start()
        }
      }
    }

    run().catch(console.error)

    return () => {
      anim?.stop()
      player?.stop()
    }
  }, [item.src, canvas])

  return (
    <Image
      image={canvas}
      ref={imageRef}
      id={item.uid}
      name={item.uid + item.type}
      width={item.width}
      height={item.height}
      x={item.left}
      y={item.top}
      scaleX={item.scaleX}
      scaleY={item.scaleY}
      rotation={item.rotation}
      fill={item.mask?.background || 'transparent'}
      visible={item.visible}
      onMouseDown={() => setActiveUid(item.type, item.uid)}
      onDragEnd={syncPosToState}
      onTransformEnd={syncPosToState}
    />
  )
}
