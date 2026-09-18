# Iterate-Automatically: Requirements Review Phase

**Date**: 2026-09-17  
**Project**: canvas-studio  
**Current Branch**: main (after PR #20 merge)

---

## Product Context

### Product Snapshot
Canvas Studio is an open-source canvas editor for building live streaming rooms and video editing experiences. It provides:
- **Video Editor Mode**: Timeline-based editing with frame-accurate positioning
- **Live Room Mode**: Real-time canvas editing for live streaming overlays
- **Element Types**: Backgrounds, stickers, avatars (digital humans with masks), bubble text, APNG animations, carousels, slideshows
- **Tech Stack**: React 18 + TypeScript + Vite, Konva/react-konva for canvas, Mantine UI, NestJS backend, MongoDB

**Primary Users**: Content creators, live streamers, and video editors who need visual overlays and scene composition.

### Business Goal (This Quarter)
**User retention and reliability** — The coordinate system fixes (PR #20) addressed critical bugs causing avatar jumps and mask drift. Now focus on:
1. Reducing user friction in common workflows
2. Improving editor performance with larger canvases
3. Enhancing collaboration/sharing capabilities

### Current Pain
1. **No keyboard shortcuts** — Users must click for everything (undo/redo, delete, zoom)
2. **No element grouping** — Cannot select/move multiple elements together
3. **No copy/paste** — Cannot duplicate elements within or across canvases
4. **Timeline performance** — Large tracks (>50 elements) cause lag in ruler rendering
5. **No preview mode** — Users can't see canvas without UI chrome

### Constraints
- **Platform**: Web browser (Chrome/Firefox/Safari), responsive design
- **Timeline**: 2-3 week sprints
- **Team**: Solo developer with AI assistance
- **Tech**: Must maintain backward compatibility with existing saved canvases
- **Compliance**: Commercial license requires clean IP

### Success Metrics
- **Task completion time**: Time to create a basic scene (target: <2 min)
- **User error rate**: Undo frequency per session (target: <5/session)
- **Performance**: Frame rate during canvas interaction (target: >30fps with 50 elements)

---

## Requirement Plans

### Plan A — Defect Fix: Keyboard Shortcuts System

**Problem Statement**: Users rely entirely on mouse interactions for all operations. Common actions (delete, undo, zoom, select all) require precise clicking, slowing workflow and causing frustration.

**Target Users**: Power users and content creators who work with the editor daily.

**Proposed Solution**: Implement a comprehensive keyboard shortcuts system:
- `Delete/Backspace`: Delete selected element
- `Ctrl/Cmd+Z`: Undo
- `Ctrl/Cmd+Y` or `Ctrl/Cmd+Shift+Z`: Redo
- `Ctrl/Cmd+A`: Select all elements
- `Ctrl/Cmd+D`: Duplicate selected element
- `Ctrl/Cmd+C/V`: Copy/paste element
- `+/-`: Zoom in/out on timeline
- `Space`: Play/pause playback
- Arrow keys: Nudge selected element by 1px (Shift+arrow for 10px)

**Scope**:
- **In-scope**: Keyboard event handlers in EditorPage and LivePage, shortcut registry, visual shortcut hints in tooltips
- **Out-of-scope**: Customizable keybindings, conflict detection with browser shortcuts, international keyboard layouts

**Risks & Mitigations**:
1. **Browser shortcut conflicts** — Some shortcuts (Ctrl+T, Ctrl+W) are reserved; mitigate by using alternative combos and documenting conflicts
2. **Accessibility concerns** — Keyboard navigation must not trap screen reader users; ensure Escape key deselects and returns focus

**Dependencies**: None

**Success Metrics**:
- Average task completion time reduced by 20%
- Undo frequency reduced by 30% (fewer mistaken actions)

**Rough Effort**: 1-2 person-weeks (small: 1 week, likely: 1.5 weeks, large: 2 weeks)

---

### Plan B — New Feature: Element Multi-Select & Grouping

**Problem Statement**: Users can only select and manipulate one element at a time. Creating complex scenes with aligned elements requires tedious individual positioning.

**Target Users**: All users, especially those creating scenes with backgrounds + overlays + text.

**Proposed Solution**: Implement multi-select and grouping:
- **Multi-select**: Ctrl/Cmd+click to add to selection, Shift+click for range selection, drag marquee box to select multiple
- **Group operations**: Move, delete, align/distribute selected elements together
- **Visual feedback**: Selection outline around all selected elements
- **Properties panel**: Show common properties when multiple elements selected
- **Align toolbar**: Extend existing align/distribute to work with multi-selection

**Scope**:
- **In-scope**: Multi-select state in stores, marquee selection box, group transform operations, selection visual feedback
- **Out-of-scope**: Persistent groups (saved to canvas), nested groups, group expand/collapse in layer panel

**Risks & Mitigations**:
1. **State complexity** — Multi-select adds complexity to undo/redo; mitigate by storing selection as part of history
2. **Transformer conflicts** — Konva Transformer doesn't natively support multi-selection; may need custom implementation or multiple transformers

**Dependencies**: Plan A (keyboard shortcuts for Ctrl+click selection)

**Success Metrics**:
- Time to align 5 elements reduced from 2 minutes to 30 seconds
- User satisfaction score for "ease of layout" increased by 1 point

**Rough Effort**: 2-3 person-weeks (small: 2 weeks, likely: 2.5 weeks, large: 3 weeks)

---

### Plan C — Iteration: Timeline Performance Optimization

**Problem Statement**: The timeline ruler component becomes sluggish with >50 elements. Frame scrubbing and zoom operations drop below 30fps, causing a laggy feel.

**Target Users**: Video editor users working with complex scenes.

**Proposed Solution**: Optimize timeline rendering performance:
- **Virtualization**: Only render visible track segments in the ruler
- **Memoization**: Cache ruler calculations and avoid re-renders on unchanged frames
- **Debounced zoom**: Delay zoom updates until user stops scrolling
- **Canvas optimization**: Use canvas 2D API directly instead of React components for ruler marks
- **Element culling**: Don't render off-screen elements in the canvas player

**Scope**:
- **In-scope**: TimelineRuler virtualization, zoom debouncing, memoization in editorStore selectors
- **Out-of-scope**: Web Workers for canvas rendering, WASM acceleration, server-side rendering

**Risks & Mitigations**:
1. **Breaking changes to track data** — Virtualization requires track indexing changes; mitigate by keeping existing data format
2. **Visual regression** — Virtualization may cause scroll position jumps; test thoroughly with various track lengths

**Dependencies**: None

**Success Metrics**:
- Maintain >30fps during timeline scrubbing with 100 elements
- Initial render time for timeline reduced by 50%

**Rough Effort**: 1-2 person-weeks (small: 1 week, likely: 1.5 weeks, large: 2 weeks)

---

## ROI Evaluation

| Plan | Impact (1-5) | Reach (1-5) | Confidence (1-5) | Effort (1-5) | ROI = (I*R*C)/E |
| ---- | -----------: | ----------: | ---------------: | -----------: | --------------: |
| A — Keyboard Shortcuts | 4 | 5 | 5 | 2 | **25.00** |
| B — Multi-Select | 5 | 4 | 4 | 3 | **10.67** |
| C — Timeline Perf | 3 | 3 | 4 | 2 | **9.00** |

**Scoring Notes**:
- **Plan A (Keyboard)**: High confidence because undo/redo already implemented, just needs extension. High reach affects all users. Medium-low effort (well-contained scope).
- **Plan B (Multi-Select)**: High impact but lower confidence due to Konva Transformer limitations. Medium-high effort due to state complexity.
- **Plan C (Performance)**: Lower impact (only affects power users with large projects). Lower reach (not all users hit performance limits).

---

## Recommendation

### Recommended: Plan A — Keyboard Shortcuts System

**Why**:
1. **Highest ROI** (25.00) — Best bang for buck
2. **Universal benefit** — All users, from beginners to power users, benefit immediately
3. **Low risk** — Well-understood scope, no external dependencies, minimal breaking change risk
4. **Foundation for future** — Required infrastructure for Plan B (multi-select needs keyboard modifiers)

**Week-1 De-risking**:
- Day 1-2: Audit existing keyboard handling in Player.tsx (already has some), identify conflicts
- Day 3-4: Implement core shortcuts (delete, undo, redo) in EditorPage
- Day 5: Test across browsers, document conflicts

**MVP Slice**:
1. Delete/Backspace to remove selected element
2. Ctrl/Cmd+Z/Y for undo/redo (already partially implemented)
3. Arrow keys for nudge (1px/10px)
4. Visual tooltip hints showing shortcuts

**Timeline**:
- **Week 1**: Core shortcuts (delete, undo, redo, nudge)
- **Week 2**: Extended shortcuts (duplicate, copy/paste, zoom), tooltip hints, testing

**Decision Log**:
- **Assumption**: Users want standard shortcuts (matching Figma/Photoshop conventions)
- **Data that would change decision**: User analytics showing low keyboard usage in similar tools
- **Alternative considered**: Plan B (multi-select) — deferred because it depends on keyboard modifiers anyway

---

## Next Steps

1. **Confirm recommendation** with Mafuli
2. Proceed to **Phase 2: Proposal** — Create OpenSpec change `keyboard-shortcuts`
3. Create artifacts: proposal.md, design.md, tasks.md
