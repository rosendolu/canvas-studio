import { useEffect, useMemo, useRef, useState } from 'react'
import { useBoolean, useDebounceValue } from 'usehooks-ts'
import { useMantineColorScheme } from '@mantine/core'
import Player from './Player'
import { PlayerContext } from './context'
import { aspectRatioRenderSize, changeOrientation, fitCanvasResize, initElementPos } from '@canvas-studio/canvas-core'
import cloneDeep from 'lodash-es/cloneDeep'
import type { CanvasElement } from '@canvas-studio/canvas-core'

interface CanvasPlayerProps {
  elements: CanvasElement[]
  activeUid: string
  bgColor?: string
  aspectRatio?: string
  drawWidth: number
  drawHeight: number
  onSyncPos: (uid: string, updates: Partial<CanvasElement>) => void
  onSetActive: (type: string, uid: string) => void
  onSetCanvasSize: (w: number, h: number) => void
  onUpdateElements: (elements: CanvasElement[], drawWidth?: number, drawHeight?: number) => void
  onDeleteElement?: (uid: string) => void
}

/**
 * Generate a checkerboard CSS background (transparent/pixel effect)
 * adapts to light/dark theme
 */
function checkerboardBg(isDark: boolean): React.CSSProperties {
  const light = isDark ? '#3a3a3a' : '#e0e0e0'
  const dark  = isDark ? '#2a2a2a' : '#cccccc'
  return {
    backgroundImage: `
      linear-gradient(45deg, ${dark} 25%, transparent 25%),
      linear-gradient(-45deg, ${dark} 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, ${dark} 75%),
      linear-gradient(-45deg, transparent 75%, ${dark} 75%)
    `,
    backgroundSize: '16px 16px',
    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
    backgroundColor: light,
  }
}

export default function CanvasPlayer({
  elements, activeUid, bgColor, aspectRatio = '16:9',
  drawWidth, drawHeight, onSyncPos, onSetActive, onSetCanvasSize, onUpdateElements, onDeleteElement,
}: CanvasPlayerProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ width: 0, height: 0 })
  const [maxSize] = useDebounceValue(pos, 300)
  const { value: spinning, setValue: setSpinning } = useBoolean(false)
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const renderSize = useMemo(() => {
    return aspectRatioRenderSize(aspectRatio, maxSize.width, maxSize.height)
  }, [maxSize.height, maxSize.width, aspectRatio])

  const initDrawSizeRef = useRef(0)
  const prevRenderSizeRef = useRef(renderSize)
  const prevAspectRatioRef = useRef(aspectRatio)

  // Init canvas size once
  useEffect(() => {
    if (!renderSize.width || initDrawSizeRef.current || drawWidth !== 0) return
    initDrawSizeRef.current = 1
    onSetCanvasSize(renderSize.width, renderSize.height)
  }, [renderSize.width])

  // Init element positions (when elements have 0 size)
  useEffect(() => {
    if (!renderSize.width || !elements.length) return
    let needRerender = false
    const renderElements = cloneDeep(elements).map(el => {
      if (el.width === 0 && el.height === 0 && el.originalWidth !== 0) {
        needRerender = true
        initElementPos(el, renderSize)
      }
      return el
    })
    if (needRerender) onUpdateElements(renderElements, renderSize.width, renderSize.height)
  }, [elements.length, renderSize.width])

  // Aspect ratio change
  useEffect(() => {
    if (!drawWidth || !drawHeight || !maxSize.width) return
    const prevRatio = drawWidth / drawHeight
    const [w, h] = aspectRatio.split(/[：:]/).map(Number)
    if (Math.abs(prevRatio - w / h) < 0.1) return
    const { width: prevWidth, height: prevHeight } = aspectRatioRenderSize(`${drawWidth}:${drawHeight}`, maxSize.width, maxSize.height)
    const { width, height } = aspectRatioRenderSize(aspectRatio, maxSize.width, maxSize.height)
    const renderElements = cloneDeep(elements).map(el => { changeOrientation(el, { width, height, prevWidth, prevHeight }); return el })
    onUpdateElements(renderElements, width, height)
  }, [aspectRatio])

  // Canvas resize
  useEffect(() => {
    if (!renderSize.width || !elements.length || !drawWidth || !drawHeight) return
    const [w, h] = aspectRatio.split(/[：:]/).map(Number)
    const prevRatio = drawWidth / drawHeight
    if (Math.abs(prevRatio - w / h) > 0.1) return
    const ratio = Math.min(renderSize.width / drawWidth, renderSize.height / drawHeight)
    if (Math.abs(ratio - 1) < 0.001) return
    const renderElements = cloneDeep(elements).map(el => { fitCanvasResize(el, ratio); return el })
    onUpdateElements(renderElements, renderSize.width, renderSize.height)
  }, [renderSize.width, renderSize.height])

  // ResizeObserver
  useEffect(() => {
    const box = boxRef.current!
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setPos({ width, height })
      }
    })
    observer.observe(box)
    return () => { observer.unobserve(box); observer.disconnect() }
  }, [])

  function deActiveElement(e: React.MouseEvent) {
    if (e.target === boxRef.current) onSetActive('', '')
  }

  return (
    <PlayerContext.Provider value={{ spinning, setSpinning }}>
      <div
        ref={boxRef}
        onClick={deActiveElement}
        style={{
          height: '100%', width: '100%',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          overflow: 'hidden', position: 'relative',
        }}
      >
        {renderSize.width > 0 && (
          <div
            style={{
              position: 'relative',
              width: renderSize.width,
              height: renderSize.height,
              flexShrink: 0,
              /* Checkerboard pixel bg — visible when canvas bgColor is transparent */
              ...checkerboardBg(isDark),
              /* Shadow to clearly separate canvas from stage */
              boxShadow: isDark
                ? '0 4px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)'
                : '0 4px 24px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.08)',
            }}
          >
            <Player
              width={renderSize.width}
              height={renderSize.height}
              elements={elements}
              activeUid={activeUid}
              bgColor={bgColor}
              onSyncPos={onSyncPos}
              onSetActive={onSetActive}
              onDeleteElement={onDeleteElement}
            />
          </div>
        )}
        {spinning && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', zIndex: 10 }}>
            <div style={{ color: '#fff', fontSize: 14 }}>加载中...</div>
          </div>
        )}
      </div>
    </PlayerContext.Provider>
  )
}
