## Context

Canvas Studio uses Konva/react-konva for canvas rendering with a coordinate system where elements have `left`, `top`, `width`, `height`, `scaleX`, `scaleY`, `rotation`, `offsetX`, and `offsetY` properties. The `syncPosToState` function in `Player.tsx` is responsible for syncing Konva node positions back to React state, while `changeOrientation` in `element.ts` handles canvas resize/orientation changes.

Current issues:
1. Avatar group drag stores position inconsistently — the code path for `shapeType === 'group'` with avatar elements needs to consistently use `left/top`
2. `changeOrientation` mask calculation incorrectly adds `el.offsetX` to `mask.left` when `offsetX` should be 0 after initialization
3. Transformer captures dimensions (`w`, `h`) before resolving the correct active node for bubbleText/avatar elements
4. "picture" type is missing from `RenderElement` type matcher

Constraints:
- Must maintain backward compatibility with existing saved canvases
- No major state management rewrites (editorStore/liveStore stay separate)
- Minimal surgical changes preferred over refactoring

## Goals / Non-Goals

**Goals:**
- Fix avatar element jump after drag by ensuring consistent `left/top` storage
- Fix mask drift during orientation change by correcting coordinate calculation
- Fix transformer dimension capture order for consistent selection behavior
- Add "picture" type support to prevent "unknown element type" errors

**Non-Goals:**
- Refactoring the entire coordinate system
- Adding new element types
- Changing the store architecture
- Video export pipeline changes

## Decisions

1) **Keep offsetX/offsetY as no-ops (always 0)**
- **Decision**: After fixes, `offsetX` and `offsetY` will always be 0. Existing saved canvases with non-zero values will have those values ignored.
- **Why**: Simplifies mental model — position is always `left/top`, scaling is always `scaleX/scaleY`, rotation is always `rotation`. No offset calculations needed.
- **Migration**: None required — offset values will simply have no effect.

2) **Fix transformer capture order**
- **Decision**: Move dimension capture (`w`, `h`, `scale`, `position`) to AFTER the active node resolution for bubbleText/avatar elements.
- **Why**: Current code captures dimensions from the initial `active` node, then potentially reassigns `active` for bubbleText/avatar, but never re-captures dimensions.

3) **Add "picture" to existing regex matcher**
- **Decision**: Extend the existing `/background|sticker|product|picture/.test(item.type)` pattern rather than creating a new case.
- **Why**: "picture" elements should behave identically to background/sticker/product elements (static image rendering).

## Risks / Trade-offs

- **[Breaking existing saved canvases]** Users with canvases saved before this fix may see position shifts if they had non-zero offsetX/offsetY values.
  - **Mitigation**: These values were already problematic (causing drift), so this fix actually improves behavior for those canvases.
  
- **[Avatar drag behavior regression]** Changes to `syncPosToState` could affect avatar drag behavior.
  - **Mitigation**: Test manually on both video and image editors after fix.

- **[Mask position change on existing canvases]** Canvases with existing masks may see position shift after orientation change.
  - **Mitigation**: The current behavior is buggy (drift), so this is actually a fix, not a regression.
