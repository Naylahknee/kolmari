import Link from 'next/link'
import { requireCurrentUser } from '@/lib/auth'
import { COUNTRIES } from '@/lib/countries'
import {
  formatShortDate,
  getNexitPlan,
  journeyPercent,
  journeyStages,
  JOURNEY_STAGE_LABELS,
  journeyStageLabel,
  nextBestAction,
  PLAN_STAGES,
} from '@/lib/kolmari-plan'
import { getProfile, hasCompletedProfile } from '@/lib/profile'
import { rankNextinations } from '@/lib/userProfile'
import { DashboardDeadlinesCard, DashboardPlanningAreasCard } from '@/components/kolmari/dashboard-planning'
import {
  DashboardActivePathwayCard,
  DashboardDestinationsCard,
  type DestinationRow,
} from '@/components/kolmari/dashboard-side-cards'
import { DashboardWelcome } from '@/components/kolmari/dashboard-onboarding'
import { JourneyDrawer } from '@/components/kolmari/journey-drawer'

/** Last-saved time for the tracker footer, formatted server-side in UTC so the markup hydrates unchanged. */
function savedAtLabel(updatedAt: string | null): string | null {
  if (!updatedAt) return null
  const parsed = new Date(updatedAt)
  if (Number.isNaN(parsed.getTime())) return null
  return `${parsed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })} UTC`
}

export default async function DashboardPage() {
  const user = await requireCurrentUser()
  const [profile, plan] = await Promise.all([getProfile(user.id), getNexitPlan(user.id)])
  const today = new Date()

  const complete = hasCompletedProfile(profile)
  const firstName = profile.display_name || user.email.split('@')[0]
  const action = plan ? nextBestAction(plan) : null
  const currentStage = plan?.journey_stage ?? 1
  const firstVisitCandidate =
    !profile.dashboard_onboarding_completed &&
    profile.wizard_status === 'not_started' &&
    !plan

  // Kolmari Tracker rows come straight from the saved journey stage and checklist.
  const stageRows = journeyStages(plan, today)
  const percent = journeyPercent(stageRows, currentStage)

  const rankedList = complete ? rankNextinations(profile) : []
  const destinationRows: DestinationRow[] = rankedList.length > 0
    ? rankedList.slice(0, 2).map((item) => ({ country: item.country, match: item.match.score }))
    : COUNTRIES.slice(0, 2).map((country) => ({ country, match: null }))

  const savedCountry = plan?.saved_nextination
    ? COUNTRIES.find((c) => c.name === plan.saved_nextination || c.slug === plan.saved_nextination) ?? null
    : null

  const planHref = action && action.tab !== 'overview' ? `/my-plan?tab=${action.tab}` : '/my-plan'

  const pathwayDetail = plan?.selected_pathway
    ? 'Official requirements still control eligibility. Review the route before you file.'
    : complete
      ? 'No pathway saved to your plan yet. Compare the routes that fit your profile.'
      : 'Finish the Profile Wizard before Pathway signals are calculated.'

  return (
    <div className="flex flex-col gap-4">
      <DashboardWelcome firstName={firstName} firstVisitCandidate={firstVisitCandidate} profileComplete={complete} />

      <div>
        <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold-deep">Your relocation journey</p>
        <h1 className="mt-1.5 font-display text-[30px] font-bold tracking-[-0.01em] text-navy">Good morning, {firstName}</h1>
      </div>

      {!complete && (
        <section className="rounded-[var(--radius-card)] border border-gold/30 bg-gold-soft/50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="font-semibold text-navy">Complete your Profile to see personalized matches.</p>
            <p className="mt-1 text-sm text-muted">
              Until then, no budget, work setup, household type, Match Score, or readiness score is assumed.
            </p>
          </div>
          <Link href="/profile-wizard" className="gold-button mt-4 shrink-0 sm:mt-0">Start Wizard</Link>
        </section>
      )}

      {/* Content column + the Kolmari Tracker drawer. The drawer animates its own
          width, so this column reflows wider whenever it is collapsed. */}
      <div className="flex flex-col gap-4 min-[901px]:flex-row min-[901px]:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-4">

          <section
            className="rounded-[var(--radius-card)] px-[22px] py-5 text-white"
            style={{
              background: 'linear-gradient(135deg,#0d1b39 0%,#17305b 58%,#1b3f68 100%)',
              boxShadow: '0 10px 30px -18px rgba(13,27,57,.45)',
            }}
            aria-labelledby="next-action-heading"
          >
            <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold">Recommended next action</p>
            <h2 id="next-action-heading" className="mt-[9px] text-[20px] font-bold tracking-[-0.015em]">
              {action?.title ?? 'Start your Kolmari Plan'}
            </h2>
            <p className="mt-2 max-w-[56ch] text-[13.5px] leading-[1.62] text-white/80">
              {action?.detail ?? 'Choose your destination, pathway, and target move date to begin tracking your move.'}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-[9px]">
              <Link
                href={planHref}
                className="inline-flex items-center gap-[7px] rounded-[var(--radius-btn)] bg-gold px-[17px] py-2.5 text-[13px] font-bold text-navy-deep transition-colors duration-150 hover:bg-[#e0b40c]"
              >
                {action ? 'Open in My Plan' : 'Open My Plan'}
              </Link>
              {action?.dueDate && (
                <span className="rounded-[var(--radius-btn)] border border-white/24 px-[15px] py-2.5 text-[13px] font-semibold text-white">
                  Due {formatShortDate(action.dueDate)}
                </span>
              )}
              <span className="text-[12px] text-white/55">
                Stage {currentStage} of {PLAN_STAGES.length} · {JOURNEY_STAGE_LABELS[journeyStageLabel(currentStage)]}
              </span>
            </div>
          </section>

          <DashboardPlanningAreasCard plan={plan} profileComplete={complete} dependents={profile.dependents} />

          <div className="grid items-start gap-4 [grid-template-columns:repeat(auto-fit,minmax(252px,1fr))]">
            <DashboardDeadlinesCard plan={plan} today={today} />
            <DashboardDestinationsCard rows={destinationRows} ranked={rankedList.length > 0} />
            <DashboardActivePathwayCard
              pathway={plan?.selected_pathway ?? null}
              detail={pathwayDetail}
              countryName={savedCountry?.name ?? null}
              countrySlug={savedCountry?.slug ?? null}
            />
          </div>
        </div>

        <JourneyDrawer
          rows={stageRows}
          currentStage={currentStage}
          currentStageName={JOURNEY_STAGE_LABELS[journeyStageLabel(currentStage)]}
          percent={percent}
          totalStages={PLAN_STAGES.length}
          savedAt={savedAtLabel(plan?.updated_at ?? null)}
        />
      </div>
    </div>
  )
}
