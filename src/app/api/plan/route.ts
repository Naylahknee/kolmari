import { getRequestUser } from '@/lib/auth'
import { emptyKolmariPlan, getKolmariPlan, normalizeBudget, saveKolmariPlan } from '@/lib/kolmari-plan'
import { kolmariPlanUpdateSchema } from '@/lib/schemas'
import { isSameOrigin } from '@/lib/security'

export async function GET(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try { return Response.json((await getKolmariPlan(user.id)) ?? emptyKolmariPlan(user.id)) }
  catch (error) { console.error('Plan load failed', error); return Response.json({ error: 'Unable to load your Move Plan.' }, { status: 500 }) }
}

export async function PUT(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Request blocked.' }, { status: 403 })
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const parsed = kolmariPlanUpdateSchema.safeParse(await request.json())
    if (!parsed.success) return Response.json({ error: 'Some plan details are invalid.' }, { status: 400 })
    const current = (await getKolmariPlan(user.id)) ?? emptyKolmariPlan(user.id)
    const budget = parsed.data.budget ? normalizeBudget(parsed.data.budget) : current.budget
    return Response.json(await saveKolmariPlan({ ...current, ...parsed.data, budget, user_id: user.id }))
  } catch (error) { console.error('Plan update failed', error); return Response.json({ error: 'Unable to save your Move Plan.' }, { status: 500 }) }
}
