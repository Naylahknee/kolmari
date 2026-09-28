import Link from 'next/link'
import { getProfile } from '@/lib/profile'
import { LANE_LINKS } from '@/lib/onboarding'
import type { Metadata } from 'next'
import { requireCurrentUser } from '@/lib/auth'
import { getBoard } from '@/lib/command-center'
import { CommandCenterBoard } from '@/components/kolmari/command-center/board'

export const metadata: Metadata = { title: 'Command Center | Kolmari' }

export default async function CommandCenterPage() {
  const user = await requireCurrentUser()
  const [board, profile] = await Promise.all([getBoard(user.id), getProfile(user.id)])

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-8">
      {profile.onboarding?.lanes.length ? <section className="mb-6 rounded-2xl border border-line bg-white p-5" aria-label="Your planning priorities"><div className="flex items-center justify-between gap-4"><h2 className="font-bold text-navy">Your planning priorities</h2><Link className="text-sm underline" href="/profile-wizard">Edit profile</Link></div><div className="mt-4 flex flex-wrap gap-3">{profile.onboarding.lanes.map((id, i) => <Link key={id} href={LANE_LINKS[id].href} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gold/60 bg-gold-soft px-4 py-2 text-sm font-semibold"><span>{i + 1}.</span>{LANE_LINKS[id].label}</Link>)}</div><p className="mt-3 text-xs leading-5 text-muted">Your selected priorities guide research tasks for newly added destinations. Existing tasks and progress are preserved.</p></section> : null}
      <CommandCenterBoard initial={board} />
    </main>
  )
}
