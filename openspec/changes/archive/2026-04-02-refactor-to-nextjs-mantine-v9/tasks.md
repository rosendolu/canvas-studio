## 1. Project Scaffold & Dependency Upgrade

- [ ] 1.1 Remove existing `apps/web/` (Vite) — back up content first to `apps/web-vite-backup/`
- [ ] 1.2 Create Next.js 16 app: `npx create-next-app@latest apps/web --typescript --eslint --app --src-dir --import-alias "@/*" --no-tailwind`
- [ ] 1.3 Update root `package.json` workspaces: ensure `"apps/web"` is included and `"apps/server"` is removed
- [ ] 1.4 Upgrade React: `npm install react@19 react-dom@19 -w apps/web`
- [ ] 1.5 Upgrade Mantine: `npm install @mantine/core@9 @mantine/hooks@9 @mantine/notifications@9 @mantine/modals@9 -w apps/web`
- [ ] 1.6 Remove React 18: `npm uninstall react react-dom -w apps/web` (verify only React 19 remains)
- [ ] 1.7 Remove Mantine v7 ecosystem: `npm uninstall @mantine/core@7 @mantine/hooks@7 @mantine/notifications@7 -w apps/web`
- [ ] 1.8 Install remaining React 19 compatible deps: `npm install @tanstack/react-query@latest react-konva@latest konva@latest zustand@latest -w apps/web`
- [ ] 1.9 Install Mantine v9 compatible PostCSS: `npm install postcss postcss-preset-mantine -w apps/web`
- [ ] 1.10 Install Zod for API validation: `npm install zod -w apps/web`
- [ ] 1.11 Install mongoose: `npm install mongoose -w apps/web`
- [ ] 1.12 Install nanoid: `npm install nanoid -w apps/web`
- [ ] 1.13 Install @tabler/icons-react: `npm install @tabler/icons-react -w apps/web`
- [ ] 1.14 Install lodash-es: `npm install lodash-es -w apps/web`
- [ ] 1.15 Install i18next ecosystem: `npm install i18next react-i18next -w apps/web`
- [ ] 1.16 Uninstall Vite and React Router: `npm uninstall vite @vitejs/plugin-react react-router-dom -w apps/web`
- [ ] 1.17 Verify monorepo root `npm install` succeeds
- [ ] 1.18 Verify `npm run dev -w apps/web` starts Next.js dev server on port 3000

## 2. Shared Database Layer (`lib/db/`)

- [ ] 2.1 Create `apps/web/src/lib/mongodb.ts` with singleton pattern
- [ ] 2.2 Create `apps/web/src/lib/models/canvas.ts` — Mongoose schema from `apps/server/src/canvas/canvas.schema.ts`
- [ ] 2.3 Create `apps/web/src/lib/models/project.ts` — from `apps/server/src/project/project.schema.ts`
- [ ] 2.4 Create `apps/web/src/lib/models/template.ts` — from `apps/server/src/template/template.schema.ts`
- [ ] 2.5 Create `apps/web/src/lib/models/asset.ts` — from `apps/server/src/asset/asset.schema.ts`
- [ ] 2.6 Create `apps/web/src/lib/models/brandkit.ts` — from `apps/server/src/brandkit/brandkit.schema.ts`
- [ ] 2.7 Create `apps/web/src/lib/models/share.ts` — from `apps/server/src/share/share.schema.ts`
- [ ] 2.8 Create `apps/web/src/lib/db.ts` — exports all models and `connectDB()`
- [ ] 2.9 Create `apps/web/.env.local` with `MONGODB_URI=mongodb://localhost:27017/canvas-studio`
- [ ] 2.10 Create `apps/web/.env.example` documenting all env vars
- [ ] 2.11 TypeScript check `npx tsc --noEmit` passes for `lib/db/`

## 3. Mantine v9 Theme & Provider Setup

- [ ] 3.1 Create `apps/web/src/theme.ts` — migrate from v7 theme, fix breaking changes
- [ ] 3.2 Verify `createTheme` API matches Mantine v9 (check `colors`, `primaryColor`, `defaultRadius`)
- [ ] 3.3 Create `apps/web/src/app/providers.tsx` (Client Component) with:
  - `QueryClientProvider` (TanStack Query)
  - `MantineProvider` with v9 `theme` and `defaultColorScheme="auto"`
  - `Notifications` component
- [ ] 3.4 Create `apps/web/src/app/globals.css` — minimal CSS (Mantine handles most)
- [ ] 3.5 Create `apps/web/src/app/layout.tsx` — Root layout importing Mantine CSS, wrapping with `<Providers>`
- [ ] 3.6 Create `apps/web/src/app/page.tsx` — temporary home redirect to test provider setup
- [ ] 3.7 Run `npm run build -w apps/web` to verify Mantine v9 styles load without error

## 4. App Router Core Structure (`app/`)

- [ ] 4.1 Create `apps/web/src/app/(main)/layout.tsx` — layout with `AppLayout` header shell (Client Component)
- [ ] 4.2 Create `apps/web/src/app/(main)/editor/[id]/page.tsx` — Editor Server Component (initial data fetch)
- [ ] 4.3 Create `apps/web/src/app/(main)/editor/[id]/EditorClient.tsx` — Editor Client Component wrapper
- [ ] 4.4 Create `apps/web/src/app/(main)/editor/page.tsx` — new editor (no id)
- [ ] 4.5 Create `apps/web/src/app/(main)/image-editor/[id]/page.tsx`
- [ ] 4.6 Create `apps/web/src/app/(main)/image-editor/[id]/ImageEditorClient.tsx`
- [ ] 4.7 Create `apps/web/src/app/(main)/image-editor/page.tsx` — new image editor
- [ ] 4.8 Create `apps/web/src/app/(main)/live/page.tsx`
- [ ] 4.9 Create `apps/web/src/app/(main)/live/LiveClient.tsx`
- [ ] 4.10 Create `apps/web/src/app/(main)/loading.tsx` — skeleton spinner for main layout
- [ ] 4.11 Create `apps/web/src/app/(main)/error.tsx` — error boundary with retry
- [ ] 4.12 Create `apps/web/src/app/preview/[shareId]/page.tsx` — Preview Server Component (SSR for SEO)
- [ ] 4.13 Create `apps/web/src/app/preview/[shareId]/PreviewClient.tsx` — Preview Client Component
- [ ] 4.14 Create `apps/web/src/app/preview/loading.tsx`
- [ ] 4.15 Create `apps/web/src/app/preview/error.tsx`
- [ ] 4.16 Create `apps/web/src/app/not-found.tsx` — 404 page
- [ ] 4.17 Create `apps/web/src/app/global-error.tsx` — root error boundary
- [ ] 4.18 Verify `localhost:3000/` renders without crash

## 5. Home Page Migration

- [ ] 5.1 Create `apps/web/src/app/page.tsx` — migrate from `HomePage.tsx` (Home Server Component)
- [ ] 5.2 Move `HomePage.tsx` logic into `app/page.tsx` as named export `HomePage`
- [ ] 5.3 Replace `react-router-dom` imports: `useNavigate` → remove (use Link instead), `Link` → `next/link`
- [ ] 5.4 Fix `Navigate` → `redirect` from `next/navigation`
- [ ] 5.5 Create `apps/web/src/app/home/loading.tsx`
- [ ] 5.6 Verify home page renders with hero section and feature cards
- [ ] 5.7 Verify navigation to `/editor` works with `next/link`

## 6. Zustand Store SSR Adaptation

- [ ] 6.1 Wrap `useEditorStore` consumer in a `use client` boundary — create `apps/web/src/store/editorStore.client.ts`
- [ ] 6.2 Create `apps/web/src/store/editorStore.ts` — re-export from `editorStore.client.ts` for backward compatibility
- [ ] 6.3 Wrap `useLiveStore` consumer — same pattern for `liveStore`
- [ ] 6.4 Verify `npm run typecheck` passes for all store files
- [ ] 6.5 Ensure store initialization does NOT read `window`/`document` at module level (SSR safe)

## 7. TanStack Query SSR Hydration

- [ ] 7.1 Configure `QueryClient` with `defaultOptions` for SSR
- [ ] 7.2 Create `apps/web/src/lib/queryClient.ts` — singleton QueryClient factory
- [ ] 7.3 Update `providers.tsx` to use singleton `getQueryClient()`
- [ ] 7.4 Create `apps/web/src/lib/query-client-provider.tsx` — client-only QueryClientProvider
- [ ] 7.5 Update all API hooks to be SSR-compatible (avoid `window` in initial render)
- [ ] 7.6 Verify `QueryClientProvider` is only rendered on client side

## 8. Canvas Components Migration (Client Components)

- [ ] 8.1 Mark `CanvasPlayer.tsx` with `"use client"` directive
- [ ] 8.2 Mark `CanvasPlayer/Player.tsx` with `"use client"` directive
- [ ] 8.3 Mark `CanvasPlayer/CanvasInputLayer.tsx` with `"use client"` directive
- [ ] 8.4 Mark `CanvasPlayer/context.ts` with `"use client"` directive
- [ ] 8.5 Mark all CanvasElement components with `"use client"`:
  - `ApngCanvas.tsx`
  - `AvatarElement.tsx`
  - `BubbleText.tsx`
  - `Carousel.tsx`
  - `Slide.tsx`
  - `StaticImage.tsx`
- [ ] 8.6 Mark `TimelineRuler.tsx` with `"use client"` directive
- [ ] 8.7 Mark `PropertyPanel.tsx` with `"use client"` directive
- [ ] 8.8 Mark `ElementMenu.tsx` with `"use client"` directive
- [ ] 8.9 Mark `LayerPanel.tsx` with `"use client"` directive
- [ ] 8.10 Mark `Library/AssetLibraryPanel.tsx` with `"use client"` directive
- [ ] 8.11 Mark `Library/BrandKitPanel.tsx` with `"use client"` directive
- [ ] 8.12 Mark `Library/TemplatePanel.tsx` with `"use client"` directive
- [ ] 8.13 Mark `TemplatePicker/TemplatePicker.tsx` with `"use client"` directive
- [ ] 8.14 Mark `ShareButton/ShareButton.tsx` with `"use client"` directive
- [ ] 8.15 Mark `AlignToolbar/AlignToolbar.tsx` with `"use client"` directive
- [ ] 8.16 Mark `AppLayout.tsx` with `"use client"` directive
- [ ] 8.17 Verify all components compile without `"use client"` missing errors

## 9. Editor Page Full Migration

- [ ] 9.1 Migrate all hooks from `EditorPage.tsx` into `EditorClient.tsx`
- [ ] 9.2 Replace `useNavigate` with `useRouter` from `next/navigation`
- [ ] 9.3 Replace `<Link>` from `react-router-dom` → `next/link`
- [ ] 9.4 Replace `react-i18next` hooks (`useTranslation`) — no change needed, keep as-is
- [ ] 9.5 Replace `MantineProvider` hook usage — `useMantineColorScheme` API verified for v9
- [ ] 9.6 Replace `SegmentedControl` onChange typing if breaking change detected
- [ ] 9.7 Move playback animation loop from `EditorPage.tsx` into `EditorClient.tsx`
- [ ] 9.8 Move keyboard undo/redo handler into `EditorClient.tsx`
- [ ] 9.9 Verify editor page renders canvas with all elements
- [ ] 9.10 Verify playback works (play/stop/frame counter)
- [ ] 9.11 Verify undo/redo keyboard shortcuts work
- [ ] 9.12 Verify aspect ratio switcher works
- [ ] 9.13 Verify element addition from ElementMenu works
- [ ] 9.14 Verify property panel updates element properties
- [ ] 9.15 Verify timeline ruler interaction works

## 10. Image Editor & Live Page Migration

- [ ] 10.1 Create `ImageEditorClient.tsx` — migrate from `ImageEditorPage.tsx`
- [ ] 10.2 Replace router/Link imports in `ImageEditorClient.tsx`
- [ ] 10.3 Verify image editor page renders canvas in read-only mode
- [ ] 10.4 Verify PNG export button works
- [ ] 10.5 Create `LiveClient.tsx` — migrate from `LivePage.tsx`
- [ ] 10.6 Replace router/Link imports in `LiveClient.tsx`
- [ ] 10.7 Verify live page renders canvas with pages navigation
- [ ] 10.8 Verify page switching works

## 11. Preview Page SSR Migration

- [ ] 11.1 Migrate `PreviewPage.tsx` → `preview/[shareId]/page.tsx` as Server Component
- [ ] 11.2 Fetch share data in Server Component via `app/api/share/[shareId]/route.ts` (before route exists, use direct DB call)
- [ ] 11.3 Pass canvas data as props to `PreviewClient.tsx`
- [ ] 11.4 Verify `readOnly={true}` mode for CanvasPlayer
- [ ] 11.5 Verify SSR renders correct HTML (check View Source in browser)
- [ ] 11.6 Verify share link works end-to-end

## 12. API Route Handlers — Canvas

- [ ] 12.1 Create `apps/web/src/app/api/canvas/route.ts` — GET (list), POST (create)
- [ ] 12.2 Create `apps/web/src/app/api/canvas/schemas.ts` — Zod schemas for canvas create/update
- [ ] 12.3 Create `apps/web/src/app/api/canvas/[id]/route.ts` — GET, PATCH, DELETE
- [ ] 12.4 Create `apps/web/src/app/api/canvas/[id]/pages/route.ts` — PUT pages
- [ ] 12.5 Create `apps/web/src/app/api/canvas/[id]/track/route.ts` — PUT track
- [ ] 12.6 Create `apps/web/src/app/api/canvas/[id]/duplicate/route.ts` — POST duplicate
- [ ] 12.7 Verify `GET /api/canvas` returns canvas list
- [ ] 12.8 Verify `POST /api/canvas` creates canvas and returns 201
- [ ] 12.9 Verify `GET /api/canvas/:id` returns single canvas
- [ ] 12.10 Verify `PATCH /api/canvas/:id` updates fields
- [ ] 12.11 Verify `PUT /api/canvas/:id/track` saves track state
- [ ] 12.12 Verify `POST /api/canvas/:id/duplicate` creates copy
- [ ] 12.13 Verify `DELETE /api/canvas/:id` removes canvas

## 13. API Route Handlers — Project, Template, Asset

- [ ] 13.1 Create `apps/web/src/app/api/project/route.ts` — GET, POST
- [ ] 13.2 Create `apps/web/src/app/api/project/[id]/route.ts` — GET, PATCH, DELETE
- [ ] 13.3 Create `apps/web/src/app/api/project/schemas.ts` — Zod schemas
- [ ] 13.4 Verify project CRUD endpoints all work
- [ ] 13.5 Create `apps/web/src/app/api/template/route.ts` — GET, POST
- [ ] 13.6 Create `apps/web/src/app/api/template/[id]/route.ts` — GET, PATCH, DELETE
- [ ] 13.7 Create `apps/web/src/app/api/template/schemas.ts` — Zod schemas
- [ ] 13.8 Verify template CRUD endpoints all work
- [ ] 13.9 Create `apps/web/src/app/api/asset/route.ts` — GET, POST (file upload)
- [ ] 13.10 Create `apps/web/src/app/api/asset/[id]/route.ts` — GET, DELETE
- [ ] 13.11 Create `apps/web/src/app/api/asset/schemas.ts` — Zod schemas
- [ ] 13.12 Configure `next.config.ts` to disable body parsing for file uploads if needed
- [ ] 13.13 Verify asset upload saves file and creates MongoDB record
- [ ] 13.14 Verify asset list with filter works

## 14. API Route Handlers — BrandKit, Share

- [ ] 14.1 Create `apps/web/src/app/api/brandkit/route.ts` — GET, POST
- [ ] 14.2 Create `apps/web/src/app/api/brandkit/[id]/route.ts` — GET, PATCH, DELETE
- [ ] 14.3 Create `apps/web/src/app/api/brandkit/schemas.ts` — Zod schemas
- [ ] 14.4 Verify brandkit CRUD endpoints all work
- [ ] 14.5 Create `apps/web/src/app/api/share/route.ts` — POST (create share)
- [ ] 14.6 Create `apps/web/src/app/api/share/[shareId]/route.ts` — GET (resolve share)
- [ ] 14.7 Create `apps/web/src/app/api/share/schemas.ts` — Zod schemas
- [ ] 14.8 Verify share creation generates unique shareId
- [ ] 14.9 Verify `GET /api/share/:shareId` returns associated canvas

## 15. API Error Handling & Zod Validation

- [ ] 15.1 Create `apps/web/src/lib/api-error.ts` — shared error helper (returns JSON + status code)
- [ ] 15.2 Create `apps/web/src/app/api/canvas/[id]/track/route.ts` — already exists, verify Zod validation
- [ ] 15.3 Add Zod validation to all POST/PATCH route handlers
- [ ] 15.4 Add 404 response for missing documents in all GET/:id handlers
- [ ] 15.5 Add 503 response on MongoDB connection failure in all handlers
- [ ] 15.6 Add request logging (method + path) to all handlers
- [ ] 15.7 Verify all handlers return consistent JSON error format `{ error: string, details?: any }`

## 16. API Client Hooks Migration

- [ ] 16.1 Create `apps/web/src/lib/api-client.ts` — base axios/fetch wrapper with base URL `/api`
- [ ] 16.2 Create `apps/web/src/hooks/useCanvasApi.ts` — TanStack Query hooks for canvas CRUD
- [ ] 16.3 Create `apps/web/src/hooks/useProjectApi.ts` — for project CRUD
- [ ] 16.4 Create `apps/web/src/hooks/useTemplateApi.ts` — for template CRUD
- [ ] 16.5 Create `apps/web/src/hooks/useAssetApi.ts` — for asset CRUD
- [ ] 16.6 Create `apps/web/src/hooks/useBrandKitApi.ts` — for brandkit CRUD
- [ ] 16.7 Create `apps/web/src/hooks/useShareApi.ts` — for share creation
- [ ] 16.8 Update existing `apps/web/src/api/libraryApi.ts` → migrate to new hooks
- [ ] 16.9 Remove any `react-router-dom` imports from API hooks
- [ ] 16.10 Verify all hooks work with SSR (server-side fetch for initial data)

## 17. i18n Migration

- [ ] 17.1 Move `apps/web/src/i18n/` to `apps/web/src/i18n/` (keep existing files as-is)
- [ ] 17.2 Update `apps/web/src/i18n/index.ts` to work in both SSR and CSR contexts
- [ ] 17.3 Create `apps/web/src/i18n/config.ts` — i18next configuration compatible with Next.js
- [ ] 17.4 Create `apps/web/src/middleware.ts` — locale detection via cookie + Accept-Language header
- [ ] 17.5 Update `AppLayout.tsx` language toggle to work with i18next v25+ SSR API
- [ ] 17.6 Verify Chinese/English toggle works in browser
- [ ] 17.7 Verify locale persists across page navigation

## 18. Mantine v9 Breaking Changes Fixes

- [ ] 18.1 Check `useMantineColorScheme` API — if `toggleColorScheme` removed, add wrapper:
  ```ts
  const toggle = () => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
  ```
- [ ] 18.2 Check `@mantine/notifications` v9 API — verify `notifications.show()` signature
- [ ] 18.3 Replace all `toast()` calls (from `react-hot-toast`) with `notifications.show()` from `@mantine/notifications`
- [ ] 18.4 Remove `react-hot-toast` import: `import { Toaster } from 'react-hot-toast'` → delete from `providers.tsx`
- [ ] 18.5 Uninstall `react-hot-toast`: `npm uninstall react-hot-toast -w apps/web`
- [ ] 18.6 Check `AppShell` v9 API — verify `header`, `padding` prop names
- [ ] 18.7 Check `Modal` v9 — if `@mantine/modals` API changed, update all `modals.open()` calls
- [ ] 18.8 Check `postcss-preset-mantine` v9 compatibility — update if needed
- [ ] 18.9 Audit all CSS variable usage (`--mantine-*`) — update deprecated variable names
- [ ] 18.10 Verify `ColorSchemeProvider` usage if needed (v9 may change this)
- [ ] 18.11 Check `createStyles` usage — if removed in v9, migrate to `useStyles` or inline styles
- [ ] 18.12 Run `npm run typecheck -w apps/web` and fix all TS errors

## 19. Navigation & Routing Migration

- [ ] 19.1 Replace `import { Link } from 'react-router-dom'` → `import Link from 'next/link'` across all files
- [ ] 19.2 Replace `import { useNavigate } from 'react-router-dom'` → `import { useRouter } from 'next/navigation'` across all files
- [ ] 19.3 Replace `navigate('/path')` → `router.push('/path')` across all files
- [ ] 19.4 Replace `<Route path="..." />` JSX routes → deleted (Next.js file routing)
- [ ] 19.5 Delete `apps/web/src/App.tsx` — no longer needed (Next.js file routing)
- [ ] 19.6 Delete `apps/web/src/main.tsx` — replaced by `app/layout.tsx`
- [ ] 19.7 Verify `next/link` used for all in-app navigation (no full page reload)
- [ ] 19.8 Verify programmatic navigation (`router.push`) works for editor/live routes
- [ ] 19.9 Verify `useParams()` works in Client Components for dynamic routes (id, shareId)

## 20. Configuration & Build

- [ ] 20.1 Configure `apps/web/next.config.ts`:
  - Enable `reactStrictMode`
  - Add `images.remotePatterns` for known CDN domains
  - Configure `experimental.serverComponentsExternalPackages` for mongoose
- [ ] 20.2 Configure `apps/web/tsconfig.json` — ensure `baseUrl` and `paths` aliases work
- [ ] 20.3 Configure `apps/web/.eslintrc.json` — extend `next/core-web-vitals`
- [ ] 20.4 Update root `package.json` scripts to use Next.js commands:
  - `"dev": "npm run dev -w apps/web"`
  - `"build": "npm run build -w apps/web"`
- [ ] 20.5 Remove `"dev:server"` script (NestJS is gone)
- [ ] 20.6 Update root `apps/web/vite.config.ts` reference — delete this file
- [ ] 20.7 Run `npm run build -w apps/web` — full production build
- [ ] 20.8 Fix any build errors (Module not found, TypeScript, etc.)
- [ ] 20.9 Verify production build output is correct

## 21. End-to-End Functional Testing

- [ ] 21.1 Test home page loads with all feature cards
- [ ] 21.2 Test "Open Video Editor" button navigates to `/editor`
- [ ] 21.3 Test "Open Image Editor" button navigates to `/image-editor`
- [ ] 21.4 Test adding elements to canvas (background, sticker, apng, bubble text)
- [ ] 21.5 Test element selection and property panel updates
- [ ] 21.6 Test playback (play/stop/frame counter)
- [ ] 21.7 Test undo/redo with Ctrl+Z / Ctrl+Y
- [ ] 21.8 Test aspect ratio switch (16:9 / 9:16 / 1:1)
- [ ] 21.9 Test dark/light theme toggle
- [ ] 21.10 Test language toggle (EN/ZH)
- [ ] 21.11 Test image editor PNG export
- [ ] 21.12 Test live page canvas rendering
- [ ] 21.13 Test preview page SSR (view source shows canvas content)
- [ ] 21.14 Test API: create canvas via POST
- [ ] 21.15 Test API: fetch canvas list via GET
- [ ] 21.16 Test API: update canvas via PATCH
- [ ] 21.17 Test API: duplicate canvas
- [ ] 21.18 Test API: create and fetch template
- [ ] 21.19 Test API: upload and list asset
- [ ] 21.20 Test API: create and fetch brand kit
- [ ] 21.21 Test API: create and resolve share link
- [ ] 21.22 Test error: invalid API request returns 400 with error JSON
- [ ] 21.23 Test error: missing resource returns 404
- [ ] 21.24 Test 404 page renders correctly
- [ ] 21.25 Test error boundary catches errors with user-friendly message

## 22. Cleanup — Delete Old Code

- [ ] 22.1 Delete `apps/web/src/App.tsx` (migrated to file routing)
- [ ] 22.2 Delete `apps/web/src/main.tsx` (replaced by `app/layout.tsx`)
- [ ] 22.3 Delete `apps/web/vite.config.ts` (replaced by `next.config.ts`)
- [ ] 22.4 Delete `apps/web/tsconfig.node.json` (Vite-specific)
- [ ] 22.5 Delete `apps/web/index.html` (Next.js generates its own)
- [ ] 22.6 Delete `apps/web/postcss.config.cjs` (verify if still needed — Mantine v9 may not need postcss-preset-mantine)
- [ ] 22.7 Delete `apps/web/src/react-app-env.d.ts` if it exists
- [ ] 22.8 Confirm `apps/server/` is no longer referenced anywhere
- [ ] 22.9 Update root `package.json` workspaces: remove `"apps/server"`
- [ ] 22.10 Delete `apps/server/` directory entirely
- [ ] 22.11 Update root `package.json` scripts — remove NestJS-related commands
- [ ] 22.12 Update `docs/STYLE.md` if it references Vite/NestJS
- [ ] 22.13 Update `README.md`:
  - Update tech stack table (Next.js 16 + Mantine 9)
  - Remove NestJS/MongoDB prerequisites
  - Update dev commands (`npm run dev` → `npm run dev -w apps/web`)
  - Remove `/api/docs` Swagger URL
  - Add Next.js deployment instructions
- [ ] 22.14 Run final `npm install` in root
- [ ] 22.15 Run final `npm run build` to verify clean build

## 23. Deploy & Final Verification

- [ ] 23.1 Verify `.env.local` has `MONGODB_URI` set
- [ ] 23.2 Create `.env.example` with all required environment variables
- [ ] 23.3 Configure deployment platform:
  - If Vercel: create `vercel.json` with build settings
  - If Docker: create `Dockerfile` with multi-stage Next.js build
  - If self-hosted: verify `npm run build && npm start` works
- [ ] 23.4 Verify production build runs without errors
- [ ] 23.5 Verify production server starts on configured port
- [ ] 23.6 Run all e2e tests against production build
- [ ] 23.7 Mark `openspec/changes/refactor-to-nextjs-mantine-v9` as complete
