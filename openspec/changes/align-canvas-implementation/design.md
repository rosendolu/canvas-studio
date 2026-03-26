# Design: Align Canvas Player Implementation

## Architecture Overview

All fixes are **surgical edits** — no component restructuring or store refactoring. Changes touch three files:

```
packages/canvas-core/src/utils/element.ts     ← changeOrientation, fitCanvasResize
apps/web/src/components/CanvasPlayer/Player.tsx ← syncPosToState, Transformer useEffect, RenderElement
apps/web/src/components/CanvasElements/AvatarElement.tsx ← Group x/y coordinate binding
```

---

## Fix 1 — `AvatarElement` Group coordinate binding

### Problem
Group renders at `x={item.left} y={item.top}`, but after drag `syncPosToState` stores `offsetX/offsetY`. On re-render the Group snaps back to `item.left`.

### Decision
**Option A** — Group uses `x={item.left + (item.offsetX || 0)} y={item.top + (item.offsetY || 0)}`  
**Option B** — `syncPosToState` stores back into `left/top` for avatar group (drop `offsetX/offsetY` pattern)  

**Chosen: Option B** — cleaner state model; `offsetX/offsetY` on Group has no Konva semantics advantage here. Aligns with `bubbleText` group which already stores `left/top`.

### Change
`Player.tsx` `syncPosToState`, group non-bubbleText branch:
```ts
// Before
updates.offsetX = left || 0
updates.offsetY = top || 0

// After
updates.left = left
updates.top = top
```

`AvatarElement.tsx` Group x/y stays `x={item.left} y={item.top}` — no change needed.

---

## Fix 2 — `changeOrientation` mask coordinate calculation

### Problem
```ts
el.mask.left = ((el.mask.left + el.offsetX + el.mask.offsetX) / prevCanvasWidth) * canvasWidth
```
`el.offsetX` is not a visual offset on the mask — it's the Group's positional delta from dragging. Adding it to mask coordinates is wrong.

### Change
`element.ts` `changeOrientation`:
```ts
// Before
el.mask.left = ((el.mask.left + el.offsetX + el.mask.offsetX) / prevCanvasWidth) * canvasWidth
el.mask.top  = ((el.mask.top  + el.offsetY + el.mask.offsetX) / prevCanvasHeight) * canvasHeight

// After
el.mask.left = ((el.mask.left + el.mask.offsetX) / prevCanvasWidth) * canvasWidth
el.mask.top  = ((el.mask.top  + el.mask.offsetY) / prevCanvasHeight) * canvasHeight
```

Also the element center calculation uses `el.offsetX/offsetY` which after Fix 1 are always 0, so that formula remains unchanged (it degrades correctly to `el.left + el.width/2`).

---

## Fix 3 — `fitCanvasResize` should not scale `offsetX/offsetY`

### Problem
After Fix 1, `offsetX/offsetY` are always 0 for avatar. But `fitCanvasResize` still multiplies them by ratio — benign but misleading.

### Change
`element.ts` `fitCanvasResize`: remove `offsetX/offsetY` scaling lines (they're 0 post-Fix-1, but removal clarifies intent).

```ts
// Remove these two lines:
el.offsetX *= ratio
el.offsetY *= ratio
```

---

## Fix 4 — Transformer mirror rect width check

### Problem
```ts
let w = active?.width()   // captures width before possible group reassignment
// ... later reassigns active to group
if (w) { shape.position(position); shape.width(w); ... }
```
`w` may be undefined or wrong if the original `active` node is a Group (width=0 until children render).

### Change
`Player.tsx` Transformer `useEffect`: move `w/h/scale/position` capture **after** the bubbleText branch:

```ts
let active = stageRef.current?.findOne(`#${activeUid}`)

if (String(active?.attrs?.name || '').endsWith('bubbleText')) {
  active = stageRef.current?.findOne(`#${activeUid}$$group`)
}

// Capture AFTER final active resolution
const w = active?.width()
const h = active?.height()
const scale = active?.scale()
const position = active?.position()

if (active && w) {
  shape.position(position); shape.width(w); ...
}
```

---

## Fix 5 — `picture` element type in `RenderElement`

### Change
`Player.tsx` `RenderElement`:
```ts
// Before
if (/background|sticker|product/.test(item.type)) return <StaticImage item={item} />

// After
if (/background|sticker|product|picture/.test(item.type)) return <StaticImage item={item} />
```

---

## Data Flow Summary

```
User drags avatar Group
  → onDragEnd → syncPosToState (Player.tsx)
    → shapeType === 'group', name ends 'avatarXXX' (not bubbleText)
    → updates.left = left; updates.top = top     ← Fix 1
  → onSyncPos → store dispatch → item.left/top updated
  → React re-render → AvatarElement Group x={item.left} y={item.top} ✅ correct

User changes orientation
  → changeOrientation(el, options)
    → mask.left = ((mask.left + mask.offsetX) / prevW) * newW  ← Fix 2
    → mask.offsetX = 0  (reset as before)
    → el center = (el.left + el.width/2) / prevW * newW  ✅ offsetX=0 now
```

---

## Files Changed

| File | Change |
|------|--------|
| `packages/canvas-core/src/utils/element.ts` | Fix 2 (changeOrientation mask coords) + Fix 3 (remove offsetX/offsetY scaling) |
| `apps/web/src/components/CanvasPlayer/Player.tsx` | Fix 1 (syncPosToState group→left/top) + Fix 4 (w capture order) + Fix 5 (picture type) |
| `apps/web/src/components/CanvasElements/AvatarElement.tsx` | No change needed (Group already uses item.left/top) |

## No Breaking Changes
- All state fields (`left`, `top`, `offsetX`, `offsetY`) remain in `CanvasElement` type
- `offsetX/offsetY` stay at 0 after init — no stored data migration needed
- Both `EditorPage` and `ImageEditorPage` share `Player.tsx` — fixes apply to both
