# Kolmari Dashboard Layout Builder

**Status:** Canonical Dashboard layout behavior

## Governing rule

The Dashboard uses one persisted per-user layout contract. Panels are not duplicated to create alternate dashboards.

## Default layout

The default optimized layout is `Focused move plan`.

```text
Dashboard
├── Main column
│   ├── Recommended next action
│   └── Destinations
│       ├── #1 matched country
│       ├── #2 matched country
│       ├── #3 matched country
│       └── Visa Options for #1 match
└── Second column
    ├── Progress by planning area
    ├── Active pathway
    └── Deadlines and blockers
```

The Journey tracker defaults to the hidden header dropdown and therefore occupies zero Dashboard grid space.

## Destination interaction

Nested matched-country image cards inside the Destinations parent panel are information surfaces only. They do not navigate to country pages when clicked.

The parent panel provides concise visa-pathway information below the matched-country grid using existing researched `PATHWAYS` data.

## Layout contract

`DashboardLayout` version 2 stores:

- `template`
- `main` panel order
- `side` panel order
- `disabled` panels
- `journeyPlacement`

Valid Journey placements:

- `header` — default hidden header dropdown
- `panel` — full tracker participates in the draggable Dashboard canvas

Existing version-1 saved layouts are parsed into version 2 without requiring a database migration.

## Available panels

- Recommended next action
- Progress by planning area
- Deadlines and blockers
- Destinations
- Active pathway
- Ask Kolmari
- Your shortlist
- Food & health fit
- Command Center summary
- Journey progress tracker

## Optimized templates

### Focused move plan

Keeps next action and destinations primary. Planning progress, Active pathway, and Deadlines and blockers form the second column. Journey stays in the header.

### Balanced overview

Shows all panels across two columns and places Journey in the Dashboard canvas.

### Research mode

Prioritizes Destinations, Shortlist, Command Center, Food & health fit, and Ask Kolmari while planning status remains in the second column. Journey stays in the header.

### Execution mode

Prioritizes next action, planning progress, Journey, deadlines, and Active pathway after the user is moving from research into execution.

## Account → Dashboard editor

The Account Dashboard tab is the canonical interactive editor.

Users can:

- apply an optimized template
- drag panels within a column
- drag panels between Main and Second columns
- use Move Up / Move Down buttons as a keyboard-accessible alternative
- move a panel between columns with a button
- show or hide any offered panel
- choose Journey as Header dropdown or Dashboard panel
- restore the shipped default

Changes persist automatically through `/api/dashboard-layout`.

## Preservation rules

Layout customization must not change:

- country Match calculations
- visa/pathway qualification calculations
- Journey stage calculation
- Journey task content
- plan/profile state
- subscription entitlements
- country-page behavior

The layout system controls presentation and placement only.
