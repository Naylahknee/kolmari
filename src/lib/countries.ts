export type CountryDetail = {
  slug: string
  name: string
  code: string
  city: string
  region: 'Europe' | 'Americas' | 'Africa'
  visaType: string
  incomeRequired: number
  safety: 'High' | 'Good'
  cost: '$' | '$$'
  match: number
  summary: string
}

export const COUNTRIES: CountryDetail[] = [
  {
    slug: 'portugal', name: 'Portugal', code: 'PT', city: 'Lisbon', region: 'Europe',
    visaType: 'D7', incomeRequired: 2000, safety: 'High', cost: '$$', match: 92,
    summary: 'A sunny Atlantic base with walkable cities, strong infrastructure, and a welcoming international community.',
  },
  {
    slug: 'spain', name: 'Spain', code: 'ES', city: 'Barcelona', region: 'Europe',
    visaType: 'Digital Nomad', incomeRequired: 2500, safety: 'High', cost: '$$', match: 90,
    summary: 'A lively Mediterranean option with excellent transport, deep culture, and a dedicated remote-work visa.',
  },
  {
    slug: 'greece', name: 'Greece', code: 'GR', city: 'Athens', region: 'Europe',
    visaType: 'Digital Nomad', incomeRequired: 3500, safety: 'Good', cost: '$$', match: 85,
    summary: 'A Mediterranean base with historic cities, island options, and a residence route for qualifying remote professionals.',
  },
  {
    slug: 'estonia', name: 'Estonia', code: 'EE', city: 'Tallinn', region: 'Europe',
    visaType: 'Digital Nomad', incomeRequired: 4500, safety: 'High', cost: '$$', match: 83,
    summary: 'A digitally connected Northern European option with efficient public services and a dedicated remote-work pathway.',
  },
  {
    slug: 'mexico', name: 'Mexico', code: 'MX', city: 'Playa del Carmen', region: 'Americas',
    visaType: 'Temporary Resident', incomeRequired: 1500, safety: 'Good', cost: '$', match: 86,
    summary: 'A flexible nearby move with diverse cities, tropical coastlines, and a lower day-to-day cost in many regions.',
  },
  {
    slug: 'ghana', name: 'Ghana', code: 'GH', city: 'Accra', region: 'Africa',
    visaType: 'Residence Permit', incomeRequired: 1500, safety: 'Good', cost: '$$', match: 84,
    summary: 'A cultural homecoming base with a growing diaspora community and a government actively welcoming returnees.',
  },
  {
    slug: 'rwanda', name: 'Rwanda', code: 'RW', city: 'Kigali', region: 'Africa',
    visaType: 'Digital Nomad Visa', incomeRequired: 1500, safety: 'Good', cost: '$', match: 82,
    summary: 'One of Africa\u2019s safest and most organized capitals, with a remote-worker route and fast-growing infrastructure.',
  },
  {
    slug: 'kenya', name: 'Kenya', code: 'KE', city: 'Nairobi', region: 'Africa',
    visaType: 'Digital Nomad Permit', incomeRequired: 2000, safety: 'Good', cost: '$$', match: 83,
    summary: 'East Africa\u2019s tech hub with savanna weekends, a dedicated nomad permit, and a deep international community.',
  },
  {
    slug: 'south-africa', name: 'South Africa', code: 'ZA', city: 'Cape Town', region: 'Africa',
    visaType: 'Remote Work Visa', incomeRequired: 3000, safety: 'Good', cost: '$$', match: 85,
    summary: 'World-class cities and dramatic landscapes with a remote work visa, best paired with neighborhood-level safety planning.',
  },
  {
    slug: 'senegal', name: 'Senegal', code: 'SN', city: 'Dakar', region: 'Africa',
    visaType: 'Long-Stay Residence', incomeRequired: 1200, safety: 'Good', cost: '$', match: 81,
    summary: 'A vibrant coastal capital with rich culture, deep history, and an affordable day-to-day cost.',
  },
  {
    slug: 'gambia', name: 'Gambia', code: 'GM', city: 'Banjul', region: 'Africa',
    visaType: 'Residence Permit', incomeRequired: 1000, safety: 'Good', cost: '$', match: 80,
    summary: 'Beach-town ease on the Atlantic with one of the lowest day-to-day costs on this list.',
  },
]

export const COUNTRY_CODE_BY_NAME: Record<string, string> = Object.fromEntries(COUNTRIES.map((country) => [country.name, country.code]))

export function countryFlag(code: string) {
  return code.toUpperCase().replace(/./g, (character) => String.fromCodePoint(127397 + character.charCodeAt(0)))
}

export type DiscoverableCountry = {
  slug: string
  name: string
  code: string
  city: string
  region: 'Europe' | 'Asia' | 'North America' | 'Latin America' | 'Oceania'
}

export const DISCOVERABLE_COUNTRIES: DiscoverableCountry[] = [
  { slug: 'mexico', name: 'Mexico', code: 'MX', city: 'Mexico City', region: 'Latin America' },
  { slug: 'canada', name: 'Canada', code: 'CA', city: 'Toronto', region: 'North America' },
  { slug: 'united-kingdom', name: 'United Kingdom', code: 'GB', city: 'London', region: 'Europe' },
  { slug: 'germany', name: 'Germany', code: 'DE', city: 'Berlin', region: 'Europe' },
  { slug: 'australia', name: 'Australia', code: 'AU', city: 'Melbourne', region: 'Oceania' },
  { slug: 'south-korea', name: 'South Korea', code: 'KR', city: 'Seoul', region: 'Asia' },
  { slug: 'france', name: 'France', code: 'FR', city: 'Paris', region: 'Europe' },
  { slug: 'japan', name: 'Japan', code: 'JP', city: 'Tokyo', region: 'Asia' },
  { slug: 'spain', name: 'Spain', code: 'ES', city: 'Barcelona', region: 'Europe' },
  { slug: 'costa-rica', name: 'Costa Rica', code: 'CR', city: 'San José', region: 'Latin America' },
  { slug: 'netherlands', name: 'Netherlands', code: 'NL', city: 'Amsterdam', region: 'Europe' },
  { slug: 'ireland', name: 'Ireland', code: 'IE', city: 'Dublin', region: 'Europe' },
  { slug: 'italy', name: 'Italy', code: 'IT', city: 'Rome', region: 'Europe' },
  { slug: 'new-zealand', name: 'New Zealand', code: 'NZ', city: 'Auckland', region: 'Oceania' },
  { slug: 'philippines', name: 'Philippines', code: 'PH', city: 'Manila', region: 'Asia' },
  { slug: 'portugal', name: 'Portugal', code: 'PT', city: 'Lisbon', region: 'Europe' },
  { slug: 'thailand', name: 'Thailand', code: 'TH', city: 'Chiang Mai', region: 'Asia' },
  { slug: 'panama', name: 'Panama', code: 'PA', city: 'Panama City', region: 'Latin America' },
  { slug: 'albania', name: 'Albania', code: 'AL', city: 'Tirana', region: 'Europe' },
  { slug: 'bulgaria', name: 'Bulgaria', code: 'BG', city: 'Sofia', region: 'Europe' },
  { slug: 'romania', name: 'Romania', code: 'RO', city: 'Bucharest', region: 'Europe' },
  { slug: 'slovenia', name: 'Slovenia', code: 'SI', city: 'Ljubljana', region: 'Europe' },
  { slug: 'malta', name: 'Malta', code: 'MT', city: 'Valletta', region: 'Europe' },
  { slug: 'uruguay', name: 'Uruguay', code: 'UY', city: 'Montevideo', region: 'Latin America' },
  { slug: 'paraguay', name: 'Paraguay', code: 'PY', city: 'Asunción', region: 'Latin America' },
  { slug: 'belize', name: 'Belize', code: 'BZ', city: 'Belize City', region: 'Latin America' },
  { slug: 'ecuador', name: 'Ecuador', code: 'EC', city: 'Quito', region: 'Latin America' },
  { slug: 'georgia', name: 'Georgia', code: 'GE', city: 'Tbilisi', region: 'Europe' },
  { slug: 'cambodia', name: 'Cambodia', code: 'KH', city: 'Phnom Penh', region: 'Asia' },
]

export function getDiscoverableCountry(slug: string) {
  return DISCOVERABLE_COUNTRIES.find((country) => country.slug === slug) ?? null
}
