import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { JourneyCollapse } from '@/lib/dashboard-layout'
import type { JourneyStageRow } from '@/lib/plan-types'
import type { DestinationRow } from '@/components/kolmari/dashboard-side-cards'
import { JourneyTracker } from '@/components/kolmari/dashboard/journey-tracker'

export type JourneyPanelData = {
  rows: JourneyStageRow[]
  currentStage: number
  currentStageName: string
  percent: number
  totalStages: number
  savedAt: string | null
}

const EYEBROW = 'text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold-deep'

function MatchCard({ row, rank }: { row: DestinationRow; rank: number }) {
  const { country, match, imageSrc, focalPoint } = row
  const objectPosition = `${focalPoint?.x ?? 50}% ${focalPoint?.y ?? 50}%`
  return (
    <Link
      href={`/nextinations/${country.slug}/v2/overview`}
      aria-label={`${country.name}, ${match}% match. Open the ${country.name} guide.`}
      className="group relative block h-[190px] overflow-hidden rounded-[16px] border border-line bg-navy shadow-tile transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-gold/70 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
    >
      {imageSrc ? (
        <span
          className="absolute inset-0 bg-cover"
          style={{ backgroundImage: `url(${JSON.stringify(imageSrc).slice(1, -1)})`, backgroundPosition: objectPosition }}
          aria-hidden="true"
        />
      ) : (
        <span
          className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(208,175,92,.24),transparent_34%),linear-gradient(135deg,#0d1b39,#17305b_62%,#102845)]"
          aria-hidden="true"
        />
      )}
      <span className="absolute inset-0 bg-[linear-gradient(rgba(13,27,57,.45)_0%,rgba(13,27,57,.85)_100%)]" aria-hidden="true" />
      <span className="relative z-10 flex h-full flex-col justify-between p-4 text-white">
        <span className="flex items-start justify-between gap-3">
          <span className="text-[14px] font-extrabold drop-shadow-sm">#{rank}</span>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold ring-1 ring-white/30">
            {match}% match
          </span>
        </span>
        <span>
          <span className="block font-display text-[21px] font-bold leading-tight [overflow-wrap:anywhere]">
            {country.name}
          </span>
          <span className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-white/75">
            {country.region}
            <ArrowRight size={13} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </span>
      </span>
    </Link>
  )
}

/**
 * Paid tiers: the personalized matches section. The Journey tracker nests
 * beside the three country cards and collapses horizontally into a slim rail.
 */
export function MatchedDestinationsSection({
  rows,
  journey,
  collapseDirection,
}: {
  rows: DestinationRow[]
  journey: JourneyPanelData | null
  collapseDirection: JourneyCollapse
}) {
  return (
    <section id="dashboard-matches" aria-labelledby="matches-heading">
      <p className={EYEBROW}>Your relocation journey</p>
      <h2 id="matches-heading" className="mt-1.5 text-[26px] font-bold tracking-[-0.02em] text-navy">
        Your matches
      </h2>
      <p className="mt-1.5 max-w-[56ch] text-[13.5px] text-muted">
        Based on what you told us, these are the three destinations worth exploring first.
      </p>
      <div className="mt-4 flex flex-col gap-4 lg:flex-row">
        <div className="grid min-w-0 flex-1 gap-[14px] sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((row, index) => (
            <MatchCard key={row.country.slug} row={row} rank={index + 1} />
          ))}
        </div>
        {journey && (
          <JourneyTracker
            mode="panel"
            collapseDirection={collapseDirection}
            className="w-full flex-none lg:w-[320px]"
            {...journey}
          />
        )}
      </div>
    </section>
  )
}

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
