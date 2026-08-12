# Dashboard Destination Selection + Layout Preview

**Status:** Implementation note

This change has two bounded behaviors:

1. Dashboard matched-country cards select which country's Visa Options are displayed inside the existing Destinations parent panel. They never navigate to country pages and do not persist destination product state.
2. Account → Dashboard includes a live visualization driven by the existing `DashboardLayout` state so users can see template, column, order, visibility, and Journey-placement changes immediately.

Canonical behavior remains documented in:

- `docs/dashboard-destination-panels.md`
- `docs/dashboard-layout-builder.md`
- `docs/dashboard-norman-door-audit.md`
