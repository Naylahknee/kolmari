/**
 * Dashboard derivation layer.
 *
 * The dashboard's job is to answer five questions: where did I leave off, what
 * should I do next, is anything waiting for me, how far along am I, and what can
 * I ask Kolmari right now. Everything here derives those answers from real saved
 * state — the Kolmari Plan, the Command Center board, and the Kolmari Profile.
 *
 * Pure and deterministic: no I/O, no `server-only` imports (type-only imports are
 * erased), and `today` is always supplied by the caller so the server renders
 * exactly what the client hydrates.
 *
 * DATA INTEGRITY: nothing here invents a Match Score, readiness, eligibility, a
 * deadline, or a country statistic. When a signal does not exist we return null
 * and the UI shows an honest empty state instead.
 */
import { COUNTRIES, type CountryDetail } from './countries'
import { regionList } from './destinations-data'
import { PATHWAYS } from './pathways'
import {
  CC_CATEGORIES,
  destinationProgress,
  type CCBoard,
  type CCCategory,
} from './command-center-model'
import {
  daysUntil,
  readinessChecks,
  type KolmariPlan,
} from './plan-types'

const CATEGORY_LABEL: Record<CCCategory, string> = {
  work: 'work',
  visa: 'visa & legal',
  schools: 'schools',
  safety: 'safety',
  community: 'community',
}

/** The subset of profile fields the dashboard reads. Keeps this module server-free. */
export type DashProfileInput = {
  display_name: string | null
  wizard_status: string
  dashboard_onboarding_completed: boolean
}

export type DashboardInput = {
  plan: KolmariPlan | null
  board: CCBoard
  profile: DashProfileInput
  profileComplete: boolean
  /** Ranked destinations from the user's profile; empty when no score exists. */
  ranked: { country: CountryDetail; score: number }[]
  today: Date
}

// --- Shortlist ---------------------------------------------------------------

export type ShortlistSignal = { label: string; value: string }
export type ShortlistItem = {
  slug: string
  name: string
  code: string
  city: string
  /** Match Score, only when one has actually been calculated. */
  score: number | null
  signals: ShortlistSignal[]
  href: string
}

/** Monthly cost estimate for a country, when the destinations dataset has one. */
function monthlyCost(slug: string): number | null {
  for (const region of regionList) {
    const found = region.countries.find((c) => c.slug === slug)
    if (found?.monthlyCost !== undefined) return found.monthlyCost
  }
  return null
}

/** Community Fit rating from the destinations dataset, when present. */
function communityFit(slug: string): string | null {
  for (const region of regionList) {
    const found = region.countries.find((c) => c.slug === slug)
    if (found?.communityFit) return found.communityFit
  }
  return null
}

/** How many published pathways Kolmari tracks for a country. A real count. */
function pathwayCount(countryName: string): number {
  return PATHWAYS.filter((p) => p.country === countryName).length
}

/**
 * The two or three destinations worth showing. Prefers the user's own shortlist
 * (saved destination + Command Center board), then ranked matches. Only shows a
 * Match Score when one exists.
 */
export function buildShortlist(input: DashboardInput, limit = 2): ShortlistItem[] {
  const { plan, board, ranked } = input
  const scoreFor = (slug: string) => ranked.find((r) => r.country.slug === slug)?.score ?? null

  const order: CountryDetail[] = []
  const push = (country: CountryDetail | undefined | null) => {
    if (country && !order.some((c) => c.slug === country.slug)) order.push(country)
  }

  // 1. The destination saved on the plan leads.
  if (plan?.saved_nextination) {
    push(COUNTRIES.find((c) => c.name === plan.saved_nextination || c.slug === plan.saved_nextination))
  }
  // 2. Destinations the user is actively comparing in the Command Center.
  for (const dest of board.destinations) {
    push(COUNTRIES.find((c) => c.name.toLowerCase() === dest.name.trim().toLowerCase()))
  }
  // 3. Ranked matches from the profile.
  for (const item of ranked) push(item.country)

  return order.slice(0, limit).map((country) => {
    const signals: ShortlistSignal[] = []
    const paths = pathwayCount(country.name)
    if (paths > 0) signals.push({ label: 'Kolmari Pathways', value: `${paths} tracked` })
    const cost = monthlyCost(country.slug)
    if (cost !== null) signals.push({ label: 'Cost of living', value: `$${cost.toLocaleString()}/mo` })
    else signals.push({ label: 'Cost of living', value: country.cost })
    const fit = communityFit(country.slug)
    if (fit) signals.push({ label: 'Community Fit', value: fit })
    signals.push({ label: 'Safety', value: country.safety })

    return {
      slug: country.slug,
      name: country.name,
      code: country.code,
      city: country.city,
      score: scoreFor(country.slug),
      signals: signals.slice(0, 4),
      href: `/nextinations/${country.slug}/v2/overview`,
    }
  })
}

// --- Orientation -------------------------------------------------------------

/** One honest sentence describing where the user actually stands. */
export function buildOrientation(input: DashboardInput, shortlist: ShortlistItem[]): string {
  if (shortlist.length >= 2) return `You're exploring ${shortlist[0].name} and ${shortlist[1].name}.`
  if (shortlist.length === 1) return `You're exploring ${shortlist[0].name}.`
  if (!input.profileComplete) return 'Finish your Kolmari Profile to see where you match.'
  return 'You haven’t shortlisted a destination yet.'
}

// --- Pick up where you left off ---------------------------------------------

export type ResumeCard = {
  /** Country context for the card's flag chip, when the work was destination-scoped. */
  countryName: string | null
  countryCode: string | null
  title: string
  detail: string
  cta: string
  href: string
}

/** "yesterday" / "today" / "3 days ago" from a real timestamp. */
function lastWorked(updatedAt: string | null, today: Date): string | null {
  if (!updatedAt) return null
  const parsed = new Date(updatedAt)
  if (Number.isNaN(parsed.getTime())) return null
  const days = Math.round(
    (Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) -
      Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate())) / 86_400_000,
  )
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 14) return 'last week'
  return null
}

/**
 * The single most meaningful thing the user was actually doing — derived from
 * saved work (a half-finished Command Center category, a document mid-pipeline,
 * an open task), never from a last-visited URL.
 */
export function buildResume(input: DashboardInput): ResumeCard {
  const { plan, board, today } = input
  const when = lastWorked(plan?.updated_at ?? null, today)
  const whenLine = when ? `You last worked here ${when}.` : 'Pick this back up where you stopped.'

  // 1. A Command Center comparison that is genuinely part-way through.
  for (const dest of board.destinations) {
    for (const { key, label } of CC_CATEGORIES) {
      const scoped = board.items.filter((i) => i.destinationId === dest.id && i.category === key)
      const done = scoped.filter((i) => i.checked).length
      if (scoped.length > 0 && done > 0 && done < scoped.length) {
        const country = COUNTRIES.find((c) => c.name.toLowerCase() === dest.name.trim().toLowerCase())
        return {
          countryName: dest.name,
          countryCode: country?.code ?? null,
          title: `Continue comparing ${CATEGORY_LABEL[key]}`,
          detail: `${done} of ${scoped.length} ${label.toLowerCase()} items checked for ${dest.name}.`,
          cta: 'Continue research',
          href: '/command-center',
        }
      }
    }
  }

  // 2. A destination with some Command Center progress but no part-way category.
  const started = board.destinations.find((d) => destinationProgress(board.items, d.id).done > 0)
  if (started) {
    const progress = destinationProgress(board.items, started.id)
    const country = COUNTRIES.find((c) => c.name.toLowerCase() === started.name.trim().toLowerCase())
    return {
      countryName: started.name,
      countryCode: country?.code ?? null,
      title: `Continue researching ${started.name}`,
      detail: `${progress.done} of ${progress.total} research items checked.`,
      cta: 'Continue research',
      href: '/command-center',
    }
  }

  // 3. A document already moving through the pipeline.
  const movingDoc = plan?.documents.find((d) => d.status !== 'MISSING' && d.status !== 'APPROVED')
  if (movingDoc) {
    return {
      countryName: plan?.saved_nextination ?? null,
      countryCode: null,
      title: `Finish “${movingDoc.name}”`,
      detail: whenLine,
      cta: 'Open documents',
      href: '/command-center?tab=documents',
    }
  }

  // 4. An open task the user added themselves.
  const openTask = plan?.checklist.find((c) => !c.done && !c.isSystemTemplate)
  if (openTask) {
    return {
      countryName: plan?.saved_nextination ?? null,
      countryCode: null,
      title: openTask.text,
      detail: whenLine,
      cta: 'Open checklist',
      href: '/command-center?tab=my-plan&planTab=checklist',
    }
  }

  // 5. A saved destination with no other activity yet.
  if (plan?.saved_nextination) {
    const country = COUNTRIES.find((c) => c.name === plan.saved_nextination || c.slug === plan.saved_nextination)
    return {
      countryName: country?.name ?? plan.saved_nextination,
      countryCode: country?.code ?? null,
      title: `Start researching ${country?.name ?? plan.saved_nextination}`,
      detail: 'Your plan has this destination saved. Open its research workspace.',
      cta: 'Open destination',
      href: country ? `/nextinations/${country.slug}/v2/overview` : '/your-world',
    }
  }

  // 6. Nothing saved yet.
  if (!input.profileComplete) {
    return {
      countryName: null,
      countryCode: null,
      title: 'Finish your Kolmari Profile',
      detail: 'It unlocks Match Scores and pathway matching across every destination.',
      cta: 'Continue profile',
      href: '/profile-wizard',
    }
  }
  return {
    countryName: null,
    countryCode: null,
    title: 'Choose your first destination',
    detail: 'Open the world map and shortlist somewhere to start comparing.',
    cta: 'Explore destinations',
    href: '/your-world',
  }
}

// --- What's next -------------------------------------------------------------

export type NextTask = {
  id: string
  title: string
  /** One sentence on why this matters now. */
  why: string
  /** Typical effort for this kind of task, not a per-user estimate. */
  minutes: number | null
  cta: string
  href: string
  /** Shown behind "Why this?" — how Kolmari ordered it. */
  reason: string
}

/**
 * Up to three next-best actions in dependency order: profile before scoring,
 * destination before pathway, pathway before documents, budget before
 * affordability. Overdue real deadlines always jump the queue.
 */
export function buildNextActions(input: DashboardInput, shortlist: ShortlistItem[]): NextTask[] {
  const { plan, today, profileComplete } = input
  const tasks: NextTask[] = []
  const add = (t: NextTask) => { if (tasks.length < 3) tasks.push(t) }

  // Overdue items first — they are real, dated, and blocking.
  if (plan) {
    const overdue = plan.checklist.find((c) => !c.done && c.due && (daysUntil(c.due, today) ?? 0) < 0)
    if (overdue) {
      add({
        id: 'overdue-task',
        title: `Complete “${overdue.text}”`,
        why: 'This task is past the date you set for it.',
        minutes: null,
        cta: 'Open',
        href: '/command-center?tab=my-plan&planTab=checklist',
        reason: 'Overdue items rank first because everything scheduled after them slips.',
      })
    }
  }

  if (!profileComplete) {
    add({
      id: 'profile',
      title: 'Complete your Kolmari Profile',
      why: 'Match Scores and pathway eligibility stay unavailable until it is done.',
      minutes: 10,
      cta: 'Continue',
      href: '/profile-wizard',
      reason: 'Nothing Kolmari calculates is trustworthy without your household, income, and timeline.',
    })
  }

  const checks = plan ? readinessChecks(plan) : [false, false, false, false, false, false]
  const [hasDestination, hasPathway, hasDate, hasChecklist, hasBudget, hasDocuments] = checks

  if (!hasDestination && shortlist.length > 0) {
    add({
      id: 'save-destination',
      title: `Save a destination to your Kolmari Plan`,
      why: 'Your plan needs a destination before it can track documents or dates.',
      minutes: 2,
      cta: 'Choose',
      href: '/command-center',
      reason: 'Every downstream step — pathway, documents, budget — is scoped to a destination.',
    })
  } else if (!hasDestination) {
    add({
      id: 'first-destination',
      title: 'Shortlist your first destination',
      why: 'Kolmari can only compare and plan once you pick somewhere to look at.',
      minutes: 5,
      cta: 'Explore',
      href: '/your-world',
      reason: 'This is the entry point for the whole relocation decision.',
    })
  }

  if (hasDestination && !hasPathway) {
    add({
      id: 'pathway',
      title: 'Confirm your visa pathway',
      why: 'The route you qualify for determines your documents, costs, and timeline.',
      minutes: 15,
      cta: 'Compare',
      href: '/pathways',
      reason: 'Ranked above neighborhood and lifestyle research because it can rule a destination out entirely.',
    })
  }

  if (hasDestination && !hasBudget) {
    add({
      id: 'budget',
      title: 'Add your monthly relocation budget',
      why: 'This improves affordability estimates across your shortlist.',
      minutes: 5,
      cta: 'Add budget',
      href: '/command-center?tab=my-plan&planTab=budget',
      reason: 'Affordability comparisons stay blank until real figures exist to compare against.',
    })
  }

  if (shortlist.length >= 2) {
    add({
      id: 'compare',
      title: `Compare ${shortlist[0].name} and ${shortlist[1].name}`,
      why: 'You currently have two shortlisted destinations and no side-by-side yet.',
      minutes: 15,
      cta: 'Compare',
      href: '/command-center',
      reason: 'Comparing narrows the decision faster than researching either destination further alone.',
    })
  }

  if (hasPathway && !hasDocuments) {
    add({
      id: 'documents',
      title: 'Build your required document list',
      why: 'Your saved pathway has document requirements to collect and verify.',
      minutes: 10,
      cta: 'Open documents',
      href: '/command-center?tab=documents',
      reason: 'Documents take the longest lead time, so they start once a pathway is fixed.',
    })
  }

  if (hasDestination && !hasDate) {
    add({
      id: 'move-date',
      title: 'Set your target move date',
      why: 'Deadlines and document expirations are calculated back from this date.',
      minutes: 2,
      cta: 'Set date',
      href: '/command-center?tab=my-plan',
      reason: 'Without a date Kolmari cannot tell you what is urgent versus what can wait.',
    })
  }

  if (hasChecklist && plan) {
    const open = plan.checklist.find((c) => !c.done)
    if (open) {
      add({
        id: 'checklist',
        title: open.text,
        why: 'The next open task on your move checklist.',
        minutes: null,
        cta: 'Open',
        href: '/command-center?tab=my-plan&planTab=checklist',
        reason: 'Once your plan exists, the next incomplete checklist item becomes the continuation point.',
      })
    }
  }

  return tasks
}

// --- Ask Kolmari suggestions -------------------------------------------------

export function buildSuggestions(input: DashboardInput, shortlist: ShortlistItem[]): string[] {
  if (!input.profileComplete) {
    return [
      'Where can I realistically move?',
      'What should I know before I relocate abroad?',
      'What does Kolmari need from me to calculate matches?',
    ]
  }
  if (shortlist.length >= 2) {
    return [
      `Can I afford ${shortlist[0].name}?`,
      `What visa pathways fit me in ${shortlist[0].name}?`,
      `Compare ${shortlist[0].name} and ${shortlist[1].name}`,
    ]
  }
  if (shortlist.length === 1) {
    return [
      `Can I afford ${shortlist[0].name}?`,
      `What pathways fit me in ${shortlist[0].name}?`,
      `What should I research next about ${shortlist[0].name}?`,
    ]
  }
  return [
    'Where can I realistically move?',
    'Which countries fit my household?',
    'How much money would I need to relocate?',
  ]
}
