import type { PathwayGoal, RelocationProfile } from './profile'

export type PathwayMatchStatus = 'Strong Match' | 'Possible Match' | 'Missing Requirements'

export type PathwayDefinition = {
  id: string
  category: PathwayGoal
  name: string
  country: string
  incomeThreshold: string
  dependentsAllowed: string
  localWorkRights: string
  estimatedFees: string
  estimatedProcessingTime: string
  officialSource: string
  sourceLabel: string
  lastVerified: string
  baseRequirements: string[]
}

export type PathwayEvaluation = PathwayDefinition & {
  status: PathwayMatchStatus
  requirementsMet: string[]
  missingRequirements: string[]
}

export const PATHWAYS: PathwayDefinition[] = [
  {
    id: 'portugal-remote-work', category: 'Remote Work', name: 'Remote-work residence visa', country: 'Portugal',
    incomeThreshold: 'Four times Portugal’s monthly minimum wage; confirm the current amount',
    dependentsAllowed: 'Family reunification may be available; confirm individual eligibility',
    localWorkRights: 'Designed for work performed remotely for entities outside Portugal',
    estimatedFees: 'Fees vary by consulate and residence-permit stage', estimatedProcessingTime: 'Varies by consulate and AIMA appointment availability',
    officialSource: 'https://aima.gov.pt/pt/trabalhar/autorizacao-de-residencia-para-o-exercicio-de-atividade-profissional-prestada-de-forma-remota-com-visto-de-residencia-para-o-exe',
    sourceLabel: 'AIMA — remote professional residence permit', lastVerified: '2026-07-21',
    baseRequirements: ['Valid passport and residence visa', 'Proof of qualifying foreign employment or service contract', 'Current income evidence'],
  },
  {
    id: 'germany-eu-blue-card', category: 'Employment', name: 'EU Blue Card', country: 'Germany',
    incomeThreshold: '€50,700 gross annually in 2026; €45,934.20 for listed special cases',
    dependentsAllowed: 'Family reunification is available subject to the applicable rules',
    localWorkRights: 'Employment in the qualifying German role', estimatedFees: 'Confirm with the responsible German mission and local authority',
    estimatedProcessingTime: 'Varies by mission and local foreigners authority',
    officialSource: 'https://www.make-it-in-germany.com/pdf-blue-card-eu', sourceLabel: 'German Federal Government — EU Blue Card', lastVerified: '2026-07-21',
    baseRequirements: ['Qualifying job offer or employment contract', 'Recognized qualification or qualifying IT experience', 'Applicable salary threshold'],
  },
  {
    id: 'portugal-entrepreneur', category: 'Entrepreneurship', name: 'Independent professional or entrepreneur residence visa', country: 'Portugal',
    incomeThreshold: 'Sufficient means of subsistence and evidence supporting the proposed activity or investment',
    dependentsAllowed: 'Family reunification may be available; confirm individual eligibility', localWorkRights: 'Independent professional or approved entrepreneurial activity',
    estimatedFees: '€90 visa-service fee listed by gov.pt; later residence fees may apply', estimatedProcessingTime: '60 days listed by gov.pt',
    officialSource: 'https://www.gov.pt/servicos/pedir-visto-de-residencia-para-o-exercicio-de-atividade-profissional-independente-ou-para-imigrantes-empreendedores',
    sourceLabel: 'gov.pt — independent professional or entrepreneur visa', lastVerified: '2026-07-21',
    baseRequirements: ['Business, services, or investment evidence', 'Sufficient means of subsistence', 'Required criminal-record and travel documents'],
  },
  {
    id: 'portugal-passive-income', category: 'Passive Income / Retirement', name: 'Residence visa supported by stable income', country: 'Portugal',
    incomeThreshold: 'Sufficient and stable means of subsistence; confirm the current formula with the issuing authority',
    dependentsAllowed: 'Family reunification may be available; household resources are assessed', localWorkRights: 'Confirm rights attached to the issued residence authorization',
    estimatedFees: 'Varies by consulate and residence-permit stage', estimatedProcessingTime: 'Varies by consulate and AIMA appointment availability',
    officialSource: 'https://www.gov.pt/guias/migrantes-vistos-e-autorizacoes-para-entrar-e-viver-em-portugal', sourceLabel: 'gov.pt — visas and residence guidance', lastVerified: '2026-07-21',
    baseRequirements: ['Stable income evidence', 'Sufficient means of subsistence', 'Accommodation and required travel documents'],
  },
  {
    id: 'canada-study-permit', category: 'Education', name: 'Study permit', country: 'Canada',
    incomeThreshold: 'Tuition, living expenses, and transportation funds required; amount depends on circumstances',
    dependentsAllowed: 'Family members may apply, subject to their own requirements', localWorkRights: 'Student work rights depend on permit conditions and current rules',
    estimatedFees: 'CAD $150 study-permit fee; biometrics may be additional', estimatedProcessingTime: 'Varies by country',
    officialSource: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html', sourceLabel: 'Government of Canada — study permit', lastVerified: '2026-07-21',
    baseRequirements: ['Acceptance from a designated learning institution', 'Proof of funds', 'Required identity and admissibility documents'],
  },
  {
    id: 'spain-family-reunification', category: 'Family Reunification', name: 'Temporary residence through family reunification', country: 'Spain',
    incomeThreshold: 'Generally 150% of IPREM for two household members plus 50% for each additional member',
    dependentsAllowed: 'Eligible spouse or partner, children, and certain other relatives under the official rules', localWorkRights: 'Some reunited family members may work; verify the authorization issued',
    estimatedFees: 'Administrative and consular fees vary', estimatedProcessingTime: 'Varies by immigration office and consulate',
    officialSource: 'https://ciudadaniaexterior.inclusion.gob.es/en/web/migraciones/w/autorizacion-de-residencia-temporal-por-reagrupacion-familiar', sourceLabel: 'Spain Ministry of Inclusion — family reunification', lastVerified: '2026-07-21',
    baseRequirements: ['Qualifying sponsor in Spain', 'Proof of family relationship', 'Income, housing, and health-coverage evidence'],
  },
  {
    id: 'ireland-foreign-births', category: 'Ancestry', name: 'Foreign Births Register', country: 'Ireland',
    incomeThreshold: 'No income threshold listed for citizenship registration', dependentsAllowed: 'Citizenship eligibility is assessed for each person',
    localWorkRights: 'Irish citizens have citizenship-based work rights', estimatedFees: 'See the current fee schedule on the official application page', estimatedProcessingTime: 'Official processing times can change',
    officialSource: 'https://www.ireland.ie/en/dfa/citizenship/born-abroad/registering-a-foreign-birth/', sourceLabel: 'Ireland Department of Foreign Affairs — Foreign Births Register', lastVerified: '2026-07-21',
    baseRequirements: ['Qualifying Irish-born grandparent or qualifying Irish-citizen parent', 'Civil records proving each family link', 'Identity documents and witness requirements'],
  },
  {
    id: 'new-zealand-active-investor-plus', category: 'Investment', name: 'Active Investor Plus Visa', country: 'New Zealand',
    incomeThreshold: 'NZD $5 million Growth category or NZD $10 million Balanced category investment',
    dependentsAllowed: 'Partner and dependent children aged 24 or younger may be included', localWorkRights: 'Live, work, and study indefinitely when granted',
    estimatedFees: 'From NZD $27,470', estimatedProcessingTime: '80% of approvals in principle within 10.5 weeks',
    officialSource: 'https://www.immigration.govt.nz/visas/active-investor-plus-visa/', sourceLabel: 'Immigration New Zealand — Active Investor Plus Visa', lastVerified: '2026-07-21',
    baseRequirements: ['Lawfully earned or acquired investment funds', 'Qualifying investment amount', 'Fit-and-proper-person and other residence requirements'],
  },
]

export const RESEARCH_DISCLAIMER = 'Kolmari provides research information, not legal advice or an eligibility decision. Requirements, fees, and processing times can change. Confirm every detail with the linked government authority before applying.'

// Planning-guide thresholds per pathway (USD-equivalent, approximate — clearly
// labelled as planning guides, not official figures). Amounts are compared to
// the profile so Strong Match reflects real magnitude, not just field presence.
type PathwayThreshold = {
  minMonthlyIncome?: number
  perDependentIncome?: number
  minSavings?: number
  eligibleIncomeTypes?: string[]
}

const PATHWAY_THRESHOLDS: Record<string, PathwayThreshold> = {
  'portugal-remote-work': { minMonthlyIncome: 3400, perDependentIncome: 700 },
  'germany-eu-blue-card': { minMonthlyIncome: 4600, perDependentIncome: 600 },
  'portugal-entrepreneur': { minSavings: 10_000, eligibleIncomeTypes: ['Self-employment', 'Mixed'] },
  'portugal-passive-income': { minMonthlyIncome: 1800, perDependentIncome: 900, eligibleIncomeTypes: ['Pension', 'Investments', 'Mixed'] },
  'canada-study-permit': { minSavings: 15_000 },
  'spain-family-reunification': { minMonthlyIncome: 2400, perDependentIncome: 600 },
  'ireland-foreign-births': {},
  'new-zealand-active-investor-plus': { minSavings: 5_000_000 },
}

// EU/EEA free-movement signal: a citizen of one member state can generally live
// in another without these national visas. Used only to surface an informative
// signal, never to assert legal status.
const EU_EEA_CITIZENSHIPS = new Set([
  'austria', 'belgium', 'bulgaria', 'croatia', 'cyprus', 'czechia', 'czech republic', 'denmark', 'estonia',
  'finland', 'france', 'germany', 'greece', 'hungary', 'iceland', 'ireland', 'italy', 'latvia', 'liechtenstein',
  'lithuania', 'luxembourg', 'malta', 'netherlands', 'norway', 'poland', 'portugal', 'romania', 'slovakia',
  'slovenia', 'spain', 'sweden',
])
const EU_PATHWAY_COUNTRIES = new Set(['Portugal', 'Germany', 'Spain', 'Ireland'])

function hasEuFreedomOfMovement(profile: RelocationProfile, pathway: PathwayDefinition) {
  const citizenship = profile.citizenship?.trim().toLowerCase()
  return Boolean(citizenship && EU_EEA_CITIZENSHIPS.has(citizenship) && EU_PATHWAY_COUNTRIES.has(pathway.country))
}

function profileSignals(profile: RelocationProfile, pathway: PathwayDefinition) {
  const met: string[] = []
  const missing: string[] = []
  const selected = profile.goals.includes(pathway.category)
  if (selected) met.push(`${pathway.category} selected in your Kolmari Profile`)
  else missing.push(`Add ${pathway.category} as a profile goal`)

  // Citizenship signal — EU/EEA free movement often removes the need for a visa.
  if (hasEuFreedomOfMovement(profile, pathway)) {
    met.push('Your EU/EEA citizenship may already grant residence rights here')
  }

  const threshold = PATHWAY_THRESHOLDS[pathway.id] ?? {}
  const dependents = profile.dependents ?? 0

  // Income magnitude (with per-dependent bump)
  if (threshold.minMonthlyIncome !== undefined) {
    const required = threshold.minMonthlyIncome + (threshold.perDependentIncome ?? 0) * dependents
    const guide = `~$${required.toLocaleString()}/mo planning guide`
    if (profile.monthly_income === null) missing.push(`Add monthly income to compare against the ${guide}`)
    else if (profile.monthly_income >= required) met.push(`Monthly income meets the ${guide}`)
    else missing.push(`Monthly income is below the ${guide}`)
  }

  // Income type eligibility
  if (threshold.eligibleIncomeTypes) {
    if (profile.income_type && threshold.eligibleIncomeTypes.includes(profile.income_type)) met.push(`${profile.income_type} income fits this route`)
    else missing.push(`Income type should be ${threshold.eligibleIncomeTypes.join(' or ')}`)
  }

  // Savings / proof-of-funds magnitude
  if (threshold.minSavings !== undefined) {
    const guide = `~$${threshold.minSavings.toLocaleString()} planning guide`
    if (profile.savings === null) missing.push(`Add savings to compare against the ${guide}`)
    else if (profile.savings >= threshold.minSavings) met.push(`Savings meet the ${guide}`)
    else missing.push(`Savings are below the ${guide}`)
  }

  // Category-specific non-financial signals
  if (pathway.category === 'Remote Work') {
    if (profile.remote) met.push('Remote work reported')
    else missing.push('Qualifying remote work evidence')
  } else if (pathway.category === 'Employment') {
    if (profile.occupation) met.push('Occupation provided')
    else missing.push('Add your occupation')
    if (profile.education || profile.credentials) met.push('Education or credentials provided')
    missing.push('Qualifying local job offer or contract')
  } else if (pathway.category === 'Education') {
    if (profile.education) met.push('Education history provided')
    missing.push('Acceptance from a designated learning institution')
  } else if (pathway.category === 'Family Reunification') {
    if (profile.spouse || dependents > 0) met.push('Household relationship details provided')
    else missing.push('Add the family member you would join or sponsor')
    missing.push('Qualifying sponsor and documented family relationship')
  } else if (pathway.category === 'Ancestry') {
    if (profile.ancestry_connections && profile.ancestry_connections !== 'None known') met.push('Ancestry connection reported')
    else missing.push('A potentially qualifying ancestry connection')
    missing.push('Civil records proving the family chain')
  } else if (pathway.category === 'Investment') {
    missing.push('Proof of qualifying investment funds and lawful source')
  }

  return { selected, met, missing }
}

export function evaluatePathways(profile: RelocationProfile): PathwayEvaluation[] {
  return PATHWAYS.map((pathway) => {
    const signals = profileSignals(profile, pathway)
    const status: PathwayMatchStatus = !signals.selected
      ? 'Missing Requirements'
      : signals.met.length >= 2 && signals.missing.length <= 1
        ? 'Strong Match'
        : 'Possible Match'
    return { ...pathway, status, requirementsMet: signals.met, missingRequirements: signals.missing }
  })
}
