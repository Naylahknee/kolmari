'use client'

import { useMemo, useState } from 'react'
import { COUNTRIES } from '@/lib/countries'
import {
  FOOD_ARCHETYPES,
  TRACKED_ALLERGENS,
  ARCHETYPE_LABELS,
  ARCHETYPE_DESCRIPTIONS,
  ALLERGEN_LABELS,
  archetypeMatchCount,
  allergenFlagCount,
  type FoodArchetype,
  type TrackedAllergen,
  type CountryFoodCulture,
} from '@/lib/food-culture/types'
import { COUNTRY_FOOD_CULTURE } from '@/lib/food-culture/data'
import { CountryFoodFitCard } from './country-food-fit-card'

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
              <CountryFoodFitCard country={c} name={c.name} selected={selected} flagged={flagged} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
