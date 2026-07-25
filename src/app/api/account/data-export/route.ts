import { getRequestUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'
import { getNexitPlan } from '@/lib/nexit-plan'
import { getSql } from '@/lib/db'

export async function POST(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // Gather all user-linked data available in the current application.
    // This is a v1 best-effort export. Future versions may add more data categories.
    const [profile, plan] = await Promise.all([
      getProfile(user.id),
      getNexitPlan(user.id),
    ])

    // Redact security-sensitive fields — never export password hashes or tokens.
    const { user_id: _uid, ...safeProfile } = profile as typeof profile & { user_id: number }
    void _uid

    const sql = getSql()
    const usersRows = await sql`SELECT email FROM users WHERE id = ${user.id} LIMIT 1` as { email: string }[]
    const accountRow = usersRows[0]

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      format: 'nexit-data-export-v1',
      account: accountRow
        ? { email: accountRow.email }
        : null,
      profile: safeProfile,
      nexitPlan: plan ?? null,
    }

    return new Response(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="nexit-data-export.json"',
      },
    })
  } catch (error) {
    console.error('Data export failed', error)
    return Response.json({ error: 'Unable to prepare your data export right now.' }, { status: 500 })
  }
}
