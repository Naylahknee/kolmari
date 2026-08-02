import type { Metadata } from 'next'
import { PlanWorkspace } from '@/components/kolmari/plan/PlanWorkspace'
import { requireCurrentUser } from '@/lib/auth'
import { COUNTRIES } from '@/lib/countries'
import { emptyNexitPlan, getNexitPlan } from '@/lib/kolmari-plan'
import { PLAN_TABS, type TabId } from '@/lib/plan-types'
import { PATHWAYS } from '@/lib/pathways'
import { getProfile } from '@/lib/profile'

export const metadata: Metadata = { title: 'My Plan | Kolmari', description: 'Your private move planning workspace.' }

export default async function NexitPlanPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await requireCurrentUser()
  const [profile, existing, params] = await Promise.all([getProfile(user.id), getNexitPlan(user.id), searchParams])
  const requested = params?.tab
  const initialTab: TabId = PLAN_TABS.includes(requested as TabId) ? (requested as TabId) : 'overview'

  return (
    <PlanWorkspace
      initial={existing ?? emptyNexitPlan(user.id)}
      nextinations={COUNTRIES.map((country) => country.name)}
      pathways={PATHWAYS.map((pathway) => `${pathway.country} — ${pathway.name}`)}
      profileHousehold={profile.wizard_status === 'completed' ? profile.family_size : null}
      profileMonthlyIncome={profile.wizard_status === 'completed' ? profile.monthly_income : null}
      initialTab={initialTab}
    />
  )
}
