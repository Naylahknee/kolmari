import { getRequestUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'
import { rankNextinations } from '@/lib/userProfile'

// The user's matched destinations (ranked), for the sidebar's expandable
// Destinations tree. Empty until the quiz/profile is complete.
export async function GET(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const profile = await getProfile(user.id)
    const matches = rankNextinations(profile)
      .slice(0, 8)
      .map((r) => ({ slug: r.country.slug, name: r.country.name, code: r.country.code }))
    return Response.json({ matches })
  } catch (error) {
    console.error('Matches load failed', error)
    return Response.json({ matches: [] })
  }
}
