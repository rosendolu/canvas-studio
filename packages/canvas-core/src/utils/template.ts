import { nanoid } from 'nanoid'
import type {
  CanvasElement,
  SceneTemplatePayload,
  OverlayTemplatePayload,
  RemapResult,
} from '../types'

/**
 * Remap all element UIDs to fresh IDs.
 * Returns remapped elements + idMap (old → new).
 */
export function remapElementIds(elements: CanvasElement[]): RemapResult {
  const idMap: Record<string, string> = {}
  const remapped = elements.map(el => {
    const newUid = nanoid()
    idMap[el.uid] = newUid
    return { ...el, uid: newUid }
  })
  return { elements: remapped, idMap }
}

/**
 * Apply a scene template payload to a canvas.
 * Mode "replace": returns the template elements (with new IDs).
 * Mode "merge": merges into existing elements (all get new IDs).
 */
export function applySceneTemplate(
  payload: SceneTemplatePayload,
  existingElements: CanvasElement[],
  mode: 'replace' | 'merge',
): CanvasElement[] {
  const { elements: remapped } = remapElementIds(payload.elements)
  if (mode === 'replace') return remapped
  return [...existingElements, ...remapped]
}

/**
 * Apply an overlay template payload by merging its elements (with new IDs).
 */
export function applyOverlayTemplate(
  payload: OverlayTemplatePayload,
  existingElements: CanvasElement[],
): CanvasElement[] {
  const { elements: remapped } = remapElementIds(payload.elements)
  return [...existingElements, ...remapped]
}

/**
 * Extract an overlay payload from a selection of element UIDs.
 */
export function extractOverlayPayload(
  elements: CanvasElement[],
  selectedUids: string[],
): OverlayTemplatePayload {
  const selected = elements.filter(el => selectedUids.includes(el.uid))
  return { elements: selected.map(el => ({ ...el })) }
}

/**
 * Extract a scene payload from current canvas state.
 */
export function extractScenePayload(
  elements: CanvasElement[],
  aspectRatio: string,
  bgColor: string,
): SceneTemplatePayload {
  return {
    aspectRatio,
    bgColor,
    elements: elements.map(el => ({ ...el })),
  }
}
