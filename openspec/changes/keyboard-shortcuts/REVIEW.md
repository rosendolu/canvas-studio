## Code Review: Keyboard Shortcuts System

**PR**: https://github.com/rosendolu/canvas-studio/pull/new/feature/keyboard-shortcuts  
**Branch**: feature/keyboard-shortcuts  
**Files Changed**: 4 source files + 4 OpenSpec artifacts

---

### Summary

This PR implements a comprehensive keyboard shortcuts system for Canvas Studio, adding Delete, Duplicate (Ctrl+D), Copy/Paste (Ctrl+C/V), Nudge (arrow keys), and Play/Pause (Space) shortcuts. The implementation uses a centralized `useKeyboardShortcuts` hook with proper throttling for nudge operations.

---

### Critical

None found.

---

### Suggestion

1. **[apps/web/src/hooks/useKeyboardShortcuts.ts:35-36]** — The `SHORTCUTS` object is exported but not used externally. Consider removing the export or using it for documentation/help modal.
   - **Fix**: Keep export for future help modal implementation.

2. **[apps/web/src/pages/editor/EditorPage.tsx:85-86]** — The `clipboardRef` stores the full element including `uid`. When pasting, a new `uid` is generated, but other references like `speechItemUid` or `faqReplyItemUid` are copied as-is which could cause conflicts.
   - **Fix**: Add explicit cleanup of reference fields in `handlePaste`:
   ```typescript
   const newElement: CanvasElement = {
     ...clipboardRef.current,
     uid: nanoid(),
     left: clipboardRef.current.left + 20,
     top: clipboardRef.current.top + 20,
     speechItemUid: undefined,
     faqReplyItemUid: undefined,
   }
   ```

3. **[apps/web/src/pages/editor/EditorPage.tsx:67-68]** — The `handleSelectAll` only selects the first element. Consider selecting all elements or implementing multi-select properly.
   - **Fix**: Current behavior is acceptable as MVP. Document as known limitation.

---

### Nice-to-have

1. **Test coverage** — No unit tests for the shortcut matching logic or hook behavior.
   - **Suggestion**: Add tests for `matchesShortcut` function and nudge throttling.

2. **Visual feedback** — No toast notification on copy or visual shortcut hints.
   - **Suggestion**: Add toast notification (already in tasks.md as pending).

3. **Help modal** — No `?` key shortcut to show available shortcuts.
   - **Suggestion**: Implement help modal (already in tasks.md as pending).

---

### Test Plan

**Manual testing required:**
1. Delete element with Delete/Backspace
2. Duplicate with Ctrl+D
3. Copy/paste with Ctrl+C/V
4. Nudge with arrow keys (1px and 10px with Shift)
5. Play/pause with Space (EditorPage)
6. Shortcuts disabled in input fields
7. Cross-browser: Chrome, Firefox, Safari

**Regression testing:**
1. Existing undo/redo still works
2. Element selection still works
3. No console errors

---

### Recommendation

**Approve with minor suggestions**

The implementation is clean, well-structured, and follows React best practices. The centralized hook approach is maintainable and the throttling logic prevents performance issues.

**Pre-merge actions:**
- [ ] Consider fixing Suggestion #2 (clear reference fields on paste)
- [ ] Complete manual testing checklist
- [ ] Optional: Add toast notification for copy action

**Post-merge:**
- Archive the OpenSpec change to `openspec/changes/archive/YYYY-MM-DD-keyboard-shortcuts/`
