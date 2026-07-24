'use client'

import { useState } from 'react'
import { countryFlag } from '@/lib/countries'

type MatchData = { score: number; reasons: string[]; tradeoff: string }

// Deliberately a local structural type — no dependency on CountryDetail or server-only modules.
type CompareCountrySummary = {
  slug: string; name: string; code: string; city: string; region: string
  visaType: string; incomeRequired: number; safety: string; cost: string; summary: string
}

type CompareCountry = {
  country: CompareCountrySummary
  match: MatchData | null
}

type Props = {
  current: CompareCountry
  others: CompareCountry[]
}

const METRIC_LABELS: { key: keyof CompareCountrySummary | 'matchScore'; label: string }[] = [
  { key: 'region', label: 'Region' },
  { key: 'city', label: 'Main city' },
  { key: 'visaType', label: 'Primary pathway' },
  { key: 'incomeRequired', label: 'Income guide' },
  { key: 'cost', label: 'Relative cost' },
  { key: 'safety', label: 'Safety signal' },
  { key: 'matchScore', label: 'Nexit Match' },
]

function formatValue(key: keyof CompareCountrySummary | 'matchScore', country: CompareCountrySummary, match: MatchData | null): string {
  if (key === 'matchScore') return match ? `${match.score}%` : '—'
  if (key === 'incomeRequired') return `$${country.incomeRequired.toLocaleString()}/mo`
  return String(country[key as keyof CompareCountrySummary])
}

function matchLabelClass(score: number) {
  if (score >= 85) return 'text-ok font-bold'
  if (score >= 70) return 'text-gold-deep font-bold'
  return 'text-muted'
}

export function CompareTab({ current, others }: Props) {
  const [selected, setSelected] = useState<string>(others[0]?.country.slug ?? '')
  const compareTo = others.find((o) => o.country.slug === selected) ?? others[0]

  if (!compareTo) {
    return (
      <section className="card-surface p-8 text-center">
        <p className="font-extrabold text-navy">No other Nextinations available to compare</p>
        <p className="mt-1 text-sm text-muted">Add more countries to your workspace to compare them here.</p>
      </section>
    )
  }

  return (
    <div className="space-y-5">
      <section className="card-surface p-6">
        <h2 className="font-display text-2xl font-bold text-navy">Compare Nextinations</h2>
        <p className="mt-2 text-sm text-muted">Side-by-side comparison. All figures are planning guides — not official requirements.</p>

        {/* Country picker */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-muted">Compare {current.country.name} with:</span>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <button
                key={o.country.slug}
                type="button"
                onClick={() => setSelected(o.country.slug)}
                className={`rounded-pill px-3.5 py-1.5 text-sm font-bold transition border ${
                  o.country.slug === selected
                    ? 'bg-gold text-navy border-gold'
                    : 'bg-white text-muted hover:text-navy border-line'
                }`}
              >
                {countryFlag(o.country.code)} {o.country.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="card-surface overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-3 border-b border-line">
          <div className="p-4 text-xs font-bold uppercase tracking-[.12em] text-muted">Metric</div>
          <div className="border-l border-line bg-gold/10 p-4">
            <span className="text-2xl" aria-hidden>{countryFlag(current.country.code)}</span>
            <p className="mt-1 font-bold text-navy">{current.country.name}</p>
            {current.match ? (
              <p className={`text-sm ${matchLabelClass(current.match.score)}`}>{current.match.score}% Match</p>
            ) : null}
          </div>
          <div className="border-l border-line p-4">
            <span className="text-2xl" aria-hidden>{countryFlag(compareTo.country.code)}</span>
            <p className="mt-1 font-bold text-navy">{compareTo.country.name}</p>
            {compareTo.match ? (
              <p className={`text-sm ${matchLabelClass(compareTo.match.score)}`}>{compareTo.match.score}% Match</p>
            ) : null}
          </div>
        </div>

        {METRIC_LABELS.map(({ key, label }, index) => {
          const currentVal = formatValue(key, current.country, current.match)
          const compareVal = formatValue(key, compareTo.country, compareTo.match)
          return (
            <div key={key} className={`grid grid-cols-3 ${index % 2 === 0 ? '' : 'bg-canvas/50'} border-b border-line last:border-0`}>
              <div className="p-4 text-xs font-bold text-muted">{label}</div>
              <div className="border-l border-line bg-gold/5 p-4 text-sm font-semibold text-navy">{currentVal}</div>
              <div className="border-l border-line p-4 text-sm text-muted">{compareVal}</div>
            </div>
          )
        })}
      </section>

      {/* Tradeoff summaries */}
      {(current.match || compareTo.match) && (
        <div className="grid gap-4 md:grid-cols-2">
          {current.match && (
            <div className="card-surface p-5">
              <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">{current.country.name} — key tradeoff</p>
              <p className="mt-2 text-sm leading-6 text-muted">{current.match.tradeoff}</p>
            </div>
          )}
          {compareTo.match && (
            <div className="card-surface p-5">
              <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">{compareTo.country.name} — key tradeoff</p>
              <p className="mt-2 text-sm leading-6 text-muted">{compareTo.match.tradeoff}</p>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-muted">Comparison is based on your Nexit Profile and editorial planning data. Not a financial or legal assessment.</p>
    </div>
  )
}
