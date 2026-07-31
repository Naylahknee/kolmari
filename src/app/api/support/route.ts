import { getRequestUser } from '@/lib/auth'
import { isSameOrigin } from '@/lib/security'
import { createSupportMessage } from '@/lib/support'

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Request blocked.' }, { status: 403 })
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = (await request.json()) as { subject?: unknown; message?: unknown }
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const subject = typeof body.subject === 'string' ? body.subject.trim().slice(0, 140) : null
    if (message.length < 5 || message.length > 4000) {
      return Response.json({ error: 'Please enter a message between 5 and 4000 characters.' }, { status: 400 })
    }
    await createSupportMessage({ userId: user.id, email: user.email, subject: subject || null, message })
    return Response.json({ ok: true })
  } catch (error) {
    console.error('Support message failed', error)
    return Response.json({ error: 'Unable to send your message right now.' }, { status: 500 })
  }
}
