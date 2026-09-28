# Phase 1: Requirements Review & Plan Generation

## Product Context

**Product snapshot**: Canvas Studio is a React/Vite-based canvas editor for building live streaming rooms and video editing. Users are content creators who need to design scenes with elements like avatars, text bubbles, backgrounds, stickers, and animations.

**Business goal (this quarter)**: Stability and reliability — the core canvas implementation has known coordinate system issues that cause element drift, misalignment, and inconsistent behavior between video editor and image editor modes.

**Current pain**:
1. Avatar/mask positioning drifts during canvas resize and orientation changes
2. Picture element type not properly handled in RenderElement
3. Transformer selection behavior inconsistent between bubbleText and avatar elements
4. Video editor and image editor have divergent active-element update patterns

**Constraints**:
- React 18 + TypeScript + Vite 5 + Konva/react-konva
- No major state management rewrites (editorStore/liveStore stay separate)
- Must maintain backward compatibility with existing saved canvases
- PR #18 already addresses some defects but needs completion

**Success metrics**:
- Zero element drift during resize/orientation change
- Consistent transformer behavior across all element types
- All element types render correctly (no "unknown element type" errors)

---

## Plan A — Defect Fix (Canvas Coordinate System Alignment)

**Problem statement**: The canvas player has coordinate system inconsistencies causing avatar elements to jump after drag, mask positions to drift during orientation changes, and the "picture" element type to fail rendering.

**Target users**: All Canvas Studio users (both video editor and image editor modes)

**Proposed solution**: Surgical fixes to align coordinate semantics:
- Fix `syncPosToState` to store `left/top` instead of `offsetX/offsetY` for avatar groups
- Fix `changeOrientation` mask coordinate calculation (remove incorrect `el.offsetX` addition)
- Fix Transformer mirror rect width capture order
- Add "picture" type to RenderElement matcher

**Scope**:
- In-scope: `Player.tsx`, `element.ts`, `AvatarElement.tsx` (comment update)
- Out-of-scope: Store refactoring, new element types, video export pipeline

**Risks & mitigations**:
- Risk: Breaking existing saved canvases with offsetX/offsetY data → Mitigation: offsetX/offsetY become no-ops (always 0 after fix)
- Risk: Avatar drag behavior regression → Mitigation: Manual testing on both editors

**Dependencies**: None (self-contained fixes)

**Success metrics**: Avatar stays at dropped position, mask stable during resize, picture renders correctly

**Rough effort**: 1-2 person-weeks (small/likely/large: 0.5/1.5/2.5)

---

## Plan B — New Feature (Keyboard Shortcuts & Accessibility)

**Problem statement**: Power users need faster workflows. Currently no keyboard shortcuts exist for common actions like delete, duplicate, bring to front/back, or nudge by arrow keys.

**Target users**: Power users creating multiple scenes, professional streamers

**Proposed solution**: Implement keyboard shortcut system:
- Delete: Delete/Backspace key
- Duplicate: Ctrl+D
- Nudge: Arrow keys (1px), Shift+Arrow (10px)
- Layer ordering: Ctrl+[/] for send backward/forward
- Focus management for accessibility

**Scope**:
- In-scope: Keyboard event handlers, shortcut registry, focus indicators
- Out-of-scope: Customizable shortcuts, international keyboard layouts (phase 2)

**Risks & mitigations**:
- Risk: Conflicts with browser/OS shortcuts → Mitigation: Use Ctrl/Cmd prefixes, allow disable
- Risk: Accessibility audit requirements → Mitigation: Follow ARIA guidelines, focus visible

**Dependencies**: None

**Success metrics**: All shortcuts work in both editor modes, Lighthouse accessibility score >90

**Rough effort**: 2-3 person-weeks (small/likely/large: 1.5/2.5/4)

---

## Plan C — Iteration/Optimization (Performance & Bundle Size)

**Problem statement**: Canvas with many elements (50+) shows frame drops during drag. Initial bundle size is large due to Konva + Mantine + all features loaded upfront.

**Target users**: All users, especially on slower devices

**Proposed solution**: Performance optimizations:
- Virtualize timeline ruler (only render visible ticks)
- Lazy load ElementMenu panels (Templates, Assets, Library)
- Memoize expensive computations in element utils
- Code-split routes (editor vs live vs preview)

**Scope**:
- In-scope: Timeline virtualization, lazy panels, React.memo where beneficial
- Out-of-scope: Konva rendering optimization (too complex), WebGL migration

**Risks & mitigations**:
- Risk: Lazy loading causes UI jank → Mitigation: Preload on hover, skeleton states
- Risk: Memoization bugs → Mitigation: Comprehensive regression testing

**Dependencies**: None

**Success metrics**: 60fps drag with 100 elements, initial bundle <500KB gzipped

**Rough effort**: 2-4 person-weeks (small/likely/large: 2/3/5)

---

## ROI Evaluation

| Plan | Impact (1-5) | Reach (1-5) | Confidence (1-5) | Effort (1-5) | ROI = (I×R×C)/E |
|------|-------------:|------------:|-----------------:|-------------:|----------------:|
| A — Defect Fix | 4 | 5 | 5 | 2 | **25.00** |
| B — Keyboard Shortcuts | 3 | 3 | 4 | 3 | **12.00** |
| C — Performance | 3 | 5 | 3 | 4 | **11.25** |

**Scoring rationale**:
- **Plan A**: High impact (fixes critical bugs), affects all users, high confidence (known fixes), low effort (surgical changes)
- **Plan B**: Medium impact (productivity), medium reach (power users), medium confidence (standard patterns), medium effort
- **Plan C**: Medium impact (smoothness), high reach (all users), lower confidence (performance work unpredictable), higher effort

---

## Recommendation

**Recommended**: **Plan A — Defect Fix (Canvas Coordinate System Alignment)**

**Why**:
- Highest ROI (25.00 vs 12.00 vs 11.25)
- Addresses critical user-facing bugs that cause visible glitches
- PR #18 already partially implements this — completing it has immediate value
- Unblocks future work (stable foundation needed before shortcuts/perf)
- Low risk, high confidence, quick win

**Week-1 de-risking**:
- Day 1-2: Verify PR #18 changes are complete and correct
- Day 3-4: Manual testing on both video and image editors
- Day 5: Code review and merge preparation

**MVP slice**:
- Fix 1: `syncPosToState` group → left/top (Player.tsx)
- Fix 2: `changeOrientation` mask coords (element.ts)
- Fix 3: Transformer w capture order (Player.tsx)
- Fix 4: Add "picture" type (Player.tsx)

**Timeline**:
- Week 1: Verify existing PR #18, complete any missing fixes
- Week 2: Code review, testing, documentation update

**Decision log**:
- Assumption: PR #18 contains partial fixes that need completion
- Assumption: offsetX/offsetY can be deprecated (become no-ops) without migration
- Data that would change decision: User analytics showing performance is #1 complaint (would flip to Plan C)
