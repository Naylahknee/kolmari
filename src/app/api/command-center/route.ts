import { getRequestUser } from '@/lib/auth'
import { getBoard } from '@/lib/command-center'

export const runtime = 'nodejs'

// Full Command Center board for the signed-in user (one hydration payload).
export async function GET(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    return Response.json(await getBoard(user.id))
  } catch (error) {
    console.error('Command Center load failed', error)
    return Response.json({ error: 'Unable to load your Command Center.' }, { status: 500 })
  }
}
