import type { Metadata } from 'next'
import { requireCurrentUser } from '@/lib/auth'
import { loadNexitnationProfile } from '@/lib/userProfile'
import { NexitWorldWorkspace } from '@/components/nexit/nexit-world'

export const metadata: Metadata = {
  title: 'Nexit World | Nexit',
  description: 'Explore regions, research countries, and save possible Nextinations.',
}

type SearchParams = Promise<{ view?: string | string[]; q?: string | string[] }>

export default async function NexitWorldPage({ searchParams }: { searchParams: SearchParams }) {
  const { view, q = '' } = await searchParams
  const user = await requireCurrentUser()
  const profile = await loadNexitnationProfile(user.id, user.email)

  const initialView = view === 'countries' ? 'countries' : 'map'
  const initialQuery = Array.isArray(q) ? (q[0] ?? '') : q

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Global discovery</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-navy sm:text-5xl">
          Nexit World
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Explore regions, research countries, and save possible Nextinations.
        </p>
      </header>

      <NexitWorldWorkspace
        profileComplete={profile !== null}
        regionMatches={profile?.regionMatches ?? null}
        initialView={initialView}
        initialQuery={initialQuery}
      />
    </div>
  )
}
