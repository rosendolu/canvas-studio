## ADDED Requirements

### Requirement: MongoDB singleton connection

The system SHALL export a `connectDB()` function from `lib/mongodb.ts` that manages a singleton MongoDB connection. The connection MUST be reused across requests in both development and production environments.

#### Scenario: First connection
- **WHEN** `connectDB()` is called for the first time in the application lifecycle
- **THEN** it calls `mongoose.connect(process.env.MONGODB_URI)`
- **AND** returns the Mongoose connection object

#### Scenario: Subsequent connections
- **WHEN** `connectDB()` is called again
- **THEN** it returns the cached connection immediately
- **AND** does not create a new connection pool

#### Scenario: Development hot reload
- **WHEN** Next.js dev server hot-reloads (file change)
- **THEN** the cached connection is preserved on the global object
- **AND** avoids "already connected" errors

---

### Requirement: Mongoose model imports

The system SHALL provide Mongoose models (schemas) from the existing NestJS module structure, adapted for use in Route Handlers. The schema definitions MUST be reused without modification to the data model.

#### Scenario: Canvas model available in Route Handlers
- **WHEN** `app/api/canvas/route.ts` needs the Canvas model
- **THEN** it imports `Canvas` model from `lib/models/canvas.ts`
- **AND** the model is compiled with `mongoose.model<CanvasDocument>('Canvas', CanvasSchema)`

#### Scenario: Model directory structure
- **WHEN** models are organized
- **THEN** `lib/models/` directory contains one file per model
- **AND** each file exports the compiled Mongoose model
- **AND** schemas are defined using Mongoose programmatic API (not decorators, matching existing style)

---

### Requirement: Environment variable for MongoDB URI

The system SHALL use `MONGODB_URI` environment variable for the database connection string, consistent with the existing NestJS `.env` setup.

#### Scenario: MongoDB URI from env
- **WHEN** `connectDB()` is called
- **THEN** it reads `process.env.MONGODB_URI`
- **AND** uses a fallback of `mongodb://localhost:27017/canvas-studio` if not set
- **AND** validates the URI format before connecting

#### Scenario: Next.js env validation
- **WHEN** the Next.js app starts
- **THEN** a startup check validates `MONGODB_URI` is defined
- **AND** a warning is logged if using the default localhost URI

---

### Requirement: Type-safe database documents

The system SHALL define TypeScript interfaces for all MongoDB document types, matching the existing `CanvasDocument`, `Project`, `Template`, `Asset`, `BrandKit`, `Share` types.

#### Scenario: Document types in lib/db.ts
- **WHEN** database types are defined
- **THEN** they extend `mongoose.Document`
- **AND** all fields match the existing schema definitions
- **AND** `HydratedDocument` types are exported for use in Route Handlers

---

### Requirement: Database connection error handling

The system SHALL handle MongoDB connection errors gracefully, preventing unhandled promise rejections and providing meaningful error messages.

#### Scenario: Connection failure
- **WHEN** MongoDB is unavailable or credentials are wrong
- **THEN** `mongoose.connect()` throws a `MongooseServerSelectionError`
- **AND** the Route Handler catches it and returns HTTP 503
- **AND** the error is logged with relevant details

#### Scenario: Production vs development errors
- **WHEN** a connection error occurs
- **THEN** in development, full error details are logged to console
- **AND** in production, generic HTTP 503 is returned to client
- **AND** no internal details are exposed
