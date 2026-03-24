import { useEffect, useMemo, useRef, useState } from 'react'
import type { CanvasConfig, TimelineUserConfig } from '@canvas-studio/canvas-core'
import { drawTimeLine, getSelectFrame, getTimeLineWidth } from '@canvas-studio/canvas-core'

interface TimelineRulerProps {
  userConfig: TimelineUserConfig
  track: any[]
  trackScale: number
  fps: number
  onFrameChange: (frame: number) => void
}

const BASE_CANVAS_CONFIGS: Omit<CanvasConfig, 'width' | 'height' | 'lineColor'> = {
  bgColor: '#242527',
  ratio: 1,
  textSize: 12,
  textScale: 0.83,
  lineWidth: 1,
  textBaseline: 'middle',
  textAlign: 'center',
  longColor: 'rgba(255,255,255,0.3)',
  shortColor: 'rgba(255,255,255,0.3)',
  textColor: 'rgba(255,255,255,0.3)',
  subTextColor: 'rgba(255,255,255,0.3)',
  focusColor: '#6D28D9',
}

/**
 * 时间轴刻度标尺
 * 使用 Canvas 2D API 绘制：
 * - 背景底色
 * - 长/短刻度线
 * - 时间文字（支持帧/秒/分钟单位切换）
 * - 选中区间高亮
 */
export default function TimelineRuler({ userConfig, track, trackScale, fps, onFrameChange }: TimelineRulerProps) {
  const timeLineRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasAttr, setCanvasAttr] = useState({ width: 0, height: 0 })

  const canvasStyle = useMemo(() => ({
    width: `${canvasAttr.width / BASE_CANVAS_CONFIGS.ratio}px`,
    height: `${canvasAttr.height / BASE_CANVAS_CONFIGS.ratio}px`,
  }), [canvasAttr])

  function setCanvasRect() {
    if (!timeLineRef.current) return
    const { width, height } = timeLineRef.current.getBoundingClientRect()
    const widthLine = getTimeLineWidth(track, trackScale)
    const canvasWidth = Math.max(width, widthLine) * BASE_CANVAS_CONFIGS.ratio + 1
    setCanvasAttr({ width: canvasWidth, height: height * BASE_CANVAS_CONFIGS.ratio })
  }

  useEffect(() => { setCanvasRect() }, [trackScale])
  useEffect(() => {
    window.addEventListener('resize', setCanvasRect)
    return () => window.removeEventListener('resize', setCanvasRect)
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !canvasAttr.width) return
    const ctx = canvasRef.current.getContext('2d')!
    ctx.font = `${BASE_CANVAS_CONFIGS.textSize * BASE_CANVAS_CONFIGS.ratio}px -apple-system, sans-serif`
    ctx.lineWidth = BASE_CANVAS_CONFIGS.lineWidth
    ;(ctx as any).textBaseline = BASE_CANVAS_CONFIGS.textBaseline
    ;(ctx as any).textAlign = BASE_CANVAS_CONFIGS.textAlign

    const fullConfig: CanvasConfig = {
      ...BASE_CANVAS_CONFIGS,
      ...canvasAttr,
      lineColor: BASE_CANVAS_CONFIGS.longColor,
    }
    drawTimeLine(ctx, userConfig, fullConfig)
  }, [canvasAttr, userConfig])

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const offset = (e.nativeEvent as MouseEvent).offsetX
    const frameIndex = getSelectFrame(userConfig.start + offset, userConfig.scale, userConfig.step)
    onFrameChange(frameIndex - 1)
  }

  return (
    <div ref={timeLineRef} style={{ width: '100%', height: '40px', overflow: 'hidden', cursor: 'pointer' }} onClick={handleClick}>
      <canvas
        ref={canvasRef}
        width={canvasAttr.width}
        height={canvasAttr.height}
        style={{ display: 'block', ...canvasStyle }}
      />
    </div>
  )
}
