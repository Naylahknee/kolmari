import { CostCalculator } from '@/components/kolmari/cost-calculator'
import { PlusGate } from '@/components/kolmari/plus-gate'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile, isPaid } from '@/lib/profile'

export default async function CostCalculatorPage() {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)

  if (!isPaid(profile)) {
    return (
      <PlusGate
        eyebrow="Cost Calculator"
        title="Unlock the full Cost Calculator with Plus"
        description="Plus opens the full monthly cost breakdown for your Destinations — housing, food, transport, healthcare, and more — measured against your income and budget."
        bullets={[
          'Detailed monthly cost breakdown by category',
          'Compared against your income and budget',
          'Solo, couple, and family estimates',
          'Save figures into your Kolmari Plan',
        ]}
      />
    )
  }

  return <CostCalculator income={profile.wizard_status === 'completed' ? profile.monthly_income : null} profileComplete={profile.wizard_status === 'completed'} />
}
