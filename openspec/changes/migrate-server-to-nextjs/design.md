## Context

After migrating the frontend from Vite to Next.js 16, `apps/server` (NestJS) is running but never started as part of the dev workflow. `serve-static.js` served the old Vite `dist/` build, now replaced by Next.js. The Next.js app already imports from `apps/web/src/lib/mongodb.ts` directly — MongoDB is reachable, but the app has no API routes.

The codebase currently has **two parallel MongoDB layers** with zero overlap:

```
apps/server/src/   →  NestJS controllers → services → Mongoose models
apps/web/src/lib/   →  direct Mongoose model imports (no API surface)
```

This design consolidates all backend logic into Next.js Route Handlers.

## Goals / Non-Goals

**Goals:**
- Single code path for all API operations
- All NestJS business logic preserved (validation, storage, expiry, deduplication)
- Clean separation: Route Handlers → service functions → Mongoose models
- Asset upload + file serving fully functional in Next.js

**Non-Goals:**
- This is not a rewrite — service logic is migrated, not reimagined
- Swagger UI is not re-added (would require an additional package)
- MongoDB connection pooling settings are not tuned (keep current defaults)
- Authentication/authorization is out of scope (no change to current unauthenticated state)

## Decisions

### 1. Validation: class-validator → Zod

**Decision:** Replace all NestJS DTO decorators (`@IsString()`, `@IsOptional()`, `@IsEnum(...)`) with Zod schemas.

**Rationale:** Next.js ecosystem fully embraces Zod (`apps/web/package.json` already has `"zod": "^4.3.6"`). TypeScript inference from Zod is superior. `class-validator` is NestJS-specific and has no place in a Next.js Route Handler.

**Alternatives considered:**
- Keep class-validator + class-transformer → requires extra packages (`@nestjs/class-validator` equivalent for Next.js), not idiomatic
- Write manual TypeScript type guards → tedious, no runtime safety

### 2. Architecture: Route Handler + service file pattern

**Decision:** Each entity gets a file pair: `app/api/<entity>/route.ts` (handler) + `lib/services/<entity>.ts` (business logic).

**Rationale:** Mirrors the NestJS Controller/Service split without the module system. Keeps route handlers thin (parse → validate → call service → return JSON). Business logic stays in testable, pure-async service functions.

**Alternatives considered:**
- Put everything in Route Handlers → handlers become 100+ lines, untestable
- Use a separate route utility abstraction → adds indirection for a small API surface

### 3. Asset storage: local filesystem → `public/` directory

**Decision:** Keep asset files in `apps/web/public/uploads/assets/`, serve via Next.js static file serving.

**Rationale:** `AssetStorageService` already writes to a local directory. Moving to `public/` means Next.js handles file serving automatically (no custom route needed for `/api/assets/file/:storageKey`). The storage service is adapted to use `process.cwd()` relative paths.

**Alternatives considered:**
- Keep custom file serving Route Handler → unnecessary, Next.js static serving is faster
- Upload to cloud storage (S3/Cloudflare R2) → out of scope, adds external dependency

### 4. Mongoose models: NestJS decorators → plain Mongoose

**Decision:** Re-implement all schemas as plain Mongoose schemas (no NestJS decorators like `@Schema()`, `@Prop()`).

**Rationale:** `apps/web/src/lib/models/` already has plain Mongoose schemas. NestJS `@Schema()` decorators map to the same Mongoose schema under the hood — plain schemas are more portable and require no `class-transformer` runtime.

**Alternatives considered:**
- Keep NestJS schema format → requires `@nestjs/mongoose`, incompatible with plain Next.js
- Create unified schema utility → unnecessary indirection

### 5. Error responses: NestJS exceptions → Next.js `NextResponse` with consistent JSON shape

**Decision:** Use `NextResponse.json({ error: string, ... }, { status: N })` for all error cases.

**Rationale:** Standard Next.js pattern. Match existing `{ success: true }` return shape for mutations.

**NestJS → Next.js error mapping:**
| NestJS | Next.js Status |
|--------|----------------|
| `NotFoundException` | 404 |
| `BadRequestException` | 400 |
| `GoneException` | 410 |
| No exception (null result) | 404 (converted in service) |

## Risks / Trade-offs

- **Risk:** `mongoose` is listed in both `apps/server/package.json` AND `apps/web/package.json`. After migration, server's copy is gone but web's copy remains — no conflict, but verify only one version in `node_modules`.
- **Risk:** Asset upload requires `multipart/form-data` parsing in Next.js. Will add `nextjs-multiparty` or `formidable`. This is a new dependency for `apps/web`.
- **Risk:** `nanoid` is in `apps/server/package.json` but not `apps/web/package.json`. Need to verify `nanoid@5.x` is added to web dependencies.
- **Trade-off:** Removing NestJS means no more Swagger UI at `/api/docs`. If API documentation is important, consider adding `@scalar/blade` or a simple `/api` page with OpenAPI JSON at `/api/openapi.json`.
- **Trade-off:** Route Handlers in Next.js are deployed with the Next.js app. If server and web were ever deployed separately (e.g., CDN + API origin), this consolidation prevents that split. Given current usage, this is not a concern.

## Migration Plan

### Phase 1 — Scaffold

1. Create `apps/web/src/app/api/` directory structure
2. Add missing dependencies to `apps/web/package.json`: `formidable`, `nanoid`
3. Create `lib/services/` directory

### Phase 2 — Core models and services

4. Migrate each entity: schema → `lib/models/`, service logic → `lib/services/`
   - Canvas, Project, Template, Asset, BrandKit, Share
5. Write Zod schemas in `lib/schemas/` (replacing all DTOs)
6. Add `public/uploads/assets/` directory (gitkeep)

### Phase 3 — Route Handlers

7. Write `GET|POST|PATCH|DELETE` Route Handlers for each entity
8. Implement multipart upload handler for assets
9. Wire `connectDB()` at top of each handler (singleton already in `lib/mongodb.ts`)

### Phase 4 — Cleanup

10. Verify all API endpoints work (test with `curl` or Postman)
11. Delete `apps/server/` directory
12. Delete `serve-static.js`
13. Update `root package.json` scripts: remove `dev:server`, remove `apps/server` from workspaces
14. Update `README.md`: remove server setup instructions, update scripts
15. Update `.env` guidance in README: move `MONGODB_URI` to `apps/web/.env`

### Rollback

- Keep `git` history of deleted files — can restore `apps/server/` if needed
- No database migration needed (same MongoDB collections, same schema format)
