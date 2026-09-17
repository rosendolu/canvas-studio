## Code Review: Canvas Coordinate Alignment Fixes

**PR**: https://github.com/rosendolu/canvas-studio/pull/20
**Branch**: feature/canvas-coordinate-alignment
**Files Changed**: 2 source files + 3 OpenSpec artifacts

---

### Summary

This PR fixes coordinate system inconsistencies in the canvas player that were causing:
1. Avatar elements jumping after drag
2. Mask positions drifting during orientation changes
3. Transformer selection issues for avatar elements

The changes are surgical and focused, affecting only `Player.tsx` and `element.ts`.

---

### Critical

None found.

---

### Suggestion

1. **[apps/web/src/components/CanvasPlayer/Player.tsx:132-135]** — The transformer logic now checks element type using `elements.find()` which is O(n). Consider using a Map or caching the active element lookup if this becomes a performance concern with many elements.
   - **Fix**: Current implementation is acceptable for typical canvas sizes (<100 elements). No change needed unless profiling reveals an issue.

2. **[packages/canvas-core/src/utils/element.ts:94-95]** — The comment "Mask coordinates are always absolute" is helpful, but consider adding a brief explanation of why offsetX/Y were removed (referencing this PR or issue).
   - **Fix**: Add reference comment: `// Removed +offsetX/Y per PR #20 — mask coords are absolute`

---

### Nice-to-have

1. **Test coverage** — The PR includes manual testing checklist but no automated tests. Consider adding unit tests for:
   - `changeOrientation` with masked elements
   - Transformer attachment logic

2. **CHANGELOG entry** — The tasks mention updating CHANGELOG but this wasn't included in the commit.

---

### Test Plan

**Manual testing required:**
1. Avatar drag and drop — verify no position jump
2. Canvas resize with masked avatar — verify mask stays in correct position
3. Transformer selection — verify works for avatar, bubbleText, and static elements
4. Both editor modes (video and image)

**Regression testing:**
1. Existing canvases with masks — verify positions are corrected (not broken)
2. Non-avatar elements — verify no behavior change

---

### Recommendation

**Approve with minor suggestions**

The changes are correct, focused, and address the stated issues. The transformer fix properly handles avatar elements like bubbleText, and the mask coordinate fix removes the incorrect offset addition.

**Pre-merge actions:**
- [ ] Consider adding the explanatory comment in element.ts (Suggestion #2)
- [ ] Complete manual testing checklist
- [ ] Optional: Add CHANGELOG entry

**Post-merge:**
- Archive the OpenSpec change to `openspec/changes/archive/YYYY-MM-DD-canvas-coordinate-alignment/`
