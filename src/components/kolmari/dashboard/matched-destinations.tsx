import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { JourneyStageRow } from '@/lib/plan-types'

export type JourneyPanelData = {
  rows: JourneyStageRow[]
  currentStage: number
  currentStageName: string
  percent: number
  totalStages: number
  savedAt: string | null
}

const EYEBROW = 'text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold-deep'

/**
 * Free tier: a browse teaser shown in place of the personalized matches.
 */
export function DestinationsPanel({ profileComplete }: { profileComplete: boolean }) {
  return (
    <section
      id="dashboard-destinations"
      aria-labelledby="destinations-heading"
      className="rounded-[var(--radius-card)] border border-line bg-white px-5 py-5 shadow-tile sm:px-6"
    >
      <p className={EYEBROW}>Explore</p>
      <h2 id="destinations-heading" className="mt-1.5 text-[22px] font-bold tracking-[-0.02em] text-navy">
        Destinations
      </h2>
      <p className="mt-1.5 max-w-[62ch] text-[13.5px] leading-[1.65] text-muted">
        {profileComplete
          ? 'Browse researched countries and compare what matters most: cost, safety, climate, and visa routes.'
          : 'Browse researched countries, then finish your Kolmari Profile to unlock your personalized matches.'}
      </p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        <Link href="/your-world" className="gold-button">
          Explore Your World <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <Link
          href="/destinations"
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-btn)] border border-line px-4 py-2.5 text-[13px] font-bold text-navy transition-colors hover:border-gold-deep"
        >
          Browse all destinations
        </Link>
        {!profileComplete && (
          <Link
            href="/profile-wizard"
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-btn)] border border-line px-4 py-2.5 text-[13px] font-bold text-navy transition-colors hover:border-gold-deep"
          >
            Finish your profile
          </Link>
        )}
      </div>
    </section>
  )
}
