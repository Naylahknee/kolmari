import Link from 'next/link'
import { ArrowRight, CheckCircle2, Globe2, ListChecks, NotebookTabs, Route, UserRound, Wallet } from 'lucide-react'
import { requireCurrentUser } from '@/lib/auth'
import { COUNTRIES, countryFlag } from '@/lib/countries'
import { getNexitPlan, PLAN_STAGES, type PlanBudget } from '@/lib/nexit-plan'
import { evaluatePathways } from '@/lib/pathways'
import { getProfile, hasCompletedProfile } from '@/lib/profile'
import { BudgetDonut, BUDGET_COLORS, ScoreRing, type BudgetSlice } from '@/components/nexit/rings'

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
  const firstName = profile.display_name || user.email.split('@')[0]
  const strong = complete ? evaluatePathways(profile).filter((item) => item.status === 'Strong Match') : []
  const stageIndex = plan ? PLAN_STAGES.indexOf(plan.timeline_stage) : -1
  const timelineProgress = stageIndex >= 0 ? Math.round(((stageIndex + 1) / PLAN_STAGES.length) * 100) : 0
  const slices = plan ? budgetSlices(plan.budget) : []
  const budgetTotal = slices.reduce((sum, slice) => sum + slice.amount, 0)

  return (
    <div className="space-y-6">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Your Kolmari workspace</p>
          <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-1 text-sm text-muted">Continue building your move plan.</p>
        </div>
        <Link
          href={complete ? '/flutter' : '/profile-wizard'}
          className="gold-button"
        >
          {complete ? 'Enter Flutter Mode' : 'Build My Move Plan'} <ArrowRight size={16} />
        </Link>
      </div>

      {/* Profile incomplete notice */}
      {!complete && (
        <section className="rounded-[var(--radius-card)] border border-gold/30 bg-gold-soft/50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="font-semibold text-navy">Complete your Kolmari Profile to see personalized matches.</p>
            <p className="mt-1 text-sm text-muted">
              Until then, no budget, work setup, household type, Match Score, or readiness score is assumed.
            </p>
          </div>
          <Link href="/profile-wizard" className="gold-button mt-4 shrink-0 sm:mt-0">
            Start Wizard
          </Link>
        </section>
      )}

      {/* ── Section 1 — Continue where you left off ──────────────────────── */}
      <section aria-labelledby="continue-heading">
        <h2 id="continue-heading" className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">
          Continue where you left off
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={UserRound}   label="Kolmari Profile"       value={complete ? 'Complete' : 'Not started'} href="/profile-wizard" action={complete ? 'Edit profile' : 'Start Wizard'} />
          <StatCard icon={Route}       label="Strong Pathway signals" value={complete ? String(strong.length) : '—'}     href="/pathways"      action="Review Pathways" />
          <StatCard icon={NotebookTabs} label="Plan stage"            value={plan?.timeline_stage ?? 'Not started'} href="/nexit-plan"     action="Open My Plan" />
          <StatCard icon={CheckCircle2} label="Saved plan tasks"      value={plan ? String(plan.checklist.length) : '0'} href="/flutter" action="Open Flutter Mode" />
        </div>
      </section>

      {/* ── Section 2 — Your Nextinations ────────────────────────────────── */}
      <section aria-labelledby="nextinations-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="nextinations-heading" className="text-xs font-bold uppercase tracking-widest text-muted">
            Destinations to explore
          </h2>
          <Link href="/nexitnation?view=countries" className="text-xs font-bold text-gold-deep hover:text-navy">
            View all
          </Link>
        </div>
        <div className="card-surface divide-y divide-line">
          {COUNTRIES.slice(0, 3).map((country) => (
            <Link
              key={country.slug}
              href={`/nextinations/${country.slug}`}
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-canvas"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">{countryFlag(country.code)}</span>
                <div>
                  <p className="font-semibold text-navy">{country.name}</p>
                  <p className="text-xs text-muted">{country.city} · {country.region}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div className="hidden sm:block">
                  <p className="text-xs text-muted">Common route</p>
                  <p className="text-xs font-semibold text-navy">{country.visaType}</p>
                </div>
                <ArrowRight size={15} className="text-muted" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Section 3 — Your Nexit Plan ──────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card-surface p-6" aria-labelledby="plan-heading">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Progress Tracker</p>
              <h2 id="plan-heading" className="mt-1 text-lg font-bold text-navy">Move Timeline</h2>
            </div>
            <span className="grid size-10 place-items-center rounded-[var(--radius-field)] bg-gold-soft" aria-hidden="true">
              <ListChecks size={17} />
            </span>
          </div>
          {plan ? (
            <div className="mt-5 flex items-center gap-5">
              <ScoreRing value={timelineProgress} label="Timeline" />
              <div className="min-w-0">
                <p className="text-xs text-muted">Current stage</p>
                <p className="font-bold text-navy">{plan.timeline_stage}</p>
                <p className="mt-0.5 text-xs text-muted">{plan.checklist.length} saved task{plan.checklist.length === 1 ? '' : 's'}</p>
                <Link href="/flutter" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-gold-deep">
                  Open Flutter Mode <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-[var(--radius-field)] bg-canvas p-4 text-sm text-muted">
              Start your Move Plan to track your relocation timeline.
              <Link href="/nexit-plan" className="mt-2 flex items-center gap-1 text-xs font-bold text-gold-deep">
                Open My Plan <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </section>

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
      </div>

      {/* ── Section 4 — Recent activity / Pathways signal ────────────────── */}
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
        <Link
          href={complete ? '/pathways' : '/profile-wizard'}
          className="gold-button mt-5 inline-flex items-center gap-2"
        >
          {complete ? 'View My Pathways' : 'Build My Move Plan'} <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  action,
}: {
  icon: typeof Globe2
  label: string
  value: string
  href: string
  action: string
}) {
  return (
    <article className="card-surface p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-field)] bg-gold-soft" aria-hidden="true">
          <Icon size={16} />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted">{label}</p>
          <p className="mt-0.5 truncate font-bold text-navy">{value}</p>
        </div>
      </div>
      <Link href={href} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-gold-deep">
        {action} <ArrowRight size={12} />
      </Link>
    </article>
  )
}
