// Per-country structured content for the Adaptive Country Workspace.
// All data is editorial/research content — clearly sourced and dated.
// Missing fields are null; the UI renders "Research in progress" for nulls.

export type ContentStatus = 'placeholder' | 'editorially_reviewed' | 'official_source_verified' | 'stale'

export type SectionDisclosure = {
  /** ISO date (YYYY-MM-DD) the section was last reviewed */
  lastVerified: string
  /** Plain-language source summary, e.g. "INE · World Bank · editorial review" */
  sourceNote: string
  status: ContentStatus
}

export type SourcedFact = {
  value: string
  source: string
  period: string
  lastVerified: string
  status: ContentStatus
}

export type HousingContent = {
  rentalRanges: { city: string; studioMin: number; studioMax: number; twoBedMin: number; twoBedMax: number; currency: string }[]
  depositMonths: string
  furnished: string
  leaseDuration: string
  tenantRights: string
  foreignBuyerRules: string
  popularAreas: string[]
  portals: { name: string; url: string }[]
  notes: string
  disclosure?: SectionDisclosure
}

export type EmploymentContent = {
  topSectors: string[]
  jobBoards: { name: string; url: string }[]
  avgSalaryRange: string
  workCulture: string
  languageExpectation: string
  credentialRecognition: string
  remoteEnvironment: string
  networkingGroups: string
  disclaimer: string
  disclosure?: SectionDisclosure
}

export type HealthcareContent = {
  publicSystem: string
  privateSystem: string
  eligibility: string
  insuranceRequirement: string
  emergencyCare: string
  primaryCare: string
  prescriptions: string
  mentalHealth: string
  estimatedInsuranceRange: string
  accessibilityNotes: string
  disclaimer: string
  disclosure?: SectionDisclosure
}

export type EducationContent = {
  publicSchools: string
  privateSchools: string
  internationalSchools: string
  languageOfInstruction: string
  enrollment: string
  specialEducation: string
  childcare: string
  universities: string
  studyPathways: string
  tuitionRange: string
  disclaimer: string
  disclosure?: SectionDisclosure
}

export type TransportationContent = {
  publicTransit: string
  walkability: string
  rail: string
  domesticTravel: string
  internationalConnections: string
  carOwnership: string
  driverLicenseConversion: string
  rideshare: string
  cycling: string
  accessibility: string
  disclosure?: SectionDisclosure
}

export type LegalTaxesContent = {
  taxResidency: string
  incomeTax: string
  socialSecurity: string
  doubleTaxationTreaties: string
  banking: string
  foreignAccountReporting: string
  driverLicenseRules: string
  residencyObligations: string
  propertyOwnership: string
  businessRegistration: string
  disclaimer: string
  disclosure?: SectionDisclosure
}

export type DailyLifeContent = {
  groceryShopping: string
  dining: string
  internet: string
  mobile: string
  weather: string
  holidays: string
  culturalEtiquette: string
  safety: string
  paceOfLife: string
  recreation: string
  disclosure?: SectionDisclosure
}

export type FamilyPetsContent = {
  childcare: string
  familyBenefits: string
  parentalLeave: string
  childrenHealthcare: string
  petImportRules: string
  quarantine: string
  vetCare: string
  petFriendlyHousing: string
  multigenerational: string
  disclosure?: SectionDisclosure
}

export type GreenbookSection = {
  communityFit: string
  blackDiaspora: string
  lgbtq: string
  womenSafety: string
  faithCommunities: string
  disabilityAccess: string
  culturalBelonging: string
  neighborhoodInsights: string
  communityOrgs: { name: string; description: string; url?: string }[]
  disclaimer: string
}

export type ResourceLink = {
  title: string
  organization: string
  description: string
  type: 'official' | 'community'
  url: string
  lastChecked: string
  category: 'immigration' | 'embassy' | 'taxes' | 'statistics' | 'employment' | 'housing' | 'healthcare' | 'education' | 'transportation' | 'community'
}

export type EconomicProfileContent = {
  gdpPerCapita: SourcedFact | null
  growthTrend: SourcedFact | null
  inflation: SourcedFact | null
  unemployment: SourcedFact | null
  avgMonthlyWage: SourcedFact | null
  minimumWage: SourcedFact | null
  topIndustries: string[]
  growingSectors: string[]
  personalInterpretation: string
  disclaimer: string
  disclosure?: SectionDisclosure
}

export type CostCategory = {
  label: string
  soloLow: number
  soloHigh: number
  familyLow?: number
  familyHigh?: number
  currency: string
  notes?: string
}

export type CostOfLivingContent = {
  currency: string
  categories: CostCategory[]
  soloTotal: { low: number; high: number }
  familyTotal?: { low: number; high: number }
  topCity: string
  budgetCities: string[]
  disclaimer: string
  disclosure?: SectionDisclosure
}

export type CountryContent = {
  slug: string
  economic: EconomicProfileContent
  costOfLiving: CostOfLivingContent
  housing: HousingContent
  employment: EmploymentContent
  healthcare: HealthcareContent
  education: EducationContent
  transportation: TransportationContent
  legalTaxes: LegalTaxesContent
  dailyLife: DailyLifeContent
  familyPets: FamilyPetsContent
  greenbook: GreenbookSection
  resources: ResourceLink[]
}

// ─── Portugal ────────────────────────────────────────────────────────────────

const portugal: CountryContent = {
  slug: 'portugal',
  economic: {
    gdpPerCapita: { value: '~$26,000 USD (nominal)', source: 'World Bank', period: '2023', lastVerified: '2026-01-01', status: 'official_source_verified' },
    growthTrend: { value: '~2.3% real GDP growth', source: 'INE (Statistics Portugal)', period: '2023', lastVerified: '2026-01-01', status: 'official_source_verified' },
    inflation: { value: '~2.3% annual CPI', source: 'INE', period: '2024', lastVerified: '2026-01-01', status: 'official_source_verified' },
    unemployment: { value: '~6.4%', source: 'INE / Eurostat', period: '2024', lastVerified: '2026-01-01', status: 'official_source_verified' },
    avgMonthlyWage: { value: '~€1,300–€1,600 gross (varies by sector)', source: 'INE', period: '2023', lastVerified: '2026-01-01', status: 'editorially_reviewed' },
    minimumWage: { value: '€870/month (2024)', source: 'DGERT / gov.pt', period: '2024', lastVerified: '2026-01-01', status: 'official_source_verified' },
    topIndustries: ['Tourism & hospitality', 'Technology & startups', 'Financial services', 'Manufacturing', 'Agriculture & wine', 'Renewable energy'],
    growingSectors: ['Tech & SaaS', 'Remote-work infrastructure', 'Green energy', 'Logistics', 'Healthcare tech'],
    personalInterpretation: 'Your remote income is likely to stretch significantly outside Lisbon and Porto. Local wages are low relative to Western Europe — a remote income of $3,000–$4,000/mo places you well above the median Portuguese household, giving meaningful purchasing power for housing, food, and lifestyle. Costs in central Lisbon have risen sharply; regions like Porto, the Algarve, and the Alentejo offer better value.',
    disclaimer: 'Economic figures are research summaries from official sources and editorial review. Confirm current figures with INE, Banco de Portugal, and the Ministry of Finance before making financial decisions.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'World Bank · INE · Banco de Portugal (2023–2024)', status: 'official_source_verified' as const },
  },
  costOfLiving: {
    currency: 'EUR',
    categories: [
      { label: 'Housing', soloLow: 750, soloHigh: 1400, familyLow: 1100, familyHigh: 2200, currency: 'EUR', notes: 'Porto and Algarve are meaningfully cheaper than central Lisbon.' },
      { label: 'Food & groceries', soloLow: 250, soloHigh: 400, familyLow: 450, familyHigh: 700, currency: 'EUR' },
      { label: 'Dining out', soloLow: 150, soloHigh: 300, familyLow: 300, familyHigh: 500, currency: 'EUR', notes: 'Local tasca meals €8–€15; mid-range €20–€40.' },
      { label: 'Transportation', soloLow: 40, soloHigh: 100, familyLow: 80, familyHigh: 200, currency: 'EUR', notes: 'Navegante/Andante monthly pass ~€30–€40.' },
      { label: 'Healthcare (private)', soloLow: 50, soloHigh: 130, familyLow: 120, familyHigh: 280, currency: 'EUR', notes: 'Private insurance for faster access to specialists.' },
      { label: 'Internet & mobile', soloLow: 40, soloHigh: 70, familyLow: 40, familyHigh: 70, currency: 'EUR' },
      { label: 'Utilities', soloLow: 60, soloHigh: 120, familyLow: 100, familyHigh: 180, currency: 'EUR', notes: 'Included in some rentals; electricity and gas vary seasonally.' },
      { label: 'Entertainment & recreation', soloLow: 80, soloHigh: 200, familyLow: 150, familyHigh: 350, currency: 'EUR' },
      { label: 'Emergency buffer (10%)', soloLow: 150, soloHigh: 275, familyLow: 250, familyHigh: 475, currency: 'EUR' },
    ],
    soloTotal: { low: 1570, high: 2995 },
    familyTotal: { low: 2590, high: 4955 },
    topCity: 'Lisbon',
    budgetCities: ['Porto', 'Braga', 'Coimbra', 'Alentejo towns', 'Interior Algarve'],
    disclaimer: 'Cost estimates are editorial planning ranges based on available data and community reports as of 2024–2025. Actual costs vary widely by city, neighbourhood, lifestyle, and household size. Not a financial forecast.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Idealista · Numbeo · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  housing: {
    rentalRanges: [
      { city: 'Lisbon (central)', studioMin: 1100, studioMax: 1600, twoBedMin: 1600, twoBedMax: 2500, currency: 'EUR' },
      { city: 'Porto', studioMin: 750, studioMax: 1200, twoBedMin: 1100, twoBedMax: 1800, currency: 'EUR' },
      { city: 'Algarve (coastal)', studioMin: 700, studioMax: 1100, twoBedMin: 1000, twoBedMax: 1600, currency: 'EUR' },
      { city: 'Braga / Coimbra', studioMin: 500, studioMax: 800, twoBedMin: 700, twoBedMax: 1100, currency: 'EUR' },
    ],
    depositMonths: 'Typically 2–3 months rent, occasionally up to 6 months for unfurnished properties.',
    furnished: 'Furnished rentals are common for expats, especially short to medium-term. Unfurnished is standard for longer-term leases.',
    leaseDuration: 'Standard leases run 1 year, though 2-year agreements are common. Short-term furnished options exist at a premium.',
    tenantRights: 'Tenant protections exist under the NRAU (New Urban Rental Regime). Landlords must give legal notice before eviction. Dispute resolution is available through RIAL arbitration.',
    foreignBuyerRules: 'EU citizens face no restrictions. Non-EU buyers can purchase freely. The NHR tax regime (now reformed as IFICI) formerly offered income tax advantages — confirm current status with a Portuguese tax advisor.',
    popularAreas: ['Lisbon (Alfama, Príncipe Real, Mouraria)', 'Porto (Foz, Boavista, Bonfim)', 'Cascais & Sintra (near Lisbon)', 'Lagos & Faro (Algarve)', 'Braga (northern Portugal)'],
    portals: [
      { name: 'Idealista Portugal', url: 'https://www.idealista.pt' },
      { name: 'Imovirtual', url: 'https://www.imovirtual.com' },
      { name: 'Uniplaces (furnished / short-term)', url: 'https://www.uniplaces.com/accommodation/lisbon' },
    ],
    notes: 'Rental prices in Lisbon and Porto have risen significantly since 2021. The government has introduced rental control measures — verify current rules. Many expats initially use furnished short-term rentals for 1–3 months while searching for long-term housing.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Idealista · INE · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  employment: {
    topSectors: ['Technology', 'Tourism & hospitality', 'Financial services', 'Healthcare', 'Education', 'Engineering & construction'],
    jobBoards: [
      { name: 'Expresso Emprego', url: 'https://emprego.expresso.pt' },
      { name: 'Net-Empregos', url: 'https://www.net-empregos.com' },
      { name: 'LinkedIn Portugal', url: 'https://www.linkedin.com/jobs/portugal-jobs' },
      { name: 'IEFP (public employment portal)', url: 'https://www.iefp.pt' },
    ],
    avgSalaryRange: '€15,000–€30,000 gross/year in most sectors. Tech professionals, especially bilingual or in fintech, can earn €35,000–€60,000+.',
    workCulture: 'Relationship-driven; hierarchy is respected but collegial. Work-life balance is generally valued. Meetings tend to start on time in corporate settings; SMEs are more flexible. Lunch is an important social occasion.',
    languageExpectation: 'Portuguese is required for most local roles. Tech, financial services, and international firms often work in English. Customer-facing roles almost always require Portuguese.',
    credentialRecognition: 'Professional qualifications must be recognized via the relevant professional body or the DGES (Directorate-General for Higher Education). EU qualifications often benefit from mutual recognition. Confirm for your specific field.',
    remoteEnvironment: 'Portugal is one of Europe\'s most active digital-nomad hubs. Co-working spaces are widespread in Lisbon, Porto, and the Algarve. Internet infrastructure is strong in cities.',
    networkingGroups: 'Portugal Tech, Startup Lisboa, Lisbon Digital Nomads (Facebook/Meetup), Women in Tech Portugal, Internations Lisbon.',
    disclaimer: 'Employment information is for research. Salary ranges vary widely by sector, experience, and employer. Requirements change. Confirm all details with the relevant employer or authority.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'INE · IEFP · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  healthcare: {
    publicSystem: 'The SNS (Serviço Nacional de Saúde) provides universal coverage. Legal residents are entitled to access. Wait times for non-emergency specialist care can be long — 3 to 12 months is not unusual.',
    privateSystem: 'Private healthcare is widely used by expats for faster access and English-speaking doctors. Major private networks include Luz Saúde, CUF, and Lusíadas. Costs are moderate by European standards.',
    eligibility: 'EU/EEA citizens and legal residents with a NIF and address can register at a local health centre (Centro de Saúde). Non-EU residents typically need a residence permit to enrol in the SNS.',
    insuranceRequirement: 'Not legally required once enrolled in the SNS, but many expats carry private insurance for faster specialist access, dental, and vision.',
    emergencyCare: 'Emergency departments (Urgência) are available at public hospitals and covered by SNS for eligible residents. EU visitors can use the EHIC.',
    primaryCare: 'Register with a local Centro de Saúde for a assigned GP (médico de família). Waiting lists for registration can apply in high-demand areas.',
    prescriptions: 'NHS-listed medications have a SNS subsidy. Private prescriptions are available at any pharmacy (farmácia) — widespread and accessible.',
    mentalHealth: 'Mental health services exist within the SNS but have long waits. Private providers, including English-speaking therapists, are available in Lisbon and Porto. Telehealth is growing.',
    estimatedInsuranceRange: '€50–€180/month for an individual adult, depending on age, coverage level, and provider. Family plans vary significantly.',
    accessibilityNotes: 'Accessibility varies by city and building age. Lisbon\'s hilly terrain and old buildings can present challenges. Modern areas and new construction are generally more accessible.',
    disclaimer: 'Healthcare information is for research planning. Confirm eligibility, costs, and procedures with the SNS, your insurer, and official Portuguese health authorities.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'SNS · DGS · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  education: {
    publicSchools: 'Free for legal residents. Instruction is in Portuguese. Curriculum follows the national framework. Quality varies by region — urban schools generally have stronger resources.',
    privateSchools: 'Widely available, especially in Lisbon and Porto. Monthly fees typically €200–€800/month. Instruction may be bilingual.',
    internationalSchools: 'Several IB and British curriculum schools operate in Lisbon and the Algarve. Fees range from €8,000–€20,000/year. St. Julian\'s, Carlucci American International School of Lisbon (CAISL), and Nobel International School are established options.',
    languageOfInstruction: 'Public schools teach in Portuguese. Many private schools offer bilingual or English-medium programs.',
    enrollment: 'EU/EEA children have the same rights as Portuguese citizens. Non-EU children can enrol in public schools with legal residence status.',
    specialEducation: 'Special education support exists within the SNS and public school system. Quality and availability vary by municipality.',
    childcare: 'Crèches (ages 0–3) and pre-school (ages 3–5) are available through public and private providers. Publicly subsidised crèches have income-based fees. Private nurseries in cities range from €400–€1,000/month.',
    universities: 'Portugal has strong public universities including Universidade de Lisboa, Universidade do Porto, and Universidade Nova. Increasing numbers of programs are offered in English.',
    studyPathways: 'Student visa available for non-EU students. EU students can apply on the same terms as national students. Erasmus exchanges are active.',
    tuitionRange: 'Public universities: €697–€1,063/year for EU students. International fees for non-EU vary by institution. Private universities charge €4,000–€9,000/year.',
    disclaimer: 'Education information is for research. Confirm enrollment requirements, fees, and curriculum with individual schools and the Ministry of Education.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'DGES · Ministry of Education · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  transportation: {
    publicTransit: 'Lisbon and Porto have extensive metro, tram, bus, and ferry networks. Andante card (Porto) and Navegante card (Lisbon) offer multi-modal monthly passes from ~€30–€40/month.',
    walkability: 'Lisbon\'s historic centre and Baixa are walkable but hilly. Porto\'s centre is highly walkable. Smaller cities and towns are generally car-dependent.',
    rail: 'CP (Comboios de Portugal) runs intercity and regional trains. Lisbon–Porto takes ~3 hours by Alfa Pendular. Service is frequent on main lines; rural service is sparse.',
    domesticTravel: 'Flixbus and Rede Expressos cover intercity bus routes. Domestic flights operate on key routes (Faro, Porto, Funchal, Açores).',
    internationalConnections: 'Lisbon (LIS) and Porto (OPO) are major international hubs. TAP Air Portugal operates widely. Many low-cost carriers serve both airports.',
    carOwnership: 'Possible but not essential in Lisbon or Porto. Parking in central Lisbon is scarce and expensive. Useful for countryside, Alentejo, and Algarve exploration.',
    driverLicenseConversion: 'EU licenses are valid. Non-EU licenses must be exchanged within 90 days of establishing residence. IMT (Instituto da Mobilidade e dos Transportes) handles conversions. Some countries have reciprocal agreements.',
    rideshare: 'Uber, Bolt, and FreeNow operate in Lisbon and Porto. Taxis are regulated and generally reliable.',
    cycling: 'GIRA bike-sharing in Lisbon. Cycling infrastructure is improving but remains limited outside urban centres. Hills can be challenging.',
    accessibility: 'Lisbon\'s older areas have accessibility challenges due to steep streets and historic buildings. New builds and major stations are more accessible. Metro stations have lifts in most cases.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'CP · Carris · Metro Lisboa · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  legalTaxes: {
    taxResidency: 'You become a Portuguese tax resident if you spend more than 183 days/year in Portugal or maintain a habitual residence there. Tax residency triggers worldwide income reporting obligations.',
    incomeTax: 'Progressive IRS (income tax) applies to residents on worldwide income. Rates range from 13.25% to 48%. The former NHR flat-rate 20% regime has been replaced by IFICI for new applicants — confirm current rules with a tax advisor.',
    socialSecurity: 'Mandatory contributions for employees (~11% employee, ~23.75% employer). Self-employed contributions vary. Remote workers employed abroad may fall under their home country\'s social security depending on applicable treaties.',
    doubleTaxationTreaties: 'Portugal has treaties with the US, UK, Canada, and many other countries. The treaty in force determines where income is taxed and may provide relief from double taxation.',
    banking: 'Major banks: Millennium BCP, Caixa Geral de Depósitos, Santander Portugal, Novo Banco. Opening an account as a non-resident is possible with a NIF (Número de Identificação Fiscal). Fintech options (Revolut, Wise) are widely used.',
    foreignAccountReporting: 'US citizens remain subject to FBAR/FATCA reporting regardless of residence. Confirm obligations with a US tax professional familiar with expat taxation.',
    driverLicenseRules: 'See Transportation tab. IMT handles conversions. Reciprocal agreements exist with some countries.',
    residencyObligations: 'Residence permits must be renewed at AIMA (Agência para a Integração, Migrações e Asilo) on schedule. Absence from Portugal may affect permit renewal or long-term residence eligibility.',
    propertyOwnership: 'Foreigners can purchase property without restriction. Notarised deed (escritura) is required. Stamp duty (IMT), annual municipal property tax (IMI), and VAT on new builds apply. Verify current rates.',
    businessRegistration: 'Company formation is possible at Empresa na Hora or through a notary. EORI number needed for customs activity. Confirm tax obligations for your business structure.',
    disclaimer: 'This information supports research and planning. It is not legal or tax advice. Confirm all details with a Portuguese lawyer or certified accountant (TOC) before acting.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Portal das Finanças · AIMA · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  dailyLife: {
    groceryShopping: 'Pingo Doce, Continente, Lidl, and Aldi are the main chains. Mercados (local markets) offer fresh produce. A couple can eat well on €300–€500/month in groceries depending on lifestyle.',
    dining: 'Eating out is affordable by European standards. A meal at a tasca (local restaurant) costs €8–€15. Mid-range restaurants run €20–€40 per head. Lisbon and Porto have diverse international food scenes.',
    internet: 'Fibre broadband is widely available at €25–€50/month. Major providers: MEO, NOS, Vodafone Portugal. Speeds are generally 100–1,000 Mbps in urban areas.',
    mobile: 'NOS, Vodafone, and MEO offer prepaid and monthly plans. Unlimited data plans from ~€20–€35/month. Coverage is strong in cities and reasonable along main roads.',
    weather: 'Temperate Atlantic climate. Lisbon averages 300 sunny days/year. Summers are warm and dry (25–35°C). Winters are mild (8–15°C) with some rain. The Algarve is warmer year-round.',
    holidays: '13 public holidays per year. Major ones include Carnaval, Easter, Dia de Portugal (June 10), Assumption (August 15), and Christmas. Many businesses close on these days.',
    culturalEtiquette: 'Portuguese are generally reserved but warm. Greetings with kisses on the cheek (two) are common. Dinner is late — 8–10 pm is standard. Noise ordinances are observed. Tipping is appreciated but not obligatory (~10%).',
    safety: 'Portugal consistently ranks among Europe\'s safest countries (Global Peace Index top 7). Petty theft (pickpocketing) in tourist areas is the main concern. Violent crime is rare.',
    paceOfLife: 'Life moves at a relaxed pace outside major corporate environments. Work–life balance is valued. Long lunches and lingering over meals are normal and enjoyable.',
    recreation: 'Beaches, surfing, hiking (Sintra, Gerês, Alentejo), football (extremely popular), cultural festivals, wine tourism, and fado are central to Portuguese life. Outdoor recreation is accessible year-round.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  familyPets: {
    childcare: 'Crèches (ages 0–3) and jardins de infância (ages 3–5) are available publicly (subsidised) and privately. Public places are means-tested. Private options in cities: €400–€900/month.',
    familyBenefits: 'Registered residents with children may be eligible for Abono de Família (child benefit), subject to income and residency criteria. Confirm current eligibility with Segurança Social.',
    parentalLeave: 'Portuguese employees are entitled to parental leave under the Labour Code. Non-employee remote workers employed by foreign firms are not automatically covered — check your employment contract.',
    childrenHealthcare: 'Children can access the SNS as residents. Paediatric care at Centros de Saúde. Private paediatric clinics offer shorter wait times.',
    petImportRules: 'EU Pet Passport system applies. Dogs, cats, and ferrets require a microchip, rabies vaccination, and an EU/equivalent health certificate. UK, US, and other non-EU pets need an official veterinary certificate meeting EU rules.',
    quarantine: 'No quarantine required for pets from EU/EEA countries meeting pet passport requirements. Check DGAV (Direção-Geral de Alimentação e Veterinária) for non-EU country-specific rules.',
    vetCare: 'Veterinary services are good quality and affordable by Northern European standards. Urban areas have 24-hour emergency vet services. Pet insurance is available.',
    petFriendlyHousing: 'Many Portuguese landlords accept pets, but confirm in the lease. Dog-friendly beaches and parks exist, especially in the Algarve. Some urban beaches restrict pets seasonally.',
    multigenerational: 'Family is central to Portuguese culture. Multigenerational living is common. Extended-family households often share costs. Elder care is a growing sector — public ERPI (residential care) and private options exist.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'DGAV · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  greenbook: {
    communityFit: 'Portugal has a long history of multiculturalism tied to its colonial past and diaspora connections. The international community has grown substantially since 2015. Lisbon and Porto are cosmopolitan; smaller towns are less diverse.',
    blackDiaspora: 'Portugal has a significant Afro-Portuguese and Cape Verdean community, especially in Lisbon\'s Mouraria, Cova da Moura, and Amadora neighbourhoods. Community organisations, African restaurants, Kizomba and Semba dance culture are well-established. Racial discrimination exists and has been documented — experiences vary widely by neighbourhood and context. UCCLA and Casa de África provide cultural connections.',
    lgbtq: 'Portugal is among Europe\'s most LGBTQ+ affirming countries. Same-sex marriage has been legal since 2010. Lisbon has an active Pride (Arraial Pride, June) and a strong queer nightlife scene (Príncipe Real area). The Algarve is popular with LGBTQ+ travellers. Public displays of affection are generally accepted in urban areas. Rural attitudes can be more conservative.',
    womenSafety: 'Portugal ranks well on women\'s safety indices. Street harassment exists but is relatively uncommon compared to Southern European averages. Night transport is generally safe in Lisbon and Porto. Domestic violence resources exist through APAV (Associação Portuguesa de Apoio à Vítima).',
    faithCommunities: 'Portugal is majority Roman Catholic (historically), though practice is declining. Lisbon has Protestant, evangelical, Jewish, Muslim (Mesquita Central de Lisboa), Hindu, and Buddhist communities. The Mouraria neighbourhood reflects centuries of religious diversity.',
    disabilityAccess: 'Accessibility is improving but uneven. Historic neighbourhoods with cobblestone streets and steep hills present challenges. Public transport in Lisbon and Porto is gradually improving accessibility. New construction meets EU accessibility standards.',
    culturalBelonging: 'Expats commonly report a welcoming if reserved initial reception. Portuguese people warm up over time. Learning basic Portuguese is highly appreciated and significantly improves daily life and belonging. The expat community in Lisbon, Porto, and the Algarve is large enough to provide immediate social connection.',
    neighborhoodInsights: 'Alfama and Mouraria: historic, hilly, strong community feel, tourist pressure increasing. Príncipe Real: upscale, queer-friendly, arts scene. Bairro Alto: nightlife-heavy. Intendente: gentrifying, multicultural. Cascais / Estoril: wealthy, expat-heavy, coastal. Braga: growing tech scene, lower cost. Faro / Lagos: Algarve coastal life, slower pace.',
    communityOrgs: [
      { name: 'Internations Lisbon', description: 'Large expat community with regular events and networking.', url: 'https://www.internations.org/lisbon-expats' },
      { name: 'Lisbon Digital Nomads (Facebook)', description: 'Active Facebook group for remote workers in Lisbon.', url: 'https://www.facebook.com/groups/lisbondigitalnomads' },
      { name: 'ILGA Portugal', description: 'LGBTQ+ advocacy and community support.', url: 'https://ilga-portugal.pt' },
      { name: 'APAV', description: 'Victim support including domestic violence and gender-based violence assistance.', url: 'https://apav.pt' },
      { name: 'SOS Racismo', description: 'Anti-racism advocacy and reporting resource.', url: 'https://sosracismo.pt' },
    ],
    disclaimer: 'Greenbook insights are a combination of editorially reviewed information and community-reported experiences. Verified resources and community-reported insights are presented separately. Individual experiences vary. Kolmari does not present anecdotes as universal facts.',
  },
  resources: [
    { title: 'AIMA — Residence and immigration', organization: 'AIMA (Agência para a Integração, Migrações e Asilo)', description: 'Official immigration authority replacing SEF. Handles residence permits, renewals, and visa matters.', type: 'official', url: 'https://aima.gov.pt', lastChecked: '2026-01-01', category: 'immigration' },
    { title: 'gov.pt — Visa types and residence guidance', organization: 'Portuguese Government', description: 'Central portal for visa categories, residence rights, and official application links.', type: 'official', url: 'https://www.gov.pt/guias/migrantes-vistos-e-autorizacoes-para-entrar-e-viver-em-portugal', lastChecked: '2026-01-01', category: 'immigration' },
    { title: 'US Embassy Lisbon', organization: 'U.S. Department of State', description: 'US consular services, American Citizen Services, and Portugal country information.', type: 'official', url: 'https://pt.usembassy.gov', lastChecked: '2026-01-01', category: 'embassy' },
    { title: 'UK Embassy Lisbon', organization: 'British Government', description: 'British consular services and living-in-Portugal guidance for UK nationals.', type: 'official', url: 'https://www.gov.uk/world/organisations/british-embassy-lisbon', lastChecked: '2026-01-01', category: 'embassy' },
    { title: 'Portal das Finanças — Portuguese tax authority', organization: 'Autoridade Tributária e Aduaneira (AT)', description: 'Tax filings, NIF registration, and Portuguese tax information.', type: 'official', url: 'https://www.portaldasfinancas.gov.pt', lastChecked: '2026-01-01', category: 'taxes' },
    { title: 'INE — Statistics Portugal', organization: 'Instituto Nacional de Estatística', description: 'Official national statistics: demographics, cost of living, wages, and economic data.', type: 'official', url: 'https://www.ine.pt', lastChecked: '2026-01-01', category: 'statistics' },
    { title: 'IEFP — Public Employment Institute', organization: 'Instituto do Emprego e da Formação Profissional', description: 'Official employment portal, job listings, and training resources.', type: 'official', url: 'https://www.iefp.pt', lastChecked: '2026-01-01', category: 'employment' },
    { title: 'SNS — National Health Service', organization: 'Serviço Nacional de Saúde', description: 'Public health system portal. Find health centres, hospitals, and registration information.', type: 'official', url: 'https://www.sns.gov.pt', lastChecked: '2026-01-01', category: 'healthcare' },
    { title: 'Idealista Portugal', organization: 'Idealista', description: 'Leading property portal for rentals and sales across Portugal.', type: 'community', url: 'https://www.idealista.pt', lastChecked: '2026-01-01', category: 'housing' },
    { title: 'Portugal Resident', organization: 'Portugal Resident (English-language news)', description: 'English-language news, expat community, and relocation resources.', type: 'community', url: 'https://www.portugalresident.com', lastChecked: '2026-01-01', category: 'community' },
    { title: 'DGES — Higher education credential recognition', organization: 'Direção-Geral do Ensino Superior', description: 'Recognition of foreign academic qualifications for study and professional use.', type: 'official', url: 'https://www.dges.gov.pt', lastChecked: '2026-01-01', category: 'education' },
    { title: 'CP — Comboios de Portugal', organization: 'CP', description: 'National rail operator. Schedules, tickets, and passes.', type: 'official', url: 'https://www.cp.pt', lastChecked: '2026-01-01', category: 'transportation' },
  ],
}

// ─── Spain ───────────────────────────────────────────────────────────────────

const spain: CountryContent = {
  slug: 'spain',
  economic: {
    gdpPerCapita: { value: '~$33,000 USD (nominal)', source: 'World Bank', period: '2023', lastVerified: '2026-01-01', status: 'official_source_verified' },
    growthTrend: { value: '~2.5% real GDP growth', source: 'INE Spain', period: '2023', lastVerified: '2026-01-01', status: 'official_source_verified' },
    inflation: { value: '~3.5% annual CPI', source: 'INE Spain / Eurostat', period: '2024', lastVerified: '2026-01-01', status: 'official_source_verified' },
    unemployment: { value: '~11.6%', source: 'INE Spain / Eurostat', period: '2024', lastVerified: '2026-01-01', status: 'official_source_verified' },
    avgMonthlyWage: { value: '~€1,800–€2,200 gross (varies by region)', source: 'INE Spain', period: '2023', lastVerified: '2026-01-01', status: 'editorially_reviewed' },
    minimumWage: { value: '€1,134/month (2024)', source: 'Ministerio de Trabajo', period: '2024', lastVerified: '2026-01-01', status: 'official_source_verified' },
    topIndustries: ['Tourism', 'Automotive & manufacturing', 'Financial services', 'Technology', 'Agriculture', 'Renewable energy'],
    growingSectors: ['Tech & startups', 'Renewable energy', 'Pharma & biotech', 'E-commerce & logistics'],
    personalInterpretation: 'Spain offers a higher GDP per capita than Portugal with a larger domestic economy. Remote income provides strong purchasing power outside Madrid and Barcelona. Local wages are modest — a €2,000/mo local salary is above average. Barcelona and Madrid carry higher living costs; Valencia, Málaga, and Seville offer meaningfully lower costs with excellent quality of life.',
    disclaimer: 'Economic figures are research summaries. Confirm with INE Spain, Banco de España, and the Agencia Tributaria.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'World Bank · INE Spain · Ministerio de Trabajo (2023–2024)', status: 'official_source_verified' as const },
  },
  costOfLiving: {
    currency: 'EUR',
    categories: [
      { label: 'Housing', soloLow: 800, soloHigh: 1500, familyLow: 1200, familyHigh: 2500, currency: 'EUR', notes: 'Valencia, Málaga, and Seville are significantly cheaper than Barcelona or Madrid.' },
      { label: 'Food & groceries', soloLow: 250, soloHigh: 420, familyLow: 450, familyHigh: 750, currency: 'EUR' },
      { label: 'Dining out', soloLow: 150, soloHigh: 350, familyLow: 300, familyHigh: 550, currency: 'EUR', notes: 'Menú del día €10–€15; dinner €15–€35/person.' },
      { label: 'Transportation', soloLow: 45, soloHigh: 110, familyLow: 90, familyHigh: 220, currency: 'EUR', notes: 'Madrid Zone A monthly pass ~€54.60.' },
      { label: 'Healthcare (private)', soloLow: 60, soloHigh: 160, familyLow: 130, familyHigh: 320, currency: 'EUR' },
      { label: 'Internet & mobile', soloLow: 40, soloHigh: 75, familyLow: 40, familyHigh: 75, currency: 'EUR' },
      { label: 'Utilities', soloLow: 65, soloHigh: 130, familyLow: 110, familyHigh: 200, currency: 'EUR' },
      { label: 'Entertainment & recreation', soloLow: 100, soloHigh: 250, familyLow: 180, familyHigh: 400, currency: 'EUR' },
      { label: 'Emergency buffer (10%)', soloLow: 155, soloHigh: 299, familyLow: 250, familyHigh: 502, currency: 'EUR' },
    ],
    soloTotal: { low: 1665, high: 3294 },
    familyTotal: { low: 2750, high: 5517 },
    topCity: 'Barcelona',
    budgetCities: ['Valencia', 'Seville', 'Málaga', 'Alicante', 'Murcia'],
    disclaimer: 'Cost estimates are editorial planning ranges. Actual costs vary by city, neighbourhood, and lifestyle. Not a financial forecast.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Idealista · Numbeo · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  housing: {
    rentalRanges: [
      { city: 'Barcelona (central)', studioMin: 1100, studioMax: 1700, twoBedMin: 1600, twoBedMax: 2800, currency: 'EUR' },
      { city: 'Madrid (central)', studioMin: 950, studioMax: 1500, twoBedMin: 1400, twoBedMax: 2200, currency: 'EUR' },
      { city: 'Valencia', studioMin: 550, studioMax: 900, twoBedMin: 800, twoBedMax: 1300, currency: 'EUR' },
      { city: 'Málaga / Seville', studioMin: 550, studioMax: 850, twoBedMin: 750, twoBedMax: 1200, currency: 'EUR' },
    ],
    depositMonths: 'Legally 1 month for residential leases (Ley de Arrendamientos Urbanos). Landlords may also request additional guarantees.',
    furnished: 'Both furnished and unfurnished options are common. International areas of Barcelona and Madrid have many furnished options for new arrivals.',
    leaseDuration: 'Minimum 5 years (7 years if the landlord is a company) for residential tenants under current LAU rules.',
    tenantRights: 'Strong tenant protections under the LAU. Landlords cannot evict without cause during the minimum lease period. Rent increases are capped to CPI in most circumstances.',
    foreignBuyerRules: 'No restrictions on foreign property purchase. Non-EU buyers need an NIE (Número de Identidad de Extranjero). Golden Visa (€500,000 investment) was available but has been announced for reform — confirm current status.',
    popularAreas: ['Barcelona (Eixample, Gràcia, Poblenou)', 'Madrid (Malasaña, Lavapiés, Chueca)', 'Valencia (Ruzafa, El Cabanyal)', 'Málaga (El Centro, Soho)', 'Seville (Triana, Santa Cruz)'],
    portals: [
      { name: 'Idealista Spain', url: 'https://www.idealista.com' },
      { name: 'Fotocasa', url: 'https://www.fotocasa.es' },
      { name: 'Habitaclia', url: 'https://www.habitaclia.com' },
    ],
    notes: 'Rental markets in Barcelona and Madrid are under significant pressure. The government has introduced rent-control measures in declared Stressed Residential Market Areas. Verify applicability to your target city.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Idealista · INE · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  employment: {
    topSectors: ['Technology', 'Tourism & hospitality', 'Financial services', 'Healthcare', 'Education', 'Engineering'],
    jobBoards: [
      { name: 'InfoJobs', url: 'https://www.infojobs.net' },
      { name: 'LinkedIn Spain', url: 'https://www.linkedin.com/jobs/spain-jobs' },
      { name: 'Tecnoempleo', url: 'https://www.tecnoempleo.com' },
      { name: 'SEPE (public employment service)', url: 'https://www.sepe.es' },
    ],
    avgSalaryRange: '€18,000–€35,000 gross/year in most sectors. Senior tech professionals and bilinguals can earn €40,000–€80,000+.',
    workCulture: 'Social and relationship-oriented. The midday break remains culturally important in some regions. Work hours can extend into early evening. Siesta schedules vary by sector and city.',
    languageExpectation: 'Spanish is required for most roles. English-medium roles exist in tech, multinationals, and international services. Catalan is expected in many Barcelona-based roles.',
    credentialRecognition: 'EU qualifications benefit from mutual recognition. Non-EU credentials require homologación through the Ministry of Education. Timelines vary by profession.',
    remoteEnvironment: 'Spain introduced a Digital Nomad Visa in 2023 for non-EU remote workers. Madrid and Barcelona have strong co-working ecosystems. The Canary Islands and Valencia are popular alternatives.',
    networkingGroups: 'Startup Grind Spain, Internations Madrid/Barcelona, Women in Tech Spain, Mad Collective, Barcelona Tech City.',
    disclaimer: 'Employment information is for research. Confirm requirements and details with the relevant employer, SEPE, or Ministry of Labour.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'INE · SEPE · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  healthcare: {
    publicSystem: 'The SNS (Sistema Nacional de Salud) provides universal coverage to residents. Free at point of use for registered residents. Wait times for specialists can be lengthy.',
    privateSystem: 'Private healthcare is widely used. Major providers: Sanitas, Adeslas, Asisa, Mapfre Salud. Costs are competitive.',
    eligibility: 'Legal residents can register with a local centro de salud. EU citizens can use the EHIC for temporary visits.',
    insuranceRequirement: 'Digital Nomad Visa applicants must demonstrate sufficient private health insurance coverage for Spain.',
    emergencyCare: 'Free emergency care at public hospitals (Urgencias) for all. EU visitors can use EHIC.',
    primaryCare: 'Assigned GP (médico de cabecera) through the local health centre.',
    prescriptions: 'Subsidised for SNS registrants. Pharmacies (farmacias) are widespread — identifiable by a green cross.',
    mentalHealth: 'SNS mental health services exist but have long waits. Private English-speaking therapists available in major cities. Telehealth is growing.',
    estimatedInsuranceRange: '€60–€200/month for an adult depending on age, coverage, and provider.',
    accessibilityNotes: 'Modern cities have good accessibility infrastructure. Older neighbourhoods vary. Major transport hubs are generally accessible.',
    disclaimer: 'Confirm eligibility, costs, and procedures with your local health centre and official Spanish health authorities.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'SNS · Sanidad · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  education: {
    publicSchools: 'Free and compulsory for residents aged 6–16. Instruction is in Spanish (and regional languages where applicable). Quality varies by region.',
    privateSchools: 'Private and concertado (semi-private subsidised) schools are widespread.',
    internationalSchools: 'British, American, French, and IB schools operate in Madrid, Barcelona, and other major cities. Fees typically €6,000–€18,000/year.',
    languageOfInstruction: 'Public schools primarily in Spanish (and Catalan, Basque, Galician in respective regions). Many private schools offer bilingual or English-medium instruction.',
    enrollment: 'EU children have equal rights. Non-EU children with legal residence can enrol in public schools.',
    specialEducation: 'Integrated special education support within the public system. Varies by region.',
    childcare: 'Escuelas infantiles (ages 0–3) — public (means-tested) and private (€300–€800/month in cities). Pre-school (ages 3–6) is free in the public system.',
    universities: 'Spain has numerous strong universities. Universidad Complutense (Madrid), Universidad de Barcelona, IE University (international programs). Growing number of English-taught programs.',
    studyPathways: 'Student visa for non-EU students. EU students can apply as nationals.',
    tuitionRange: 'Public universities: €680–€1,300/year for EU students. International fees vary. Private/international universities: €5,000–€20,000+/year.',
    disclaimer: 'Confirm enrollment, fees, and curricula with individual schools and the Ministry of Education.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Ministry of Education · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  transportation: {
    publicTransit: 'Madrid and Barcelona have excellent metro, bus, and commuter rail networks. Monthly pass: ~€54.60 (Madrid Zone A), ~€40–€80 (Barcelona). Provincial cities are more car-dependent.',
    walkability: 'Madrid and Barcelona city centres are highly walkable. Valencia and Seville are also excellent for walking and cycling.',
    rail: 'RENFE operates high-speed AVE (Madrid–Barcelona ~2.5 hours), intercity, and regional services. Extensive and growing network.',
    domesticTravel: 'Frequent domestic flights (Iberia, Vueling, Ryanair). ALSA operates long-distance buses. Blablacar popular for shared rides.',
    internationalConnections: 'Madrid Barajas (MAD) and Barcelona El Prat (BCN) are major international hubs. Excellent connections to the Americas, Europe, and Africa.',
    carOwnership: 'Not necessary in Madrid or Barcelona. Useful for rural areas. Parking in city centres is scarce and expensive.',
    driverLicenseConversion: 'EU licenses are valid. Non-EU licenses: exchange within 6 months via DGT (Dirección General de Tráfico). Reciprocal agreements exist with some countries.',
    rideshare: 'Cabify, Uber, and FreeNow operate in major cities. Taxis are regulated.',
    cycling: 'BiciMAD (Madrid) and Bicing (Barcelona) bike-sharing schemes. Cycling infrastructure improving in major cities. Valencia is one of Spain\'s most cycle-friendly cities.',
    accessibility: 'Modern metro and train stations generally accessible. Older buildings and streets vary.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'RENFE · Metro · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  legalTaxes: {
    taxResidency: 'Spanish resident if you spend more than 183 days in Spain per calendar year, or have your primary economic interests there.',
    incomeTax: 'IRPF (progressive, 19%–47% for most income; an additional regional tier applies). Beckham Law offers a flat 24% rate for qualifying new residents — a key benefit of the Digital Nomad Visa. Confirm current rules.',
    socialSecurity: 'Employee contributions: ~6.35%. Employer: ~29.9%. Self-employed (autónomo) pay a quota-based system from ~€230–€500+/month depending on income.',
    doubleTaxationTreaties: 'Spain has extensive treaty network including US, UK, Canada. Determine applicable treaty for your home country.',
    banking: 'Major banks: BBVA, Santander, CaixaBank, Sabadell. Opening requires NIE. Fintech alternatives (N26, Revolut) widely used.',
    foreignAccountReporting: 'Modelo 720 requires declaration of foreign assets over €50,000. US citizens subject to FBAR/FATCA regardless of residence.',
    driverLicenseRules: 'See Transportation tab.',
    residencyObligations: 'Residence permits via Digital Nomad Visa require maintaining qualifying income and spending time in Spain. Confirm renewal requirements.',
    propertyOwnership: 'Foreigners can buy property. Requires NIE. Transfer tax (ITP) 6–11% on resales; VAT on new builds. Annual IBI (property tax) applies.',
    businessRegistration: 'Autónomo (sole trader) registration through RETA (Seguridad Social) and AEAT. Company formation via Registro Mercantil.',
    disclaimer: 'Not legal or tax advice. Confirm all details with a Spanish gestor, abogado, or asesor fiscal.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Agencia Tributaria · Extranjería · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  dailyLife: {
    groceryShopping: 'Mercadona, Lidl, Aldi, Carrefour, El Corte Inglés are the main chains. Local markets (Mercado de la Boqueria, Mercado de San Miguel) for fresh produce. Food costs are reasonable.',
    dining: 'Dining out is a central part of Spanish life. Lunch (la comida) is the main meal. Menú del día (set lunch) typically €10–€15. Dinner is late (9–11 pm). Tapas culture widely enjoyed.',
    internet: 'Fibre broadband widely available at €30–€60/month. Movistar, Orange, Vodafone Spain, MásMóvil. Urban speeds 300–1,000 Mbps.',
    mobile: 'Movistar, Orange, Vodafone, and many MVNOs. Unlimited data plans from ~€20–€40/month.',
    weather: 'Diverse by region. Madrid: hot summers (35–40°C), cold winters. Barcelona: Mediterranean, mild winters. Andalusia: hot and sunny. Canary Islands: subtropical year-round.',
    holidays: '14 public holidays nationally; additional regional holidays. Main holidays: Easter, Día de la Hispanidad (Oct 12), Christmas, New Year.',
    culturalEtiquette: 'Warm and social culture. Greeting with a kiss on both cheeks. Late hours are normal — dinner at 9–10 pm, nights out past midnight common. Lunch is sacred in many households.',
    safety: 'Generally safe. Petty theft in tourist areas (Barcelona La Rambla) is the main concern. Violent crime rates are low.',
    paceOfLife: 'Varies significantly. Madrid and Barcelona are fast-paced. Smaller cities and towns are more relaxed. Siesta culture survives in some areas.',
    recreation: 'Football (dominant), beach culture, hiking (Sierra Nevada, Pyrenees), flamenco, wine and gastronomy, festivals (La Tomatina, Las Fallas, Semana Santa).',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  familyPets: {
    childcare: 'Escuelas infantiles (0–3) — public (subsidised, long waiting lists) and private (€300–€800/month). Pre-school (3–6) free in public system.',
    familyBenefits: 'Family benefits through INSS (Instituto Nacional de la Seguridad Social) for contributors. Child benefit (prestación por hijo a cargo) for qualifying residents.',
    parentalLeave: 'Generous parental leave for employees — 16 weeks fully paid for both parents under current law. Confirm current rules with the INSS.',
    childrenHealthcare: 'Children covered under the SNS as residents. Paediatric services at local health centres.',
    petImportRules: 'EU Pet Passport for EU arrivals. Non-EU pets require an EU-format health certificate with microchip, rabies vaccination, and official vet sign-off.',
    quarantine: 'No quarantine for pets meeting EU entry requirements.',
    vetCare: 'Good quality, affordable veterinary services. Urban centres have 24-hour emergency clinics.',
    petFriendlyHousing: 'Landlord consent required. Dog-friendly parks and beaches exist. Seasonal beach restrictions apply.',
    multigenerational: 'Family ties are strong in Spain. Multigenerational living is culturally normal, especially outside major cities.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'DGAV · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  greenbook: {
    communityFit: 'Spain is a diverse, EU member state with a large foreign-born population. Major cities are cosmopolitan and multicultural. Smaller cities are more homogeneous.',
    blackDiaspora: 'Black communities in Spain are relatively small but growing, concentrated in Madrid, Barcelona, and Catalonia. Sub-Saharan African and Latin American Afro-descendant communities exist. Experiences of racism vary and have been documented — particularly in employment and housing. SOS Racismo Catalunya and Movimiento contra la intolerancia are active advocacy organisations.',
    lgbtq: 'Spain is one of the world\'s most LGBTQ+ progressive countries. Same-sex marriage legal since 2005. Madrid\'s Chueca and Barcelona\'s Eixample are globally recognised LGBTQ+ neighbourhoods. Madrid Pride (Orgullo) is one of Europe\'s largest. Attitudes in rural areas can be more conservative.',
    womenSafety: 'Spain has strong legal protections for women (Ley Orgánica de Violencia de Género). Cities are generally safe. EMAKUNDE and Fundación Mujeres are key support organisations.',
    faithCommunities: 'Predominantly Catholic (cultural). Active Muslim community (especially Catalonia, Ceuta, Melilla). Jewish communities in Madrid and Barcelona. Evangelical and Protestant churches present in major cities.',
    disabilityAccess: 'Improving accessibility in cities. Modern transport hubs are accessible. Many historic centres have cobblestone streets and limited lift access.',
    culturalBelonging: 'Spaniards are warm and social but can take time to develop deeper friendships. Learning Spanish (and regional language where applicable) significantly improves belonging. The expat community is large in major cities.',
    neighborhoodInsights: 'Barcelona (Gràcia: bohemian, family-friendly; Eixample: central, LGBTQ+; Poblenou: tech/creative). Madrid (Malasaña: young, creative; Chueca: LGBTQ+; Lavapiés: multicultural). Valencia (Ruzafa: arts, cafes). Málaga (Soho: creative, growing expat community).',
    communityOrgs: [
      { name: 'Internations Spain', description: 'Expat community events and networking across Spain.', url: 'https://www.internations.org/spain-expats' },
      { name: 'FELGTBI+', description: 'Spanish LGBTQ+ federation.', url: 'https://felgtbi.org' },
      { name: 'SOS Racismo Catalunya', description: 'Anti-racism advocacy and reporting.', url: 'https://www.sosracisme.org' },
    ],
    disclaimer: 'Greenbook insights combine editorial research and community-reported experiences. Individual experiences vary. Not universal statements of fact.',
  },
  resources: [
    { title: 'Extranjería — Immigration procedures', organization: 'Secretaría de Estado de Migraciones', description: 'Official portal for visas, residence permits, and work authorizations.', type: 'official', url: 'https://extranjeros.inclusion.gob.es', lastChecked: '2026-01-01', category: 'immigration' },
    { title: 'Consulado General de España — Visa information', organization: 'Spanish Ministry of Foreign Affairs', description: 'Visa categories, requirements, and consulate listings.', type: 'official', url: 'https://www.exteriores.gob.es/es/ServiciosAlCiudadano/Paginas/Visados.aspx', lastChecked: '2026-01-01', category: 'immigration' },
    { title: 'Agencia Tributaria', organization: 'Agencia Estatal de Administración Tributaria', description: 'Tax filings, NIE/NIF, and Spanish tax information.', type: 'official', url: 'https://www.agenciatributaria.es', lastChecked: '2026-01-01', category: 'taxes' },
    { title: 'INE Spain — National Statistics', organization: 'Instituto Nacional de Estadística', description: 'Official statistics: demographics, wages, economic data.', type: 'official', url: 'https://www.ine.es', lastChecked: '2026-01-01', category: 'statistics' },
    { title: 'US Embassy Madrid', organization: 'U.S. Department of State', description: 'US consular services and American Citizen Services in Spain.', type: 'official', url: 'https://es.usembassy.gov', lastChecked: '2026-01-01', category: 'embassy' },
    { title: 'SNS Spain', organization: 'Sistema Nacional de Salud', description: 'National Health System portal, health centre finder.', type: 'official', url: 'https://www.sanidad.gob.es', lastChecked: '2026-01-01', category: 'healthcare' },
    { title: 'Idealista Spain', organization: 'Idealista', description: 'Leading property portal for rentals and sales.', type: 'community', url: 'https://www.idealista.com', lastChecked: '2026-01-01', category: 'housing' },
    { title: 'SEPE — Public employment service', organization: 'Servicio Público de Empleo Estatal', description: 'Job search, unemployment benefits, training.', type: 'official', url: 'https://www.sepe.es', lastChecked: '2026-01-01', category: 'employment' },
    { title: 'RENFE — National rail', organization: 'RENFE', description: 'Train tickets, schedules, and travel passes across Spain.', type: 'official', url: 'https://www.renfe.com', lastChecked: '2026-01-01', category: 'transportation' },
  ],
}

// ─── Greece ──────────────────────────────────────────────────────────────────

const greece: CountryContent = {
  slug: 'greece',
  economic: {
    gdpPerCapita: { value: '~$22,500 USD (nominal)', source: 'World Bank', period: '2023', lastVerified: '2026-01-01', status: 'official_source_verified' },
    growthTrend: { value: '~2.1% real GDP growth', source: 'ELSTAT', period: '2023', lastVerified: '2026-01-01', status: 'official_source_verified' },
    inflation: { value: '~2.9% annual CPI', source: 'ELSTAT / Eurostat', period: '2024', lastVerified: '2026-01-01', status: 'official_source_verified' },
    unemployment: { value: '~10.1%', source: 'ELSTAT / Eurostat', period: '2024', lastVerified: '2026-01-01', status: 'official_source_verified' },
    avgMonthlyWage: { value: '~€1,100–€1,400 gross', source: 'ELSTAT', period: '2023', lastVerified: '2026-01-01', status: 'editorially_reviewed' },
    minimumWage: { value: '€830/month (2024)', source: 'Ministry of Labour', period: '2024', lastVerified: '2026-01-01', status: 'official_source_verified' },
    topIndustries: ['Tourism & hospitality', 'Shipping & maritime', 'Agriculture & olive oil', 'Financial services', 'Retail', 'Construction'],
    growingSectors: ['Tourism tech', 'Renewable energy', 'Tech startups (Athens)', 'Film production', 'Digital services'],
    personalInterpretation: 'Greece offers a lower cost of living than Western Europe, though local wages are modest. A remote income of $3,500/mo places you comfortably above median household income. Athens has become a growing tech and startup hub. Island life offers lower costs and exceptional quality of life outside peak tourist season — but services may be seasonal.',
    disclaimer: 'Figures are research summaries from official sources. Confirm with ELSTAT, Bank of Greece, and the Ministry of Finance.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'World Bank · ELSTAT · Ministry of Labour Greece (2023–2024)', status: 'official_source_verified' as const },
  },
  costOfLiving: {
    currency: 'EUR',
    categories: [
      { label: 'Housing', soloLow: 500, soloHigh: 950, familyLow: 800, familyHigh: 1500, currency: 'EUR', notes: 'Central Athens is pricier; Thessaloniki and Crete offer better value.' },
      { label: 'Food & groceries', soloLow: 200, soloHigh: 350, familyLow: 380, familyHigh: 600, currency: 'EUR', notes: 'Fresh produce at laiki markets is very affordable.' },
      { label: 'Dining out', soloLow: 120, soloHigh: 280, familyLow: 240, familyHigh: 450, currency: 'EUR', notes: 'Taverna meals €10–€20/person.' },
      { label: 'Transportation', soloLow: 30, soloHigh: 90, familyLow: 70, familyHigh: 180, currency: 'EUR', notes: 'Athens monthly transit pass ~€30.' },
      { label: 'Healthcare (private)', soloLow: 60, soloHigh: 160, familyLow: 120, familyHigh: 300, currency: 'EUR' },
      { label: 'Internet & mobile', soloLow: 35, soloHigh: 65, familyLow: 35, familyHigh: 65, currency: 'EUR' },
      { label: 'Utilities', soloLow: 70, soloHigh: 140, familyLow: 120, familyHigh: 220, currency: 'EUR' },
      { label: 'Entertainment & recreation', soloLow: 80, soloHigh: 200, familyLow: 150, familyHigh: 350, currency: 'EUR' },
      { label: 'Emergency buffer (10%)', soloLow: 120, soloHigh: 224, familyLow: 192, familyHigh: 367, currency: 'EUR' },
    ],
    soloTotal: { low: 1215, high: 2459 },
    familyTotal: { low: 2107, high: 4032 },
    topCity: 'Athens',
    budgetCities: ['Thessaloniki', 'Crete (Heraklion, Chania)', 'Patras', 'Ioannina'],
    disclaimer: 'Cost estimates are editorial planning ranges. Actual costs vary by city, island, and season. Not a financial forecast.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Spitogatos · Numbeo · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  housing: {
    rentalRanges: [
      { city: 'Athens (central)', studioMin: 550, studioMax: 900, twoBedMin: 850, twoBedMax: 1400, currency: 'EUR' },
      { city: 'Athens (suburbs)', studioMin: 400, studioMax: 650, twoBedMin: 600, twoBedMax: 950, currency: 'EUR' },
      { city: 'Thessaloniki', studioMin: 350, studioMax: 600, twoBedMin: 500, twoBedMax: 850, currency: 'EUR' },
      { city: 'Santorini / Mykonos (off-season)', studioMin: 500, studioMax: 900, twoBedMin: 750, twoBedMax: 1300, currency: 'EUR' },
      { city: 'Crete (Heraklion / Chania)', studioMin: 350, studioMax: 600, twoBedMin: 500, twoBedMax: 900, currency: 'EUR' },
    ],
    depositMonths: 'Typically 2 months rent.',
    furnished: 'Furnished rentals are widely available, especially for shorter stays. Unfurnished is standard for long-term leases.',
    leaseDuration: 'Minimum 3 years for residential leases under Greek law, though shorter terms are common in practice — confirm with a local lawyer.',
    tenantRights: 'Tenant protections under Law 4242/2014 and the Civil Code. Eviction requires legal process. Rules differ for short-term and long-term rentals.',
    foreignBuyerRules: 'EU citizens face no restrictions. Non-EU buyers from certain countries need additional approvals, particularly for border areas. Golden Visa program (real estate investment) exists — confirm current thresholds with official sources.',
    popularAreas: ['Athens (Kolonaki, Exarcheia, Koukaki, Glyfada)', 'Thessaloniki (city centre, Kalamaria)', 'Crete (Chania, Heraklion)', 'Corfu town', 'Rhodes town'],
    portals: [
      { name: 'Spitogatos', url: 'https://www.spitogatos.gr' },
      { name: 'XE.gr', url: 'https://www.xe.gr' },
      { name: 'Rightmove Greece', url: 'https://www.rightmove.co.uk/overseas-property/in-Greece.html' },
    ],
    notes: 'Athens rental prices have risen significantly post-2021 due to Airbnb pressure and increased demand. Short-term furnished options are abundant. Island rentals are highly seasonal — off-season prices are substantially lower.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Spitogatos · XE.gr · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  employment: {
    topSectors: ['Tourism & hospitality', 'Shipping & maritime', 'Technology', 'Education', 'Agriculture', 'Healthcare'],
    jobBoards: [
      { name: 'Kariera.gr', url: 'https://www.kariera.gr' },
      { name: 'LinkedIn Greece', url: 'https://www.linkedin.com/jobs/greece-jobs' },
      { name: 'OAED / DYPA (public employment)', url: 'https://www.dypa.gov.gr' },
    ],
    avgSalaryRange: '€12,000–€25,000 gross/year in most sectors. Tech and shipping professionals earn more.',
    workCulture: 'Relationship-oriented; personal connections matter in hiring. Hierarchy is present but colleagues are generally warm and informal. Work hours can be long in hospitality and family businesses.',
    languageExpectation: 'Greek is required for most roles. Tech sector and multinationals increasingly use English. Tourist-facing roles often require English.',
    credentialRecognition: 'EU qualifications benefit from mutual recognition. DOATAP recognises foreign academic titles. Process can be lengthy.',
    remoteEnvironment: 'Greece introduced a Digital Nomad Visa in 2021. Athens co-working scene is growing. Island co-working exists but is limited. Internet quality is good in urban areas, patchy on smaller islands.',
    networkingGroups: 'Athens Startups, Internations Athens, Digital Nomads Greece, ELLAda (tech community).',
    disclaimer: 'Employment information is for research. Confirm requirements with DYPA and relevant employers.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'ELSTAT · DYPA · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  healthcare: {
    publicSystem: 'The ESY (National Health System) provides public healthcare. Quality varies significantly between Athens/Thessaloniki and rural/island areas. Long waits and underfunding are documented issues.',
    privateSystem: 'Private clinics and hospitals are well-regarded, particularly in Athens. IASO, Metropolitan, and Hygeia are major private hospital groups.',
    eligibility: 'Legal residents can access the ESY. AMKA (social security number) is required for registration.',
    insuranceRequirement: 'Digital Nomad Visa requires proof of private health insurance. Expats generally use private insurance for quality and speed.',
    emergencyCare: 'Emergency care (EKAB) available. EU EHIC valid for visitors. Island emergency care capacity is limited — air evacuation may be required for serious cases.',
    primaryCare: 'Primary care through public health centres (Kentro Ygeias) or private GPs.',
    prescriptions: 'Subsidised for AMKA holders through the ESY. Private prescriptions at pharmacies are straightforward.',
    mentalHealth: 'Limited public mental health resources. Private English-speaking therapists available in Athens. Telehealth growing.',
    estimatedInsuranceRange: '€60–€200/month for an individual, depending on age and coverage.',
    accessibilityNotes: 'Urban areas are improving accessibility infrastructure. Island cobblestones and hilly terrain present challenges. New public buildings meet EU standards.',
    disclaimer: 'Confirm eligibility with EOPYY (National Organisation for Healthcare Services Provision) and your insurer.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'EOPYY · Ministry of Health Greece · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  education: {
    publicSchools: 'Free for legal residents. Instruction in Greek. Quality varies by region.',
    privateSchools: 'Available in Athens and Thessaloniki. Fees typically €200–€600/month.',
    internationalSchools: 'Athens College, Campion School Athens, and several others. Fees €6,000–€16,000/year.',
    languageOfInstruction: 'Greek in public schools. English-medium and bilingual private schools available in Athens.',
    enrollment: 'EU/EEA children have equal rights. Non-EU children with legal residence can enrol.',
    specialEducation: 'Available through the public system — quality and availability vary.',
    childcare: 'Municipal crèches and private nurseries. Costs typically €200–€500/month.',
    universities: 'National and Kapodistrian University of Athens, Aristotle University of Thessaloniki. Growing English-language postgraduate programmes.',
    studyPathways: 'Student visa for non-EU students. EU students on national terms.',
    tuitionRange: 'Public: largely free for EU students. Postgrad fees vary. Private: €3,000–€10,000/year.',
    disclaimer: 'Confirm enrollment and fees with institutions and the Ministry of Education.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Ministry of Education Greece · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  transportation: {
    publicTransit: 'Athens has metro, tram, bus, and suburban rail. Unified ticket system. Monthly pass ~€30. Thessaloniki is primarily bus-dependent.',
    walkability: 'Athens city centre is walkable in many areas. Island towns are highly walkable within the centre. Rural areas require a car.',
    rail: 'Hellenic Train (formerly TrainOSE) operates mainland rail. Athens–Thessaloniki ~4.5 hours. Network is limited outside main routes.',
    domesticTravel: 'Domestic flights (Olympic Air, Aegean Airlines) connect Athens to islands and northern Greece. Ferry network is extensive for island travel.',
    internationalConnections: 'Athens Eleftherios Venizelos (ATH) is the main hub. Aegean Airlines and European low-cost carriers provide excellent connections.',
    carOwnership: 'Essential outside central Athens and Thessaloniki. Required on most islands. Traffic in central Athens is heavy.',
    driverLicenseConversion: 'EU licenses valid. Non-EU licenses must be exchanged via the local Transport Authority (KTEo). Confirm reciprocal agreements.',
    rideshare: 'Uber and Beat operate in Athens. Traditional taxis are regulated.',
    cycling: 'Limited cycling infrastructure. Some shared-bike schemes in Athens. Hilly terrain in many areas.',
    accessibility: 'Improving in central Athens. Cobblestones and terrain present challenges. Metro is generally accessible.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Hellenic Train · OASA · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  legalTaxes: {
    taxResidency: 'Tax resident if spending more than 183 days per year in Greece, or if primary household is in Greece.',
    incomeTax: 'Progressive rates from 9% to 44%. Greece offers a flat-rate tax option for qualifying new tax residents (€100,000/year, 15-year regime) and a 50% income-tax exemption for new workers in some categories. Confirm current rules.',
    socialSecurity: 'Employee: ~14–16%. Employer: ~22–24%. Self-employed pay the EFKA self-employed contribution scale.',
    doubleTaxationTreaties: 'Greece has treaties with the US, UK, and many others. Determine which applies to your situation.',
    banking: 'Major banks: Alpha Bank, Eurobank, National Bank of Greece, Piraeus Bank. AMKA and AFM (tax ID) required. Fintech alternatives are widely used.',
    foreignAccountReporting: 'US citizens subject to FBAR/FATCA. Consult a US-qualified expat tax professional.',
    driverLicenseRules: 'See Transportation tab. KTEo handles exchanges.',
    residencyObligations: 'Visa and permit renewal required at the Immigration Directorate (Tmima Allodapon).',
    propertyOwnership: 'No general restrictions for EU citizens. Non-EU buyers may face restrictions in border zones. Transfer tax (FMA) typically 3.09%. Annual ENFIA property tax applies.',
    businessRegistration: 'Company registration via GEMI (General Electronic Commercial Registry). Confirm tax obligations.',
    disclaimer: 'Not legal or tax advice. Confirm with a Greek accountant (logistis) or lawyer.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'AADE · Immigration Directorate · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  dailyLife: {
    groceryShopping: 'AB Vassilopoulos, Sklavenitis, Lidl, and local laiki (street markets) are the main options. Fresh produce is excellent and affordable.',
    dining: 'Eating out is a central part of Greek life. Tavernas offer affordable, generous meals (€10–€20/person). Athens and Thessaloniki have diverse food scenes.',
    internet: 'Fibre expanding rapidly. COSMOTE, Vodafone Greece, Nova. Urban broadband 100–500 Mbps from ~€25–€45/month. Islands can be slower.',
    mobile: 'COSMOTE, Vodafone, Wind. Unlimited data plans from ~€15–€35/month.',
    weather: 'Mediterranean climate. Hot, dry summers (30–38°C). Mild winters in southern Greece (8–16°C). Islands are cooler with sea breeze. Northern Greece has colder winters.',
    holidays: '12 public holidays including Orthodox Easter (major), Independence Day, Ochi Day (October 28), and Christmas.',
    culturalEtiquette: 'Warm and hospitable. Philoxenia (hospitality to strangers) is a cultural value. Meals are social events — expect long, leisurely dining. Punctuality is flexible in social settings but expected professionally.',
    safety: 'Generally safe. Athens petty theft in tourist areas (Monastiraki, Omonia) is the main concern. Violent crime is rare. Islands are very safe.',
    paceOfLife: 'Relaxed, especially outside Athens. Summers are festive and social. The Greek concept of kefi (joy, high spirits) shapes social interaction.',
    recreation: 'Beaches, island-hopping, hiking (Mount Olympus, Samaria Gorge), archaeology, food and wine, sailing, diving.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  familyPets: {
    childcare: 'Municipal crèches and private nurseries. Public places are subsidised but limited. Private nurseries: €200–€500/month.',
    familyBenefits: 'Child benefits through OPEKA for qualifying residents. Confirm eligibility with OPEKA.',
    parentalLeave: 'Statutory parental leave for employees under Greek Labour Law. Confirm details with EFKA.',
    childrenHealthcare: 'Children can access the ESY as residents. Paediatric care available.',
    petImportRules: 'EU Pet Passport for EU arrivals. Non-EU pets need an EU-format health certificate, microchip, and rabies vaccination.',
    quarantine: 'No quarantine for EU pet passport holders. Check MINAGRIC for non-EU rules.',
    vetCare: 'Widely available in urban areas. Quality is generally good. Emergency vet services in major cities.',
    petFriendlyHousing: 'Landlord consent required. Dog-friendly beaches exist in some areas — seasonal restrictions apply.',
    multigenerational: 'Family is central to Greek life. Multigenerational living is very common. Yiayia (grandmother) culture is strong — family networks often provide childcare.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'MINAGRIC · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  greenbook: {
    communityFit: 'Greece has a growing international community, especially in Athens and on popular islands. Outside tourist areas, communities are predominantly Greek.',
    blackDiaspora: 'The Black community in Greece is small. African and Afro-Caribbean communities exist primarily in Athens. Experiences of racism and discrimination have been documented, particularly in employment and in some public spaces. Racism is formally illegal but enforcement is inconsistent. ENAR Greece monitors and reports on racial discrimination.',
    lgbtq: 'Greece legally recognises same-sex civil unions (since 2015). Same-sex marriage was legalised in February 2024. Athens has a visible LGBTQ+ scene (Athens Pride in June). Public acceptance varies significantly between urban and rural areas and between generations.',
    womenSafety: 'Generally safe. Street harassment exists, more commonly in some tourist areas. KETHI (Research Centre for Gender Equality) supports women\'s rights.',
    faithCommunities: 'Greek Orthodox Christianity is deeply embedded culturally. Jewish communities (Thessaloniki has a historic Jewish heritage). Muslim communities (particularly in Thrace). Catholic and Protestant churches in Athens.',
    disabilityAccess: 'Improving but uneven. Urban areas and new infrastructure are more accessible. Historic sites and island paths present significant challenges.',
    culturalBelonging: 'Greeks are warm and welcoming, though the community can take time to fully integrate newcomers. Learning basic Greek phrases is greatly appreciated. The expat community in Athens and on popular islands is active.',
    neighborhoodInsights: 'Athens (Kolonaki: upscale, central; Koukaki: gentrifying, expat-friendly; Exarcheia: bohemian, edgy; Glyfada: coastal, affluent). Thessaloniki (city centre, Kalamaria). Chania: charming old town, expat retiree community.',
    communityOrgs: [
      { name: 'Internations Athens', description: 'Expat community events and networking in Athens.', url: 'https://www.internations.org/athens-expats' },
      { name: 'Athens Pride', description: 'Annual LGBTQ+ pride event in Athens.', url: 'https://athenspride.eu' },
      { name: 'ENAR Greece', description: 'European Network Against Racism — Greece chapter.', url: 'https://www.enargreece.gr' },
    ],
    disclaimer: 'Greenbook insights combine editorial research and community-reported experiences. Individual experiences vary. Not universal statements of fact.',
  },
  resources: [
    { title: 'Immigration Directorate Greece', organization: 'Greek Ministry of Migration and Asylum', description: 'Residence permits, visa types, and immigration procedures.', type: 'official', url: 'https://migration.gov.gr', lastChecked: '2026-01-01', category: 'immigration' },
    { title: 'Greek Digital Nomad Visa', organization: 'Enterprise Greece', description: 'Official information on the Digital Nomad Visa for remote workers.', type: 'official', url: 'https://www.enterprisegreece.gov.gr/en/doing-business/setting-up-a-business/digital-nomad-visa', lastChecked: '2026-01-01', category: 'immigration' },
    { title: 'US Embassy Athens', organization: 'U.S. Department of State', description: 'US consular services and American Citizen Services in Greece.', type: 'official', url: 'https://gr.usembassy.gov', lastChecked: '2026-01-01', category: 'embassy' },
    { title: 'AADE — Greek Tax Authority', organization: 'Independent Authority for Public Revenue', description: 'Tax registration (AFM), filings, and Greek tax information.', type: 'official', url: 'https://www.aade.gr', lastChecked: '2026-01-01', category: 'taxes' },
    { title: 'ELSTAT — Statistics Greece', organization: 'Hellenic Statistical Authority', description: 'Official statistics: demographics, wages, and economic data.', type: 'official', url: 'https://www.statistics.gr', lastChecked: '2026-01-01', category: 'statistics' },
    { title: 'EOPYY — Healthcare organisation', organization: 'National Organisation for Healthcare Services Provision', description: 'Public healthcare eligibility and AMKA registration information.', type: 'official', url: 'https://www.eopyy.gov.gr', lastChecked: '2026-01-01', category: 'healthcare' },
    { title: 'Spitogatos — Property portal', organization: 'Spitogatos', description: 'Greece\'s leading property portal for rentals and sales.', type: 'community', url: 'https://www.spitogatos.gr', lastChecked: '2026-01-01', category: 'housing' },
    { title: 'DYPA — Public employment service', organization: 'DYPA', description: 'Job search and public employment services in Greece.', type: 'official', url: 'https://www.dypa.gov.gr', lastChecked: '2026-01-01', category: 'employment' },
    { title: 'Hellenic Train', organization: 'Hellenic Train', description: 'Rail schedules and tickets in Greece.', type: 'official', url: 'https://www.hellenictrain.gr', lastChecked: '2026-01-01', category: 'transportation' },
  ],
}

// ─── Estonia ─────────────────────────────────────────────────────────────────

const estonia: CountryContent = {
  slug: 'estonia',
  economic: {
    gdpPerCapita: { value: '~$31,000 USD (nominal)', source: 'World Bank', period: '2023', lastVerified: '2026-01-01', status: 'official_source_verified' },
    growthTrend: { value: '~-1.3% (contraction in 2023)', source: 'Statistics Estonia', period: '2023', lastVerified: '2026-01-01', status: 'official_source_verified' },
    inflation: { value: '~4.5% annual CPI', source: 'Statistics Estonia / Eurostat', period: '2024', lastVerified: '2026-01-01', status: 'official_source_verified' },
    unemployment: { value: '~7.6%', source: 'Statistics Estonia / Eurostat', period: '2024', lastVerified: '2026-01-01', status: 'official_source_verified' },
    avgMonthlyWage: { value: '~€1,900–€2,300 gross', source: 'Statistics Estonia', period: '2023', lastVerified: '2026-01-01', status: 'editorially_reviewed' },
    minimumWage: { value: '€820/month (2024)', source: 'Ministry of Finance Estonia', period: '2024', lastVerified: '2026-01-01', status: 'official_source_verified' },
    topIndustries: ['Information technology', 'Manufacturing & engineering', 'Logistics & transit', 'Finance & fintech', 'Tourism', 'Agriculture & food'],
    growingSectors: ['Cybersecurity', 'SaaS & tech startups', 'Green energy', 'E-governance & GovTech', 'Healthcare IT'],
    personalInterpretation: 'Estonia has the most advanced digital infrastructure in Europe — nearly all government services are online. Tallinn has a vibrant startup and tech ecosystem. Local wages are rising but still below Western European averages. A remote income of $4,000–$5,000/mo provides very comfortable living in Tallinn. Winters are cold and dark — a real lifestyle consideration.',
    disclaimer: 'Figures are research summaries from official sources. Confirm with Statistics Estonia, Bank of Estonia, and the Ministry of Finance.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'World Bank · Statistics Estonia · Ministry of Finance Estonia (2023–2024)', status: 'official_source_verified' as const },
  },
  costOfLiving: {
    currency: 'EUR',
    categories: [
      { label: 'Housing', soloLow: 650, soloHigh: 1100, familyLow: 950, familyHigh: 1700, currency: 'EUR', notes: 'Factor in higher heating costs in winter.' },
      { label: 'Food & groceries', soloLow: 200, soloHigh: 350, familyLow: 380, familyHigh: 600, currency: 'EUR' },
      { label: 'Dining out', soloLow: 120, soloHigh: 250, familyLow: 220, familyHigh: 400, currency: 'EUR', notes: 'Lunch specials ~€7–€12.' },
      { label: 'Transportation', soloLow: 0, soloHigh: 80, familyLow: 0, familyHigh: 160, currency: 'EUR', notes: 'Free public transport for Tallinn registered residents.' },
      { label: 'Healthcare (private)', soloLow: 40, soloHigh: 120, familyLow: 80, familyHigh: 220, currency: 'EUR' },
      { label: 'Internet & mobile', soloLow: 25, soloHigh: 50, familyLow: 25, familyHigh: 50, currency: 'EUR' },
      { label: 'Utilities (inc. heating)', soloLow: 80, soloHigh: 200, familyLow: 130, familyHigh: 300, currency: 'EUR', notes: 'Heating costs are significant October–April.' },
      { label: 'Entertainment & recreation', soloLow: 80, soloHigh: 200, familyLow: 150, familyHigh: 350, currency: 'EUR' },
      { label: 'Emergency buffer (10%)', soloLow: 120, soloHigh: 235, familyLow: 194, familyHigh: 378, currency: 'EUR' },
    ],
    soloTotal: { low: 1315, high: 2585 },
    familyTotal: { low: 2129, high: 4158 },
    topCity: 'Tallinn',
    budgetCities: ['Tartu', 'Pärnu', 'Narva'],
    disclaimer: 'Cost estimates are editorial planning ranges. Winter utility costs are a significant variable. Not a financial forecast.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'KV.ee · Numbeo · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  housing: {
    rentalRanges: [
      { city: 'Tallinn (central / Kesklinn)', studioMin: 700, studioMax: 1100, twoBedMin: 1000, twoBedMax: 1700, currency: 'EUR' },
      { city: 'Tallinn (outer districts)', studioMin: 500, studioMax: 800, twoBedMin: 750, twoBedMax: 1200, currency: 'EUR' },
      { city: 'Tartu', studioMin: 400, studioMax: 650, twoBedMin: 600, twoBedMax: 950, currency: 'EUR' },
    ],
    depositMonths: 'Typically 2 months rent.',
    furnished: 'Furnished rentals are common for expats and digital nomads. Unfurnished for long-term.',
    leaseDuration: 'Flexible — 6-month and 1-year leases common. Minimum terms apply under the Law of Obligations Act.',
    tenantRights: 'Tenant rights under the Law of Obligations Act. Landlords must provide proper notice before termination. Dispute resolution available through courts.',
    foreignBuyerRules: 'EU citizens can purchase freely. Non-EU buyers need government approval for land purchases in some cases. Apartment ownership is generally unrestricted.',
    popularAreas: ['Tallinn (Kesklinn/Old Town, Kalamaja, Kadriorg, Ülemiste City area)', 'Tallinn (Pirita: coastal, quieter)', 'Tartu (university town, growing tech hub)'],
    portals: [
      { name: 'City24.ee', url: 'https://www.city24.ee' },
      { name: 'KV.ee', url: 'https://www.kv.ee' },
    ],
    notes: 'Tallinn rents have risen sharply since 2022. Kalamaja and Telliskivi are popular creative-class neighbourhoods. Utility costs (heating) are significant in winter — factor this into monthly budget planning.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'KV.ee · City24.ee · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  employment: {
    topSectors: ['Information technology', 'Fintech & startups', 'Manufacturing', 'Logistics', 'Education', 'Public sector'],
    jobBoards: [
      { name: 'CV.ee', url: 'https://www.cv.ee' },
      { name: 'LinkedIn Estonia', url: 'https://www.linkedin.com/jobs/estonia-jobs' },
      { name: 'Work in Estonia', url: 'https://www.workinestonia.com' },
    ],
    avgSalaryRange: '€20,000–€40,000 gross/year in most sectors. Tech professionals can earn €50,000–€90,000+. Estonia is home to more unicorn startups per capita than almost any country.',
    workCulture: 'Flat hierarchies, direct communication, and high autonomy. Work-life balance is genuinely valued. Digital-first — paper bureaucracy is almost non-existent. Remote-friendly culture is deeply embedded.',
    languageExpectation: 'Estonian is the official language. English is widely spoken in tech, startups, and Tallinn generally. Russian is a second community language. Most professional roles in tech use English.',
    credentialRecognition: 'EU qualifications recognised. Foreign credentials assessed by ENIC/NARIC Estonia (Archimedes).',
    remoteEnvironment: 'Estonia pioneered the Digital Nomad Visa (launched 2020) and e-Residency. Co-working spaces are well-established in Tallinn. Excellent digital infrastructure.',
    networkingGroups: 'Startup Estonia, Tehnopol, Garage48, Internations Tallinn, Women in Tech Estonia.',
    disclaimer: 'Confirm employment requirements with EURES Estonia and relevant employers.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Statistics Estonia · Work in Estonia · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  healthcare: {
    publicSystem: 'Universal healthcare via the Estonian Health Insurance Fund (EHIF / Haigekassa). High quality relative to cost. Wait times for specialists exist but are manageable.',
    privateSystem: 'Private clinics available in Tallinn for faster access and English-speaking doctors. Costs are moderate.',
    eligibility: 'Employees and their dependants are covered via social tax contributions. Self-employed and others can join voluntarily. Registration requires a personal ID code.',
    insuranceRequirement: 'Digital Nomad Visa requires proof of private health insurance. Long-term residents usually access the EHIF.',
    emergencyCare: 'Emergency services (112) are available nationally. Quality in Tallinn is excellent.',
    primaryCare: 'Family doctors (perearstid) are the entry point. Registration required. Wait times vary.',
    prescriptions: 'Subsidised prescriptions for EHIF members. Pharmacies (apteek) are widespread.',
    mentalHealth: 'Growing mental health sector. English-speaking therapists available in Tallinn. Telehealth is well-developed.',
    estimatedInsuranceRange: '€50–€150/month for an individual, depending on coverage.',
    accessibilityNotes: 'Tallinn\'s old town cobblestones present challenges. Modern areas and public transport are generally accessible.',
    disclaimer: 'Confirm eligibility with the Estonian Health Insurance Fund (Haigekassa) and your insurer.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Haigekassa · Ministry of Social Affairs Estonia · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  education: {
    publicSchools: 'Free, high-quality public schooling. Estonia ranks among the top globally in PISA scores. Instruction in Estonian (Russian-language schools phasing out). Strong STEM focus.',
    privateSchools: 'Limited but available in Tallinn.',
    internationalSchools: 'International School of Estonia (IB), Tallinn English College.',
    languageOfInstruction: 'Estonian in public schools. International schools use English.',
    enrollment: 'EU/EEA children have equal rights. Non-EU children with legal residence can enrol.',
    specialEducation: 'Integrated into the public system. Quality is good relative to European averages.',
    childcare: 'Municipal crèches (lapsehoid) — subsidised. Waiting lists in popular areas. Private nurseries from ~€200–€500/month.',
    universities: 'University of Tartu (oldest and highest-ranked), Tallinn University of Technology (TalTech), Tallinn University. Growing English-language programmes.',
    studyPathways: 'Student visa for non-EU students. EU students on national terms.',
    tuitionRange: 'Public: free or low-cost for EU students in Estonian-language programmes. English programmes typically €1,660–€4,000/year. Private: varies.',
    disclaimer: 'Confirm enrollment and fees with institutions and the Estonian Ministry of Education.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Ministry of Education Estonia · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  transportation: {
    publicTransit: 'Tallinn has free public transport for registered residents (trams, buses, trolleybuses). One of the best transit-per-cost ratios in Europe.',
    walkability: 'Tallinn\'s old town and Kesklinn are walkable. Modern districts and suburbs are more car-dependent.',
    rail: 'Elron operates domestic rail between Tallinn, Tartu, Narva, Pärnu. Services are reliable and affordable.',
    domesticTravel: 'Rail and bus are the main intercity options. Lux Express and Flixbus serve major routes.',
    internationalConnections: 'Tallinn Airport (TLL) connects to major European hubs. Regular ferries to Helsinki (2.5h) and Stockholm.',
    carOwnership: 'Useful but not essential in Tallinn. Required in rural areas.',
    driverLicenseConversion: 'EU licenses valid. Non-EU licenses exchanged via the Transport Administration (Transpordiamet). Some reciprocal agreements.',
    rideshare: 'Bolt (founded in Estonia) dominates. Uber also operates. Taxis regulated.',
    cycling: 'Tallinn has a growing cycling network. City bike-sharing (Tartu and Tallinn). Terrain is flat — cycling-friendly.',
    accessibility: 'Modern Tallinn infrastructure is accessible. Old Town is challenging due to cobblestones and hills.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Elron · Tallinn city transport · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  legalTaxes: {
    taxResidency: 'Tax resident if you have a permanent home in Estonia or spend more than 183 days in a 12-month period.',
    incomeTax: 'Flat 20% income tax rate (one of the simplest in the EU). Dividend income from Estonian companies may be taxed differently — e-Residency has specific rules. Flat rate increasing to 22% from 2025; verify.',
    socialSecurity: 'Social tax: 33% paid by employer. Unemployment: 1.6% employee / 0.8% employer. Funded healthcare and pensions.',
    doubleTaxationTreaties: 'Estonia has a wide treaty network including the US, UK, and most EU countries.',
    banking: 'LHV (local, well-regarded for startups), SEB, Swedbank, Luminor. Strong fintech ecosystem — Wise, Revolut founded nearby. Banking is very digital.',
    foreignAccountReporting: 'US citizens subject to FBAR/FATCA. Consult a US expat tax professional.',
    driverLicenseRules: 'See Transportation tab. Transpordiamet handles conversions.',
    residencyObligations: 'Digital Nomad Visa is valid up to 1 year. Long-term residence via work, study, or family routes.',
    propertyOwnership: 'Generally available to EU citizens. Restrictions on land for non-EU buyers in some areas.',
    businessRegistration: 'Estonia\'s e-Residency allows non-residents to register and manage an EU company online. Company formation is fast (online, 1 day) via the Business Register.',
    disclaimer: 'Not legal or tax advice. Confirm with a licensed Estonian accountant or lawyer. E-Residency tax obligations depend on substance rules — get specific advice.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'EMTA · PPA · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  dailyLife: {
    groceryShopping: 'Rimi, Maxima, Prisma, Selver are the main chains. Locally grown food is available at farmers markets. Food costs are moderate by European standards.',
    dining: 'Good restaurant scene in Tallinn. Estonian cuisine is hearty — rye bread, black pudding, smoked fish. International food widely available. Lunch specials are a cultural institution (~€7–€12).',
    internet: 'Among the fastest and most reliable in Europe. Fixed broadband 100–1,000 Mbps from ~€15–€30/month. Near-universal mobile coverage.',
    mobile: 'Telia, Elisa, Tele2. Unlimited data plans from ~€15–€25/month. 5G in Tallinn and Tartu.',
    weather: 'Continental and northern maritime. Cold, dark winters (−15°C to 0°C). Mild, sunny summers (18–25°C). Long days in June, very short days in December.',
    holidays: '12 public holidays. Estonian National Day (Feb 24), Jaanipäev (Midsummer, Jun 24) is the biggest celebration, Song and Dance Festival (every 5 years).',
    culturalEtiquette: 'Reserved initially but warm once trust is established. Punctuality is valued. Silence is comfortable — not rude. Sauna culture is deeply embedded (Estonians hold it sacred). Direct communication is preferred.',
    safety: 'One of the safest countries in Europe. Low violent crime. Tallinn old town has pickpocket risk in tourist season.',
    paceOfLife: 'Efficient and digital-first. Bureaucracy is almost entirely online. Work-life balance matters. Nature is very accessible — forests, coastline, and islands within short drives.',
    recreation: 'Hiking, cycling, sauna culture, skiing (cross-country), bog walks, island trips (Saaremaa, Hiiumaa), music festivals, and a vibrant Tallinn cultural scene.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  familyPets: {
    childcare: 'Municipal crèches — free or subsidised for residents. Waiting lists in Tallinn. Private nurseries ~€200–€450/month.',
    familyBenefits: 'Generous state family benefits including parental allowance (up to 100% of previous salary for 18 months). Child benefit paid for each child. Confirm eligibility with the Social Insurance Board (SMIT).',
    parentalLeave: 'Among the most generous in Europe. Up to 18 months fully paid for one parent, shareable between parents.',
    childrenHealthcare: 'Children covered under EHIF. Paediatric care available.',
    petImportRules: 'EU Pet Passport for EU arrivals. Non-EU pets need EU-format health certificate, microchip, and rabies vaccination.',
    quarantine: 'No quarantine for EU pet passport holders.',
    vetCare: 'Good quality veterinary care in Tallinn and Tartu.',
    petFriendlyHousing: 'Landlord consent required. Dog-friendly parks and forests are abundant.',
    multigenerational: 'Nuclear family model more common than in Southern Europe. Elder care is increasingly institutionalised or through home-care services.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  greenbook: {
    communityFit: 'Tallinn has a growing international expat and digital nomad community. The tech and startup scene is multicultural. Outside Tallinn, communities are predominantly Estonian or Russian-speaking.',
    blackDiaspora: 'The Black community in Estonia is very small. Experiences of racism and curious staring have been reported, particularly outside Tallinn. Overt racism is illegal but cultural homogeneity means visibility as a person of colour can bring unwanted attention. The tech community in Tallinn is more diverse and internationally minded.',
    lgbtq: 'Estonia was the first former Soviet state to legalise same-sex marriage (effective January 2024). Tallinn has a growing LGBTQ+ scene. Baltic Pride is held in rotating Baltic capitals. Public attitudes are mixed — Tallinn is more progressive than rural areas.',
    womenSafety: 'Estonia ranks well on gender equality. Tallinn is generally safe. The Gender Equality and Equal Treatment Commissioner handles complaints.',
    faithCommunities: 'Lutheran and Orthodox Christian communities. Small Jewish, Muslim, and Buddhist communities in Tallinn.',
    disabilityAccess: 'Improving accessibility in modern Tallinn. Old Town cobblestones and hills are challenging. Public transport is gradually becoming more accessible.',
    culturalBelonging: 'Estonians can seem reserved at first. Learning basic Estonian phrases is appreciated. The international tech community in Tallinn makes integration easier for remote workers.',
    neighborhoodInsights: 'Tallinn (Kesklinn: central, cosmopolitan; Kalamaja: creative, gentrified; Kadriorg: park setting, beautiful; Ülemiste: near tech park and airport; Pirita: coastal, quiet). Tartu: university town, younger demographic, lower cost.',
    communityOrgs: [
      { name: 'Internations Tallinn', description: 'Expat community events and networking in Tallinn.', url: 'https://www.internations.org/tallinn-expats' },
      { name: 'Startup Estonia', description: 'Startup community resources and networking.', url: 'https://www.startupestonia.ee' },
      { name: 'Estonian LGBTQ+ Association', description: 'LGBTQ+ community and rights organisation.', url: 'https://www.ega.ee' },
    ],
    disclaimer: 'Greenbook insights combine editorial research and community-reported experiences. Individual experiences vary. Not universal statements of fact.',
  },
  resources: [
    { title: 'Estonian Police and Border Guard — Visa and residence', organization: 'Police and Border Guard Board (PPA)', description: 'Residence permits, Digital Nomad Visa, and immigration procedures.', type: 'official', url: 'https://www.politsei.ee/en/', lastChecked: '2026-01-01', category: 'immigration' },
    { title: 'Work in Estonia', organization: 'Enterprise Estonia', description: 'Official guide to working, relocating, and building a career in Estonia.', type: 'official', url: 'https://www.workinestonia.com', lastChecked: '2026-01-01', category: 'immigration' },
    { title: 'US Embassy Tallinn', organization: 'U.S. Department of State', description: 'US consular services in Estonia.', type: 'official', url: 'https://ee.usembassy.gov', lastChecked: '2026-01-01', category: 'embassy' },
    { title: 'Estonian Tax and Customs Board (EMTA)', organization: 'EMTA', description: 'Tax registration, filing, and e-Residency tax information.', type: 'official', url: 'https://www.emta.ee/en', lastChecked: '2026-01-01', category: 'taxes' },
    { title: 'Statistics Estonia', organization: 'Statistics Estonia', description: 'Official national statistics: wages, demographics, economic data.', type: 'official', url: 'https://www.stat.ee/en', lastChecked: '2026-01-01', category: 'statistics' },
    { title: 'Haigekassa — Estonian Health Insurance Fund', organization: 'EHIF', description: 'Public healthcare eligibility, registration, and covered services.', type: 'official', url: 'https://www.haigekassa.ee/en', lastChecked: '2026-01-01', category: 'healthcare' },
    { title: 'KV.ee — Property portal', organization: 'KV.ee', description: 'Largest Estonian property portal for rentals and sales.', type: 'community', url: 'https://www.kv.ee', lastChecked: '2026-01-01', category: 'housing' },
    { title: 'CV.ee — Job search', organization: 'CV.ee', description: 'Estonia\'s leading job board.', type: 'community', url: 'https://www.cv.ee', lastChecked: '2026-01-01', category: 'employment' },
    { title: 'Elron — Estonian rail', organization: 'Elron', description: 'Rail schedules and tickets between Estonian cities.', type: 'official', url: 'https://elron.ee/en', lastChecked: '2026-01-01', category: 'transportation' },
    { title: 'e-Residency programme', organization: 'Enterprise Estonia', description: 'Estonia\'s digital residency programme for non-resident entrepreneurs.', type: 'official', url: 'https://www.e-resident.gov.ee', lastChecked: '2026-01-01', category: 'community' },
  ],
}

// ─── Mexico ──────────────────────────────────────────────────────────────────

const mexico: CountryContent = {
  slug: 'mexico',
  economic: {
    gdpPerCapita: { value: '~$11,500 USD (nominal)', source: 'World Bank', period: '2023', lastVerified: '2026-01-01', status: 'official_source_verified' },
    growthTrend: { value: '~3.2% real GDP growth', source: 'INEGI', period: '2023', lastVerified: '2026-01-01', status: 'official_source_verified' },
    inflation: { value: '~4.7% annual CPI', source: 'INEGI / Banxico', period: '2024', lastVerified: '2026-01-01', status: 'official_source_verified' },
    unemployment: { value: '~2.8% (formal sector; informal employment is extensive)', source: 'INEGI', period: '2024', lastVerified: '2026-01-01', status: 'official_source_verified' },
    avgMonthlyWage: { value: '~$600–$900 USD equivalent (formal sector)', source: 'INEGI', period: '2023', lastVerified: '2026-01-01', status: 'editorially_reviewed' },
    minimumWage: { value: '~$3.30 USD/day (2024 general minimum); border zone higher', source: 'CONASAMI', period: '2024', lastVerified: '2026-01-01', status: 'official_source_verified' },
    topIndustries: ['Manufacturing & nearshoring', 'Tourism & hospitality', 'Agriculture & food exports', 'Oil & gas', 'Retail & commerce', 'Technology'],
    growingSectors: ['Nearshoring (driven by US supply chain)', 'Fintech', 'Tech startups', 'Renewable energy', 'E-commerce & logistics'],
    personalInterpretation: 'Mexico offers exceptional purchasing power for foreign-income earners. A remote income of $1,500–$2,500/mo provides a comfortable to excellent lifestyle in most Mexican cities. Mexico City (CDMX), Guadalajara, Mérida, Puerto Vallarta, and Oaxaca have established expat communities. Safety varies dramatically by city and neighbourhood — research your specific destination carefully.',
    disclaimer: 'Figures are research summaries from official sources. Confirm with INEGI, Banxico, and the Secretaría de Hacienda.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'World Bank · INEGI · CONASAMI (2023–2024)', status: 'official_source_verified' as const },
  },
  costOfLiving: {
    currency: 'USD',
    categories: [
      { label: 'Housing', soloLow: 500, soloHigh: 1100, familyLow: 700, familyHigh: 1600, currency: 'USD', notes: 'CDMX Roma/Condesa is more expensive; Mérida and Oaxaca are excellent value.' },
      { label: 'Food & groceries', soloLow: 150, soloHigh: 300, familyLow: 280, familyHigh: 500, currency: 'USD', notes: 'Local mercados offer incredible variety at very low cost.' },
      { label: 'Dining out', soloLow: 100, soloHigh: 300, familyLow: 200, familyHigh: 500, currency: 'USD', notes: 'Street food ~$1–$3; sit-down $8–$20/person.' },
      { label: 'Transportation', soloLow: 30, soloHigh: 80, familyLow: 60, familyHigh: 150, currency: 'USD', notes: 'CDMX metro ~$0.30/ride; Uber widely used.' },
      { label: 'Healthcare (private)', soloLow: 50, soloHigh: 130, familyLow: 100, familyHigh: 250, currency: 'USD', notes: 'Very affordable private care; GP visits ~$20–$60.' },
      { label: 'Internet & mobile', soloLow: 30, soloHigh: 60, familyLow: 30, familyHigh: 60, currency: 'USD' },
      { label: 'Utilities', soloLow: 50, soloHigh: 100, familyLow: 80, familyHigh: 150, currency: 'USD' },
      { label: 'Entertainment & recreation', soloLow: 80, soloHigh: 200, familyLow: 150, familyHigh: 350, currency: 'USD' },
      { label: 'Emergency buffer (10%)', soloLow: 100, soloHigh: 227, familyLow: 160, familyHigh: 356, currency: 'USD' },
    ],
    soloTotal: { low: 1090, high: 2497 },
    familyTotal: { low: 1760, high: 3916 },
    topCity: 'Mexico City',
    budgetCities: ['Mérida', 'Oaxaca', 'Guanajuato', 'San Cristóbal de las Casas', 'Puebla'],
    disclaimer: 'Cost estimates are editorial planning ranges in USD equivalents. Peso exchange rates affect real costs — USD earners benefit significantly. Safety context varies by city. Not a financial forecast.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Numbeo · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  housing: {
    rentalRanges: [
      { city: 'Mexico City (Roma/Condesa)', studioMin: 700, studioMax: 1200, twoBedMin: 1100, twoBedMax: 1900, currency: 'USD' },
      { city: 'Mexico City (other colonias)', studioMin: 400, studioMax: 800, twoBedMin: 600, twoBedMax: 1200, currency: 'USD' },
      { city: 'Playa del Carmen', studioMin: 500, studioMax: 900, twoBedMin: 800, twoBedMax: 1500, currency: 'USD' },
      { city: 'Puerto Vallarta', studioMin: 500, studioMax: 900, twoBedMin: 700, twoBedMax: 1400, currency: 'USD' },
      { city: 'Mérida', studioMin: 350, studioMax: 600, twoBedMin: 500, twoBedMax: 900, currency: 'USD' },
      { city: 'Oaxaca city', studioMin: 300, studioMax: 600, twoBedMin: 500, twoBedMax: 900, currency: 'USD' },
    ],
    depositMonths: 'Typically 1–2 months rent, often payable in USD.',
    furnished: 'Furnished rentals are widely available and common for expats, especially in expat-popular areas.',
    leaseDuration: '6-month to 1-year leases are standard for expats. Month-to-month is possible at a premium.',
    tenantRights: 'Tenant protections under the Civil Code vary by state. Legal process required for eviction. Informal arrangements are common — get all agreements in writing.',
    foreignBuyerRules: 'Foreigners can own property directly in most areas. Property within 50km of a coast or 100km of a border requires a bank trust (fideicomiso) or Mexican corporation structure. Confirm with a local notario.',
    popularAreas: ['Mexico City (Roma Norte, Condesa, Polanco, Coyoacán)', 'Guadalajara (Chapultepec, Providencia)', 'San Miguel de Allende', 'Puerto Vallarta (Versalles, Old Town)', 'Playa del Carmen (Quinta Avenida area)', 'Mérida (Norte, García Ginerés)', 'Oaxaca city (Centro, Jalatlaco)'],
    portals: [
      { name: 'Inmuebles24', url: 'https://www.inmuebles24.com' },
      { name: 'Lamudi Mexico', url: 'https://www.lamudi.com.mx' },
      { name: 'Facebook Marketplace / local groups', url: 'https://www.facebook.com/marketplace' },
    ],
    notes: 'Rent in Mexico City\'s popular expat neighbourhoods has risen sharply due to remote-work influx. Contracts are often in pesos — USD income provides a significant advantage. Always use a notario for formal property transactions.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Inmuebles24 · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  employment: {
    topSectors: ['Technology & nearshoring', 'Tourism & hospitality', 'Manufacturing', 'Finance', 'Education', 'Creative industries'],
    jobBoards: [
      { name: 'OCC Mundial', url: 'https://www.occ.com.mx' },
      { name: 'LinkedIn Mexico', url: 'https://www.linkedin.com/jobs/mexico-jobs' },
      { name: 'Computrabajo Mexico', url: 'https://www.computrabajo.com.mx' },
    ],
    avgSalaryRange: 'MXN $10,000–$30,000/month in most sectors (roughly $600–$1,800 USD). Tech and bilingual professionals can earn significantly more.',
    workCulture: 'Relationship-driven; personal trust (confianza) is critical. Hierarchy is respected. Work hours can be long. Lunch is important. Work-life balance varies significantly by sector and employer.',
    languageExpectation: 'Spanish is required for almost all local roles. English-speaking roles exist in multinational firms, tech, and tourism. Bilingual professionals are highly valued.',
    credentialRecognition: 'Foreign credentials assessed by SEP (Secretaría de Educación Pública). Process varies by profession.',
    remoteEnvironment: 'Mexico is one of the top destinations for US and Canadian remote workers due to proximity and time zones. Fibre internet is expanding. Co-working spaces are excellent in CDMX, Guadalajara, and beach destinations.',
    networkingGroups: 'Internations Mexico City, Mexico City Tech, Expats in Mexico City (Facebook), Women in Tech Mexico.',
    disclaimer: 'Confirm employment requirements with IMSS and relevant employers. Work authorisation required for formal employment.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'INEGI · IMSS · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  healthcare: {
    publicSystem: 'IMSS (social security) and ISSSTE (public sector workers) provide public healthcare for enrolled employees. IMSS Bienestar is expanding coverage. Quality varies widely by facility and location.',
    privateSystem: 'Private healthcare in Mexico is excellent quality and very affordable by US standards. Hospital facilities in CDMX, Guadalajara, and Monterrey rival the US. Costs are typically 20–40% of US prices.',
    eligibility: 'Formal employees are enrolled in IMSS. Expats with Temporary or Permanent Residence can access IMSS voluntarily at low cost.',
    insuranceRequirement: 'Temporary Residence visa requires proof of sufficient financial means; health insurance is strongly recommended. Many expats use private insurance.',
    emergencyCare: 'Private emergency rooms (urgencias) in major cities are high quality and fast. Cruz Roja (Red Cross) for ambulances.',
    primaryCare: 'Private GPs are affordable ($20–$60 USD/visit). IMSS primary care is available to enrollees.',
    prescriptions: 'Medications are widely available at pharmacies (farmacias) at low cost, often without prescription. Farmacias Similares and Guadalajara chains are widespread.',
    mentalHealth: 'Private mental health professionals are available and affordable. English-speaking therapists available in major expat centres.',
    estimatedInsuranceRange: '$50–$150 USD/month for international health insurance covering Mexico and emergencies abroad. Local-only plans can be even lower.',
    accessibilityNotes: 'Accessibility infrastructure is improving in major cities. Historic centres and uneven footpaths present challenges. Private medical facilities are generally well-equipped.',
    disclaimer: 'Confirm eligibility with IMSS and your insurer. Healthcare quality varies significantly by city and facility.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'IMSS · Ministry of Health Mexico · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  education: {
    publicSchools: 'Free public schooling for residents. Instruction in Spanish. Quality varies significantly by state and area.',
    privateSchools: 'Private schools widely available, particularly in major cities. Fees MXN $2,000–$10,000/month.',
    internationalSchools: 'Numerous international schools in CDMX, Guadalajara, Monterrey, and expat destinations. American, British, IB, and French curriculum options. Fees typically $5,000–$20,000/year USD.',
    languageOfInstruction: 'Spanish in public schools. English-medium and bilingual private schools widely available.',
    enrollment: 'Children of legal residents can enrol in public schools.',
    specialEducation: 'Varies by school and region. Private schools often have better support.',
    childcare: 'Estancias infantiles (subsidised crèches) available. Private nurseries: MXN $3,000–$8,000/month.',
    universities: 'UNAM (top-ranked in Latin America), Tec de Monterrey (private), UAM, ITAM. Growing English-language and international programmes.',
    studyPathways: 'Student visa for non-immigrants. Confirm process with INM (Instituto Nacional de Migración).',
    tuitionRange: 'Public universities: largely free or very low cost. Tec de Monterrey: $5,000–$15,000 USD/year. International schools: vary.',
    disclaimer: 'Confirm enrollment and fees with institutions and the SEP.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'SEP · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  transportation: {
    publicTransit: 'Mexico City has an extensive metro (one of the world\'s largest and cheapest), metrobús, and light rail. Fare: MXN $5 (about $0.30 USD). Other cities: primarily bus-dependent.',
    walkability: 'Roma and Condesa in CDMX are highly walkable. San Miguel de Allende, Oaxaca, and Mérida city centres are walkable. Beach destinations vary.',
    rail: 'Limited passenger rail outside CDMX urban systems. The Tren Maya now connects Cancún, Playa del Carmen, and the Yucatán.',
    domesticTravel: 'Frequent domestic flights on Aeromexico, VivaAerobus, Volaris. Long-distance ADO and ETN buses are comfortable and affordable.',
    internationalConnections: 'Mexico City (BENITO JUÁREZ / MEX) and Cancún (CUN) are major international hubs. Excellent connections to the US and growing links to Europe.',
    carOwnership: 'Useful in many cities; essential outside urban centres and on the coast. Traffic in CDMX is severe. Uber is widely used as an alternative.',
    driverLicenseConversion: 'Foreign licenses are technically valid for the duration of your visa. Long-term residents should obtain a Mexican license — process varies by state.',
    rideshare: 'Uber is the dominant and highly trusted option. InDriver and Cabify also operate. Traditional taxis require caution — use app-based services.',
    cycling: 'Ecobici bike-sharing in CDMX. Growing cycling infrastructure in Roma, Condesa, and Polanco. Cycling is less common in most other cities.',
    accessibility: 'Uneven — improving in modern areas. CDMX metro has limited accessibility. Private cars and Uber are the most accessible transport options.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'CDMX Metro · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  legalTaxes: {
    taxResidency: 'Tax resident in Mexico if you have a home there or spend more than 183 days per year. Foreign-source income is generally taxable for residents.',
    incomeTax: 'Progressive ISR from 1.92% to 35%. Foreign-source income taxed for residents. Expats with Temporary Residence paying foreign taxes may benefit from treaty relief — confirm with a Mexican tax advisor.',
    socialSecurity: 'IMSS contributions for formal employees. Self-employed can voluntarily enrol. Informal remote workers are generally not required to contribute to Mexican social security.',
    doubleTaxationTreaties: 'Mexico has treaties with the US, UK, Canada, and many others. Determine which applies.',
    banking: 'Major banks: BBVA Mexico, Citibanamex, Santander Mexico, HSBC Mexico. Opening as a foreigner requires a valid visa (Temporary Residence recommended) and RFC (tax ID). Fintech alternatives: Nubank, Hey Banco.',
    foreignAccountReporting: 'US citizens subject to FBAR/FATCA regardless of residence. Consult a US expat tax professional.',
    driverLicenseRules: 'See Transportation tab. Process varies by state.',
    residencyObligations: 'Temporary Residence (1–4 years, renewable) through financial means or employment. Permanent Residence after 4 years or other qualifying routes. INM handles applications.',
    propertyOwnership: 'Possible via fideicomiso (bank trust) in restricted zones. Free ownership outside restricted zones. Use a licensed notario for all transactions.',
    businessRegistration: 'Possible for foreign residents. RFC required. Various corporate structures available. Confirm with a Mexican accountant or abogado.',
    disclaimer: 'Not legal or tax advice. Confirm all details with a Mexican contador público and lawyer. Rules change frequently.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'SAT · INM · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  dailyLife: {
    groceryShopping: 'Walmart, Soriana, Chedraui, Costco Mexico are main chains. Local mercados offer fresh produce, incredible variety, and low prices. Food budget: $300–$600 USD/month for a couple eating well.',
    dining: 'Eating out is exceptional value. Street tacos: $0.50–$2 USD each. Sit-down restaurants: $5–$20 USD/person. Fine dining exists at affordable prices. Mexican cuisine is UNESCO-recognised. Expat dining scenes thrive in CDMX, Puerto Vallarta, and San Miguel.',
    internet: 'Fibre expanding in major cities. Telmex/Infinitum, Megacable, Totalplay. Urban speeds: 100–500 Mbps from ~$25–$50 USD/month. Beach towns can be slower.',
    mobile: 'Telcel (best coverage), AT&T Mexico, Movistar. Unlimited data plans from ~$15–$25 USD/month.',
    weather: 'Highly varied. CDMX: temperate, ~16–26°C year-round, rainy season June–October. Yucatán/Playa: hot and humid (25–35°C), hurricane season June–November. Pacific coast: warm and dry most of the year. North: extremes.',
    holidays: '7 mandatory public holidays plus regional celebrations. Día de Muertos (Nov 1–2) is a major cultural event. Semana Santa is important nationally.',
    culturalEtiquette: 'Warm and family-oriented. Greetings with a hug or cheek kiss are common. Meals are social and long. Tardiness is culturally normal in social settings. Showing respect for Mexican culture and learning Spanish are greatly appreciated.',
    safety: 'Highly variable. CDMX Roma, Condesa, Polanco: generally safe. Many other cities and beach destinations: generally safe in specific areas. Travel advisories exist for some states. Research your specific destination. Use common sense: app-based transport, avoid flashing wealth.',
    paceOfLife: 'Generally relaxed and social. Emphasis on family and community. Mañana culture — flexibility with time — is real but varies by context. Life can be vibrant, festive, and deeply community-oriented.',
    recreation: 'Beaches, ruins, cenotes, markets, mezcal, music, food, football, Day of the Dead celebrations, surfing, hiking (Oaxaca, Chiapas), colonial architecture.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'Editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  familyPets: {
    childcare: 'Estancias infantiles (subsidised crèches) available. Private nurseries: MXN $3,000–$8,000/month. Au pairs and nannies are affordable relative to the US.',
    familyBenefits: 'Limited state family benefits for non-citizens. Social benefits are primarily tied to IMSS for formal employees.',
    parentalLeave: 'IMSS-enrolled employees have maternity (12 weeks) and paternity leave rights. Remote workers employed by foreign firms are not automatically covered.',
    childrenHealthcare: 'IMSS for enrolled families. Excellent private paediatric care at affordable costs.',
    petImportRules: 'Certificate of health from an official veterinarian, rabies vaccination, and SENASICA import permit required. Confirm current requirements with SAT (customs) and SENASICA.',
    quarantine: 'Generally no quarantine if requirements are met. Confirm current rules before travel.',
    vetCare: 'Good quality and very affordable veterinary care in major cities. Pet culture is strong in CDMX.',
    petFriendlyHousing: 'Landlord consent required. Dog-friendly parks exist. CDMX Condesa and Roma have many dog-friendly spaces.',
    multigenerational: 'Family is the centre of Mexican life. Multigenerational living is the norm in most Mexican households. Extended family networks provide significant practical support.',
    disclosure: { lastVerified: '2026-01-01', sourceNote: 'SENASICA · editorial review (2024–2025)', status: 'editorially_reviewed' as const },
  },
  greenbook: {
    communityFit: 'Mexico has a large, established expat community — particularly from the US, Canada, and increasingly Europe. Popular destinations include CDMX, Puerto Vallarta, San Miguel de Allende, Mérida, and Oaxaca.',
    blackDiaspora: 'Mexico has an Afro-Mexican population primarily on the Pacific coast (Costa Chica) and in Veracruz. The broader Black expat community is growing, particularly in CDMX and Puerto Vallarta. Experiences vary — colourism and racism exist within Mexican society and have been documented. The international expat community is generally diverse and welcoming. Afro-Mexican identity gained official constitutional recognition in 2019.',
    lgbtq: 'Mexico City is one of the most LGBTQ+ progressive cities in Latin America — same-sex marriage is legal nationwide (though practice varies by state). Zona Rosa in CDMX is a historic LGBTQ+ neighbourhood. Puerto Vallarta is one of the most LGBTQ+-welcoming destinations in the Americas. Rural areas can be significantly more conservative.',
    womenSafety: 'Safety for women varies widely by location. Urban areas popular with expats are generally safe with reasonable precautions. Femicide rates in Mexico are a serious documented issue — primarily affecting local women in specific contexts. Expat women in well-established communities generally report feeling safe. Research your specific destination and exercise standard urban precautions.',
    faithCommunities: 'Mexico is predominantly Roman Catholic (culturally dominant). Evangelical and Protestant communities are growing significantly. Jewish communities in CDMX (Monte Sinai, Polanco area). Muslim and Buddhist communities in major cities.',
    disabilityAccess: 'Accessibility is uneven. Modern shopping centres and new buildings meet accessibility standards. Historic centres, uneven pavements, and older buildings present significant barriers.',
    culturalBelonging: 'Mexico has one of the warmest and most welcoming expat cultures in the world. Learning Spanish makes an enormous positive difference. Mexicans are generally proud of their culture — genuine curiosity and respect go a long way.',
    neighborhoodInsights: 'CDMX (Roma Norte/Sur: creative, expat hub; Condesa: leafy, upscale; Polanco: luxury; Coyoacán: artsy, historic; Del Valle: family-friendly, value). Puerto Vallarta (Romantic Zone: LGBTQ+, expat centre; Versalles: local feel). Mérida (Norte: expat hub, upscale). San Miguel de Allende (Centro: walkable, heavy expat presence).',
    communityOrgs: [
      { name: 'Internations Mexico City', description: 'Large expat community events and networking in CDMX.', url: 'https://www.internations.org/mexico-city-expats' },
      { name: 'Expats in Mexico City (Facebook)', description: 'Active Facebook group for CDMX expats.', url: 'https://www.facebook.com/groups/expatsmexico' },
      { name: 'GDL LGBT Centro Comunitario', description: 'Guadalajara\'s LGBTQ+ community centre.', url: 'https://gdllgbt.org' },
    ],
    disclaimer: 'Greenbook insights combine editorial research and community-reported experiences. Individual experiences vary. Safety conditions change — verify current conditions with updated sources. Not universal statements of fact.',
  },
  resources: [
    { title: 'INM — Instituto Nacional de Migración', organization: 'INM', description: 'Visas, Temporary Residence, Permanent Residence, and immigration procedures.', type: 'official', url: 'https://www.gob.mx/inm', lastChecked: '2026-01-01', category: 'immigration' },
    { title: 'US Embassy Mexico City', organization: 'U.S. Department of State', description: 'US consular services and American Citizen Services in Mexico.', type: 'official', url: 'https://mx.usembassy.gov', lastChecked: '2026-01-01', category: 'embassy' },
    { title: 'SAT — Mexican Tax Authority', organization: 'Servicio de Administración Tributaria', description: 'RFC registration, tax filings, and Mexican tax information.', type: 'official', url: 'https://www.sat.gob.mx', lastChecked: '2026-01-01', category: 'taxes' },
    { title: 'INEGI — National Statistics', organization: 'Instituto Nacional de Estadística y Geografía', description: 'Official statistics: demographics, wages, economic data.', type: 'official', url: 'https://www.inegi.org.mx', lastChecked: '2026-01-01', category: 'statistics' },
    { title: 'IMSS — Social Security Institute', organization: 'Instituto Mexicano del Seguro Social', description: 'Public healthcare and social security enrolment information.', type: 'official', url: 'https://www.imss.gob.mx', lastChecked: '2026-01-01', category: 'healthcare' },
    { title: 'Inmuebles24 — Property portal', organization: 'Inmuebles24', description: 'Mexico\'s leading property portal for rentals and sales.', type: 'community', url: 'https://www.inmuebles24.com', lastChecked: '2026-01-01', category: 'housing' },
    { title: 'OCC Mundial — Job search', organization: 'OCC Mundial', description: 'Mexico\'s leading job board.', type: 'community', url: 'https://www.occ.com.mx', lastChecked: '2026-01-01', category: 'employment' },
    { title: 'Tren Maya — Yucatán rail', organization: 'FONATUR', description: 'Tren Maya route connecting Cancún, Playa del Carmen, and the Yucatán peninsula.', type: 'official', url: 'https://www.trenmaya.gob.mx', lastChecked: '2026-01-01', category: 'transportation' },
    { title: 'Expats in Mexico — Community', organization: 'Community resource', description: 'English-language resource hub for expats living in Mexico.', type: 'community', url: 'https://www.expatsinmexico.com', lastChecked: '2026-01-01', category: 'community' },
  ],
}

// ─── Country content index ────────────────────────────────────────────────────

const CONTENT_INDEX: Record<string, CountryContent> = {
  portugal,
  spain,
  greece,
  estonia,
  mexico,
}

export function getCountryContent(slug: string): CountryContent | null {
  return CONTENT_INDEX[slug] ?? null
}
