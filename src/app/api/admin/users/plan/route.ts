import { getRequestUser } from '@/lib/auth'
import { isAdminUser } from '@/lib/admin'
import { setUserPlan } from '@/lib/admin-data'
import { PLAN_TIERS, type PlanTier } from '@/lib/profile'
import { isSameOrigin } from '@/lib/security'

export async function PATCH(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Request blocked.' }, { status: 403 })

  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await isAdminUser(user))) return Response.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = (await request.json()) as { userId?: unknown; plan?: unknown }
    const userId = Number(body.userId)
    const plan = body.plan
    if (!Number.isInteger(userId) || userId <= 0) return Response.json({ error: 'Invalid user.' }, { status: 400 })
    if (typeof plan !== 'string' || !PLAN_TIERS.includes(plan as PlanTier)) {
      return Response.json({ error: 'Invalid plan tier.' }, { status: 400 })
    }
    await setUserPlan(userId, plan as PlanTier)
    return Response.json({ ok: true, userId, plan })
  } catch (error) {
    console.error('Admin plan update failed', error)
    return Response.json({ error: 'Unable to update plan.' }, { status: 500 })
  }
}
