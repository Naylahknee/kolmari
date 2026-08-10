export type RegionSlug = 'europe' | 'americas' | 'asia-pacific' | 'africa-middle-east'

export type RegionDestination = {
  slug: string
  country: string
  city: string
  code: string
  coordinates: [number, number]
  visaPath: string
  pathways: string[]
  monthlyBudget: number
  matchScore: number
  communityFit: string
  bestAreas: string[]
  watchAreas: string[]
  fitLabel: string
  summary: string
  highlights: string[]
}

export type KolmariRegion = {
  slug: RegionSlug
  name: string
  shortName: string
  eyebrow: string
  coordinates: [number, number]
  zoom: number
  baseMatch: number
  description: string
  bestFor: string[]
  destinations: RegionDestination[]
}

export const REGIONS: KolmariRegion[] = [
  {
    slug: 'europe',
    name: 'Europe',
    shortName: 'Europe',
    eyebrow: 'Walkable cities · established visa routes',
    coordinates: [10, 48],
    zoom: 2.7,
    baseMatch: 89,
    description: 'A strong starting point for planners who value public transport, established residency pathways, and easy movement between cultures.',
    bestFor: ['Remote workers', 'Walkable living', 'Long-term residency'],
    destinations: [
      {
        slug: 'portugal', country: 'Portugal', city: 'Lisbon', code: 'PT', coordinates: [-9.1393, 38.7223],
        visaPath: 'D7 or D8', pathways: ['D7 residence visa', 'Remote-work residence visa'], monthlyBudget: 2450, matchScore: 92, communityFit: 'Strong starting signal', bestAreas: ['Lisbon', 'Porto'], watchAreas: ['Central-city housing pressure'], fitLabel: 'Best overall match',
        summary: 'Atlantic light, reliable infrastructure, and several practical residence paths for income earners and remote workers.',
        highlights: ['English widely used in Lisbon', 'Strong international community', 'Excellent regional rail links'],
      },
      {
        slug: 'spain', country: 'Spain', city: 'Valencia', code: 'ES', coordinates: [-0.3763, 39.4699],
        visaPath: 'Digital Nomad', pathways: ['Telework visa'], monthlyBudget: 2600, matchScore: 90, communityFit: 'Strong city variety', bestAreas: ['Madrid', 'Valencia'], watchAreas: ['Housing competition'], fitLabel: 'Lifestyle match',
        summary: 'Mediterranean city life with strong transport, deep culture, and a dedicated remote-work residence option.',
        highlights: ['Beach and city balance', 'Fast intercity rail', 'Large expat networks'],
      },
      {
        slug: 'croatia', country: 'Croatia', city: 'Split', code: 'HR', coordinates: [16.4402, 43.5081],
        visaPath: 'Digital Nomad', pathways: ['Digital nomad residence'], monthlyBudget: 2150, matchScore: 84, communityFit: 'Developing signal', bestAreas: ['Split', 'Zagreb'], watchAreas: ['Seasonal coastal pricing'], fitLabel: 'Value pick',
        summary: 'A smaller coastal base with Adriatic access and a residence route designed for location-independent work.',
        highlights: ['Seasonal coastal rhythm', 'Compact historic centers', 'Lower shoulder-season costs'],
      },
    ],
  },
  {
    slug: 'americas',
    name: 'The Americas',
    shortName: 'Americas',
    eyebrow: 'Closer time zones · flexible city choices',
    coordinates: [-76, 12],
    zoom: 2.3,
    baseMatch: 86,
    description: 'A broad range of near-shore options with familiar time zones, energetic cities, and climates that run from alpine to tropical.',
    bestFor: ['US time zones', 'Flexible budgets', 'Warm weather'],
    destinations: [
      {
        slug: 'mexico', country: 'Mexico', city: 'Mérida', code: 'MX', coordinates: [-89.5926, 20.9674],
        visaPath: 'Temporary Resident', pathways: ['Temporary resident visa'], monthlyBudget: 1950, matchScore: 86, communityFit: 'Highly location-specific', bestAreas: ['Mexico City', 'Merida'], watchAreas: ['State-by-state security differences'], fitLabel: 'Practical first move',
        summary: 'A well-connected regional hub with deep culture, established international communities, and flexible residency planning.',
        highlights: ['Direct North American flights', 'Strong private healthcare', 'Many city and coastal choices'],
      },
      {
        slug: 'costa-rica', country: 'Costa Rica', city: 'San José', code: 'CR', coordinates: [-84.0907, 9.9281],
        visaPath: 'Digital Nomad', pathways: ['Digital nomad stay'], monthlyBudget: 2350, matchScore: 84, communityFit: 'Research by area', bestAreas: ['San Jose', 'Central Valley'], watchAreas: ['Higher costs in popular hubs'], fitLabel: 'Nature match',
        summary: 'A nature-forward option with a formal remote-work route and a long history of welcoming international residents.',
        highlights: ['Biodiversity and outdoor living', 'Stable civic environment', 'Strong wellness culture'],
      },
      {
        slug: 'colombia', country: 'Colombia', city: 'Medellín', code: 'CO', coordinates: [-75.5812, 6.2442],
        visaPath: 'Digital Nomad', pathways: ['Digital nomad visa'], monthlyBudget: 1750, matchScore: 82, communityFit: 'Research by neighborhood', bestAreas: ['Medellin', 'Bogota'], watchAreas: ['Neighborhood-level safety differences'], fitLabel: 'Budget match',
        summary: 'A connected mountain city with a growing remote-work community and an accessible day-to-day budget.',
        highlights: ['Year-round mild climate', 'Modern metro system', 'Active founder community'],
      },
    ],
  },
  {
    slug: 'asia-pacific',
    name: 'Asia-Pacific',
    shortName: 'Asia-Pacific',
    eyebrow: 'Modern hubs · high-comfort daily living',
    coordinates: [112, 12],
    zoom: 2.25,
    baseMatch: 82,
    description: 'A varied region for planners drawn to efficient cities, strong service culture, tropical bases, and fast-growing remote-work communities.',
    bestFor: ['City infrastructure', 'Food and culture', 'Regional access'],
    destinations: [
      {
        slug: 'malaysia', country: 'Malaysia', city: 'Kuala Lumpur', code: 'MY', coordinates: [101.6869, 3.139],
        visaPath: 'DE Rantau Nomad Pass', pathways: ['DE Rantau Nomad Pass'], monthlyBudget: 1850, matchScore: 85, communityFit: 'Strong international hub', bestAreas: ['Kuala Lumpur', 'Penang'], watchAreas: ['Building-level connectivity'], fitLabel: 'Comfort match',
        summary: 'A polished regional hub with excellent connectivity, multilingual daily life, and a purpose-built nomad program.',
        highlights: ['Excellent airport connections', 'English commonly used', 'Modern private healthcare'],
      },
      {
        slug: 'thailand', country: 'Thailand', city: 'Chiang Mai', code: 'TH', coordinates: [98.9853, 18.7883],
        visaPath: 'Destination Thailand Visa', pathways: ['Destination Thailand Visa'], monthlyBudget: 1550, matchScore: 84, communityFit: 'Research by neighborhood', bestAreas: ['Bangkok', 'Chiang Mai'], watchAreas: ['Northern smoke season'], fitLabel: 'Remote-work value',
        summary: 'A long-standing remote-work center with approachable living costs and easy access to the wider region.',
        highlights: ['Established coworking scene', 'Lower everyday costs', 'Rich food culture'],
      },
      {
        slug: 'japan', country: 'Japan', city: 'Fukuoka', code: 'JP', coordinates: [130.4017, 33.5904],
        visaPath: 'Digital Nomad', pathways: ['Digital nomad visa'], monthlyBudget: 2850, matchScore: 80, communityFit: 'Research further', bestAreas: ['Fukuoka', 'Tokyo'], watchAreas: ['Language access outside major hubs'], fitLabel: 'Infrastructure match',
        summary: 'A highly organized urban base with exceptional transit, safety, and a calmer scale than the largest Japanese cities.',
        highlights: ['Exceptional public transit', 'High personal safety', 'Easy access to nature'],
      },
    ],
  },
  {
    slug: 'africa-middle-east',
    name: 'Africa & Middle East',
    shortName: 'Africa + ME',
    eyebrow: 'Emerging hubs · globally connected bases',
    coordinates: [29, 6],
    zoom: 2.25,
    baseMatch: 78,
    description: 'A region of fast-growing creative centers, island lifestyles, and globally connected business hubs with distinct relocation tradeoffs.',
    bestFor: ['Entrepreneurs', 'Emerging communities', 'Global flight access'],
    destinations: [
      {
        slug: 'ghana', country: 'Ghana', city: 'Accra', code: 'GH', coordinates: [-0.187, 5.6037],
        visaPath: 'Residence Permit', pathways: ['Residence permit'], monthlyBudget: 2100, matchScore: 83, communityFit: 'Strong diaspora signal', bestAreas: ['Accra', 'Cape Coast'], watchAreas: ['Infrastructure varies by area'], fitLabel: 'Community match',
        summary: 'A culturally rich West African capital with a growing returnee community and strong regional connections.',
        highlights: ['Welcoming English-speaking hub', 'Growing creative economy', 'Strong diaspora networks'],
      },
      {
        slug: 'mauritius', country: 'Mauritius', city: 'Grand Baie', code: 'MU', coordinates: [57.5816, -20.0169],
        visaPath: 'Premium Travel Visa', pathways: ['Premium Travel Visa'], monthlyBudget: 2400, matchScore: 81, communityFit: 'Developing signal', bestAreas: ['Grand Baie', 'Moka'], watchAreas: ['Transport planning'], fitLabel: 'Island match',
        summary: 'An Indian Ocean base pairing tropical daily life with a straightforward long-stay option for remote professionals.',
        highlights: ['Multilingual communities', 'Stable internet in main hubs', 'Outdoor island lifestyle'],
      },
      {
        slug: 'united-arab-emirates', country: 'United Arab Emirates', city: 'Dubai', code: 'AE', coordinates: [55.2708, 25.2048],
        visaPath: 'Virtual Work Residence', pathways: ['Virtual work residence'], monthlyBudget: 4100, matchScore: 78, communityFit: 'Large international population', bestAreas: ['Dubai', 'Abu Dhabi'], watchAreas: ['High housing costs'], fitLabel: 'Business match',
        summary: 'A highly connected global hub for planners prioritizing business access, modern services, and direct flights.',
        highlights: ['Major global air hub', 'Fast digital services', 'Large international population'],
      },
    ],
  },
]

export function getRegionBySlug(slug: string) {
  return REGIONS.find((region) => region.slug === slug)
}

export function isRegionSlug(value: string): value is RegionSlug {
  return REGIONS.some((region) => region.slug === value)
}
