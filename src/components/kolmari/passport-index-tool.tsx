'use client'
import { useMemo, useState } from 'react'
import { PassportCover } from '@/components/kolmari/passport/passport-cover'
import { PassportAccessMap } from '@/components/kolmari/passport/passport-access-map'
import { useSearchParams } from 'next/navigation'
import { Ban, BarChart3, CheckCircle2, ChevronRight, Compass, FileText, Monitor, Plane, Search, Smartphone, Trophy, type LucideIcon } from 'lucide-react'
import { flagSrc } from '@/lib/flags'
import { PASSPORT_REGIONS, regionOf, type PassportRegion } from '@/lib/passport-index/regions'
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

const KIND_ICON: Record<RequirementKind, LucideIcon> = {
  'visa-free': CheckCircle2, 'visa-on-arrival': Plane, eta: Smartphone,
  'e-visa': Monitor, 'visa-required': FileText, 'no-admission': Ban,
}
/** Display guidance only; the source data has no per-destination notes. */
const KIND_NOTE: Record<RequirementKind,string> = {
  'visa-free': 'Passport only at the border.',
  'visa-on-arrival': 'Visa issued at the border.',
  eta: 'Apply online before travel.',
  'e-visa': 'Apply online before travel.',
  'visa-required': 'Apply before travel.',
  'no-admission': 'Entry not currently permitted.',
}
const KIND_ORDER: RequirementKind[] = ['visa-free', 'visa-on-arrival', 'eta', 'e-visa', 'visa-required', 'no-admission']
const STAY_OPTIONS = [['any', 'Maximum stay'], ['30', '30+ days'], ['90', '90+ days'], ['180', '180+ days']] as const
type StayFilter = (typeof STAY_OPTIONS)[number][0]
const selectClass = 'h-11 w-full min-w-0 rounded-lg border border-navy/15 bg-white px-3 text-sm font-medium text-navy'
const ROW_GRID = 'md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_110px_minmax(0,1fr)_20px'

export function PassportIndexTool() {
  const params = useSearchParams()
  const initialPassport = (params.get('passport') ?? 'US').toUpperCase()
  const focus = (params.get('focus') ?? '').toUpperCase()
  const [passport, setPassport] = useState(PASSPORTS[initialPassport] ? initialPassport : 'US')
  const [tab, setTab] = useState<'destinations' | 'rankings' | 'compare'>('destinations')
  const [kind, setKind] = useState<RequirementKind | 'all'>('all')
  const [region, setRegion] = useState<PassportRegion | 'all'>('all')
  const [stay, setStay] = useState<StayFilter>('any')
  const [sort, setSort] = useState<'az' | 'za' | 'stay'>('az')
  const [rankQuery, setRankQuery] = useState('')
  const [compare, setCompare] = useState<string[]>([passport])
  const [addPassport, setAddPassport] = useState('')
  const [compareDestination, setCompareDestination] = useState('')
  const [detail, setDetail] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const resetFilters = () => { setQuery(''); setKind('all'); setRegion('all'); setStay('any') }

  const entry = PASSPORTS[passport]
  const counts = useMemo(() => categoryCounts(entry), [entry])
  const rankings = useMemo(() => rankedPassports(), [])
  const total = Object.keys(entry.d).length

  const destinations = useMemo(() => {
    const q = query.trim().toLowerCase()
    const minDays = stay === 'any' ? 0 : Number(stay)
    const rows = Object.entries(entry.d).map(([code, raw]) => ({
      code,
      name: PASSPORTS[code]?.n ?? code,
      region: regionOf(code),
      req: decodeRequirement(raw),
    }))
    rows.sort((a, b) => sort === 'za'
      ? b.name.localeCompare(a.name)
      : sort === 'stay'
        ? (b.req.days ?? -1) - (a.req.days ?? -1) || a.name.localeCompare(b.name)
        : a.name.localeCompare(b.name))
    return rows.filter((d) => (
      (!q || d.name.toLowerCase().includes(q) || d.code.toLowerCase() === q) &&
      (kind === 'all' || d.req.kind === kind) &&
      (region === 'all' || d.region === region) &&
      (!minDays || (d.req.days ?? 0) >= minDays)
    ))
  }, [entry, query, kind, region, stay, sort])
  const tabLabel = (t: typeof tab) => t === 'destinations'
    ? `Destinations for ${entry.n}`
    : t === 'rankings' ? 'All Passport Rankings' : 'Compare Passports'

  return (
    <div className="mx-auto w-full max-w-[1480px]">
      {/* Existing Passport Index: visual refresh of hero, not a new page. */}
      <section className="card-surface overflow-hidden bg-gradient-to-r from-white to-sky-50 p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-6 sm:gap-8">
          <PassportCover code={passport} name={entry.n} large />
          <div className="min-w-0 flex-1 basis-[420px]">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Tools</p>
            <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">Passport Index</h1>
            <p className="mt-1 max-w-xl text-sm text-muted">
              What your passport opens — visa-free entry, visa on arrival, eTA, eVisa, or apply-ahead visas for {total} destinations.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="relative">
                <label htmlFor="pi-passport" className="sr-only">Your passport</label>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={flagSrc(passport)} alt="" width={28} height={20}
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-7 -translate-y-1/2 rounded-sm object-cover" />
                <select id="pi-passport" value={passport}
                  onChange={(e) => { setPassport(e.target.value); setDetail(null) }}
                  className="block h-12 w-64 max-w-full rounded-lg border border-navy/15 bg-white pl-12 pr-3 text-[15px] font-semibold text-navy">
                  {PASSPORT_CODES.map((code) => <option key={code} value={code}>{PASSPORTS[code].n}</option>)}
                </select>
              </div>
              <div className="flex items-stretch gap-6">
                <div>
                  <p className="text-3xl font-black leading-none text-navy">{entry.s}</p>
                  <p className="mt-1 text-xs leading-snug text-muted">destinations<br />visa-free or on arrival</p>
                </div>
                <div className="w-px bg-navy/10" />
                <div>
                  <p className="text-3xl font-black leading-none text-navy">#{entry.r}</p>
                  <p className="mt-1 text-xs leading-snug text-muted">world rank<br />(passport power)</p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {KIND_ORDER.map((k) => (
                <button key={k} type="button" aria-pressed={kind === k}
                  onClick={() => { setTab('destinations'); setKind(kind === k ? 'all' : k) }}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ring-2 transition ${KIND_STYLE[k]} ${kind === k ? 'ring-navy/40' : 'ring-transparent'}`}>
                  {REQUIREMENT_LABEL[k]}{' · '}{counts[k]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-navy/10 [scrollbar-width:none]">
        {(['destinations', 'rankings', 'compare'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold transition ${
              tab === t ? 'border-gold-deep text-navy' : 'border-transparent text-muted hover:text-navy'
            }`}
          >
            {tabLabel(t)}
          </button>
        ))}
      </div>

      {tab === 'destinations' ? (
        <section className="mt-4">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_repeat(3,auto)]">
            <label className="flex h-11 min-w-0 items-center gap-2 rounded-lg border border-navy/15 bg-white px-3">
              <Search size={16} className="shrink-0 text-muted" aria-hidden="true" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations… (e.g. Japan, Chile, Portugal)"
                className="min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-muted/70"
                aria-label="Search destinations" />
            </label>
            <select aria-label="Region" value={region} onChange={(e) => setRegion(e.target.value as PassportRegion | 'all')} className={selectClass}>
              <option value="all">Region</option>
              {PASSPORT_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select aria-label="Entry requirement" value={kind} onChange={(e) => setKind(e.target.value as RequirementKind | 'all')} className={selectClass}>
              <option value="all">Entry requirement</option>
              {KIND_ORDER.map((k) => <option value={k} key={k}>{REQUIREMENT_LABEL[k]}</option>)}
            </select>
            <select aria-label="Maximum stay" value={stay} onChange={(e) => setStay(e.target.value as StayFilter)} className={selectClass}>
              {STAY_OPTIONS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">{destinations.length} destinations</p>
            <label className="flex items-center gap-2 text-sm text-muted">
              Sort by
              <select aria-label="Sort destinations" value={sort} onChange={(e) => setSort(e.target.value as 'az' | 'za' | 'stay')}
                className="h-9 rounded-lg border border-navy/15 bg-white px-3 text-sm font-medium text-navy">
                <option value="az">A – Z</option><option value="za">Z – A</option><option value="stay">Longest stay</option>
              </select>
            </label>
          </div>
          <div className="card-surface mt-3 overflow-hidden">
            <div className={`hidden gap-4 border-b border-navy/8 bg-canvas/60 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted md:grid ${ROW_GRID}`}>
              <span>Destination</span><span>Entry requirement</span><span>Maximum stay</span><span>Notes</span><span />
            </div>
            <div className="divide-y divide-navy/8">
              {destinations.map((d) => {
                const Icon = KIND_ICON[d.req.kind]
                return (
                  <button key={d.code} type="button" onClick={() => setDetail(d.code)}
                    className={`grid w-full grid-cols-[minmax(0,1fr)_auto_20px] items-center gap-4 px-5 py-2.5 text-left transition hover:bg-gold-soft/30 ${ROW_GRID} ${d.code === focus && !query ? 'bg-gold-soft/40' : ''}`}>
                    <span className="flex min-w-0 items-center gap-3">
                      <PassportCover code={d.code} name={d.name} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-navy">{d.name}</span>
                        {d.region && <span className="block text-xs text-muted">{d.region}</span>}
                      </span>
                    </span>
                    <span className={`inline-flex items-center gap-2 justify-self-start rounded-lg px-3 py-1.5 text-xs font-semibold ${KIND_STYLE[d.req.kind]}`}>
                      <Icon size={14} aria-hidden="true" />{REQUIREMENT_LABEL[d.req.kind]}
                    </span>
                    <span className="hidden text-sm text-navy md:block">{d.req.days ? `${d.req.days} days` : '—'}</span>
                    <span className="hidden text-sm text-muted md:block">{KIND_NOTE[d.req.kind]}</span>
                    <ChevronRight size={16} className="text-muted" aria-hidden="true" />
                  </button>
                )
              })}
              {destinations.length === 0 && (
                <p className="px-4 py-10 text-center text-sm text-muted">
                  No destinations match these filters.{' '}
                  <button type="button" onClick={resetFilters} className="font-semibold text-navy underline">Clear filters</button>
                </p>
              )}
            </div>
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
          <div className="grid gap-3 md:grid-cols-3">{compare.map(c => {const p=PASSPORTS[c], n=categoryCounts(p), requirement=compareDestination ? (p.d[compareDestination] ? decodeRequirement(p.d[compareDestination]) : null) : null; return <div key={c} className="card-surface p-5"><div className="flex justify-between"><PassportCover code={c} name={p.n} large/><button onClick={() => setCompare(v => v.filter(x => x !== c))} className="text-xs text-muted">Remove ×</button></div><h3 className="mt-3 text-lg font-bold">{p.n}</h3><p className="text-sm">Mobility {p.s} · Rank #{p.r}</p><div className="mt-3 space-y-2">{KIND_ORDER.map(k => <div key={k} className="flex justify-between gap-3 text-xs"><span>{REQUIREMENT_LABEL[k]}</span><strong>{n[k]}</strong></div>)}</div>{requirement && <p className="mt-4 border-t pt-3 text-sm">{PASSPORTS[compareDestination]?.n}: {requirementSummary(requirement)}</p>}</div>})}</div>
          <div className="card-surface p-4"><label className="mb-2 block text-sm font-semibold" htmlFor="compare-dest">Compare destination entry rules</label><select id="compare-dest" className="w-full rounded-lg border border-navy/15 p-3 text-sm" value={compareDestination} onChange={e => setCompareDestination(e.target.value)}><option value="">Select destination</option>{PASSPORT_CODES.map(c => <option key={c} value={c}>{PASSPORTS[c].n}</option>)}</select></div>
        </section>
      )}

        </div>
        {/* Existing map, now placed in a fixed-width insight rail on large screens. */}
        <aside className="space-y-4 lg:sticky lg:top-6">
          <PassportAccessMap passport={passport} onSelect={setDetail} counts={counts} />
          <section className="card-surface p-5">
            <h2 className="text-base font-bold text-navy">Key insights</h2>
            <ul className="mt-4 space-y-4">
              {[
                { Icon: Compass, tone: 'bg-sky-100 text-sky-900', title: `${entry.s} destinations`, sub: 'visa-free or on arrival' },
                { Icon: Trophy, tone: 'bg-amber-100 text-amber-900', title: `#${entry.r} world rank`, sub: '(passport power)' },
                { Icon: CheckCircle2, tone: 'bg-emerald-100 text-emerald-900', title: `${counts['visa-free']} visa-free destinations`, sub: `The ${entry.n} passport offers visa-free entry to ${counts['visa-free']} destinations.` },
              ].map(({ Icon, tone, title, sub }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className={`grid size-9 shrink-0 place-items-center rounded-full ${tone}`}><Icon size={16} aria-hidden="true" /></span>
                  <span><span className="block text-sm font-semibold text-navy">{title}</span><span className="block text-xs text-muted">{sub}</span></span>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setTab('rankings')}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-navy/15 text-sm font-semibold text-navy transition hover:bg-canvas">
              <BarChart3 size={16} aria-hidden="true" /> See all passport rankings →
            </button>
          </section>
        </aside>
      </div>

      {detail && <div role="presentation" onClick={() => setDetail(null)} className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-deep/60 p-4"><section role="dialog" aria-modal="true" aria-label="Destination entry requirements" onClick={(e) => e.stopPropagation()} className="card-surface w-full max-w-md p-6"><div className="flex items-start gap-4"><PassportCover code={detail} name={PASSPORTS[detail]?.n ?? detail} large/><div className="flex-1"><h2 className="text-xl font-bold">{PASSPORTS[detail]?.n ?? detail}</h2><p className="mt-2 text-sm">Traveling with a {entry.n} passport</p><p className="mt-3 text-sm font-semibold">{entry.d[detail] ? requirementSummary(decodeRequirement(entry.d[detail])) : "Entry information unavailable"}</p>{entry.d[detail] && <p className="mt-1 text-sm text-muted">{KIND_NOTE[decodeRequirement(entry.d[detail]).kind]}</p>}</div><button onClick={() => setDetail(null)} className="rounded-lg border px-3 py-2 text-sm">Close</button></div><p className="mt-4 text-xs text-muted">Verify requirements with the destination immigration authority before travel. This dataset does not include official destination-specific guidance.</p></section></div>}

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
