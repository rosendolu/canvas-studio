## Why

Creators building live rooms and editing timelines repeatedly assemble the same layouts (scenes), element groups (overlays), and brand styling. Today this work is largely “one-off”, which slows down creation, increases inconsistency, and raises the cost of iteration.

This change introduces first-class templates and an asset library so users can start faster, reuse proven designs, and keep a consistent visual identity across projects.

## What Changes

- Add a **Template system** that allows saving and reusing:
  - Full canvases as templates (scene templates)
  - Element groups as templates (overlay templates)
  - Brand kits (colors, typography, logo) for consistent styling
- Add an **Asset library** that supports browsing, searching, and inserting reusable assets:
  - Static images (stickers, products, backgrounds)
  - Animated APNG stickers (where supported by existing element types)
  - Text styles (preset typography + bubble styles)
- Add CRUD APIs and persistence for templates, assets, and brand kits.
- Add editor UX for:
  - Creating templates from the current canvas/selection
  - Applying templates to a canvas (replace / merge options)
  - Managing assets (upload, tag, delete) and inserting into canvas

## Capabilities

### New Capabilities

- `template-system`: Define, save, apply, and manage canvas/overlay templates and brand kits.
- `asset-library`: Upload, categorize, search, and insert reusable assets (images/APNG/text styles) into the editor.

### Modified Capabilities

- (none)

## Impact

- **Frontend (apps/web)**: New UI panels (Templates, Assets, Brand Kit), new interactions for “Save as template” and “Apply template”, updates to element creation flows to support insert-from-library.
- **Backend (apps/server)**: New modules/models/controllers for templates, assets, and brand kits; likely new endpoints and storage strategy for asset files/metadata.
- **Shared (packages/canvas-core)**: New shared types for template/asset metadata and brand kit definitions; possible import/export helpers for serializing canvas state subsets.

