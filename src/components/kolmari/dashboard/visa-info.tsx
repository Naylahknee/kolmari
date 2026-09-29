'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { CountryDetail } from '@/lib/countries'
import type { PathwayDefinition } from '@/lib/pathways'
import { VisaRouteTable } from '@/components/kolmari/dashboard/visa-route-table'

export type VisaGroup = {
  country: CountryDetail
  pathways: PathwayDefinition[]
}

/**
 * The researched pathway rows for one country. Rendered through the shared
 * VisaRouteTable so the standalone section matches the Your Matches panel.
 */
export function VisaOptionsList({ group, detailed }: { group: VisaGroup; detailed: boolean }) {
  return <VisaRouteTable group={group} detailed={detailed} />
}

/**
 * Visa info stays visible on the dashboard no matter which destinations section
 * renders above it. Free accounts see a basic list of researched route names;
 * paid accounts see the detailed preview (category, income bar, timeline).
 */
export function VisaInfoSection({ groups, detailed }: { groups: VisaGroup[]; detailed: boolean }) {
  const [slug, setSlug] = useState(groups[0]?.country.slug ?? '')
  const group = groups.find((item) => item.country.slug === slug) ?? groups[0] ?? null

  return (
    <section
      id="dashboard-visa-options"
      aria-labelledby="visa-options-heading"
      aria-live="polite"
      className="rounded-[var(--radius-card)] border border-line bg-white px-5 py-5 shadow-tile sm:px-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold-deep">Visa pathways</p>
          <h2 id="visa-options-heading" className="mt-1 text-[18px] font-bold text-navy">
            Visa options{group ? ` for ${group.country.name}` : ''}
          </h2>
        </div>
        <Link href="/pathways" className="text-xs font-bold text-info hover:text-navy">
          Open Pathways
        </Link>
      </div>

      {group ? (
        <>
          {groups.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Choose a destination">
              {groups.map((item) => {
                const on = item.country.slug === group.country.slug
                return (
                  <button
                    key={item.country.slug}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setSlug(item.country.slug)}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors ${
                      on
                        ? 'bg-navy text-white'
                        : 'border border-line bg-white text-muted hover:border-gold-deep hover:text-navy'
                    }`}
                  >
                    {item.country.name}
                  </button>
                )
              })}
            </div>
          )}

          <VisaOptionsList group={group} detailed={detailed} />
        </>
      ) : (
        <div className="mt-3 rounded-[14px] border border-dashed border-line-strong bg-canvas px-5 py-8 text-center">
          <p className="text-sm font-bold text-navy">Complete your Kolmari Profile to see visa options</p>
          <p className="mx-auto mt-1 max-w-md text-[12px] leading-5 text-muted">
            Your top matches and their researched visa routes will appear here after your profile is complete.
          </p>
          <Link href="/profile-wizard" className="gold-button mt-4">
            Build My Kolmari Plan <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  )
}
