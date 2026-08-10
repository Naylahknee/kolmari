import { NextResponse } from 'next/server'
import { z } from 'zod'
import { compare } from 'bcryptjs'
import { getRequestUser, SESSION_COOKIE } from '@/lib/auth'
import { getSql } from '@/lib/db'
import { isSameOrigin } from '@/lib/security'

const schema = z.object({
  // The user must type the exact phrase to confirm the destructive action.
  confirmationPhrase: z.literal('DELETE MY KOLMARI ACCOUNT'),
  currentPassword: z.string().min(1),
}).strict()

type UserRow = { id: number; password: string; email: string }

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Request blocked.' }, { status: 403 })

  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const parsed = schema.safeParse(await request.json())
    if (!parsed.success) {
      return Response.json(
        { error: 'Type DELETE MY KOLMARI ACCOUNT exactly to confirm, and provide your current password.' },
        { status: 400 },
      )
    }

    const sql = getSql()
    const rows = await sql`SELECT id, password, email FROM users WHERE id = ${user.id} LIMIT 1` as UserRow[]
    if (!rows[0]) return Response.json({ error: 'Account not found.' }, { status: 404 })

    const valid = await compare(parsed.data.currentPassword, rows[0].password)
    if (!valid) return Response.json({ error: 'Password is incorrect.' }, { status: 401 })

    // Delete profile first (foreign key references users.id with ON DELETE CASCADE,
    // so deleting the user row will cascade to profile and plan rows).
    // Profiles and plans are deleted via cascade; we explicitly delete here for clarity.
    await sql`DELETE FROM profiles WHERE user_id = ${user.id}`

    // Delete the user account. ON DELETE CASCADE handles related rows.
    await sql`DELETE FROM users WHERE id = ${user.id}`

    // Revoke the session cookie.
    const response = NextResponse.json({ ok: true, message: 'Your account has been deleted.' })
    response.cookies.set(SESSION_COOKIE, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    })
    return response
  } catch (error) {
    console.error('Account deletion failed', error)
    return Response.json({ error: 'Unable to delete your account right now. Please contact support.' }, { status: 500 })
  }
}
