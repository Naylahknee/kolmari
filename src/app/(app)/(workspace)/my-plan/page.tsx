import type { Metadata } from 'next'
import { PlanWorkspace } from '@/components/kolmari/plan/PlanWorkspace'
import { PlanHeaderLocator } from '@/components/kolmari/plan/PlanHeaderLocator'
import { requireCurrentUser } from '@/lib/auth'
import { COUNTRIES } from '@/lib/countries'
import { emptyKolmariPlan, getKolmariPlan } from '@/lib/kolmari-plan'
import { PLAN_TABS, type TabId } from '@/lib/plan-types'
import { PATHWAYS } from '@/lib/pathways'
import { getProfile } from '@/lib/profile'

export const metadata: Metadata = { title: 'My Plan | Kolmari', description: 'Your private move planning workspace.' }

export default async function KolmariPlanPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await requireCurrentUser()
  const [profile, existing, params] = await Promise.all([getProfile(user.id), getKolmariPlan(user.id), searchParams])
  const requested = params?.tab
  const initialTab: TabId = PLAN_TABS.includes(requested as TabId) ? (requested as TabId) : 'overview'
  const plan = existing ?? emptyKolmariPlan(user.id)

  return (
    <div className="relative">
      <PlanHeaderLocator country={plan.saved_nextination} city={plan.destination_city} />
      <PlanWorkspace
        initial={plan}
        nextinations={COUNTRIES.map((country) => country.name)}
        pathways={PATHWAYS.map((pathway) => `${pathway.country} — ${pathway.name}`)}
        profileHousehold={profile.wizard_status === 'completed' ? profile.family_size : null}
        profileMonthlyIncome={profile.wizard_status === 'completed' ? profile.monthly_income : null}
        initialTab={initialTab}
      />
    </div>
  )
}
