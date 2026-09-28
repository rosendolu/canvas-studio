## Context

Canvas Studio has two main editor modes:
- **EditorPage**: Video timeline editor with playback controls
- **LivePage**: Real-time live room editor

Both use CanvasPlayer for element rendering and have similar element manipulation needs. Currently, keyboard handling is minimal:
- Player.tsx handles Delete/Backspace for element deletion
- EditorPage has undo/redo (Ctrl+Z/Y) but only when not focused on inputs

The coordinate system fixes (PR #20) stabilized element positioning. Now we can build reliable keyboard interactions on top.

## Goals / Non-Goals

**Goals:**
- Provide standard keyboard shortcuts for element operations
- Ensure shortcuts work consistently across Editor and Live modes
- Add visual hints for discoverability
- Maintain accessibility (Escape to deselect, no keyboard traps)

**Non-Goals:**
- Customizable keybindings
- International keyboard layout support
- Vim-style modal editing
- Conflict resolution with browser shortcuts (document conflicts instead)

## Decisions

1) **Centralized hook vs. distributed handlers**
- **Decision**: Create `useKeyboardShortcuts` hook that returns handlers, apply in page components
- **Why**: Keeps keyboard logic testable and reusable; pages control when handlers are active

2) **Nudge implementation**
- **Decision**: Nudge updates element position via existing `onSyncPos` callback
- **Why**: Reuses existing state update path, works with undo/redo automatically

3) **Copy/paste scope**
- **Decision**: Copy stores single element in memory (not clipboard API), paste creates duplicate at offset position
- **Why**: Avoids clipboard permission prompts, supports paste multiple times

4) **Conflict handling**
- **Decision**: Check `e.target` tagName to ignore shortcuts when in inputs/textareas
- **Why**: Prevents accidental deletion while typing in property panel

## Risks / Trade-offs

- **[Browser shortcut conflicts]** Ctrl+T (new tab), Ctrl+W (close tab) cannot be overridden
  - **Mitigation**: Use alternative combos where needed, document conflicts

- **[Focus management]** Keyboard shortcuts require page to have focus
  - **Mitigation**: Add `tabIndex={0}` to container divs, ensure visual focus indicator

- **[Undo/redo interaction]** Nudge operations should be undoable
  - **Mitigation**: Each nudge pushes to history (may need debouncing for arrow key holds)

## Implementation Notes

### Shortcut Registry

```typescript
// apps/web/src/hooks/useKeyboardShortcuts.ts
export interface ShortcutConfig {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  handler: () => void
  description: string
}

export function useKeyboardShortcuts(
  activeElement: CanvasElement | undefined,
  callbacks: {
    onDelete: () => void
    onDuplicate: () => void
    onCopy: () => void
    onPaste: () => void
    onNudge: (dx: number, dy: number) => void
    onPlayPause?: () => void
  }
): { shortcuts: ShortcutConfig[] }
```

### Event Handling Strategy

1. Page component attaches `keydown` listener to window
2. Handler checks if target is input/textarea (skip if so)
3. Match against shortcut registry
4. Call appropriate callback
5. Prevent default on matched shortcuts only

### Nudge Behavior

- Arrow keys: ±1px in direction
- Shift+Arrow: ±10px in direction
- Continuous hold: Repeat nudge (throttled to 50ms)
- Each nudge is a separate history entry (for undo granularity)
