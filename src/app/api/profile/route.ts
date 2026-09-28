import { isAnswered, LANES } from '@/lib/onboarding'
import { getRequestUser } from '@/lib/auth'
import { isAdminUser } from '@/lib/admin'
import { getProfile, saveProfile } from '@/lib/profile'
import { seedCommandCenterFromProfile } from '@/lib/command-center'
import { profileUpdateSchema } from '@/lib/schemas'
import { isSameOrigin } from '@/lib/security'

export async function GET(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const [profile, isAdmin] = await Promise.all([getProfile(user.id), isAdminUser(user)])
    return Response.json({ ...profile, isAdmin })
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
    const setup = parsed.data.onboarding
    const questions = setup?.lanes.flatMap(lane => LANES[lane].qs) ?? []
    const reviewStep = questions.length + 3 + (setup?.lanes.includes('energy') ? 1 : 0)
    const finishingSetup = Boolean(setup && setup.step === reviewStep && parsed.data.wizard_status === 'completed')
    if (finishingSetup && (!setup?.lanes.length || questions.some(q => !isAnswered(setup.answers[q.id])) ||
      !parsed.data.citizenship?.trim() || !parsed.data.current_country?.trim() || !parsed.data.display_name?.trim() ||
      !parsed.data.household_type || !parsed.data.timeline || !parsed.data.goals?.length ||
      parsed.data.spouse == null || parsed.data.dependents == null || !parsed.data.family_size ||
      parsed.data.family_size < 1 + (parsed.data.spouse ? 1 : 0) + (parsed.data.dependents ?? 0))) {
      return Response.json({ error: 'Complete your priorities and household details before opening the Command Center.' }, { status: 400 })
    }
    const saved = await saveProfile({ ...current, ...parsed.data, user_id: user.id })

    // Setup can be retried after a board failure; never claim success prematurely.
    if (saved.wizard_status === 'completed' && (finishingSetup || (!setup && current.wizard_status !== 'completed'))) {
      await seedCommandCenterFromProfile(user.id, saved)
    }

    return Response.json(saved)
  } catch (error) {
    console.error('Profile update failed', error)
    return Response.json({ error: 'Unable to save your progress.' }, { status: 500 })
  }
}
