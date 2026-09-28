# Proposal for Canvas Studio Iterate-Automatically (Phase 2)

## Problem statement
Defects in avatar group positioning, mask orientation during transforms, and canvas resize scaling cause visual drift and inconsistent state after user interactions. Also image rendering types need alignment with the 'picture' type to ensure proper image rendering.

## Target users
- Designers and editors using the canvas studio to arrange avatars, stickers, and text.

## Proposed solution (1 paragraph)
Implement focused, surgical fixes to group position handling, mask offset usage, and resize scaling to ensure state consistency across drag/transform/resize and ensure 'picture' type elements render consistently via StaticImage rendering.

## Scope
- In-scope: Avatar group left/top binding; mask coordinate logic; fitCanvasResize offset handling; transformer capture ordering; RenderElement type matching.
- Out-of-scope: New features; data model migrations; backend API changes.

## Risks & mitigations
- Risk: regressions in other element types due to coordinate math tweaks. Mitigation: limit to SCOPED fixes, add regression tests where possible.
- Risk: visual drift still occurs for some edge cases. Mitigation: add guard rails in Capture logic; log for future triage.

## Dependencies
- None external beyond existing Canvas Studio core code.

## Success metrics
- Visual drift is eliminated on drag/rotate/resize flows.
- No new rendering regressions for /picture types
- 0 regression reports in 2 sprints.

## Rough effort
- 1–2 weeks (defect fixes + regression checks)
