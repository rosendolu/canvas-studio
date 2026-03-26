# Proposal: Align Canvas Player Implementation Between Video Editor and Image Editor

## What

Identify and resolve implementation gaps between the canvas player used in the **Video Editor** (`EditorPage` + `editorStore`) and the **Image Editor** (`ImageEditorPage` + `liveStore`), and align both to a consistent, correct canvas implementation standard covering:

- Transformer selection behavior (mirror rect sync, deps)
- `syncPosToState` coordinate semantics (`offsetX/offsetY` vs `left/top` for group elements)
- Element initial sizing (`initElementPos`) accuracy
- `AvatarElement` group coordinate system consistency
- `changeOrientation` / `fitCanvasResize` coordinate calculation correctness with `offsetX/offsetY`

## Why

### Current Problems

**1. `AvatarElement` group coordinate mismatch**
`AvatarElement` renders its `<Group>` at `x={item.left} y={item.top}`, but `syncPosToState` (in `Player.tsx`) stores drag result as `offsetX/offsetY` for non-bubbleText groups. After the first drag, `item.left` retains the original position while `item.offsetX/offsetY` holds the delta — but the Group reads `item.left`, so the element jumps back on re-render.

**2. `changeOrientation` uses `item.offsetX` in mask coordinate calculation incorrectly**
In `element.ts`, `changeOrientation` computes:
```ts
el.mask.left = ((el.mask.left + el.offsetX + el.mask.offsetX) / prevCanvasWidth) * canvasWidth
```
`el.offsetX` is the Group's position delta (not the image's offset) — mixing it into mask coordinates produces wrong mask position after orientation change.

**3. `fitCanvasResize` applies `ratio` to `offsetX/offsetY`**
When `offsetX/offsetY` are used as positional deltas (avatar group drag), scaling them as if they were visual offsets causes double-scaling artifacts.

**4. Transformer mirror rect `w` check may skip sync**
```ts
if (w) {  // w is active.width() before group reassignment
```
After the `bubbleText` branch reassigns `active = activeGroup`, `w` still holds the original node's width — may not represent the Group's actual width, causing `shape` sync to be skipped silently.

**5. `picture` element type not handled in `RenderElement`**
The regex `/background|sticker|product/` misses `picture` type, falling through to the red "未知元素类型" text.

**6. Video editor and image editor diverge in active-element update dispatch**
- `EditorPage` dispatches `setActiveUid` (sets `chooseDataUid`)
- `ImageEditorPage` dispatches `activeElement` (sets `activeElementsUid`)

Both use the same `CanvasPlayer` / `Player`, but the store action names differ with no shared abstraction — making future refactors error-prone.

### Impact

| Issue | Video Editor | Image Editor |
|-------|-------------|--------------|
| Avatar group coordinate mismatch | ✅ Affected | ✅ Affected |
| changeOrientation mask coords | ✅ Affected | ✅ Affected |
| fitCanvasResize offsetX/offsetY | ✅ Affected | ✅ Affected |
| Transformer mirror rect w-check | ✅ Affected | ✅ Affected |
| `picture` type unhandled | ✅ Affected | ✅ Affected |

## Non-Goals

- Rewriting state management (editorStore / liveStore merge)
- Adding new element types
- Video export / rendering pipeline changes
- Mobile/touch support improvements
