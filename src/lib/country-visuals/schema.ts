import { z } from 'zod'

/* Country Visual Asset Engine — shared schemas.
 *
 * Four visual asset kinds support Kolmari country surfaces:
 *   1. Hero image             — country-page National Flag Shadow Hero.
 *   2. Snapshot map           — existing Mapbox locator configuration; never AI-generated.
 *   3. City images            — editorial city photography.
 *   4. Dashboard destination  — compact, crop-safe matched-country artwork for the
 *                               existing Dashboard Destinations parent panel.
 */

const quality = z.enum(['low', 'medium', 'high']).default('medium')
const slug = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase, hyphenated slug (e.g. mexico-city).')

const focalPoint = z.object({ x: z.number().min(0).max(100), y: z.number().min(0).max(100) })

// ----------------------------------------------------------------------------
// 1. Country-page hero image input — National Flag Shadow Hero
// ----------------------------------------------------------------------------
export const heroImageInputSchema = z.object({
  countryName: z.string().trim().min(2).max(80),
  countrySlug: slug,
  flagCode: z.string().trim().length(2).optional(),
  protectedSymbolDescription: z.string().trim().min(2).max(240),
  protectedSymbolPosition: z.string().trim().min(2).max(200),
  safeZonePercent: z.number().int().min(5).max(40).default(15),
  geographicRequirements: z.string().trim().min(2).max(400),
  silhouetteScale: z.string().trim().min(2).max(160).default('large enough to read clearly while protecting the emblem'),
  silhouettePosition: z.string().trim().min(2).max(160).default('centered across the flag, nudged away from the emblem'),
  shadowOpacity: z.number().int().min(5).max(60).default(22),
  shadowDepth: z.string().trim().min(2).max(160).default('gentle embossed relief with soft edge definition'),
  flagTextureIntensity: z.string().trim().min(2).max(160).default('subtle matte woven fabric with soft folds'),
  focalPoint: focalPoint.default({ x: 50, y: 50 }),
  quality,
})
export type HeroImageInput = z.infer<typeof heroImageInputSchema>

// ----------------------------------------------------------------------------
// 2. Dashboard destination image input
// ----------------------------------------------------------------------------
export const dashboardDestinationImageInputSchema = z.object({
  countryName: z.string().trim().min(2).max(80),
  countrySlug: slug,
  flagCode: z.string().trim().length(2).optional(),
  protectedSymbolDescription: z.string().trim().min(2).max(240),
  protectedSymbolPosition: z.string().trim().min(2).max(200),
  safeZonePercent: z.number().int().min(5).max(40).default(15),
  compositionGuidance: z.string().trim().min(2).max(400).default('flag-led compact editorial composition optimized for small dashboard cards'),
  cropSafeZone: z.number().int().min(50).max(90).default(70),
  focalPoint: focalPoint.default({ x: 50, y: 50 }),
  quality,
})
export type DashboardDestinationImageInput = z.infer<typeof dashboardDestinationImageInputSchema>

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

const styleReferenceDataUrl = z
  .string()
  .regex(/^data:image\/[a-z+.-]+;base64,/i, 'Expected a base64 image data URL.')
  .max(8_000_000)
  .optional()

// Snapshot maps never hit the image generator endpoint.
export const generatorRequestSchema = z.discriminatedUnion('assetType', [
  heroImageInputSchema.extend({ assetType: z.literal('hero'), styleReferenceDataUrl }),
  dashboardDestinationImageInputSchema.extend({ assetType: z.literal('dashboard_destination') }),
  cityImageInputSchema.extend({ assetType: z.literal('city') }),
])
export type GeneratorRequest = z.infer<typeof generatorRequestSchema>

// Preserve existing storage/API names; add the new type without renaming existing
// persisted values or requiring a database migration.
export type GeneratedAssetType = 'hero' | 'city' | 'dashboard_destination'

// ----------------------------------------------------------------------------
// Snapshot map configuration
// ----------------------------------------------------------------------------
export const snapshotMapConfigSchema = z.object({
  countrySlug: slug,
  countryName: z.string().trim().min(2).max(80),
  countryCode: z.string().trim().length(2),
  centerLat: z.number().min(-90).max(90),
  centerLng: z.number().min(-180).max(180),
  zoom: z.number().min(0).max(22).default(4),
  bounds: z.tuple([z.tuple([z.number(), z.number()]), z.tuple([z.number(), z.number()])]).optional(),
  capitalName: z.string().trim().max(80).default(''),
  capitalLat: z.number().min(-90).max(90).optional(),
  capitalLng: z.number().min(-180).max(180).optional(),
  showCapitalMarker: z.boolean().default(true),
  mapStyle: z.string().trim().min(2).max(120).default('mapbox/light-v11'),
})
export type SnapshotMapConfig = z.infer<typeof snapshotMapConfigSchema>

// ----------------------------------------------------------------------------
// Resolved per-country visual asset record
// ----------------------------------------------------------------------------
export const countryVisualAssetsSchema = z.object({
  countrySlug: slug,
  hero: z.object({
    src: z.string().min(1),
    alt: z.string().min(1),
    focalPoint,
  }),
  dashboardDestination: z.object({
    src: z.string().min(1),
    alt: z.string().min(1),
    cropSafeZone: z.number().int().min(50).max(90).default(70),
    focalPoint,
  }).optional(),
  snapshotMap: z.object({
    center: z.tuple([z.number(), z.number()]),
    zoom: z.number().min(0).max(22),
    bounds: z.tuple([z.tuple([z.number(), z.number()]), z.tuple([z.number(), z.number()])]).optional(),
    capital: z.object({ name: z.string().min(1), lat: z.number(), lng: z.number() }).optional(),
  }),
  cities: z.array(z.object({
    slug,
    name: z.string().min(1),
    imageSrc: z.string().min(1),
    imageAlt: z.string().min(1),
    focalPoint: focalPoint.optional(),
  })),
})
export type CountryVisualAssets = z.infer<typeof countryVisualAssetsSchema>

export function heroAssetPath(countrySlug: string) {
  return `/images/countries/${countrySlug}/${countrySlug}-hero.webp`
}

export function dashboardDestinationAssetPath(countrySlug: string) {
  return `/images/countries/${countrySlug}/${countrySlug}-dashboard-destination.webp`
}

export function cityAssetPath(countrySlug: string, citySlug: string) {
  return `/images/countries/${countrySlug}/cities/${citySlug}.webp`
}

export function focalToObjectPosition(point?: { x: number; y: number }) {
  const x = point?.x ?? 50
  const y = point?.y ?? 50
  return `${x}% ${y}%`
}
