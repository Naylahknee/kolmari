import { getRequestUser } from '@/lib/auth'
import { isAdminUser } from '@/lib/admin'
import { setAnnouncement, type SiteAnnouncement } from '@/lib/admin-data'
import { isSameOrigin } from '@/lib/security'

export async function PUT(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Request blocked.' }, { status: 403 })

  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await isAdminUser(user))) return Response.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = (await request.json()) as { text?: unknown; href?: unknown; linkLabel?: unknown } | null
    const text = typeof body?.text === 'string' ? body.text.trim() : ''
    if (!text) {
      await setAnnouncement(null)
      return Response.json({ ok: true, announcement: null })
    }
    const value: SiteAnnouncement = {
      text: text.slice(0, 300),
      href: typeof body?.href === 'string' && body.href.trim() ? body.href.trim().slice(0, 500) : null,
      linkLabel: typeof body?.linkLabel === 'string' && body.linkLabel.trim() ? body.linkLabel.trim().slice(0, 60) : null,
    }
    await setAnnouncement(value)
    return Response.json({ ok: true, announcement: value })
  } catch (error) {
    console.error('Admin announcement update failed', error)
    return Response.json({ error: 'Unable to save announcement.' }, { status: 500 })
  }
}
