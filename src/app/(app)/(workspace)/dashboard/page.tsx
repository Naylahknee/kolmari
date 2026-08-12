import { requireCurrentUser } from '@/lib/auth'
import { COUNTRIES } from '@/lib/countries'
import { journeyPercent, journeyStages, JOURNEY_STAGE_LABELS, journeyStageLabel, PLAN_STAGES, getKolmariPlan } from '@/lib/kolmari-plan'
import { getProfile, hasCompletedProfile, isPaid } from '@/lib/profile'
import { rankNextinations } from '@/lib/userProfile'
import { getBoard } from '@/lib/command-center'
import { getDashboardLayout } from '@/lib/dashboard-layout-store'
import { visibleWidgets, type WidgetId } from '@/lib/dashboard-layout'
import { getGeneratedDashboardDestinationVersion } from '@/lib/country-assets'
import { getApprovedDashboardDestination } from '@/lib/country-visuals/data'
import { buildNextActions, buildShortlist, buildSuggestions, type DashboardInput } from '@/lib/dashboard-model'
import { DecisionWorkspaceStarter } from '@/components/kolmari/decision-workspace-starter'
import { DashboardWelcome } from '@/components/kolmari/dashboard-onboarding'
import { DashboardCommandCenterCard } from '@/components/kolmari/dashboard-command-center'
import { DashboardDeadlinesCard, DashboardPlanningAreasCard } from '@/components/kolmari/dashboard-planning'
import { DashboardFoodHealthCard } from '@/components/kolmari/dashboard-food-health'
import { DashboardActivePathwayCard, DashboardDestinationsCard, type DestinationRow } from '@/components/kolmari/dashboard-side-cards'
import { JourneyTracker } from '@/components/kolmari/dashboard/journey-tracker'
import { NextActionCard, ShortlistPanel } from '@/components/kolmari/dashboard/panels'
import '@/styles/journey-tracker.css'

function savedAtLabel(updatedAt: string | null): string | null {
  if (!updatedAt) return null
  const parsed = new Date(updatedAt)
  if (Number.isNaN(parsed.getTime())) return null
  return `${parsed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })} UTC`
}

async function destinationRow(country: ReturnType<typeof rankNextinations>[number]['country'], match: number): Promise<DestinationRow> {
  const generatedVersion = await getGeneratedDashboardDestinationVersion(country.slug)
  const approved = generatedVersion ? null : getApprovedDashboardDestination(country.slug)
  return {
    country,
    match,
    imageSrc: generatedVersion ? `/api/country-asset?slug=${country.slug}&type=dashboard_destination&v=${generatedVersion}` : approved?.src ?? `/flags-png/${country.code.toLowerCase()}.png`,
    focalPoint: approved?.focalPoint ?? { x: 50, y: 50 },
  }
}

export default async function DashboardPage() {
  const user = await requireCurrentUser()
  const [profile, plan, board, layout] = await Promise.all([getProfile(user.id), getKolmariPlan(user.id), getBoard(user.id), getDashboardLayout(user.id)])
  const today = new Date()
  const complete = hasCompletedProfile(profile)
  const trackerUnlocked = isPaid(profile)
  const firstName = profile.display_name || user.email.split('@')[0]
  const currentStage = plan?.journey_stage ?? 1
  const stageRows = journeyStages(plan, today)
  const percent = journeyPercent(stageRows, currentStage)
  const stageName = JOURNEY_STAGE_LABELS[journeyStageLabel(currentStage)]
  const firstVisitCandidate = !profile.dashboard_onboarding_completed && profile.wizard_status === 'not_started' && !plan
  const rankedList = complete ? rankNextinations(profile) : []
  const input: DashboardInput = {
    plan, board,
    profile: { display_name: profile.display_name, wizard_status: profile.wizard_status, dashboard_onboarding_completed: profile.dashboard_onboarding_completed },
    profileComplete: complete,
    ranked: rankedList.map((item) => ({ country: item.country, score: item.match.score })),
    today,
  }
  const shortlist = buildShortlist(input)
  const tasks = buildNextActions(input, shortlist)
  const suggestions = buildSuggestions(input, shortlist)
  const destinationRows: DestinationRow[] = complete ? await Promise.all(rankedList.slice(0, 3).map((item) => destinationRow(item.country, item.match.score))) : []
  const savedCountry = plan?.saved_nextination ? COUNTRIES.find((country) => country.name === plan.saved_nextination || country.slug === plan.saved_nextination) ?? null : null
  const pathwayDetail = plan?.selected_pathway ? 'Official requirements still control eligibility. Review the route before you file.' : complete ? 'No pathway saved to your plan yet. Compare the routes that fit your profile.' : 'Finish the Profile Wizard before Pathway signals are calculated.'
  const journeyProps = { rows: stageRows, currentStage, currentStageName: stageName, percent, totalStages: PLAN_STAGES.length, savedAt: savedAtLabel(plan?.updated_at ?? null) }

  const PANELS: Record<WidgetId, () => React.ReactNode> = {
    nextAction: () => <NextActionCard task={tasks[0]} stageLine={`Stage ${currentStage} of ${PLAN_STAGES.length} · ${stageName}`} />,
    planningAreas: () => <DashboardPlanningAreasCard plan={plan} profileComplete={complete} dependents={profile.dependents} />,
    deadlines: () => <DashboardDeadlinesCard plan={plan} today={today} />,
    destinations: () => <DashboardDestinationsCard rows={destinationRows} profileComplete={complete} />,
    activePathway: () => <DashboardActivePathwayCard pathway={plan?.selected_pathway ?? null} detail={pathwayDetail} countryName={savedCountry?.name ?? null} countrySlug={savedCountry?.slug ?? null} />,
    askKolmari: () => <DecisionWorkspaceStarter suggestions={suggestions} />,
    shortlist: () => <ShortlistPanel items={shortlist} ranked={complete && shortlist.some((item) => item.score !== null)} />,
    foodHealth: () => <DashboardFoodHealthCard countrySlug={savedCountry?.slug ?? null} countryName={savedCountry?.name ?? null} />,
    commandCenter: () => <DashboardCommandCenterCard board={board} />,
    journeyTracker: () => trackerUnlocked ? <JourneyTracker {...journeyProps} mode="panel" /> : null,
  }

  const main = visibleWidgets(layout, 'main').filter((id) => id !== 'journeyTracker' || trackerUnlocked)
  const side = visibleWidgets(layout, 'side').filter((id) => id !== 'journeyTracker' || trackerUnlocked)
  const headerJourney = trackerUnlocked && layout.journeyPlacement === 'header' && !layout.disabled.includes('journeyTracker')
  const hasSide = side.length > 0

  return (
    <div className="flex flex-col gap-4">
      {headerJourney && <JourneyTracker {...journeyProps} mode="header" />}
      <DashboardWelcome firstName={firstName} firstVisitCandidate={firstVisitCandidate} profileComplete={complete} planTier={profile.plan} />
      {main.length === 0 && side.length === 0 ? (
        <p className="rounded-[var(--radius-card)] border border-dashed border-line-strong bg-white px-4 py-8 text-center text-sm text-muted">Every dashboard panel is hidden. Turn them back on in Account → Dashboard.</p>
      ) : (
        <div className={hasSide ? 'grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]' : 'min-w-0'}>
          <div className="flex min-w-0 flex-col gap-4">{main.map((id) => <div key={id}>{PANELS[id]()}</div>)}</div>
          {hasSide && <aside className="flex min-w-0 flex-col gap-4" aria-label="Dashboard planning status">{side.map((id) => <div key={id}>{PANELS[id]()}</div>)}</aside>}
        </div>
      )}
    </div>
  )
}
