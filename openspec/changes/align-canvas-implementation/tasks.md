# Tasks: Align Canvas Player Implementation

## Implementation Order

Dependencies: Fix 1 → Fix 2 → Fix 3 (element.ts fixes are independent of Player.tsx fixes)

---

## Task 1 — Fix `syncPosToState` group coordinate storage
**File**: `apps/web/src/components/CanvasPlayer/Player.tsx`  
**Function**: `syncPosToState`

**Change**: In the `shapeType === 'group'` non-bubbleText branch, replace `offsetX/offsetY` with `left/top`:

```diff
 } else if (shapeType === 'group') {
   if (String(target?.attrs?.name || '').endsWith('bubbleText')) {
     updates.left = left
     updates.top = top
   } else {
-    // non-bubbleText group (avatar): store as offsetX/offsetY
-    updates.offsetX = left || 0
-    updates.offsetY = top || 0
+    // avatar group drag: store as left/top (consistent with AvatarElement Group x/y binding)
+    updates.left = left
+    updates.top = top
   }
```

**Test**: Drag an avatar element → release → verify it stays at the dropped position on re-render.

---

## Task 2 — Fix Transformer mirror rect width capture order
**File**: `apps/web/src/components/CanvasPlayer/Player.tsx`  
**Function**: Transformer `useEffect`

**Change**: Move `w/h/scale/position` capture to after the bubbleText group reassignment:

```diff
 let active = stageRef.current?.findOne(`#${activeUid}`)
 
-let w = active?.width(),
-    h = active?.height(),
-    scale = active?.scale(),
-    position = active?.position()
-
 if (String(active?.attrs?.name || '').endsWith('bubbleText')) {
   const activeGroup = stageRef.current?.findOne(`#${activeUid}$$group`)
   active = activeGroup
-  scale = active?.scale()
-  position = active?.position()
 }
 
+const w = active?.width()
+const h = active?.height()
+const scale = active?.scale()
+const position = active?.position()
```

**Test**: Select a bubbleText element → transformer border appears correctly around the group.

---

## Task 3 — Add `picture` type to `RenderElement`
**File**: `apps/web/src/components/CanvasPlayer/Player.tsx`  
**Function**: `RenderElement`

```diff
-if (/background|sticker|product/.test(item.type)) return <StaticImage item={item} />
+if (/background|sticker|product|picture/.test(item.type)) return <StaticImage item={item} />
```

**Test**: Add a `picture` type element → verify it renders as StaticImage (not red error text).

---

## Task 4 — Fix `changeOrientation` mask coordinate calculation
**File**: `packages/canvas-core/src/utils/element.ts`  
**Function**: `changeOrientation`

```diff
 if (el.mask) {
-  el.mask.left = ((el.mask.left + el.offsetX + el.mask.offsetX) / prevCanvasWidth) * canvasWidth
-  el.mask.top  = ((el.mask.top  + el.offsetY + el.mask.offsetX) / prevCanvasHeight) * canvasHeight
+  el.mask.left = ((el.mask.left + el.mask.offsetX) / prevCanvasWidth) * canvasWidth
+  el.mask.top  = ((el.mask.top  + el.mask.offsetY) / prevCanvasHeight) * canvasHeight
   el.mask.offsetX = 0
   el.mask.offsetY = 0
 }
```

**Test**: Place an avatar with mask → switch aspect ratio (e.g. 16:9 → 9:16) → verify mask circle stays at correct relative position on the image.

---

## Task 5 — Remove `offsetX/offsetY` scaling from `fitCanvasResize`
**File**: `packages/canvas-core/src/utils/element.ts`  
**Function**: `fitCanvasResize`

```diff
 export function fitCanvasResize(el: CanvasElement, ratio: number) {
   el.scaleX *= ratio
   el.scaleY *= ratio
   el.left *= ratio
   el.top *= ratio
-  el.offsetX *= ratio
-  el.offsetY *= ratio
 
   if (el.mask) {
```

**Test**: Resize the canvas container → verify all elements scale proportionally, no position jump.

---

## Task 6 — Build and verify
```bash
cd apps/web && node_modules/vite/bin/vite.js build
```
- Confirm `✓ built` with no errors
- Restart static server
- Manual smoke test: video editor + image editor both load, avatar drag + mask + orientation change work

---

## Task 7 — Commit and push to feature branch
```bash
git checkout master && git pull --ff-only origin master
git switch -c feature/align-canvas-implementation
git add packages/canvas-core/src/utils/element.ts \
         apps/web/src/components/CanvasPlayer/Player.tsx
git commit -m "fix: align canvas implementation across video and image editor

- syncPosToState: avatar group drag stores left/top (not offsetX/offsetY)
- Transformer useEffect: capture w/h/scale/position after group reassignment
- RenderElement: add 'picture' type to StaticImage matcher
- changeOrientation: fix mask coord calc (remove el.offsetX from mask formula)
- fitCanvasResize: remove offsetX/offsetY scaling (always 0 post-init)"
git push -u origin feature/align-canvas-implementation
```

---

## Task 8 — Open PR
```bash
gh pr create \
  --base master \
  --head feature/align-canvas-implementation \
  --title "fix: align canvas implementation across video and image editor" \
  --body "..."
```

---

## Summary

| Task | File | Risk |
|------|------|------|
| 1. syncPosToState group → left/top | Player.tsx | Low |
| 2. Transformer w capture order | Player.tsx | Low |
| 3. Add `picture` to RenderElement | Player.tsx | Low |
| 4. changeOrientation mask coords | element.ts | Medium |
| 5. fitCanvasResize remove offsetX/Y | element.ts | Low |
| 6. Build + smoke test | — | — |
| 7. Commit + push | — | — |
| 8. Open PR | — | — |
