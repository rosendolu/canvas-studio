# nextjs-route-handlers

This is an **infrastructure refactor** — all capabilities remain the same. The API surface (endpoints, request/response shapes, validation rules, business logic) is preserved verbatim; only the framework that implements it changes from NestJS to Next.js Route Handlers.

## API Endpoints

All endpoints remain unchanged:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/canvas` | Create canvas |
| `GET` | `/api/canvas` | List canvases |
| `GET` | `/api/canvas/:id` | Get single canvas |
| `PATCH` | `/api/canvas/:id` | Update canvas info |
| `PUT` | `/api/canvas/:id/pages` | Save live room pages state |
| `PUT` | `/api/canvas/:id/track` | Save editor track state |
| `POST` | `/api/canvas/:id/duplicate` | Duplicate canvas |
| `DELETE` | `/api/canvas/:id` | Delete canvas |
| `POST` | `/api/project` | Create project |
| `GET` | `/api/project` | List projects |
| `PATCH` | `/api/project/:id` | Update project |
| `DELETE` | `/api/project/:id` | Delete project |
| `GET` | `/api/assets` | List assets |
| `GET` | `/api/assets/:id` | Get asset metadata |
| `POST` | `/api/assets/upload` | Upload asset (multipart) |
| `GET` | `/api/assets/file/:storageKey` | Serve asset file |
| `PUT` | `/api/assets/:id` | Update asset metadata |
| `DELETE` | `/api/assets/:id` | Delete asset |
| `GET` | `/api/templates` | List templates |
| `GET` | `/api/templates/:id` | Get template |
| `POST` | `/api/templates` | Create template |
| `PUT` | `/api/templates/:id` | Update template |
| `POST` | `/api/templates/:id/duplicate` | Duplicate template |
| `DELETE` | `/api/templates/:id` | Delete template |
| `GET` | `/api/brand-kits` | List brand kits |
| `GET` | `/api/brand-kits/:id` | Get brand kit |
| `POST` | `/api/brand-kits` | Create brand kit |
| `PUT` | `/api/brand-kits/:id` | Update brand kit |
| `POST` | `/api/brand-kits/:id/duplicate` | Duplicate brand kit |
| `DELETE` | `/api/brand-kits/:id` | Delete brand kit |
| `POST` | `/api/share` | Create share link |
| `GET` | `/api/share/:shareId` | Get shared canvas |
| `DELETE` | `/api/share/:shareId` | Delete share link |

## Validation Rules

Preserved from original DTOs:

- `CreateCanvasDto`: `name` required string; `mode` optional enum `live|editor`; `aspectRatio`, `bgColor`, `thumbnail`, `projectId`, `themeColor` optional string; `isPublic` optional boolean
- `UpdateCanvasDto`: all fields optional; `pages` and `track` optional arrays
- `CreateProjectDto`: `name` required string; `description`, `thumbnail`, `themeColor` optional string; `isPublic` optional boolean
- `ListAssetsDto`: `assetType` optional enum; `q` optional string; `tags` optional string array
- `UpdateAssetDto`: `name` optional string; `assetType` optional enum; `tags` optional string array
- `CreateTemplateDto`: `name` required string (max 100); `type` required enum `scene|overlay`; `description`, `thumbnail` optional string; `tags` optional string array; `payload` required object
- `UpdateTemplateDto`: all fields optional
- `CreateBrandKitDto`: `name` required string (max 100); `palette` optional array of `{label, value}`; `typography` optional array of `{fontFamily, fontSize, color, lineHeight?}`; `logoAssetId` optional string
- `UpdateBrandKitDto`: all fields optional
- `CreateShareDto`: `snapshot` required object; `aspectRatio` required string; `bgColor`, `expiry` optional; `allowFork` optional boolean

Asset upload constraints: MIME allowlist (`image/*`, `image/svg+xml`, `image/apng`); max size 20 MB.

## File Layout

```
apps/web/src/
├── app/
│   ├── api/
│   │   ├── canvas/route.ts
│   │   ├── canvas/[id]/route.ts
│   │   ├── canvas/[id]/pages/route.ts
│   │   ├── canvas/[id]/track/route.ts
│   │   ├── canvas/[id]/duplicate/route.ts
│   │   ├── project/route.ts
│   │   ├── project/[id]/route.ts
│   │   ├── assets/
│   │   │   ├── route.ts          ← list + upload
│   │   │   ├── [id]/route.ts     ← get/update/delete metadata
│   │   │   └── file/[storageKey]/route.ts  ← serve file
│   │   ├── templates/
│   │   │   ├── route.ts
│   │   │   ├── [id]/route.ts
│   │   │   └── [id]/duplicate/route.ts
│   │   ├── brand-kits/
│   │   │   ├── route.ts
│   │   │   ├── [id]/route.ts
│   │   │   └── [id]/duplicate/route.ts
│   │   └── share/
│   │       ├── route.ts
│   │       └── [shareId]/route.ts
│   └── layout.tsx
└── lib/
    ├── mongodb.ts               ← existing singleton
    ├── models/
    │   ├── canvas.ts
    │   ├── project.ts
    │   ├── asset.ts
    │   ├── template.ts
    │   ├── brandkit.ts
    │   └── share.ts
    ├── schemas/                 ← Zod schemas (replacing DTOs)
    │   ├── canvas.ts
    │   ├── project.ts
    │   ├── asset.ts
    │   ├── template.ts
    │   ├── brandkit.ts
    │   └── share.ts
    └── services/                ← migrated business logic
        ├── canvas.ts
        ├── project.ts
        ├── asset.ts
        ├── template.ts
        ├── brandkit.ts
        └── share.ts

public/
└── uploads/
    └── assets/                  ← asset storage (gitkeep)
```
