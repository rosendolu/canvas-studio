import Konva from 'konva'
import type { CanvasElement, ExportOptions } from '../types'

// ================================================================
// Canvas export utilities
// (Ported from image-maker/src/helpers/canvasToImage.ts)
// ================================================================

const WEBP_SUFFIX = '?imageView2/2/format/webp'

function drawElements(el: CanvasElement, layer: Konva.Layer): Promise<void> {
  return new Promise(async (resolve) => {
    if (el.type === 'avatar') {
      const group = new Konva.Group()
      if (el.mask?.type) {
        group.clipFunc(ctx => {
          ctx.arc(
            el.mask!.left + el.offsetX,
            el.mask!.top + el.offsetY,
            (el.mask!.width / 2) * el.mask!.scaleX,
            0, Math.PI * 2, false
          )
        })
      }
      Konva.Image.fromURL(el.src + WEBP_SUFFIX, (ImageShape: any) => {
        ImageShape.setAttrs({
          x: el.left + el.offsetX,
          y: el.top + el.offsetY,
          fill: el.mask?.background || 'transparent',
          width: el.width,
          height: el.height,
          scaleX: el.scaleX,
          scaleY: el.scaleY,
        })
        group.add(ImageShape)
        resolve()
      })
      layer.add(group)

    } else if (el.type === 'bubbleText') {
      if (el.src) {
        await new Promise<void>(resolve2 => {
          Konva.Image.fromURL(el.src + WEBP_SUFFIX, (ImageShape: any) => {
            ImageShape.setAttrs({
              x: el.left + el.offsetX,
              y: el.top + el.offsetY,
              width: el.width,
              height: el.height,
              rotation: el.rotation || 0,
              scaleX: el.scaleX,
              scaleY: el.scaleY,
            })
            layer.add(ImageShape)
            resolve2()
          })
        })
      }
      const text = new Konva.Text({
        text: el.text || '',
        x: el.left + el.offsetX,
        y: el.top + el.offsetY,
        width: el.width,
        height: el.height,
        scaleX: el.scaleX,
        scaleY: el.scaleY,
        rotation: el.rotation || 0,
        fontSize: el.fontSize || 12,
        fontFamily: el.fontFamily || 'sans-serif',
        align: 'center',
        verticalAlign: 'middle',
        fill: el.color || '#fff',
      })
      layer.add(text)
      resolve()

    } else if (el.type === 'slideshow') {
      const firstSrc = el.imageList?.[0]?.src
      if (firstSrc) {
        Konva.Image.fromURL(firstSrc + WEBP_SUFFIX, (ImageShape: any) => {
          ImageShape.setAttrs({ x: el.left, y: el.top, rotation: el.rotation || 0, width: el.width, height: el.height, scaleX: el.scaleX, scaleY: el.scaleY })
          layer.add(ImageShape)
          resolve()
        })
      } else { resolve() }

    } else if (['background', 'background-video', 'sticker', 'picture-scrolling', 'product'].includes(el.type)) {
      if (el.src) {
        Konva.Image.fromURL(el.src + WEBP_SUFFIX, (ImageShape: any) => {
          ImageShape.setAttrs({ x: el.left, y: el.top, rotation: el.rotation || 0, width: el.width, height: el.height, scaleX: el.scaleX, scaleY: el.scaleY })
          layer.add(ImageShape)
          resolve()
        })
      } else { resolve() }

    } else {
      const rect = new Konva.Rect({
        x: el.left, y: el.top,
        fill: (el as any).bgColor || 'transparent',
        rotation: el.rotation || 0,
        width: el.width, height: el.height,
        scaleX: el.scaleX || 1, scaleY: el.scaleY || 1,
      })
      layer.add(rect)
      resolve()
    }
  })
}

/**
 * 将 Canvas 元素列表导出为图片 (dataURL 或 Blob)
 */
export async function exportToImage(options: ExportOptions): Promise<string | Blob> {
  const { width, height, elements, type = 'dataURL' } = options
  const stage = new Konva.Stage({
    container: document.createElement('div'),
    width,
    height,
  })
  const layer = new Konva.Layer()
  for (const el of elements) {
    await drawElements(el, layer)
  }
  stage.add(layer)
  layer.draw()
  if (type === 'blob') {
    return stage.toBlob() as Promise<Blob>
  }
  return stage.toDataURL() as string
}
