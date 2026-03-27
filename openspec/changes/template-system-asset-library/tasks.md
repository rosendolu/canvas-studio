## 1. Backend data model & API scaffolding

- [ ] 1.1 Create NestJS module(s) for templates, brand kits, and assets (controllers/services/schemas)
- [ ] 1.2 Define MongoDB/Mongoose schemas for Template, BrandKit, and Asset metadata
- [ ] 1.3 Add list endpoints with filtering (type/tags/search) for templates and assets
- [ ] 1.4 Add CRUD endpoints for templates (create/update/duplicate/delete)
- [ ] 1.5 Add CRUD endpoints for brand kits (create/update/duplicate/delete)
- [ ] 1.6 Add CRUD endpoints for assets metadata (update name/tags, delete)

## 2. Asset binary storage pipeline

- [ ] 2.1 Implement asset storage abstraction interface (put/get/delete)
- [ ] 2.2 Implement local-disk storage provider (dev default)
- [ ] 2.3 Implement upload endpoint for assets (multipart) writing file then metadata doc
- [ ] 2.4 Implement asset download/serve route (by asset id/storageKey) with correct content-type
- [ ] 2.5 Add basic safety checks (max file size, allowed mime types, reject unknown types)
- [ ] 2.6 Add orphan cleanup strategy (on failed create, and periodic best-effort cleanup)

## 3. Shared types and payload utilities

- [ ] 3.1 Add shared types in `packages/canvas-core` for Template/Asset/BrandKit metadata
- [ ] 3.2 Add template payload types for scene vs overlay templates
- [ ] 3.3 Implement ID remapping utility for template application (generate new IDs, update references)
- [ ] 3.4 Add serialization helpers for extracting overlay payload from a selection

## 4. Frontend: API client + query integration

- [ ] 4.1 Add API client functions for templates/brand kits/assets (list/create/update/delete/duplicate)
- [ ] 4.2 Add React Query hooks for template and asset listing with filters/search
- [ ] 4.3 Add mutation hooks for create/update/delete actions with cache invalidation

## 5. Frontend: Templates UX (scene + overlay)

- [ ] 5.1 Add Templates panel (browse/search/filter by type)
- [ ] 5.2 Implement “Save as template” flow for scene templates (from current canvas)
- [ ] 5.3 Implement “Save as template” flow for overlay templates (from current selection)
- [ ] 5.4 Implement “Apply template” flow with replace vs merge for scene templates
- [ ] 5.5 Implement “Insert overlay template” flow and select inserted elements
- [ ] 5.6 Add template lifecycle actions in UI (rename/duplicate/delete)

## 6. Frontend: Asset library UX

- [ ] 6.1 Add Asset Library panel (browse/search/filter by type/tags)
- [ ] 6.2 Implement asset upload UI (drag/drop + progress + errors)
- [ ] 6.3 Implement asset metadata editing UI (rename/tags)
- [ ] 6.4 Implement “Insert asset” action that creates appropriate element in the canvas
- [ ] 6.5 Implement asset delete UI with confirmation
- [ ] 6.6 Add “recently used” assets section (local-only if needed)

## 7. Frontend: Brand kit UX

- [ ] 7.1 Add Brand Kit management UI (create/edit/select, rename/duplicate/delete)
- [ ] 7.2 Apply brand kit as defaults for new compatible elements (text presets at minimum)
- [ ] 7.3 Add optional “apply to existing” action for compatible elements (explicit opt-in)

## 8. Quality, docs, and hardening

- [ ] 8.1 Add server Swagger documentation for new endpoints
- [ ] 8.2 Add basic unit tests for ID remapping and overlay extraction utilities
- [ ] 8.3 Add integration tests for template create/apply API contracts (happy paths)
- [ ] 8.4 Add quotas/limits configuration knobs (max upload size, max assets per workspace)
- [ ] 8.5 Update README with feature overview and local asset storage notes

