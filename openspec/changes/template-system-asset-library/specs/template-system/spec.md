## ADDED Requirements

### Requirement: User can create a scene template from a canvas
The system SHALL allow a user to save the current canvas state as a reusable **scene template** with a name and optional description/tags.

#### Scenario: Save current canvas as scene template
- **WHEN** the user clicks “Save as template” and selects “Scene template”
- **THEN** the system SHALL create a template record containing a serialized snapshot of the current canvas state

#### Scenario: Validation for template naming
- **WHEN** the user attempts to save a template without a name
- **THEN** the system SHALL prevent saving and display a validation error

### Requirement: User can create an overlay template from a selection
The system SHALL allow a user to save a selected set of elements as a reusable **overlay template**.

#### Scenario: Save selected elements as overlay template
- **WHEN** the user selects one or more elements and saves as “Overlay template”
- **THEN** the system SHALL create a template containing only the selected elements and any necessary grouping/ordering metadata to reproduce the selection

#### Scenario: No selection cannot create overlay template
- **WHEN** the user tries to save an overlay template with no elements selected
- **THEN** the system SHALL prevent saving and display a message indicating a selection is required

### Requirement: User can browse and search templates
The system SHALL provide a template list with filtering by type (scene/overlay), tags, and text query on name.

#### Scenario: Filter templates by type
- **WHEN** the user filters templates by “scene”
- **THEN** the system SHALL show only scene templates

#### Scenario: Search templates by name
- **WHEN** the user enters a query string
- **THEN** the system SHALL show templates whose names match the query

### Requirement: User can apply a scene template to a canvas
The system SHALL allow applying a scene template to the current canvas using **replace** mode or **merge** mode.

#### Scenario: Replace current canvas with a scene template
- **WHEN** the user applies a scene template in “replace” mode
- **THEN** the system SHALL replace the current canvas contents with the template contents

#### Scenario: Merge scene template into current canvas without ID collisions
- **WHEN** the user applies a scene template in “merge” mode
- **THEN** the system SHALL insert the template’s elements into the current canvas with newly generated element identifiers

### Requirement: User can apply an overlay template to a canvas
The system SHALL allow inserting an overlay template into the current canvas.

#### Scenario: Insert overlay template at default position
- **WHEN** the user applies an overlay template
- **THEN** the system SHALL insert the overlay elements into the canvas and select the inserted elements

### Requirement: Brand kits can be created and applied
The system SHALL allow creating and managing **brand kits** and applying a brand kit to be used as defaults for new content.

#### Scenario: Create a brand kit
- **WHEN** the user creates a brand kit with palette and typography settings
- **THEN** the system SHALL persist the brand kit and make it available for selection

#### Scenario: Apply a brand kit for defaults
- **WHEN** the user applies a brand kit in the editor
- **THEN** the system SHALL use that kit’s settings as defaults for newly created compatible elements (e.g., text)

### Requirement: Template lifecycle management
The system SHALL allow users to rename, duplicate, and delete templates and brand kits.

#### Scenario: Duplicate an existing template
- **WHEN** the user duplicates a template
- **THEN** the system SHALL create a new template with the same payload and a new identifier

#### Scenario: Delete a template
- **WHEN** the user deletes a template
- **THEN** the system SHALL remove it from the template list and it SHALL no longer be available for application

