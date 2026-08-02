import type { Metadata } from 'next'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile, isPaid } from '@/lib/profile'
import {
  budgetEnteredCount,
  daysUntil,
  docCounts,
  formatShortDate,
  getNexitPlan,
  nextBestAction,
  readinessChecks,
  READINESS_LABELS,
  type NexitPlan,
} from '@/lib/kolmari-plan'
import { getPublishedGreenbookInsight } from '@/lib/greenbook'
import { COUNTRIES } from '@/lib/countries'
import { rankNextinations } from '@/lib/userProfile'
import { FlutterMode, type GreenbookSpot, type ProtocolItem, type ReadinessBar, type SavedDestination } from '@/components/kolmari/flutter-mode'
import { FlutterGate, type QuizResult } from '@/components/kolmari/flutter-gate'

export const metadata: Metadata = {
  title: 'Flutter Mode | Kolmari',
  description: 'The execution phase — work your requirements, track your application, and prepare to land.',
}

/** Legal & visa and financial readiness, derived only from what the plan records. */
function readinessBars(plan: NexitPlan | null): ReadinessBar[] {
  if (!plan) {
    return [
      { label: 'Legal & visa', pct: null, detail: 'No documents listed yet' },
      { label: 'Financial buffer', pct: null, detail: 'No budget figures entered yet' },
    ]
  }
  const docs = docCounts(plan)
  const budgetEntered = budgetEnteredCount(plan)
  const budgetLines = plan.budget.length
  return [
    {
      label: 'Legal & visa',
      pct: docs.total ? Math.round((docs.APPROVED / docs.total) * 100) : null,
      detail: docs.total ? `${docs.APPROVED} of ${docs.total} documents approved` : 'No documents listed yet',
    },
    {
      label: 'Financial buffer',
      pct: budgetLines ? Math.round((budgetEntered / budgetLines) * 100) : null,
      detail: budgetEntered ? `${budgetEntered} of ${budgetLines} cost areas entered` : 'No budget figures entered yet',
    },
  ]
}

/** Plan checklist items with their real state — never an eligibility claim. */
function protocolItems(plan: NexitPlan | null, today: Date): ProtocolItem[] {
  if (!plan) return []
  return plan.checklist.slice(0, 6).map((item) => {
    const overdue = !item.done && item.due !== null && (daysUntil(item.due, today) ?? 0) < 0
    return {
      id: item.id,
      text: item.text,
      state: item.done ? 'done' : overdue ? 'overdue' : 'open',
      meta: [item.stage ?? null, item.due ? `Due ${formatShortDate(item.due)}` : null].filter(Boolean).join(' · ') || 'No stage set',
    }
  })
}

/**
 * Flutter Mode — the execution phase. The plan is decided; this is where the
 * user works requirements off the list, tracks the application, and prepares to
 * land. Free shows the report's structure; Pro fills in the figures.
 *
 * Route: /flutter
 */
export default async function FlutterModePage() {
  const user = await requireCurrentUser()
  const [profile, plan] = await Promise.all([getProfile(user.id), getNexitPlan(user.id)])
  const ranked = profile.wizard_status === 'completed' ? rankNextinations(profile) : []

  if (!isPaid(profile)) {
    // Free: country names are readable, the scoring behind them is not.
    const countries = ranked.length ? ranked.map((item) => item.country) : COUNTRIES.slice(0, 4)
    const results: QuizResult[] = countries.slice(0, 4).map((country, index) => ({
      slug: country.slug, name: country.name, region: country.region, code: country.code, unlocked: index === 0,
    }))
    return <FlutterGate results={results} />
  }

  const today = new Date()
  const checks = plan ? readinessChecks(plan) : READINESS_LABELS.map(() => false)
  const readinessDone = checks.filter(Boolean).length
  const readinessPct = Math.round((readinessDone / checks.length) * 100)

  const destination = plan?.saved_nextination ?? null
  const country = destination
    ? COUNTRIES.find((item) => item.name === destination || item.slug === destination) ?? null
    : null
  const insight = country ? getPublishedGreenbookInsight(country.slug) : undefined
  const greenbook: GreenbookSpot = insight
    ? {
      city: insight.bestAreas[0] ?? country?.city ?? '',
      communityFit: insight.communityFit,
      note: insight.blackTravelerNote ?? insight.summary,
      sourceTitle: insight.sourceTitle,
      sourceUrl: insight.sourceUrl,
      lastReviewed: insight.lastReviewed,
    }
    : null

  const destinations: SavedDestination[] = ranked.length
    ? ranked.slice(0, 5).map((item) => ({
      slug: item.country.slug,
      name: `${item.country.city}, ${item.country.name}`,
      code: item.country.code,
      region: item.country.region,
      match: item.match.score,
      note: item.country.summary,
    }))
    : COUNTRIES.slice(0, 5).map((item) => ({
      slug: item.slug,
      name: `${item.city}, ${item.name}`,
      code: item.code,
      region: item.region,
      match: null,
      note: item.summary,
    }))

  const items = protocolItems(plan, today)
  const action = plan ? nextBestAction(plan) : null

  return (
    <FlutterMode
      initial={profile}
      destination={destination}
      readinessPct={readinessPct}
      readinessDone={readinessDone}
      readinessTotal={checks.length}
      bars={readinessBars(plan)}
      action={action}
      actionDue={action?.dueDate ? formatShortDate(action.dueDate) : null}
      protocolItems={items}
      protocolDone={items.filter((item) => item.state === 'done').length}
      greenbook={greenbook}
      destinations={destinations}
    />
  )
}
