import { compare, hash } from 'bcryptjs'
import { NextResponse } from 'next/server'
import { createToken, SESSION_COOKIE } from '@/lib/auth'
import { getSql } from '@/lib/db'
import { authSchema, strongPasswordSchema } from '@/lib/schemas'
import { clientIp, isSameOrigin, rateLimit } from '@/lib/security'

type UserRow = { id: number; email: string; password: string }

// A bcrypt hash used to equalize response timing when no account exists, so an
// attacker cannot distinguish "no such user" from "wrong password" by how long
// the request takes. Computed once (guaranteed valid) and cached per isolate.
let dummyHashPromise: Promise<string> | undefined
function getDummyHash() {
  return (dummyHashPromise ??= hash('kolmari-timing-equalizer-constant', 12))
}

export async function POST(request: Request) {
  // CSRF hardening: reject cross-site POSTs beyond the SameSite=Lax cookie.
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Request blocked.' }, { status: 403 })
  }

  // Rate limit by IP to slow credential stuffing / brute force. Best-effort
  // (see src/lib/security.ts) — 10 attempts per 15 minutes per IP.
  const ip = clientIp(request)
  const limit = rateLimit(`auth:${ip}`, 10, 15 * 60 * 1000)
  if (!limit.ok) {
    return Response.json(
      { error: 'Too many attempts. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  try {
    const parsed = authSchema.safeParse(await request.json())
    if (!parsed.success) return Response.json({ error: 'Use a valid email and a password of at least 8 characters.' }, { status: 400 })
    const { email, password, mode } = parsed.data

    const sql = getSql()
    const users = await sql`SELECT id, email, password FROM users WHERE email = ${email} LIMIT 1` as UserRow[]
    let user = users[0]

    if (mode === 'signup') {
      // Enforce the strong-password policy for newly-created accounts.
      const strong = strongPasswordSchema.safeParse(password)
      if (!strong.success) {
        return Response.json({ error: strong.error.issues[0]?.message ?? 'Choose a stronger password.' }, { status: 400 })
      }
      if (user) {
        return Response.json({ error: 'An account with that email already exists.' }, { status: 409 })
      }
      const passwordHash = await hash(password, 12)
      const inserted = await sql`
        INSERT INTO users (email, password)
        VALUES (${email}, ${passwordHash})
        RETURNING id, email, password
      ` as UserRow[]
      user = inserted[0]
    } else {
      // Always run a bcrypt comparison — against the real hash when the user
      // exists, otherwise against a dummy hash — so timing does not reveal
      // whether the email is registered.
      const passwordOk = await compare(password, user?.password ?? (await getDummyHash()))
      if (!user || !passwordOk) {
        return Response.json({ error: 'Invalid email or password.' }, { status: 401 })
      }
    }

    const token = await createToken({ sub: String(user.id), email: user.email })
    // Do not echo the token in the response body — the httpOnly cookie is the
    // only place the browser should hold it, so XSS cannot read it from a
    // captured response.
    const response = NextResponse.json({ ok: true })
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return response
  } catch (error) {
    console.error('Login failed', error)
    return Response.json({ error: 'Unable to sign in right now.' }, { status: 500 })
  }
}
