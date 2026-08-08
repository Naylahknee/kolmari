'use client'

import { useMemo, useState } from 'react'
import { COUNTRIES } from '@/lib/countries'
import {
  FOOD_ARCHETYPES,
  TRACKED_ALLERGENS,
  ARCHETYPE_LABELS,
  ARCHETYPE_DESCRIPTIONS,
  ALLERGEN_LABELS,
  PREVALENCE_LABELS,
  archetypeMatchCount,
  allergenFlagCount,
  type FoodArchetype,
  type TrackedAllergen,
  type CountryFoodCulture,
} from '@/lib/food-culture/types'
import { COUNTRY_FOOD_CULTURE } from '@/lib/food-culture/data'

/* Food & Health Fit filter (the reusable explorer).
 *
 * Filterable tags, not a blended score. Selecting archetypes ranks countries by
 * how many they match; flagging allergens never removes a country — it flags it
 * and breaks ranking ties toward safety. Every card discloses that the data is
 * an editorial Kolmari assessment with a review date, the same trust discipline
 * as cost baselines and visa data. */

type Entry = CountryFoodCulture & { name: string }

/** Display name for a slug: the destination-set name when present, else a
 *  title-cased slug (covers food-only entries like Croatia or the UAE). */
export function resolveCountryName(slug: string): string {
  const known = COUNTRIES.find((c) => c.slug === slug)
  if (known) return known.name
  return slug.split('-').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ')
}

export function FoodCultureFilter({
  data = COUNTRY_FOOD_CULTURE,
}: {
  data?: Record<string, CountryFoodCulture>
}) {
  const [selected, setSelected] = useState<FoodArchetype[]>([])
  const [flagged, setFlagged] = useState<TrackedAllergen[]>([])

  const toggleArchetype = (a: FoodArchetype) =>
    setSelected((list) => (list.includes(a) ? list.filter((x) => x !== a) : [...list, a]))
  const toggleAllergen = (a: TrackedAllergen) =>
    setFlagged((list) => (list.includes(a) ? list.filter((x) => x !== a) : [...list, a]))

  const ranked = useMemo<Entry[]>(() => {
    const entries: Entry[] = Object.values(data).map((c) => ({ ...c, name: resolveCountryName(c.countrySlug) }))
    // Sort: archetype match count desc → fewer allergen flags → alphabetical.
    return entries.sort((a, b) => {
      const matchDiff = archetypeMatchCount(b, selected) - archetypeMatchCount(a, selected)
      if (matchDiff !== 0) return matchDiff
      const flagDiff = allergenFlagCount(a, flagged) - allergenFlagCount(b, flagged)
      if (flagDiff !== 0) return flagDiff
      return a.name.localeCompare(b.name)
    })
  }, [data, selected, flagged])

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-card border border-neutral-200 bg-white p-5 shadow-sm">
        <fieldset>
          <legend className="text-sm font-bold text-navy-deep">Prioritize a food culture</legend>
          <p className="mt-0.5 text-xs text-neutral-500">Pick what matters to you. Countries are ranked by how many you match.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {FOOD_ARCHETYPES.map((a) => {
              const on = selected.includes(a)
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleArchetype(a)}
                  aria-pressed={on}
                  title={ARCHETYPE_DESCRIPTIONS[a]}
                  className={`rounded-field border px-3 py-1.5 text-xs font-semibold transition ${
                    on
                      ? 'border-navy-deep bg-navy-deep text-white'
                      : 'border-neutral-300 bg-neutral-50 text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  {ARCHETYPE_LABELS[a]}
                </button>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="mt-5 border-t border-neutral-100 pt-4">
          <legend className="text-sm font-bold text-navy-deep">Flag allergens to watch</legend>
          <p className="mt-0.5 text-xs text-neutral-500">
            Flagging never hides a country — it marks where an allergen is common in everyday food and breaks ties toward safer options.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {TRACKED_ALLERGENS.map((a) => {
              const on = flagged.includes(a)
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAllergen(a)}
                  aria-pressed={on}
                  className={`rounded-field border px-3 py-1.5 text-xs font-semibold transition ${
                    on
                      ? 'border-amber-500 bg-amber-50 text-amber-800'
                      : 'border-neutral-300 bg-neutral-50 text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  {on ? '⚑ ' : ''}
                  {ALLERGEN_LABELS[a]}
                </button>
              )
            })}
          </div>
        </fieldset>
      </div>

      {/* Results */}
      {ranked.length === 0 ? (
        <div className="rounded-card border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
          <p className="text-sm font-semibold text-neutral-700">Food &amp; Health Fit data is being added.</p>
          <p className="mt-1 text-xs text-neutral-500">
            Country entries are reviewed before they appear here — no estimated or placeholder food data is shown.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {ranked.map((c) => (
            <li key={c.countrySlug}>
              <FoodCultureCard country={c} name={c.name} selected={selected} flagged={flagged} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function FoodCultureCard({
  country,
  name,
  selected = [],
  flagged = [],
}: {
  country: CountryFoodCulture
  name: string
  selected?: FoodArchetype[]
  flagged?: TrackedAllergen[]
}) {
  const matches = archetypeMatchCount(country, selected)
  const flags = allergenFlagCount(country, flagged)

  return (
    <div className="flex h-full flex-col rounded-card border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-navy-deep">{name}</h3>
        <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
          {selected.length > 0 && (
            <span className="rounded-field bg-gold-soft px-2 py-0.5 text-[11px] font-bold text-gold-deep">
              {matches}/{selected.length} match
            </span>
          )}
          {flags > 0 && (
            <span className="rounded-field bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800">
              ⚑ {flags} flagged
            </span>
          )}
        </div>
      </div>

      {/* Archetypes */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {country.archetypes.map((a) => {
          const on = selected.includes(a)
          return (
            <span
              key={a}
              className={`rounded-field px-2 py-0.5 text-[11px] font-semibold ${
                on ? 'bg-navy-deep text-white' : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {ARCHETYPE_LABELS[a]}
            </span>
          )
        })}
      </div>

      {/* Allergen prevalence */}
      <div className="mt-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">Allergens in everyday food</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {TRACKED_ALLERGENS.map((a) => {
            const prev = country.allergenPrevalence[a]
            const isFlagged = flagged.includes(a) && prev === 'common'
            return (
              <span
                key={a}
                className={`rounded-field border px-2 py-0.5 text-[11px] ${
                  isFlagged
                    ? 'border-amber-400 bg-amber-50 font-bold text-amber-800'
                    : 'border-neutral-200 bg-white text-neutral-600'
                }`}
                title={`${ALLERGEN_LABELS[a]}: ${PREVALENCE_LABELS[prev]}`}
              >
                {ALLERGEN_LABELS[a]}: {PREVALENCE_LABELS[prev]}
              </span>
            )
          })}
        </div>
      </div>

      {country.cardioNote && (
        <p className="mt-3 text-xs leading-5 text-neutral-600">
          <span className="font-semibold text-navy-deep">Heart-health note. </span>
          {country.cardioNote}
        </p>
      )}

      <div className="mt-3 rounded-field bg-neutral-50 p-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">Allergen labeling</p>
        <p className="mt-1 text-xs leading-5 text-neutral-600">
          {country.labelingLaw}
          {country.sourceUrl && (
            <>
              {' '}
              <a
                href={country.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gold-deep underline"
              >
                Source
              </a>
            </>
          )}
        </p>
      </div>

      {/* Editorial disclosure — kept on every card. */}
      <p className="mt-3 border-t border-neutral-100 pt-2 text-[10px] text-neutral-400">
        Kolmari editorial assessment · last reviewed {country.lastReviewed}. Verify allergen and labeling details with
        official sources before relying on them for a move.
      </p>
    </div>
  )
}
