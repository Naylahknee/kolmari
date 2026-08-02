import { CostCalculator } from '@/components/kolmari/cost-calculator'
import { PlusGate } from '@/components/kolmari/plus-gate'
import { requireCurrentUser } from '@/lib/auth'
import { emptyNexitPlan, getNexitPlan } from '@/lib/kolmari-plan'
import { getProfile, isPaid } from '@/lib/profile'

export default async function CostCalculatorPage() {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)

  if (!isPaid(profile)) {
    return (
      <PlusGate
        eyebrow="Cost Calculator"
        title="Unlock the full Cost Calculator with Plus"
        description="Plus separates one-time moving cash from ongoing monthly costs, then compares the plan with your income."
        bullets={[
          'One-time arrival costs and monthly living costs',
          'Available local planning baselines with manual overrides',
          'Monthly runway outlook and assumptions log',
          'Save the same figures into My Plan',
        ]}
      />
    )
  }

  const existingPlan = await getNexitPlan(user.id)

  return (
    <CostCalculator
      initialPlan={existingPlan ?? emptyNexitPlan(user.id)}
      income={profile.wizard_status === 'completed' ? profile.monthly_income : null}
      profileComplete={profile.wizard_status === 'completed'}
      profileHousehold={profile.wizard_status === 'completed' ? profile.family_size : null}
    />
  )
}
