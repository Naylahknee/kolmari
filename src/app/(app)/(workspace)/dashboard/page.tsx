import { requireCurrentUser } from '@/lib/auth'
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
import {
  buildAlerts,
  buildNextActions,
  buildOrientation,
  buildResume,
  buildShortlist,
  buildSuggestions,
  type DashboardInput,
} from '@/lib/dashboard-model'
import { DecisionWorkspaceStarter } from '@/components/kolmari/decision-workspace-starter'
import { DashboardWelcome } from '@/components/kolmari/dashboard-onboarding'
import { Greeting } from '@/components/kolmari/dashboard/greeting'
import {
  AttentionPanel,
  JourneyPanel,
  LearningNote,
  NextActionsPanel,
  OrientationHeader,
  ResumePanel,
  ShortlistPanel,
} from '@/components/kolmari/dashboard/panels'

/**
 * The dashboard is a continuation and decision workspace, not an analytics page.
 * It answers five questions and nothing else: where did I leave off, what should
 * I do next, is anything waiting for me, how far along am I, and what can I ask
 * Kolmari right now.
 *
 * Detailed surfaces live one level deeper on their own pages — planning-area
 * coverage and deadlines in My Plan, stage management in the My Plan journey
 * stepper, destination browsing in Your World, comparison in the Command Center,
 * and route detail in Kolmari Pathways.
 */
export default async function DashboardPage() {
  const user = await requireCurrentUser()
  const [profile, plan, board] = await Promise.all([
    getProfile(user.id),
    getKolmariPlan(user.id),
    getBoard(user.id),
  ])
  const today = new Date()

  const complete = hasCompletedProfile(profile)
  const firstName = profile.display_name || user.email.split('@')[0]
  const currentStage = plan?.journey_stage ?? 1
  const stageRows = journeyStages(plan, today)
  const percent = journeyPercent(stageRows, currentStage)

  const firstVisitCandidate =
    !profile.dashboard_onboarding_completed &&
    profile.wizard_status === 'not_started' &&
    !plan

  const input: DashboardInput = {
    plan,
    board,
    profile: {
      display_name: profile.display_name,
      wizard_status: profile.wizard_status,
      dashboard_onboarding_completed: profile.dashboard_onboarding_completed,
    },
    profileComplete: complete,
    ranked: complete
      ? rankNextinations(profile).map((item) => ({ country: item.country, score: item.match.score }))
      : [],
    today,
  }

  const shortlist = buildShortlist(input)
  const resume = buildResume(input)
  const tasks = buildNextActions(input, shortlist)
  const alerts = buildAlerts(input)
  const suggestions = buildSuggestions(input, shortlist)
  const orientation = buildOrientation(input, shortlist)

  // The next stage the user has not reached yet, straight from the saved journey.
  const nextStageRow = stageRows.find((row) => row.index === currentStage + 1)
  const nextMilestone = nextStageRow ? nextStageRow.label : null

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4">
      <DashboardWelcome firstName={firstName} firstVisitCandidate={firstVisitCandidate} profileComplete={complete} />

      <OrientationHeader
        greeting={<Greeting firstName={firstName} />}
        orientation={orientation}
        percent={percent}
        currentStage={currentStage}
        totalStages={PLAN_STAGES.length}
      />

      <DecisionWorkspaceStarter suggestions={suggestions} />

      {/* Continuity, then the operational heart. One grid so the order can differ
          by breakpoint: desktop reads Resume | Journey / What's next | Attention,
          while mobile stacks Resume → What's next → Attention → Journey, keeping
          the two action surfaces above the fold on a phone. */}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(290px,1fr)]">
        <div className="order-1 flex flex-col lg:order-1">
          <ResumePanel resume={resume} />
        </div>
        <div className="order-4 flex flex-col lg:order-2">
          <JourneyPanel
            stageName={JOURNEY_STAGE_LABELS[journeyStageLabel(currentStage)]}
            percent={percent}
            currentStage={currentStage}
            totalStages={PLAN_STAGES.length}
            nextMilestone={nextMilestone}
          />
        </div>
        <div className="order-2 flex flex-col lg:order-3">
          <NextActionsPanel tasks={tasks} />
        </div>
        <div className="order-3 flex flex-col lg:order-4">
          <AttentionPanel alerts={alerts} />
        </div>
      </div>

      <ShortlistPanel items={shortlist} ranked={complete && shortlist.some((s) => s.score !== null)} />

      <LearningNote />
    </div>
  )
}
