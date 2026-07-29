import { getRequestUser } from '@/lib/auth'
import { getProfile, saveProfile } from '@/lib/profile'
import { profileUpdateSchema } from '@/lib/schemas'
import { isSameOrigin } from '@/lib/security'

export async function GET(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    return Response.json(await getProfile(user.id))
  } catch (error) {
    console.error('Profile load failed', error)
    return Response.json({ error: 'Unable to load your profile.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Request blocked.' }, { status: 403 })

  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const parsed = profileUpdateSchema.safeParse(await request.json())
    if (!parsed.success) return Response.json({ error: 'Some profile details are invalid.' }, { status: 400 })
    const current = await getProfile(user.id)
    return Response.json(await saveProfile({ ...current, ...parsed.data, user_id: user.id }))
  } catch (error) {
    console.error('Profile update failed', error)
    return Response.json({ error: 'Unable to save your progress.' }, { status: 500 })
  }
}
