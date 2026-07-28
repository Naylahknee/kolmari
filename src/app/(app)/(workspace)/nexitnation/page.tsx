import type { Metadata } from 'next'
import { KolmariWorldBoard } from '@/components/kolmari/KolmariWorldBoard'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'
import { calculateRegionMatches } from '@/lib/userProfile'

export const metadata: Metadata = {
  title: 'Your World | Kolmari',
  description: 'Save destinations, track their status, and plan your move.',
}

export default async function YourWorldPage() {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  const regionMatches = calculateRegionMatches(profile)
  return <KolmariWorldBoard profileComplete={profile.wizard_status === 'completed'} regionMatches={regionMatches} />
}