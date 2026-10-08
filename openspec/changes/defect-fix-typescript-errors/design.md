---
Change: defect-fix-typescript-errors
Status: proposed
Phase: Design
---

Design document for fixing TypeScript compilation errors in canvas-studio.

Overview
- Aligns with Phase 2 proposal and outlines concrete technical fixes for 4 files.

Key Areas
1. EditorPage.tsx - Variable declaration conflict
2. AssetLibraryPanel.tsx - Function signature mismatch
3. ImageEditorPage.tsx - Missing component imports
4. Player.tsx - Nullish expression warning

Technical Approach (detailed)

### Fix 1: EditorPage.tsx Duplicate Declaration
**Issue**: `activeElement` declared twice (line 28 and line 213)
**Solution**: Remove the first declaration at line 28, keep the one at line 213 (which has the correct logic)
**Code Change**:
```typescript
// REMOVE this line (line 28):
const activeElement = track.flatMap(t => t.lineList).find(el => el.uid === chooseDataUid)

// KEEP this block (around line 213):
const activeElement = track
  .flatMap(t => t.lineList)
  .find(el => el.uid === chooseDataUid)
```

### Fix 2: AssetLibraryPanel.tsx Function Signature
**Issue**: `initElementPos` called with 3 arguments instead of 2
**Current**: `initElementPos(base, drawWidth, drawHeight)`
**Expected**: `initElementPos(base, { width: drawWidth, height: drawHeight })`
**Code Change**:
```typescript
// Line 47: Change from:
return initElementPos(base, drawWidth, drawHeight)
// To:
return initElementPos(base, { width: drawWidth, height: drawHeight })
```

### Fix 3: ImageEditorPage.tsx Missing Imports
**Issue**: Missing imports for Tabs, TemplatePanel, BrandKitPanel, AssetLibraryPanel, ApiBrandKit
**Solution**: Add the following imports:
```typescript
// Add to existing @mantine/core imports:
import { Tabs } from '@mantine/core'

// Add new component imports:
import { TemplatePanel } from '../../components/Library/TemplatePanel'
import { BrandKitPanel } from '../../components/Library/BrandKitPanel'
import { AssetLibraryPanel } from '../../components/Library/AssetLibraryPanel'
import type { ApiBrandKit } from '../../api/libraryApi'
```

### Fix 4: Player.tsx Nullish Expression
**Issue**: Line 84 - expression is never nullish
**Context**: Likely related to `target?.attrs?.name` check
**Solution**: Review and simplify the conditional logic or add proper type guards
**Code Change**:
```typescript
// Review line 84 and surrounding context
// If the expression can never be nullish, simplify or use type assertion
```

Testing Strategy
- Run `npm run typecheck` after each fix
- Manual smoke test: Open Editor, ImageEditor pages
- Verify AssetLibrary loads and displays assets
- Verify canvas player interactions work

Risks and Mitigations
- **Runtime regression**: Each fix requires manual testing of affected component
- **Import path errors**: Verify all import paths exist before committing
- **Type assertion risks**: Use minimal type assertions, prefer proper type narrowing

Delivery Plan
- Day 1: Fix EditorPage.tsx
- Day 2: Fix AssetLibraryPanel.tsx
- Day 3: Fix ImageEditorPage.tsx imports
- Day 4: Fix Player.tsx warning
- Day 5: Final verification and PR

Open Questions
- Should we add ESLint rule to prevent duplicate declarations? (Deferred to future)
