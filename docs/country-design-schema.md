# Kolmari Country Design Schema

**Status:** Canonical design/data contract  
**Applies to:** Country pages, Country Page Generator Engine, and the existing Dashboard `Destinations` panel  
**Reference styles:** National Flag Shadow Hero (Mexico visual reference) and Kolmari Country Page Standard (Portugal layout reference)

## 1. Governing rule

Kolmari uses one shared Country Design System. Country records supply structured data and approved assets; they do not create separate layouts or components.

```text
COUNTRY DATA
    +
VISUAL ASSETS
    +
PAGE LAYOUT CONFIG
    +
USER MATCH STATE
        ↓
SHARED COUNTRY COMPONENTS
```

The Dashboard is not a second country-page system. Its existing `Destinations` parent panel consumes the same country and match entities but has its own nested-card visual asset.

## 2. Country visual asset schema

Source of truth: `src/lib/country-visuals/schema.ts`

```ts
type CountryVisualAssets = {
  countrySlug: string
  hero: {
    src: string
    alt: string
    focalPoint: { x: number; y: number }
  }
  dashboardDestination?: {
    src: string
    alt: string
    cropSafeZone: number
    focalPoint: { x: number; y: number }
  }
  snapshotMap: {
    center: [number, number]
    zoom: number
    bounds?: [[number, number], [number, number]]
    capital?: { name: string; lat: number; lng: number }
  }
  cities: Array<{
    slug: string
    name: string
    imageSrc: string
    imageAlt: string
    focalPoint?: { x: number; y: number }
  }>
}
```

### Asset responsibilities

| Asset | Surface | Rule |
| --- | --- | --- |
| `hero` | Country page hero | National Flag Shadow Hero |
| `dashboardDestination` | Nested Dashboard match card | Compact 1536×1024 master with central 70% crop-safe zone |
| `snapshotMap` | Country Snapshot | Mapbox configuration; never AI-generated |
| `cities` | Top Cities | City-specific editorial imagery |

No asset silently substitutes for another asset role.

## 3. Generated asset storage names

Persisted/API values intentionally preserve existing compatibility:

```ts
type GeneratedAssetType =
  | 'hero'
  | 'city'
  | 'dashboard_destination'
```

Do not rename existing persisted `hero` or `city` rows merely to make their names more descriptive.

Human-facing names:

- `hero` → Country Hero
- `city` → City Image
- `dashboard_destination` → Dashboard Destination Image

`country_generated_assets.asset_type` is `TEXT`, so adding `dashboard_destination` does not require a database schema migration.

## 4. Dashboard Destination generator input

```ts
type DashboardDestinationImageInput = {
  countryName: string
  countrySlug: string
  flagCode?: string
  protectedSymbolDescription: string
  protectedSymbolPosition: string
  safeZonePercent: number
  compositionGuidance: string
  cropSafeZone: number // default 70
  focalPoint: { x: number; y: number }
  quality: 'low' | 'medium' | 'high'
}
```

Output contract:

```ts
{
  imageDataUrl: string
  filename: `${countrySlug}-dashboard-destination.webp`
  prompt: string
  model: 'gpt-image-2'
  assetType: 'dashboard_destination'
}
```

Generation master:

- 1536 × 1024
- opaque WebP
- one image per admin request
- central 70% crop-safe zone by default
- no generated text/UI/badges/rank/Match Score/pathway names

## 5. Dashboard Destinations parent-panel contract

The Dashboard already owns one widget named `destinations`.

```text
Destinations parent widget
├── #1 matched-country card
├── #2 matched-country card
├── #3 matched-country card
└── Visa Options for #1 matched country
```

The nested cards are not Dashboard widgets and do not participate independently in Dashboard customization.

### Match-card data

```ts
type DestinationRow = {
  country: CountryDetail
  match: number
  imageSrc: string | null
  focalPoint?: { x: number; y: number }
}
```

The card receives ranking and Match Score data. It does not calculate ranking.

Visible content:

- `#1`, `#2`, or `#3`
- country name

Match Score remains available to the accessibility label but is not visibly rendered in the card.

### Match-card image fallback

```text
approved generated dashboard_destination
    ↓
approved committed dashboardDestination
    ↓
official local country flag
    ↓
neutral Kolmari card fallback
```

Never automatically substitute:

- country-page `hero`
- city image
- Mapbox snapshot

Normal Dashboard visits never call image generation.

## 6. Visa Options preview

Source: existing `PATHWAYS` data.

Behavior:

```text
#1 ranked country
    ↓
PATHWAYS.filter(pathway.country === country.name)
    ↓
first 3 researched pathways
```

If no researched pathways exist:

`No researched visa pathways are available for this country yet.`

No pathway is invented and the Dashboard preview does not become a second pathway evaluator.

## 7. Incomplete-profile behavior

The nested country cards represent matched countries only.

```text
profile incomplete
→ no ranked cards
→ no Visa Options section
→ profile-completion empty state
```

Do not use arbitrary `COUNTRIES.slice(...)` values as substitute matches.

## 8. Country page layout schema

Source of truth: `src/lib/country-page/schema.ts`

```ts
type CountryPageLayoutConfig = {
  layoutStyle: 'kolmari-country-page-standard'
  hero: {
    minHeight: number
    contentMaxWidth: number
    focalPoint: { x: number; y: number }
    overlayStrength: number
    metrics: Array<{
      id: string
      label: string
      valueSource: string
      supportingSource?: string
    }>
  }
  tabs: Array<{ id: string; label: string; route: string }>
  overview: {
    mainSidebarRatio: string
    personalizedSummary: { enabled: boolean }
    snapshot: {
      showMap: boolean
      showClimateStrip: boolean
      showTradeoff: boolean
      factKeys: string[]
    }
    showMatchScore: boolean
    showRecommendedActions: boolean
    showTopCities: boolean
  }
}
```

## 9. Country-page reference rules

### National Flag Shadow Hero

Mexico is the visual reference only. It establishes fabric, shadow depth, silhouette treatment, emblem preservation, and balance. Every country uses its own flag, colors, national symbols, and geography.

### Kolmari Country Page Standard

Portugal is the layout reference only. It establishes page width, hero proportions, spacing, tabs, main/sidebar balance, Personalized Summary placement, Country Snapshot, Match Score, Recommended Actions, Top Cities, and responsive behavior.

## 10. Admin workflow

Country Page Generator Engine tabs:

1. Hero Image
2. Page Layout
3. Snapshot Map
4. City Images
5. Dashboard Destination Images
6. Country Content

Image workflow:

```text
admin form
→ one generation request
→ preview
→ review
→ download and/or explicit Save approved image
```

The browser never receives `OPENAI_API_KEY`.

`KOLMARI_ADMIN_EMAILS` remains the production allowlist.

Normal country-page and Dashboard visits do not generate `dashboard_destination` images.

## 11. File conventions

```text
public/images/countries/{country-slug}/{country-slug}-hero.webp
public/images/countries/{country-slug}/{country-slug}-dashboard-destination.webp
public/images/countries/{country-slug}/cities/{city-slug}.webp
```

## 12. Responsive Dashboard card standard

Parent panel stays in the Dashboard main content column.

Nested grid:

```css
grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
gap: 14px;
```

Card heights:

- desktop: 190px
- tablet: approximately 180px
- mobile: approximately 160px

Card overlay:

```css
linear-gradient(
  rgba(13, 27, 57, 0.55) 0%,
  rgba(13, 27, 57, 0.82) 100%
)
```

Targets: 1440px, 1024px, 768px, 390px, with Journey Tracker expanded and collapsed.

## 13. Preservation boundary

This implementation may extend the existing `destinations` widget and shared country visual system. It must not rebuild or redesign the Dashboard shell.

Preserve:

- authentication
- subscriptions
- Match Score logic
- ranking logic
- profile logic
- plan state
- Journey Tracker
- Dashboard widget customization
- unrelated Dashboard widgets
- Your World map
- unrelated Mapbox components
- Profile Wizard
- Flutter Mode
- researched `PATHWAYS`

The only Dashboard layout-level change permitted is marking the existing `destinations` parent widget as full-width through the existing widget registry so its nested three-card grid has sufficient room.
