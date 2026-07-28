import { CostCalculator } from '@/components/kolmari/cost-calculator'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'

export default async function CostCalculatorPage() {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  return <CostCalculator income={profile.wizard_status === 'completed' ? profile.monthly_income : null} profileComplete={profile.wizard_status === 'completed'} />
}
