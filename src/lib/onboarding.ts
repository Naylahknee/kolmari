/** Lane content adapted from the owner's September 2026 onboarding reference. */
export const LANE_IDS = ['health', 'community', 'energy', 'work', 'family', 'money'] as const
export type LaneId = (typeof LANE_IDS)[number]
export type Answer = string | string[]
export type QuizSnapshot = { answers: Record<string, string>; stage: string; completedAt: string }
export type OnboardingState = { version: 1; lanes: LaneId[]; answers: Record<string, Answer>; destinations: string[]; step: number; quiz?: QuizSnapshot }

/**
 * Match Quiz → setup carryover (Batch A). Mappings are verbatim from the
 * Kolmari Flow design: mq2 (priority) preselects approach lanes, mq3 (region)
 * seeds the first destination shortlist, six answers (mq1, mq4–mq8) carry into
 * the household step, and mq8 (obstacle) keys the Command Center START HERE panel.
 */
export const QUIZ_PRIORITY_LANES: Record<string, LaneId[]> = {
  'Affordability': ['money'],
  'Safety and belonging': ['community'],
  'Career opportunities': ['work'],
  'Healthcare and schools': ['health', 'family'],
  'Quality of life': ['health', 'community'],
}

export const QUIZ_REGION_DESTINATIONS: Record<string, string[]> = {
  'Europe': ['Portugal', 'Spain', 'Albania'],
  'Latin America and the Caribbean': ['Mexico', 'Costa Rica', 'Uruguay'],
  'Africa': ['Ghana'],
  'Asia and the Pacific': ['Malaysia'],
  'I am open to anywhere': ['Portugal', 'Mexico', 'Ghana'],
}

export const QUIZ_START_HERE: Record<string, string> = {
  'Choosing a country': 'Compare your destinations side by side. Tick off Neighborhood and safety first.',
  'Understanding visas': 'Open Visa and immigration for each destination and identify the route that fits.',
  'Money and budgeting': 'Start with Work and income: confirm the income each visa route asks for.',
  'Employment': 'Start with Work and income: confirm remote-work eligibility or local job leads.',
  'Documents and logistics': 'List the documents, apostilles and translations under Visa and immigration.',
  'I do not know where to begin': 'Pick one destination and finish three items in your first lane this week.',
}

/** The six quiz answers carried into the household step, with display labels. */
export const QUIZ_CARRYOVER_QUESTIONS: Array<{ key: string; label: string }> = [
  { key: 'who', label: 'Who is this move for?' },
  { key: 'situation', label: 'Current situation' },
  { key: 'ties', label: 'Citizenship, ancestry, or family ties abroad' },
  { key: 'budget', label: 'Monthly housing budget' },
  { key: 'timeline', label: 'Ideal timeline' },
  { key: 'obstacle', label: 'Biggest obstacle' },
]

/** Quiz "who" answer → household_type. Only unambiguous mappings; no guessing. */
export const QUIZ_WHO_HOUSEHOLD: Record<string, string> = {
  'Just me': 'Solo',
  'Me and a partner': 'Couple',
  'My family': 'Family',
}

/** Quiz "situation" answer → pathway goal. Only unambiguous mappings. */
export const QUIZ_SITUATION_GOAL: Record<string, string> = {
  'I work remotely': 'Remote Work',
  'I may work abroad': 'Employment',
  'I want to study': 'Education',
  'I am retired or planning retirement': 'Passive Income / Retirement',
  'I run or want to start a business': 'Entrepreneurship',
}

export function quizLaneSuggestion(priority: string | undefined): LaneId[] {
  return (priority != null && QUIZ_PRIORITY_LANES[priority]) || []
}

export function quizRegionDestinations(region: string | undefined): string[] {
  return (region != null && QUIZ_REGION_DESTINATIONS[region]) || []
}

export function quizStartHere(obstacle: string | undefined): string | null {
  return (obstacle != null && QUIZ_START_HERE[obstacle]) || null
}
export type Question = { id: string; q: string; mode: string; help: string; opts: string[]; multi?: boolean; exclusive?: string[]; implies?: Record<string, string[]>; impliedFoot?: string }
export type Lane = { title: string; short: string; tag: string; d: string; blurb: string; eyebrow: string; h1: string; note: string; qs: Question[] }
export const LANES: Record<LaneId, Lane> = {health: { title: 'Health and food first', short: 'health and food', tag: 'Opens Food & Health fit',
        d: 'M12 21s-7-4.6-9-9a5 5 0 019-3 5 5 0 019 3c-2 4.4-9 9-9 9zM12 9v6M9 12h6',
        blurb: 'Care continuity, specialist access, and what the everyday food culture does to a condition you already manage.',
        eyebrow: 'HEALTH AND FOOD LANE · QUESTIONS 2 TO 4',
        h1: 'What does your body need from a place?',
        note: 'Keep care needs and food preferences together. Your answers become research tasks; they do not certify that a country is safe for you.',
        qs: [
          { id: 'h1', q: 'Which food cultures fit your health?', mode: 'Pick any', multi: true,
            help: 'Tap the patterns that suit you.',
            opts: ['Mediterranean', 'Farm-to-table', 'Seafood-forward', 'Plant-forward', 'Strict allergen labeling', 'Low processed food', 'Dairy-heavy', 'Nut-heavy'] },
          { id: 'h2', q: 'Which allergens do you cook around?', mode: 'Pick any', multi: true,
            help: 'These flags become research prompts; no destination is removed.',
            exclusive: ['None'],
            opts: ['Shellfish', 'Tree nuts', 'Peanuts', 'Dairy', 'Gluten', 'Eggs', 'None'] },
          { id: 'h3', q: 'What ongoing care does the household need?', mode: 'Pick any that apply', multi: true,
            help: 'Select every need that applies. Nothing else is assumed.',
            exclusive: ['None'],
            opts: ['None', 'Routine prescriptions', 'A chronic condition needing a specialist', 'Mental health care', 'Mobility or disability support'] },
        ] },
      community: { title: 'Community and belonging', short: 'community and belonging', tag: 'Opens Greenbook',
        d: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18',
        blurb: 'Whether you will have anyone to call. The part people underestimate, and the most common reason a move gets reversed.',
        eyebrow: 'COMMUNITY LANE · QUESTIONS 2 TO 4',
        h1: 'Who do you need around you?',
        note: 'This lane opens Greenbook first: neighbourhood-level reporting, resident accounts, and the diaspora networks already in place where you are considering.',
        qs: [
          { id: 'c1', q: 'What matters most where you land?', mode: 'Pick any', multi: true, help: '',
            opts: ['An existing diaspora community', 'A faith community', 'Families with children the same age', 'A professional network', 'Queer-safe everyday life', 'Quiet and privacy'] },
          { id: 'c2', q: 'What is your language plan?', mode: 'Pick one', help: 'English-only works in some cities and fails in most bureaucracy.',
            opts: ['Already fluent', 'Will study before moving', 'Will learn on arrival', 'Plan to live in English'] },
          { id: 'c3', q: 'How much time have you spent there?', mode: 'Pick one', help: '',
            opts: ['Lived there before', 'Visited more than once', 'Visited once', 'Never been'] },
        ] },
      energy: { title: 'Astrological alignment', short: 'astrological alignment', tag: 'Opens Energy focus · Experimental',
        d: 'M12 3l2.4 6.2L21 11l-6.6 1.8L12 19l-2.4-6.2L3 11l6.6-1.8zM18.5 4.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8L16 6.9l1.8-.7z',
        blurb: 'Timing and placement read from your chart, held next to the practical filters rather than instead of them.',
        eyebrow: 'ENERGY LANE · QUESTIONS 2 TO 4',
        h1: 'Where should your energy actually go?',
        note: 'Energy focus is optional and experimental. It never overrides visa, cost, healthcare or safety research.',
        qs: [
          { id: 'e1', q: 'How much of your chart do you know?', mode: 'Pick one',
            help: 'Full birth details give locational readings. The Big Three still gives a directional read.',
            opts: ['Full birth details — date, time, city', 'I know my Big Three', 'Sun sign only', 'None of it yet'] },
          { id: 'e2', q: 'What needs the most attention right now?', mode: 'Pick one', help: '',
            opts: ['Health / Energy', 'Money / Wealth', 'Career / Purpose', 'Relationships', 'Home / Roots'] },
          { id: 'e3', q: 'How should alignment weigh against the practical filters?', mode: 'Pick one',
            help: 'Saved as a preference for your research. It does not change practical eligibility checks.',
            opts: ['A tiebreaker only', 'Equal weight with cost and visa', 'Lead with it, then check feasibility'] },
        ] },
      work: { title: 'Work, visa and income', short: 'work and visa', tag: 'Opens Pathways',
        d: 'M3 7h18v13H3zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 12h18',
        blurb: 'Which routes your facts actually qualify for, and where the money comes from after you land.',
        eyebrow: 'WORK AND VISA LANE · QUESTIONS 2 TO 4',
        h1: 'Where does the income come from?',
        note: 'Route families are organized from official sources. This page does not determine eligibility or guarantee an outcome — it tells you which routes are worth reading.',
        qs: [
          { id: 'w1', q: 'Where will your income come from after the move?', mode: 'Pick one',
            help: 'This determines which route families you can apply under at all.',
            opts: ['Remote employment', 'Self-employment or freelance clients', 'A business I own', 'Pension, savings or investments', 'I will need local work'] },
          { id: 'w2', q: 'Does your employer allow work from abroad?', mode: 'Pick one',
            help: 'Verbal permission does not survive a payroll review, and consulates ask for a letter.',
            opts: ['Yes, in writing', 'Informally, unconfirmed', 'No', 'Not applicable'] },
          { id: 'w3', q: 'Does anyone need a professional licence to practise?', mode: 'Pick one',
            help: 'Nursing, law, teaching, medicine, accountancy, trades.',
            opts: ['No', 'Yes, and it transfers', 'Yes, and re-qualification is required', 'Unsure'] },
        ] },
      family: { title: 'Family and schools', short: 'family and schools', tag: 'Opens Schools',
        d: 'M3 9l9-5 9 5-9 5zM7 12v5c0 1.1 2.2 2 5 2s5-.9 5-2v-5M3 9v5',
        blurb: 'School year timing decides your move date more often than visa processing does. Fees decide your city.',
        eyebrow: 'FAMILY LANE · QUESTIONS 2 TO 4',
        h1: 'What do your children need?',
        note: 'School choice sets your city, your budget, and your move month. It is the one answer that cannot be deferred past the application.',
        qs: [
          { id: 'f1', q: 'How old are the children moving with you?', mode: 'Pick any', multi: true,
            help: 'Select every age band in the household.',
            exclusive: ['No children'],
            opts: ['No children', 'Under 5', '5 to 11', '12 to 15', '16 to 18'] },
          { id: 'f2', q: 'What schooling would you accept?', mode: 'Pick one',
            help: 'Research actual fees and support in each destination.',
            opts: ['Public school in the local language', 'Bilingual or international, paying fees', 'Homeschool or online', 'Undecided'] },
          { id: 'f3', q: 'Is everyone moving agreed on it?', mode: 'Pick one',
            help: 'The most common reason a planned move stalls.',
            opts: ['Yes, all in', 'Mostly, one person is hesitant', 'No, it is contested', 'I am deciding alone'] },
        ] },
      money: { title: 'Cost and runway', short: 'cost and runway', tag: 'Opens Cost Calculator',
        d: 'M4 3h16v18H4zM8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01',
        blurb: 'What the move costs your household specifically, and how long your savings hold if the income slips.',
        eyebrow: 'COST LANE · QUESTIONS 2 TO 4',
        h1: 'What does the money have to do?',
        note: 'Record the budget you want to research. Budget ranges are not treated as income or verified destination costs.',
        qs: [
          { id: 'm1', q: 'What monthly budget are you planning against?', mode: 'Pick one', help: 'All in, for the whole household.',
            opts: ['Under $1,200', '$1,200 to $2,000', '$2,000 to $3,200', '$3,200 to $5,000', 'Over $5,000'] },
          { id: 'm2', q: 'What would you trade first if it ran tight?', mode: 'Pick one', help: '',
            opts: ['A smaller home', 'A cheaper city', 'Public healthcare instead of private', 'Delaying the move', 'Nothing — I would change country'] },
          { id: 'm3', q: 'How exposed are you to currency swings?', mode: 'Pick one',
            help: 'Earning in one currency and spending in another is a recurring risk, not a one-off.',
            opts: ['Paid in USD, spending abroad', 'Paid locally after the move', 'Mixed', 'Unsure'] },
        ] },
    }

export const LANE_LINKS: Record<LaneId, { label: string; href: string }> = {
  health: { label: 'Food & Health fit', href: '/food-fit' },
  community: { label: 'Greenbook Insights', href: '/greenbook' },
  energy: { label: 'Energy focus', href: '/energy' },
  work: { label: 'Kolmari Pathways', href: '/pathways' },
  family: { label: 'Schools research', href: '/command-center' },
  money: { label: 'Cost Calculator', href: '/cost-calculator' },
}
export function emptyOnboarding(): OnboardingState {
  return { version: 1, lanes: [], answers: {}, destinations: [], step: 0 }
}
export function chooseAnswer(question: Question, current: Answer | undefined, option: string): Answer {
  if (!question.multi) return option
  const values = Array.isArray(current) ? current : []
  if (values.includes(option)) return values.filter(value => value !== option)
  if (question.exclusive?.includes(option)) return [option]
  return [...values.filter(value => !question.exclusive?.includes(value)), option]
}
export function isAnswered(answer: Answer | undefined) {
  return Array.isArray(answer) ? answer.length > 0 : Boolean(answer?.trim())
}
// Only answers from currently selected lanes leave the wizard.
export function activeAnswers(state: OnboardingState) {
  const ids = new Set(state.lanes.flatMap(lane => LANES[lane].qs.map(q => q.id)))
  return Object.fromEntries(Object.entries(state.answers).filter(([id]) => ids.has(id)))
}

/** Explicit research prompts, never conclusions about eligibility or safety. */
export function onboardingTasks(state: OnboardingState): { category: 'work' | 'visa' | 'schools' | 'safety' | 'community'; text: string }[] {
  const categories = { health: 'safety', community: 'community', work: 'work', family: 'schools', money: 'visa', energy: 'community' } as const
  return state.lanes.filter(lane => lane !== 'energy').flatMap(lane => LANES[lane].qs.flatMap(q => {
    const answer = state.answers[q.id]
    const values = Array.isArray(answer) ? answer : answer ? [answer] : []
    if (!values.length || values.includes('None') || values.includes('No children')) return []
    return [{ category: categories[lane], text: `Research ${LANES[lane].short}: ${values.join('; ')}`.slice(0, 160) }]
  }))
}
