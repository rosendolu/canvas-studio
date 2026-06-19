OpenSpec Change: iterate-automatically_canvas-studio/defect-fix

Plan A selected: Defect Fix for Iterate-Automatically Canvas Studio

Summary:
- Goal: stabilize core interactions during daily iterate-automatically runs by fixing avatar drift, mask coordinate drift, canvas resize offsets, and transformer capture ordering for /picture type rendering.
- Rationale: highest ROI among three options (I=4, R=4, C=4, E=2; ROI = (4*4*4)/2 = 32). This reduces risk and improves reliability in a core workflow.

Artifacts:
- Phase 1: Completed; Plan A chosen as final requirement.
- Phase 2: OpenSpec proposal artifacts generated (defect-fix scope, design, tasks placeholders).
- Phase 3: Implementation will begin on feature branch; PR to main to be created after review.
- Phase 4: Archive planned after PR merged.

Dependencies:
- Canvas Studio runtime stability, avatar/mask rendering paths, transformer capture order.
- Test coverage for /picture type rendering in iterate-automatically flow.

Risks & Mitigations:
- Risk: regression in unrelated canvas interactions. Mitigation: targeted changes with regression tests and incremental rollout.
- Risk: insufficient coverage of edge cases in /picture type rendering. Mitigation: add/extend test matrix and manual validation of daily iterations.

Success metrics:
- Reduction of drift and alignment issues in avatar/mask/render paths by at least 90% in automated checks.
- No new rendering regressions reported in daily iterate runs over 2 weeks.

Rough effort:
- 2-4 person-weeks (defect-focused, risk-limited).

Final note:
- This plan is intended to establish a solid reliability baseline and reduce daily drift in core flows.
