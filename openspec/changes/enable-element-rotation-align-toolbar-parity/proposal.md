# Proposal: Enable Element Rotation & Align Toolbar Parity Between Editors

## What

1. Enable rotation on CanvasPlayer Transformer (rotateEnabled=true, use existing snaps/ sync).
2. Port element align/distribute toolbar from ImageEditorPage to EditorPage (video mode).

## Why

**Current Problems**
- Transformer rotateEnabled=false blocks rotation UI despite full sync logic (updates.rotation).
- Git log shows align/distribute merged for ImageEditorPage (live, PR#13) but absent in EditorPage (video/timeline) — feature parity bug.

**Impact**
| Issue | EditorPage (Video) | ImageEditorPage (Live) |
|-------|--------------------|------------------------|
| Rotation disabled | ✅ Broken | ✅ Broken |
| Align toolbar missing | ✅ Missing | ✅ Implemented |

## Non-goals
- Custom rotation limits per element
- Mobile gesture rotation
- Backend changes

