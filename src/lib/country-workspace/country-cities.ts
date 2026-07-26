export type CountryCityOverview = {
  id: string
  countrySlug: string
  cityName: string
  region?: string
  imageSrc: string
  imageAlt: string
  summary: string
  displayOrder: number
}

const cityImages: Record<string, string> = {
  portugal: '/images/footer-beach-ocean.png',
  spain: '/images/luggage-tropical-coast.png',
  greece: '/images/luggage-tropical-coast.png',
  estonia: '/images/hero-airplane-window.png',
  mexico: '/images/journey-globe-pins.png',
}

const CITY_DATA: CountryCityOverview[] = [
  { id: 'pt-lisbon', countrySlug: 'portugal', cityName: 'Lisbon', region: 'Lisbon District', imageSrc: cityImages.portugal, imageAlt: 'Coastal cityscape representing Lisbon, Portugal', summary: 'Portugal’s largest city and main international hub, with extensive transit, major services, and the country’s highest housing pressure.', displayOrder: 1 },
  { id: 'pt-porto', countrySlug: 'portugal', cityName: 'Porto', region: 'Northern Portugal', imageSrc: cityImages.portugal, imageAlt: 'Atlantic cityscape representing Porto, Portugal', summary: 'A smaller northern city with strong rail links, a growing international community, and generally lower costs than central Lisbon.', displayOrder: 2 },
  { id: 'pt-funchal', countrySlug: 'portugal', cityName: 'Funchal', region: 'Madeira', imageSrc: cityImages.portugal, imageAlt: 'Coastal landscape representing Funchal, Madeira', summary: 'Madeira’s main city, often researched for island living, mild weather, and remote-work lifestyle considerations.', displayOrder: 3 },
  { id: 'es-barcelona', countrySlug: 'spain', cityName: 'Barcelona', region: 'Catalonia', imageSrc: cityImages.spain, imageAlt: 'Mediterranean cityscape representing Barcelona, Spain', summary: 'A major Mediterranean city with international business, extensive transit, and high housing demand in central neighborhoods.', displayOrder: 1 },
  { id: 'es-madrid', countrySlug: 'spain', cityName: 'Madrid', region: 'Community of Madrid', imageSrc: cityImages.spain, imageAlt: 'Urban landscape representing Madrid, Spain', summary: 'Spain’s capital and largest employment center, with broad rail and air connections and a large international population.', displayOrder: 2 },
  { id: 'es-valencia', countrySlug: 'spain', cityName: 'Valencia', region: 'Valencian Community', imageSrc: cityImages.spain, imageAlt: 'Coastal cityscape representing Valencia, Spain', summary: 'A coastal city commonly compared with Madrid and Barcelona for a slower pace and lower housing costs.', displayOrder: 3 },
  { id: 'gr-athens', countrySlug: 'greece', cityName: 'Athens', region: 'Attica', imageSrc: cityImages.greece, imageAlt: 'Mediterranean cityscape representing Athens, Greece', summary: 'Greece’s capital and primary employment, transport, and administrative center, with the country’s largest international community.', displayOrder: 1 },
  { id: 'gr-thessaloniki', countrySlug: 'greece', cityName: 'Thessaloniki', region: 'Central Macedonia', imageSrc: cityImages.greece, imageAlt: 'Coastal cityscape representing Thessaloniki, Greece', summary: 'A major northern city with universities, a strong food culture, and lower housing costs than central Athens in many areas.', displayOrder: 2 },
  { id: 'gr-chania', countrySlug: 'greece', cityName: 'Chania', region: 'Crete', imageSrc: cityImages.greece, imageAlt: 'Island harbor representing Chania, Crete', summary: 'A smaller island city often researched for lifestyle, tourism-related work, and seasonal housing conditions.', displayOrder: 3 },
  { id: 'ee-tallinn', countrySlug: 'estonia', cityName: 'Tallinn', region: 'Harju County', imageSrc: cityImages.estonia, imageAlt: 'Northern European cityscape representing Tallinn, Estonia', summary: 'Estonia’s capital and technology center, with the country’s strongest international transport and startup ecosystem.', displayOrder: 1 },
  { id: 'ee-tartu', countrySlug: 'estonia', cityName: 'Tartu', region: 'Tartu County', imageSrc: cityImages.estonia, imageAlt: 'Cityscape representing Tartu, Estonia', summary: 'A university city with a smaller scale and generally lower housing costs than Tallinn.', displayOrder: 2 },
  { id: 'ee-parnu', countrySlug: 'estonia', cityName: 'Pärnu', region: 'Pärnu County', imageSrc: cityImages.estonia, imageAlt: 'Coastal landscape representing Pärnu, Estonia', summary: 'A compact coastal city known for seasonal tourism and a quieter pace than Estonia’s two largest cities.', displayOrder: 3 },
  { id: 'mx-mexico-city', countrySlug: 'mexico', cityName: 'Mexico City', region: 'CDMX', imageSrc: cityImages.mexico, imageAlt: 'Cityscape representing Mexico City, Mexico', summary: 'Mexico’s largest employment and cultural center, with extensive transit, major services, and wide neighborhood variation.', displayOrder: 1 },
  { id: 'mx-merida', countrySlug: 'mexico', cityName: 'Mérida', region: 'Yucatán', imageSrc: cityImages.mexico, imageAlt: 'Warm-climate cityscape representing Mérida, Mexico', summary: 'A southeastern city commonly researched for a slower pace, regional culture, and lower costs than Mexico City.', displayOrder: 2 },
  { id: 'mx-playa', countrySlug: 'mexico', cityName: 'Playa del Carmen', region: 'Quintana Roo', imageSrc: cityImages.mexico, imageAlt: 'Caribbean coastal landscape representing Playa del Carmen, Mexico', summary: 'A coastal city popular with remote workers and international residents, with housing costs influenced by tourism demand.', displayOrder: 3 },
]

export function getTopCities(countrySlug: string) {
  return CITY_DATA.filter((city) => city.countrySlug === countrySlug).sort((a, b) => a.displayOrder - b.displayOrder)
}
