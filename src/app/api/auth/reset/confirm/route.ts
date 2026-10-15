import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { revokeAllSessions } from '@/lib/auth'
import { getSql } from '@/lib/db'
import { strongPasswordSchema } from '@/lib/schemas'
import { clientIp, isSameOrigin, rateLimit } from '@/lib/security'
import {
  checkPasswordResetCode,
  clearPasswordResetCode,
  isPasswordResetEnabled,
  resetAllowedForEmail,
} from '@/lib/password-reset'

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  code: z.string().trim().min(1).max(12),
  newPassword: strongPasswordSchema,
}).strict()

type UserRow = { id: number; email: string }

// POST /api/auth/reset/confirm — checks the emailed code and sets the new
// password. Errors stay generic so the response never reveals whether an
// email has an account. A successful reset revokes every session.
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Request blocked.' }, { status: 403 })
  }

  const ip = clientIp(request)
  const limit = rateLimit(`reset-confirm:${ip}`, 10, 15 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the code and your new password, then try again.' }, { status: 400 })
  }

  try {
    if (!isPasswordResetEnabled() || !resetAllowedForEmail(parsed.data.email)) {
      return NextResponse.json({ error: 'That code did not work. Request a new one and try again.' }, { status: 400 })
    }

    const sql = getSql()
    const users = (await sql`SELECT id, email FROM users WHERE email = ${parsed.data.email} LIMIT 1`) as UserRow[]
    const user = users[0]

    const check = user ? await checkPasswordResetCode(user.id, parsed.data.code) : 'none'
    if (!user || check !== 'ok') {
      const message =
        check === 'too_many_attempts'
          ? 'Too many wrong codes. Request a new one and try again.'
          : check === 'expired'
            ? 'That code expired. Request a new one and try again.'
            : 'That code did not work. Request a new one and try again.'
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const newHash = await hash(parsed.data.newPassword, 12)
    await sql`UPDATE users SET password = ${newHash} WHERE id = ${user.id}`
    await clearPasswordResetCode(user.id)
    // The old password may be compromised: sign every device out.
    await revokeAllSessions(user.id)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Password-reset confirm failed', error)
    return NextResponse.json({ error: 'Unable to reset the password right now.' }, { status: 500 })
  }
}
