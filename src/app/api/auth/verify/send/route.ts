import { NextResponse } from 'next/server'
import { getRequestUser } from '@/lib/auth'
import { clientIp, isSameOrigin, rateLimit } from '@/lib/security'
import {
  getEmailVerified,
  isEmailVerificationEnabled,
  issueVerificationCode,
  sendVerificationEmail,
} from '@/lib/verification'
import { isDemoEmail } from '@/lib/demo-identity'

// POST /api/auth/verify/send — issues a fresh 6-digit code and emails it.
// Authed users only. 60-second resend cooldown per user, 10 sends per 15 min per IP.
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Request blocked.' }, { status: 403 })
  }
  const ip = clientIp(request)
  const limit = rateLimit(`verify-send:${ip}`, 10, 15 * 60 * 1000)
  if (!limit.ok) {
    return Response.json(
      { error: 'Too many attempts. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }
  try {
    const user = await getRequestUser(request)
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (!isEmailVerificationEnabled()) {
      return Response.json({ error: 'Email verification is not configured.' }, { status: 503 })
    }
    if (isDemoEmail(user.email) || (await getEmailVerified(Number(user.id)))) {
      return Response.json({ ok: true, alreadyVerified: true })
    }
    const issued = await issueVerificationCode(Number(user.id))
    if (!issued) {
      return Response.json({ error: 'Please wait a minute before requesting another code.' }, { status: 429 })
    }
    const sent = await sendVerificationEmail(user.email, issued.code)
    if (!sent) {
      return Response.json({ error: 'We could not send the email. Please try again.' }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Verification send failed', error)
    return Response.json({ error: 'Unable to send the code right now.' }, { status: 500 })
  }
}
