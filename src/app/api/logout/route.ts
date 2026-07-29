import { NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/auth'
import { isSameOrigin } from '@/lib/security'

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Request blocked.' }, { status: 403 })

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
