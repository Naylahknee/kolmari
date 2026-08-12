# Hero Image

## Style
**National Flag Shadow Hero** *(Kolmari Standard)*

### Description

The National Flag Shadow Hero is the standard visual treatment for every Kolmari
country page.

It combines the country's official national flag with a subtle, superimposed
silhouette of the country itself. The silhouette functions as a translucent
shadow layer rather than a separate object, allowing the national flag to remain
the primary visual while reinforcing geographic recognition.

The country's official emblem, coat of arms, or seal must always remain in its
official position and must never be moved, covered, distorted, or replaced.

---

## Design Principles

### Background
- Official national flag
- Full-bleed composition
- Realistic woven fabric texture
- Soft folds
- Editorial lighting
- Premium travel aesthetic

### Country Silhouette
- Complete geographic outline
- Rendered as a translucent shadow
- Inherits the underlying flag colors
- Soft embossed/debossed depth
- Never rendered as parchment, paper, or stone
- Never appears as a floating cutout

### National Symbols
- Preserve all official emblems
- Maintain official placement
- Maintain safe visual space
- Never obstruct important symbols

### Composition
- Wide hero layout
- Designed for left-aligned UI content
- No text
- No city labels
- No pins
- No passport stamps
- No decorative graphics

---

## Visual Standard

**Reference Style:** Mexico

Mexico serves as the approved visual reference for:

- fabric treatment
- shadow opacity
- silhouette depth
- composition
- emblem protection

Mexico is **not** the template itself. Every country uses its own:

- official flag
- official emblem
- geographic silhouette
- national colors

---

## Output

- **Asset Type:** Country Hero
- **Style:** National Flag Shadow Hero
- **Resolution:** 1536 × 1024
- **Format:** WebP
- **Naming:** `public/images/countries/{country-slug}/{country-slug}-hero.webp`

---

## Where this lives in the code

- Generator UI: **Settings → Country Hero → Hero Image · National Flag Shadow
  Hero (Standard)** (`src/app/(app)/(workspace)/settings/country-hero/page.tsx`).
- Prompt: `buildHeroPrompt` in `src/lib/country-visuals/prompt.ts`.
- Resolution + fallback: `getApprovedHero` / `getCountryVisualAssets` in
  `src/lib/country-visuals/data.ts`. A country renders its committed hero WebP
  when present; otherwise the country page falls back to the same design language
  — the real flag with the silhouette as a translucent shadow.
