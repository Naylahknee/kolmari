'use client'
import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  PASSPORTS, PASSPORT_CODES, PASSPORT_META, REQUIREMENT_LABEL, categoryCounts,
  decodeRequirement, rankedPassports, requirementSummary,
  type RequirementKind,
} from '@/lib/passport-index'

const KIND_STYLE: Record<RequirementKind, string> = {
  'visa-free': 'bg-emerald-100 text-emerald-900',
  'visa-on-arrival': 'bg-sky-100 text-sky-900',
  'eta': 'bg-amber-100 text-amber-900',
  'e-visa': 'bg-violet-100 text-violet-900',
  'visa-required': 'bg-rose-100 text-rose-900',
  'no-admission': 'bg-neutral-200 text-neutral-700',
}

const KIND_ORDER: RequirementKind[] = ['visa-free', 'visa-on-arrival', 'eta', 'e-visa', 'visa-required', 'no-admission']

function Flag({ code, size = 24 }: { code: string; size?: number }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      alt=""
      width={size}
      height={Math.round(size * 0.75)}
      className="shrink-0 rounded-[3px] object-cover shadow-sm"
      loading="lazy"
    />
  )
}

export function PassportIndexTool() {
  const params = useSearchParams()
  const initialPassport = (params.get('passport') ?? 'US').toUpperCase()
  const focus = (params.get('focus') ?? '').toUpperCase()
  const [passport, setPassport] = useState(PASSPORTS[initialPassport] ? initialPassport : 'US')
  const [tab, setTab] = useState<'destinations' | 'rankings'>('destinations')
  const [query, setQuery] = useState('')
  const focusRef = useRef<HTMLDivElement>(null)

  const entry = PASSPORTS[passport]
  const counts = useMemo(() => categoryCounts(entry), [entry])
  const rankings = useMemo(() => rankedPassports(), [])

  const destinations = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = Object.entries(entry.d).map(([code, raw]) => ({
      code,
      name: PASSPORTS[code]?.n ?? code,
      req: decodeRequirement(raw),
    }))
    rows.sort((a, b) => a.name.localeCompare(b.name))
    if (!q) return rows
    return rows.filter((r) => r.name.toLowerCase().includes(q) || r.code.toLowerCase() === q)
  }, [entry, query])

  const focusRow = focus && destinations.find((d) => d.code === focus)

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Tools</p>
      <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">Passport Index</h1>
      <p className="mt-1 text-sm text-muted">
        What your passport opens — visa-free entry, visa on arrival, eTA, eVisa, or apply-ahead visas for 199 destinations.
      </p>

      {/* Passport picker + score hero */}
      <section className="card-surface mt-6 p-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="pi-passport" className="text-xs font-bold uppercase tracking-widest text-muted">Your passport</label>
            <select
              id="pi-passport"
              value={passport}
              onChange={(e) => setPassport(e.target.value)}
              className="mt-1 block w-64 rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm font-semibold text-navy"
            >
              {PASSPORT_CODES.map((code) => (
                <option key={code} value={code}>{PASSPORTS[code].n}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-5">
            <div>
              <p className="text-3xl font-black text-navy">{entry.s}</p>
              <p className="text-xs text-muted">destinations visa-free / on arrival</p>
            </div>
            <div>
              <p className="text-3xl font-black text-navy">#{entry.r}</p>
              <p className="text-xs text-muted">world rank</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {KIND_ORDER.map((kind) => (
            <span key={kind} className={`rounded-full px-3 py-1 text-xs font-semibold ${KIND_STYLE[kind]}`}>
              {REQUIREMENT_LABEL[kind]} · {counts[kind]}
            </span>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-navy/10">
        {(['destinations', 'rankings'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-bold capitalize transition ${
              tab === t ? 'border-gold-deep text-navy' : 'border-transparent text-muted hover:text-navy'
            }`}
          >
            {t === 'destinations' ? `Destinations for ${entry.n}` : 'All passport rankings'}
          </button>
        ))}
      </div>

      {tab === 'destinations' ? (
        <section className="mt-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations…"
            className="w-full rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-muted/70"
            aria-label="Search destinations"
          />
          {focusRow && !query && (
            <div ref={focusRef} className="card-surface mt-3 flex items-center gap-3 border-2 border-gold-deep p-4">
              <Flag code={focusRow.code} size={32} />
              <div className="flex-1">
                <p className="text-sm font-bold text-navy">{focusRow.name}</p>
                <p className="text-xs text-muted">{requirementSummary(focusRow.req)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${KIND_STYLE[focusRow.req.kind]}`}>
                {requirementSummary(focusRow.req)}
              </span>
            </div>
          )}
          <div className="card-surface mt-3 divide-y divide-navy/8 overflow-hidden">
            {destinations.map((d) => (
              <div
                key={d.code}
                className={`flex items-center gap-3 px-4 py-2.5 ${d.code === focus && !query ? 'bg-gold-soft/40' : ''}`}
              >
                <Flag code={d.code} />
                <p className="flex-1 text-sm font-semibold text-navy">{d.name}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${KIND_STYLE[d.req.kind]}`}>
                  {requirementSummary(d.req)}
                </span>
              </div>
            ))}
            {destinations.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-muted">No destinations match “{query}”.</p>
            )}
          </div>
        </section>
      ) : (
        <section className="card-surface mt-4 divide-y divide-navy/8 overflow-hidden">
          {rankings.map(({ code, entry: e }, i) => (
            <button
              key={code}
              type="button"
              onClick={() => { setPassport(code); setTab('destinations') }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-gold-soft/30 ${code === passport ? 'bg-gold-soft/40' : ''}`}
              title={`View ${e.n}`}
            >
              <span className="w-8 text-sm font-black text-muted">#{i + 1}</span>
              <Flag code={code} />
              <p className="flex-1 text-sm font-semibold text-navy">{e.n}</p>
              <p className="text-sm font-bold text-navy">{e.s} <span className="font-normal text-muted">destinations</span></p>
            </button>
          ))}
        </section>
      )}

      <footer className="mt-6 text-xs leading-relaxed text-muted">
        <p>
          Data: <a className="font-semibold text-navy underline" href={PASSPORT_META.sourceUrl} target="_blank" rel="noreferrer">{PASSPORT_META.source}</a>{' '}
          (MIT license), updated {PASSPORT_META.updated}. Mobility score counts destinations reachable visa-free or with visa on arrival.
          Visa rules change often — always verify with the destination's official immigration source before you travel.
        </p>
      </footer>
    </div>
  )
}
