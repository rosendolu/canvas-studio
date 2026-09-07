## 1. Fix syncPosToState for avatar group positioning

- [x] 1.1 Review current `syncPosToState` logic in `Player.tsx` for avatar group handling
- [x] 1.2 Ensure avatar group drag stores `left/top` consistently (remove any offsetX/offsetY handling)
- [x] 1.3 Verify bubbleText group handling remains correct

**Note**: Code already correctly stores `left/top` for avatar groups. No changes needed.

## 2. Fix changeOrientation mask coordinate calculation

- [x] 2.1 Review `changeOrientation` in `packages/canvas-core/src/utils/element.ts`
- [x] 2.2 Remove incorrect `el.offsetX` addition in mask coordinate calculation
- [x] 2.3 Ensure mask `left/top` are calculated correctly during orientation change

**Fixed**: Removed `+ el.mask.offsetX` and `+ el.mask.offsetY` from mask coordinate calculation in `changeOrientation`. Mask coordinates are now purely absolute positions.

## 3. Fix Transformer dimension capture order

- [x] 3.1 Review `useEffect` for Transformer attachment in `Player.tsx`
- [x] 3.2 Move dimension capture (`w`, `h`, `scale`, `position`) to AFTER active node resolution
- [x] 3.3 Ensure transformer works correctly for all element types (static, avatar, bubbleText)

**Fixed**: Updated transformer attachment logic to handle `avatar` type the same as `bubbleText` — both now resolve to their `$$group` node before capturing dimensions.

## 4. Add "picture" type to RenderElement

- [x] 4.1 Add "picture" to the type matcher regex in `RenderElement` function
- [x] 4.2 Verify picture elements render correctly with `StaticImage` component

**Note**: "picture" type already exists in regex `/background|sticker|product|picture/`. No changes needed.

## 5. Testing and validation

- [ ] 5.1 Manual test: Avatar drag and drop (no jump)
- [ ] 5.2 Manual test: Mask position stable during canvas resize/orientation change
- [ ] 5.3 Manual test: Transformer selection works for all element types
- [ ] 5.4 Manual test: Picture elements render without "unknown element type" error
- [ ] 5.5 Test on both video editor and image editor pages

## 6. Documentation

- [ ] 6.1 Update code comments in `AvatarElement.tsx` if needed
- [ ] 6.2 Add brief note to CHANGELOG about coordinate system fixes
