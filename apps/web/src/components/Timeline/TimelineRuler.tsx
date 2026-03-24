import { useEffect, useMemo, useRef, useState } from 'react'
import { useMantineColorScheme } from '@mantine/core'
import type { CanvasConfig, TimelineUserConfig } from '@canvas-studio/canvas-core'
import { drawTimeLine, getSelectFrame, getTimeLineWidth } from '@canvas-studio/canvas-core'

interface TimelineRulerProps {
  userConfig: TimelineUserConfig
  track: any[]
  trackScale: number
  fps: number
  onFrameChange: (frame: number) => void
}

export default function TimelineRuler({ userConfig, track, trackScale, fps, onFrameChange }: TimelineRulerProps) {
  const timeLineRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasAttr, setCanvasAttr] = useState({ width: 0, height: 0 })
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  // Theme-aware canvas config
  const canvasConfig = useMemo(() => ({
    bgColor: isDark ? '#242527' : '#f1f3f5',
    ratio: 1,
    textSize: 12,
    textScale: 0.83,
    lineWidth: 1,
    textBaseline: 'middle' as const,
    textAlign: 'center' as const,
    longColor: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    shortColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
    textColor: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.55)',
    subTextColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)',
    focusColor: '#7c3aed',
  }), [isDark])

  const canvasStyle = useMemo(() => ({
    width: `${canvasAttr.width / canvasConfig.ratio}px`,
    height: `${canvasAttr.height / canvasConfig.ratio}px`,
  }), [canvasAttr, canvasConfig.ratio])

  function setCanvasRect() {
    if (!timeLineRef.current) return
    const { width, height } = timeLineRef.current.getBoundingClientRect()
    const widthLine = getTimeLineWidth(track, trackScale)
    const canvasWidth = Math.max(width, widthLine) * canvasConfig.ratio + 1
    setCanvasAttr({ width: canvasWidth, height: height * canvasConfig.ratio })
  }

  useEffect(() => { setCanvasRect() }, [trackScale, isDark])
  useEffect(() => {
    window.addEventListener('resize', setCanvasRect)
    return () => window.removeEventListener('resize', setCanvasRect)
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !canvasAttr.width) return
    const ctx = canvasRef.current.getContext('2d')!
    ctx.font = `${canvasConfig.textSize * canvasConfig.ratio}px -apple-system, sans-serif`
    ctx.lineWidth = canvasConfig.lineWidth
    ;(ctx as any).textBaseline = canvasConfig.textBaseline
    ;(ctx as any).textAlign = canvasConfig.textAlign

    const fullConfig: CanvasConfig = {
      ...canvasConfig,
      ...canvasAttr,
      lineColor: canvasConfig.longColor,
    }
    drawTimeLine(ctx, userConfig, fullConfig)
  }, [canvasAttr, userConfig, canvasConfig])

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const offset = (e.nativeEvent as MouseEvent).offsetX
    const frameIndex = getSelectFrame(userConfig.start + offset, userConfig.scale, userConfig.step)
    onFrameChange(frameIndex - 1)
  }

  return (
    <div
      ref={timeLineRef}
      style={{
        width: '100%',
        height: '40px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: canvasConfig.bgColor,
      }}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        width={canvasAttr.width}
        height={canvasAttr.height}
        style={{ display: 'block', ...canvasStyle }}
      />
    </div>
  )
}
