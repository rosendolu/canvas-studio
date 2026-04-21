## Product context

- Product snapshot: Canvas Studio — open-source canvas editor for live streaming rooms and video editing experiences. Users: content creators, streamers, video editors. Primary journey: drag/drop/resize/rotate elements on canvas, timeline scrubbing, export/share.
- Business goal (Q2 2026): User growth and retention via core editing feature completeness (commercial license adoption).
- Current pain: 1. Transformer rotation disabled (rotateEnabled=false) despite backend sync. 2. Align/distribute toolbar implemented only in ImageEditorPage (live mode), missing in EditorPage (video/timeline mode) — feature parity gap. 3. Untracked pending OpenSpec change highlights UX inconsistencies.
- Constraints: React/Vite/Mantine/Konva monorepo + NestJS/Mongo backend. No mobile. Keep scoped to frontend canvas logic.
- Success metrics: 1. 100% feature parity between EditorPage/ImageEditorPage (rotation + align). 2. Zero transformer bugs. 3. +20% session time on canvas (inferred).
- Assumptions: Parity is top priority post-recent features (share, templates). Effort estimates for solo dev cycle.

## Requirement plans

### Plan A — Defect fix

**Problem statement**: CanvasPlayer Transformer has rotateEnabled=false, blocking rotation UI despite full rotation state sync (updates.rotation).

**Target users**: All canvas users attempting rotation (core UX).

**Proposed solution**: Flip rotateEnabled=true on CanvasPlayer Transformer. Leverage existing snaps/bounds sync. Test rotate persistence/load in both EditorPage/ImageEditorPage.

**Scope**:
- In: Transformer prop toggle + smoke tests (rotate element → save/load).
- Out: Custom snap angles, gesture limits.

**Risks & mitigations**:
- Sync desync: Add unit test for rotation state roundtrip.
- Konva perf regression: Profile before/after.

**Dependencies**: None (frontend only).

**Success metrics**: Rotation works end-to-end in both pages; no regressions.

**Rough effort**: 0.5 pw (small/likely/large: 0.25/0.5/1).

### Plan B — New feature

**Problem statement**: No asset import from URL (e.g., dynamic backgrounds/stickers from live stream overlays).

**Target users**: Streamers needing real-time asset pulls.

**Proposed solution**: Add "Import Image URL" button in ElementMenu → fetch Blob → create ImageElement. Handle CORS/proxy via backend endpoint (/api/proxy-image). Throttle/validation.

**Scope**:
- In: Frontend fetch + element creation; simple backend proxy.
- Out: Video/GIF import, auth-protected URLs.

**Risks & mitigations**:
- CORS/security: Backend proxy + size/type validation.
- Abuse: Rate-limit endpoint.

**Dependencies**: Backend canvas module.

**Success metrics**: 10+ URL imports/session; <2s load time.

**Rough effort**: 2 pw (1.5/2/3).

### Plan C — Iteration/optimization

**Problem statement**: Align/distribute toolbar missing in EditorPage (video mode); parity with ImageEditorPage.

**Target users**: Multi-element editors (groups, layouts).

**Proposed solution**: Port alignToolbar from ImageEditorPage to EditorPage. Reuse toolbar logic (left/center/right etc. + distribute H/V). Wire to selection/canvas basis.

**Scope**:
- In: Component port + event handlers.
- Out: New align modes.

**Risks & mitigations**:
- Selection state mismatch: Sync via Zustand store.
- UI overlap: Responsive checks.

**Dependencies**: Existing toolbar code.

**Success metrics**: Toolbar functional in EditorPage; usage >5%/session.

**Rough effort**: 1 pw (0.75/1/1.5).

## ROI evaluation

| Plan | Impact (1-5) | Reach (1-5) | Confidence (1-5) | Effort (1-5) | ROI = (I*R*C)/E |
| ---- | -----------: | ----------: | ---------------: | -----------: | --------------: |
| A    | 4            | 5           | 5                | 1            | 100.00          |
| B    | 5            | 4           | 3                | 4            | 15.00           |
| C    | 4            | 4           | 5                | 2            | 40.00           |

## Recommendation

- Recommended: Plan A (Enable rotation defect fix)
- Why: Highest ROI (100). Core UX blocker affecting all users; trivial effort. Strategic fit: Unblocks advanced layouts before new features. Parity (Plan C) next at ROI 40.
- Week-1 de-risking: Toggle prop → manual test rotate/save/load in both pages.
- MVP slice: Rotation toggle only (no snaps polish).
- Timeline: Day1: Toggle+test. Day2: PR/review/merge.
- Decision log: Inferred pains from git log/untracked OpenSpec. Would pivot if analytics show low rotation attempts.