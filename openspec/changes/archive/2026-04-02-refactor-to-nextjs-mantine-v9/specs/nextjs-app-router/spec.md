## ADDED Requirements

### Requirement: Next.js 16 App Router project scaffold

The system SHALL create a new Next.js 16 application using `create-next-app --latest` within the monorepo workspace, configured with TypeScript, ESLint, and App Router. The project shall be placed at `apps/web/` (replacing the existing Vite app).

#### Scenario: New Next.js app created
- **WHEN** `npx create-next-app@latest apps/web` is executed with `--typescript --eslint --app --src-dir --import-alias "@/*"`
- **THEN** a Next.js 16 project is scaffolded with the App Router enabled
- **AND** TypeScript strict mode is configured
- **AND** the monorepo workspace is updated to reference the new package

#### Scenario: Workspace monorepo configuration preserved
- **WHEN** the Next.js app is created in `apps/web/`
- **THEN** the root `package.json` workspaces field includes `apps/web`
- **AND** `apps/server` remains in workspaces until Phase 6

---

### Requirement: App Router file-based routing

The system SHALL use Next.js App Router file-system routing to define all application routes. Each page corresponds to a `page.tsx` file within the `app/` directory.

#### Scenario: Static pages
- **WHEN** a `page.tsx` is created at `app/page.tsx`
- **THEN** it renders the Home page at the root URL `/`
- **AND** it uses Server Components for initial data fetching

#### Scenario: Dynamic pages
- **WHEN** `app/editor/[id]/page.tsx` is created
- **THEN** it renders the Editor page with `params.id` as the canvas ID
- **AND** it follows the pattern: `/editor` (new) and `/editor/:id` (edit existing)

#### Scenario: All existing routes mapped
- **WHEN** routes are migrated
- **THEN** `/` maps to `app/page.tsx` (Home)
- **AND** `/editor/:id?` maps to `app/editor/[id]/page.tsx`
- **AND** `/image-editor/:id?` maps to `app/image-editor/[id]/page.tsx`
- **AND** `/live` maps to `app/live/page.tsx`
- **AND** `/preview/:shareId` maps to `app/preview/[shareId]/page.tsx`

---

### Requirement: Server and Client Component boundary

The system SHALL define clear boundaries between Server Components and Client Components. Components that require browser APIs, user interaction, or state management MUST be Client Components.

#### Scenario: Server Component renders shell layout
- **WHEN** `app/layout.tsx` is executed
- **THEN** it is a Server Component that returns the HTML document shell
- **AND** it renders `<html>` and `<body>` tags
- **AND** it wraps children with `<Providers>` client component

#### Scenario: Client components marked with "use client"
- **WHEN** a component uses hooks (`useState`, `useEffect`, `useStore`)
- **OR** uses browser APIs (`window`, `document`)
- **OR** uses event handlers (`onClick`, `onChange`)
- **THEN** the file begins with `"use client"` directive
- **AND** this includes all Canvas rendering components

#### Scenario: CanvasPlayer isolated as Client Component
- **WHEN** `CanvasPlayer` component is rendered
- **THEN** it is isolated inside a Client Component boundary
- **AND** the parent Server Component passes data via props (serializable)

---

### Requirement: Route Groups for layout organization

The system SHALL use Next.js Route Groups (folders in parentheses) to organize layouts and share UI structure across related routes.

#### Scenario: Main layout route group
- **WHEN** `app/(main)/layout.tsx` is created
- **THEN** it wraps all routes under `(main)/` with `AppLayout` (header, navigation)
- **AND** routes `editor`, `image-editor`, and `live` are placed under `(main)/`

#### Scenario: Preview route with minimal layout
- **WHEN** `app/preview/[shareId]/page.tsx` is created outside `(main)/`
- **THEN** it renders a minimal layout without the app header/navigation
- **AND** it uses Server Component for SEO-friendly canvas preview

---

### Requirement: Global CSS and Mantine styles

The system SHALL configure global CSS to include Mantine v9 styles and custom theme variables. The Mantine CSS import must be present in the Next.js app root layout.

#### Scenario: Mantine styles loaded
- **WHEN** `app/layout.tsx` imports Mantine CSS
- **THEN** `@mantine/core/styles.css` is imported
- **AND** `@mantine/notifications/styles.css` is imported
- **AND** all styles are bundled by Next.js CSS pipeline

---

### Requirement: Middleware for locale detection

The system SHALL implement Next.js Middleware to detect user locale and inject it into requests, replacing the manual `localStorage` approach from the current app.

#### Scenario: Locale detection from cookie or Accept-Language
- **WHEN** a request comes to any route without a locale cookie
- **THEN** middleware detects the preferred locale from `Accept-Language` header
- **AND** sets a `locale` cookie for subsequent requests
- **AND** rewrites the URL to include the locale prefix (e.g., `/en/editor`)

---

### Requirement: next/image optimization

The system SHALL use `next/image` for all static images to benefit from automatic optimization. External images must be configured in `next.config.js`.

#### Scenario: Internal images optimized
- **WHEN** `next/image` is used for internal assets
- **THEN** images are automatically resized, converted to WebP/AVIF
- **AND** lazy-loaded with blur placeholder

#### Scenario: External images configured
- **WHEN** images from CDN or user-provided URLs are used
- **THEN** `next.config.js` specifies `images.remotePatterns` to allow those domains
- **AND** the Konva `use-image` hook is used for Canvas element images (bypassing next/image)

---

### Requirement: Navigation using Next.js router

The system SHALL replace `react-router-dom` with Next.js `useRouter` and `next/link` for all navigation.

#### Scenario: Link component for static navigation
- **WHEN** navigating to a known route (e.g., home, editor)
- **THEN** `<Link href="...">` from `next/link` is used
- **AND** no full page reload occurs

#### Scenario: Programmatic navigation
- **WHEN** navigation is triggered by user action (e.g., button click)
- **THEN** `router.push()` or `router.replace()` from `next/navigation` is used
- **AND** `useRouter` is called inside a Client Component

#### Scenario: Route params access
- **WHEN** reading URL parameters (e.g., `id`, `shareId`)
- **THEN** use `useParams()` hook from `next/navigation` inside Client Components
- **OR** access `params` object directly in Server Component `page.tsx` function signature

---

### Requirement: Loading and error states

The system SHALL implement Next.js `loading.tsx` and `error.tsx` conventions for each route segment to provide seamless loading states and error boundaries.

#### Scenario: Loading state per route
- **WHEN** a page is loading data (Server Component fetch)
- **THEN** `loading.tsx` at the same level renders a skeleton or spinner
- **AND** streamed to the client progressively

#### Scenario: Error boundary
- **WHEN** a page throws an error during render or data fetching
- **THEN** `error.tsx` at the same level catches the error
- **AND** renders a user-friendly error message with a retry option
