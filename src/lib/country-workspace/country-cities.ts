import { WORLD_PLACES } from '@/lib/world-places'

export type CountryCityOverview = {
  id: string
  countrySlug: string
  cityName: string
  region?: string
  imageAlt: string
  summary: string
  displayOrder: number
  lat: number
  lng: number
  researchStatus: 'Current app dataset'
}

const summaries: Record<string, string> = {
  'lisbon-portugal': 'Portugal’s primary city in the current Kolmari country overview and cost research.',
  'porto-portugal': 'Included in Kolmari’s verified Portugal relocation-place dataset for city comparison.',
  'madeira-portugal': 'Included in Kolmari’s Portugal relocation-place dataset for island-city research.',
  'barcelona-spain': 'Spain’s primary city in the current Kolmari country overview and cost research.',
  'valencia-spain': 'Included in Kolmari’s verified Spain relocation-place dataset for city comparison.',
  'madrid-spain': 'Included in Kolmari’s verified Spain relocation-place dataset for city comparison.',
  'athens-greece': 'Greece’s current city record in the Kolmari relocation-place dataset.',
  'tallinn-estonia': 'Estonia’s current city record in the Kolmari relocation-place dataset.',
  'playa-del-carmen-mexico': 'Mexico’s primary city in the current Kolmari country overview.',
  'mexico-city-mexico': 'Included in Kolmari’s verified Mexico relocation-place dataset for city comparison.',
  'merida-mexico': 'Included in Kolmari’s verified Mexico relocation-place dataset for city comparison.',
}

const countrySlugByName: Record<string, string> = {
  Portugal: 'portugal',
  Spain: 'spain',
  Greece: 'greece',
  Estonia: 'estonia',
  Mexico: 'mexico',
}

const selectedIds = [
  'lisbon-portugal',
  'porto-portugal',
  'madeira-portugal',
  'barcelona-spain',
  'valencia-spain',
  'madrid-spain',
  'athens-greece',
  'tallinn-estonia',
  'playa-del-carmen-mexico',
  'mexico-city-mexico',
  'merida-mexico',
]

export const COUNTRY_CITY_OVERVIEWS: CountryCityOverview[] = selectedIds.flatMap((id) => {
  const place = WORLD_PLACES.find((entry) => entry.id === id && entry.kind === 'city')
  if (!place) return []

  const countrySlug = countrySlugByName[place.country]
  if (!countrySlug) return []

  const countryCities = selectedIds.filter((candidateId) => {
    const candidate = WORLD_PLACES.find((entry) => entry.id === candidateId)
    return candidate?.country === place.country
  })

  return [{
    id: place.id,
    countrySlug,
    cityName: place.name,
    region: place.region,
    imageAlt: `Map view of ${place.name}, ${place.country}`,
    summary: summaries[place.id],
    displayOrder: countryCities.indexOf(place.id) + 1,
    lat: place.lat,
    lng: place.lng,
    researchStatus: 'Current app dataset' as const,
  }]
})

export function getCountryCityOverviews(countrySlug: string) {
  return COUNTRY_CITY_OVERVIEWS
    .filter((city) => city.countrySlug === countrySlug)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 6)
}
