import type { Metadata } from 'next'
import { requireCurrentUser } from '@/lib/auth'
import { getBoard } from '@/lib/command-center'
import { CommandCenterBoard } from '@/components/kolmari/command-center/board'

export const metadata: Metadata = { title: 'Command Center | Kolmari' }

export default async function CommandCenterPage() {
  const user = await requireCurrentUser()
  const board = await getBoard(user.id)

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-5 max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-deep">Command Center</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy sm:text-3xl">Compare destinations, side by side</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Track what each destination needs across work, visa, schools, safety, and community — plus how each one fits
          your household. Everything here is yours to edit and saves to your account.
        </p>
      </div>
      <CommandCenterBoard initial={board} />
    </main>
  )
}
