import { getPublishedGreenbookInsight, type PublishedGreenbookInsight } from './greenbook'
import { REGIONS, type RegionDestination, type RegionSlug } from './regionData'

export type SeoPageKind = 'country' | 'persona' | 'pathway' | 'comparison'

export type SeoSource = {
  title: string
  url: string
  publisher: string
  accessed: string
}

export type SeoFaq = { question: string; answer: string }
export type SeoStep = { name: string; text: string }
export type SeoCostItem = { label: string; value: string; detail: string }
export type SeoPathway = { name: string; detail: string; sourceUrl?: string }

export type SeoCountryCard = {
  country: string
  code: string
  matchScore: number
  pathways: string
  communityFit: string
  monthlyBudget: number
  href: string
}

export type SeoPage = {
  slug: string
  kind: SeoPageKind
  title: string
  description: string
  keywords: string[]
  eyebrow: string
  h1: string
  intro: string
  lastReviewed: string
  mapHref: string
  countryCards: SeoCountryCard[]
  costHeading: string
  costIntro: string
  costItems: SeoCostItem[]
  pathways: SeoPathway[]
  greenbook: PublishedGreenbookInsight
  faqs: SeoFaq[]
  steps?: SeoStep[]
  sources: SeoSource[]
}

const REVIEWED = '2026-07-21'

const sources = {
  portugalVisa: {
    title: 'Remote-work residence authorization',
    url: 'https://aima.gov.pt/pt/trabalhar/autorizacao-de-residencia-para-o-exercicio-de-atividade-profissional-prestada-de-forma-remota-com-visto-de-residencia-para-o-exe',
    publisher: 'Portugal Agency for Integration, Migration and Asylum (AIMA)', accessed: REVIEWED,
  },
  portugalSafety: {
    title: 'Portugal Travel Advisory', url: 'https://travel.state.gov/en/international-travel/travel-advisories/portugal.html',
    publisher: 'U.S. Department of State', accessed: REVIEWED,
  },
  spainVisa: {
    title: 'Telework (Digital Nomad) Visa', url: 'https://www.exteriores.gob.es/Consulados/washington/en/ServiciosConsulares/Paginas/Consular/Telework-visa.aspx',
    publisher: 'Ministry of Foreign Affairs of Spain', accessed: REVIEWED,
  },
  spainSafety: {
    title: 'Spain Travel Advisory', url: 'https://travel.state.gov/en/international-travel/travel-advisories/spain.html',
    publisher: 'U.S. Department of State', accessed: REVIEWED,
  },
  thailandVisa: {
    title: 'Thailand Electronic Visa â€” Destination Thailand Visa', url: 'https://thaievisa.go.th/',
    publisher: 'Ministry of Foreign Affairs of the Kingdom of Thailand', accessed: REVIEWED,
  },
  thailandSafety: {
    title: 'Thailand Travel Advisory', url: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/thailand-travel-advisory.html',
    publisher: 'U.S. Department of State', accessed: REVIEWED,
  },
  mexicoVisa: {
    title: 'Temporary Resident Visa', url: 'https://consulmex.sre.gob.mx/presidio/index.php/visas/30-visas/159-temporary-resident',
    publisher: 'Secretariat of Foreign Affairs of Mexico', accessed: REVIEWED,
  },
  mexicoSafety: {
    title: 'Mexico Travel Advisory', url: 'https://travel.state.gov/en/international-travel/travel-advisories/mexico.html',
    publisher: 'U.S. Department of State', accessed: REVIEWED,
  },
} satisfies Record<string, SeoSource>

function findPlace(slug: string) {
  for (const region of REGIONS) {
    const place = region.destinations.find((item) => item.slug === slug)
    if (place) return { place, regionSlug: region.slug }
  }
  throw new Error(`Missing Destination data for ${slug}`)
}

function card(place: RegionDestination, regionSlug: RegionSlug): SeoCountryCard {
  return {
    country: place.country,
    code: place.code,
    matchScore: place.matchScore,
    pathways: place.pathways.join(' or '),
    communityFit: place.communityFit,
    monthlyBudget: place.monthlyBudget,
    href: `/destinations/regions/${regionSlug}`,
  }
}

function insight(slug: string) {
  const item = getPublishedGreenbookInsight(slug)
  if (!item) throw new Error(`Missing published Greenbook insight for ${slug}`)
  return item
}

const portugal = findPlace('portugal')
const spain = findPlace('spain')
const thailand = findPlace('thailand')
const mexico = findPlace('mexico')
const ghana = findPlace('ghana')
const costaRica = findPlace('costa-rica')

function countryPage(config: {
  slug: string
  place: RegionDestination
  regionSlug: RegionSlug
  visaSource: SeoSource
  safetySource: SeoSource
  goodFit: string
  costContext: string
}): SeoPage {
  const { place, regionSlug, visaSource, safetySource } = config
  const greenbook = insight(place.slug)
  const planHref = `/destinations/regions/${regionSlug}`

  return {
    slug: config.slug,
    kind: 'country',
    title: `Move to ${place.country} from the US (2026 Guide)`,
    description: `Evaluate the cost, Pathways, Community Fit, and practical steps for moving from the US to ${place.country} in 2026.`,
    keywords: [`move to ${place.country} from US`, `${place.country} visa for Americans`, `${place.country} cost of living`, `Black Americans in ${place.country}`],
    eyebrow: 'Destination guide',
    h1: `Move to ${place.country} from the US`,
    intro: `${place.country} may be a strong Destination for Americans who want ${config.goodFit}. This guide combines Kolmari planning estimates with official Pathways and general safety sources. Requirements change, so verify every application with the responsible authority before acting.`,
    lastReviewed: REVIEWED,
    mapHref: planHref,
    countryCards: [card(place, regionSlug)],
    costHeading: `What does it cost to live in ${place.country}?`,
    costIntro: `${config.costContext} The figures below are planning baselines, not quotes or guarantees, and should be replaced with a personal housing and healthcare budget.`,
    costItems: [
      { label: 'Monthly planning baseline', value: `$${place.monthlyBudget.toLocaleString()}`, detail: `Kolmari estimate for one adult near ${place.city}; housing choices can materially change it.` },
      { label: 'Arrival buffer', value: `$${(place.monthlyBudget * 3).toLocaleString()}`, detail: 'Three baseline months before flights, deposits, legal help, or emergencies.' },
      { label: 'Review cycle', value: 'Every 90 days', detail: 'Recheck rent, exchange rates, insurance, taxes, and application fees.' },
    ],
    pathways: place.pathways.map((name) => ({ name, detail: `Start with the official eligibility and document list. Do not rely on a planning estimate as an application requirement.`, sourceUrl: visaSource.url })),
    greenbook,
    faqs: [
      { question: `Is ${place.country} a good place to move from the US?`, answer: `${config.goodFit} can make ${place.country} worth evaluating. The decision should still account for taxes, healthcare, legal status, housing, and the specific city rather than a country-level impression.` },
      { question: `What Pathways are available in ${place.country}?`, answer: `${place.pathways.join(' and ')} are useful starting points in the Profile. Eligibility and supporting documents depend on current official rules and the applicant's circumstances.` },
      { question: `What is the cost of living in ${place.country}?`, answer: `Kolmari uses about $${place.monthlyBudget.toLocaleString()} per month as a planning baseline for one adult near ${place.city}. Treat it as a comparison signal and build a local budget before committing.` },
      { question: `Is ${place.country} safe for Black Americans?`, answer: `Official safety guidance does not measure the experience of Black Americans, and no single rating can represent every city or person. Review the current advisory, speak with Black residents in the exact area, research discrimination and healthcare access, and complete a scouting stay when possible.` },
    ],
    steps: [
      { name: 'Build your Profile', text: 'Record income, remote-work status, family needs, healthcare needs, and timeline.' },
      { name: 'Verify your Pathways', text: `Read the current ${visaSource.publisher} guidance and identify which route fits your circumstances.` },
      { name: 'Validate Community Fit', text: `Research ${greenbook.bestAreas.join(' and ')}, contact local communities, and plan a scouting stay.` },
      { name: 'Build your Move Plan', text: 'Create a document list, personal budget, tax checklist, housing plan, and decision date.' },
    ],
    sources: [visaSource, safetySource],
  }
}

const countryPages: SeoPage[] = [
  countryPage({
    slug: 'move-to-portugal-from-us', place: portugal.place, regionSlug: portugal.regionSlug,
    visaSource: sources.portugalVisa, safetySource: sources.portugalSafety,
    goodFit: 'Atlantic cities, established residence routes, and European access',
    costContext: 'Lisbon can cost more than smaller Portuguese cities, while Porto and secondary cities create different housing tradeoffs.',
  }),
  countryPage({
    slug: 'move-to-spain-from-us', place: spain.place, regionSlug: spain.regionSlug,
    visaSource: sources.spainVisa, safetySource: sources.spainSafety,
    goodFit: 'walkable city life, public transport, and a formal remote-work route',
    costContext: 'Madrid and Barcelona can exceed this baseline; Valencia and smaller cities may produce a different mix of rent and transport costs.',
  }),
  countryPage({
    slug: 'move-to-thailand-from-us', place: thailand.place, regionSlug: thailand.regionSlug,
    visaSource: sources.thailandVisa, safetySource: sources.thailandSafety,
    goodFit: 'regional connectivity, established international hubs, and a lower planning baseline',
    costContext: 'Bangkok, Chiang Mai, and island markets differ significantly, and imported goods or private healthcare can raise a personal budget.',
  }),
]

function comparisonGreenbook(primary: 'portugal' | 'spain' | 'thailand' | 'mexico', summary: string): PublishedGreenbookInsight {
  return { ...insight(primary), summary }
}

const editorialPages: SeoPage[] = [
  {
    slug: 'best-countries-for-black-expats', kind: 'persona',
    title: 'Best Countries for Black Expats (2026 Kolmari Guide)',
    description: 'Compare Community Fit, Pathways, budgets, and research questions for Black Americans evaluating a move abroad.',
    keywords: ['best countries for Black expats', 'Black Americans moving abroad', 'Black expat countries'],
    eyebrow: 'Profile guide', h1: 'Best countries for Black expats',
    intro: 'There is no universal â€œbestâ€ country for Black expats. Kolmari starts with Pathways, budget, and general safety, then treats Community Fit as a separate research question shaped by city, neighborhood, identity, and local relationships.',
    lastReviewed: REVIEWED, mapHref: '/destinations',
    countryCards: [card(portugal.place, portugal.regionSlug), card(ghana.place, ghana.regionSlug), card(mexico.place, mexico.regionSlug)],
    costHeading: 'Compare the planning baselines',
    costIntro: 'Use these figures to narrow a shortlist, then replace them with neighborhood-level housing, healthcare, tax, and schooling research.',
    costItems: [
      { label: 'Portugal', value: '$2,450/month', detail: 'One-adult Kolmari baseline near Lisbon.' },
      { label: 'Ghana', value: '$2,100/month', detail: 'One-adult Kolmari baseline near Accra.' },
      { label: 'Mexico', value: '$1,950/month', detail: 'One-adult Kolmari baseline near Merida.' },
    ],
    pathways: [
      { name: 'Portugal remote-work residence', detail: 'For qualifying remote professionals; verify current requirements with AIMA.', sourceUrl: sources.portugalVisa.url },
      { name: 'Ghana residence permit', detail: 'Requirements depend on the basis for residence and must be checked with Ghanaian authorities.' },
      { name: 'Mexico temporary residence', detail: 'For stays longer than 180 days and up to four years under qualifying circumstances.', sourceUrl: sources.mexicoVisa.url },
    ],
    greenbook: comparisonGreenbook('portugal', 'Community Fit cannot be inferred from a national diversity statistic. Kolmari recommends city-specific conversations with Black residents, a housing and healthcare review, and a scouting stay before selecting a Destination.'),
    faqs: [
      { question: 'What makes a country a strong Destination for Black expats?', answer: 'A workable legal route and budget are only the beginning. Community Fit also includes daily treatment, professional opportunity, healthcare, housing access, hair care, social connection, and the experience of other Black residents in the exact area.' },
      { question: 'Does Kolmari give countries a safety score for Black Americans?', answer: 'No. Official advisories cover general risks and do not measure racialized experience. Kolmari keeps general safety sources and Community Fit research separate.' },
      { question: 'How should I compare Community Fit?', answer: 'Use several current sources, speak directly with residents who share relevant identities, compare neighborhoods, and validate assumptions in person before a long-term commitment.' },
    ],
    steps: [
      { name: 'Define Community Fit', text: 'List the communities, services, and daily experiences that matter to you.' },
      { name: 'Review Pathways and budget', text: 'Remove options that do not fit your legal or financial reality.' },
      { name: 'Validate locally', text: 'Speak with residents and complete a city-specific scouting stay.' },
    ],
    sources: [sources.portugalVisa, sources.mexicoVisa, sources.portugalSafety, sources.mexicoSafety],
  },
  {
    slug: 'best-countries-for-single-women', kind: 'persona',
    title: 'Best Countries for Single Women Moving Abroad (2026)',
    description: 'Compare Pathways, budgets, city life, and practical safety research for single women evaluating a move abroad.',
    keywords: ['best countries for single women', 'women moving abroad alone', 'safe countries for solo women expats'],
    eyebrow: 'Profile guide', h1: 'Best countries for single women moving abroad',
    intro: 'A strong shortlist balances legal status, a sustainable budget, healthcare, transport, social connection, and city-specific safety research. Kolmari treats official advisories as a starting point rather than a personal guarantee.',
    lastReviewed: REVIEWED, mapHref: '/destinations',
    countryCards: [card(portugal.place, portugal.regionSlug), card(spain.place, spain.regionSlug), card(costaRica.place, costaRica.regionSlug)],
    costHeading: 'Plan for independence, not only rent',
    costIntro: 'Include secure housing, late-night transport, private healthcare, emergency savings, and the cost of returning home when building a personal baseline.',
    costItems: [
      { label: 'Portugal', value: '$2,450/month', detail: 'One-adult baseline near Lisbon.' },
      { label: 'Spain', value: '$2,600/month', detail: 'One-adult baseline near Valencia.' },
      { label: 'Costa Rica', value: '$2,350/month', detail: 'One-adult baseline near San Jose.' },
    ],
    pathways: [
      { name: 'Portugal remote-work residence', detail: 'Review employment, service, housing, and document requirements.', sourceUrl: sources.portugalVisa.url },
      { name: 'Spain telework visa', detail: 'Designed for qualifying remote employees and self-employed professionals.', sourceUrl: sources.spainVisa.url },
      { name: 'Costa Rica digital nomad stay', detail: 'Verify current eligibility and insurance requirements with Costa Rican authorities.' },
    ],
    greenbook: comparisonGreenbook('spain', 'Community Fit for a single woman is city- and routine-specific. Research transport after dark, healthcare, housing practices, local support networks, and the experience of women with identities similar to yours.'),
    faqs: [
      { question: 'What should single women compare before moving abroad?', answer: 'Compare legal status, secure housing, healthcare, transport, emergency support, professional options, and the local experience of women with similar identities.' },
      { question: 'Is a national safety level enough?', answer: 'No. National advisories are useful, but neighborhood, routine, language access, and individual identity all affect daily experience.' },
      { question: 'How much emergency savings should I plan?', answer: 'Kolmari begins with a three-month local baseline plus return transportation, deposits, insurance deductibles, and legal or document costs.' },
    ],
    sources: [sources.portugalSafety, sources.spainSafety, sources.portugalVisa, sources.spainVisa],
  },
  {
    slug: 'best-countries-for-families', kind: 'persona',
    title: 'Best Countries for American Families Moving Abroad (2026)',
    description: 'Compare family budgets, Pathways, healthcare, schooling, and Community Fit for an international move.',
    keywords: ['best countries for families moving abroad', 'move abroad with children', 'family expat countries'],
    eyebrow: 'Family Profile guide', h1: 'Best countries for families moving abroad',
    intro: 'Families need a Destination that works for every member. The right shortlist accounts for legal status, dependent eligibility, schooling, healthcare, housing, transport, language, and a larger arrival buffer.',
    lastReviewed: REVIEWED, mapHref: '/destinations',
    countryCards: [card(spain.place, spain.regionSlug), card(portugal.place, portugal.regionSlug), card(mexico.place, mexico.regionSlug)],
    costHeading: 'Turn the one-adult baseline into a family budget',
    costIntro: 'Add bedrooms, school or childcare, dependent insurance, larger deposits, transport, and document costs for every family member.',
    costItems: [
      { label: 'Housing', value: 'Price by bedrooms', detail: 'Compare school access and commuting alongside rent.' },
      { label: 'School and childcare', value: 'Research locally', detail: 'Public, private, and international options have very different costs and admissions.' },
      { label: 'Arrival buffer', value: '4â€“6 months', detail: 'A larger buffer helps cover deposits, school setup, and dependent paperwork.' },
    ],
    pathways: [
      { name: 'Spain telework family visas', detail: 'The official guidance describes eligible accompanying family members.', sourceUrl: sources.spainVisa.url },
      { name: 'Portugal residence Pathways', detail: 'Confirm dependent documentation and family reunification requirements with Portuguese authorities.', sourceUrl: sources.portugalVisa.url },
      { name: 'Mexico temporary residence', detail: 'Review economic-solvency and family-unity routes with the responsible consulate.', sourceUrl: sources.mexicoVisa.url },
    ],
    greenbook: comparisonGreenbook('spain', 'For families, Community Fit includes schools, healthcare, accessibility, language support, other families nearby, and whether each family member can build an independent routine.'),
    faqs: [
      { question: 'What makes a country family-friendly for a long-term move?', answer: 'A sustainable family budget, appropriate legal status, dependable healthcare, realistic schooling, safe daily routines, and community access for both adults and children.' },
      { question: 'Should families choose a country before a school?', answer: 'Usually the city, school, and housing decisions should be evaluated together because availability and commuting can change the entire budget.' },
      { question: 'How should dependents affect Pathways research?', answer: 'Confirm who qualifies as a dependent, required documents, work rights, insurance rules, and application timing directly with the responsible authority.' },
    ],
    sources: [sources.spainVisa, sources.portugalVisa, sources.mexicoVisa],
  },
  {
    slug: 'digital-nomad-visas-for-americans', kind: 'pathway',
    title: 'Digital Nomad Visas for Americans (2026)',
    description: 'Compare remote-work Pathways in Portugal, Spain, and Thailand with official application sources.',
    keywords: ['digital nomad visas for Americans', 'remote work visas 2026', 'best digital nomad visa'],
    eyebrow: 'Pathways guide', h1: 'Digital nomad visas for Americans',
    intro: 'Remote-work Pathways vary in income tests, professional history, insurance, tax exposure, dependents, and permitted work. Use Kolmari to build a shortlist, then treat the official authority as the application source of truth.',
    lastReviewed: REVIEWED, mapHref: '/destinations',
    countryCards: [card(portugal.place, portugal.regionSlug), card(spain.place, spain.regionSlug), card(thailand.place, thailand.regionSlug)],
    costHeading: 'Compare the whole Move Plan',
    costIntro: 'The cheapest monthly baseline is not automatically the best Pathway. Include tax advice, insurance, document preparation, application fees, and renewal requirements.',
    costItems: [
      { label: 'Portugal baseline', value: '$2,450/month', detail: 'Kolmari one-adult planning estimate near Lisbon.' },
      { label: 'Spain baseline', value: '$2,600/month', detail: 'Kolmari one-adult planning estimate near Valencia.' },
      { label: 'Thailand baseline', value: '$1,550/month', detail: 'Kolmari one-adult planning estimate near Chiang Mai.' },
    ],
    pathways: [
      { name: 'Portugal remote-work residence', detail: 'For remote work performed for entities outside Portugal; verify current evidence and residence steps.', sourceUrl: sources.portugalVisa.url },
      { name: 'Spain telework visa', detail: 'For qualifying remote employees or professionals working primarily for entities outside Spain.', sourceUrl: sources.spainVisa.url },
      { name: 'Destination Thailand Visa', detail: 'Thailand lists DTV for workcation and qualifying soft-power activities.', sourceUrl: sources.thailandVisa.url },
    ],
    greenbook: comparisonGreenbook('portugal', 'A Pathway answers whether you may qualify to stay; it does not answer where you will belong. Compare Community Fit, workday infrastructure, healthcare, time zones, and neighborhood life separately.'),
    faqs: [
      { question: 'Which digital nomad visa is easiest for Americans?', answer: 'There is no universally easiest option. The fit depends on income, employment structure, professional history, dependents, insurance, tax exposure, and preferred timeline.' },
      { question: 'Can a digital nomad visa create tax obligations?', answer: 'Potentially. Immigration permission and tax residency are different systems. Obtain qualified cross-border tax advice before choosing dates or a Pathway.' },
      { question: 'Can family members join?', answer: 'Some Pathways allow qualifying family members, but definitions, documents, work rights, and fees vary. Confirm current rules with the official authority.' },
    ],
    steps: [
      { name: 'Document your work arrangement', text: 'Gather contracts, employer permissions, service agreements, and professional-history evidence.' },
      { name: 'Compare official Pathways', text: 'Check income, insurance, criminal-record, housing, dependent, and renewal rules.' },
      { name: 'Review tax exposure', text: 'Ask a qualified adviser how the proposed dates and income sources affect tax residency.' },
      { name: 'Enter Flutter Mode', text: 'Choose one Pathway and build a dated document and application checklist.' },
    ],
    sources: [sources.portugalVisa, sources.spainVisa, sources.thailandVisa],
  },
  {
    slug: 'easiest-visas-for-us-citizens', kind: 'pathway',
    title: 'Easiest Residence Visas for US Citizens to Compare (2026)',
    description: 'A practical comparison of residence Pathways for Americans, including remote-work and temporary-residence options.',
    keywords: ['easiest visas for US citizens', 'easy residence visa Americans', 'move abroad visa options'],
    eyebrow: 'Pathways comparison', h1: 'Easiest residence visas for US citizens to compare',
    intro: 'â€œEasyâ€ should mean compatible with your documented circumstances, not free of requirements. Kolmari compares Pathways by work arrangement, finances, dependents, paperwork, and the Move Timeline.',
    lastReviewed: REVIEWED, mapHref: '/destinations',
    countryCards: [card(portugal.place, portugal.regionSlug), card(spain.place, spain.regionSlug), card(mexico.place, mexico.regionSlug)],
    costHeading: 'Budget beyond the income threshold',
    costIntro: 'Qualification evidence is not the same as a sustainable living budget. Plan for documents, apostilles, translations, insurance, deposits, professional advice, and renewals.',
    costItems: [
      { label: 'Document preparation', value: 'Variable', detail: 'Background checks, apostilles, translations, and certified copies can add time and cost.' },
      { label: 'Professional advice', value: 'Optional but useful', detail: 'Immigration and tax advice may reduce expensive assumptions.' },
      { label: 'Arrival reserve', value: '3+ months', detail: 'Keep it separate from financial evidence required by an authority.' },
    ],
    pathways: [
      { name: 'Portugal remote-work residence', detail: 'A strong comparison for documented remote workers.', sourceUrl: sources.portugalVisa.url },
      { name: 'Spain telework visa', detail: 'A formal route for qualifying international teleworkers.', sourceUrl: sources.spainVisa.url },
      { name: 'Mexico temporary resident visa', detail: 'A route for qualifying stays longer than 180 days and up to four years.', sourceUrl: sources.mexicoVisa.url },
    ],
    greenbook: comparisonGreenbook('mexico', 'A manageable application does not guarantee Community Fit. Keep legal eligibility, sustainable cost, and lived experience as three separate decisions in the Move Plan.'),
    faqs: [
      { question: 'What makes a visa easier for a US citizen?', answer: 'Clear compatibility with the applicantâ€™s work, finances, family situation, documents, and timeline. A route can be straightforward for one person and unavailable to another.' },
      { question: 'Does visa-free entry allow long-term residence or remote work?', answer: 'Not automatically. Visitor entry, residence permission, work permission, and tax status are different questions.' },
      { question: 'Where should I verify requirements?', answer: 'Use the responsible government or consular authority for the application location and check again immediately before applying.' },
    ],
    steps: [
      { name: 'Eliminate incompatible Pathways', text: 'Compare your documented income and work structure with official eligibility.' },
      { name: 'Compare total effort', text: 'List documents, translations, appointments, processing, family needs, and renewals.' },
      { name: 'Choose the best-fit route', text: 'Select the Pathway that supports the complete Move Plan, not only the first application.' },
    ],
    sources: [sources.portugalVisa, sources.spainVisa, sources.mexicoVisa],
  },
  {
    slug: 'portugal-vs-spain-for-expats', kind: 'comparison',
    title: 'Portugal vs Spain for Expats Moving from the US (2026)',
    description: 'Compare Portugal and Spain by monthly planning baseline, Pathways, Community Fit, and city tradeoffs.',
    keywords: ['Portugal vs Spain expats', 'move to Portugal or Spain', 'Portugal Spain cost of living'],
    eyebrow: 'Destination comparison', h1: 'Portugal vs Spain for Americans moving abroad',
    intro: 'Portugal and Spain both offer formal routes for qualifying remote professionals, but the better Destination depends on work structure, city, language, housing, taxes, and Community Fit.',
    lastReviewed: REVIEWED, mapHref: '/destinations/regions/europe',
    countryCards: [card(portugal.place, portugal.regionSlug), card(spain.place, spain.regionSlug)],
    costHeading: 'Portugal vs Spain planning baseline',
    costIntro: 'These Kolmari figures compare Lisbon and Valencia starting points. City and housing selection can outweigh the country-level difference.',
    costItems: [
      { label: 'Portugal', value: '$2,450/month', detail: 'Kolmari one-adult baseline near Lisbon.' },
      { label: 'Spain', value: '$2,600/month', detail: 'Kolmari one-adult baseline near Valencia.' },
      { label: 'Difference', value: '$150/month', detail: 'A comparison signal, not a forecast; rent can reverse the difference.' },
    ],
    pathways: [
      { name: 'Portugal remote-work residence', detail: 'Compare current evidence, residence steps, and renewal rules.', sourceUrl: sources.portugalVisa.url },
      { name: 'Spain telework visa', detail: 'Compare professional-history, work-relationship, and social-security requirements.', sourceUrl: sources.spainVisa.url },
    ],
    greenbook: comparisonGreenbook('portugal', 'Portugal may feel smaller and more Atlantic; Spain offers a wider range of large-city contexts. Community Fit should be compared at the city and neighborhood level rather than assigned nationally.'),
    faqs: [
      { question: 'Is Portugal cheaper than Spain for expats?', answer: "Not always. Kolmari's Lisbon and Valencia baselines differ modestly, while actual rent, neighborhood, household size, and lifestyle can reverse the comparison." },
      { question: 'Which country has the better remote-work Pathway?', answer: 'Both have formal routes. The better fit depends on employment structure, income evidence, professional history, dependents, tax exposure, and preferred timeline.' },
      { question: 'Which has stronger Community Fit?', answer: 'That cannot be answered reliably at country level. Compare the exact city, neighborhood, communities, language needs, and services important to you.' },
    ],
    sources: [sources.portugalVisa, sources.spainVisa, sources.portugalSafety, sources.spainSafety],
  },
  {
    slug: 'thailand-vs-mexico-cost-of-living', kind: 'comparison',
    title: 'Thailand vs Mexico Cost of Living for Americans (2026)',
    description: 'Compare Thailand and Mexico planning baselines, Pathways, Community Fit, and location-specific tradeoffs.',
    keywords: ['Thailand vs Mexico cost of living', 'Thailand or Mexico expat', 'move to Thailand vs Mexico'],
    eyebrow: 'Destination comparison', h1: 'Thailand vs Mexico cost of living',
    intro: 'Thailand has the lower Kolmari baseline in this comparison, while Mexico offers closer US time zones and shorter routes home. The right Destination depends on city, work hours, healthcare, legal status, and Community Fit.',
    lastReviewed: REVIEWED, mapHref: '/destinations',
    countryCards: [card(thailand.place, thailand.regionSlug), card(mexico.place, mexico.regionSlug)],
    costHeading: 'Thailand vs Mexico monthly baseline',
    costIntro: 'This compares Chiang Mai and Merida planning baselines for one adult. Bangkok, Mexico City, resort areas, healthcare, and imported goods can change the result.',
    costItems: [
      { label: 'Thailand', value: '$1,550/month', detail: 'Kolmari one-adult baseline near Chiang Mai.' },
      { label: 'Mexico', value: '$1,950/month', detail: 'Kolmari one-adult baseline near Merida.' },
      { label: 'Difference', value: '$400/month', detail: 'A comparison signal before flights, tax advice, and individual healthcare.' },
    ],
    pathways: [
      { name: 'Destination Thailand Visa', detail: 'Thailand lists DTV for workcation and qualifying activities.', sourceUrl: sources.thailandVisa.url },
      { name: 'Mexico temporary resident visa', detail: 'For qualifying stays longer than 180 days and up to four years.', sourceUrl: sources.mexicoVisa.url },
    ],
    greenbook: comparisonGreenbook('thailand', 'The lower baseline does not settle Community Fit. Compare time zones, language access, seasonal air quality, state or regional advisories, healthcare, flight distance, and the exact communities available.'),
    faqs: [
      { question: 'Is Thailand cheaper than Mexico?', answer: "Kolmari's Chiang Mai baseline is lower than its Merida baseline, but the result changes by city, housing, healthcare, imported goods, and how often you return to the United States." },
      { question: 'Which is better for US working hours?', answer: 'Mexico generally aligns more closely with US time zones. Thailand may require evening or overnight work depending on the team.' },
      { question: 'How do the Pathways differ?', answer: 'Thailandâ€™s DTV and Mexicoâ€™s temporary residence system have different purposes, evidence, durations, and follow-up requirements. Verify current rules directly with each authority.' },
    ],
    sources: [sources.thailandVisa, sources.mexicoVisa, sources.thailandSafety, sources.mexicoSafety],
  },
]

export const SEO_PAGES = [...countryPages, ...editorialPages] as const satisfies readonly SeoPage[]

export const SEO_SLUGS = SEO_PAGES.map((page) => page.slug)

export function getSeoPage(slug: string) {
  return SEO_PAGES.find((page) => page.slug === slug)
}

