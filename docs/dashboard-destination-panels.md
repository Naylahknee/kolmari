# Dashboard Destinations Panel

**Status:** Canonical Dashboard design and behavior specification  
**Applies to:** `/dashboard`  
**Parent widget:** `DashboardDestinationsCard`  
**Nested matched-country card:** `DashboardDestinationPanel`

## 1. Scope

This feature extends the existing Dashboard `Destinations` panel. It does **not** rebuild or refactor the Dashboard shell.

```text
DASHBOARD
└── DESTINATIONS PANEL  ← existing parent widget
    ├── #1 matched-country card
    ├── #2 matched-country card
    ├── #3 matched-country card
    └── Visa Options for #1 matched country
```

The three country cards are nested content, not Dashboard widgets.

## 2. Header

Preserve the existing parent-panel treatment:

- title: `Destinations`
- right-side link: `Explore more`
- link route: `/your-world`
- standard white Dashboard surface, border, radius, and padding

## 3. Match behavior

Source: `rankNextinations(profile)`.

- completed profile → show up to top 3 real ranked countries
- fewer than 3 matches → show only available matches
- incomplete profile → show no fake match cards
- never fill with arbitrary `COUNTRIES.slice(...)` values

The card does not calculate ranking.

## 4. Nested country card

Visible content only:

- rank marker: `#1`, `#2`, `#3`
- country name

Do not visibly show region, city, description, visa type, cost, Match Score, cost tier, ranking explanation, badges, eligibility metrics, or pathway detail.

Match Score remains available in the card's `aria-label`.

Navigation:

`/nextinations/{countrySlug}/v2/overview`

## 5. Layout

```css
grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
gap: 14px;
```

Preferred card height:

- desktop: 190px
- tablet: ~180px
- mobile: ~160px

The existing parent `destinations` widget is marked `full: true` in the existing Dashboard widget registry so its internal grid has sufficient width. This is a sizing change to the existing widget, not a Dashboard rebuild.

## 6. Dashboard destination image asset

Dedicated asset type:

`dashboard_destination`

It is not the country-page `hero`.

Generation master:

- 1536×1024
- opaque WebP
- central 70% crop-safe zone by default
- official flag fidelity
- protected national symbol placement
- compact small-card composition
- no generated text or UI

File convention:

`public/images/countries/{country-slug}/{country-slug}-dashboard-destination.webp`

## 7. Asset fallback

```text
approved generated dashboard_destination
→ approved committed dashboardDestination
→ official local flag
→ neutral Kolmari fallback
```

Do not automatically substitute:

- country-page hero
- city imagery
- Mapbox snapshot

Normal Dashboard visits do not request image generation.

## 8. Admin workflow

`Dashboard Destination Images` is a dedicated Country Page Generator Engine tab.

Workflow:

```text
admin enters country/image guidance
→ generate one preview
→ inspect responsive Dashboard crop
→ download and/or explicitly Save approved image
```

Generation remains protected by authentication and `KOLMARI_ADMIN_EMAILS`; `OPENAI_API_KEY` remains server-only.

## 9. Visa Options preview

The section appears beneath the nested match-card grid.

Heading:

`Visa Options for {#1 country}`

Source: existing `PATHWAYS` data.

- use the #1 ranked country only
- display up to 3 researched pathways
- keep rows concise
- link to `/pathways`
- do not invent routes
- do not generate legal explanations

No researched routes:

`No researched visa pathways are available for this country yet.`

No ranked country:

Do not render Visa Options.

## 10. Accessibility

Each card:

- semantic link
- keyboard navigable
- visible focus ring
- visible country name
- decorative background image
- `aria-label` includes rank, country, and Match Score

Visa Options uses a semantic section, heading, list, and links.

## 11. Overlay

Use approximately:

```css
linear-gradient(
  rgba(13, 27, 57, 0.55) 0%,
  rgba(13, 27, 57, 0.82) 100%
)
```

Do not fully black out, grayscale, or hide the flag identity.

## 12. Responsive validation

Test with Journey Tracker expanded and collapsed at:

- 1440px
- 1024px
- 768px
- 390px

Confirm:

- Destinations remains one parent widget
- cards wrap naturally
- mobile is one column
- Visa Options stay beneath cards
- Journey Tracker is unchanged
- no page overflow
- country names stay readable

## 13. Preservation rules

Preserve:

1. Dashboard shell and unrelated widgets.
2. Journey Tracker behavior.
3. Dashboard customization.
4. Match and ranking logic.
5. Profile logic.
6. Plan state.
7. Existing `PATHWAYS` data.
8. Your World map.
9. Country-page hero behavior.

Do not add local Primary/Selected destination product state to this panel.

## 14. Canonical behavior

```text
completed profile
→ rankNextinations(profile)
→ top 3 real matches
→ existing Destinations parent panel
→ nested rank + country-name cards
→ dashboard_destination/flag/fallback imagery
→ Visa Options for #1 from PATHWAYS
```

See also: `docs/country-design-schema.md`.
