# Tasks: Canvas Studio Guardrails

## Task 1 — Refine Avatar Transformer Attachment
**File**: `apps/web/src/components/CanvasPlayer/Player.tsx`

**Change**: Replace name-based detection with type-based detection:

```diff
-    if (String(active?.attrs?.name || '').endsWith('bubbleText')) {
+    // Fix: For bubbleText and avatar elements, attach transformer to the group
+    const activeObj = elements.find(el => el.uid === activeUid)
+    if (activeObj?.type === 'bubbleText' || activeObj?.type === 'avatar') {
       const activeGroup = stageRef.current?.findOne(`#${activeUid}$$group`)
       active = activeGroup
     }
```

**Test**: Select avatar element → verify transformer border appears around the group (not the image).

---

## Task 2 — Update AvatarElement Comment
**File**: `apps/web/src/components/CanvasElements/AvatarElement.tsx`

**Change**: Update comment to reflect actual sync behavior:

```diff
  * syncPosToState flow:
-  *   - group dragEnd  → updates item.offsetX / item.offsetY (Player.tsx)
+  *   - group dragEnd  → updates item.left / item.top (Player.tsx)
```

---

## Task 3 — Create Guardrails Utility
**File**: `packages/canvas-core/src/utils/guardrails.ts` (new file)

**Content**:
```ts
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
```

---

## Task 4 — Export Guardrails
**File**: `packages/canvas-core/src/utils/index.ts` (or create if needed)

**Change**: Add export for guardrails:

```ts
export { validateElementCoords, validateAllElements } from './guardrails'
```

---

## Task 5 — Build and Verify
```bash
cd apps/web && npm run build
```
- Confirm build succeeds
- Manual smoke test: avatar drag + mask + orientation change

---

## Task 6 — Commit and Push
```bash
git checkout main && git pull --ff-only origin main
git switch -c feature/iterate-automatically-guardrails
# ... make changes ...
git add -A
git commit -m "fix: complete canvas coordinate guardrails

- Refine avatar transformer attachment (type-based vs name-based)
- Update AvatarElement comment to reflect left/top sync
- Add development guardrails for coordinate validation
- Validate element coords to catch drift early"
git push -u origin feature/iterate-automatically-guardrails
```

---

## Task 7 — Open PR
```bash
gh pr create \
  --base main \
  --head feature/iterate-automatically-guardrails \
  --title "fix: complete canvas coordinate guardrails" \
  --body "Completes the defect fixes for canvas coordinate alignment and adds development guardrails.

## Changes
- Refine transformer attachment to use type check (avatar/bubbleText)
- Update AvatarElement comment for accuracy
- Add guardrails.ts for development-time coordinate validation

## Testing
- Manual: Avatar drag, mask stability, orientation change
- Dev mode: Check console for guardrail warnings

Related: PR #18, OpenSpec iterate-automatically"
```

---

## Summary

| Task | File | Risk |
|------|------|------|
| 1. Transformer attachment | Player.tsx | Low |
| 2. Comment update | AvatarElement.tsx | None |
| 3. Guardrails utility | guardrails.ts (new) | Low |
| 4. Export guardrails | index.ts | None |
| 5. Build + test | — | — |
| 6. Commit + push | — | — |
| 7. Open PR | — | — |
