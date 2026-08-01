import type { Metadata } from 'next'
import { DestinationsBrowser, type DestRow } from '@/components/kolmari/destinations-browser'
import { requireCurrentUser } from '@/lib/auth'
import { COUNTRIES } from '@/lib/countries'
import { getProfile, hasCompletedProfile, isPaid } from '@/lib/profile'
import { rankNextinations } from '@/lib/userProfile'

export const metadata: Metadata = {
  title: 'Destinations | Kolmari',
  description: 'Browse every destination Kolmari covers, save the ones you love, and track your shortlist.',
}

export default async function DestinationsPage() {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  const complete = hasCompletedProfile(profile)
  const paid = isPaid(profile)

  const ranked = complete ? rankNextinations(profile) : []
  const rankIndex = new Map(ranked.map((r, i) => [r.country.slug, i] as const))
  const matchBy = new Map(ranked.map((r) => [r.country.slug, r.match] as const))

  const rows: DestRow[] = COUNTRIES.map((c) => {
    const idx = rankIndex.get(c.slug)
    const m = idx !== undefined ? matchBy.get(c.slug) : undefined
    // Free users see their top-5 matches unlocked; matched countries beyond that
    // are locked (Plus). Unmatched countries stay neutral/browsable.
    const unlocked = m !== undefined && (paid || (idx as number) < 5)
    const locked = m !== undefined && !unlocked
    return {
      slug: c.slug,
      name: c.name,
      code: c.code.toLowerCase(),
      city: c.city,
      region: c.region,
      visaType: c.visaType,
      cost: c.cost,
      match: unlocked && m ? m.score : null,
      reason: unlocked && m && m.reasons.length ? m.reasons[0] : locked ? null : c.summary,
      locked,
    }
  })

  return <DestinationsBrowser rows={rows} profileComplete={complete} />
}
