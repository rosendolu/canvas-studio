## Why

The canvas player has coordinate system inconsistencies causing visible user-facing defects:

1. **Avatar elements jump after drag** — the `syncPosToState` function stores position inconsistently for avatar groups
2. **Mask positions drift during orientation changes** — the `changeOrientation` function incorrectly adds `el.offsetX` to mask coordinates
3. **Transformer dimensions captured incorrectly** — the width/height capture happens before resolving the correct active node for bubbleText and avatar elements
4. **"Picture" element type fails to render** — the `RenderElement` function doesn't handle the "picture" type, showing "unknown element type" error

These defects affect all Canvas Studio users in both video editor and image editor modes, causing visible glitches that erode user trust.

## What Changes

- Fix `syncPosToState` in `Player.tsx` to consistently store `left/top` for all element types including avatar groups
- Fix `changeOrientation` in `element.ts` to remove incorrect `el.offsetX` addition in mask coordinate calculation
- Fix Transformer dimension capture order in `Player.tsx` — capture dimensions AFTER resolving the correct active node for bubbleText/avatar elements
- Add "picture" type to `RenderElement` matcher in `Player.tsx`

## Capabilities

### Modified Capabilities

- `canvas-player`: Consistent coordinate handling across all element types, eliminating drift and jump behaviors

## Impact

- **Frontend (apps/web)**: Surgical fixes to `Player.tsx` and `element.ts` utilities
- **Backend**: No changes required
- **Shared (packages/canvas-core)**: Fix to `element.ts` utility function
