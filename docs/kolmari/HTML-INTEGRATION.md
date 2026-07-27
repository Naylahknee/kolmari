# Kolmari HTML Integration Rules

## Design reference files

Expected location when delivered:
```
design-reference/claude-design/
  Kolmari App.dc.html     ← visual source of truth
  image-slot.js           ← image placeholder behavior
  kolmari-map.js          ← map prototype
  support.js              ← support/interaction helpers
  assets/
    kolmari-butterfly.png ← primary brand symbol
```

**Current status:** These files have not yet been delivered to the workspace.

## Integration rules

### What to do

- Convert the visual structure to React and TypeScript
- Break the design into reusable components
- Use the shared Kolmari app shell
- Use existing Tailwind tokens
- Connect existing data and actions
- Use honest empty states when data is unavailable

### What NOT to do

- Do not serve `Kolmari App.dc.html` directly
- Do not use an iframe
- Do not paste the entire HTML into one React component
- Do not preserve inline scripts — reimplement in React
- Do not preserve direct DOM manipulation — use React state
- Do not copy all CSS into global stylesheet
- Do not leave hardcoded mock profile data
- Do not leave hardcoded Match Scores or readiness values

## image-slot.js (pending inspection)

When available, classify each image slot as:
- Real data-driven image
- Region/country artwork (use existing `public/images/`)
- Butterfly brand asset
- Intentional empty/placeholder state

## kolmari-map.js (pending inspection)

When available, classify map behavior as:
- Decorative SVG (implement as existing NexitnationMap)
- Clickable world map (existing SVG system)
- Mapbox implementation (use existing MapboxMap)

## support.js (pending inspection)

When available, classify each behavior as:
- Interaction → React state/events
- Navigation → Next.js Link/router
- Animation → CSS transitions
- Test fixture → exclude from production
