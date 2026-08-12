# Country Page Generator Engine

> Part of the **Country Design System**. See `docs/country-design-system.md` and `docs/country-design-schema.md` for the canonical layout, visual, Dashboard, and schema contracts.

Authenticated internal tool:

`/settings/country-hero`

## Tabs

1. **Hero Image**
2. **Page Layout**
3. **Snapshot Map**
4. **City Images**
5. **Dashboard Destination Images**
6. **Country Content**

Image generation is admin-only. Production access is restricted by `KOLMARI_ADMIN_EMAILS`; `OPENAI_API_KEY` remains server-side. Each request generates one image preview. Saving is a separate explicit approval action.

## Hero Image

Official style: **National Flag Shadow Hero**.  
Reference example: **Mexico**.

Mexico is only the visual reference for fabric, silhouette-shadow treatment, emblem preservation, and balance. Every country uses its own flag, national symbols, colors, and geography.

Output:

- 1536×1024
- opaque WebP
- `{country-slug}-hero.webp`

Committed path:

`public/images/countries/{country-slug}/{country-slug}-hero.webp`

The generator may use the real local flag raster through OpenAI image edits. The approved National Flag Shadow Hero reference may guide the country-page hero style.

## Dashboard Destination Images

Dedicated asset type:

`dashboard_destination`

This asset belongs to the nested matched-country cards inside the existing Dashboard `Destinations` parent panel. It is not the country-page hero.

Output:

- 1536×1024
- opaque WebP
- central 70% crop-safe zone by default
- `{country-slug}-dashboard-destination.webp`

Committed path:

`public/images/countries/{country-slug}/{country-slug}-dashboard-destination.webp`

The artwork is optimized for responsive cards approximately 190px tall. It preserves official flag identity and protected symbols, but may use a simpler flag-led composition than the full National Flag Shadow Hero.

It contains no generated:

- country-name text
- rank
- Match Score
- visa/pathway names
- badges
- UI
- city labels
- unrelated travel photography

Dashboard destination images do not automatically reuse country-page heroes.

## City Images

Premium editorial city photography.

Output uses the closest supported landscape generation size to the documented 1200×800 target and is saved as WebP.

Committed path:

`public/images/countries/{country-slug}/cities/{city-slug}.webp`

City images are not used as Dashboard destination or country-hero fallbacks.

## Snapshot Map

Snapshot Map is configuration only. It uses the existing Mapbox locator and is never generated with AI.

Inputs include center, zoom, bounds, capital, marker visibility, and map style.

Do not modify the Your World map from this tool.

## Page Layout

The Page Layout tab previews the **Kolmari Country Page Standard**.

Reference implementation: **Portugal**.

Portugal is the layout reference only; it does not supply other countries' content.

The layout config is defined by:

- `src/lib/country-page/schema.ts`
- `src/lib/country-page/default-layout.ts`

## Country Content

The content model separates:

- verified data
- user-calculated values
- editorial text
- unavailable information

Unavailable information must remain unavailable rather than being fabricated or silently promoted to verified fact.

## API contracts

Generator:

`POST /api/admin/country-hero`

Supported persisted/API asset names:

```text
hero
city
dashboard_destination
```

Existing `hero` and `city` values are preserved for compatibility.

Approved save:

`POST /api/admin/country-asset`

Public approved asset serving:

```text
GET /api/country-asset?slug={slug}&type=hero
GET /api/country-asset?slug={slug}&type=dashboard_destination
GET /api/country-asset?slug={slug}&type=city&city={citySlug}
```

## Database compatibility

`country_generated_assets.asset_type` is already `TEXT`. Adding `dashboard_destination` requires no database schema migration.

## Dashboard runtime rule

Ordinary Dashboard visits **never generate images**.

Dashboard nested-card fallback:

```text
saved generated dashboard_destination
→ approved committed dashboardDestination
→ official local flag
→ neutral Kolmari fallback
```

There is no Dashboard self-heal/ensure endpoint.

## Manual review rule

Canonical workflow:

```text
admin generates one image
→ previews it
→ reviews it
→ downloads and/or explicitly saves approved image
```

Do not automatically save `dashboard_destination` images after generation.

## Security

Set encrypted deployment secrets:

```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put KOLMARI_ADMIN_EMAILS
```

Never expose these values to the browser or commit them to the repository.
