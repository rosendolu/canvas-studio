import { useContext, useRef } from 'react'
import { Group, Text } from 'react-konva'
import { StaticImage } from './StaticImage'
import { ElementsContext } from '../CanvasPlayer/context'
import type { CanvasElement } from '@canvas-studio/canvas-core'

interface BubbleTextProps {
  item: CanvasElement
  draggable?: boolean
}

/**
 * 气泡文字元素
 * - 包含背景图（可选）+ Konva Text
 * - 支持双击进入编辑模式
 */
export function BubbleText({ item, draggable = true }: BubbleTextProps) {
  const { syncPosToState, setActiveUid, focusUid, setFocusUid } = useContext(ElementsContext)
  const textRef = useRef<any>(null)

  const renderText = (item.text || '').replace(/\n+/g, '\n')

  return (
    <Group
      draggable={draggable}
      id={item.uid + '$$group'}
      name={item.uid + item.type}
      onDblClick={() => setFocusUid?.(item.uid)}
      onDragEnd={syncPosToState}
      onTransformEnd={syncPosToState}
      rotation={item.rotation || 0}
      x={item.left}
      y={item.top}
      visible={item.visible}
      scaleX={item.scaleX}
      scaleY={item.scaleY}
      onMouseDown={() => setActiveUid(item.type, item.uid)}
    >
      {item.src ? <StaticImage draggable={false} item={item} /> : null}
      <Text
        ref={textRef}
        id={item.uid}
        name={item.uid + item.type}
        text={renderText}
        fontSize={item.fontSize || 12}
        fontFamily={item.fontFamily || 'sans-serif'}
        align="center"
        lineHeight={1.5}
        verticalAlign="middle"
        fill={focusUid === item.uid ? 'transparent' : item.color || '#fff'}
        width={item.width}
        height={item.height}
      />
    </Group>
  )
}
