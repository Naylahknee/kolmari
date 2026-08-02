import { getRequestUser } from '@/lib/auth'
import { COUNTRIES } from '@/lib/countries'
import { createClubPost, listClubPosts } from '@/lib/club'
import { getProfile } from '@/lib/profile'
import { isSameOrigin } from '@/lib/security'

// 'welcome' is the always-on group every member belongs to; the rest are
// per-country groups (opened when a user matches a destination).
const VALID_SLUGS = new Set(['welcome', ...COUNTRIES.map((c) => c.slug)])

export async function GET(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const slug = new URL(request.url).searchParams.get('country') ?? ''
  if (!VALID_SLUGS.has(slug)) return Response.json({ error: 'Unknown destination.' }, { status: 400 })
  try {
    return Response.json({ posts: await listClubPosts(slug) })
  } catch (error) {
    console.error('Club load failed', error)
    return Response.json({ error: 'Unable to load this group.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Request blocked.' }, { status: 403 })
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = (await request.json()) as { country?: unknown; body?: unknown }
    const slug = typeof body.country === 'string' ? body.country : ''
    const text = typeof body.body === 'string' ? body.body.trim() : ''
    if (!VALID_SLUGS.has(slug)) return Response.json({ error: 'Unknown destination.' }, { status: 400 })
    if (text.length < 2 || text.length > 2000) return Response.json({ error: 'Posts are 2–2000 characters.' }, { status: 400 })
    const profile = await getProfile(user.id)
    const author = profile.display_name?.trim() || user.email.split('@')[0]
    const post = await createClubPost({ countrySlug: slug, userId: user.id, author, body: text })
    return Response.json({ post })
  } catch (error) {
    console.error('Club post failed', error)
    return Response.json({ error: 'Unable to post right now.' }, { status: 500 })
  }
}
