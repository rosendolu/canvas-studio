# Design: Canvas Studio Guardrails

## Architecture Overview

This change completes the defect fixes and adds lightweight guardrails.

```
apps/web/src/components/CanvasPlayer/Player.tsx     ← Transformer attachment refinement
apps/web/src/components/CanvasElements/AvatarElement.tsx  ← Comment verification
packages/canvas-core/src/utils/guardrails.ts        ← New validation utilities (dev-only)
```

---

## Fix 1 — Avatar Transformer Attachment

### Current Logic (main branch)
```ts
if (String(active?.attrs?.name || '').endsWith('bubbleText')) {
  const activeGroup = stageRef.current?.findOne(`#${activeUid}$$group`)
  active = activeGroup
}
```

### PR #18 Enhancement
```ts
// Fix: For bubbleText and avatar elements, attach transformer to the group
const activeObj = elements.find(el => el.uid === activeUid)
if (activeObj?.type === 'bubbleText' || activeObj?.type === 'avatar') {
  const activeGroup = stageRef.current?.findOne(`#${activeUid}$$group`)
  active = activeGroup
}
```

### Decision
**Adopt PR #18 approach** — more explicit type check rather than name-based detection.

---

## Fix 2 — AvatarElement Comment

Update comment to reflect actual sync behavior:
```ts
// Before: - group dragEnd  → updates item.offsetX / item.offsetY (Player.tsx)
// After:  - group dragEnd  → updates item.left / item.top (Player.tsx)
```

---

## Guardrails — New Validation Layer

### Purpose
Catch coordinate inconsistencies during development.

### Implementation
```ts
// packages/canvas-core/src/utils/guardrails.ts
export function validateElementCoords(el: CanvasElement): void {
  if (process.env.NODE_ENV !== 'development') return
  
  // Warn if offsetX/offsetY are non-zero (should be 0 after init)
  if (el.offsetX !== 0 || el.offsetY !== 0) {
    console.warn(`[Guardrail] Element ${el.uid} has non-zero offsetX/offsetY`, {
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
```

### Usage
Call in development mode after element updates:
```ts
import { validateElementCoords } from '@canvas-studio/canvas-core'

// In store or Player.tsx
onSyncPos(uid, updates) {
  // ... apply updates
  validateElementCoords(updatedElement)
}
```

---

## Files Changed

| File | Change |
|------|--------|
| `Player.tsx` | Refine transformer attachment (type check vs name check) |
| `AvatarElement.tsx` | Update comment |
| `guardrails.ts` | New validation utilities |

## Testing

1. **Manual**: Drag avatar element → verify transformer attaches to group
2. **Manual**: Resize canvas → verify mask stays in position
3. **Dev mode**: Check console for guardrail warnings

---

## No Breaking Changes
- All changes are additive or clarifying
- Existing saved canvases continue to work
