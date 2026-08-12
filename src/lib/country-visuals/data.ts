import { getCountryCenter } from '@/lib/country-geo'
import {
  countryVisualAssetsSchema,
  heroAssetPath,
  dashboardDestinationAssetPath,
  cityAssetPath,
  type CountryVisualAssets,
  type SnapshotMapConfig,
} from './schema'

type LngLat = [number, number]
type Focal = { x: number; y: number }
type CityOverride = { slug: string; name: string; focalPoint?: Focal }

type CountryVisualOverride = {
  countryName: string
  countryCode: string
  hero?: { src: string; alt: string; focalPoint?: Focal }
  dashboardDestination?: { src: string; alt: string; cropSafeZone?: number; focalPoint?: Focal }
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

export function getCountryVisualAssets(slug: string): CountryVisualAssets | null {
  const override = OVERRIDES[slug]
  const center = getCountryCenter(slug)
  const snapCenter: LngLat | null = override?.snapshot?.center ?? (center ? [center.lng, center.lat] : null)
  if (!snapCenter) return null

  const record: CountryVisualAssets = {
    countrySlug: slug,
    hero: {
      src: override?.hero?.src ?? heroAssetPath(slug),
      alt: override?.hero?.alt ?? `${override?.countryName ?? slug} hero artwork`,
      focalPoint: override?.hero?.focalPoint ?? { x: 50, y: 50 },
    },
    dashboardDestination: override?.dashboardDestination
      ? {
          src: override.dashboardDestination.src,
          alt: override.dashboardDestination.alt,
          cropSafeZone: override.dashboardDestination.cropSafeZone ?? 70,
          focalPoint: override.dashboardDestination.focalPoint ?? { x: 50, y: 50 },
        }
      : undefined,
    snapshotMap: {
      center: snapCenter,
      zoom: override?.snapshot?.zoom ?? 4,
      bounds: override?.snapshot?.bounds,
      capital: override?.snapshot?.capital,
    },
    cities: (override?.cities ?? []).map((city) => ({
      slug: city.slug,
      name: city.name,
      imageSrc: cityAssetPath(slug, city.slug),
      imageAlt: `${city.name}, ${override?.countryName ?? slug}`,
      focalPoint: city.focalPoint,
    })),
  }

  return countryVisualAssetsSchema.parse(record)
}

export function hasApprovedHero(slug: string): boolean {
  return Boolean(OVERRIDES[slug]?.hero)
}

export function getApprovedHero(slug: string): { src: string; focalPoint: Focal } | null {
  const hero = OVERRIDES[slug]?.hero
  if (!hero) return null
  return { src: hero.src, focalPoint: hero.focalPoint ?? { x: 50, y: 50 } }
}

/** Approved committed Dashboard-specific artwork only; never falls back to hero. */
export function getApprovedDashboardDestination(slug: string): { src: string; focalPoint: Focal; cropSafeZone: number } | null {
  const asset = OVERRIDES[slug]?.dashboardDestination
  if (!asset) return null
  return {
    src: asset.src,
    focalPoint: asset.focalPoint ?? { x: 50, y: 50 },
    cropSafeZone: asset.cropSafeZone ?? 70,
  }
}

/** Canonical committed path used when an approved file is added to /public. */
export function getDashboardDestinationCommittedPath(slug: string) {
  return dashboardDestinationAssetPath(slug)
}

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
