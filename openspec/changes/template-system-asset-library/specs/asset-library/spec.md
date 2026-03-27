## ADDED Requirements

### Requirement: User can upload an asset into the library
The system SHALL allow a user to upload an asset into an asset library, capturing metadata needed for browsing and insertion.

#### Scenario: Upload a supported image asset
- **WHEN** the user uploads a PNG/JPEG/SVG file
- **THEN** the system SHALL store the asset and create a library entry with name, type, and size metadata

#### Scenario: Upload a supported APNG asset
- **WHEN** the user uploads an APNG file
- **THEN** the system SHALL store the asset and mark it as an animated sticker asset type (if supported by insertion paths)

### Requirement: User can manage asset metadata
The system SHALL allow a user to set and update asset metadata including name and tags.

#### Scenario: Add tags to an asset
- **WHEN** the user edits an asset and adds tags
- **THEN** the system SHALL persist the tags and use them for filtering/search

#### Scenario: Rename an asset
- **WHEN** the user renames an asset
- **THEN** the system SHALL update the displayed name in the asset library list

### Requirement: User can browse, filter, and search assets
The system SHALL provide an asset library list with filtering by asset type and tags, and search by name.

#### Scenario: Filter assets by type
- **WHEN** the user selects “stickers”
- **THEN** the system SHALL show only assets of sticker-compatible types

#### Scenario: Search assets by name
- **WHEN** the user enters a query string
- **THEN** the system SHALL show assets whose names match the query

### Requirement: User can insert a library asset into a canvas
The system SHALL allow inserting an asset from the library into the canvas using existing element types.

#### Scenario: Insert a sticker asset as an image element
- **WHEN** the user clicks “Insert” on a library asset
- **THEN** the system SHALL create a corresponding element in the canvas that renders the asset

#### Scenario: Insert an asset and select it for editing
- **WHEN** an asset is inserted into the canvas
- **THEN** the system SHALL select the newly created element so the user can immediately reposition/transform it

### Requirement: User can delete assets
The system SHALL allow deleting an asset from the library.

#### Scenario: Delete an asset removes it from the library
- **WHEN** the user deletes an asset
- **THEN** the system SHALL remove the asset from the library list and it SHALL no longer be available for insertion

