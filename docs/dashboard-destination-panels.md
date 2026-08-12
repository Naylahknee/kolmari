# Dashboard Destinations Panel

**Status:** Canonical Dashboard design and behavior specification  
**Applies to:** `/dashboard`  
**Parent widget:** `DashboardDestinationsCard`  
**Nested matched-country card:** `DashboardDestinationPanel`

## 1. Scope

This feature extends the existing Dashboard `Destinations` panel. It does **not** rebuild or replace the Dashboard shell.

```text
DASHBOARD
└── DESTINATIONS PANEL
    ├── #1 matched-country card
    ├── #2 matched-country card
    ├── #3 matched-country card
    └── Visa Options for #1 matched country
```

The three country cards are nested information surfaces, not Dashboard widgets and not country-page navigation controls.

## 2. Header

Preserve:

- title: `Destinations`
- right-side link: `Explore more`
- link route: `/your-world`
- standard white Dashboard surface, border, radius, and padding

`Explore more` is the explicit navigation path from this parent panel into destination discovery.

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

Match Score remains available in the card's accessible label.

**Interaction rule:** clicking or tapping the matched-country card does nothing. The card must not redirect to a country page. It is a visual summary of the ranked result inside the Dashboard parent panel.

## 5. Layout

```css
grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
gap: 14px;
```

Preferred card height:

- desktop: 190px
- tablet: ~180px
- mobile: ~160px

The Destinations panel may occupy the primary Dashboard column so its internal matched-country grid has sufficient width.

## 6. Dashboard destination image asset

Dedicated asset type: `dashboard_destination`.

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

Do not automatically substitute the country-page hero, city imagery, or Mapbox snapshot. Normal Dashboard visits do not request image generation.

## 8. Visa Options preview

Visa Options are part of the parent Destinations panel and appear beneath the nested matched-country grid.

Heading:

`Visa Options for {#1 country}`

Source: existing researched `PATHWAYS` data.

- use the #1 ranked country only
- display up to 3 researched pathways
- keep rows concise: pathway name + category
- the parent may include one explicit `View all pathways` link to `/pathways`
- do not invent routes
- do not generate legal explanations

No researched routes:

`No researched visa pathways are available for this country yet.`

No ranked country: do not render Visa Options.

## 9. Accessibility

Each matched-country card:

- is a semantic article/information surface rather than a link
- has a visible country name and rank
- treats the background image as decorative
- exposes rank, country, and Match Score through its accessible label

Visa Options uses a semantic section, heading, and list. Explicit navigation links remain separately identifiable controls.

## 10. Overlay

Use approximately:

```css
linear-gradient(
  rgba(13, 27, 57, 0.55) 0%,
  rgba(13, 27, 57, 0.82) 100%
)
```

Do not fully black out, grayscale, or hide the flag identity.

## 11. Dashboard relationship

The Dashboard layout is controlled by `docs/dashboard-layout-builder.md`.

Default composition places Destinations in the primary column and Progress by planning area, Active pathway, and Deadlines and blockers in the second column. The Journey tracker defaults to the header dropdown but may be placed in the Dashboard canvas through Account → Dashboard.

## 12. Responsive validation

Test at:

- 1440px
- 1024px
- 768px
- 390px

Confirm:

- Destinations remains one parent widget
- matched cards wrap naturally
- mobile is one column
- Visa Options stay beneath cards
- cards do not navigate
- no page overflow
- country names stay readable

## 13. Preservation rules

Preserve match/ranking logic, profile logic, plan state, existing `PATHWAYS`, Your World, and country-page hero behavior. Dashboard layout customization controls panel placement only.

Do not add local Primary/Selected destination product state to this panel.

## 14. Canonical behavior

```text
completed profile
→ rankNextinations(profile)
→ top 3 real matches
→ existing Destinations parent panel
→ non-navigational rank + country-name cards
→ concise Visa Options for #1 ranked country
```
