import Link from 'next/link'
import { ArrowRight, ChevronRight, Lock, LockOpen, Pencil } from 'lucide-react'
import { countryFlag, type CountryDetail } from '@/lib/countries'
import type { PathwayEvaluation, PathwayMatchStatus } from '@/lib/pathways'
import { destinationImage } from './dashboard-destinations'

export type PlannerPanel = { country: CountryDetail; match: number | null }

const STATUS_TONE: Record<PathwayMatchStatus, string> = {
  'Strong Match': 'bg-ok-soft text-ok',
  'Possible Match': 'bg-warn-soft text-warn',
  'Missing Requirements': 'bg-canvas text-muted',
}

/** A single ranked destination tile. Locked tiles are dimmed and route to
 *  the upgrade page instead of the Destination workspace. */
function DestinationTile({
  panel,
  rank,
  ranked,
  locked,
}: {
  panel: PlannerPanel
  rank: number
  ranked: boolean
  locked: boolean
}) {
  const { country, match } = panel
  const href = locked ? '/#pricing' : `/nextinations/${country.slug}`
  return (
    <Link
      href={href}
      className="group relative flex aspect-[16/7] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] border border-line shadow-tile transition hover:border-gold hover:shadow-card"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(13,27,57,0) 30%, rgba(13,27,57,0.84) 100%), url(${destinationImage(country)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {ranked && (
        <span className="absolute left-3 top-3 rounded-pill bg-white/90 px-2.5 py-1 text-xs font-extrabold text-navy shadow-tile">
          #{rank}
        </span>
      )}
      <span
        className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90 text-navy shadow-tile"
        aria-hidden="true"
      >
        {locked ? <Lock size={14} className="text-gold-deep" /> : <LockOpen size={14} className="text-muted" />}
      </span>
      <div className="relative p-4 text-white">
        <p className="text-lg font-bold leading-tight">{country.name}</p>
        <p className="text-xs text-white/80">{country.city} · {country.region}</p>
        <div className="mt-2 flex items-center gap-2">
          {locked ? (
            <span className="rounded-pill bg-gold px-2.5 py-1 text-xs font-bold text-navy-deep">Unlock with Plus</span>
          ) : match !== null ? (
            <span className="rounded-pill bg-gold px-2.5 py-1 text-xs font-bold text-navy-deep">{match}% Match Score</span>
          ) : (
            <span className="rounded-pill border border-white/40 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white">
              {country.visaType} route
            </span>
          )}
          <ArrowRight size={15} className="text-gold opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
        </div>
      </div>
    </Link>
  )
}

/**
 * Free-plan "Destination & Visa Planner" — ranked Destination tiles plus the
 * Kolmari Pathways catalogued for the top Destination.
 *
 * Data integrity: rank numbers and Match Scores appear only when the Profile is
 * complete (real scores); otherwise tiles are neutral "explore" panels. Pathway
 * NAMES are catalog facts and always shown, but match STATUS is shown only once
 * the Profile is complete — we never imply eligibility.
 */
export function DestinationVisaPlanner({
  panels,
  lockedPanels,
  ranked,
  topCountry,
  pathways,
  profileComplete,
}: {
  panels: PlannerPanel[]
  lockedPanels: PlannerPanel[]
  ranked: boolean
  topCountry: CountryDetail
  pathways: PathwayEvaluation[]
  profileComplete: boolean
}) {
  const shown = pathways.slice(0, 4)
  const extra = pathways.length - shown.length

  return (
    <section className="card-surface p-6" aria-labelledby="planner-heading">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Your Destinations</p>
          <h2 id="planner-heading" className="mt-1 text-lg font-bold text-navy">Destination &amp; Visa Planner</h2>
        </div>
        <Link href="/saved" className="inline-flex items-center gap-1 text-xs font-bold text-gold-deep hover:text-navy">
          <Pencil size={13} aria-hidden="true" /> Edit
        </Link>
      </div>

      <p className="mt-1 text-sm text-muted">
        {ranked
          ? 'Your top Destinations, ranked by Match Score.'
          : 'Destinations to explore. Complete your Kolmari Profile to see personalized matches.'}
      </p>

      {/* Ranked destination tiles */}
      <div className="mt-5 space-y-3">
        {panels.map((panel, index) => (
          <DestinationTile key={panel.country.slug} panel={panel} rank={index + 1} ranked={ranked} locked={false} />
        ))}
        {lockedPanels.map((panel, index) => (
          <DestinationTile key={panel.country.slug} panel={panel} rank={panels.length + index + 1} ranked={ranked} locked />
        ))}
      </div>

      {lockedPanels.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-field)] border border-gold/30 bg-gold-soft/40 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-navy">
            <Lock size={15} className="shrink-0 text-gold-deep" aria-hidden="true" />
            Plus unlocks every matched Destination — not just your top {panels.length}.
          </p>
          <Link href="/#pricing" className="gold-button shrink-0">
            Upgrade <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Visa options for the top destination */}
      <div className="mt-6 rounded-[var(--radius-card)] border border-line bg-canvas p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">{countryFlag(topCountry.code)}</span>
          <div>
            <h3 className="text-sm font-bold text-navy">Kolmari Pathways for {topCountry.name}</h3>
            <p className="text-xs text-muted">Research routes for this Destination — not an eligibility decision.</p>
          </div>
        </div>

        {shown.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {shown.map((pathway) => (
              <li key={pathway.id}>
                <Link
                  href="/pathways"
                  className="flex items-center justify-between gap-3 rounded-[var(--radius-field)] border border-line bg-white px-4 py-3 transition hover:border-gold"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-navy">{pathway.name}</span>
                    <span className="block text-xs text-muted">{pathway.category}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {profileComplete && (
                      <span className={`rounded-pill px-2.5 py-1 text-[11px] font-bold ${STATUS_TONE[pathway.status]}`}>
                        {pathway.status}
                      </span>
                    )}
                    <ChevronRight size={15} className="text-muted" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-[var(--radius-field)] bg-white px-4 py-3 text-sm text-muted">
            No Kolmari Pathways are catalogued yet for {topCountry.name}. Browse all researched routes in Pathways.
          </p>
        )}

        {!profileComplete && shown.length > 0 && (
          <p className="mt-3 text-xs text-muted">
            Complete your Kolmari Profile to see match status for each Pathway.
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/pathways" className="inline-flex items-center gap-1 text-xs font-bold text-gold-deep hover:text-navy">
            {extra > 0 ? `View all Pathways (+${extra} more)` : 'View all Pathways'} <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted">
        Explore a Destination to see its Pathways. Upgrade to Plus to compare and plan across all of them.
      </p>
    </section>
  )
}
