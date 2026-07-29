'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Lock, Pencil } from 'lucide-react'
import type { PathwayMatchStatus } from '@/lib/pathways'

export type PlannerPathway = { id: string; name: string; category: string; status: PathwayMatchStatus }
export type PlannerDestination = {
  slug: string
  name: string
  code: string
  city: string
  region: string
  visaType: string
  match: number | null
  locked: boolean
  pathways: PlannerPathway[]
}

const STATUS_TONE: Record<PathwayMatchStatus, string> = {
  'Strong Match': 'bg-ok-soft text-ok',
  'Possible Match': 'bg-warn-soft text-warn',
  'Missing Requirements': 'bg-canvas text-muted',
}

function Flag({ code, className }: { code: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
      alt=""
      className={className}
      onError={(e) => { e.currentTarget.style.display = 'none' }}
    />
  )
}

/**
 * Free-plan "Destination & Visa Planner" — small country panels arranged
 * horizontally; clicking one reveals its details (Kolmari Pathways) below.
 * Uses each country's flag (per-country, reliable) rather than a shared map
 * graphic. Rank numbers / Match Scores appear only when the Profile is
 * complete; pathway match status only when complete — never implying eligibility.
 */
export function DestinationVisaPlanner({
  destinations,
  ranked,
  profileComplete,
}: {
  destinations: PlannerDestination[]
  ranked: boolean
  profileComplete: boolean
}) {
  const firstUnlocked = destinations.find((d) => !d.locked) ?? destinations[0]
  const [openSlug, setOpenSlug] = useState<string | null>(firstUnlocked?.slug ?? null)
  const selected = destinations.find((d) => d.slug === openSlug) ?? null

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
          ? 'Your top Destinations. Tap one to see its Pathways.'
          : 'Destinations to explore. Complete your Kolmari Profile to see personalized matches.'}
      </p>

      {/* Small panels, arranged horizontally */}
      <div className="mt-4 flex flex-wrap gap-2">
        {destinations.map((d, index) => {
          const active = d.slug === openSlug
          return (
            <button
              key={d.slug}
              type="button"
              onClick={() => setOpenSlug(active ? null : d.slug)}
              aria-expanded={active}
              className={[
                'inline-flex items-center gap-2 rounded-[var(--radius-field)] border px-3 py-2 text-sm font-semibold transition',
                active ? 'border-gold bg-gold-soft/60 text-navy' : 'border-line bg-white text-navy hover:border-gold/60',
              ].join(' ')}
            >
              {ranked && <span className="text-xs font-extrabold text-gold-deep">#{index + 1}</span>}
              <Flag code={d.code} className="h-3.5 w-5 rounded-[2px] object-cover" />
              <span>{d.name}</span>
              {d.locked
                ? <Lock size={13} className="text-gold-deep" aria-hidden="true" />
                : <ChevronRight size={14} className={`text-muted transition ${active ? 'rotate-90' : ''}`} aria-hidden="true" />}
            </button>
          )
        })}
      </div>

      {/* Revealed details for the selected panel */}
      {selected && (
        <div className="mt-4 rounded-[var(--radius-card)] border border-line bg-canvas p-5">
          <div className="flex items-center gap-3">
            <Flag code={selected.code} className="h-6 w-9 rounded-[3px] object-cover shadow-sm" />
            <div className="min-w-0">
              <h3 className="text-base font-bold text-navy">{selected.name}</h3>
              <p className="text-xs text-muted">{selected.city} · {selected.region}</p>
            </div>
            <span className="ml-auto">
              {selected.match !== null ? (
                <span className="rounded-pill bg-gold px-2.5 py-1 text-xs font-bold text-navy-deep">{selected.match}% Match Score</span>
              ) : (
                <span className="rounded-pill border border-line bg-white px-2.5 py-1 text-xs font-semibold text-muted">{selected.visaType} route</span>
              )}
            </span>
          </div>

          {selected.locked ? (
            <div className="mt-4 rounded-[var(--radius-field)] border border-gold/30 bg-gold-soft/40 p-4 sm:flex sm:items-center sm:justify-between sm:gap-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-navy">
                <Lock size={15} className="shrink-0 text-gold-deep" aria-hidden="true" />
                Unlock {selected.name} and every matched Destination with Plus.
              </p>
              <Link href="/#pricing" className="gold-button mt-3 shrink-0 sm:mt-0">
                Upgrade <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gold-deep">Kolmari Pathways for {selected.name}</p>
              {selected.pathways.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {selected.pathways.slice(0, 4).map((p) => (
                    <li key={p.id}>
                      <Link
                        href="/pathways"
                        className="flex items-center justify-between gap-3 rounded-[var(--radius-field)] border border-line bg-white px-4 py-3 transition hover:border-gold"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-navy">{p.name}</span>
                          <span className="block text-xs text-muted">{p.category}</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2">
                          {profileComplete && (
                            <span className={`rounded-pill px-2.5 py-1 text-[11px] font-bold ${STATUS_TONE[p.status]}`}>{p.status}</span>
                          )}
                          <ChevronRight size={15} className="text-muted" aria-hidden="true" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 rounded-[var(--radius-field)] bg-white px-4 py-3 text-sm text-muted">
                  No Kolmari Pathways are catalogued yet for {selected.name}.
                </p>
              )}
              {!profileComplete && selected.pathways.length > 0 && (
                <p className="mt-3 text-xs text-muted">Complete your Kolmari Profile to see match status for each Pathway.</p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Link href={`/nextinations/${selected.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-gold-deep hover:text-navy">
                  Open {selected.name} <ArrowRight size={12} />
                </Link>
                <Link href="/pathways" className="inline-flex items-center gap-1 text-xs font-bold text-gold-deep hover:text-navy">
                  View all Pathways <ArrowRight size={12} />
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  )
}
