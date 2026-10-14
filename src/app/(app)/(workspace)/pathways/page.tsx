import type { Metadata } from 'next'
import { PathwaysResults } from '@/components/kolmari/pathways-results'
import { PlusGate } from '@/components/kolmari/plus-gate'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile, isPaid } from '@/lib/profile'
import { getKolmariPlan } from '@/lib/kolmari-plan'
import { PathwaysDirectoryPreview } from '@/components/kolmari/pathways-directory-preview'
import { PATHWAYS } from '@/lib/pathways'

export const metadata: Metadata = { title: 'Pathways | Kolmari', description: 'Compare official residency and visa Pathways using your Profile.' }

export default async function PathwaysPage() {
  const user = await requireCurrentUser()
  const [profile, plan] = await Promise.all([getProfile(user.id), getKolmariPlan(user.id)])

  if (!isPaid(profile)) {
    return (
      <PlusGate
        eyebrow="Kolmari Pathways"
        title="Unlock the full Pathways detail with Plus"
        description="Free shows the routes we research. Plus opens each Pathway's requirements, income guidelines, fees, processing times, and official sources — matched against your Kolmari Profile."
        bullets={[
          'Full requirements for every Pathway',
          'Income guidelines and estimated fees',
          'Processing times and official sources',
          'Personalized match status from your Profile',
        ]}
        preview={<PathwaysDirectoryPreview profileComplete={profile.wizard_status === 'completed'} routes={PATHWAYS.map(({ id, name, country, category }) => ({ id, name, country, category }))} />}
      />
    )
  }
  // Full matching stays on the paid side of the existing access gate.
  // An incomplete wizard switches the same explorer into neutral directory mode.
  return (
    <PathwaysResults
      profile={profile}
      selectedPathway={plan?.selected_pathway ?? null}
    />
  )
}
