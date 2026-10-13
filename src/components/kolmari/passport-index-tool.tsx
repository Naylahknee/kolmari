'use client'
import { useMemo, useRef, useState } from 'react'
import { PassportCover } from '@/components/kolmari/passport/passport-cover'
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

export function PassportIndexTool() {
  const params = useSearchParams()
  const initialPassport = (params.get('passport') ?? 'US').toUpperCase()
  const focus = (params.get('focus') ?? '').toUpperCase()
  const [passport, setPassport] = useState(PASSPORTS[initialPassport] ? initialPassport : 'US')
  const [tab, setTab] = useState<'destinations' | 'rankings' | 'compare'>('destinations')
  const [kind, setKind] = useState<RequirementKind | 'all'>('all')
  const [sort, setSort] = useState<'az' | 'za' | 'stay'>('az')
  const [rankQuery, setRankQuery] = useState('')
  const [compare, setCompare] = useState<string[]>([passport])
  const [addPassport, setAddPassport] = useState('')
  const [compareDestination, setCompareDestination] = useState('')
  const [detail, setDetail] = useState<string | null>(null)
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
    rows.sort((a, b) => sort === 'za' ? b.name.localeCompare(a.name) : sort === 'stay' ? (b.req.days ?? -1) - (a.req.days ?? -1) || a.name.localeCompare(b.name) : a.name.localeCompare(b.name))
    return rows.filter(r => (!q || r.name.toLowerCase().includes(q) || r.code.toLowerCase() === q) && (kind === 'all' || r.req.kind === kind))
  }, [entry, query, kind, sort])

  const focusRow = focus && destinations.find((d) => d.code === focus)

  return (
    <div className="mx-auto w-full max-w-[1480px]">
      <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Tools</p>
      <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">Passport Index</h1>
      <p className="mt-1 text-sm text-muted">
        What your passport opens — visa-free entry, visa on arrival, eTA, eVisa, or apply-ahead visas for 199 destinations.
      </p>

      {/* Passport picker + score hero */}
      <section className="card-surface mt-6 overflow-hidden bg-gradient-to-r from-white to-sky-50 p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-6">
          <PassportCover code={passport} name={entry.n} large />
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
        {(['destinations', 'rankings', 'compare'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-bold capitalize transition ${
              tab === t ? 'border-gold-deep text-navy' : 'border-transparent text-muted hover:text-navy'
            }`}
          >
            {t === 'destinations' ? `Destinations for ${entry.n}` : t === 'rankings' ? 'All passport rankings' : 'Compare passports'}
          </button>
        ))}
      </div>

      {tab === 'destinations' ? (
        <section className="mt-4">
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations…"
            className="min-w-0 w-full rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-muted/70"
            aria-label="Search destinations"
          />
          <select aria-label="Entry requirement" value={kind} onChange={e => setKind(e.target.value as RequirementKind | 'all')} className="rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm"><option value="all">All requirements</option>{KIND_ORDER.map(k => <option value={k} key={k}>{REQUIREMENT_LABEL[k]}</option>)}</select>
          <select aria-label="Sort destinations" value={sort} onChange={e => setSort(e.target.value as 'az' | 'za' | 'stay')} className="rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm"><option value="az">A–Z</option><option value="za">Z–A</option><option value="stay">Longest stay</option></select>
          </div>
          <p className="mt-2 text-xs text-muted">{destinations.length} matching destinations</p>
          {focusRow && !query && (
            <div ref={focusRef} className="card-surface mt-3 flex items-center gap-3 border-2 border-gold-deep p-4">
              <PassportCover code={focusRow.code} name={focusRow.name} />
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
                onClick={() => setDetail(d.code)}
                role="button" tabIndex={0} onKeyDown={e => { if(e.key === "Enter") setDetail(d.code) }}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-gold-soft/30 ${d.code === focus && !query ? 'bg-gold-soft/40' : ''}`}
              >
                <PassportCover code={d.code} name={d.name} />
                <p className="flex-1 text-sm font-semibold text-navy">{d.name}</p><span className="hidden text-xs text-muted sm:inline">{d.req.days ? `${d.req.days} days` : "—"}</span>
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
      ) : tab === "rankings" ? (
        <section className="card-surface mt-4 divide-y divide-navy/8 overflow-hidden">
          <input value={rankQuery} onChange={e => setRankQuery(e.target.value)} placeholder="Search rankings…" aria-label="Search rankings" className="m-3 w-[calc(100%-1.5rem)] rounded-lg border border-navy/15 p-3 text-sm" />
          {rankings.filter(({code,entry:e}) => e.n.toLowerCase().includes(rankQuery.toLowerCase()) || code.toLowerCase() === rankQuery.toLowerCase()).map(({ code, entry: e }) => (
            <button
              key={code}
              type="button"
              onClick={() => { setPassport(code); setTab('destinations') }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-gold-soft/30 ${code === passport ? 'bg-gold-soft/40' : ''}`}
              title={`View ${e.n}`}
            >
              <span className="w-8 text-sm font-black text-muted">#{e.r}</span>
              <PassportCover code={code} name={e.n} />
              <p className="flex-1 text-sm font-semibold text-navy">{e.n}</p>
              <p className="text-sm font-bold text-navy">{e.s} <span className="font-normal text-muted">destinations</span></p>
            </button>
          ))}
        </section>
      ) : (
        <section className="mt-4 space-y-4">
          <div className="card-surface flex flex-wrap gap-2 p-4"><select value={addPassport} onChange={e => setAddPassport(e.target.value)} aria-label="Select passport for comparison" className="min-w-0 flex-1 rounded-lg border border-navy/15 p-3 text-sm"><option value="">Select a passport</option>{PASSPORT_CODES.filter(c => !compare.includes(c)).map(c => <option key={c} value={c}>{PASSPORTS[c].n}</option>)}</select><button disabled={!addPassport || compare.length >= 3} onClick={() => {setCompare(v => [...v, addPassport]);setAddPassport("")}} className="rounded-lg bg-navy-deep px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Add passport</button></div>
          <div className="grid gap-3 md:grid-cols-3">{compare.map(c => {const p=PASSPORTS[c], n=categoryCounts(p), requirement=compareDestination ? decodeRequirement(p.d[compareDestination] ?? "VR") : null; return <div key={c} className="card-surface p-5"><div className="flex justify-between"><PassportCover code={c} name={p.n} large/><button onClick={() => setCompare(v => v.filter(x => x !== c))} className="text-xs text-muted">Remove ×</button></div><h3 className="mt-3 text-lg font-bold">{p.n}</h3><p className="text-sm">Mobility {p.s} · Rank #{p.r}</p><div className="mt-3 space-y-2">{KIND_ORDER.map(k => <div key={k} className="flex justify-between gap-3 text-xs"><span>{REQUIREMENT_LABEL[k]}</span><strong>{n[k]}</strong></div>)}</div>{requirement && <p className="mt-4 border-t pt-3 text-sm">{PASSPORTS[compareDestination]?.n}: {requirementSummary(requirement)}</p>}</div>})}</div>
          <div className="card-surface p-4"><label className="mb-2 block text-sm font-semibold" htmlFor="compare-dest">Compare destination entry rules</label><select id="compare-dest" className="w-full rounded-lg border border-navy/15 p-3 text-sm" value={compareDestination} onChange={e => setCompareDestination(e.target.value)}><option value="">Select destination</option>{PASSPORT_CODES.map(c => <option key={c} value={c}>{PASSPORTS[c].n}</option>)}</select></div>
        </section>
      )}

      {detail && <div role="presentation" className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-deep/60 p-4"><section role="dialog" aria-modal="true" aria-label="Destination entry requirements" className="card-surface w-full max-w-md p-6"><div className="flex items-start gap-4"><PassportCover code={detail} name={PASSPORTS[detail]?.n ?? detail} large/><div className="flex-1"><h2 className="text-xl font-bold">{PASSPORTS[detail]?.n ?? detail}</h2><p className="mt-2 text-sm">Traveling with a {entry.n} passport</p><p className="mt-3 text-sm font-semibold">{requirementSummary(decodeRequirement(entry.d[detail]))}</p></div><button onClick={() => setDetail(null)} className="rounded-lg border px-3 py-2 text-sm">Close</button></div><p className="mt-4 text-xs text-muted">Verify requirements with the destination immigration authority before travel. This dataset does not include official destination-specific guidance.</p></section></div>}

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
