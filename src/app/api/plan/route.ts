import { getRequestUser } from '@/lib/auth'
import { emptyNexitPlan, getNexitPlan, saveNexitPlan } from '@/lib/kolmari-plan'
import { nexitPlanUpdateSchema } from '@/lib/schemas'
import { isSameOrigin } from '@/lib/security'

export async function GET(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try { return Response.json((await getNexitPlan(user.id)) ?? emptyNexitPlan(user.id)) }
  catch (error) { console.error('Plan load failed', error); return Response.json({ error: 'Unable to load your Move Plan.' }, { status: 500 }) }
}

export async function PUT(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Request blocked.' }, { status: 403 })
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const parsed = nexitPlanUpdateSchema.safeParse(await request.json())
    if (!parsed.success) return Response.json({ error: 'Some plan details are invalid.' }, { status: 400 })
    const current = (await getNexitPlan(user.id)) ?? emptyNexitPlan(user.id)
    return Response.json(await saveNexitPlan({ ...current, ...parsed.data, user_id: user.id }))
  } catch (error) { console.error('Plan update failed', error); return Response.json({ error: 'Unable to save your Move Plan.' }, { status: 500 }) }
}
