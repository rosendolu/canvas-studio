## ADDED Requirements

### Requirement: MongoDB connection module

The system SHALL provide a shared MongoDB connection module at `lib/mongodb.ts` that manages a singleton connection pool. This module MUST be reused by all Next.js Route Handlers and Server Components that need database access.

#### Scenario: Singleton connection
- **WHEN** `connectDB()` is called for the first time
- **THEN** it establishes a connection to MongoDB using `MONGODB_URI` environment variable
- **AND** caches the connection in a module-level variable
- **AND** subsequent calls return the cached connection without reconnecting

#### Scenario: Development mode hot reload
- **WHEN** Next.js dev server hot-reloads Route Handlers
- **THEN** the MongoDB connection is preserved across hot reloads
- **AND** no "Cannot overwrite previously established connection" error occurs

#### Scenario: Connection failure
- **WHEN** MongoDB is unreachable
- **THEN** `connectDB()` throws a descriptive error
- **AND** Route Handlers return HTTP 503 Service Unavailable

---

### Requirement: Canvas CRUD Route Handlers

The system SHALL implement Canvas CRUD API endpoints using Next.js Route Handlers, replacing all NestJS canvas controller endpoints. Each endpoint maps to `app/api/canvas/` directory structure.

#### Scenario: List canvases
- **WHEN** `GET /api/canvas` is requested
- **THEN** Route Handler at `app/api/canvas/route.ts` returns all canvas documents
- **AND** supports pagination query params (`page`, `limit`)
- **AND** returns JSON with `data` array and `total` count

#### Scenario: Create canvas
- **WHEN** `POST /api/canvas` is requested with a valid body
- **THEN** Route Handler creates a new canvas document in MongoDB
- **AND** returns HTTP 201 with the created canvas object (including `_id`)

#### Scenario: Get single canvas
- **WHEN** `GET /api/canvas/:id` is requested
- **THEN** Route Handler at `app/api/canvas/[id]/route.ts` returns the canvas by ID
- **AND** returns HTTP 404 if not found

#### Scenario: Update canvas
- **WHEN** `PATCH /api/canvas/:id` is requested
- **THEN** Route Handler updates the canvas document fields
- **AND** validates input using Zod schema
- **AND** returns HTTP 200 with updated document

#### Scenario: Save live room pages
- **WHEN** `PUT /api/canvas/:id/pages` is requested with page state
- **THEN** Route Handler replaces the `pages` array on the canvas document
- **AND** returns HTTP 200 with updated document

#### Scenario: Save editor track state
- **WHEN** `PUT /api/canvas/:id/track` is requested with track data
- **THEN** Route Handler replaces the `track` array on the canvas document
- **AND** returns HTTP 200 with updated document

#### Scenario: Duplicate canvas
- **WHEN** `POST /api/canvas/:id/duplicate` is requested
- **THEN** Route Handler clones the canvas document with a new `_id`
- **AND** renames the copy to "{original name} (Copy)"
- **AND** returns HTTP 201 with the new canvas

#### Scenario: Delete canvas
- **WHEN** `DELETE /api/canvas/:id` is requested
- **THEN** Route Handler removes the canvas document
- **AND** returns HTTP 204 No Content

---

### Requirement: Project CRUD Route Handlers

The system SHALL implement Project CRUD API endpoints at `app/api/project/` replacing the NestJS project controller.

#### Scenario: Project CRUD operations
- **WHEN** `POST /api/project` is requested
- **THEN** creates a new project document
- **AND** returns HTTP 201 with created project

- **WHEN** `GET /api/project` is requested
- **THEN** returns list of projects (optionally filtered by user)
- **AND** returns JSON array

- **WHEN** `PATCH /api/project/:id` is requested
- **THEN** updates project fields
- **AND** returns HTTP 200 with updated project

- **WHEN** `DELETE /api/project/:id` is requested
- **THEN** deletes the project document
- **AND** returns HTTP 204 No Content

---

### Requirement: Template CRUD Route Handlers

The system SHALL implement Template CRUD API endpoints at `app/api/template/` replacing the NestJS template controller.

#### Scenario: Template CRUD operations
- **WHEN** `POST /api/template` is requested
- **THEN** creates a new template document with `name`, `type`, `payload`, `tags`
- **AND** returns HTTP 201 with created template

- **WHEN** `GET /api/template` is requested
- **THEN** returns list of templates (optionally filtered by `type`, `tags`)
- **AND** supports pagination

- **WHEN** `PATCH /api/template/:id` is requested
- **THEN** updates template fields including payload
- **AND** returns HTTP 200 with updated template

- **WHEN** `DELETE /api/template/:id` is requested
- **THEN** deletes the template document
- **AND** returns HTTP 204 No Content

---

### Requirement: Asset CRUD Route Handlers

The system SHALL implement Asset CRUD API endpoints at `app/api/asset/` replacing the NestJS asset controller. File upload handling MUST be implemented.

#### Scenario: Asset upload
- **WHEN** `POST /api/asset` is requested with `FormData` containing a file
- **THEN** Route Handler saves the file to local storage or configured storage backend
- **AND** creates an asset document in MongoDB with `url`, `mimeType`, `size`, `width`, `height`
- **AND** returns HTTP 201 with created asset object

#### Scenario: List assets
- **WHEN** `GET /api/asset` is requested
- **THEN** returns list of assets with optional `assetType` filter
- **AND** supports pagination

#### Scenario: Delete asset
- **WHEN** `DELETE /api/asset/:id` is requested
- **THEN** deletes the asset document and associated file
- **AND** returns HTTP 204 No Content

---

### Requirement: BrandKit CRUD Route Handlers

The system SHALL implement BrandKit CRUD API endpoints at `app/api/brandkit/` replacing the NestJS brandkit controller.

#### Scenario: BrandKit CRUD operations
- **WHEN** `POST /api/brandkit` is requested with palette, typography, logoAssetId
- **THEN** creates a new brand kit document
- **AND** returns HTTP 201 with created brand kit

- **WHEN** `GET /api/brandkit` is requested
- **THEN** returns list of brand kits

- **WHEN** `PATCH /api/brandkit/:id` is requested
- **THEN** updates brand kit fields
- **AND** returns HTTP 200 with updated brand kit

- **WHEN** `DELETE /api/brandkit/:id` is requested
- **THEN** deletes the brand kit document
- **AND** returns HTTP 204 No Content

---

### Requirement: Share Route Handlers

The system SHALL implement Share API endpoints at `app/api/share/` replacing the NestJS share controller. Share generates a unique shareable link for canvas preview.

#### Scenario: Create share link
- **WHEN** `POST /api/share` is requested with `canvasId`
- **THEN** Route Handler generates a unique `shareId`
- **AND** creates a share document linking to the canvas
- **AND** returns the share URL

#### Scenario: Access shared canvas
- **WHEN** `GET /api/share/:shareId` is requested
- **THEN** Route Handler returns the associated canvas data
- **AND** returns HTTP 404 if share is invalid or expired

---

### Requirement: Input validation with Zod

The system SHALL use Zod for request body validation in all Route Handlers, replacing NestJS class-validator decorators.

#### Scenario: Valid request body
- **WHEN** a Route Handler receives a request with a body
- **THEN** it parses and validates the body against a Zod schema
- **AND** proceeds with business logic if valid

#### Scenario: Invalid request body
- **WHEN** a Route Handler receives a request with an invalid body
- **THEN** it returns HTTP 400 Bad Request
- **AND** includes descriptive validation error messages in JSON

#### Scenario: Zod schemas co-located with Route Handlers
- **WHEN** a Route Handler needs validation
- **THEN** the Zod schema is defined in a `schemas.ts` file in the same directory
- **AND** imported by the Route Handler

---

### Requirement: Error handling and HTTP status codes

The system SHALL implement consistent error handling across all Route Handlers. Each handler MUST return appropriate HTTP status codes and JSON error responses.

#### Scenario: Not found
- **WHEN** a requested resource does not exist
- **THEN** Route Handler returns HTTP 404 with `{ error: "Not found" }`

#### Scenario: Validation failure
- **WHEN** request body or params fail Zod validation
- **THEN** Route Handler returns HTTP 400 with `{ error: "Validation failed", details: [...] }`

#### Scenario: Server error
- **WHEN** an unexpected error occurs in business logic
- **THEN** Route Handler catches the error
- **AND** returns HTTP 500 with `{ error: "Internal server error" }`
- **AND** logs the full error to server console (not exposed to client)

---

### Requirement: CORS configuration

The system SHALL configure CORS headers for API Route Handlers to allow cross-origin requests from the same Next.js origin. The configuration MUST be applied via Next.js `middleware.ts` or per-route headers.

#### Scenario: Same-origin API access
- **WHEN** a browser request originates from the Next.js app domain
- **THEN** the request is allowed without CORS preflight issues

#### Scenario: OPTIONS preflight
- **WHEN** a CORS preflight (OPTIONS) request is made
- **THEN** middleware responds with 200 OK and appropriate CORS headers
- **AND** the actual request follows in a separate call
