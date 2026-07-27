import type { Metadata } from 'next'
import { NexitPlanWorkspace } from '@/components/nexit/nexit-plan-workspace'
import { requireCurrentUser } from '@/lib/auth'
import { COUNTRIES } from '@/lib/countries'
import { emptyNexitPlan, getNexitPlan } from '@/lib/nexit-plan'
import { PATHWAYS } from '@/lib/pathways'
import { getProfile } from '@/lib/profile'

export const metadata: Metadata = { title: 'My Plan | Kolmari', description: 'Your private move planning workspace.' }

export default async function NexitPlanPage() {
  const user = await requireCurrentUser()
  const [profile, existing] = await Promise.all([getProfile(user.id), getNexitPlan(user.id)])
  return <NexitPlanWorkspace initial={existing ?? emptyNexitPlan(user.id)} nextinations={COUNTRIES.map((country) => country.name)} pathways={PATHWAYS.map((pathway) => `${pathway.country} — ${pathway.name}`)} profileHousehold={profile.wizard_status === 'completed' ? profile.family_size : null} />
}
