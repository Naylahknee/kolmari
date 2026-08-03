import type { HeroImageInput, CityImageInput } from './schema'

/* Prompt builders for the Country Visual Asset Engine.
 *
 * Hero: the "National Flag Shadow Hero" (Kolmari Standard) — the official flag as
 * full-bleed woven fabric with the complete country silhouette rendered as a
 * translucent superimposed shadow that inherits the flag colors beneath it. No
 * parchment cutout, no pin, no text. The national emblem is always protected.
 * Mexico is the visual reference, not the template. See
 * docs/Kolmari/hero-image-standard.md.
 *
 * City: premium editorial travel photography of a real city environment. No
 * text, no flags, no collage, no fabricated landmarks. */

export function buildHeroPrompt(input: HeroImageInput) {
  return `Create a premium, wide-format country-page hero background for Kolmari.

COUNTRY
${input.countryName}

COMPOSITION

Use the official national flag of ${input.countryName} as the full-bleed background.

Render the flag as realistic matte fabric with:
- subtle folds
- fine woven texture
- soft directional lighting
- controlled shadows
- no glossy or plastic finish
Fabric treatment: ${input.flagTextureIntensity}.

The flag must remain immediately recognizable.

NATIONAL SYMBOL PROTECTION

The flag contains the following important national symbol:

${input.protectedSymbolDescription}

Its official position is:

${input.protectedSymbolPosition}

The symbol must:
- remain in its official position
- remain fully visible
- not be moved
- not be redesigned
- not be covered
- retain at least ${input.safeZonePercent}% clear visual space

COUNTRY SILHOUETTE

Place the complete geographic silhouette of ${input.countryName} across the flag.

The full country must be visible, including:
${input.geographicRequirements}

Render the silhouette as a subtle superimposed shadow rather than a solid object.

The silhouette should:
- inherit the flag colors beneath it
- use approximately ${input.shadowOpacity}% opacity
- have gentle embossed or debossed depth (${input.shadowDepth})
- include soft edge definition
- remain geographically recognizable
- never cover or replace the national emblem
- never appear as parchment, stone, paper, or a separate cutout

Silhouette scale: ${input.silhouetteScale}.
Silhouette position: ${input.silhouettePosition}.
Adjust the silhouette position and scale intelligently so both the national flag and complete country outline remain readable.

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

The result must work as a background behind left-aligned website content.

STYLE

Premium relocation platform
Modern editorial
High-end travel publication
Subtle dimensional realism
Clean composition
Strong visual identity

Use a Mexico flag-and-silhouette composition as the visual standard for silhouette treatment, depth, and flag preservation — but do NOT reuse Mexico-specific geography, colors, or national symbols. Use ${input.countryName}'s own flag, its actual national symbols in their official positions, and its complete geographic silhouette.

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

Show a realistic, natural ${input.imageType} of ${input.cityName} as it authentically looks — the kind of establishing photograph that helps someone imagine daily life there. ${landmark}

STYLE
- premium editorial travel photography
- natural, realistic light and color
- believable depth and atmosphere
- high-end travel-magazine quality
- documentary authenticity, not stylized illustration

EXCLUDE
- no text or captions
- no labels or watermarks
- no flags of any kind
- no collage or split frames
- no travel stickers, stamps, or icons
- no fabricated or relocated landmarks
- no maps or diagrams${extraExclusions}

OUTPUT
1200 × 800
Opaque WebP`
}
