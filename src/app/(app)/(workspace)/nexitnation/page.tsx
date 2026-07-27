import type { Metadata } from 'next'
import { NexitWorldBoard } from '@/components/nexit/NexitWorldBoard'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'
import { calculateRegionMatches } from '@/lib/userProfile'

export const metadata: Metadata = {
  title: 'Nexit World | Nexit',
  description: 'Your relocation planning board — save destinations, track their status, and plan your Nexit on a world map.',
}

export default async function NexitWorldPage() {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  const regionMatches = calculateRegionMatches(profile)
  return <NexitWorldBoard profileComplete={profile.wizard_status === 'completed'} regionMatches={regionMatches} />
}
