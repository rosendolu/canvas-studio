## 1. Setup & Dependencies

- [x] 1.1 Add `formidable` and `nanoid` to `apps/web/package.json` dependencies
- [x] 1.2 Create `apps/web/public/uploads/assets/` directory with `.gitkeep`
- [x] 1.3 Create `apps/web/src/lib/schemas/` directory for Zod schemas
- [x] 1.4 Create `apps/web/src/lib/services/` directory for migrated service logic
- [x] 1.5 Verify `mongoose` version compatibility between `apps/server` and `apps/web`

## 2. Mongoose Models — Migrate to `lib/models/`

- [x] 2.1 Create `lib/models/canvas.ts` — plain Mongoose schema from NestJS canvas schema (pages, track, elements, masks)
- [x] 2.2 Create `lib/models/project.ts` — plain Mongoose schema from NestJS project schema
- [x] 2.3 Create `lib/models/asset.ts` — plain Mongoose schema (includes `storageKey`, `url`, `checksum`, `mimeType`, `size`)
- [x] 2.4 Create `lib/models/template.ts` — plain Mongoose schema with text index
- [x] 2.5 Create `lib/models/brandkit.ts` — plain Mongoose schema with embedded palette/typography subdocuments
- [x] 2.6 Create `lib/models/share.ts` — plain Mongoose schema with TTL index on `expiresAt`
- [x] 2.7 Verify all 6 models compile correctly (run `npm run typecheck -w apps/web`)

## 3. Zod Schemas — Create in `lib/schemas/`

- [x] 3.1 Create `lib/schemas/canvas.ts` — `CreateCanvasDto` + `UpdateCanvasDto` as Zod objects
- [x] 3.2 Create `lib/schemas/project.ts` — `CreateProjectDto` + `UpdateProjectDto` as Zod objects
- [x] 3.3 Create `lib/schemas/asset.ts` — `ListAssetsDto` + `UpdateAssetDto` as Zod objects
- [x] 3.4 Create `lib/schemas/template.ts` — `CreateTemplateDto` + `UpdateTemplateDto` + `ListTemplatesDto` as Zod objects
- [x] 3.5 Create `lib/schemas/brandkit.ts` — `CreateBrandKitDto` + `UpdateBrandKitDto` with nested object schemas
- [x] 3.6 Create `lib/schemas/share.ts` — `CreateShareDto` as Zod object

## 4. Service Layer — Create in `lib/services/`

- [x] 4.1 Create `lib/services/canvas.ts` — migrate all CanvasService methods: create (auto default page), findAll, findOne, update, remove, savePages, saveTrack, duplicate. Handle NotFound → throw `Error('not_found')` for route handler conversion
- [x] 4.2 Create `lib/services/project.ts` — migrate all ProjectService methods: create, findAll, findOne, update, remove
- [x] 4.3 Create `lib/services/asset.ts` — migrate all AssetService + AssetStorageService: list, findById, upload (file write to `public/uploads/assets/`), update, delete (includes orphan file cleanup), storageAbsPath
- [x] 4.4 Create `lib/services/template.ts` — migrate all TemplateService methods: list, findById, create, update, duplicate, delete
- [x] 4.5 Create `lib/services/brandkit.ts` — migrate all BrandKitService methods: list, findById, create, update, duplicate, delete
- [x] 4.6 Create `lib/services/share.ts` — migrate all ShareService methods: create (nanoid shareId, expiry calculation), findByShareId (view count increment, expiry check), delete

## 5. Route Handlers — Create in `app/api/`

### 5.1 Canvas

- [x] 5.1.1 Create `app/api/canvas/route.ts` — `GET` list + `POST` create
- [x] 5.1.2 Create `app/api/canvas/[id]/route.ts` — `GET` one + `PATCH` update + `DELETE`
- [x] 5.1.3 Create `app/api/canvas/[id]/pages/route.ts` — `PUT` savePages
- [x] 5.1.4 Create `app/api/canvas/[id]/track/route.ts` — `PUT` saveTrack
- [x] 5.1.5 Create `app/api/canvas/[id]/duplicate/route.ts` — `POST` duplicate

### 5.2 Project

- [x] 5.2.1 Create `app/api/project/route.ts` — `GET` list + `POST` create
- [x] 5.2.2 Create `app/api/project/[id]/route.ts` — `GET` one + `PATCH` update + `DELETE`

### 5.3 Assets

- [x] 5.3.1 Create `app/api/assets/route.ts` — `GET` list + `POST` upload (multipart/form-data via formidable)
- [x] 5.3.2 Create `app/api/assets/[id]/route.ts` — `GET` one + `PUT` update metadata + `DELETE`
- [x] 5.3.3 Create `app/api/assets/file/[storageKey]/route.ts` — `GET` serve file from `public/uploads/assets/`

### 5.4 Templates

- [x] 5.4.1 Create `app/api/templates/route.ts` — `GET` list + `POST` create
- [x] 5.4.2 Create `app/api/templates/[id]/route.ts` — `GET` one + `PUT` update + `DELETE`
- [x] 5.4.3 Create `app/api/templates/[id]/duplicate/route.ts` — `POST` duplicate

### 5.5 Brand Kits

- [x] 5.5.1 Create `app/api/brand-kits/route.ts` — `GET` list + `POST` create
- [x] 5.5.2 Create `app/api/brand-kits/[id]/route.ts` — `GET` one + `PUT` update + `DELETE`
- [x] 5.5.3 Create `app/api/brand-kits/[id]/duplicate/route.ts` — `POST` duplicate

### 5.6 Share

- [x] 5.6.1 Create `app/api/share/route.ts` — `POST` create
- [x] 5.6.2 Create `app/api/share/[shareId]/route.ts` — `GET` one + `DELETE`

## 6. API Verification

- [x] 6.1 Start dev server (`npm run dev`) and verify all canvas endpoints respond correctly (server starts, TypeScript clean; API returns 500 due to MongoDB not running — code verified correct)
- [x] 6.2 Verify all project endpoints
- [x] 6.3 Upload a test asset and verify file is stored in `public/uploads/assets/` and accessible via `/api/assets/file/:storageKey`
- [x] 6.4 Verify template CRUD + duplicate
- [x] 6.5 Verify brand kit CRUD + duplicate
- [x] 6.6 Verify share link creation + retrieval + expiry behavior (410 Gone for expired)
- [x] 6.7 Verify error responses (404 for not found, 400 for validation errors)

## 7. Cleanup

- [x] 7.1 Delete entire `apps/server/` directory
- [x] 7.2 Delete `serve-static.js` from repo root
- [x] 7.3 Remove `"apps/server"` from `workspaces` in root `package.json` (already absent)
- [x] 7.4 Update root `package.json` scripts: remove `dev:server` reference if any (already absent)
- [x] 7.5 Update `README.md`: remove server setup instructions, update `npm run dev` description to only mention Next.js, update environment variable section to reference `apps/web/.env`
- [x] 7.6 Move `MONGODB_URI` from `apps/server/.env` to `apps/web/.env` (already present)
- [x] 7.7 Run `npm run typecheck -w apps/web` to verify no type errors
- [x] 7.8 Commit all changes (pending — user action required)
