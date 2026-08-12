# Country Design System

One shared, data-driven system for every Kolmari country page and the approved country-derived Dashboard surfaces. There are no per-country page components or one-off country layouts.

## Approved references

- **Hero visual style:** **National Flag Shadow Hero**. Reference example: **Mexico**. Mexico defines the approved fabric/shadow/emblem-preservation treatment only. Every country uses its own flag, colors, symbols, emblem placement, and geography.
- **Page layout style:** **Kolmari Country Page Standard**. Reference implementation: **Portugal**. Portugal defines the shared width, spacing, hero proportions, tabs, main/sidebar balance, Personalized Summary placement, Country Snapshot, Match Score, Recommended Actions, Top Cities, and responsive structure only.

## System locations

| Concern | Source |
| --- | --- |
| Visual schemas | `src/lib/country-visuals/schema.ts` |
| Visual asset registry | `src/lib/country-visuals/data.ts` |
| Prompt builders | `src/lib/country-visuals/prompt.ts` |
| Country page layout schema | `src/lib/country-page/schema.ts` |
| Default page layout | `src/lib/country-page/default-layout.ts` |
| Shared country template | `src/components/country-template/` |
| Snapshot locator | `src/components/country-workspace/CountrySnapshotMap.tsx` |
| Admin engine | `src/app/(app)/(workspace)/settings/country-hero/page.tsx` |
| Generator API | `src/app/api/admin/country-hero/route.ts` |
| Approved asset save API | `src/app/api/admin/country-asset/route.ts` |
| Asset serving API | `src/app/api/country-asset/route.ts` |
| Dashboard Destinations parent | `src/components/kolmari/dashboard-side-cards.tsx` |
| Nested Dashboard country card | `src/components/kolmari/dashboard/destination-panel.tsx` |
| Canonical design/data schema | `docs/country-design-schema.md` |

## Country Page Generator Engine

Admin tabs:

1. Hero Image
2. Page Layout
3. Snapshot Map
4. City Images
5. Dashboard Destination Images
6. Country Content

Generation remains authenticated and production-restricted by `KOLMARI_ADMIN_EMAILS`. `OPENAI_API_KEY` stays server-only. Each request generates one preview image. Saving is a separate explicit approval action.

The Dashboard never generates artwork during an ordinary page visit.

## National Flag Shadow Hero

Country-page hero rules:

- official national flag as full-bleed background
- realistic matte woven fabric
- protected official emblems/symbols stay in their official locations
- complete country silhouette rendered as a translucent superimposed shadow
- no duplicate flag badge beside the country title
- no generated text, pins, stickers, collage, passport marks, decorative plants, or unrelated imagery
- 1536×1024 opaque WebP

Mexico is a visual reference, never a reusable country-specific template.

## Required hero behavior

Country-page heroes preserve:

- compact real-data status indicators when data exists
- metric strip: Cost vs your budget · Your best route · Time to residency · Path to citizenship
- shared page spacing and responsive behavior
- real country/user data only; no fabricated eligibility or legal conclusions

## Personalized Summary

`PersonalizedCountrySummary` is shared across countries and renders only when:

- the profile/assessment is complete, and
- real Match Score data exists for that country.

It is expanded by default for the #1 ranked country and collapsed by default for other matched countries. No empty placeholder is shown for browse-only or unscored countries.

## Snapshot Map and city imagery

Snapshot Map is Mapbox configuration, never AI-generated.

```text
Country Snapshot: interactive locator → locator/static fallback → flag only as last resort
```

Top Cities use city-specific imagery.

```text
City card: city image → country flag → neutral city placeholder
```

Country hero artwork is not a city fallback.

## Dashboard Destinations parent panel

The Dashboard already contains one `destinations` widget. It remains one parent panel; the Dashboard itself is not rebuilt.

```text
Destinations
├── #1 matched-country card
├── #2 matched-country card
├── #3 matched-country card
└── Visa Options for #1 matched country
```

Only the parent `destinations` widget participates in Dashboard customization.

When the user profile is incomplete, the parent panel renders a profile-completion empty state rather than arbitrary countries.

## Dashboard destination images

Dashboard nested cards use a separate asset type:

`dashboard_destination`

They do **not** automatically reuse `hero`, city images, or Mapbox snapshots.

Master standard:

- 1536×1024 opaque WebP
- central 70% crop-safe zone by default
- official flag fidelity
- protected national symbols
- compact small-card composition
- no generated text/UI/rank/Match Score/pathway names

Fallback:

```text
approved generated dashboard_destination
→ approved committed dashboardDestination
→ official local flag
→ neutral Kolmari fallback
```

File:

`public/images/countries/{country-slug}/{country-slug}-dashboard-destination.webp`

## Dashboard matched-country cards

The existing ranking engine supplies the top three matched countries. The visual card does not calculate ranking.

Visible content:

- rank marker (`#1`, `#2`, `#3`)
- country name

Match Score remains available in accessibility text but is not visibly rendered.

The nested grid uses approximately:

`repeat(auto-fit, minmax(260px, 1fr))` with a 14px gap.

## Dashboard Visa Options preview

The Visa Options section uses the #1 ranked country only and reads existing researched `PATHWAYS` data.

- show up to 3 routes
- no invented routes
- no generated legal explanation
- if none exist: `No researched visa pathways are available for this country yet.`

## Persisted visual asset names

Compatibility is preserved:

```ts
'hero' | 'city' | 'dashboard_destination'
```

Existing `hero` and `city` database/API values are not renamed. `asset_type` is already a text column, so `dashboard_destination` does not require a schema migration.

## File conventions

```text
public/images/countries/{country-slug}/{country-slug}-hero.webp
public/images/countries/{country-slug}/{country-slug}-dashboard-destination.webp
public/images/countries/{country-slug}/cities/{city-slug}.webp
```

## Responsive standard

Target widths: 1440, 1024, 768, and 390px.

Dashboard Destinations must also be tested with the Journey Tracker expanded and collapsed. The parent panel may use the existing Dashboard widget registry's `full` property to gain sufficient main-column width; this does not create new widgets or rebuild the Dashboard.

## Preservation

Do not change unrelated Dashboard structure or behavior. Preserve authentication, subscriptions, Match Score logic, ranking logic, profile logic, plan state, Journey Tracker, Dashboard customization, unrelated widgets, Your World map, unrelated Mapbox components, Profile Wizard, Flutter Mode, and researched `PATHWAYS` data.
