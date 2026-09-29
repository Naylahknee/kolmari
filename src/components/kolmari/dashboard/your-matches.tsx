'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { JourneyCollapse } from '@/lib/dashboard-layout'
import type { JourneyPanelData } from '@/components/kolmari/dashboard/matched-destinations'
import type { DestinationRow } from '@/components/kolmari/dashboard-side-cards'
import { JourneyTracker } from '@/components/kolmari/dashboard/journey-tracker'
import { DashboardDestinationPanel } from '@/components/kolmari/dashboard/destination-panel'
import { VisaRouteTable, type VisaGroup } from '@/components/kolmari/dashboard/visa-route-table'

const EYEBROW = 'text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold-deep'

/**
 * Paid tiers with a complete profile: one "Your matches" section.
 *
 * The three match cards are nested selectors in the approved card design.
 * Selecting a card opens that country's researched visa options below the
 * cards, inside this same section. Selection never navigates away and never
 * changes saved/shortlisted destination state. The Journey tracker nests
 * beside the cards.
 */
export function YourMatchesSection({
  rows,
  journey,
  collapseDirection,
  visaGroups,
  detailed,
}: {
  rows: DestinationRow[]
  journey: JourneyPanelData | null
  collapseDirection: JourneyCollapse
  visaGroups: VisaGroup[]
  detailed: boolean
}) {
  const [selectedSlug, setSelectedSlug] = useState(rows[0]?.country.slug ?? '')
  const selectedRow = rows.find((row) => row.country.slug === selectedSlug) ?? rows[0] ?? null
  const group = selectedRow
    ? (visaGroups.find((item) => item.country.slug === selectedRow.country.slug) ?? null)
    : null

  return (
    <section id="dashboard-matches" aria-labelledby="matches-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className={EYEBROW}>Your relocation journey</p>
          <h2 id="matches-heading" className="mt-1.5 text-[26px] font-bold tracking-[-0.02em] text-navy">
            Your matches
          </h2>
        </div>
        <Link
          href="/your-world"
          className="inline-flex items-center gap-1 text-xs font-bold text-info hover:text-navy"
        >
          Explore more destinations <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </div>
      <p className="mt-1.5 max-w-[56ch] text-[13.5px] text-muted">
        Based on what you told us, these are the three destinations worth exploring first.
        Select a match to preview its visa pathways below.
      </p>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="grid min-w-0 content-start gap-[14px] sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((row, index) => (
              <DashboardDestinationPanel
                key={row.country.slug}
                data={row}
                rank={index + 1}
                selected={selectedRow?.country.slug === row.country.slug}
                onSelect={() => setSelectedSlug(row.country.slug)}
              />
            ))}
          </div>
          {group && (
            <div
              id="dashboard-visa-options"
              aria-live="polite"
              className="mt-4 rounded-[var(--radius-card)] border border-line bg-white px-5 py-5 shadow-tile sm:px-6"
            >
              <VisaRouteTable group={group} detailed={detailed} />
            </div>
          )}
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
