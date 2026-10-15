import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSql } from '@/lib/db'
import { clientIp, isSameOrigin, rateLimit } from '@/lib/security'
import {
  isPasswordResetEnabled,
  issuePasswordResetCode,
  resetAllowedForEmail,
  sendPasswordResetEmail,
} from '@/lib/password-reset'

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
}).strict()

type UserRow = { id: number; email: string }

// POST /api/auth/reset/request — emails a 6-digit reset code.
// Always answers { ok: true } (except rate-limit / bad input) so the response
// never reveals whether an email has an account.
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Request blocked.' }, { status: 403 })
  }

  const ip = clientIp(request)
  const limit = rateLimit(`reset-request:${ip}`, 10, 15 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
  }

  try {
    if (isPasswordResetEnabled() && resetAllowedForEmail(parsed.data.email)) {
      const sql = getSql()
      const users = (await sql`SELECT id, email FROM users WHERE email = ${parsed.data.email} LIMIT 1`) as UserRow[]
      const user = users[0]
      if (user) {
        const issued = await issuePasswordResetCode(user.id)
        if (issued) {
          const sent = await sendPasswordResetEmail(user.email, issued.code)
          if (!sent) console.error('Password-reset email failed to send for user', user.id)
        }
        // Cooldown active: the previous code is still valid; nothing to do.
      }
    }
  } catch (error) {
    console.error('Password-reset request failed', error)
  }

  return NextResponse.json({ ok: true })
}
