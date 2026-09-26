---
Change: keyboard-shortcuts
Status: proposed
Phase: Design
---

Design document for implementing a universal keyboard shortcuts system in Canvas Studio.

Overview
- Aligns with Phase 2 proposal and outlines concrete technical approach for EditorPage, LivePlay, and related stores.

Key Areas
- Input handling layer: centralized keyboard event router
- Conflict handling: avoid browser shortcuts with documented mappings
- Focus management: ensure inputs are not disrupted
- Visual hints: inline help and status bar indicators

Technical Approach (high level)
- Add a KeyboardShortcutsManager singleton to register mappings and dispatch actions to store actions.
- Extend existing selection state to support multi-modality (future plan).
- Implement core mappings:
  - Delete/Backspace: delete selected element
  - Ctrl/Cmd+Z: Undo
  - Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z: Redo
  - Arrow keys: Nudging selected element by 1px; Shift+Arrow for 10px
- Keyboard shortcuts propagations: only active when editor has focus and not in a text input

Testing Strategy
- Unit tests for the mappings
- E2E testing for deletion/undo/redo/nudging in editor playground
- Cross-browser checks (Chrome/Firefox/Edge)

Risks and Mitigations
- Keyboard capture conflicts: document conflicts and provide fallbacks
- Accessibility: ensure screen readers get proper focus management

Delivery Plan
- Week 1: Implement core mappings and KeyboardShortcutsManager
- Week 2: Extend mappings and add UI hints

Open Questions
- Should we support platform-specific shortcuts (macOS vs Windows)? Proposed defaults cover both with Cmd vs Ctrl
