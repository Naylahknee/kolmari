import type { HeroImageInput, DashboardDestinationImageInput, CityImageInput } from './schema'

/* Prompt builders for the Country Visual Asset Engine.
 *
 * Hero: National Flag Shadow Hero for country pages.
 * Dashboard destination: a separate compact flag-led composition for the
 * existing Dashboard Destinations panel. It is not the country-page hero.
 * City: premium editorial travel photography.
 */

export function buildHeroPrompt(input: HeroImageInput) {
  return `Create a premium, wide-format country-page hero background for Kolmari.

COUNTRY
${input.countryName}

COMPOSITION
Use the official national flag of ${input.countryName} as the full-bleed background.
Render the flag as realistic matte fabric with subtle folds, fine woven texture, soft directional lighting, controlled shadows, and no glossy or plastic finish.
The flag must remain immediately recognizable.

NATIONAL SYMBOL PROTECTION
The flag contains the following important national symbol:
${input.protectedSymbolDescription}

Its official position is:
${input.protectedSymbolPosition}

The symbol must remain in its official position, fully visible, unaltered, uncovered, and retain at least ${input.safeZonePercent}% clear visual space.

COUNTRY SILHOUETTE
Place the complete geographic silhouette of ${input.countryName} across the flag.
The full country must be visible, including:
${input.geographicRequirements}

Render the silhouette as a subtle superimposed shadow rather than a solid object. It should inherit the flag colors beneath it, use approximately ${input.shadowOpacity}% opacity, have ${input.shadowDepth}, remain geographically recognizable, and never appear as parchment, stone, paper, or a separate cutout.
Silhouette scale: ${input.silhouetteScale}.
Silhouette position: ${input.silhouettePosition}.
Adjust intelligently so both the flag and full outline remain readable.

LAYOUT
- wide editorial hero composition
- no text
- no city labels
- no location pins
- no stickers
- no collage
- no photographs
- no travel icons
- no passport stamps
- no decorative plants
- no added symbols
- must work behind left-aligned website content

STYLE
Premium relocation platform
Modern editorial
High-end travel publication
Subtle dimensional realism
Clean composition
Strong visual identity

Mexico is the visual reference only for the approved fabric/shadow treatment. Do not reuse Mexico-specific geography, colors, symbols, emblem, or positioning.

OUTPUT
1536 × 1024
Opaque WebP`
}

export function buildHeroEditPrompt(input: HeroImageInput, opts: { hasStyleRef: boolean }) {
  const styleClause = opts.hasStyleRef
    ? `Match the SECOND attached image only as a style reference for woven-fabric texture, folds, lighting, translucent silhouette treatment, depth, edge softness, and premium editorial finish. Do not copy that reference country's flag, colors, emblem, geography, or layout.`
    : `Render the flag as premium matte woven fabric with subtle folds, fine texture, soft directional light, and the complete country silhouette as a translucent superimposed shadow.`

  return `Transform the FIRST attached image — the official national flag of ${input.countryName} — into the Kolmari National Flag Shadow Hero.

PRESERVE THE FLAG
- Keep the real colors, proportions, and layout exactly as provided.
- Keep ${input.protectedSymbolDescription} at ${input.protectedSymbolPosition}, fully visible and unaltered.
- Keep at least ${input.safeZonePercent}% clear space around protected national symbols.

TREATMENT
${styleClause}
Fabric treatment: ${input.flagTextureIntensity}.
Shadow opacity: approximately ${input.shadowOpacity}%.
Shadow depth: ${input.shadowDepth}.

COUNTRY SILHOUETTE
- Include the complete geographic silhouette of ${input.countryName}: ${input.geographicRequirements}.
- Scale: ${input.silhouetteScale}.
- Position: ${input.silhouettePosition}.
- Never cover the national emblem.
- Never render the silhouette as parchment, stone, paper, or a separate cutout.

LAYOUT & EXCLUSIONS
- wide editorial country-page hero
- no text, labels, city names, pins, stickers, collage, photographs, travel icons, passport stamps, plants, or added symbols
- leave usable content space for left-aligned page content

OUTPUT
1536 × 1024, opaque WebP.`
}

export function buildDashboardDestinationPrompt(input: DashboardDestinationImageInput) {
  return `Create a premium Kolmari Dashboard Destination image for ${input.countryName}.

PURPOSE
This artwork is used only inside the existing Dashboard Destinations parent panel. It will be displayed as a compact matched-country card approximately 190px tall with fluid width. It is NOT a country-page hero and must be composed specifically for a small responsive crop.

FLAG FIDELITY
- Use the official national flag of ${input.countryName} as the visual foundation.
- Preserve the real flag colors, proportions, and recognizable layout.
- Render the flag with restrained premium editorial depth: realistic matte fabric, subtle folds, controlled lighting, and no glossy/plastic finish.

NATIONAL SYMBOL PROTECTION
Protected symbol: ${input.protectedSymbolDescription}
Official position: ${input.protectedSymbolPosition}
- Never move, redesign, distort, replace, or cover it.
- Preserve at least ${input.safeZonePercent}% clear visual space around it.

CROP-SAFE COMPOSITION
- Master canvas: 1536 × 1024.
- The central ${input.cropSafeZone}% of the frame is the crop-safe zone.
- Keep all critical national identity, emblem detail, and visual focal content inside that central crop-safe zone.
- The final card will use CSS background-size: cover at multiple widths, so edge content may be cropped.
- Avoid critical information at the extreme left, right, top, and bottom edges.
- Focal point target: ${input.focalPoint.x}% horizontal, ${input.focalPoint.y}% vertical.
- Composition guidance: ${input.compositionGuidance}.

SMALL-CARD READABILITY
- Strong national recognizability at thumbnail/card scale.
- Simpler composition than the full National Flag Shadow Hero when necessary.
- Do not require the complete country silhouette.
- Do not add city photography or unrelated travel imagery.
- Maintain sufficient tonal separation for a navy readability overlay added later by the application.

EXCLUDE
- no text
- no country names
- no city labels
- no Match Score
- no rank marker
- no badges
- no visa names
- no route labels
- no UI elements
- no icons
- no collage
- no travel stickers or passport stamps
- no invented national symbols

OUTPUT
1536 × 1024
Opaque WebP`
}

export function buildCityPrompt(input: CityImageInput) {
  const landmark = input.landmarkGuidance.trim()
    ? `Landmark guidance: ${input.landmarkGuidance.trim()}. Only depict landmarks that genuinely exist in ${input.cityName}; never invent or relocate a landmark.`
    : `Do not depict any specific named landmark unless it genuinely defines ${input.cityName}; never invent or relocate a landmark.`
  const extraExclusions = input.exclusions.trim() ? `\n- ${input.exclusions.trim()}` : ''

  return `Create a premium editorial travel photograph of ${input.cityName}, ${input.countryName}, for a relocation platform city card.

SCENE
Image type: ${input.imageType}.
Setting: ${input.settingDescription}
Show a realistic, natural ${input.imageType} of ${input.cityName} as it authentically looks. ${landmark}

STYLE
- premium editorial travel photography
- natural, realistic light and color
- believable depth and atmosphere
- high-end travel-magazine quality
- documentary authenticity, not stylized illustration

EXCLUDE
- no text or captions
- no labels or watermarks
- no added flags
- no collage or split frames
- no travel stickers, stamps, or icons
- no fabricated or relocated landmarks
- no maps or diagrams${extraExclusions}

OUTPUT
1200 × 800 or closest supported landscape size
Opaque WebP`
}
