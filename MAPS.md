# MAPS.md — Kolmari map fallback contract

Kolmari treats map failure as a design state, not an error screen.

## Rule

- `fallback="locator"` is reserved for surfaces whose job is answering **where in the world is this?**
- `fallback="flag"` is the default for cards, lists, grids, and comparison surfaces.
- Never show a broken frame or a long-running spinner.

## Surface table

| Surface | Preferred render | Failure fallback |
|---|---|---|
| Country page hero | Map | `locator` |
| My Plan destination header | Map | `locator` |
| Country/city cards | Map or static visual | `flag` |
| Pathway route cards | Map or static visual | `flag` |
| Flutter Mode city cards | Map or static visual | `flag` |
| Destination compare grids | Flag | `flag` |

A flag is intentionally the default because it is fast, recognizable, and does not imply geographic precision when geography is not the task. A locator is retained for the two decision surfaces where location context is essential.

## Component contract

```tsx
<CountrySnapshotMap
  countryName="Portugal"
  countryCode="pt"
  cityName="Lisbon"
  lat={38.7223}
  lng={-9.1393}
  alt="Map showing Lisbon, Portugal"
  fallback="locator" // omit elsewhere; flag is the default
/>
```

The existing country hero wrapper is recognized as a locator surface. My Plan passes `fallback="locator"` explicitly. Every other caller inherits `flag` unless a future surface is deliberately added to this table.
