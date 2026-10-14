'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight, Briefcase, Check, ChevronRight, FlaskConical, Landmark, Lightbulb, Plus, Search, UserRound, Users, X,
  type LucideIcon,
} from 'lucide-react'
import { LESSER_KNOWN_ROUTES, type LesserKnownRoute } from '@/lib/pathway-extras'

// Presentation summaries intentionally omit the unverified speed/income claims in the original records.
const SUMMARIES: Record<string, [string, string]> = {
  'Citizenship by descent': ['Research nationality rules for people with Portuguese ancestry.', 'Ancestry'],
  'D3 Tech Visa': ['Review routes for employment with a Portuguese technology company.', 'Employment'],
  'Job-seeker visa': ['Check the current availability and requirements for seeking work.', 'Work search'],
  'D5 Research permit': ['Confirm the correct permit category with the research institution.', 'Research'],
  'Right of Abode': ['Research Ghana’s Right of Abode provisions and application criteria.', 'Diaspora'],
  'Family unity route': ['Review residence options based on a qualifying family relationship.', 'Family unity'],
  'EU family member route': ['Review family-member rights under applicable free-movement rules.', 'Family mobility'],
  'CPLP agreement': ['Research residence provisions for nationals of CPLP member countries.', 'CPLP nationality'],
}

type RouteType = 'Citizenship' | 'Work' | 'Research' | 'Family' | 'Residency'
const ROUTE_TYPE: Record<string, RouteType> = {
  'Citizenship by descent': 'Citizenship',
  'D3 Tech Visa': 'Work',
  'Job-seeker visa': 'Work',
  'D5 Research permit': 'Research',
  'Right of Abode': 'Residency',
  'Family unity route': 'Family',
  'EU family member route': 'Family',
  'CPLP agreement': 'Residency',
}
const TYPE_STYLE: Record<RouteType, { Icon: LucideIcon; pill: string; disc: string }> = {
  Citizenship: { Icon: UserRound, pill: 'bg-emerald-100 text-emerald-900', disc: 'bg-emerald-50 text-emerald-800' },
  Work: { Icon: Briefcase, pill: 'bg-violet-100 text-violet-900', disc: 'bg-violet-50 text-violet-800' },
  Research: { Icon: FlaskConical, pill: 'bg-amber-100 text-amber-900', disc: 'bg-amber-50 text-amber-800' },
  Family: { Icon: Users, pill: 'bg-sky-100 text-sky-900', disc: 'bg-sky-50 text-sky-800' },
  Residency: { Icon: Landmark, pill: 'bg-gold-soft text-navy', disc: 'bg-gold-soft/60 text-navy' },
}
const TYPES: RouteType[] = ['Citizenship', 'Work', 'Research', 'Family', 'Residency']
const DESTINATIONS = Array.from(new Set(LESSER_KNOWN_ROUTES.map((r) => r.country)))
const MAX_COMPARE = 3
const routeKey = (r: LesserKnownRoute) => `${r.country}-${r.name}`
// None of these leads has an official source yet, so comparison facts stay unverified.
const COMPARE_ROWS = ['Speed', 'Financial requirements', 'Leads to residency / citizenship', 'Official source']

const ROW_GRID = 'lg:grid-cols-[minmax(0,1.6fr)_minmax(0,.8fr)_minmax(0,1fr)_auto_64px]'
const chip = (on: boolean) =>
  `rounded-pill border px-3 py-1.5 text-xs font-semibold transition ${on ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:bg-canvas'}`

export function PathwaysLesserRoutes() {
  const [selected, setSelected] = useState<LesserKnownRoute | null>(null)
  const [query, setQuery] = useState('')
  const [destination, setDestination] = useState<string | null>(null)
  const [type, setType] = useState<RouteType | null>(null)
  const [compare, setCompare] = useState<string[]>([])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LESSER_KNOWN_ROUTES.filter((r) =>
      (!q || `${r.name} ${r.country} ${r.who}`.toLowerCase().includes(q)) &&
      (!destination || r.country === destination) &&
      (!type || ROUTE_TYPE[r.name] === type))
  }, [query, destination, type])

  const compared = compare.map((k) => LESSER_KNOWN_ROUTES.find((r) => routeKey(r) === k)).filter(Boolean) as LesserKnownRoute[]
  const toggleCompare = (r: LesserKnownRoute) => {
    const k = routeKey(r)
    setCompare((v) => v.includes(k) ? v.filter((x) => x !== k) : v.length >= MAX_COMPARE ? v : [...v, k])
  }
  const reset = () => { setQuery(''); setDestination(null); setType(null) }

  return (
    <section id="pw-lesser" className="scroll-mt-4" aria-labelledby="pw-lesser-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="pw-lesser-heading" className="text-base font-bold text-navy">Lesser-known routes most people miss</h2>
          <p className="mt-1 text-[12.5px] leading-5 text-muted">Explore alternative immigration pathways that may offer advantages based on your circumstances.</p>
        </div>
        <a href="#pw-routes" className="inline-flex items-center gap-1 text-xs font-bold text-navy hover:underline">View all routes <ArrowRight size={14} aria-hidden="true" /></a>
      </div>

      <div className="mt-3 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[var(--radius-card)] border border-line bg-white p-3 shadow-tile">
            <label className="flex h-10 min-w-0 flex-1 basis-56 items-center gap-2 rounded-[var(--radius-field)] border border-line px-3">
              <Search size={15} className="shrink-0 text-muted" aria-hidden="true" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search destinations or routes…" aria-label="Search lesser-known routes" className="min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-muted-soft" />
            </label>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Destination">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-soft">Destination</span>
              {DESTINATIONS.map((d) => (
                <button key={d} type="button" aria-pressed={destination === d} onClick={() => setDestination(destination === d ? null : d)} className={chip(destination === d)}>{d}</button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Pathway type">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-soft">Pathway type</span>
              {TYPES.map((t) => (
                <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(type === t ? null : t)} className={chip(type === t)}>{t}</button>
              ))}
            </div>
          </div>

          <div className="mt-3 overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-tile">
            <div className={`hidden gap-4 border-b border-line px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-soft lg:grid ${ROW_GRID}`}>
              <span>Route</span><span>Destination</span><span>Best for</span><span>Type</span><span className="text-right">Compare</span>
            </div>
            <ul className="divide-y divide-line">
              {rows.map((r) => {
                const t = ROUTE_TYPE[r.name] ?? 'Residency'
                const { Icon, pill, disc } = TYPE_STYLE[t]
                const k = routeKey(r)
                const inCompare = compare.includes(k)
                const full = !inCompare && compare.length >= MAX_COMPARE
                return (
                  <li key={k} className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-3.5 ${ROW_GRID}`}>
                    <button type="button" onClick={() => setSelected(r)} className="group col-span-2 flex min-w-0 items-start gap-3 text-left lg:col-span-1" aria-label={`View ${r.country} ${r.name}`}>
                      <span className={`grid size-10 shrink-0 place-items-center rounded-full ${disc}`}><Icon size={18} aria-hidden="true" /></span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1 text-sm font-bold text-navy group-hover:underline">{r.name}<ChevronRight size={14} className="text-muted-soft" aria-hidden="true" /></span>
                        <span className="mt-0.5 block text-xs leading-5 text-muted">{SUMMARIES[r.name]?.[0] ?? 'Review this route with the relevant authority.'}</span>
                      </span>
                    </button>
                    <span className="hidden text-sm font-semibold text-navy lg:block">{r.country}</span>
                    <span className="hidden text-xs leading-5 text-muted lg:block">{r.who}</span>
                    <span className="flex flex-wrap items-center gap-2 pl-[52px] lg:pl-0">
                      <span className={`rounded-pill px-2.5 py-1 text-[11px] font-bold ${pill}`}>{t}</span>
                      <span className="text-[11px] font-semibold text-muted lg:hidden">{r.country}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleCompare(r)}
                      disabled={full}
                      aria-pressed={inCompare}
                      aria-label={inCompare ? `Remove ${r.name} from compare` : `Add ${r.name} to compare`}
                      title={full ? `Compare holds up to ${MAX_COMPARE} routes` : undefined}
                      className={`justify-self-end inline-flex min-h-10 items-center gap-1 rounded-pill border px-2.5 text-[11px] font-bold transition disabled:opacity-40 ${inCompare ? 'border-navy bg-navy text-white' : 'border-line text-navy hover:bg-canvas'}`}
                    >
                      {inCompare ? <Check size={13} aria-hidden="true" /> : <Plus size={13} aria-hidden="true" />}
                      {inCompare ? 'Added' : 'Add'}
                    </button>
                  </li>
                )
              })}
              {rows.length === 0 && (
                <li className="px-4 py-10 text-center text-sm text-muted">
                  No routes match these filters.{' '}
                  <button type="button" onClick={reset} className="font-semibold text-navy underline">Clear filters</button>
                </li>
              )}
            </ul>
          </div>
        </div>

        <aside className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-tile xl:sticky xl:top-4" aria-labelledby="pw-compare-heading">
          <h3 id="pw-compare-heading" className="text-base font-bold text-navy">Compare routes</h3>
          <p className="mt-0.5 text-xs text-muted">Select up to {MAX_COMPARE} routes to see how they stack up.</p>

          {compared.length === 0 ? (
            <p className="mt-4 rounded-[var(--radius-field)] border border-dashed border-line px-4 py-6 text-center text-xs text-muted">Use <strong className="text-navy">Add</strong> on any route to compare it here.</p>
          ) : (
            <>
              <ul className="mt-4 divide-y divide-line rounded-[var(--radius-field)] border border-line">
                {compared.map((r) => {
                  const { Icon, disc } = TYPE_STYLE[ROUTE_TYPE[r.name] ?? 'Residency']
                  return (
                    <li key={routeKey(r)} className="flex items-center gap-3 px-3 py-2.5">
                      <span className={`grid size-9 shrink-0 place-items-center rounded-full ${disc}`}><Icon size={16} aria-hidden="true" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-navy">{r.name}</span>
                        <span className="block text-xs text-muted">{r.country}</span>
                      </span>
                      <button type="button" onClick={() => toggleCompare(r)} aria-label={`Remove ${r.name}`} className="grid size-10 place-items-center rounded-pill text-muted hover:bg-canvas"><X size={15} aria-hidden="true" /></button>
                    </li>
                  )
                })}
              </ul>
              <dl className="mt-4 divide-y divide-line text-xs">
                {[['Destination', (r: LesserKnownRoute) => r.country], ['Type', (r: LesserKnownRoute) => ROUTE_TYPE[r.name] ?? 'Residency'], ['Best for', (r: LesserKnownRoute) => r.who]].map(([label, get]) => (
                  <div key={label as string} className="py-2.5">
                    <dt className="font-semibold text-navy">{label as string}</dt>
                    <dd className="mt-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${compared.length}, minmax(0, 1fr))` }}>
                      {compared.map((r) => <span key={routeKey(r)} className="text-muted">{(get as (r: LesserKnownRoute) => string)(r)}</span>)}
                    </dd>
                  </div>
                ))}
                {COMPARE_ROWS.map((label) => (
                  <div key={label} className="py-2.5">
                    <dt className="font-semibold text-navy">{label}</dt>
                    <dd className="mt-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${compared.length}, minmax(0, 1fr))` }}>
                      {compared.map((r) => <span key={routeKey(r)} className="text-muted-soft">Not verified</span>)}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          <div className="mt-4 flex gap-3 rounded-[var(--radius-field)] bg-emerald-50 p-4">
            <Lightbulb size={18} className="mt-0.5 shrink-0 text-emerald-800" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold text-emerald-900">Keep in mind</p>
              <p className="mt-1 text-xs leading-5 text-emerald-900/80">Each route has specific eligibility requirements, documentation and timelines. Always check the official government source for the most up-to-date information.</p>
            </div>
          </div>
        </aside>
      </div>

      <p className="mt-3 text-[11px] leading-5 text-muted-soft">Verification pending. These existing research leads do not yet carry official sources or verification dates. Availability, route names and requirements must be confirmed.</p>
      {selected && <ResearchLeadDialog route={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

function ResearchLeadDialog({ route, onClose }: { route: LesserKnownRoute; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const element = dialog.current
    element?.showModal()
    return () => { element?.close(); previous?.focus() }
  }, [])
  return (
    <dialog ref={dialog} aria-labelledby="pw-research-title" onCancel={onClose} className="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-[var(--radius-card)] border border-line bg-white p-6 text-navy shadow-drawer backdrop:bg-navy-deep/50">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-xs font-semibold text-muted">{route.country}</p><h2 id="pw-research-title" className="mt-1 text-lg font-bold">{route.name}</h2></div>
        <button type="button" onClick={onClose} aria-label="Close route research" className="grid size-10 shrink-0 place-items-center rounded-pill hover:bg-canvas"><X size={18} aria-hidden="true" /></button>
      </div>
      <p className="mt-4 rounded-[var(--radius-field)] bg-warn-soft p-3 text-sm">Verification pending. This research lead has no verified detail record yet.</p>
      <p className="mt-3 text-sm text-muted">{route.who}. {SUMMARIES[route.name]?.[0]}</p>
      <dl className="mt-4 divide-y divide-line text-xs">
        {['Eligibility', 'Financial requirements', 'Processing timeline', 'Documentation', 'Work authorization', 'Residency rights', 'Citizenship pathway', 'Official source', 'Last verification date'].map((label) => <div key={label} className="flex justify-between gap-4 py-2.5"><dt>{label}</dt><dd className="text-muted">Not verified</dd></div>)}
      </dl>
      <button type="button" onClick={onClose} className="mt-4 rounded-[var(--radius-btn)] bg-navy px-4 py-2 text-sm font-semibold text-white">Back to pathways</button>
    </dialog>
  )
}
