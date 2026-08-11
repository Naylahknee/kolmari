import { getRequestUser } from '@/lib/auth'
import { isSameOrigin } from '@/lib/security'
import { parseLayout } from '@/lib/dashboard-layout'
import {
  getDashboardLayout,
  resetDashboardLayout,
  saveDashboardLayout,
} from '@/lib/dashboard-layout-store'

/**
 * The signed-in user's dashboard layout preference.
 *
 *   GET    → the saved layout (or the shipped default)
 *   PUT    → replace it; the body is coerced through parseLayout, so unknown or
 *            malformed widget ids are dropped rather than stored
 *   DELETE → clear the customization and fall back to the default
 *
 * A display preference only — it carries no plan, profile, or destination data.
 */

export async function GET(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  return Response.json({ layout: await getDashboardLayout(user.id) })
}

export async function PUT(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Request blocked.' }, { status: 403 })
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const layout = parseLayout((body as { layout?: unknown })?.layout ?? body)
  try {
    await saveDashboardLayout(user.id, layout)
  } catch (error) {
    console.error('Dashboard layout save failed', error)
    return Response.json({ error: 'Unable to save layout.' }, { status: 500 })
  }
  return Response.json({ ok: true, layout })
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Request blocked.' }, { status: 403 })
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await resetDashboardLayout(user.id)
  } catch (error) {
    console.error('Dashboard layout reset failed', error)
    return Response.json({ error: 'Unable to reset layout.' }, { status: 500 })
  }
  return Response.json({ ok: true, layout: await getDashboardLayout(user.id) })
}
