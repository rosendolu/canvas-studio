## Context

Canvas Studio already supports rich canvas composition (Konva/react-konva) with element menus, live-room pages, and editor timeline state persisted via the backend. Users frequently repeat the same scene layouts and overlays across projects/sessions, and repeatedly upload or re-select the same assets (stickers/backgrounds/APNG). There is currently no first-class concept of reusable templates, reusable element groups, or a centralized asset library and brand kit.

This change adds:
- A template system for canvases and element groups, plus brand kits
- An asset library for reusable media and style presets

Constraints and assumptions:
- Canvas state can be serialized/deserialized (already used for saving “pages” and “track”).
- The backend is NestJS + MongoDB; we will store metadata in MongoDB and store binary asset files using a pragmatic approach (disk in dev; pluggable for production).
- The frontend is React + Mantine; we can add panels and modals without changing the overall layout approach.

## Goals / Non-Goals

**Goals:**
- Provide reusable **scene templates** (entire canvas state) and **overlay templates** (a selected group of elements) that can be created from the editor and applied later.
- Provide reusable **brand kits** (colors, fonts/text presets, logo references) that can be applied to templates/canvases and used as defaults for new elements.
- Provide an **asset library** for uploading/browsing/searching/categorizing assets and inserting them into the canvas.
- Support safe application modes:
  - Replace current canvas with a scene template
  - Merge template contents into current canvas (with deterministic ID remapping)
- Keep the system extensible so future asset types (video, Lottie, audio) can be added without redesigning everything.

**Non-Goals:**
- Real-time multi-user collaboration or operational transforms.
- Full WYSIWYG brand enforcement (e.g., automatically recoloring arbitrary bitmaps).
- Advanced rights management/teams/roles; initial scope assumes a single-owner workspace model (can be extended later).
- CDN optimization and global edge caching beyond a minimal upload/download pipeline.

## Decisions

1) **Data model: separate metadata from canvas payload**
- **Decision**: Store templates/brand kits/assets as MongoDB documents with:
  - Stable identifiers, ownership fields, tags, created/updated timestamps
  - For templates: a `payload` field containing the serialized canvas subset (scene) or selected elements (overlay)
  - For assets: a `storageKey` plus `mimeType`, `size`, `width/height` (when applicable), and optional `checksum`
- **Why**: Metadata enables filtering/searching and management; payload is used for actual insertion/application. Decoupling avoids overloading canvas/project documents.
- **Alternatives**:
  - Embed templates inside project/canvas documents → harder to reuse across projects and may bloat canvas docs.
  - Store everything as files (JSON + assets) → adds complexity and transactional concerns early.

2) **Template application requires ID remapping and reference normalization**
- **Decision**: When applying a template, always remap element IDs to new IDs, and normalize any internal references (e.g., parent/child grouping, z-order, timeline references if present).
- **Why**: Prevent collisions with existing canvas elements and ensure deterministic merges.
- **Alternatives**:
  - Keep original IDs and “namespace” them → leaks implementation detail into payload and increases complexity across the app.

3) **Asset storage: pluggable storage interface; local disk default**
- **Decision**: Introduce an asset storage abstraction in the backend (e.g., `AssetStorage` with `put/get/delete`) with local-disk storage as the initial implementation.
- **Why**: Keeps development simple and enables later migration to S3/R2/minio without changing API contracts.
- **Alternatives**:
  - Use GridFS in MongoDB → convenient but couples binary storage to Mongo scaling and adds operational complexity.
  - Ship as S3-only → adds infra dependency and slows adoption for local usage.

4) **Asset insertion uses existing element types and creation paths**
- **Decision**: Treat library assets primarily as “sources” for existing elements (image/apng/text presets), rather than inventing new element primitives.
- **Why**: Minimizes disruption and leverages existing rendering/export logic.
- **Alternatives**:
  - Create a new “asset element” type that dereferences assets at runtime → adds indirection across rendering/export and complicates offline behavior.

5) **Brand kit application is declarative and opt-in**
- **Decision**: Brand kits provide defaults (palette, typography tokens, logo references). Applying a brand kit updates template metadata and optionally updates compatible element properties (text styles, bubble styles) when explicitly requested.
- **Why**: Avoids surprising automatic transformations while still enabling consistency.
- **Alternatives**:
  - Auto-enforce brand styles on every edit → high risk of user frustration and complex edge cases.

## Risks / Trade-offs

- **[Large payloads in MongoDB]** Template payloads could be big → **Mitigation**: compress JSON payloads, cap size, and encourage overlay templates for reuse; add pagination and server-side projections for list endpoints.
- **[Merge correctness]** ID remapping bugs could corrupt canvases → **Mitigation**: centralize remapping utilities, add test vectors for representative payload shapes, and provide preview/undo.
- **[Asset storage growth]** Local disk can fill up → **Mitigation**: enforce per-workspace quota and allow deletion/cleanup; make storage backend swappable.
- **[Consistency between asset metadata and file]** Orphaned files/documents → **Mitigation**: transactional-ish flow (write file, then write doc; delete file on doc failure; background cleanup job).
- **[Search UX complexity]** Tags vs folders vs query → **Mitigation**: start with tags + text search + “recently used”; defer folders to later.

