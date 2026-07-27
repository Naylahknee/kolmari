import type { Metadata } from 'next'
import { NexitPlanWorkspace } from '@/components/nexit/nexit-plan-workspace'
import { requireCurrentUser } from '@/lib/auth'
import { COUNTRIES } from '@/lib/countries'
import { emptyNexitPlan, getNexitPlan } from '@/lib/nexit-plan'
import { PATHWAYS } from '@/lib/pathways'
import { getProfile } from '@/lib/profile'

export const metadata: Metadata = {
  title: 'Flutter Mode | Kolmari',
  description: 'Your execution workspace — track tasks, deadlines, and move progress.',
}

/**
 * Flutter Mode — execution-focused view of your move plan.
 * This route renders the same NexitPlanWorkspace but scrolls to the checklist
 * and is surfaced in the Kolmari nav as "Flutter Mode".
 *
 * Route: /flutter
 * Legacy compatibility: /checklist still redirects to /nexit-plan#checklist
 */
export default async function FlutterModePage() {
  const user = await requireCurrentUser()
  const [profile, existing] = await Promise.all([getProfile(user.id), getNexitPlan(user.id)])
  return (
    <NexitPlanWorkspace
      initial={existing ?? emptyNexitPlan(user.id)}
      nextinations={COUNTRIES.map((country) => country.name)}
      pathways={PATHWAYS.map((pathway) => `${pathway.country} — ${pathway.name}`)}
      profileHousehold={profile.wizard_status === 'completed' ? profile.family_size : null}
      defaultTab="checklist"
    />
  )
}
