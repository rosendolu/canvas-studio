# Product Requirements: Canvas Studio Daily Iteration (2026-05-08)

## Product context

- **Product snapshot**: Canvas Studio is a commercial open-source canvas editor built with React/Vite/Mantine/Konva for frontend, NestJS/MongoDB backend. Targets content creators, streamers, video editors. Primary journey: load/create canvas, add/drag/resize/rotate elements (images, text bubbles, APNG, carousels), timeline editing or live preview, export/share.
- **Business goal (this quarter)**: User growth — increase GitHub stars, demo traffic (draw.rosendo.fun), PR merge velocity to unblock features and attract contributors.
- **Current pain**: 
  1. Multiple open feature branches/PRs (e.g., layer panel, undo/redo, templates) stalling main integration.
  2. Editor bugs/parity issues (transformer sync, rotation/align incomplete from branch names/commits).
  3. No automated tests, risking regressions on core canvas ops.
- **Constraints**: Monorepo structure, no new deps, stick to Konva/react-konva, commercial license (no copyleft), limited backend (focus frontend polish).
- **Success metrics**: PR merge rate (>80%), test coverage >70% on core, demo uptime 99%, stars +10%.
- **Assumptions**: Growth via polish/reliability over new features; no user data available; infer pains from git log/branches.

## Requirement plans

### Plan A — Defect fix

**Problem statement**: Core canvas transformer (resize/rotate/drag) has sync issues (e.g., initial sizing, parity across image/video editors) per recent commits/branches; risks user frustration/dropoff.

**Target users**: All editors (100%).

**Proposed solution**: Audit/fix transformer logic in CanvasElements/*, ensure consistent scale/rotation math using canvas-core utils; add snap-to-grid/angle; test across modes.

**Scope**:
- In: TransformerNode, element initial bounds, parity fixes.
- Out: New UI, perf opt.

**Risks & mitigations**:
- Breaks existing: Unit tests + manual E2E.
- Konva quirks: Isolate to utils.

**Dependencies**: canvas-core/utils.

**Success metrics**: 0 transformer bugs reported; 95% actions smooth.

**Rough effort**: 1-2 person-weeks (small/likely/large).

### Plan B — New feature

**Problem statement**: No layer panel fully wired; users struggle managing z-order/visibility/lock for complex canvases.

**Target users**: Advanced editors (30%).

**Proposed solution**: Implement layer panel (from open branch feature/layer-panel): visibility toggle, lock, reorder (up/down), delete; integrate to editorStore, disable drags on locked.

**Scope**:
- In: LayerPanel component, store mutations, Konva attrs sync.
- Out: Drag-drop reorder, nested groups.

**Risks & mitigations**:
- State explosion: Immer patches.
- UI perf: Virtual list if >50 layers.

**Dependencies**: editorStore, existing branch.

**Success metrics**: Layer ops used in 50% sessions >10 elems.

**Rough effort**: 2-3 person-weeks.

### Plan C — Iteration/optimization

**Problem statement**: No tests; regressions common (e.g., recent i18n/share fixes); slows iteration.

**Target users**: All (devs + users via stability).

**Proposed solution**: Add Vitest suite for core: transformer ops, element rendering/export, store mutations; aim 70% coverage on CanvasPlayer/Elements.

**Scope**:
- In: Unit tests for utils/element components, snapshot exports.
- Out: E2E/CI.

**Risks & mitigations**:
- Flaky Konva: Mock stage/layer.
- Time sink: Focus top 20% code.

**Dependencies**: Vitest (add if missing).

**Success metrics**: Coverage +30%, CI green.

**Rough effort**: 1-2 person-weeks.

## ROI evaluation

| Plan | Impact (1-5) | Reach (1-5) | Confidence (1-5) | Effort (1-5) | ROI = (I*R*C)/E |
|------|--------------|-------------|------------------|--------------|-----------------|
| A    | 4            | 5           | 4                | 2            | 40.00           |
| B    | 4            | 3           | 4                | 3            | 16.00           |
| C    | 5            | 5           | 5                | 3            | 41.67           |

## Recommendation

- **Recommended**: Plan C (Iteration/optimization) — tests
- **Why**: Highest ROI (41.67), ties reliability to growth (stable main attracts contribs), de-risks future iters vs fixing symptoms.
- **Week-1 de-risking**: Run coverage report, list top untested files; prototype 1 test.
- **MVP slice**: Tests for transformer + export (50% value).
- **Timeline**:
  1. Week1: Setup Vitest, test utils/transformer.
  2. Week2: Element components + store.
  3. Merge + coverage badge.
- **Decision log**: Assumed test gap primary blocker (no tests visible); if coverage exists, pivot to A. Stars metric from README badges.