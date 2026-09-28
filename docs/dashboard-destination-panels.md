# Dashboard Destinations Panel

**Status:** Canonical Dashboard design and behavior specification  
**Applies to:** `/dashboard`  
**Parent section:** `YourMatchesSection` (`Your matches`)
**Nested matched-country card:** `DashboardDestinationPanel`

## 1. Scope

Paid tiers with a complete profile see one **Your matches** section on the Dashboard. It does **not** rebuild or replace the Dashboard shell.

```text
DASHBOARD
└── YOUR MATCHES SECTION
    ├── #1 matched-country selector
    ├── #2 matched-country selector
    ├── #3 matched-country selector
    ├── Journey tracker (nested beside the cards)
    └── Visa Options for selected matched country (same section, below the cards)
```

The three country cards are nested selectors inside the section. They are not Dashboard widgets and they do not navigate to country pages. Selecting a card opens that country's researched visa options inside the same section.

## 2. Header

Preserve:

- title: `Your matches` (paid + complete profile)
- helper copy: `Select a match to preview its visa pathways below.` when matches exist
- right-side link: `Explore more destinations`
- link route: `/your-world`
- standard white Dashboard surface, border, radius, and padding

`Explore more destinations` is the explicit navigation path from this parent panel into destination discovery.

## 3. Match behavior

Source: `rankNextinations(profile)`.

- completed profile → show up to top 3 real ranked countries
- fewer than 3 matches → show only available matches
- incomplete profile → show no fake match cards
- never fill with arbitrary `COUNTRIES.slice(...)` values

The card does not calculate ranking.

## 4. Nested country selector

Visible content (owner direction 2026-09-28; supersedes the earlier minimal-card rule):

- country name + region
- fit badge: `Strong Fit` (match >= 80) or `Worth Exploring`
- one-line hook: the top personalized match reason, falling back to the country summary
- three-stat row built only from researched fields: Income guide (`incomeRequired`/mo), Route (`visaType`), Safety (`Very safe`/`Safe`)
- `Viewing` state indicator only for the currently selected card

Do not visibly show city, cost tier, ranking explanation, eligibility metrics, or pathway detail inside the image card. Citizenship timelines and cost-of-living figures are not shown because no verified production source exists for them; do not invent them.

Rank (`#1`/`#2`/`#3`) and the numeric Match Score remain available in the card's accessible label.

### Interaction rule

The matched-country card is a button-like selector, not navigation.

Clicking or tapping a card:

1. sets that match as the temporary viewing selection inside the Destinations parent panel;
2. updates the Visa Options section below the cards to that country;
3. does **not** leave `/dashboard`;
4. does **not** save, shortlist, select, or otherwise change the user's destination product state.

The #1 ranked country is the default viewing selection when the panel first renders.

Selected cards use a visible Kolmari gold border/ring and a `Viewing` indicator. Keyboard focus must remain visible.

## 5. Layout

```css
grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
gap: 14px;
```

Preferred card height:

- desktop: 190px
- tablet: ~180px
- mobile: ~160px

The Your Matches section may occupy the primary Dashboard column so its internal matched-country grid has sufficient width.

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

Visa Options are part of the Your Matches section and appear beneath the matched-country grid (and the nested Journey tracker), inside the same section.

Heading:

`Visa Options for {selected country}`

Source: existing researched `PATHWAYS` data.

- selected country defaults to #1 match
- selecting #2 or #3 updates this section in place
- display up to 3 researched pathways for the selected country
- keep rows concise: pathway name + category
- pathway rows remain informational
- one explicit `Open Pathways` link may navigate to `/pathways`
- do not invent routes
- do not generate legal explanations

No researched routes:

`No researched visa pathways are available for this country yet.`

No ranked country: do not render Visa Options.

## 9. Accessibility

Each matched-country selector:

- uses a semantic button
- is keyboard operable
- exposes `aria-pressed` for selected state
- references the Visa Options region with `aria-controls`
- has a visible focus state
- exposes rank, country, Match Score, and the result of activation in its accessible label

The Visa Options region uses `aria-live="polite"` so its heading/content change can be announced after a new country is selected.

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
- selecting any card updates Visa Options below
- selection never navigates away from Dashboard
- Visa Options remain inside the parent panel
- no page overflow
- country names stay readable

## 13. Preservation rules

Preserve match/ranking logic, profile logic, plan state, existing `PATHWAYS`, Your World, and country-page hero behavior. Dashboard layout customization controls panel placement only.

The temporary selected card is presentation state only. Do not convert it into Primary, Saved, Shortlisted, or Selected destination product state.

## 14. Canonical behavior

```text
completed profile
→ rankNextinations(profile)
→ top 3 real matches
→ existing Destinations parent panel
→ #1 selected by default
→ user may select #1 / #2 / #3
→ Visa Options below update to selected country
→ no country-page navigation
```
