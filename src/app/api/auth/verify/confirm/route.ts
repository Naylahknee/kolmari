import { NextResponse } from 'next/server'
import { getRequestUser } from '@/lib/auth'
import { clientIp, isSameOrigin, rateLimit } from '@/lib/security'
import { checkVerificationCode, isEmailVerificationEnabled, setEmailVerified } from '@/lib/verification'

// POST /api/auth/verify/confirm — checks the 6-digit code. Authed users only.
// Codes die after 5 wrong guesses; messages stay generic to avoid enumeration.
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Request blocked.' }, { status: 403 })
  }
  const ip = clientIp(request)
  const limit = rateLimit(`verify-confirm:${ip}`, 20, 15 * 60 * 1000)
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
    const body = (await request.json().catch(() => null)) as { code?: unknown } | null
    const code = typeof body?.code === 'string' ? body.code.trim() : ''
    if (!/^\d{6}$/.test(code)) {
      return Response.json({ error: 'Enter the 6-digit code from your email.' }, { status: 400 })
    }
    const result = await checkVerificationCode(Number(user.id), code)
    if (result === 'ok') {
      await setEmailVerified(Number(user.id))
      return NextResponse.json({ ok: true })
    }
    if (result === 'too_many_attempts') {
      return Response.json(
        { error: 'Too many wrong attempts. Request a new code to try again.' },
        { status: 429 },
      )
    }
    return Response.json({ error: 'That code is invalid or expired.' }, { status: 400 })
  } catch (error) {
    console.error('Verification confirm failed', error)
    return Response.json({ error: 'Unable to verify right now.' }, { status: 500 })
  }
}
