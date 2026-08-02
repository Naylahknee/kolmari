import { z } from 'zod'

export const countryHeroInputSchema = z.object({
  cityName: z.string().trim().min(2).max(80),
  countryName: z.string().trim().min(2).max(80),
  cityLocationDescription: z.string().trim().min(5).max(240),
  flagSymbols: z.string().trim().min(2).max(240),
  flagSymbolLocation: z.string().trim().min(2).max(240),
  safeMapPosition: z.string().trim().min(2).max(100).default('bottom-right corner'),
  decorativeFlourish: z.string().trim().min(2).max(160).default('a restrained botanical or culturally appropriate line flourish'),
  regionalStyle: z.string().trim().min(2).max(160).default('an elegant regional editorial aesthetic'),
  cityPinPosition: z.string().trim().min(2).max(200),
  includeLabels: z.boolean().default(true),
  quality: z.enum(['low', 'medium', 'high']).default('medium'),
})

export type CountryHeroInput = z.infer<typeof countryHeroInputSchema>

export function buildCountryHeroPrompt(input: CountryHeroInput) {
  const countryUpper = input.countryName.toUpperCase()
  const labels = input.includeLabels
    ? `Include “${input.cityName}” in a large elegant handwritten brush script, “${countryUpper}” beneath it in small uppercase sans-serif lettering with generous tracking, and a small ${input.decorativeFlourish}. Add a clean charcoal sans-serif city label beside the pin.`
    : 'Do not include any city name, country name, decorative flourish, captions, or other text. Keep only the flag, country map, and location pin.'

  return `Create a clean, premium travel destination hero graphic for Kolmari in a modern editorial style.

Use the official flag of ${input.countryName} as a full-bleed background. Render it as softly textured fabric with realistic folds, subtle dimensional lighting, and a refined matte finish. Preserve the flag’s authentic colors, proportions, and every official symbol.

${labels}

Place a large, geographically accurate silhouette map of ${input.countryName} in the ${input.safeMapPosition}. The map must have a smooth warm parchment-beige surface, subtle fine paper grain, light embossing, softly rounded dimensional edges, and a gentle neutral drop shadow. Do not stretch, rotate, widen, compress, or stylize the country outline.

Place a bright red location pin marking ${input.cityName}. The pin belongs at ${input.cityPinPosition}; geographically, ${input.cityName} is located ${input.cityLocationDescription}. Confirm the pin is accurate and fully aligned with the country outline.

FLAG PRESERVATION — NON-NEGOTIABLE:
- Preserve ${input.flagSymbols}, located ${input.flagSymbolLocation}.
- Never cover, crop, distort, recolor, relocate, or visually compete with an official emblem, crest, coat of arms, star, sun, seal, shield, or other national symbol.
- Maintain at least 15% clear visual padding around every important flag symbol.
- Reposition or scale the map, title, flourish, pin, and label as needed.
- The flag must remain immediately recognizable and visually dominant.
- Prefer the ${input.safeMapPosition}, but abandon that fixed placement if it would obscure the flag or weaken readability.

STYLE:
Premium editorial, luxury relocation guide, modern geographic infographic, Scandinavian-inspired minimalism, high-end travel magazine, ${input.regionalStyle}. Use generous negative space and a balanced asymmetrical composition.

EXCLUDE:
Photographs, people, landmarks, skylines, collage elements, travel stickers, passport stamps, ticket stubs, luggage tags, airplanes, compasses, tourist icons, extra text, slogans, coordinates, borders, frames, watermarks, cracked stone, torn paper, burned edges, heavy grunge, metallic surfaces, plastic surfaces, or exaggerated 3D thickness.

Before rendering, analyze the flag layout, map shape, map orientation, and city location. Automatically adjust every foreground element to preserve national symbols, geographic accuracy, contrast, negative space, and a polished composition. Output a wide 3:2 hero image suitable for a responsive country-page header.`
}
