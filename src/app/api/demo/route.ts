import { NextResponse } from 'next/server'
import { createToken, SESSION_COOKIE } from '@/lib/auth'
import { checkDemoCode, ensureDemoAccount, isDemoEnabled } from '@/lib/demo'
import { clientIp, isSameOrigin, rateLimit } from '@/lib/security'

/**
 * Demo sign-in. Mirrors api/login/route.ts deliberately — same CSRF check, same
 * rate limiter, same cookie shape — so there is one auth style in the app
 * rather than two. The differences are intentional: no password is accepted,
 * and the session is short.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Request blocked.' }, { status: 403 })
  }

  // Same budget as the login route: 10 attempts per 15 minutes per IP, so the
  // code cannot be brute forced any faster than a password.
  const limit = rateLimit(`demo:${clientIp(request)}`, 10, 15 * 60 * 1000)
  if (!limit.ok) {
    return Response.json(
      { error: 'Too many attempts. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  // No DEMO_ACCESS_CODE configured means there is no demo on this deployment.
  // 404 rather than 403 so the endpoint does not advertise its own existence.
  if (!isDemoEnabled()) {
    return Response.json({ error: 'Not found.' }, { status: 404 })
  }

  try {
    const body = (await request.json()) as { code?: unknown }
    const code = typeof body.code === 'string' ? body.code : null
    if (!checkDemoCode(code)) {
      return Response.json({ error: 'That demo code is not valid.' }, { status: 401 })
    }

    // Reset to the seeded persona on every entry, so each demo starts from a
    // known state instead of inheriting whatever the previous visitor changed.
    const user = await ensureDemoAccount()

    const token = await createToken({ sub: String(user.id), email: user.email })
    const response = NextResponse.json({ ok: true })
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      // Shorter than a real session: a demo link should not leave a week-long
      // cookie on a stranger's device.
      maxAge: 60 * 60 * 24,
    })
    return response
  } catch (error) {
    console.error('Demo sign-in failed', error)
    return Response.json({ error: 'Unable to start the demo right now.' }, { status: 500 })
  }
}
