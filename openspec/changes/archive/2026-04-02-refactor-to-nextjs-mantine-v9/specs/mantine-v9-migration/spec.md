## ADDED Requirements

### Requirement: Mantine v9 installation and peer dependency alignment

The system SHALL install Mantine v9 and all related ecosystem packages at their latest v9-compatible versions. All peer dependencies MUST be resolved to compatible versions.

#### Scenario: Mantine core installed
- **WHEN** `@mantine/core@9` is installed
- **THEN** it requires `react@^19.2.0` and `react-dom@^19.2.0`
- **AND** the monorepo upgrades React accordingly

#### Scenario: Mantine ecosystem packages upgraded
- **WHEN** Mantine v9 is installed
- **THEN** `@mantine/hooks@9` is installed (matching version)
- **AND** `@mantine/notifications@9` is installed (or latest compatible)
- **AND** `@mantine/modals@9` is installed (modals is now a separate package in v9)
- **AND** `@mantine/charts@9` is installed if used
- **AND** `@mantine/dates@9` is installed if used
- **AND** `postcss-preset-mantine` is updated to v9-compatible version

---

### Requirement: MantineProvider with v9 API

The system SHALL configure `MantineProvider` in `app/providers.tsx` (a Client Component) using the Mantine v9 API. The v9 API differs from v7 in theme structure and component props.

#### Scenario: Provider structure
- **WHEN** `app/providers.tsx` is rendered as a Client Component
- **THEN** it wraps children with `<MantineProvider theme={theme} defaultColorScheme="auto">`
- **AND** `<Notifications />` component is included
- **AND** `<QueryClientProvider>` is the outermost wrapper

#### Scenario: Color scheme v9 API
- **WHEN** `useMantineColorScheme` hook is called in a component
- **THEN** it returns `{ colorScheme, setColorScheme, clearColorScheme }`
- **AND** `toggleColorScheme` is no longer directly on the hook (use `setColorScheme`)

---

### Requirement: Theme migration from v7 to v9

The system SHALL migrate the existing `theme.ts` from Mantine v7 format to v9 format, updating all breaking changes in theme structure.

#### Scenario: Brand color definition
- **WHEN** the existing `brandColor` tuple is used in v9
- **THEN** it follows the v9 color tuple format (10 shades from lightest to darkest)
- **AND** `colors: { brand: brandColor }` is used inside `createTheme`

#### Scenario: Component default props removed
- **WHEN** `AppShell` default props are defined in theme
- **THEN** v9 may require component-level configuration instead
- **AND** theme structure is updated accordingly

---

### Requirement: Notifications API migration

The system SHALL migrate `@mantine/notifications` usage from v7 API to v9 API. The `notifications.show()` method signature and event lifecycle have changed.

#### Scenario: Showing a notification
- **WHEN** a component calls `notifications.show({ title, message, color })`
- **THEN** the v9 API is used (checking v9 method signature)
- **AND** `react-hot-toast` is removed in favor of `@mantine/notifications` exclusively

#### Scenario: Notification lifecycle events
- **WHEN** notification callbacks (`onOpen`, `onClose`, `onUpdate`) are used
- **THEN** the v9 API signatures are followed
- **AND** types are correctly imported from `@mantine/notifications`

---

### Requirement: AppShell layout migration

The system SHALL migrate `AppShell` component usage from v7 to v9. The `AppShell.Header` and `AppShell.Main` structure is preserved but some prop names may have changed.

#### Scenario: AppShell header and main
- **WHEN** `AppLayout` renders `AppShell` with header
- **THEN** the v9 `AppShell` API is used (checking `header`, `navbar`, `footer` prop structures)
- **AND** `padding` prop behavior matches v9

---

### Requirement: Modal and drawer components

The system SHALL migrate any `Modal` or `Drawer` usage from v7 to v9 API, including the change where `@mantine/modals` becomes a separate package in v9.

#### Scenario: Modals package installed
- **WHEN** modals are used in the app
- **THEN** `@mantine/modals@9` is installed as a separate package
- **AND** `modals.open()` context method is available if using `ModalsProvider`

---

### Requirement: Global CSS variable compatibility

The system SHALL audit and fix CSS variable usage throughout the codebase. Mantine v9 has normalized CSS variable prefixes and some v7 variables may be renamed or removed.

#### Scenario: CSS variable prefix changes
- **WHEN** components reference `--mantine-*` CSS variables
- **THEN** v9 variable names are verified against Mantine v9 documentation
- **AND** any deprecated variables are replaced

#### Scenario: Color scheme CSS variables
- **WHEN** `useMantineColorScheme` provides color scheme
- **THEN** `document.documentElement.setAttribute('data-mantine-color-scheme', colorScheme)` is set
- **AND** all theme-aware CSS works correctly in both light and dark mode

---

### Requirement: TypeScript types for Mantine v9

The system SHALL resolve TypeScript errors introduced by Mantine v9 type changes. The `@mantine/core` v9 types may have different component prop types.

#### Scenario: Component prop type errors
- **WHEN** TypeScript compilation encounters Mantine component props
- **THEN** types are resolved by ensuring `@mantine/core` v9 types are active
- **AND** any `any` casts used in v7 are replaced with proper v9 types

#### Scenario: MantineTheme import
- **WHEN** custom components reference `MantineTheme`
- **THEN** the import is updated to `@mantine/core`
- **AND** type usage is compatible with v9

---

### Requirement: Remove react-hot-toast dependency

The system SHALL remove `react-hot-toast` in favor of `@mantine/notifications` exclusively, since the app already uses Mantine notifications.

#### Scenario: Hot toast removed
- **WHEN** `react-hot-toast` package is uninstalled
- **THEN** `<Toaster />` component is removed from `providers.tsx`
- **AND** all `toast()` calls in components are replaced with `notifications.show()` from `@mantine/notifications`
- **AND** no import of `react-hot-toast` remains in any file

---

### Requirement: Mantine v9 dark mode compatibility

The system SHALL ensure the existing dark/light theme toggle works correctly in Mantine v9, including CSS variable cascade and `ColorSchemeProvider`.

#### Scenario: Theme toggle functional
- **WHEN** the user toggles between dark and light mode
- **THEN** `useMantineColorScheme` returns the correct scheme
- **AND** all components reflect the correct theme colors
- **AND** the preference is persisted (cookie/localStorage)

#### Scenario: Auto color scheme
- **WHEN** `defaultColorScheme="auto"` is set in `MantineProvider`
- **THEN** the system respects the OS-level preference
- **AND** `data-mantine-color-scheme` attribute on `<html>` reflects the active scheme
