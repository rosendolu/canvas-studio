---
Change: keyboard-shortcuts
Status: proposed
Phase: Proposal
---

Overview
- This proposal documents the Phase 2 open-spec change to implement a universal keyboard shortcuts system for Canvas Studio editor and playback workflows.
- Derived from the Iterate-Automatically Requirements Review (Plan A: Defect Fix – Keyboard Shortcuts System).

Rationale
- ROI: 25.00 (I=4, R=5, C=5, E=2)
- Benefit: Improves speed, accessibility, and foundation for future multi-select features.
- Scope: In-scope: core shortcuts for deletion, undo/redo, nudging; cross-platform key combos; quick help hints. Out-of-scope: customizable keybindings; deep conflicts with browser shortcuts; cross-language layout adaptations in MVP.

Scope
- In-scope:
  - Delete/Backspace deletes selected element
  - Undo/Redo via Ctrl/Cmd+Z / Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z (existing plumbing extended)
  - Nudge via Arrow keys (1px) and Shift+Arrow for larger steps (10px)
  - Basic keyboard shortcut hints (tooltips)
- Out-of-scope:
  - Reconfiguring keyboard layout per user
  - Complex conflict-resolution with browser/system shortcuts beyond documented defaults

MVP and Milestones
- MVP (Week 1): Implement Delete, Undo, Redo, and Nudge; display simple shortcuts hints
- Extended (Week 2): Implement Select All, Duplicate, Copy/Paste, plus timeline zoom and play/pause shortcuts

Dependencies
- None external. Builds on existing undo/redo infrastructure and selection model.

Acceptance Criteria
- All four MVP shortcuts work consistently across EditorPage and LivePlay components when a single element is selected
- Keyboard focus does not hijack text inputs, search fields, or other focusable controls
- Clear in-UI hints show available shortcuts

Change Location
- openspec/changes/keyboard-shortcuts

Next Steps
- Phase 3: Implement tasks via /opsx:apply and perform code-review on the resulting PR.
- Confirm with Mafuli before archiving.
