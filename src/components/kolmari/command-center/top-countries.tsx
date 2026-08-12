'use client'

import { useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { COUNTRIES } from '@/lib/countries'
import type { CCBoard } from '@/lib/command-center-model'

type MutateAction =
  | { type: 'add-destination'; name: string }
  | { type: 'delete-destination'; id: string }

export function TopCountriesGrid({ initial, suggested = [] }: { initial: CCBoard; suggested?: string[] }) {
  const [board, setBoard] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const topThree = useMemo(
    () => [...board.destinations].sort((a, b) => a.position - b.position).slice(0, 3),
    [board.destinations],
  )
  const used = new Set(board.destinations.map((d) => d.name.trim().toLowerCase()))
  const available = COUNTRIES.filter((country) => !used.has(country.name.toLowerCase()))
  const suggestions = suggested.filter((name) => !used.has(name.toLowerCase())).slice(0, Math.max(0, 3 - topThree.length))

  async function mutate(action: MutateAction) {
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/command-center/mutate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.error ?? 'Could not update your countries.')
      setBoard(result as CCBoard)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update your countries.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mb-6 rounded-[var(--radius-card)] border border-line bg-white p-4 shadow-tile sm:p-5" aria-labelledby="top-countries-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-gold-deep">My Plan</p>
          <h2 id="top-countries-heading" className="mt-1 font-display text-xl font-bold text-navy">Your top countries</h2>
          <p className="mt-1 text-xs text-muted">Your saved countries lead. Empty spots show your strongest quiz matches so you can add or replace them.</p>
        </div>
      </div>

      {error ? <p role="alert" className="mt-3 rounded-lg bg-danger/10 px-3 py-2 text-xs font-semibold text-danger">{error}</p> : null}

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {topThree.map((destination, index) => {
          const country = COUNTRIES.find((item) => item.name.toLowerCase() === destination.name.trim().toLowerCase())
          return (
            <article key={destination.id} className="relative min-h-28 rounded-xl border border-line bg-canvas p-4">
              <button type="button" onClick={() => void mutate({ type: 'delete-destination', id: destination.id })} disabled={busy} className="absolute right-3 top-3 grid size-7 place-items-center rounded-full text-muted hover:bg-white hover:text-navy disabled:opacity-40" aria-label={`Remove ${destination.name}`}>
                <X size={14} />
              </button>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">#{index + 1} · saved</p>
              <p className="mt-2 pr-8 text-base font-bold text-navy">{destination.name}</p>
              <p className="mt-1 text-xs text-muted">{country ? `${country.city} · ${country.region}` : 'Saved to your Command Center'}</p>
            </article>
          )
        })}

        {suggestions.map((name, offset) => {
          const country = COUNTRIES.find((item) => item.name === name)
          const rank = topThree.length + offset + 1
          return (
            <article key={`suggested-${name}`} className="relative min-h-28 rounded-xl border border-gold/35 bg-gold-soft/20 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold-deep">#{rank} · quiz match</p>
              <p className="mt-2 pr-8 text-base font-bold text-navy">{name}</p>
              <p className="mt-1 text-xs text-muted">{country ? `${country.city} · ${country.region}` : 'Recommended from your profile'}</p>
              <button type="button" onClick={() => void mutate({ type: 'add-destination', name })} disabled={busy} className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-navy shadow-sm disabled:opacity-40">
                <Plus size={12} /> Add to plan
              </button>
            </article>
          )
        })}

        {topThree.length + suggestions.length < 3 ? (
          <label className="flex min-h-28 cursor-pointer flex-col justify-center rounded-xl border border-dashed border-line-strong bg-white p-4 text-sm font-bold text-navy hover:border-gold">
            <span className="flex items-center gap-2"><Plus size={16} className="text-gold-deep" /> Add a country</span>
            <select aria-label="Add one of your top countries" defaultValue="" disabled={busy || available.length === 0} onChange={(event) => {
              const name = event.target.value
              if (name) void mutate({ type: 'add-destination', name })
              event.target.value = ''
            }} className="mt-3 h-9 w-full rounded-lg border border-line bg-canvas px-2 text-xs font-semibold text-navy">
              <option value="" disabled>Select country</option>
              {available.map((country) => <option key={country.slug} value={country.name}>{country.name}</option>)}
            </select>
          </label>
        ) : null}
      </div>
    </section>
  )
}
