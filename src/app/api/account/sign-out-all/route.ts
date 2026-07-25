import { NextResponse } from 'next/server'
import { getRequestUser, SESSION_COOKIE } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

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
