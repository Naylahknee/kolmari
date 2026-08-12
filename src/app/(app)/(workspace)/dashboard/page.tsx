import { requireCurrentUser } from '@/lib/auth'
import { COUNTRIES } from '@/lib/countries'
import {
  journeyPercent,
  journeyStages,
  JOURNEY_STAGE_LABELS,
  journeyStageLabel,
  PLAN_STAGES,
  getKolmariPlan,
} from '@/lib/kolmari-plan'
import { getProfile, hasCompletedProfile } from '@/lib/profile'
import { rankNextinations } from '@/lib/userProfile'
import { getBoard } from '@/lib/command-center'
import { getDashboardLayout } from '@/lib/dashboard-layout-store'
import { visibleWidgets, type WidgetId } from '@/lib/dashboard-layout'
import { getGeneratedHeroVersion } from '@/lib/country-assets'
import { getApprovedHero } from '@/lib/country-visuals/data'
import {
  buildNextActions,
  buildShortlist,
  buildSuggestions,
  type DashboardInput,
} from '@/lib/dashboard-model'
import { DecisionWorkspaceStarter } from '@/components/kolmari/decision-workspace-starter'
import { DashboardWelcome } from '@/components/kolmari/dashboard-onboarding'
import { DashboardCommandCenterCard } from '@/components/kolmari/dashboard-command-center'
import { DashboardDeadlinesCard, DashboardPlanningAreasCard } from '@/components/kolmari/dashboard-planning'
import { DashboardFoodHealthCard } from '@/components/kolmari/dashboard-food-health'
import {
  DashboardActivePathwayCard,
  DashboardDestinationsCard,
  type DestinationRow,
} from '@/components/kolmari/dashboard-side-cards'
import { JourneyTracker } from '@/components/kolmari/dashboard/journey-tracker'
import { NextActionCard, ShortlistPanel } from '@/components/kolmari/dashboard/panels'
import '@/styles/journey-tracker.css'

/**
 * The dashboard. Panels are chosen and ordered by the user in
 * Account → Dashboard; `DASHBOARD_WIDGETS` holds the shipped default. The
 * Journey tracker is not one of those panels — it stays docked to the right of
 * the content column at every layout.
 */

/** Last-saved stamp for the tracker footer, formatted in UTC so markup hydrates unchanged. */
function savedAtLabel(updatedAt: string | null): string | null {
  if (!updatedAt) return null
  const parsed = new Date(updatedAt)
  if (Number.isNaN(parsed.getTime())) return null
  return `${parsed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })} UTC`
}

async function destinationRow(country: (typeof COUNTRIES)[number], match: number | null): Promise<DestinationRow> {
  const generatedVersion = await getGeneratedHeroVersion(country.slug)
  const approved = generatedVersion ? null : getApprovedHero(country.slug)
  const imageSrc = generatedVersion
    ? `/api/country-asset?slug=${country.slug}&type=hero&v=${generatedVersion}`
    : approved?.src ?? null

  return { country, match, imageSrc }
}

export default async function DashboardPage() {
  const user = await requireCurrentUser()
  const [profile, plan, board, layout] = await Promise.all([
    getProfile(user.id),
    getKolmariPlan(user.id),
    getBoard(user.id),
    getDashboardLayout(user.id),
  ])
  const today = new Date()

  const complete = hasCompletedProfile(profile)
  const firstName = profile.display_name || user.email.split('@')[0]
  const currentStage = plan?.journey_stage ?? 1
  const stageRows = journeyStages(plan, today)
  const percent = journeyPercent(stageRows, currentStage)
  const stageName = JOURNEY_STAGE_LABELS[journeyStageLabel(currentStage)]

  const firstVisitCandidate =
    !profile.dashboard_onboarding_completed &&
    profile.wizard_status === 'not_started' &&
    !plan

  const rankedList = complete ? rankNextinations(profile) : []
  const input: DashboardInput = {
    plan,
    board,
    profile: {
      display_name: profile.display_name,
      wizard_status: profile.wizard_status,
      dashboard_onboarding_completed: profile.dashboard_onboarding_completed,
    },
    profileComplete: complete,
    ranked: rankedList.map((item) => ({ country: item.country, score: item.match.score })),
    today,
  }

  const shortlist = buildShortlist(input)
  const tasks = buildNextActions(input, shortlist)
  const suggestions = buildSuggestions(input, shortlist)

  const destinationRows: DestinationRow[] = rankedList.length > 0
    ? await Promise.all(rankedList.slice(0, 3).map((item) => destinationRow(item.country, item.match.score)))
    : await Promise.all(COUNTRIES.slice(0, 3).map((country) => destinationRow(country, null)))

  const savedCountry = plan?.saved_nextination
    ? COUNTRIES.find((c) => c.name === plan.saved_nextination || c.slug === plan.saved_nextination) ?? null
    : null

  const pathwayDetail = plan?.selected_pathway
    ? 'Official requirements still control eligibility. Review the route before you file.'
    : complete
      ? 'No pathway saved to your plan yet. Compare the routes that fit your profile.'
      : 'Finish the Profile Wizard before Pathway signals are calculated.'

  // Each widget renders on demand, so a panel the user turned off costs nothing.
  const PANELS: Record<WidgetId, () => React.ReactNode> = {
    nextAction: () => (
      <NextActionCard
        task={tasks[0]}
        stageLine={`Stage ${currentStage} of ${PLAN_STAGES.length} · ${stageName}`}
      />
    ),
    planningAreas: () => (
      <DashboardPlanningAreasCard plan={plan} profileComplete={complete} dependents={profile.dependents} />
    ),
    deadlines: () => <DashboardDeadlinesCard plan={plan} today={today} />,
    destinations: () => <DashboardDestinationsCard rows={destinationRows} ranked={rankedList.length > 0} />,
    activePathway: () => (
      <DashboardActivePathwayCard
        pathway={plan?.selected_pathway ?? null}
        detail={pathwayDetail}
        countryName={savedCountry?.name ?? null}
        countrySlug={savedCountry?.slug ?? null}
      />
    ),
    askKolmari: () => <DecisionWorkspaceStarter suggestions={suggestions} />,
    shortlist: () => (
      <ShortlistPanel items={shortlist} ranked={complete && shortlist.some((s) => s.score !== null)} />
    ),
    foodHealth: () => (
      <DashboardFoodHealthCard countrySlug={savedCountry?.slug ?? null} countryName={savedCountry?.name ?? null} />
    ),
    commandCenter: () => <DashboardCommandCenterCard board={board} />,
  }

  // Full-width panels stack; compact panels share an auto-fit row. Destination
  // matches are full-width because their canonical template is a 1→3 card grid.
  const shown = visibleWidgets(layout)
  const FULL: WidgetId[] = ['nextAction', 'planningAreas', 'destinations', 'askKolmari', 'shortlist', 'foodHealth', 'commandCenter']
  const blocks: { kind: 'full' | 'row'; ids: WidgetId[] }[] = []
  for (const id of shown) {
    const isFull = FULL.includes(id)
    const last = blocks[blocks.length - 1]
    if (isFull) blocks.push({ kind: 'full', ids: [id] })
    else if (last?.kind === 'row') last.ids.push(id)
    else blocks.push({ kind: 'row', ids: [id] })
  }

  return (
    <div className="flex flex-col gap-4">
      <DashboardWelcome firstName={firstName} firstVisitCandidate={firstVisitCandidate} profileComplete={complete} />

      {/* Content column + the docked Journey tracker. The tracker animates its
          own width, so this column reflows wider whenever it is collapsed. */}
      <div className="flex flex-col gap-4 min-[861px]:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {shown.length === 0 && (
            <p className="rounded-[var(--radius-card)] border border-dashed border-line-strong bg-white px-4 py-8 text-center text-sm text-muted">
              Every dashboard panel is hidden. Turn them back on in Account → Dashboard.
            </p>
          )}

          {blocks.map((block, index) =>
            block.kind === 'full' ? (
              <div key={`${block.ids[0]}-${index}`}>{PANELS[block.ids[0]]()}</div>
            ) : (
              <div
                key={`row-${index}`}
                className="grid items-start gap-4 [grid-template-columns:repeat(auto-fit,minmax(252px,1fr))]"
              >
                {block.ids.map((id) => <div key={id}>{PANELS[id]()}</div>)}
              </div>
            ),
          )}
        </div>

        <JourneyTracker
          rows={stageRows}
          currentStage={currentStage}
          currentStageName={stageName}
          percent={percent}
          totalStages={PLAN_STAGES.length}
          savedAt={savedAtLabel(plan?.updated_at ?? null)}
        />
      </div>
    </div>
  )
}
