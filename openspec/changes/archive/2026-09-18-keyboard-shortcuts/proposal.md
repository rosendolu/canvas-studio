## Why

Canvas Studio currently requires mouse interaction for all operations. Users cannot:
- Delete selected elements without clicking a button
- Undo/redo without toolbar buttons
- Nudge elements by pixel amounts
- Duplicate or copy/paste elements

This creates friction for power users and slows down common workflows. Keyboard shortcuts are a standard expectation in creative tools (Figma, Photoshop, Canva).

## What Changes

Implement a comprehensive keyboard shortcuts system across EditorPage and LivePage:

1. **Element Operations**:
   - `Delete/Backspace`: Delete selected element
   - `Ctrl/Cmd+D`: Duplicate selected element
   - `Ctrl/Cmd+C` then `Ctrl/Cmd+V`: Copy/paste element

2. **Navigation & Nudge**:
   - `↑↓←→`: Nudge selected element by 1px
   - `Shift+↑↓←→`: Nudge selected element by 10px

3. **Playback (EditorPage only)**:
   - `Space`: Play/pause timeline playback

4. **Visual Feedback**:
   - Tooltip hints showing available shortcuts
   - Toast notification on copy

## Capabilities

### Modified Capabilities

- `editor-page`: Keyboard-driven element manipulation
- `live-page`: Keyboard-driven element manipulation
- `canvas-player`: Nudge support via keyboard events

### New Capabilities

- `keyboard-shortcuts`: Centralized shortcut registry and handler

## Impact

- **Frontend (apps/web)**: Add keyboard event handlers to EditorPage.tsx and LivePage.tsx, create useKeyboardShortcuts hook
- **Backend**: No changes required
- **Shared (packages/canvas-core)**: No changes required
