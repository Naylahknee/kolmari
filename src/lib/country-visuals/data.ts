import { getCountryCenter } from '@/lib/country-geo'
import {
  countryVisualAssetsSchema,
  heroAssetPath,
  cityAssetPath,
  type CountryVisualAssets,
  type SnapshotMapConfig,
} from './schema'

/* Per-country visual asset registry.
 *
 * This is the single source the country-page template reads from. It stays PURE
 * (no DB, no server-only imports) so both the server template and the client
 * admin tool can import it.
 *
 * An entry only declares `hero` once the WebP has actually been committed to
 * /public — that gates the country page between "approved hero artwork" and the
 * branded fallback, with no runtime filesystem check. City images use an
 * <img onError> fallback instead, so they do not need to be pre-registered. */

type LngLat = [number, number] // GeoJSON/Mapbox order: [lng, lat]
type Focal = { x: number; y: number }

type CityOverride = { slug: string; name: string; focalPoint?: Focal }

type CountryVisualOverride = {
  countryName: string
  countryCode: string
  /** Present only when an approved hero WebP is committed under /public. */
  hero?: { src: string; alt: string; focalPoint?: Focal }
  snapshot?: {
    center?: LngLat
    zoom?: number
    bounds?: [LngLat, LngLat]
    capital?: { name: string; lat: number; lng: number }
  }
  cities?: CityOverride[]
}

const OVERRIDES: Record<string, CountryVisualOverride> = {
  portugal: {
    countryName: 'Portugal',
    countryCode: 'PT',
    // No committed hero yet: the old flag-map artwork used a raised-relief
    // silhouette (a cutout), which the National Flag Shadow Hero standard
    // rejects. Portugal falls back to the same flag + translucent-shadow hero as
    // every other country until a to-standard fabric hero is generated and
    // committed at /images/countries/portugal/portugal-hero.webp.
    snapshot: {
      center: [-8.0, 39.5],
      zoom: 5.2,
      capital: { name: 'Lisbon', lat: 38.7223, lng: -9.1393 },
    },
    cities: [
      { slug: 'lisbon', name: 'Lisbon' },
      { slug: 'porto', name: 'Porto' },
      { slug: 'funchal', name: 'Funchal' },
      { slug: 'braga', name: 'Braga' },
    ],
  },
  mexico: {
    countryName: 'Mexico',
    countryCode: 'MX',
    // Hero WebP not yet committed → falls back until /images/countries/mexico/
    // mexico-hero.webp lands, at which point add a `hero` block here.
    snapshot: {
      center: [-102.0, 23.6],
      zoom: 3.8,
      capital: { name: 'Mexico City', lat: 19.4326, lng: -99.1332 },
    },
    cities: [
      { slug: 'mexico-city', name: 'Mexico City' },
      { slug: 'merida', name: 'Mérida' },
      { slug: 'playa-del-carmen', name: 'Playa del Carmen' },
      { slug: 'oaxaca', name: 'Oaxaca' },
    ],
  },
}

/** Resolve the full visual-asset record for a country, or null if we have no
 *  center coordinate and no override to build a sensible snapshot from. */
export function getCountryVisualAssets(slug: string): CountryVisualAssets | null {
  const override = OVERRIDES[slug]
  const center = getCountryCenter(slug)
  const snapCenter: LngLat | null =
    override?.snapshot?.center ?? (center ? [center.lng, center.lat] : null)
  if (!snapCenter) return null

  const record: CountryVisualAssets = {
    countrySlug: slug,
    hero: {
      src: override?.hero?.src ?? heroAssetPath(slug),
      alt: override?.hero?.alt ?? `${override?.countryName ?? slug} hero artwork`,
      focalPoint: override?.hero?.focalPoint ?? { x: 50, y: 50 },
    },
    snapshotMap: {
      center: snapCenter,
      zoom: override?.snapshot?.zoom ?? 4,
      bounds: override?.snapshot?.bounds,
      capital: override?.snapshot?.capital,
    },
    cities: (override?.cities ?? []).map((c) => ({
      slug: c.slug,
      name: c.name,
      imageSrc: cityAssetPath(slug, c.slug),
      imageAlt: `${c.name}, ${override?.countryName ?? slug}`,
      focalPoint: c.focalPoint,
    })),
  }

  // Validate defensively; a malformed override should fail loudly in dev.
  return countryVisualAssetsSchema.parse(record)
}

/** True only when a country has an approved, committed hero WebP (or PNG). */
export function hasApprovedHero(slug: string): boolean {
  return Boolean(OVERRIDES[slug]?.hero)
}

/** The approved hero source + focal point, or null when none is committed. */
export function getApprovedHero(slug: string): { src: string; focalPoint: Focal } | null {
  const hero = OVERRIDES[slug]?.hero
  if (!hero) return null
  return { src: hero.src, focalPoint: hero.focalPoint ?? { x: 50, y: 50 } }
}

/** Seed a SnapshotMapConfig for the admin tool from the registry + geo data. */
export function getSnapshotMapConfig(slug: string): SnapshotMapConfig | null {
  const assets = getCountryVisualAssets(slug)
  const override = OVERRIDES[slug]
  if (!assets) return null
  const [lng, lat] = assets.snapshotMap.center
  return {
    countrySlug: slug,
    countryName: override?.countryName ?? slug,
    countryCode: override?.countryCode ?? 'XX',
    centerLat: lat,
    centerLng: lng,
    zoom: assets.snapshotMap.zoom,
    bounds: assets.snapshotMap.bounds,
    capitalName: assets.snapshotMap.capital?.name ?? '',
    capitalLat: assets.snapshotMap.capital?.lat,
    capitalLng: assets.snapshotMap.capital?.lng,
    showCapitalMarker: Boolean(assets.snapshotMap.capital),
    mapStyle: 'mapbox/light-v11',
  }
}

export function listCountryVisualSlugs(): string[] {
  return Object.keys(OVERRIDES)
}
