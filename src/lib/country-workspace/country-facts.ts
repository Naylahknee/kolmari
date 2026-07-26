// Country snapshot facts for the redesigned Country Overview dashboard.
//
// These are public, verifiable country reference facts (capital, currency,
// membership, driving side, climate) plus editorial planning estimates for
// climate averages, city rents, and walkability. They are NOT user data and
// carry a clear source disclosure. Missing countries return null and the UI
// falls back to the honest, data-light overview.
//
// Icons are referenced by string key so this module stays framework-agnostic;
// the Overview component maps each key to a Lucide icon.

export type SnapshotIcon =
  | 'capital' | 'population' | 'currency' | 'language' | 'government'
  | 'timezone' | 'driving' | 'schengen' | 'eu' | 'climate'

export type SnapshotFact = {
  label: string
  value: string
  icon: SnapshotIcon
}

export type ClimateStat = {
  label: string
  value: string
  icon: 'winter' | 'summer' | 'timeDifference'
}

export type CityCard = {
  name: string
  region: string
  /** Approximate city or metro population, e.g. "545K" */
  population: string
  /** Editorial monthly rent estimate for a central 1-bed, e.g. "€1,100–1,600" */
  avgRent: string
  /** Editorial walkability estimate, 0–100 */
  walkScore: number
  researchStatus: 'Verified' | 'In progress'
}

export type MoveReasonIcon =
  | 'affordable' | 'weather' | 'community' | 'healthcare' | 'remote' | 'culture'

export type MoveReasonTone = 'green' | 'orange' | 'purple' | 'blue'

export type MoveReason = {
  title: string
  description: string
  icon: MoveReasonIcon
  tone: MoveReasonTone
}

export type CountryFacts = {
  slug: string
  snapshot: SnapshotFact[]
  climate: ClimateStat[]
  cities: CityCard[]
  reasons: MoveReason[]
  disclosure: { lastVerified: string; sourceNote: string }
}

// Shared "Why people move here" reasons — the six-card set is consistent across
// countries; copy is tailored per country where it differs meaningfully.
function reasonsFor(copy: Partial<Record<MoveReasonIcon, string>>): MoveReason[] {
  return [
    { title: 'Affordable Living', icon: 'affordable', tone: 'green', description: copy.affordable ?? 'Housing, food, and daily costs stretch a remote income further than most of Western Europe or the US.' },
    { title: 'Great Weather', icon: 'weather', tone: 'orange', description: copy.weather ?? 'Long, mild seasons and plenty of sunshine make outdoor life easy for most of the year.' },
    { title: 'Welcoming Community', icon: 'community', tone: 'purple', description: copy.community ?? 'Established expat and international networks make it easier to land, settle, and build a social circle.' },
    { title: 'Healthcare Access', icon: 'healthcare', tone: 'blue', description: copy.healthcare ?? 'A mix of public and affordable private healthcare gives newcomers real options for care.' },
    { title: 'Remote-Work Friendly', icon: 'remote', tone: 'green', description: copy.remote ?? 'Strong connectivity, coworking spaces, and remote-worker pathways support location-independent income.' },
    { title: 'Rich Culture', icon: 'culture', tone: 'orange', description: copy.culture ?? 'Deep history, food, and traditions give everyday life a strong sense of place.' },
  ]
}

const portugal: CountryFacts = {
  slug: 'portugal',
  snapshot: [
    { label: 'Capital', value: 'Lisbon', icon: 'capital' },
    { label: 'Population', value: '10.6 million', icon: 'population' },
    { label: 'Currency', value: 'Euro (EUR)', icon: 'currency' },
    { label: 'Official Language', value: 'Portuguese', icon: 'language' },
    { label: 'Government', value: 'Semi-presidential republic', icon: 'government' },
    { label: 'Time Zone', value: 'WET (UTC+0)', icon: 'timezone' },
    { label: 'Driving Side', value: 'Right', icon: 'driving' },
    { label: 'Schengen Area', value: 'Yes', icon: 'schengen' },
    { label: 'EU Membership', value: 'Member', icon: 'eu' },
    { label: 'Climate', value: 'Mediterranean', icon: 'climate' },
  ],
  climate: [
    { label: 'Avg Winter Temp', value: '16°C', icon: 'winter' },
    { label: 'Avg Summer Temp', value: '28°C', icon: 'summer' },
    { label: 'Time Difference', value: '+5 hrs vs. New York', icon: 'timeDifference' },
  ],
  cities: [
    { name: 'Lisbon', region: 'Lisbon Metropolitan', population: '2.9M metro', avgRent: '€1,100–1,600', walkScore: 88, researchStatus: 'Verified' },
    { name: 'Porto', region: 'Norte', population: '1.7M metro', avgRent: '€750–1,200', walkScore: 85, researchStatus: 'In progress' },
    { name: 'Braga', region: 'Norte', population: '193K', avgRent: '€500–800', walkScore: 78, researchStatus: 'In progress' },
    { name: 'Coimbra', region: 'Centro', population: '143K', avgRent: '€500–800', walkScore: 80, researchStatus: 'In progress' },
    { name: 'Funchal', region: 'Madeira', population: '105K', avgRent: '€700–1,100', walkScore: 74, researchStatus: 'In progress' },
  ],
  reasons: reasonsFor({
    affordable: 'Outside central Lisbon, a remote income places you well above the local median — with room for housing, food, and travel.',
    remote: 'One of Europe’s most active digital-nomad hubs, with coworking across Lisbon, Porto, and the Algarve and a dedicated remote-work visa.',
  }),
  disclosure: { lastVerified: '2026-01-01', sourceNote: 'INE · public country references · editorial estimates (2024–2025)' },
}

const spain: CountryFacts = {
  slug: 'spain',
  snapshot: [
    { label: 'Capital', value: 'Madrid', icon: 'capital' },
    { label: 'Population', value: '48.4 million', icon: 'population' },
    { label: 'Currency', value: 'Euro (EUR)', icon: 'currency' },
    { label: 'Official Language', value: 'Spanish (Castilian)', icon: 'language' },
    { label: 'Government', value: 'Parliamentary monarchy', icon: 'government' },
    { label: 'Time Zone', value: 'CET (UTC+1)', icon: 'timezone' },
    { label: 'Driving Side', value: 'Right', icon: 'driving' },
    { label: 'Schengen Area', value: 'Yes', icon: 'schengen' },
    { label: 'EU Membership', value: 'Member', icon: 'eu' },
    { label: 'Climate', value: 'Mediterranean', icon: 'climate' },
  ],
  climate: [
    { label: 'Avg Winter Temp', value: '12°C', icon: 'winter' },
    { label: 'Avg Summer Temp', value: '30°C', icon: 'summer' },
    { label: 'Time Difference', value: '+6 hrs vs. New York', icon: 'timeDifference' },
  ],
  cities: [
    { name: 'Madrid', region: 'Community of Madrid', population: '6.7M metro', avgRent: '€1,000–1,600', walkScore: 87, researchStatus: 'Verified' },
    { name: 'Barcelona', region: 'Catalonia', population: '5.6M metro', avgRent: '€1,100–1,700', walkScore: 89, researchStatus: 'In progress' },
    { name: 'Valencia', region: 'Valencian Community', population: '1.6M metro', avgRent: '€800–1,200', walkScore: 84, researchStatus: 'In progress' },
    { name: 'Málaga', region: 'Andalusia', population: '580K', avgRent: '€800–1,200', walkScore: 80, researchStatus: 'In progress' },
    { name: 'Seville', region: 'Andalusia', population: '1.5M metro', avgRent: '€700–1,100', walkScore: 82, researchStatus: 'In progress' },
  ],
  reasons: reasonsFor({
    weather: 'Southern and coastal Spain enjoy some of Europe’s warmest, sunniest climates, with mild winters year-round.',
    culture: 'Distinct regional identities — food, festivals, and language — give every city its own rhythm and community.',
  }),
  disclosure: { lastVerified: '2026-01-01', sourceNote: 'INE (Spain) · public country references · editorial estimates (2024–2025)' },
}

const greece: CountryFacts = {
  slug: 'greece',
  snapshot: [
    { label: 'Capital', value: 'Athens', icon: 'capital' },
    { label: 'Population', value: '10.4 million', icon: 'population' },
    { label: 'Currency', value: 'Euro (EUR)', icon: 'currency' },
    { label: 'Official Language', value: 'Greek', icon: 'language' },
    { label: 'Government', value: 'Parliamentary republic', icon: 'government' },
    { label: 'Time Zone', value: 'EET (UTC+2)', icon: 'timezone' },
    { label: 'Driving Side', value: 'Right', icon: 'driving' },
    { label: 'Schengen Area', value: 'Yes', icon: 'schengen' },
    { label: 'EU Membership', value: 'Member', icon: 'eu' },
    { label: 'Climate', value: 'Mediterranean', icon: 'climate' },
  ],
  climate: [
    { label: 'Avg Winter Temp', value: '13°C', icon: 'winter' },
    { label: 'Avg Summer Temp', value: '33°C', icon: 'summer' },
    { label: 'Time Difference', value: '+7 hrs vs. New York', icon: 'timeDifference' },
  ],
  cities: [
    { name: 'Athens', region: 'Attica', population: '3.6M metro', avgRent: '€500–900', walkScore: 83, researchStatus: 'Verified' },
    { name: 'Thessaloniki', region: 'Central Macedonia', population: '1.1M metro', avgRent: '€400–750', walkScore: 81, researchStatus: 'In progress' },
    { name: 'Patras', region: 'Western Greece', population: '215K', avgRent: '€350–600', walkScore: 74, researchStatus: 'In progress' },
    { name: 'Heraklion', region: 'Crete', population: '180K', avgRent: '€450–800', walkScore: 72, researchStatus: 'In progress' },
    { name: 'Chania', region: 'Crete', population: '110K', avgRent: '€450–800', walkScore: 70, researchStatus: 'In progress' },
  ],
  reasons: reasonsFor({
    affordable: 'Rents and daily costs remain among the lowest in the Eurozone, especially outside central Athens.',
    weather: 'Long, hot summers and mild winters give the islands and mainland a famously outdoor lifestyle.',
  }),
  disclosure: { lastVerified: '2026-01-01', sourceNote: 'ELSTAT · public country references · editorial estimates (2024–2025)' },
}

const estonia: CountryFacts = {
  slug: 'estonia',
  snapshot: [
    { label: 'Capital', value: 'Tallinn', icon: 'capital' },
    { label: 'Population', value: '1.37 million', icon: 'population' },
    { label: 'Currency', value: 'Euro (EUR)', icon: 'currency' },
    { label: 'Official Language', value: 'Estonian', icon: 'language' },
    { label: 'Government', value: 'Parliamentary republic', icon: 'government' },
    { label: 'Time Zone', value: 'EET (UTC+2)', icon: 'timezone' },
    { label: 'Driving Side', value: 'Right', icon: 'driving' },
    { label: 'Schengen Area', value: 'Yes', icon: 'schengen' },
    { label: 'EU Membership', value: 'Member', icon: 'eu' },
    { label: 'Climate', value: 'Humid continental', icon: 'climate' },
  ],
  climate: [
    { label: 'Avg Winter Temp', value: '-3°C', icon: 'winter' },
    { label: 'Avg Summer Temp', value: '21°C', icon: 'summer' },
    { label: 'Time Difference', value: '+7 hrs vs. New York', icon: 'timeDifference' },
  ],
  cities: [
    { name: 'Tallinn', region: 'Harju County', population: '460K', avgRent: '€550–950', walkScore: 82, researchStatus: 'Verified' },
    { name: 'Tartu', region: 'Tartu County', population: '95K', avgRent: '€400–700', walkScore: 78, researchStatus: 'In progress' },
    { name: 'Narva', region: 'Ida-Viru County', population: '53K', avgRent: '€300–500', walkScore: 70, researchStatus: 'In progress' },
    { name: 'Pärnu', region: 'Pärnu County', population: '40K', avgRent: '€350–600', walkScore: 72, researchStatus: 'In progress' },
  ],
  reasons: reasonsFor({
    remote: 'A pioneer of the digital-nomad visa and e-Residency, with seamless online government services and fast connectivity.',
    community: 'A compact, English-friendly tech scene makes it easy for newcomers to plug into startup and remote-work circles.',
    weather: 'Cool, crisp summers and snowy winters suit those who prefer four distinct seasons over year-round heat.',
  }),
  disclosure: { lastVerified: '2026-01-01', sourceNote: 'Statistics Estonia · public country references · editorial estimates (2024–2025)' },
}

const mexico: CountryFacts = {
  slug: 'mexico',
  snapshot: [
    { label: 'Capital', value: 'Mexico City', icon: 'capital' },
    { label: 'Population', value: '129 million', icon: 'population' },
    { label: 'Currency', value: 'Mexican Peso (MXN)', icon: 'currency' },
    { label: 'Official Language', value: 'Spanish', icon: 'language' },
    { label: 'Government', value: 'Federal presidential republic', icon: 'government' },
    { label: 'Time Zone', value: 'Central (UTC-6)', icon: 'timezone' },
    { label: 'Driving Side', value: 'Right', icon: 'driving' },
    { label: 'Schengen Area', value: 'No', icon: 'schengen' },
    { label: 'EU Membership', value: 'Non-member', icon: 'eu' },
    { label: 'Climate', value: 'Varied (tropical to highland)', icon: 'climate' },
  ],
  climate: [
    { label: 'Avg Winter Temp', value: '21°C', icon: 'winter' },
    { label: 'Avg Summer Temp', value: '26°C', icon: 'summer' },
    { label: 'Time Difference', value: '-1 hr vs. New York', icon: 'timeDifference' },
  ],
  cities: [
    { name: 'Mexico City', region: 'CDMX', population: '21.8M metro', avgRent: '$650–1,200', walkScore: 84, researchStatus: 'Verified' },
    { name: 'Mérida', region: 'Yucatán', population: '1.3M metro', avgRent: '$500–900', walkScore: 68, researchStatus: 'In progress' },
    { name: 'Playa del Carmen', region: 'Quintana Roo', population: '330K', avgRent: '$700–1,300', walkScore: 66, researchStatus: 'In progress' },
    { name: 'Guadalajara', region: 'Jalisco', population: '5.3M metro', avgRent: '$550–1,000', walkScore: 76, researchStatus: 'In progress' },
    { name: 'Querétaro', region: 'Querétaro', population: '1.5M metro', avgRent: '$550–1,000', walkScore: 72, researchStatus: 'In progress' },
  ],
  reasons: reasonsFor({
    affordable: 'Housing, food, and services cost a fraction of US prices, and a USD income goes a long way in most cities.',
    community: 'Large, established American and Canadian communities in CDMX, the Yucatán, and the Riviera Maya ease the transition.',
    culture: 'Rich regional cuisines, festivals, and deep indigenous heritage give daily life vivid texture.',
    weather: 'Highland cities stay spring-like year-round, while coasts offer warm, tropical climates.',
  }),
  disclosure: { lastVerified: '2026-01-01', sourceNote: 'INEGI · public country references · editorial estimates (2024–2025)' },
}

const FACTS: Record<string, CountryFacts> = {
  portugal, spain, greece, estonia, mexico,
}

export function getCountryFacts(slug: string): CountryFacts | null {
  return FACTS[slug] ?? null
}
