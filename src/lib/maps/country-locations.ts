export type CountryLocation = {
  name: string
  code: string
  city: string
  lat: number
  lng: number
}

const LOCATIONS: CountryLocation[] = [
  { name: 'Portugal', code: 'pt', city: 'Lisbon', lat: 38.7223, lng: -9.1393 },
  { name: 'Mexico', code: 'mx', city: 'Tulum', lat: 20.2114, lng: -87.4654 },
  { name: 'Rwanda', code: 'rw', city: 'Kigali', lat: -1.9441, lng: 30.0619 },
  { name: 'Ghana', code: 'gh', city: 'Accra', lat: 5.6037, lng: -0.187 },
  { name: 'Colombia', code: 'co', city: 'Medellín', lat: 6.2442, lng: -75.5812 },
  { name: 'Spain', code: 'es', city: 'Barcelona', lat: 41.3874, lng: 2.1686 },
  { name: 'Estonia', code: 'ee', city: 'Tallinn', lat: 59.437, lng: 24.7536 },
  { name: 'Greece', code: 'gr', city: 'Athens', lat: 37.9838, lng: 23.7275 },
]

const aliases: Record<string, string> = {
  'côte d’ivoire': 'ivory coast',
  'cote d’ivoire': 'ivory coast',
  usa: 'united states of america',
  'united states': 'united states of america',
}

export function getCountryLocation(country: string | null | undefined): CountryLocation | null {
  if (!country) return null
  const needle = aliases[country.trim().toLowerCase()] ?? country.trim().toLowerCase()
  return LOCATIONS.find((item) => item.name.toLowerCase() === needle) ?? null
}
