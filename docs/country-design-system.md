# Country Design System

One shared, data-driven system for **every** Kolmari country page. There are no
per-country page components and no one-off layouts — Portugal, Mexico, and every
future country render from the same template, components, schemas, and assets.

## The two references (styles, not templates)

- **Hero visual style: National Flag Shadow Hero.** Reference implementation:
  **Mexico**. Mexico is the approved *visual reference only* (fabric treatment,
  silhouette opacity, shadow depth, emblem preservation, composition). It is not
  a Mexico template — every country uses its own flag, emblem, colors, and
  geographic silhouette. Full spec: `docs/hero-image-standard.md`.
- **Page layout style: Kolmari Country Page Standard.** Reference
  implementation: **Portugal**. Portugal defines width, hero proportions,
  spacing, tabs, main/sidebar, snapshot, Match Score placement, Top Cities, and
  responsive behavior — not its content.

## Where it lives

| Concern | Code |
| --- | --- |
| Visual assets schema + registry | `src/lib/country-visuals/schema.ts`, `data.ts` |
| Hero prompt (National Flag Shadow Hero) | `src/lib/country-visuals/prompt.ts` |
| Page layout config + default | `src/lib/country-page/schema.ts`, `default-layout.ts` |
| Shared page template / shell | `src/components/country-template/CountryTemplate.tsx` |
| Hero (artwork/flag-composite, status chips, metrics) | `src/components/country-template/CountryHero.tsx` |
| Personalized Summary | `src/components/country-template/PersonalizedCountrySummary.tsx` |
| City card image | `src/components/country-template/CityCardImage.tsx` |
| Snapshot map | `src/components/country-workspace/CountrySnapshotMap.tsx` |
| Admin engine | `src/app/(app)/(workspace)/settings/country-hero/page.tsx` |
| Generator API | `src/app/api/admin/country-hero/route.ts` |

## Admin — Country Page Generator Engine

Tabs: **Hero Image · Page Layout · Snapshot Map · City Images · Country
Content**. Auth + `KOLMARI_ADMIN_EMAILS` + server-only `OPENAI_API_KEY` +
manual approval + one image per request are preserved. No image is generated on
an ordinary page visit. Snapshot maps are Mapbox config, never AI.

## Hero rules

- Background is the **country's own flag** (fabric, full-bleed). The committed
  National Flag Shadow Hero WebP is used when present; otherwise the same design
  language is composed from the real flag + a translucent shadow silhouette.
- **No flag badge next to the country title** — the flag already fills the hero.
  (Compact flag badges on city cards and other small contexts stay.)
- **Required status indicators**: compact, real-data chips (matched status +
  rank, primary route, dataset verification, …). Never fabricated.
- **Required metric strip** (four, in order): Cost vs your budget · Your best
  route · Time to residency · Path to citizenship — from `country_data` + the
  user profile, never hardcoded per country. Honest "being verified" when unset.

## Personalized Summary

Reusable `PersonalizedCountrySummary`, shown directly above Country Snapshot.
Renders **only** when the profile is complete and the country has calculated
Match Score data — otherwise hidden (no empty placeholder). Expanded by default
for the user's #1 match, collapsed otherwise; semantic button + `aria-expanded`
+ `aria-controls`. Uses calculated match data + verified country data + editorial
text; never fabricates eligibility, timelines, or legal conclusions.

## Fallback hierarchy (consistent everywhere)

```
Country hero:     approved hero image → flag + shadow-silhouette composite → branded gradient
Country Snapshot: interactive Mapbox locator → static locator fallback → flag
City card:        approved city image → flag → neutral city placeholder
```

The hero sells the country; the snapshot answers "where is it?"; city images
answer "what might living there feel like?" No asset crosses roles — the hero is
never a city-card fallback, and the flag-map hero is never the snapshot.

## Saving generated images (no redeploy)

The Hero and City tabs each offer **Download** and **Save to site**. "Save to
site" stores the approved image in Neon (`country_generated_assets`) via
`POST /api/admin/country-asset` (admin-only). The country page then serves it
from **`GET /api/country-asset?slug=…&type=hero`** (public, cached, versioned by
`updated_at`) with no redeploy. Hero resolution order:

```
saved generated hero (Neon /api/country-asset) → committed /public artwork → flag + shadow composite → gradient
```

Committing a WebP to `/public` (below) still works and is the durable option.

```
public/images/countries/{country-slug}/{country-slug}-hero.webp
public/images/countries/{country-slug}/cities/{city-slug}.webp
```

## Flags

Country flags are **local, public-domain SVGs** under `public/flags/{code}.svg`
(ISO-3166-1 alpha-2), resolved via `flagSrc()` in `src/lib/flags.ts`. There is no
external flagcdn dependency (removed from the CSP and `next/image` config).

## Responsive

Targets 1440 / 1024 / 768 / 390px. Desktop: max-width 1240px, hero ≈320px,
main/sidebar grid, four city cards, five-column fact grid. Tablet: hero ≈300px,
scrolling tabs, two city columns. Mobile: hero ≈360–420px, wrapping status
chips, two-column or scrollable metric strip, scrollable tabs, single-column
sections, no page overflow.

## Preservation

Auth, subscriptions, Match Score/ranking/profile logic, database, routing, the
Your World map, and unrelated Mapbox components are not modified by this system.
No secrets in the browser; no runtime image generation; no fabricated legal or
immigration conclusions; no new country-specific page components.
