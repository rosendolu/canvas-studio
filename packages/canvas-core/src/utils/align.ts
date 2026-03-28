import type { CanvasElement } from '../types'

export type AlignMode =
  | 'left' | 'centerH' | 'right'
  | 'top' | 'centerV' | 'bottom'
  | 'distributeH' | 'distributeV'

export type AlignBasis = 'canvas' | 'selection'

interface AlignOptions {
  canvasWidth: number
  canvasHeight: number
  basis?: AlignBasis
}

/**
 * Align or distribute a subset of elements.
 * Returns a new array of ALL elements (only the selected ones are mutated).
 */
export function alignElements(
  allElements: CanvasElement[],
  selectedUids: string[],
  mode: AlignMode,
  opts: AlignOptions,
): CanvasElement[] {
  const { canvasWidth, canvasHeight, basis = 'canvas' } = opts
  const selected = allElements.filter(e => selectedUids.includes(e.uid))
  if (selected.length < 2 && !['left', 'centerH', 'right', 'top', 'centerV', 'bottom'].includes(mode)) return allElements
  if (selected.length === 0) return allElements

  // Compute bounding box of selection
  const minL = Math.min(...selected.map(e => e.left))
  const minT = Math.min(...selected.map(e => e.top))
  const maxR = Math.max(...selected.map(e => e.left + e.width * Math.abs(e.scaleX)))
  const maxB = Math.max(...selected.map(e => e.top + e.height * Math.abs(e.scaleY)))
  const selW = maxR - minL
  const selH = maxB - minT

  // Reference rect: canvas or selection bbox
  const refL = basis === 'canvas' ? 0 : minL
  const refT = basis === 'canvas' ? 0 : minT
  const refW = basis === 'canvas' ? canvasWidth : selW
  const refH = basis === 'canvas' ? canvasHeight : selH

  const updates = new Map<string, Partial<CanvasElement>>()

  if (mode === 'left') {
    selected.forEach(e => updates.set(e.uid, { left: refL }))
  } else if (mode === 'right') {
    selected.forEach(e => updates.set(e.uid, { left: refL + refW - e.width * Math.abs(e.scaleX) }))
  } else if (mode === 'centerH') {
    selected.forEach(e => updates.set(e.uid, { left: refL + refW / 2 - (e.width * Math.abs(e.scaleX)) / 2 }))
  } else if (mode === 'top') {
    selected.forEach(e => updates.set(e.uid, { top: refT }))
  } else if (mode === 'bottom') {
    selected.forEach(e => updates.set(e.uid, { top: refT + refH - e.height * Math.abs(e.scaleY) }))
  } else if (mode === 'centerV') {
    selected.forEach(e => updates.set(e.uid, { top: refT + refH / 2 - (e.height * Math.abs(e.scaleY)) / 2 }))
  } else if (mode === 'distributeH' && selected.length >= 3) {
    const sorted = [...selected].sort((a, b) => a.left - b.left)
    const totalW = sorted.reduce((s, e) => s + e.width * Math.abs(e.scaleX), 0)
    const gap = (maxR - minL - totalW) / (sorted.length - 1)
    let cursor = minL
    sorted.forEach(e => {
      updates.set(e.uid, { left: cursor })
      cursor += e.width * Math.abs(e.scaleX) + gap
    })
  } else if (mode === 'distributeV' && selected.length >= 3) {
    const sorted = [...selected].sort((a, b) => a.top - b.top)
    const totalH = sorted.reduce((s, e) => s + e.height * Math.abs(e.scaleY), 0)
    const gap = (maxB - minT - totalH) / (sorted.length - 1)
    let cursor = minT
    sorted.forEach(e => {
      updates.set(e.uid, { top: cursor })
      cursor += e.height * Math.abs(e.scaleY) + gap
    })
  }

  return allElements.map(e => {
    const patch = updates.get(e.uid)
    return patch ? { ...e, ...patch } : e
  })
}
