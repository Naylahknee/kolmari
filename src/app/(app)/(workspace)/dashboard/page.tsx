import Link from 'next/link'
import { ArrowRight, CheckCircle2, Globe2, NotebookTabs, Route, Sparkles, UserRound, Wallet } from 'lucide-react'
import { requireCurrentUser } from '@/lib/auth'
import { COUNTRIES } from '@/lib/countries'
import {
  getNexitPlan,
  journeyStageLabel,
  nextBestAction,
  type PlanBudget,
} from '@/lib/kolmari-plan'
import { evaluatePathways } from '@/lib/pathways'
import { getProfile, hasCompletedProfile, isPaid } from '@/lib/profile'
import { rankNextinations } from '@/lib/userProfile'
import { BudgetDonut, BUDGET_COLORS, type BudgetSlice } from '@/components/kolmari/rings'
import { DashboardDestinations, type DestinationPanel } from '@/components/kolmari/dashboard-destinations'
import { DashboardPlanningColumn } from '@/components/kolmari/dashboard-planning'
import { DashboardWelcome } from '@/components/kolmari/dashboard-onboarding'
import { DestinationVisaPlanner, type PlannerDestination, type PlannerPathway } from '@/components/kolmari/destination-visa-planner'
import { KolmariTracker } from '@/components/kolmari/kolmari-tracker'

const BUDGET_LABELS: Record<keyof PlanBudget, string> = {
  housing: 'Housing',
  food: 'Food',
  transport: 'Transport',
  healthcare: 'Healthcare',
  other: 'Other',
}

function budgetSlices(budget: PlanBudget): BudgetSlice[] {
  return (Object.keys(BUDGET_LABELS) as (keyof PlanBudget)[])
    .map((key, index) => ({ label: BUDGET_LABELS[key], amount: budget[key] ?? 0, color: BUDGET_COLORS[index % BUDGET_COLORS.length] }))
    .filter((slice) => slice.amount > 0)
}

export default async function DashboardPage() {
  const user = await requireCurrentUser()
  const [profile, plan] = await Promise.all([getProfile(user.id), getNexitPlan(user.id)])
  const complete = hasCompletedProfile(profile)
  const paid = isPaid(profile)
  const firstName = profile.display_name || user.email.split('@')[0]
  const evaluated = complete ? evaluatePathways(profile) : []
  const strong = evaluated.filter((item) => item.status === 'Strong Match')
  const selectedPathway = plan?.selected_pathway
    ? evaluated.find((item) => `${item.country} — ${item.name}` === plan.selected_pathway)
    : null
  const slices = plan ? budgetSlices(plan.budget) : []
  const budgetTotal = slices.reduce((sum, slice) => sum + slice.amount, 0)
  const action = plan ? nextBestAction(plan) : null
  const currentStage = plan?.journey_stage ?? 1
  const firstVisitCandidate =
    !profile.dashboard_onboarding_completed &&
    profile.wizard_status === 'not_started' &&
    !plan

  const rankedList = complete ? rankNextinations(profile) : []
  const destinationPanels: DestinationPanel[] = rankedList.length > 0
    ? rankedList.slice(0, 3).map((item) => ({ country: item.country, match: item.match.score }))
    : COUNTRIES.slice(0, 3).map((country) => ({ country, match: null }))
  const destinationsRanked = rankedList.length > 0

  // Retain the existing Explorer-tier planner below the merged dashboard.
  const pathwaysFor = (name: string): PlannerPathway[] =>
    evaluated
      .filter((pathway) => pathway.country === name)
      .map((pathway) => ({ id: pathway.id, name: pathway.name, category: pathway.category, status: pathway.status }))
  const plannerBase = rankedList.length > 0
    ? rankedList.map((item) => ({ country: item.country, match: item.match.score as number | null }))
    : COUNTRIES.map((country) => ({ country, match: null as number | null }))
  const plannerDestinations: PlannerDestination[] = plannerBase.map(({ country, match }, index) => ({
    slug: country.slug,
    name: country.name,
    code: country.code,
    city: country.city,
    region: country.region,
    visaType: country.visaType,
    match,
    locked: index >= 3,
    pathways: pathwaysFor(country.name),
  }))

  const planHref = action && action.tab !== 'overview' ? `/my-plan?tab=${action.tab}` : '/my-plan'
  const pathwayValue = plan?.selected_pathway ?? (complete ? `${strong.length} strong signal${strong.length === 1 ? '' : 's'}` : '—')
  const pathwayDetail = plan?.selected_pathway
    ? selectedPathway?.status ?? 'Selected pathway'
    : 'Compare the routes that fit your profile.'

  return (
    <div className="space-y-6">
      <DashboardWelcome firstName={firstName} firstVisitCandidate={firstVisitCandidate} profileComplete={complete} />

      <KolmariTracker currentStage={currentStage} />

      {!complete && (
        <section className="rounded-[var(--radius-card)] border border-gold/30 bg-gold-soft/50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="font-semibold text-navy">Complete your Profile to see personalized matches.</p>
            <p className="mt-1 text-sm text-muted">
              Until then, no budget, work setup, household type, Match Score, or readiness score is assumed.
            </p>
          </div>
          <Link href="/profile-wizard" className="gold-button mt-4 shrink-0 sm:mt-0">
            Start Wizard
          </Link>
        </section>
      )}

      <section aria-labelledby="continue-heading">
        <h2 id="continue-heading" className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">
          Continue where you left off
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={UserRound}
            label="Profile"
            value={complete ? 'Complete' : 'Not started'}
            href="/profile-wizard"
            action={complete ? 'Edit profile' : 'Start Wizard'}
          />
          <StatCard
            icon={Route}
            label="Strong Pathway signals"
            value={pathwayValue}
            detail={pathwayDetail}
            href="/pathways"
            action="Review Pathways"
          />
          <StatCard
            icon={NotebookTabs}
            label="Plan stage"
            value={plan ? journeyStageLabel(plan.journey_stage) : 'Not started'}
            detail={action?.title}
            href={planHref}
            action={action ? 'Take Action' : 'Open My Plan'}
          />
          <StatCard
            icon={CheckCircle2}
            label="Saved plan tasks"
            value={plan ? String(plan.checklist.length) : '0'}
            href="/flutter"
            action="Open Flutter Mode"
          />
        </div>
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <DashboardDestinations panels={destinationPanels} ranked={destinationsRanked} />
        <DashboardPlanningColumn plan={plan} profileComplete={complete} dependents={profile.dependents} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card-surface p-6" aria-labelledby="budget-heading">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Budget</p>
              <h2 id="budget-heading" className="mt-1 text-lg font-bold text-navy">Monthly cost snapshot</h2>
            </div>
            <span className="grid size-10 place-items-center rounded-[var(--radius-field)] bg-gold-soft" aria-hidden="true">
              <Wallet size={17} />
            </span>
          </div>
          {budgetTotal > 0 ? (
            <div className="mt-5">
              <BudgetDonut slices={slices} total={budgetTotal} />
            </div>
          ) : (
            <div className="mt-4 rounded-[var(--radius-field)] bg-canvas p-4 text-sm text-muted">
              Add your monthly budget in the Cost Calculator to see your budget breakdown.
              <Link href="/cost-calculator" className="mt-2 flex items-center gap-1 text-xs font-bold text-gold-deep">
                Open Cost Calculator <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </section>

        <section className="card-surface p-6" aria-labelledby="pathways-heading">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Pathways</p>
              <h2 id="pathways-heading" className="mt-1 text-lg font-bold text-navy">
                Your Pathway matches
              </h2>
            </div>
            <Globe2 size={20} className="mt-1 shrink-0 text-muted" aria-hidden="true" />
          </div>
          {complete ? (
            <>
              <p className="mt-3 text-sm text-muted">
                Your saved goals currently show {strong.length} strong Pathway signal{strong.length === 1 ? '' : 's'}. Official requirements still control eligibility.
              </p>
              {strong.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {strong.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-[var(--radius-field)] bg-canvas px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-navy">{item.country} — {item.name}</p>
                        <p className="text-xs text-ok">{item.status}</p>
                      </div>
                      <ArrowRight size={14} className="text-muted" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-[var(--radius-field)] bg-canvas px-4 py-3 text-sm text-muted">
                  No strong signals yet. Review Possible Matches and missing requirements in Pathways.
                </div>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm text-muted">
              Finish the Profile Wizard before Pathway signals are calculated.
            </p>
          )}
          <Link href={complete ? '/pathways' : '/profile-wizard'} className="gold-button mt-5 inline-flex items-center gap-2">
            {complete ? 'View My Pathways' : 'Build My Kolmari Plan'} <ArrowRight size={15} />
          </Link>
        </section>
      </div>

      {!paid && (
        <DestinationVisaPlanner
          destinations={plannerDestinations}
          ranked={destinationsRanked}
          profileComplete={complete}
        />
      )}

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] border border-line bg-white px-5 py-4 shadow-tile" aria-label="Stay on track">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-field)] bg-gold-soft text-gold-deep" aria-hidden="true">
            <Sparkles size={16} />
          </span>
          <div>
            <p className="text-sm font-bold text-navy">Stay on track!</p>
            <p className="text-xs text-muted">Keep your next action, deadlines, and move stage moving forward.</p>
          </div>
        </div>
        <Link href="/my-plan" className="rounded-[var(--radius-btn)] bg-navy px-4 py-2 text-xs font-bold text-white transition hover:bg-navy-deep">
          View My Plan
        </Link>
      </section>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  href,
  action,
}: {
  icon: typeof Globe2
  label: string
  value: string
  detail?: string
  href: string
  action: string
}) {
  return (
    <article className="card-surface flex min-h-[154px] flex-col p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-field)] bg-gold-soft" aria-hidden="true">
          <Icon size={16} />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted">{label}</p>
          <p className="mt-0.5 line-clamp-2 font-bold text-navy">{value}</p>
          {detail && <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{detail}</p>}
        </div>
      </div>
      <Link href={href} className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-bold text-gold-deep">
        {action} <ArrowRight size={12} />
      </Link>
    </article>
  )
}
