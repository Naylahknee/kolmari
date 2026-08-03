# Country Page Generator Engine

> Part of the **Country Design System** — see `docs/country-design-system.md` for
> the full system (layout standard, Personalized Summary, status indicators,
> fallbacks, responsive rules). This file documents the generator engine itself.

Kolmari includes an authenticated internal tool at:

`/settings/country-hero`

Tabs: **Hero Image · Page Layout · Snapshot Map · City Images · Country Content**.

It manages the three visual assets every country page needs. Two are AI-generated
and reviewed before download; one configures the existing interactive map.

1. **Hero Image** — the official flag as full-bleed matte fabric with the
   complete country silhouette rendered as a translucent superimposed shadow that
   inherits the flag colors ("Mexico Shadow Standard"). No parchment cutout, no
   pin, no text. The national emblem is always protected. Output `1536×1024`
   WebP, filename `{country-slug}-hero.webp`.
   - **Reference-guided generation.** Provide a **Flag code (ISO-2)** and the hero
     is produced with OpenAI's image-**edits** endpoint instead of text-to-image:
     the country's own flag raster (`public/flags-png/{code}.png`) is the subject
     and the committed **National Flag Shadow Hero** standard
     (`public/references/national-flag-shadow-hero.webp`) is applied automatically
     as the style exemplar, so the output preserves the real flag and matches the
     approved look with no extra steps. Uploading a **Style reference** overrides
     that built-in exemplar. With no flag code and no reference, it falls back to
     text-to-image on the written prompt (unchanged behavior).
   - **Use your own finished art.** The Hero and City tabs each have an upload
     card — pick a PNG/JPEG/WebP (≤6 MB) and "Save to site" stores it as-is via
     `POST /api/admin/country-asset`, no AI involved. Best when you already have
     the exact image.
2. **Snapshot Map** — a configuration + preview tool for the existing Mapbox
   locator (`CountrySnapshotMap`). **Never AI-generated.** Produces a
   `CountryVisualAssets.snapshotMap` block to copy into the registry.
3. **City Images** — premium editorial travel photography for city cards. No
   text, no flags, no collage, no fabricated landmarks. Output `1024×1024` WebP,
   filename `{city-slug}.webp`.

## Code map

- `src/lib/country-visuals/schema.ts` — Zod schemas: `heroImageInputSchema`,
  `cityImageInputSchema`, `snapshotMapConfigSchema`, the discriminated
  `generatorRequestSchema`, and the resolved `countryVisualAssetsSchema`
  (`CountryVisualAssets`). Path helpers `heroAssetPath` / `cityAssetPath` and
  `focalToObjectPosition`.
- `src/lib/country-visuals/prompt.ts` — `buildHeroPrompt` (Mexico Shadow
  Standard, text-to-image), `buildHeroEditPrompt` (image-edits, flag + optional
  style reference), and `buildCityPrompt`.
- `public/flags-png/{code}.png` — raster (1024px) versions of the local flag
  SVGs, used as the subject image for reference-guided hero edits (the edits
  endpoint needs raster, not SVG). Regenerate with `@resvg/resvg-js` from
  `public/flags/{code}.svg`.
- `public/references/national-flag-shadow-hero.webp` — the approved
  National Flag Shadow Hero standard (woven-fabric flag + translucent
  country-silhouette shadow). The route sends it to the edits endpoint as the
  default style exemplar whenever a hero is generated with a flag code and no
  uploaded reference.
- `src/lib/country-visuals/data.ts` — the per-country registry + resolvers
  (`getCountryVisualAssets`, `getApprovedHero`, `hasApprovedHero`,
  `getSnapshotMapConfig`). Pure, so both server and client import it.
- `src/app/api/admin/country-hero/route.ts` — one authenticated endpoint,
  discriminated on `assetType` (`hero` | `city`); returns `imageDataUrl`,
  `filename`, `prompt`, `model`, `assetType`. A hero request with a `flagCode`
  and/or `styleReferenceDataUrl` routes to `/v1/images/edits`; otherwise
  `/v1/images/generations`.
- `src/app/(app)/(workspace)/settings/country-hero/page.tsx` — the tabbed admin
  UI (Hero / Snapshot Map / City Images) with responsive preview frames.
- `src/components/country-template/CityCardImage.tsx` — the city-card image with
  the approved-photo → flag → placeholder fallback.

## Asset resolution + fallback hierarchy

The country-page template reads assets from the registry. An entry declares a
`hero` block only once the WebP is committed to `/public`, which deterministically
gates artwork vs fallback (no runtime filesystem check).

```
Country hero:     approved hero image → branded navy gradient + country outline
Country Snapshot: interactive Mapbox locator → static locator fallback → flag
City card:        approved city image → flag → neutral city placeholder
```

The hero sells the country, the snapshot answers "where is it?", and city images
answer "what might living there feel like?" — so the flag-map hero never doubles
as the snapshot, and the hero never doubles as a city-card fallback.

## File conventions

```
public/images/countries/{country-slug}/{country-slug}-hero.webp
public/images/countries/{country-slug}/cities/{city-slug}.webp
```

Generated images are **not** saved automatically. Review, download, commit the
file, and (for a new hero) add the `hero` block to the country's entry in
`src/lib/country-visuals/data.ts`.

## Required environment variables

Set these as encrypted deployment secrets. Do not commit their values.

```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put KOLMARI_ADMIN_EMAILS
```

`KOLMARI_ADMIN_EMAILS` is a comma-separated allowlist of authenticated Kolmari
emails. In local development, add the same variables to `.dev.vars`. The API key
stays server-side; the browser calls `/api/admin/country-hero` and never receives it.

`NEXT_PUBLIC_MAPBOX_TOKEN` (build-time) upgrades the Snapshot locator from the
schematic locator fallback to a real Mapbox map.

## Safety controls

- Endpoint requires an authenticated user; production is restricted to
  `KOLMARI_ADMIN_EMAILS`.
- Quality is selected explicitly per request; one image per request.
- The generated prompt is returned for review and reproducibility.
- No image is generated on a normal country-page visit.
