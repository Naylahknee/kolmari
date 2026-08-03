import { z } from 'zod'

/* Country Visual Asset Engine — shared schemas.
 *
 * Three asset kinds power every Kolmari country page:
 *   1. Hero image   — AI-generated flag + translucent country-silhouette shadow.
 *   2. Snapshot map — the existing interactive Mapbox locator (config only,
 *                     never AI-generated).
 *   3. City images  — AI-generated premium editorial travel photography.
 *
 * The generator inputs live here alongside the resolved `CountryVisualAssets`
 * record that the country-page template reads from. */

const quality = z.enum(['low', 'medium', 'high']).default('medium')
const slug = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase, hyphenated slug (e.g. mexico-city).')

// ----------------------------------------------------------------------------
// 1. Hero image generator input (the "Mexico Shadow Standard")
// ----------------------------------------------------------------------------
export const heroImageInputSchema = z.object({
  countryName: z.string().trim().min(2).max(80),
  countrySlug: slug,
  protectedSymbolDescription: z.string().trim().min(2).max(240),
  protectedSymbolPosition: z.string().trim().min(2).max(200),
  safeZonePercent: z.number().int().min(5).max(40).default(15),
  geographicRequirements: z.string().trim().min(2).max(400),
  silhouetteScale: z.string().trim().min(2).max(160).default('large enough to read clearly while protecting the emblem'),
  silhouettePosition: z.string().trim().min(2).max(160).default('centered across the flag, nudged away from the emblem'),
  shadowOpacity: z.number().int().min(5).max(60).default(22),
  shadowDepth: z.string().trim().min(2).max(160).default('gentle embossed relief with soft edge definition'),
  flagTextureIntensity: z.string().trim().min(2).max(160).default('subtle matte woven fabric with soft folds'),
  quality,
})
export type HeroImageInput = z.infer<typeof heroImageInputSchema>

// ----------------------------------------------------------------------------
// 3. City image generator input
// ----------------------------------------------------------------------------
export const CITY_IMAGE_TYPES = ['skyline', 'streetscape', 'waterfront', 'historic district', 'residential neighborhood'] as const
export const cityImageInputSchema = z.object({
  countryName: z.string().trim().min(2).max(80),
  countrySlug: slug,
  cityName: z.string().trim().min(2).max(80),
  citySlug: slug,
  imageType: z.enum(CITY_IMAGE_TYPES).default('skyline'),
  settingDescription: z.string().trim().min(2).max(400),
  landmarkGuidance: z.string().trim().max(400).default(''),
  exclusions: z.string().trim().max(400).default(''),
  quality,
})
export type CityImageInput = z.infer<typeof cityImageInputSchema>

// The POST body for the generator route is a discriminated union on assetType.
// (Snapshot maps are not AI-generated, so they never hit this endpoint.)
export const generatorRequestSchema = z.discriminatedUnion('assetType', [
  heroImageInputSchema.extend({ assetType: z.literal('hero') }),
  cityImageInputSchema.extend({ assetType: z.literal('city') }),
])
export type GeneratorRequest = z.infer<typeof generatorRequestSchema>
export type GeneratedAssetType = 'hero' | 'city'

// ----------------------------------------------------------------------------
// 2. Snapshot map configuration (drives the existing Mapbox locator)
// ----------------------------------------------------------------------------
export const snapshotMapConfigSchema = z.object({
  countrySlug: slug,
  countryName: z.string().trim().min(2).max(80),
  countryCode: z.string().trim().length(2),
  centerLat: z.number().min(-90).max(90),
  centerLng: z.number().min(-180).max(180),
  zoom: z.number().min(0).max(22).default(4),
  bounds: z
    .tuple([z.tuple([z.number(), z.number()]), z.tuple([z.number(), z.number()])])
    .optional(),
  capitalName: z.string().trim().max(80).default(''),
  capitalLat: z.number().min(-90).max(90).optional(),
  capitalLng: z.number().min(-180).max(180).optional(),
  showCapitalMarker: z.boolean().default(true),
  mapStyle: z.string().trim().min(2).max(120).default('mapbox/light-v11'),
})
export type SnapshotMapConfig = z.infer<typeof snapshotMapConfigSchema>

// ----------------------------------------------------------------------------
// Resolved per-country visual asset record read by the country-page template
// ----------------------------------------------------------------------------
const focalPoint = z.object({ x: z.number().min(0).max(100), y: z.number().min(0).max(100) })

export const countryVisualAssetsSchema = z.object({
  countrySlug: slug,
  hero: z.object({
    src: z.string().min(1),
    alt: z.string().min(1),
    focalPoint,
  }),
  snapshotMap: z.object({
    // GeoJSON/Mapbox order: [lng, lat].
    center: z.tuple([z.number(), z.number()]),
    zoom: z.number().min(0).max(22),
    bounds: z.tuple([z.tuple([z.number(), z.number()]), z.tuple([z.number(), z.number()])]).optional(),
    capital: z
      .object({ name: z.string().min(1), lat: z.number(), lng: z.number() })
      .optional(),
  }),
  cities: z.array(
    z.object({
      slug,
      name: z.string().min(1),
      imageSrc: z.string().min(1),
      imageAlt: z.string().min(1),
      focalPoint: focalPoint.optional(),
    }),
  ),
})
export type CountryVisualAssets = z.infer<typeof countryVisualAssetsSchema>

/** Build the canonical hero asset path for a country slug. */
export function heroAssetPath(countrySlug: string) {
  return `/images/countries/${countrySlug}/${countrySlug}-hero.webp`
}

/** Build the canonical city image path for a country + city slug. */
export function cityAssetPath(countrySlug: string, citySlug: string) {
  return `/images/countries/${countrySlug}/cities/${citySlug}.webp`
}

/** CSS object-position string from a focal point (defaults to centered). */
export function focalToObjectPosition(point?: { x: number; y: number }) {
  const x = point?.x ?? 50
  const y = point?.y ?? 50
  return `${x}% ${y}%`
}
