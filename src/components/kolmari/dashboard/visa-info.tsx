'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Lock } from 'lucide-react'
import type { CountryDetail } from '@/lib/countries'
import type { PathwayDefinition } from '@/lib/pathways'

export type VisaGroup = {
  country: CountryDetail
  pathways: PathwayDefinition[]
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

          {group.pathways.length > 0 ? (
            <ul className="mt-3 divide-y divide-line rounded-[10px] border border-line">
              {group.pathways.map((pathway) => (
                <li key={pathway.id} className="px-4 py-3.5">
                  <p className="text-[13px] font-bold text-navy">{pathway.name}</p>
                  {detailed ? (
                    <dl className="mt-1.5 grid gap-x-6 gap-y-1 text-[12px] text-muted sm:grid-cols-2">
                      <div><dt className="inline font-semibold text-muted-soft">Route: </dt><dd className="inline">{pathway.category}</dd></div>
                      <div><dt className="inline font-semibold text-muted-soft">Income bar: </dt><dd className="inline">{pathway.incomeThreshold}</dd></div>
                      <div><dt className="inline font-semibold text-muted-soft">Timeline: </dt><dd className="inline">{pathway.estimatedProcessingTime}</dd></div>
                      <div><dt className="inline font-semibold text-muted-soft">Verified: </dt><dd className="inline">{pathway.lastVerified}</dd></div>
                    </dl>
                  ) : (
                    <p className="mt-0.5 text-[12px] text-muted-soft">{pathway.category}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 rounded-[10px] border border-dashed border-line-strong bg-canvas px-4 py-3 text-[12px] leading-5 text-muted">
              No researched visa pathways are available for this country yet.
            </p>
          )}

          {!detailed && (
            <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted">
              <Lock size={13} className="text-gold-deep" aria-hidden="true" />
              <span>Showing route names only.</span>
              <Link href="/settings?tab=billing" className="inline-flex items-center gap-1 font-bold text-info hover:text-navy">
                Upgrade for requirements, timelines, and fees <ArrowRight size={12} aria-hidden="true" />
              </Link>
            </p>
          )}
          <p className="mt-2 text-[10.5px] text-muted-soft">
            Research preview. Official requirements still control eligibility. Confirm material requirements with the responsible authority.
          </p>
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
