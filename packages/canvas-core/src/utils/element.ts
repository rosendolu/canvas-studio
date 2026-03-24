import type { CanvasElement } from '../types'

// ================================================================
// Element position / size utilities
// (Ported from image-maker/utils/player.ts & nnk-live/tool.ts)
// ================================================================

/**
 * 初始化元素位置，默认居中
 * - background: cover 模式铺满画布
 * - 其他元素: contain 模式居中，不超过画布
 */
export function initElementPos(el: CanvasElement, pos: { width: number; height: number }) {
  const { width: canvasWidth, height: canvasHeight } = pos
  const ratio = el.originalWidth / el.originalHeight

  if (/background/.test(el.type)) {
    // cover: 铺满，可能超出画布
    const maxScale = Math.max(canvasWidth / el.originalWidth, canvasHeight / el.originalHeight)
    el.width = el.originalWidth * maxScale
    el.height = el.width / ratio
  } else if (el.type === 'sticker') {
    // contain in canvas, max width 40% of canvas
    const containScale = Math.min(canvasWidth / el.originalWidth, canvasHeight / el.originalHeight)
    el.width = Math.min(el.originalWidth * containScale, canvasWidth * 0.4)
    el.height = el.width / ratio
  } else if (el.type === 'bubbleText') {
    el.width = Math.min(el.originalWidth, canvasWidth * 0.4)
    el.height = el.width / ratio
    el.height = Math.max(el.height, 50)
    el.width = el.height * ratio
  } else if (el.type === 'avatar') {
    // contain: fit inside canvas
    const containScale = Math.min(canvasWidth / el.originalWidth, canvasHeight / el.originalHeight)
    el.width = el.originalWidth * containScale * 0.5
    el.height = el.width / ratio
  } else {
    // generic: contain
    const containScale = Math.min(canvasWidth / el.originalWidth, canvasHeight / el.originalHeight)
    el.width = el.originalWidth * containScale
    el.height = el.width / ratio
  }

  el.scaleX = 1
  el.scaleY = 1
  // Center horizontally, center vertically (avatar bottom-aligned)
  el.left = (canvasWidth - el.width) / 2
  el.top = el.type === 'avatar'
    ? canvasHeight - el.height
    : (canvasHeight - el.height) / 2

  // Set offsetX/offsetY to center so Konva scales from center
  el.offsetX = el.width / 2
  el.offsetY = el.height / 2
  // Adjust left/top to compensate for offset (Konva: x = left + offsetX)
  el.left = el.left + el.offsetX
  el.top = (el.type === 'avatar'
    ? canvasHeight - el.height
    : (canvasHeight - el.height) / 2) + el.offsetY
}

/**
 * Canvas 区域大小变化时，等比缩放所有元素
 */
export function fitCanvasResize(el: CanvasElement, ratio: number) {
  el.scaleX *= ratio
  el.scaleY *= ratio
  el.left *= ratio
  el.top *= ratio
  el.offsetX *= ratio
  el.offsetY *= ratio

  if (el.mask) {
    el.mask.scaleX *= ratio
    el.mask.scaleY *= ratio
    el.mask.left *= ratio
    el.mask.top *= ratio
  }
}

/**
 * 横竖屏切换，重新计算元素位置和比例
 */
export function changeOrientation(
  el: CanvasElement,
  options: {
    prevWidth: number
    prevHeight: number
    width: number
    height: number
  }
) {
  const { prevWidth: prevCanvasWidth, prevHeight: prevCanvasHeight, width: canvasWidth, height: canvasHeight } = options
  const ratio = el.originalWidth / el.originalHeight
  const maxScale = Math.max(canvasWidth / el.originalWidth, canvasHeight / el.originalHeight)

  const prevWidth = (el.width = el.width * el.scaleX)
  const prevHeight = (el.height = el.height * el.scaleY)

  if (/background/.test(el.type)) {
    el.width = el.originalWidth * maxScale
    el.height = el.width / ratio
  } else {
    el.height = (el.height / prevCanvasHeight) * canvasHeight
    el.width = ratio * el.height

    if (el.mask) {
      el.mask.width = el.mask.width * el.mask.scaleX
      el.mask.height = el.mask.height * el.mask.scaleY
      el.mask.scaleX = 1
      el.mask.scaleY = 1
      const maskRatio = el.mask.width / el.mask.height
      el.mask.height = (el.mask.height / prevCanvasHeight) * canvasHeight
      el.mask.width = maskRatio * el.mask.height
    }
  }

  el.left = ((el.left + el.offsetX + prevWidth / 2) / prevCanvasWidth) * canvasWidth - el.width / 2
  el.top = ((el.top + el.offsetY + prevHeight / 2) / prevCanvasHeight) * canvasHeight - el.height / 2

  if (el.mask) {
    el.mask.left = ((el.mask.left + el.offsetX + el.mask.offsetX) / prevCanvasWidth) * canvasWidth
    el.mask.top = ((el.mask.top + el.offsetY + el.mask.offsetX) / prevCanvasHeight) * canvasHeight
    el.mask.offsetX = 0
    el.mask.offsetY = 0
  }

  el.offsetX = 0
  el.offsetY = 0
  el.scaleX = 1
  el.scaleY = 1
}

/**
 * 根据宽高比计算实际渲染尺寸（fit inside container）
 */
export function aspectRatioRenderSize(aspectRatio: string, width: number, height: number) {
  const [w, h] = aspectRatio.split(/[：:]/).map(Number)
  const scale = Math.min(width / w, height / h)
  return { width: w * scale, height: scale * h }
}

/**
 * contain-fit scale helper (used in Slide transitions)
 */
export function containScale(
  container: { width: number; height: number },
  image: { width: number; height: number }
) {
  const scale = Math.min(container.width / image.width, container.height / image.height)
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  const offsetX = (container.width - drawWidth) / 2
  const offsetY = (container.height - drawHeight) / 2
  return { offsetX, offsetY, drawWidth, drawHeight }
}

/**
 * 创建默认元素属性
 */
export function createDefaultElement(type: CanvasElement['type'], overrides: Partial<CanvasElement> = {}): CanvasElement {
  return {
    uid: '',
    type,
    src: '',
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    originalWidth: 0,
    originalHeight: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    offsetX: 0,
    offsetY: 0,
    visible: true,
    ...overrides,
  }
}
