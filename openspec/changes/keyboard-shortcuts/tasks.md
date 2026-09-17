## 1. Create useKeyboardShortcuts hook

- [x] 1.1 Create `apps/web/src/hooks/useKeyboardShortcuts.ts` with shortcut registry
- [x] 1.2 Define ShortcutConfig interface and default shortcuts
- [x] 1.3 Implement nudge throttling for arrow key holds
- [ ] 1.4 Add unit tests for shortcut matching logic

## 2. Integrate into EditorPage

- [x] 2.1 Import useKeyboardShortcuts in EditorPage.tsx
- [x] 2.2 Wire up callbacks: onDelete, onDuplicate, onCopy, onPaste, onNudge
- [x] 2.3 Add Space key for play/pause toggle
- [x] 2.4 Ensure shortcuts disabled during text input

## 3. Integrate into LivePage

- [x] 3.1 Import useKeyboardShortcuts in LivePage.tsx
- [x] 3.2 Wire up callbacks (no play/pause in LivePage)
- [x] 3.3 Ensure shortcuts disabled during text input

## 4. Add visual hints

- [ ] 4.1 Add shortcut hints to PropertyPanel tooltips
- [ ] 4.2 Show toast notification on copy action
- [ ] 4.3 Add keyboard shortcut help modal (triggered by `?` key)

## 5. Testing and validation

- [ ] 5.1 Manual test: Delete element with Delete/Backspace
- [ ] 5.2 Manual test: Undo/redo with Ctrl+Z/Y
- [ ] 5.3 Manual test: Nudge with arrow keys (1px and 10px)
- [ ] 5.4 Manual test: Duplicate with Ctrl+D
- [ ] 5.5 Manual test: Copy/paste with Ctrl+C/V
- [ ] 5.6 Manual test: Play/pause with Space (EditorPage only)
- [ ] 5.7 Manual test: Shortcuts disabled in input fields
- [ ] 5.8 Cross-browser test: Chrome, Firefox, Safari

## 6. Documentation

- [ ] 6.1 Update README.md with keyboard shortcuts section
- [ ] 6.2 Add keyboard shortcut reference to help modal
- [ ] 6.3 Update CHANGELOG.md
