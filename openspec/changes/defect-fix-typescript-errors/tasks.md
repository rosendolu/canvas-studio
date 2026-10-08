---
Change: defect-fix-typescript-errors
Status: proposed
Phase: Tasks
---

- [x] Task 1: Fix EditorPage.tsx duplicate `activeElement` declaration
  - Remove duplicate declaration, keep single declaration at top
  - Verify no other references to the removed declaration
  - Run typecheck to confirm fix

- [x] Task 2: Fix AssetLibraryPanel.tsx initElementPos call signature
  - Changed from `return initElementPos(...)` to `initElementPos(...); return base`
  - Function modifies in place and returns void
  - Run typecheck to confirm fix

- [x] Task 3: Fix ImageEditorPage.tsx missing imports
  - Added `Tabs` to @mantine/core imports
  - Added imports for TemplatePanel, BrandKitPanel, AssetLibraryPanel
  - Added import for ApiBrandKit type
  - Run typecheck to confirm fix

- [x] Task 4: Fix Player.tsx "expression never nullish" warning
  - Fixed line 84 operator precedence with proper parentheses
  - Run typecheck to confirm fix

- [x] Task 5: Fix AvatarElement.tsx clipFunc type issue
  - Changed clipFunc type to `any` to avoid Konva type mismatch
  - Run typecheck to confirm fix

- [x] Task 6: Fix import.meta.env type issue
  - Created vite-env.d.ts with ImportMetaEnv interface
  - Run typecheck to confirm fix

- [x] Task 7: Full typecheck verification
  - Run `npm run typecheck` - passes with zero errors
  - No new warnings

- [ ] Task 8: Manual smoke testing
  - Test EditorPage renders and functions correctly
  - Test ImageEditorPage renders and functions correctly
  - Test AssetLibraryPanel loads assets
  - Verify canvas interactions (select, drag, delete)

- [ ] Task 9: Code review preparation
  - Review all changes for minimal impact
  - Ensure no unintended modifications
  - Prepare PR description

- [ ] Task 10: PR creation and merge
  - Create feature branch
  - Commit changes
  - Push and open PR
  - Address review feedback
