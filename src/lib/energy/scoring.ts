// Deterministic scoring engine for the Energy Portal.
//
// Astrology signals + user-selected concern => focus. Same inputs, same result,
// every time. Ported verbatim in behaviour from public/energy.html.

import { ELEMENT, type Chart } from './astro'
import { MODECOPY, type PortalMode } from './portal-state'

export type Domain =
  | 'Wealth'
  | 'Health'
  | 'Career'
  | 'Relationships'
  | 'Transformation'
  | 'Spiritual'

export interface Signal {
  domain: Domain
  pts: number
  why: string
}

export interface ScoreResult {
  S: Record<Domain, number>
  signals: Signal[]
  primary: Domain
  supporting: Domain
  anchor: string
  domEl: string
  weakEl: string
  elCount: Record<string, number>
}

// The Leo "why" line is the only mode-dependent value inside scoring. It affects
// display text only, never the numeric scores, so its default keeps the engine
// callable as scoreChart(chart, concern). The UI passes the live mode.
export function scoreChart(
  chart: Chart,
  concern: string | null,
  mode: PortalMode = 'gate',
): ScoreResult {
  const leoWhy = MODECOPY({ mode, peak: false, daysToClose: 0, daysToOpen: 0 }).leoSignal

  const S: Record<Domain, number> = {
    Wealth: 0,
    Health: 0,
    Career: 0,
    Relationships: 0,
    Transformation: 0,
    Spiritual: 0,
  }
  const signals: Signal[] = []
  const add = (domain: Domain, pts: number, why: string): void => {
    S[domain] += pts
    signals.push({ domain, pts, why })
  }
  const P = chart.placements

  const inHouse = (name: string, h: number): boolean => Boolean(P[name]) && P[name].house === h
  const inSign = (name: string, arr: string[]): boolean =>
    Boolean(P[name]) && arr.includes(P[name].sign)

  // --- Wealth: 2nd house and Jupiter activation ---
  for (const k in P) if (P[k].house === 2) add('Wealth', k === 'Jupiter' ? 3 : 2, `${k} in your 2nd house`)
  if (inHouse('Jupiter', 10)) {
    add('Career', 2, 'Jupiter in your 10th house')
    add('Wealth', 1, 'Jupiter elevated near your Midheaven')
  }
  if (inHouse('Jupiter', 8)) add('Wealth', 2, 'Jupiter in your 8th house')
  if (inSign('Jupiter', ['Sagittarius', 'Pisces', 'Cancer']))
    add('Wealth', 1, `Jupiter dignified in ${P.Jupiter.sign}`)

  // --- Health: 6th house and Mars activation ---
  for (const k in P) if (P[k].house === 6) add('Health', k === 'Mars' ? 3 : 2, `${k} in your 6th house`)
  if (inHouse('Mars', 1)) add('Health', 2, 'Mars in your 1st house')
  if (inSign('Mars', ['Aries', 'Scorpio', 'Capricorn'])) add('Health', 1, `Mars strong in ${P.Mars.sign}`)

  // --- Career: 10th house, Midheaven, Leo (Lion's Gate resonance) ---
  for (const k in P) if (P[k].house === 10) add('Career', k === 'Sun' ? 3 : 2, `${k} in your 10th house`)
  if (chart.mc && chart.mc.sign === 'Leo') add('Career', 2, 'Leo on your Midheaven')
  if (P.Sun.sign === 'Leo') add('Career', 2, leoWhy)
  if (chart.asc.sign === 'Leo') add('Career', 1, 'Leo rising')

  // --- Relationships: 7th house and Venus activation ---
  for (const k in P) if (P[k].house === 7) add('Relationships', k === 'Venus' ? 3 : 2, `${k} in your 7th house`)
  if (inSign('Venus', ['Taurus', 'Libra', 'Pisces']))
    add('Relationships', 1, `Venus dignified in ${P.Venus ? P.Venus.sign : ''}`)
  if (inHouse('Moon', 7)) add('Relationships', 1, 'Moon seeking partnership')

  // --- Transformation: 8th house, Pluto ---
  for (const k in P)
    if (P[k].house === 8 && k !== 'Jupiter')
      add('Transformation', k === 'Pluto' ? 3 : 2, `${k} in your 8th house`)
  if (inHouse('Pluto', 2)) {
    add('Transformation', 2, 'Pluto in your 2nd house')
    add('Wealth', 2, 'Pluto rebuilding your money story')
  }

  // --- Spiritual / Rest: 12th house, Neptune ---
  for (const k in P) if (P[k].house === 12) add('Spiritual', k === 'Neptune' ? 3 : 2, `${k} in your 12th house`)
  if (inHouse('Neptune', 1)) add('Spiritual', 2, 'Neptune on your Ascendant')

  // --- North Node nudges (Big Three advanced path) ---
  if (P.NorthNode) {
    const nh = P.NorthNode.house
    if (nh === 2) add('Wealth', 2, 'North Node pointing at your 2nd house')
    if (nh === 6) add('Health', 2, 'North Node pointing at your 6th house')
    if (nh === 10) add('Career', 2, 'North Node pointing at your 10th house')
    if (nh === 7) add('Relationships', 2, 'North Node pointing at your 7th house')
  }

  // --- User concern ---
  const concernMap: Record<string, Domain> = {
    Health: 'Health',
    Wealth: 'Wealth',
    Career: 'Career',
    Relationships: 'Relationships',
    Growth: 'Transformation',
  }
  if (concern && concernMap[concern]) add(concernMap[concern], 3, 'You named this as what needs attention')

  // --- Elements: dominance flavors the result, weakest element sets the anchor ---
  const counted = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter'].filter((k) => P[k])
  const elCount: Record<string, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  counted.forEach((k) => {
    elCount[ELEMENT[P[k].sign]]++
  })
  elCount[ELEMENT[chart.asc.sign]]++
  const domEl = Object.keys(elCount).sort((a, b) => elCount[b] - elCount[a])[0]
  const weakEl = Object.keys(elCount).sort((a, b) => elCount[a] - elCount[b])[0]
  if (domEl === 'Earth') add('Health', 1, 'Earth-dominant chart: the body is your instrument')
  if (domEl === 'Water') add('Relationships', 1, 'Water-dominant chart: connection carries you')
  if (domEl === 'Air') add('Career', 1, 'Air-dominant chart: ideas want a public outlet')
  if (domEl === 'Fire') add('Career', 1, 'Fire-dominant chart: made for visible action')

  const anchorMap: Record<string, string> = {
    Earth: 'Physical',
    Air: 'Intellectual',
    Water: 'Emotional',
    Fire: 'Spiritual',
  }
  const anchor = anchorMap[weakEl]

  // --- Rank ---
  const ranked = (Object.keys(S) as Domain[]).sort((a, b) => S[b] - S[a])
  let primary: Domain = ranked[0]
  let supporting: Domain = ranked[1]
  if (S[primary] === 0) {
    primary = 'Career'
    supporting = 'Health'
  } // zero-signal fallback: Lion's Gate default
  if (S[supporting] === 0) supporting = primary === 'Health' ? 'Career' : 'Health'

  return {
    S,
    signals: signals.sort((a, b) => b.pts - a.pts),
    primary,
    supporting,
    anchor,
    domEl,
    weakEl,
    elCount,
  }
}

export interface DomainCopy {
  label: string
  hero: string
  instruction: string
  body: string
  question: string
}

// Only Wealth's question differs by mode, so this is a builder rather than a
// static constant. Call with the live portal mode.
export function DOMAIN_COPY(mode: PortalMode): Record<Domain, DomainCopy> {
  const isGate = mode === 'gate'
  return {
    Wealth: {
      label: 'Wealth',
      hero: 'Concentrate the Fire',
      instruction: 'Choose what deserves your life force next.',
      body: "Your wealth pattern favors systems, networks and compounding work rather than chasing every available opportunity. Don't use today to generate another ten possibilities. Choose the intellectual asset, company, body of work, system or expertise you want to become substantially more valuable over the next three years.",
      question: isGate
        ? 'If I could only seriously build one thing until 8/8/2029, what would I want to own?'
        : 'If I could only seriously build one thing for the next three years, what would I want to own?',
    },
    Health: {
      label: 'Health + Capacity',
      hero: 'Protect the Vessel',
      instruction: 'Your capacity is the strategy.',
      body: "Your body is infrastructure. Today isn't asking for a dramatic transformation. Choose one small repeatable practice that protects your capacity to do the work you're choosing.",
      question: 'What routine would make everything else easier if I actually maintained it?',
    },
    Career: {
      label: 'Career + Purpose',
      hero: 'Step Into the Light',
      instruction: 'Stop auditioning. Start occupying.',
      body: 'Your chart carries strong activation around career, leadership and public contribution. The invitation today is not to work harder in private. It is to claim the visible role you have been circling and let people see the work.',
      question: 'What am I already good at that I keep treating like a side note?',
    },
    Relationships: {
      label: 'Relationships',
      hero: 'Tend the Bond',
      instruction: 'Choose depth over breadth today.',
      body: 'Your chart concentrates energy in the connection houses. Today is not about meeting more people. It is about choosing which relationships get your best hours and telling one person the true thing you have been softening.',
      question: 'Which relationship would change if I stopped managing it and started meeting it?',
    },
    Transformation: {
      label: 'Transformation',
      hero: 'Burn the Old Pattern',
      instruction: 'Let the ending finish so the beginning can start.',
      body: 'Your chart is weighted toward the deep-change houses. Something has already ended and you have been keeping it on life support. Today is for naming what is over and reclaiming the energy you have been spending on its maintenance.',
      question: 'What have I already outgrown that I am still paying rent on?',
    },
    Spiritual: {
      label: 'Spiritual + Rest',
      hero: 'Return to the Well',
      instruction: 'Recovery is not the reward. It is the practice.',
      body: 'Your chart routes power through the quiet houses. The move today is not more output. It is restoring the inner signal you have been overriding: rest, ritual, solitude, prayer, art, whatever refills you without an audience.',
      question: 'What would I hear if I gave myself one genuinely quiet hour?',
    },
  }
}

export const ANCHOR_COPY: Record<string, string> = {
  Physical:
    'Your chart runs light on Earth. Your capacity, not your ambition, is currently the constraint. For your Iter8 cycle, Physical becomes your anchor: one small bodily practice that continues every day.',
  Intellectual:
    'Your chart runs light on Air. You don\'t need more motivation. You need clarity and a decision architecture. For your Iter8 cycle, Intellectual becomes your anchor: one daily practice of thinking on paper.',
  Emotional:
    'Your chart runs light on Water. The feelings are carrying data you have been outrunning. For your Iter8 cycle, Emotional becomes your anchor: one daily practice of naming what is actually going on in there.',
  Spiritual:
    'Your chart runs light on Fire. Meaning, not mechanics, is the missing fuel. For your Iter8 cycle, Spiritual becomes your anchor: one daily practice that reconnects the work to why it matters.',
}
