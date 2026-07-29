import { WORLD_PLACES } from './world-places'

// Country-center coordinates for real maps, keyed by the country slug used in
// the app's registries (COUNTRIES / DISCOVERABLE_COUNTRIES). Most come from
// world-places.ts; the rest are approximate public country centroids so every
// country page can render a real map rather than a shape.
const EXTRA_CENTERS: Record<string, { lat: number; lng: number }> = {
  'united-kingdom': { lat: 54.0, lng: -2.4 },
  'south-korea': { lat: 36.5, lng: 127.8 },
  israel: { lat: 31.4, lng: 35.0 },
  netherlands: { lat: 52.2, lng: 5.3 },
  philippines: { lat: 12.9, lng: 121.8 },
  panama: { lat: 8.5, lng: -80.1 },
  albania: { lat: 41.2, lng: 20.0 },
  bulgaria: { lat: 42.7, lng: 25.5 },
  romania: { lat: 45.9, lng: 25.0 },
  slovenia: { lat: 46.1, lng: 14.8 },
  malta: { lat: 35.9, lng: 14.4 },
  uruguay: { lat: -32.5, lng: -55.8 },
  paraguay: { lat: -23.4, lng: -58.4 },
  belize: { lat: 17.2, lng: -88.5 },
  ecuador: { lat: -1.4, lng: -78.2 },
  georgia: { lat: 42.3, lng: 43.4 },
  cambodia: { lat: 12.6, lng: 104.9 },
}

const WORLD_CENTERS: Record<string, { lat: number; lng: number }> = Object.fromEntries(
  WORLD_PLACES.filter((p) => p.kind === 'country').map((p) => [p.id, { lat: p.lat, lng: p.lng }]),
)

/** Map center for a country slug, or null when no coordinate is known. */
export function getCountryCenter(slug: string): { lat: number; lng: number } | null {
  return WORLD_CENTERS[slug] ?? EXTRA_CENTERS[slug] ?? null
}
