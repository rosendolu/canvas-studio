import type { CanvasConfig, TimelineUserConfig } from '../types'

// ================================================================
// Timeline ruler drawing
// (Ported from image-maker/src/utils/canvasUtil.ts)
// ================================================================

const getGridSize = (scale: number): number => {
  const scaleNum = new Map([
    [100, 100], [90, 50], [80, 20], [70, 10],
    [60, 80],  [50, 40], [40, 20], [30, 10],
    [20, 40],  [10, 25], [0, 10],
  ])
  return scaleNum.get(scale) || 100
}

export const getGridPixel = (scale: number, frameCount: number) => {
  const gridPixel = getGridSize(scale)
  let trackWidth = gridPixel * frameCount
  if (scale < 70) trackWidth = trackWidth / 25
  if (scale < 30) trackWidth = trackWidth / 6
  return trackWidth
}

const getStep = (scale: number, frameStep: number) => (scale > 60 ? frameStep : 5)

export const getLongText = (count: number, scale: number) => {
  let time = count
  if (scale < 30) time *= 30
  else if (scale < 70) time *= 5
  const totalMs = time * 1000
  const h = Math.floor(totalMs / 3600000)
  const m = Math.floor((totalMs % 3600000) / 60000)
  const s = Math.floor((totalMs % 60000) / 1000)
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}

const getShortText = (count: number, step: number, scale: number) => {
  const index = count % step
  if (scale < 70) return ''
  return scale > 80 ? (index === 0 ? '' : `${index < 10 ? '0' : ''}${index}f`) : ''
}

export const getSelectFrame = (offsetX: number, scale: number, frameStep: number) => {
  const size = getGridSize(scale)
  if (scale < 70) offsetX *= frameStep
  if (scale < 30) offsetX *= 6
  return Math.round(offsetX / size) + (scale < 70 ? 0 : 1)
}

/**
 * 绘制时间轴标尺（Canvas 2D API）
 */
export const drawTimeLine = (
  context: CanvasRenderingContext2D,
  userConfigs: TimelineUserConfig,
  canvasConfigs: CanvasConfig
) => {
  const { start, scale, step: frameStep, focusPosition } = userConfigs
  const { ratio, bgColor, width, height, textColor, subTextColor, textSize, textScale, focusColor, longColor, shortColor } = canvasConfigs

  const step = getStep(scale, frameStep)
  context.scale(ratio, ratio)
  context.clearRect(0, 0, width, height)
  context.fillStyle = bgColor
  context.fillRect(0, 0, width, height)

  const gridSizeS = getGridSize(scale)
  const gridSizeB = gridSizeS * step
  const startValueS = Math.floor(start / gridSizeS) * gridSizeS
  const startValueB = Math.floor(start / gridSizeB) * gridSizeB
  const offsetXS = startValueS - start
  const offsetXB = startValueB - start
  const endValue = start + Math.ceil(width)
  const lineWidth = 0.5

  if (focusPosition) {
    let fStart = focusPosition.start, fCount = focusPosition.end - focusPosition.start
    if (scale < 70) { fStart = fStart / 25; fCount = fCount / 25 }
    if (scale < 30) { fStart = fStart / 6; fCount = fCount / 6 }
    const focusS = fStart * gridSizeS + lineWidth - start
    const focusW = fCount * gridSizeS - lineWidth
    if (focusW > gridSizeS) {
      context.fillStyle = focusColor
      context.fillRect(focusS, 0, focusW, (height * 3) / 8)
    }
  }

  context.beginPath()
  context.fillStyle = textColor
  context.strokeStyle = longColor
  for (let value = startValueB, count = 0; value < endValue; value += gridSizeB, count++) {
    const x = offsetXB + count * gridSizeB + lineWidth
    context.moveTo(x, 0)
    context.save()
    context.translate(x, height * 0.4)
    context.scale(textScale / ratio, textScale / ratio)
    const text = getLongText(value / gridSizeB, scale)
    const textPositionX = text.length * 5 * textScale * ratio
    const textPositionY = ((textSize / ratio) * textScale) / ratio / 2
    context.fillText(text, textPositionX, textPositionY)
    context.restore()
    context.lineTo(x, (height * 10) / 16 / ratio)
  }
  context.stroke()
  context.closePath()

  context.beginPath()
  context.fillStyle = subTextColor
  context.strokeStyle = shortColor
  for (let value = startValueS, count = 0; value < endValue; value += gridSizeS, count++) {
    const x = offsetXS + count * gridSizeS + lineWidth
    context.moveTo(x, 0)
    const text = getShortText(value / gridSizeS, step, scale)
    if (text) {
      context.save()
      context.translate(x, height * 0.4)
      context.scale(textScale / ratio, textScale / ratio)
      const textPositionX = text.length * 5 * textScale * ratio
      const textPositionY = ((textSize / ratio) * textScale) / ratio / 2
      context.fillText(text, textPositionX, textPositionY)
      context.restore()
    }
    if (value % gridSizeB !== 0) context.lineTo(x, height / 3 / ratio)
  }
  context.stroke()
  context.closePath()
  context.setTransform(1, 0, 0, 1, 0, 0)
}

export const LineItemStyle = ({ scale, start, end }: { scale: number; start: number; end: number }) => {
  const showLeft = getGridPixel(scale, start)
  const showWidth = getGridPixel(scale, end - start)
  return { left: `${showLeft}px`, width: `${showWidth < 5 ? 5 : showWidth}px` }
}

export const getTimeLineWidth = (track: any[], trackScale: number) => {
  let maxEnd = 0
  track?.forEach(item => {
    item?.lineList?.forEach((lineItem: any) => {
      if (lineItem.end > maxEnd) maxEnd = lineItem.end
    })
  })
  return getGridPixel(trackScale, maxEnd) * 1.2
}
