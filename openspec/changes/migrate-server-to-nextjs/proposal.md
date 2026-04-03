## Why

`apps/server` (NestJS) and `apps/web` (Next.js) both connect to MongoDB independently, but only the Next.js frontend is actively running. The NestJS server is unused, `serve-static.js` serves a dead Vite build, and the architecture has unnecessary duplication. Consolidating everything into Next.js simplifies deployment, reduces dependencies, and removes dead code.

## What Changes

- **New**: Next.js Route Handlers for all API endpoints (Canvas, Project, Asset, BrandKit, Template, Share)
- **Migrate**: MongoDB connection from `apps/server` → `apps/web/src/lib/`
- **Migrate**: All Mongoose models from `apps/server/src/` → `apps/web/src/lib/models/`
- **Migrate**: DTO validation logic (class-validator → Zod) into Next.js route handlers
- **Remove**: `apps/server/` directory entirely
- **Remove**: `serve-static.js` file
- **Update**: Root `package.json` scripts, README documentation, environment variable guide
- **BREAKING**: Swagger docs at `/api/docs` no longer available (Next.js has no Swagger UI out of the box)

## Capabilities

### New Capabilities

- `nextjs-route-handlers`: All backend CRUD endpoints exposed as Next.js Route Handlers (`/api/canvas`, `/api/project`, etc.) with Zod validation

### Modified Capabilities

<!-- No spec-level behavior changes — this is a pure infrastructure refactor -->

## Impact

- `apps/server/` — deleted
- `serve-static.js` — deleted
- `apps/web/src/app/api/` — created (Route Handlers)
- `apps/web/src/lib/models/` — extended with all migrated models
- `apps/web/src/lib/mongodb.ts` — already exists, no change needed
- Root `package.json`, `README.md` — updated scripts and docs
