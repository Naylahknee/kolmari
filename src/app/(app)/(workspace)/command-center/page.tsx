import type { Metadata } from 'next'
import { requireCurrentUser } from '@/lib/auth'
import { getBoard } from '@/lib/command-center'
import { CommandCenterBoard } from '@/components/kolmari/command-center/board'

export const metadata: Metadata = { title: 'Command Center | Kolmari' }

export default async function CommandCenterPage() {
  const user = await requireCurrentUser()
  const board = await getBoard(user.id)

  return (
    <main className="mx-auto w-full" style={{ maxWidth: 1100, padding: '26px 30px 70px' }}>
      <CommandCenterBoard initial={board} />
    </main>
  )
}
