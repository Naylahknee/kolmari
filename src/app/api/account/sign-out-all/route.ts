import { NextResponse } from 'next/server'
import { getRequestUser, SESSION_COOKIE } from '@/lib/auth'
import { isDemoEmail } from '@/lib/demo-identity'
import { isSameOrigin } from '@/lib/security'

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Request blocked.' }, { status: 403 })

  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  // Global revocation is disabled for the shared demo account. /api/logout still signs this device out normally.
  if (isDemoEmail(user.email)) {
    return Response.json({ error: 'Not available in the demo.' }, { status: 403 })
  }

  // Revoke the current session cookie. Since JWTs are stateless, this removes
  // the cookie from the current device. A future session-table implementation
  // would invalidate all tokens for the user here.
  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return response
}
