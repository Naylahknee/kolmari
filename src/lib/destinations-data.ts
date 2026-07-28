export type CountryPreview = {
  name: string
  slug: string
  code: string
  city: string
  monthlyCost?: number
  pathway?: string
  communityFit?: string
  image: string
  guideAvailable: boolean
}

export type RegionConfig = {
  slug: RegionSlug
  name: string
  countryCount: number
  center: [number, number]
  zoom: number
  image: string
  description: string
  indicators: string[]
  countries: CountryPreview[]
}

export const REGION_MAP_SHAPES: Record<RegionSlug, string> = {
  'north-america': 'M55 92 L130 48 230 61 279 115 252 167 198 174 176 226 118 214 91 169 45 141Z',
  'latin-america': 'M201 232 L267 201 306 240 294 304 326 351 300 418 268 474 243 420 244 352 218 304Z',
  europe: 'M421 91 L487 68 552 94 546 139 511 162 458 151 413 125Z',
  africa: 'M434 173 L529 157 579 219 558 316 510 388 459 337 429 253Z',
  asia: 'M558 77 L704 45 877 78 940 144 880 204 792 196 734 232 647 192 565 145Z',
  oceania: 'M748 286 L829 259 917 302 944 372 893 428 805 413 769 365Z',
}

export const REGION_MAP_LABELS: Record<RegionSlug, [number, number]> = {
  'north-america': [155, 125],
  'latin-america': [270, 325],
  europe: [482, 116],
  africa: [503, 252],
  asia: [755, 130],
  oceania: [850, 342],
}

export const REGION_SLUGS = [
  'europe',
  'africa',
  'asia',
  'north-america',
  'latin-america',
  'oceania',
] as const

export type RegionSlug = (typeof REGION_SLUGS)[number]

export const regions: Record<RegionSlug, RegionConfig> = {
  europe: {
    slug: 'europe',
    name: 'Europe',
    countryCount: 32,
    center: [15, 51],
    zoom: 3.2,
    image: '/images/regions/europe.webp',
    description:
      'Diverse cultures, established infrastructure, multiple residency pathways, and a wide range of lifestyle options.',
    indicators: ['Strong healthcare', 'Good infrastructure', 'Multiple pathways'],
    countries: [
      {
        name: 'Portugal',
        slug: 'portugal',
        code: 'PT',
        city: 'Lisbon',
        monthlyCost: 2100,
        pathway: 'Digital Nomad Pathway',
        communityFit: 'Strong',
        image: '/images/countries/portugal.webp',
        guideAvailable: true,
      },
      {
        name: 'Spain',
        slug: 'spain',
        code: 'ES',
        city: 'Barcelona',
        monthlyCost: 2300,
        pathway: 'Digital Nomad Pathway',
        communityFit: 'Strong',
        image: '/images/countries/spain.webp',
        guideAvailable: true,
      },
      {
        name: 'Greece',
        slug: 'greece',
        code: 'GR',
        city: 'Athens',
        monthlyCost: 2000,
        pathway: 'Digital Nomad Pathway',
        communityFit: 'Moderate',
        image: '/images/countries/greece.webp',
        guideAvailable: true,
      },
      {
        name: 'Estonia',
        slug: 'estonia',
        code: 'EE',
        city: 'Tallinn',
        monthlyCost: 1800,
        pathway: 'Digital Nomad Pathway',
        communityFit: 'Moderate',
        image: '/images/countries/estonia.webp',
        guideAvailable: true,
      },
    ],
  },
  africa: {
    slug: 'africa',
    name: 'Africa',
    countryCount: 54,
    center: [20, 3],
    zoom: 2.6,
    image: '/images/regions/africa.webp',
    description:
      'A broad range of cultures, growing economic centers, diaspora communities, and emerging residency opportunities.',
    indicators: ['Diaspora communities', 'Growing markets', 'Varied cost of living'],
    countries: [
      { name: 'Ghana', slug: 'ghana', code: 'GH', city: 'Accra', image: '/images/regions/africa.webp', guideAvailable: false },
      { name: 'South Africa', slug: 'south-africa', code: 'ZA', city: 'Cape Town', image: '/images/regions/africa.webp', guideAvailable: false },
      { name: 'Kenya', slug: 'kenya', code: 'KE', city: 'Nairobi', image: '/images/regions/africa.webp', guideAvailable: false },
      { name: 'Mauritius', slug: 'mauritius', code: 'MU', city: 'Grand Baie', image: '/images/regions/africa.webp', guideAvailable: false },
    ],
  },
  asia: {
    slug: 'asia',
    name: 'Asia',
    countryCount: 49,
    center: [95, 34],
    zoom: 2.4,
    image: '/images/regions/asia.webp',
    description:
      'Major global cities, varied costs of living, expanding remote-work programs, and diverse cultural environments.',
    indicators: ['Affordable options', 'Major cities', 'Remote-work programs'],
    countries: [
      { name: 'Thailand', slug: 'thailand', code: 'TH', city: 'Chiang Mai', image: '/images/regions/asia.webp', guideAvailable: false },
      { name: 'Malaysia', slug: 'malaysia', code: 'MY', city: 'Kuala Lumpur', image: '/images/regions/asia.webp', guideAvailable: false },
      { name: 'Japan', slug: 'japan', code: 'JP', city: 'Fukuoka', image: '/images/regions/asia.webp', guideAvailable: false },
      { name: 'Indonesia', slug: 'indonesia', code: 'ID', city: 'Bali', image: '/images/regions/asia.webp', guideAvailable: false },
    ],
  },
  'north-america': {
    slug: 'north-america',
    name: 'North America',
    countryCount: 14,
    center: [-105, 43],
    zoom: 2.5,
    image: '/images/regions/north-america.webp',
    description:
      'Closer relocation options with varied residency, work, retirement, and family pathways.',
    indicators: ['Closer to the U.S.', 'Major expat hubs', 'Varied pathways'],
    countries: [
      { name: 'Canada', slug: 'canada', code: 'CA', city: 'Toronto', image: '/images/regions/north-america.webp', guideAvailable: false },
      { name: 'Canada', slug: 'canada-vancouver', code: 'CA', city: 'Vancouver', image: '/images/regions/north-america.webp', guideAvailable: false },
    ],
  },
  'latin-america': {
    slug: 'latin-america',
    name: 'Latin America',
    countryCount: 21,
    center: [-64, -17],
    zoom: 2.5,
    image: '/images/regions/latin-america.webp',
    description:
      'Accessible residency options, lower living costs, established expat communities, and proximity to the United States.',
    indicators: ['Lower living costs', 'Residency options', 'Regional access'],
    countries: [
      { name: 'Mexico', slug: 'mexico', code: 'MX', city: 'Playa del Carmen', image: '/images/regions/latin-america.webp', guideAvailable: true },
      { name: 'Costa Rica', slug: 'costa-rica', code: 'CR', city: 'San José', image: '/images/regions/latin-america.webp', guideAvailable: false },
      { name: 'Colombia', slug: 'colombia', code: 'CO', city: 'Medellín', image: '/images/regions/latin-america.webp', guideAvailable: false },
      { name: 'Panama', slug: 'panama', code: 'PA', city: 'Panama City', image: '/images/regions/latin-america.webp', guideAvailable: false },
    ],
  },
  oceania: {
    slug: 'oceania',
    name: 'Oceania',
    countryCount: 8,
    center: [145, -25],
    zoom: 3,
    image: '/images/regions/oceania.webp',
    description:
      'Strong infrastructure, outdoor lifestyles, education options, and skilled-worker pathways.',
    indicators: ['Strong infrastructure', 'Family options', 'Skilled pathways'],
    countries: [
      { name: 'New Zealand', slug: 'new-zealand', code: 'NZ', city: 'Auckland', image: '/images/regions/oceania.webp', guideAvailable: false },
      { name: 'Australia', slug: 'australia', code: 'AU', city: 'Melbourne', image: '/images/regions/oceania.webp', guideAvailable: false },
    ],
  },
}

const REGION_BY_COUNTRY_REGION = {
  Europe: 'europe',
  Asia: 'asia',
  'North America': 'north-america',
  'Latin America': 'latin-america',
  Oceania: 'oceania',
} as const

for (const country of DISCOVERABLE_COUNTRIES) {
  const region = regions[REGION_BY_COUNTRY_REGION[country.region]]
  const existing = region.countries.find((item) => item.slug === country.slug)
  if (existing) {
    existing.guideAvailable = true
    continue
  }
  region.countries.push({
    name: country.name,
    slug: country.slug,
    code: country.code,
    city: country.city,
    image: region.image,
    guideAvailable: true,
  })
}

export const regionList = REGION_SLUGS.map((slug) => regions[slug])

export function isNexitnationRegion(value: string): value is RegionSlug {
  return REGION_SLUGS.some((slug) => slug === value)
}
import { DISCOVERABLE_COUNTRIES } from '@/lib/countries'
