import type { Metadata } from 'next'
import { NexitnationMapbox } from '@/components/nexit/NexitnationMapbox'
import { requireCurrentUser } from '@/lib/auth'
import { NEXIT_LEXICON } from '@/lib/lexicon'
import { loadNexitnationProfile } from '@/lib/userProfile'

export const metadata: Metadata = {
  title: 'Nexitnation Map | Nexit',
  description: 'Compare regions, review relocation Pathways, and choose a Nextination that fits your Nexit Profile.',
}

export default async function NexitnationPage() {
  const user = await requireCurrentUser()
  const profile = await loadNexitnationProfile(user.id, user.email)

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Global discovery</p>
        <h1 id="nexitnation-map-title" className="mt-2 font-display text-4xl font-bold text-navy sm:text-5xl">
          {NEXIT_LEXICON.mapTitle}
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Select a region on the live map to open its Nextination page.
        </p>
      </header>

      <NexitnationMapbox profile={{ complete: profile !== null, matches: profile?.regionMatches ?? null }} />
    </div>
  )
}
