# Kolmari Layouts

## App shell

The protected workspace uses a shared app shell (`AppShell`) with:
- Navy Deep sidebar (collapsible on desktop)
- Top bar with search, notifications, and user menu
- Mobile bottom nav (4 primary items)
- Content area with canvas background

## Sidebar structure (Kolmari)

```
[Wordmark]

Dashboard

EXPLORE
  Your World          → /destinations
  Destinations        → /saved

PLAN
  Pathways            → /pathways
  My Plan             → /my-plan
  Flutter Mode        → /flutter
  Documents           → /documents

CONNECT
  Kolmari Klub        → /community

TOOLS
  Cost Calculator     → /cost-calculator
  Greenbook           → /greenbook
  Settings            → /settings
```

## Page layout families

### Workspace page (standard)
- Max content width: 1180–1236px
- Padding: `p-6` or `p-8`
- Section spacing: `space-y-6`

### Full-width band
- Metrics band, image bands, footer
- No max-width constraint inside the band

### Card grid
- `grid gap-5 sm:grid-cols-2 xl:grid-cols-4`
- White cards (`bg-white border border-line shadow-card`)
- 12px radius

### Dashboard bento
- 2-column grid on desktop: `grid gap-5 lg:grid-cols-2`
- Full-width sections for key actions

## Route protection

All workspace routes (under `(app)/(workspace)/`) require:
1. `requireCurrentUser()` in layout/page
2. Profile wizard completion check in workspace layout
3. Redirect to `/welcome` if not started, `/profile-wizard` if in progress
