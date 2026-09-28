import type { CanvasElement } from '../types'

/**
 * Development-only validation for element coordinates.
 * Warns about potential coordinate inconsistencies.
 */
export function validateElementCoords(el: CanvasElement): void {
  if (process.env.NODE_ENV !== 'development') return

  // Warn if offsetX/offsetY are non-zero (should be 0 after init)
  if (el.offsetX !== 0 || el.offsetY !== 0) {
    console.warn(`[Guardrail] Element ${el.uid} has non-zero offsetX/offsetY`, {
      type: el.type,
      offsetX: el.offsetX,
      offsetY: el.offsetY
    })
  }

  // Validate mask coords are within reasonable bounds
  if (el.mask) {
    const maskRight = el.mask.left + el.mask.width
    const maskBottom = el.mask.top + el.mask.height
    const elRight = el.left + el.width
    const elBottom = el.top + el.height

    if (maskRight > elRight * 2 || maskBottom > elBottom * 2) {
      console.warn(`[Guardrail] Mask ${el.uid} may be positioned outside element bounds`)
    }
  }
}

/**
 * Validates all elements in a collection.
 */
export function validateAllElements(elements: CanvasElement[]): void {
  if (process.env.NODE_ENV !== 'development') return
  elements.forEach(validateElementCoords)
}
