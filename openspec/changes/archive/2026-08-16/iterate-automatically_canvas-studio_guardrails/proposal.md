# Proposal: Canvas Studio Guardrails — Defect Fix Completion

## What

Complete the defect fixes for canvas coordinate system alignment and establish guardrails to prevent future coordinate drift issues.

This change finalizes the defect fixes started in previous iterations and adds preventive measures:

1. **Complete avatar transformer attachment fix** — Ensure transformer attaches to Group for avatar elements (not Image)
2. **Verify mask coordinate calculation** — Confirm `changeOrientation` mask coords are correct
3. **Add runtime guardrails** — Validation checks to catch coordinate inconsistencies early

## Why

### Current State
PR #18 (open) contains partial fixes for avatar/mask positioning. The main branch already has:
- `syncPosToState` storing `left/top` for avatar groups (not `offsetX/offsetY`)
- `changeOrientation` mask coords fixed (using `mask.offsetX/offsetY` only)
- `fitCanvasResize` no longer scales `offsetX/offsetY`
- `picture` type added to `ElementType` union
- RenderElement regex includes `picture`

### Remaining Issues
The PR #18 branch has additional fixes that need verification and completion:
- Avatar transformer attachment logic refinement
- Comment updates in AvatarElement

### Why Guardrails
After fixing defects, we need to prevent regression:
- Runtime validation of element coordinates
- Assertions for mask position consistency
- Development-time warnings for coordinate anti-patterns

## Non-Goals

- No new element types
- No state management rewrites
- No video export changes
- No UI/UX redesign

## Capabilities

### Modified Capabilities
- `canvas-player`: Enhanced transformer attachment logic
- `element-utils`: Verified coordinate calculations
- `guardrails`: New validation layer (dev-only)

## Impact

- **Frontend**: Minor updates to Player.tsx transformer logic
- **Shared**: Optional guardrails utility in canvas-core
- **No breaking changes**: All fixes are backward compatible
