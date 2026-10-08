---
Change: defect-fix-typescript-errors
Status: proposed
Phase: Proposal
---

Overview
- Fix critical TypeScript compilation errors that are blocking CI/CD and clean builds.
- Addresses duplicate variable declarations, incorrect function signatures, and missing imports.

Rationale
- ROI: 50.00 (I=4, R=5, C=5, E=1)
- Benefit: Unblocks development workflow, enables type safety, prevents runtime bugs.
- Scope: In-scope: Fix 4 TypeScript errors in EditorPage.tsx, AssetLibraryPanel.tsx, ImageEditorPage.tsx, Player.tsx. Out-of-scope: Feature additions, test coverage, major refactoring.

Scope
- In-scope:
  - Fix duplicate `activeElement` declaration in EditorPage.tsx
  - Fix `initElementPos` function call signature in AssetLibraryPanel.tsx
  - Add missing imports to ImageEditorPage.tsx (TemplatePanel, BrandKitPanel, AssetLibraryPanel, ApiBrandKit, Tabs)
  - Address "expression never nullish" warning in Player.tsx
- Out-of-scope:
  - New features or functionality
  - Test coverage expansion
  - Major code refactoring beyond minimal fixes

MVP and Milestones
- MVP (Day 1-2): Fix EditorPage.tsx and AssetLibraryPanel.tsx errors
- Extended (Day 3-4): Fix ImageEditorPage.tsx imports and Player.tsx warning
- Final (Day 5): Verification, testing, PR creation

Dependencies
- None external. Self-contained TypeScript fixes.

Acceptance Criteria
- `npm run typecheck` passes with zero errors
- No new runtime regressions in Editor, ImageEditor, and AssetLibrary components
- Manual smoke test confirms components render correctly

Change Location
- openspec/changes/defect-fix-typescript-errors

Next Steps
- Phase 3: Implement tasks via /opsx:apply and perform code-review on the resulting PR.
- Confirm with Mafuli before archiving.
