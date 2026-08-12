# Dashboard Destinations Panel

**Status:** Canonical Dashboard design and behavior specification  
**Applies to:** `/dashboard`  
**Parent widget:** `DashboardDestinationsCard`  
**Nested matched-country card:** `DashboardDestinationPanel`

---

## 1. Canonical Hierarchy

The **Destinations panel is the existing white Dashboard panel** shown alongside other Dashboard content.

It is the parent container.

The matched-country cards are nested inside that parent panel.

```text
DASHBOARD
│
├── Active Pathway panel
│
├── DESTINATIONS PANEL  ← parent Dashboard panel
│   │
│   ├── Header
│   │   ├── Destinations
│   │   └── Explore more
│   │
│   ├── MATCHED-COUNTRY GRID
│   │   ├── #1 country card
│   │   ├── #2 country card
│   │   └── #3 country card
│   │
│   └── VISA OPTIONS AREA
│       └── Visa Options for {active/top country}
│
├── Deadlines and blockers panel
│
└── Journey Tracker
```

The matched country cards do **not** replace the Destinations Dashboard panel.

The image generator creates imagery for the **nested matched-country cards**, not for the outer Destinations panel.

---

## 2. Required Visual Structure

The parent Destinations panel preserves Kolmari's standard Dashboard card treatment:

- white background
- Kolmari card radius
- standard border
- standard tile shadow
- Dashboard typography
- existing `Destinations` heading
- `Explore more` / `Explore Your World` navigation

Inside the parent panel:

```text
┌──────────────────────────────────────────────────────────────┐
│ Destinations                                   Explore more  │
│                                                              │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│ │ #1           │ │ #2           │ │ #3           │          │
│ │              │ │              │ │              │          │
│ │ COUNTRY      │ │ COUNTRY      │ │ COUNTRY      │          │
│ │ HERO IMAGE   │ │ HERO IMAGE   │ │ HERO IMAGE   │          │
│ │              │ │              │ │              │          │
│ │ PORTUGAL     │ │ SPAIN        │ │ MEXICO       │          │
│ └──────────────┘ └──────────────┘ └──────────────┘          │
│                                                              │
│ Visa Options for Portugal                                    │
│ ──────────────────────────────────────────────────────────── │
│ [researched visa/pathway options]                            │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Match Source

The panel does not calculate matches.

It consumes the existing ranked result from:

`rankNextinations(profile)`

When the authenticated Profile is complete:

```text
PROFILE
  ↓
MATCH ENGINE
  ↓
RANKED COUNTRIES
  ↓
TOP 3 MATCHES
  ↓
DESTINATIONS PARENT PANEL
  ↓
3 NESTED COUNTRY CARDS
```

No score may be fabricated.

---

## 4. Nested Country Card Template

Each matched-country card follows the supplied Dashboard Country Match template.

### Required card anatomy

Top:

- rank only: `#1`, `#2`, `#3`
- optional Match Score if the product decision keeps it on this surface

Center:

- Dashboard-specific country hero image

Bottom:

- country name

Secondary metadata must remain restrained. The country name and visual are dominant.

### Card dimensions

Rendered target:

- approximately `190px` high on desktop
- responsive width based on the parent grid
- rounded corners consistent with Kolmari
- `overflow-hidden`

### Grid

```text
mobile:  1 column
tablet:  2 columns when space requires
desktop: 3 columns
gap:     14–16px
```

Use an auto-fit/minmax implementation when the parent Dashboard column becomes too narrow because the Journey Tracker is expanded.

The card grid must never overflow the parent Destinations panel.

---

## 5. Dashboard Destination Image Is a Separate Asset Type

The Dashboard nested-card image is **not the Country Page Hero asset**.

Kolmari must maintain separate visual asset purposes:

```text
COUNTRY
├── hero
│   └── large Country Page hero
│
├── dashboard_destination
│   └── image composed specifically for Dashboard nested cards
│
└── city
    └── editorial city-card imagery
```

Do not use `hero` as the normal Dashboard image source.

Do not crop the Country Page Hero and call it the Dashboard standard.

---

## 6. Dashboard Destination Image Generation Standard

### Asset type

`dashboard_destination`

### Generation canvas

Use OpenAI's supported landscape canvas:

`1536 × 1024`

### Display target

The generated master is rendered into the nested Dashboard card at approximately:

```text
responsive card width × 190px height
object-fit: cover
```

The generation prompt must therefore be composed for aggressive responsive cropping.

### Safe composition zone

All essential visual information must remain inside the center **70%** of the generation canvas.

Do not place protected geography, national symbols, or important focal detail near the extreme edges.

### Generated-image exclusions

The generated bitmap contains:

- no country-name text
- no Match Score
- no rank
- no visa text
- no UI
- no badges
- no buttons

React renders all interface text above the image.

---

## 7. Dashboard Destination Generation Prompt Contract

The Dashboard generator must use its own prompt builder.

It must not call the Country Page hero prompt unchanged.

Required prompt intent:

```text
Create a premium Kolmari Dashboard Destination image for {COUNTRY}.

PURPOSE
This image will appear inside a compact matched-country card on the Kolmari Dashboard.
It will be displayed at approximately 190px high and responsively cropped with object-fit: cover.

COMPOSITION
- landscape composition
- keep the primary country-specific visual information inside the central 70% safe zone
- maintain recognition at small card size
- avoid critical information at extreme top, bottom, left, or right edges
- create a strong single focal composition rather than a wide website-banner composition

IDENTITY
- accurately represent {COUNTRY}
- preserve the country's actual national colors and protected national symbols when a flag treatment is used
- use the country's real geographic silhouette when the Kolmari flag-shadow treatment is used
- never substitute another country's geography or national symbols

STYLE
- Kolmari premium editorial visual system
- clean
- modern
- high contrast at small size
- restrained detail
- visually legible beneath a dark navy readability overlay

EXCLUDE
- text
- labels
- rank numbers
- Match Scores
- UI
- buttons
- city labels
- travel stickers
- passport stamps
- collage
- invented landmarks

OUTPUT
1536 × 1024
Opaque WebP
```

When using reference-guided generation, the country's real flag remains the subject and the approved Kolmari reference controls treatment only.

---

## 8. Image Storage and Reuse

Dashboard images are reusable **country-level assets**.

Correct:

```text
PORTUGAL
  ↓
ONE dashboard_destination asset
  ↓
User A matches Portugal → reuse
User B matches Portugal → reuse
User C matches Portugal → reuse
```

Incorrect:

```text
User A match → generate image
User B match → generate another image
User C match → generate another image
```

The generated asset belongs to the country/surface combination, not to the user.

Suggested persisted key:

```text
country_slug = portugal
asset_type   = dashboard_destination
```

Suggested committed path when an asset is checked into `/public`:

```text
/public/images/countries/portugal/dashboard/portugal-dashboard-destination.webp
```

---

## 9. Dashboard Image Resolution Hierarchy

The nested matched-country card resolves imagery in this order:

```text
1. Saved generated `dashboard_destination` asset
   ↓ if absent
2. Approved committed `dashboard_destination` asset
   ↓ if absent
3. Dashboard-specific branded fallback
   + background ensure request
```

The normal fallback chain must **not** silently substitute the large Country Page `hero` asset.

The Dashboard must not call OpenAI directly from the browser.

`OPENAI_API_KEY` remains server-side.

---

## 10. Dashboard-Specific Self-Heal

The Dashboard image pipeline needs its own ensure behavior.

Conceptual route:

```text
POST /api/internal/dashboard-destination/ensure
{ slug: "portugal" }
```

Behavior:

```text
Dashboard asks for Portugal dashboard_destination
        ↓
asset exists?
  ├── yes → render it
  └── no
       ↓
       show Dashboard fallback immediately
       ↓
       claim country + dashboard_destination generation lock
       ↓
       generate once
       ↓
       save as dashboard_destination
       ↓
       refresh card
```

The lock must be scoped by **country + asset type**, so Country Page hero generation and Dashboard destination generation cannot block or overwrite each other.

---

## 11. Visa Options Area

The Visa Options section belongs **inside the parent Destinations panel, below the matched-country cards**.

Default context:

- use the user's top-ranked matched country when the panel first renders

Example:

`Visa Options for Portugal`

The options must come from existing researched Kolmari Pathways data.

The Dashboard must not invent a second visa engine.

Each route preview may show:

- pathway/visa name
- fit state when a real evaluation exists
- concise requirement signal
- route to the full Pathways experience

A `Show more` control may expand additional researched routes.

If no researched pathway exists for the selected country, show an honest empty state.

---

## 12. Country Card Interaction

The matched-country card is a nested interactive unit inside the parent panel.

Permitted behavior:

- focus/activate a country for the Visa Options area
- navigate to `/nextinations/{slug}/v2/overview`

These two actions must be visually distinct if both are exposed.

Do not make a single click ambiguously both change the Visa Options context and navigate away.

If a lock/Primary action is later added, `event.stopPropagation()` is required so it does not trigger card navigation.

---

## 13. Selected / Primary Destination

A temporary **active card for viewing Visa Options** is allowed as local UI state.

That active-card state is not the same as the user's persisted relocation decision.

Do not write `Primary`, `Selected`, or `Decided` into product state from this panel until Kolmari's canonical destination relationship model defines that behavior.

---

## 14. Responsive Behavior

### Mobile

```text
Destinations parent panel
  ↓
#1 card
#2 card
#3 card
  ↓
Visa Options
```

No horizontal scrolling is required.

### Tablet

Use one or two nested columns according to available parent width.

### Desktop

Use three nested columns when the parent width safely supports them.

The Journey Tracker remains separate from the Destinations parent panel.

---

## 15. Animation

Use restrained Dashboard microinteraction only:

- subtle image scale on hover
- subtle selected-card border/ring transition
- smooth Visa Options disclosure
- optional staggered card entrance

Respect `prefers-reduced-motion`.

No large bounce, parallax, or continuous animation.

---

## 16. Failure States

### Profile incomplete

Do not fabricate ranked matches.

The parent panel may show a Profile completion state or clearly marked unscored discovery content according to the Dashboard product rule.

### Dashboard image unavailable

Render the Dashboard-specific branded fallback.

### Dashboard generation fails

Keep fallback. Do not substitute another country's image.

### Visa data unavailable

Show:

`Visa options for {country} are still being verified.`

### Match Score unavailable

Do not display a placeholder percentage.

---

## 17. Component Ownership

### `DashboardDestinationsCard`

Owns:

- outer white Destinations Dashboard panel
- panel header
- nested match-card grid
- active Visa Options country context
- Visa Options section

### `DashboardDestinationPanel`

Owns:

- one nested matched-country card
- rank display
- Dashboard-specific country image
- country name
- card interactions

### Dashboard image generator

Owns:

- `dashboard_destination` prompt
- Dashboard-specific composition
- Dashboard-specific asset storage
- generation lock
- fallback/ensure behavior

It does not own:

- Match calculation
- visa eligibility
- shortlist state
- relocation decision state
- Country Page hero generation

---

## 18. Preservation Rules

AI coding agents modifying this feature must preserve:

1. The existing white Dashboard **Destinations panel** as the parent component.
2. Matched country cards must remain nested inside that parent panel.
3. Visa Options must remain inside the parent Destinations panel below the country grid.
4. The Dashboard country image uses `dashboard_destination`, not the Country Page `hero` asset.
5. Match ranking comes from the canonical match engine.
6. Visa options come from canonical Pathways data.
7. No fabricated Match Scores.
8. No fabricated visa eligibility.
9. No per-user AI image generation.
10. Generation locks must distinguish asset type.
11. The Journey Tracker remains a separate Dashboard structure.
12. The outer Destinations panel must not be replaced by three independent Dashboard widgets.

---

## 19. Canonical Behavior Flow

```text
USER COMPLETES PROFILE
        ↓
rankNextinations(profile)
        ↓
TOP 3 MATCHES
        ↓
DASHBOARD
        ↓
DESTINATIONS PARENT PANEL
        ↓
┌────────────┬────────────┬────────────┐
│ #1         │ #2         │ #3         │
│ Dashboard  │ Dashboard  │ Dashboard  │
│ image      │ image      │ image      │
│ PORTUGAL   │ SPAIN      │ MEXICO     │
└────────────┴────────────┴────────────┘
        ↓
VISA OPTIONS FOR PORTUGAL
        ↓
CANONICAL PATHWAYS DATA
```

This document is the canonical design contract for the **Dashboard Destinations parent panel and its nested matched-country cards**.
