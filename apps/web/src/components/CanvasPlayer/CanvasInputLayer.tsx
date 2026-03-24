import { useRef, useState } from 'react'
import type { CanvasElement } from '@canvas-studio/canvas-core'

interface CanvasInputLayerProps {
  elements: CanvasElement[]
  focusUid: string
  setFocusUid: (uid: string) => void
  onUpdateElements: (elements: CanvasElement[]) => void
}

/**
 * 气泡文字内联编辑层
 * 当 bubbleText 双击激活后，渲染一个绝对定位的 textarea 覆盖在 Canvas 元素上
 */
export function CanvasInputLayer({ elements, focusUid, setFocusUid, onUpdateElements }: CanvasInputLayerProps) {
  const item = elements.find(el => el.uid === focusUid)
  const [renderText, setRenderText] = useState(() => (item?.text || '').replace(/\n+/g, '\n'))
  const inputRef = useRef<HTMLTextAreaElement>(null)

  if (!item) return null

  const hasBreakLine = /\n/g.test(renderText)

  function onTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value.slice(0, 20)
    setRenderText(text)
  }

  function syncTextToState() {
    const newElements = elements.map(el =>
      el.uid === focusUid ? { ...el, text: renderText } : el
    )
    onUpdateElements(newElements)
    setFocusUid('')
  }

  return (
    <textarea
      ref={inputRef}
      autoFocus
      value={renderText}
      onChange={onTextChange}
      onBlur={syncTextToState}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { e.preventDefault(); syncTextToState() }
      }}
      maxLength={21}
      style={{
        position: 'absolute',
        left: item.left,
        top: item.top,
        width: item.width * item.scaleX,
        height: item.height * item.scaleY,
        color: item.color || '#fff',
        background: 'transparent',
        border: 'none',
        outline: '1px dashed rgba(255,255,255,0.5)',
        resize: 'none',
        fontSize: (item.fontSize || 12) * item.scaleX,
        fontFamily: item.fontFamily || 'sans-serif',
        textAlign: 'center',
        lineHeight: !hasBreakLine ? item.height * item.scaleY + 'px' : '1.5',
        zIndex: 10,
        padding: 0,
      }}
    />
  )
}
