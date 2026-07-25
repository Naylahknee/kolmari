import { compare, hash } from 'bcryptjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getRequestUser, SESSION_COOKIE } from '@/lib/auth'
import { getSql } from '@/lib/db'

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(72),
}).strict()

type UserRow = { id: number; password: string }

export async function POST(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const parsed = schema.safeParse(await request.json())
    if (!parsed.success) return Response.json({ error: 'New password must be at least 8 characters.' }, { status: 400 })

    const sql = getSql()
    const rows = await sql`SELECT id, password FROM users WHERE id = ${user.id} LIMIT 1` as UserRow[]
    if (!rows[0]) return Response.json({ error: 'Account not found.' }, { status: 404 })

    const valid = await compare(parsed.data.currentPassword, rows[0].password)
    if (!valid) return Response.json({ error: 'Current password is incorrect.' }, { status: 401 })

    const newHash = await hash(parsed.data.newPassword, 12)
    await sql`UPDATE users SET password = ${newHash} WHERE id = ${user.id}`

    // Revoke session cookie so all devices are signed out after password change
    const response = NextResponse.json({ ok: true })
    response.cookies.set(SESSION_COOKIE, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    })
    return response
  } catch (error) {
    console.error('Password change failed', error)
    return Response.json({ error: 'Unable to change password right now.' }, { status: 500 })
  }
}
