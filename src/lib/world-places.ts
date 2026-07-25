// Curated, searchable relocation places (cities + countries) with coordinates.
// Search resolves to one of these so every saved pin has proper coordinates —
// users never drop unnamed pins on empty ocean. Extend freely; this is a
// launch set of popular relocation destinations, not an exhaustive gazetteer.

export type PlaceKind = 'city' | 'country'

export type WorldPlace = {
  id: string // stable slug, e.g. "lisbon-portugal" or "portugal"
  name: string // "Lisbon" or "Portugal"
  country: string // "Portugal"
  countryCode: string // ISO-2, for the flag emoji
  region: string // broad region label
  lat: number
  lng: number
  kind: PlaceKind
}

export const WORLD_PLACES: WorldPlace[] = [
  // ── Europe ───────────────────────────────────────────────
  { id: 'lisbon-portugal', name: 'Lisbon', country: 'Portugal', countryCode: 'PT', region: 'Europe', lat: 38.7223, lng: -9.1393, kind: 'city' },
  { id: 'porto-portugal', name: 'Porto', country: 'Portugal', countryCode: 'PT', region: 'Europe', lat: 41.1579, lng: -8.6291, kind: 'city' },
  { id: 'madeira-portugal', name: 'Funchal (Madeira)', country: 'Portugal', countryCode: 'PT', region: 'Europe', lat: 32.6669, lng: -16.9241, kind: 'city' },
  { id: 'portugal', name: 'Portugal', country: 'Portugal', countryCode: 'PT', region: 'Europe', lat: 39.5, lng: -8.0, kind: 'country' },
  { id: 'barcelona-spain', name: 'Barcelona', country: 'Spain', countryCode: 'ES', region: 'Europe', lat: 41.3874, lng: 2.1686, kind: 'city' },
  { id: 'valencia-spain', name: 'Valencia', country: 'Spain', countryCode: 'ES', region: 'Europe', lat: 39.4699, lng: -0.3763, kind: 'city' },
  { id: 'madrid-spain', name: 'Madrid', country: 'Spain', countryCode: 'ES', region: 'Europe', lat: 40.4168, lng: -3.7038, kind: 'city' },
  { id: 'malaga-spain', name: 'Málaga', country: 'Spain', countryCode: 'ES', region: 'Europe', lat: 36.7213, lng: -4.4214, kind: 'city' },
  { id: 'spain', name: 'Spain', country: 'Spain', countryCode: 'ES', region: 'Europe', lat: 40.0, lng: -3.7, kind: 'country' },
  { id: 'athens-greece', name: 'Athens', country: 'Greece', countryCode: 'GR', region: 'Europe', lat: 37.9838, lng: 23.7275, kind: 'city' },
  { id: 'greece', name: 'Greece', country: 'Greece', countryCode: 'GR', region: 'Europe', lat: 39.0, lng: 22.0, kind: 'country' },
  { id: 'tallinn-estonia', name: 'Tallinn', country: 'Estonia', countryCode: 'EE', region: 'Europe', lat: 59.437, lng: 24.7536, kind: 'city' },
  { id: 'estonia', name: 'Estonia', country: 'Estonia', countryCode: 'EE', region: 'Europe', lat: 58.6, lng: 25.0, kind: 'country' },
  { id: 'berlin-germany', name: 'Berlin', country: 'Germany', countryCode: 'DE', region: 'Europe', lat: 52.52, lng: 13.405, kind: 'city' },
  { id: 'germany', name: 'Germany', country: 'Germany', countryCode: 'DE', region: 'Europe', lat: 51.0, lng: 10.0, kind: 'country' },
  { id: 'amsterdam-netherlands', name: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', region: 'Europe', lat: 52.3676, lng: 4.9041, kind: 'city' },
  { id: 'dublin-ireland', name: 'Dublin', country: 'Ireland', countryCode: 'IE', region: 'Europe', lat: 53.3498, lng: -6.2603, kind: 'city' },
  { id: 'ireland', name: 'Ireland', country: 'Ireland', countryCode: 'IE', region: 'Europe', lat: 53.4, lng: -8.0, kind: 'country' },
  { id: 'rome-italy', name: 'Rome', country: 'Italy', countryCode: 'IT', region: 'Europe', lat: 41.9028, lng: 12.4964, kind: 'city' },
  { id: 'italy', name: 'Italy', country: 'Italy', countryCode: 'IT', region: 'Europe', lat: 42.8, lng: 12.8, kind: 'country' },
  { id: 'paris-france', name: 'Paris', country: 'France', countryCode: 'FR', region: 'Europe', lat: 48.8566, lng: 2.3522, kind: 'city' },
  { id: 'france', name: 'France', country: 'France', countryCode: 'FR', region: 'Europe', lat: 46.6, lng: 2.2, kind: 'country' },

  // ── Latin America ────────────────────────────────────────
  { id: 'mexico-city-mexico', name: 'Mexico City', country: 'Mexico', countryCode: 'MX', region: 'Latin America', lat: 19.4326, lng: -99.1332, kind: 'city' },
  { id: 'merida-mexico', name: 'Mérida', country: 'Mexico', countryCode: 'MX', region: 'Latin America', lat: 20.9674, lng: -89.5926, kind: 'city' },
  { id: 'playa-del-carmen-mexico', name: 'Playa del Carmen', country: 'Mexico', countryCode: 'MX', region: 'Latin America', lat: 20.6296, lng: -87.0739, kind: 'city' },
  { id: 'mexico', name: 'Mexico', country: 'Mexico', countryCode: 'MX', region: 'Latin America', lat: 23.6, lng: -102.5, kind: 'country' },
  { id: 'medellin-colombia', name: 'Medellín', country: 'Colombia', countryCode: 'CO', region: 'Latin America', lat: 6.2442, lng: -75.5812, kind: 'city' },
  { id: 'colombia', name: 'Colombia', country: 'Colombia', countryCode: 'CO', region: 'Latin America', lat: 4.6, lng: -74.1, kind: 'country' },
  { id: 'san-jose-costa-rica', name: 'San José', country: 'Costa Rica', countryCode: 'CR', region: 'Latin America', lat: 9.9281, lng: -84.0907, kind: 'city' },
  { id: 'costa-rica', name: 'Costa Rica', country: 'Costa Rica', countryCode: 'CR', region: 'Latin America', lat: 9.7, lng: -83.8, kind: 'country' },
  { id: 'panama-city-panama', name: 'Panama City', country: 'Panama', countryCode: 'PA', region: 'Latin America', lat: 8.9824, lng: -79.5199, kind: 'city' },
  { id: 'buenos-aires-argentina', name: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', region: 'Latin America', lat: -34.6037, lng: -58.3816, kind: 'city' },

  // ── North America ────────────────────────────────────────
  { id: 'toronto-canada', name: 'Toronto', country: 'Canada', countryCode: 'CA', region: 'North America', lat: 43.6532, lng: -79.3832, kind: 'city' },
  { id: 'vancouver-canada', name: 'Vancouver', country: 'Canada', countryCode: 'CA', region: 'North America', lat: 49.2827, lng: -123.1207, kind: 'city' },
  { id: 'canada', name: 'Canada', country: 'Canada', countryCode: 'CA', region: 'North America', lat: 56.1, lng: -106.3, kind: 'country' },

  // ── Africa & Middle East ─────────────────────────────────
  { id: 'accra-ghana', name: 'Accra', country: 'Ghana', countryCode: 'GH', region: 'Africa', lat: 5.6037, lng: -0.187, kind: 'city' },
  { id: 'ghana', name: 'Ghana', country: 'Ghana', countryCode: 'GH', region: 'Africa', lat: 7.9, lng: -1.0, kind: 'country' },
  { id: 'cape-town-south-africa', name: 'Cape Town', country: 'South Africa', countryCode: 'ZA', region: 'Africa', lat: -33.9249, lng: 18.4241, kind: 'city' },
  { id: 'nairobi-kenya', name: 'Nairobi', country: 'Kenya', countryCode: 'KE', region: 'Africa', lat: -1.2921, lng: 36.8219, kind: 'city' },
  { id: 'dubai-uae', name: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', region: 'Middle East', lat: 25.2048, lng: 55.2708, kind: 'city' },

  // ── Asia-Pacific ─────────────────────────────────────────
  { id: 'chiang-mai-thailand', name: 'Chiang Mai', country: 'Thailand', countryCode: 'TH', region: 'Asia', lat: 18.7883, lng: 98.9853, kind: 'city' },
  { id: 'bangkok-thailand', name: 'Bangkok', country: 'Thailand', countryCode: 'TH', region: 'Asia', lat: 13.7563, lng: 100.5018, kind: 'city' },
  { id: 'thailand', name: 'Thailand', country: 'Thailand', countryCode: 'TH', region: 'Asia', lat: 15.9, lng: 100.9, kind: 'country' },
  { id: 'kuala-lumpur-malaysia', name: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', region: 'Asia', lat: 3.139, lng: 101.6869, kind: 'city' },
  { id: 'malaysia', name: 'Malaysia', country: 'Malaysia', countryCode: 'MY', region: 'Asia', lat: 4.2, lng: 101.9, kind: 'country' },
  { id: 'bali-indonesia', name: 'Bali (Denpasar)', country: 'Indonesia', countryCode: 'ID', region: 'Asia', lat: -8.4095, lng: 115.1889, kind: 'city' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', countryCode: 'SG', region: 'Asia', lat: 1.3521, lng: 103.8198, kind: 'city' },
  { id: 'tokyo-japan', name: 'Tokyo', country: 'Japan', countryCode: 'JP', region: 'Asia', lat: 35.6762, lng: 139.6503, kind: 'city' },
  { id: 'fukuoka-japan', name: 'Fukuoka', country: 'Japan', countryCode: 'JP', region: 'Asia', lat: 33.5904, lng: 130.4017, kind: 'city' },
  { id: 'japan', name: 'Japan', country: 'Japan', countryCode: 'JP', region: 'Asia', lat: 36.2, lng: 138.3, kind: 'country' },

  // ── Oceania ──────────────────────────────────────────────
  { id: 'auckland-new-zealand', name: 'Auckland', country: 'New Zealand', countryCode: 'NZ', region: 'Oceania', lat: -36.8485, lng: 174.7633, kind: 'city' },
  { id: 'new-zealand', name: 'New Zealand', country: 'New Zealand', countryCode: 'NZ', region: 'Oceania', lat: -41.0, lng: 174.0, kind: 'country' },
  { id: 'melbourne-australia', name: 'Melbourne', country: 'Australia', countryCode: 'AU', region: 'Oceania', lat: -37.8136, lng: 144.9631, kind: 'city' },
  { id: 'australia', name: 'Australia', country: 'Australia', countryCode: 'AU', region: 'Oceania', lat: -25.3, lng: 133.8, kind: 'country' },
]

export function searchPlaces(query: string, limit = 8): WorldPlace[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return WORLD_PLACES.filter(
    (p) => p.name.toLowerCase().includes(q) || p.country.toLowerCase().includes(q) || p.region.toLowerCase().includes(q),
  ).slice(0, limit)
}

export function flagEmoji(code: string) {
  return code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
}
