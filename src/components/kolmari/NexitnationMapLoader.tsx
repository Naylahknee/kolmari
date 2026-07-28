'use client'

import dynamic from 'next/dynamic'
import type { RegionSlug } from '@/lib/destinations-data'

type Props = {
  profile: { complete: boolean; matches: Record<RegionSlug, number> | null }
}

// Dynamically import the Mapbox component so the Mapbox GL JS bundle (~870 KB)
// is code-split and only fetched + parsed when the user navigates to /nexitnation.
// ssr: false is valid here because this is a Client Component.
const NexitnationMapbox = dynamic(
  () => import('./NexitnationMapbox').then((m) => m.NexitnationMapbox),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center rounded-[24px] border border-gold/20 bg-navy-deep"
        style={{ height: 560 }}
        role="status"
        aria-label="Map loading"
      >
        <div className="flex flex-col items-center gap-3 text-white/60">
          <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-gold" aria-hidden="true" />
          <span className="text-sm">Loading map…</span>
        </div>
      </div>
    ),
  },
)

export function NexitnationMapLoader({ profile }: Props) {
  return <NexitnationMapbox profile={profile} />
}
