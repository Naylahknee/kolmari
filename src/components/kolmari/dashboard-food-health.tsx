import Link from 'next/link'
import { COUNTRY_FOOD_CULTURE } from '@/lib/food-culture/data'
import {
  TRACKED_ALLERGENS,
  ARCHETYPE_LABELS,
  ALLERGEN_LABELS,
  PREVALENCE_LABELS,
} from '@/lib/food-culture/types'

/* Food & Health Fit signal for the dashboard command center.
 *
 * Surfaces the saved destination's everyday food culture, allergen exposure, and
 * heart-health note so the dimension informs the dashboard alongside eligibility,
 * documents, and budget. Read-only summary — the interactive explorer lives
 * elsewhere. All data is a disclosed Kolmari editorial assessment; nothing is
 * fabricated, and an honest empty state shows when there's no saved destination
 * or no reviewed entry yet. */
export function DashboardFoodHealthCard({
  countrySlug,
  countryName,
}: {
  countrySlug: string | null
  countryName: string | null
}) {
  const entry = countrySlug ? COUNTRY_FOOD_CULTURE[countrySlug] : null

  return (
    <section
      className="rounded-[var(--radius-card)] border border-line bg-white px-5 pb-5 pt-[18px] shadow-tile"
      aria-labelledby="food-health-heading"
    >
      <div className="mb-[15px] flex items-center justify-between gap-4">
        <h2 id="food-health-heading" className="text-[16px] font-bold tracking-[-0.01em] text-navy">
          Food &amp; Health Fit{countryName ? ` · ${countryName}` : ''}
        </h2>
        {countrySlug && (
          <Link href={`/nextinations/${countrySlug}/v2/overview`} className="text-xs font-bold text-info hover:text-navy">
            View destination
          </Link>
        )}
      </div>

      {!countrySlug ? (
        <p className="text-[13px] leading-[1.6] text-muted">
          Save a destination to your plan to see its everyday food culture, allergen exposure, and heart-health fit here.
        </p>
      ) : !entry ? (
        <p className="text-[13px] leading-[1.6] text-muted">
          Food &amp; Health Fit for {countryName ?? 'this destination'} is being added. Kolmari reviews each entry before it
          appears — no estimated food data is shown.
        </p>
      ) : (
        <div className="space-y-3">
          {/* Archetypes */}
          <div className="flex flex-wrap gap-1.5">
            {entry.archetypes.map((a) => (
              <span key={a} className="rounded-pill bg-gold-soft px-2 py-0.5 text-[11px] font-semibold text-navy">
                {ARCHETYPE_LABELS[a]}
              </span>
            ))}
          </div>

          {/* Allergen exposure in everyday food */}
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted-soft">Allergens in everyday food</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {TRACKED_ALLERGENS.map((a) => {
                const prev = entry.allergenPrevalence[a]
                const caution = prev === 'common'
                return (
                  <span
                    key={a}
                    className={`rounded-field border px-2 py-0.5 text-[11px] ${
                      caution ? 'border-gold bg-gold-soft font-bold text-warn' : 'border-line bg-white text-muted'
                    }`}
                    title={`${ALLERGEN_LABELS[a]}: ${PREVALENCE_LABELS[prev]}`}
                  >
                    {ALLERGEN_LABELS[a]}: {PREVALENCE_LABELS[prev]}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Heart-health note */}
          {entry.cardioNote && (
            <p className="text-[12.5px] leading-[1.55] text-navy">
              <span className="font-bold">Heart-health note. </span>
              {entry.cardioNote}
            </p>
          )}

          {/* Labeling */}
          <div className="rounded-field bg-[#f7f9fc] p-3">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted-soft">Allergen labeling</p>
            <p className="mt-1 text-[12px] leading-[1.55] text-muted">
              {entry.labelingLaw}
              {entry.sourceUrl && (
                <>
                  {' '}
                  <a
                    href={entry.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-info underline hover:text-navy"
                  >
                    Source
                  </a>
                </>
              )}
            </p>
          </div>

          <p className="border-t border-line pt-2 text-[10px] text-muted-soft">
            Kolmari editorial assessment · last reviewed {entry.lastReviewed}. Verify allergen and labeling details with
            official sources before relying on them for a move.
          </p>
        </div>
      )}
    </section>
  )
}
