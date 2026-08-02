'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Check, ChevronDown, ExternalLink, Info, CheckCircle2, Minus, Plus } from 'lucide-react'
import type { RelocationProfile } from '@/lib/profile'
import { evaluatePathways, RESEARCH_DISCLAIMER, type PathwayEvaluation, type PathwayMatchStatus } from '@/lib/pathways'
import { INCOME_TYPES, LESSER_KNOWN_ROUTES, VISA_JOURNEYS } from '@/lib/pathway-extras'

// ─── Status presentation ────────────────────────────────────────────────
//
// Kolmari does not assert visa eligibility, so a route is described as a fit
// signal — never as "qualified".

const FIT_LABELS: Record<PathwayMatchStatus, string> = {
  'Strong Match': 'Likely fit',
  'Possible Match': 'Different route likely',
  'Missing Requirements': 'Gap identified',
}
const FIT_TONES: Record<PathwayMatchStatus, string> = {
  'Strong Match': 'bg-ok-soft text-ok',
  'Possible Match': 'bg-canvas text-muted',
  'Missing Requirements': 'bg-[#fdeaee] text-[#b3243c]',
}
const SECTIONS = [
  { id: 'journey', label: 'Journey' },
  { id: 'signals', label: 'Signals' },
  { id: 'match', label: 'Match' },
  { id: 'routes', label: 'All routes' },
  { id: 'lesser', label: 'Lesser-known' },
] as const

function fitOrder(status: PathwayMatchStatus) {
  return status === 'Strong Match' ? 0 : status === 'Possible Match' ? 1 : 2
}

function FitBadge({ status }: { status: PathwayMatchStatus }) {
  return <span className={`shrink-0 rounded-pill px-2.5 py-1 text-[11px] font-bold ${FIT_TONES[status]}`}>{FIT_LABELS[status]}</span>
}

// ─── Page ───────────────────────────────────────────────────────────────

export function PathwaysResults({ profile, savedDestination, selectedPathway, documentsReady, documentsTotal }: {
  profile: RelocationProfile
  savedDestination: string | null
  selectedPathway: string | null
  documentsReady: number
  documentsTotal: number
}) {
  const complete = profile.wizard_status === 'completed'

  // Exploratory overrides — never written back to the saved Kolmari Profile.
  const [income, setIncome] = useState<number | null>(profile.monthly_income)
  const [savings, setSavings] = useState<number | null>(profile.savings)
  const [adults, setAdults] = useState(Math.max(1, (profile.family_size ?? 1) - (profile.dependents ?? 0)))
  const [children, setChildren] = useState(profile.dependents ?? 0)
  const [incomeType, setIncomeType] = useState<string | null>(profile.income_type)
  const [activeSection, setActiveSection] = useState<string>('journey')
  const [category, setCategory] = useState('All')

  const touched =
    income !== profile.monthly_income || savings !== profile.savings ||
    children !== (profile.dependents ?? 0) || incomeType !== profile.income_type

  function reset() {
    setIncome(profile.monthly_income); setSavings(profile.savings)
    setAdults(Math.max(1, (profile.family_size ?? 1) - (profile.dependents ?? 0)))
    setChildren(profile.dependents ?? 0); setIncomeType(profile.income_type)
  }

  // Before the wizard is complete nothing is assumed — every route reports a gap.
  const evaluated = useMemo<PathwayEvaluation[]>(() => {
    if (!complete) {
      return evaluatePathways({ ...profile, goals: [], monthly_income: null, savings: null, remote: null, dependents: null })
        .map((p) => ({ ...p, status: 'Missing Requirements' as const, requirementsMet: [], missingRequirements: [] }))
    }
    return evaluatePathways({ ...profile, monthly_income: income, savings, dependents: children, income_type: incomeType })
  }, [complete, profile, income, savings, children, incomeType])

  const strongest = useMemo(
    () => [...evaluated].sort((a, b) => fitOrder(a.status) - fitOrder(b.status)).slice(0, 3),
    [evaluated],
  )
  const categories = ['All', ...Array.from(new Set(evaluated.map((p) => p.category)))]
  const routes = useMemo(() => {
    const list = category === 'All' ? evaluated : evaluated.filter((p) => p.category === category)
    return [...list].sort((a, b) => fitOrder(a.status) - fitOrder(b.status))
  }, [evaluated, category])

  const journey = savedDestination ? VISA_JOURNEYS[savedDestination] ?? null : null
  const currentStep = journey ? journey.findIndex((s) => s.state === 'current') + 1 : 0

  return (
    <div className="space-y-4">
      {/* 1 — Header */}
      <header className="overflow-hidden rounded-[var(--radius-card)] bg-navy-deep p-7 text-white sm:p-10">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold">Kolmari Pathways</p>
        <h1 className="mt-3 max-w-[18ch] text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-[40px]">
          Research the routes that fit your facts.
        </h1>
        <p className="mt-3 max-w-[62ch] text-sm leading-6 text-white/70">
          Your Kolmari Profile supplies the inputs. This page organizes official Pathway research. It does not
          determine your eligibility or guarantee any outcome.
        </p>
      </header>

      {/* 2 — Section tabs */}
      <nav className="k-tabbar" aria-label="Pathways sections">
        <div className="k-tabs">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#pw-${section.id}`}
              className={`k-tab${activeSection === section.id ? ' is-active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      {/* 3 — Visa journey tracker */}
      <section id="pw-journey" className="scroll-mt-4 rounded-[var(--radius-card)] border border-line bg-white px-5 pb-5 pt-[18px] shadow-tile" aria-labelledby="pw-journey-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <div>
            <h2 id="pw-journey-heading" className="text-[16px] font-bold tracking-[-0.01em] text-navy">
              Your visa journey{savedDestination ? ` · ${savedDestination}` : ''}{selectedPathway ? ` · ${selectedPathway}` : ''}
            </h2>
            <p className="mt-0.5 text-[12.5px] text-muted">Walks the route you have selected, step by step.</p>
          </div>
          {journey && <span className="text-[11.5px] text-muted-soft">Step {currentStep} of {journey.length}</span>}
        </div>

        {journey ? (
          <ol className="mt-4 flex items-start">
            {journey.map((step, i) => {
              const meta = step.label === 'Gather documents' && documentsTotal > 0
                ? `${documentsReady} of ${documentsTotal}`
                : step.meta
              return (
                <li key={step.label} className="relative flex min-w-0 flex-1 flex-col items-center gap-2">
                  {i > 0 && (
                    <span
                      className="absolute left-[-50%] right-1/2 top-[15px] h-0.5"
                      style={{ background: step.state === 'todo' ? 'var(--color-line)' : 'var(--color-teal)' }}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className="relative z-10 grid size-[30px] flex-none place-items-center rounded-pill text-xs font-bold"
                    style={
                      step.state === 'done' ? { background: 'var(--color-teal)', color: '#fff' }
                        : step.state === 'current' ? { background: 'var(--color-gold)', color: 'var(--color-navy-deep)', boxShadow: '0 0 0 4px rgba(243,197,22,.22)' }
                          : { background: 'var(--color-line)', color: 'var(--color-muted-soft)' }
                    }
                    aria-current={step.state === 'current' ? 'step' : undefined}
                  >
                    {step.state === 'done' ? <Check size={15} strokeWidth={3} aria-hidden="true" /> : i + 1}
                  </span>
                  <span className="min-h-8 px-1.5 text-center text-[11.5px] font-bold leading-[1.35] text-navy">{step.label}</span>
                  <span className="px-1.5 text-center text-[10.5px] leading-[1.4] text-muted-soft">{meta}</span>
                </li>
              )
            })}
          </ol>
        ) : (
          <p className="mt-4 rounded-[var(--radius-field)] bg-canvas p-4 text-[12.5px] leading-6 text-muted">
            {savedDestination
              ? `No step-by-step sequence has been researched for ${savedDestination} yet.`
              : 'Choose a destination and pathway on your plan to see the route walked step by step.'}{' '}
            <Link href="/my-plan" className="font-bold text-gold-deep">Open My Plan</Link>
          </p>
        )}
      </section>

      {/* 4 — Strongest signals */}
      <section id="pw-signals" className="scroll-mt-4" aria-labelledby="pw-signals-heading">
        <h2 id="pw-signals-heading" className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold-deep">
          Your strongest signals
        </h2>
        <p className="mt-1 text-[12.5px] text-muted">Based on your Kolmari Profile. Official requirements still control eligibility.</p>
        <div className="mt-3 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
          {strongest.map((pathway) => (
            <article key={pathway.id} className="rounded-[var(--radius-card)] border border-line bg-white px-[17px] pb-4 pt-[15px] shadow-tile">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-muted-soft">{pathway.category}</p>
                <FitBadge status={pathway.status} />
              </div>
              <h3 className="mt-2 text-[16.5px] font-bold tracking-[-0.01em] text-navy">{pathway.name}</h3>
              <p className="text-[12.5px] text-muted-soft">{pathway.country}</p>
              <p className="mt-2 text-[12.8px] leading-[1.6] text-muted">{pathway.incomeThreshold}</p>
              <ul className="mt-3 space-y-1.5 border-t border-[#f0f3f7] pt-3">
                {pathway.requirementsMet.slice(0, 2).map((item) => (
                  <li key={item} className="flex gap-2 text-[12px] leading-5 text-ok">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0" aria-hidden="true" /><span>{item}</span>
                  </li>
                ))}
                {pathway.requirementsMet.length === 0 && (
                  <li className="text-[12px] text-muted-soft">No profile signals confirmed for this route yet.</li>
                )}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* 5 — Match calculator */}
      <section id="pw-match" className="scroll-mt-4 rounded-[var(--radius-card)] border border-line bg-white px-5 pb-5 pt-[18px] shadow-tile" aria-labelledby="pw-match-heading">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="pw-match-heading" className="text-[16px] font-bold tracking-[-0.01em] text-navy">Match your facts to the routes</h2>
            <p className="mt-0.5 text-[12.5px] text-muted">Adjust the inputs and the fit labels below update. Nothing here is saved or submitted.</p>
          </div>
          {touched && (
            <button type="button" onClick={reset} className="text-[12.5px] font-bold text-info hover:text-navy">Reset</button>
          )}
        </div>

        <div className="mt-5 grid items-end gap-x-6 gap-y-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          <div>
            <label htmlFor="pw-income" className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted-soft">Monthly income</label>
            <p className="mt-1 text-[22px] font-extrabold leading-none text-navy">
              {income === null ? 'Not set' : `$${income >= 1000 ? `${(income / 1000).toFixed(1)}k` : income}`}
              <span className="ml-1.5 text-[11px] font-semibold text-muted-soft">per month</span>
            </p>
            <input
              id="pw-income" type="range" min={0} max={15000} step={100}
              value={income ?? 0}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--color-gold)]"
            />
          </div>

          <div>
            <label htmlFor="pw-savings" className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted-soft">Savings available</label>
            <p className="mt-1 text-[22px] font-extrabold leading-none text-navy">
              {savings === null ? 'Not set' : `$${(savings / 1000).toFixed(0)}k`}
            </p>
            <input
              id="pw-savings" type="range" min={0} max={200000} step={5000}
              value={savings ?? 0}
              onChange={(e) => setSavings(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--color-gold)]"
            />
          </div>

          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted-soft">People moving</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Stepper label="Adults" value={adults} min={1} onChange={setAdults} />
              <Stepper label="Children" value={children} min={0} onChange={setChildren} />
            </div>
          </div>

          <div>
            <label htmlFor="pw-earn" className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted-soft">How you earn</label>
            <select
              id="pw-earn"
              value={incomeType ?? ''}
              onChange={(e) => setIncomeType(e.target.value === '' ? null : e.target.value)}
              className="field mt-2"
            >
              <option value="">Not set</option>
              {INCOME_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        {touched && (
          <p className="mt-4 text-[11px] font-semibold text-warn">
            Showing exploratory figures — these are not saved to your Kolmari Profile.
          </p>
        )}
      </section>

      {/* 6 — All routes */}
      <section id="pw-routes" className="scroll-mt-4" aria-labelledby="pw-routes-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="pw-routes-heading" className="text-[17px] font-bold tracking-[-0.01em] text-navy">Explore all Pathways</h2>
          <span className="text-[11.5px] text-muted-soft">{evaluated.length} researched routes</span>
        </div>

        <div className="-mx-1 mt-3 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
          <div className="flex w-max min-w-full gap-2">
            {categories.map((item) => {
              const active = category === item
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(item)}
                  className={[
                    'shrink-0 rounded-pill border px-3.5 py-2 text-xs font-bold transition-colors',
                    active ? 'border-navy bg-navy text-white' : 'border-line bg-white text-muted hover:border-navy/30 hover:text-navy',
                  ].join(' ')}
                >
                  {item}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-3 grid gap-3.5 [grid-template-columns:repeat(auto-fill,minmax(330px,1fr))]">
          {routes.map((pathway, i) => (
            <RouteCard key={pathway.id} pathway={pathway} best={i === 0 && pathway.status === 'Strong Match'} />
          ))}
        </div>
        {routes.length === 0 && (
          <div className="card-surface mt-3 p-8 text-sm text-muted">No Pathways found for this category.</div>
        )}
      </section>

      {/* 7 — Lesser-known routes */}
      <section id="pw-lesser" className="scroll-mt-4" aria-labelledby="pw-lesser-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="pw-lesser-heading" className="text-[17px] font-bold tracking-[-0.01em] text-navy">Lesser-known routes most people miss</h2>
          <span className="text-[11.5px] text-muted-soft">Often faster or cheaper than the headline visa</span>
        </div>
        <div className="mt-3 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
          {LESSER_KNOWN_ROUTES.map((route) => (
            <article key={`${route.country}-${route.name}`} className="rounded-[var(--radius-card)] border border-line bg-white px-[17px] pb-4 pt-[15px] shadow-tile">
              <div className="flex items-start gap-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-muted-soft">{route.country}</p>
                  <h3 className="mt-0.5 text-[15px] font-bold tracking-[-0.01em] text-navy">{route.name}</h3>
                </div>
                <span className={`shrink-0 whitespace-nowrap rounded-pill px-2 py-[3px] text-[9.5px] font-bold ${route.tone === 'good' ? 'bg-teal-soft text-teal-deep' : 'bg-canvas text-muted'}`}>
                  {route.tag}
                </span>
              </div>
              <p className="mt-2 text-[12.3px] leading-[1.6] text-muted">{route.body}</p>
              <p className="mt-2.5 border-t border-[#f0f3f7] pt-2.5 text-[11px] text-muted-soft">{route.who}</p>
            </article>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-5 text-muted-soft">
          These are orientation only — they do not yet carry an official source or verification date. Confirm each
          with the relevant government authority before acting on it.
        </p>
      </section>

      <section className="rounded-[var(--radius-card)] border border-line bg-canvas p-6 text-sm text-muted" aria-label="Sources and research notes">
        <h2 className="font-bold text-navy">Sources and research notes</h2>
        <p className="mt-2 leading-6">{RESEARCH_DISCLAIMER}</p>
        <p className="mt-3 leading-6">
          Income and savings figures shown are approximate planning guides in USD equivalent — not official government
          thresholds. Confirm every requirement directly with the linked government authority.
        </p>
      </section>
    </div>
  )
}

function Stepper({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2 rounded-[var(--radius-field)] border border-line bg-white px-2.5 py-1.5">
      <span className="text-[12px] font-semibold text-muted">{label}</span>
      <button
        type="button" aria-label={`Decrease ${label}`}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="grid size-6 place-items-center rounded-[6px] border border-line text-muted hover:bg-canvas"
      >
        <Minus size={12} aria-hidden="true" />
      </button>
      <span className="min-w-4 text-center text-[13px] font-bold text-navy">{value}</span>
      <button
        type="button" aria-label={`Increase ${label}`}
        onClick={() => onChange(Math.min(20, value + 1))}
        className="grid size-6 place-items-center rounded-[6px] border border-line text-muted hover:bg-canvas"
      >
        <Plus size={12} aria-hidden="true" />
      </button>
    </div>
  )
}

function RouteCard({ pathway, best }: { pathway: PathwayEvaluation; best: boolean }) {
  const [open, setOpen] = useState(false)
  const facts: [string, string][] = [
    ['Income needed', pathway.incomeThreshold],
    ['Processing', pathway.estimatedProcessingTime],
    ['Dependents', pathway.dependentsAllowed],
    ['Estimated fees', pathway.estimatedFees],
  ].filter((fact): fact is [string, string] => Boolean(fact[1]))

  return (
    <article
      className="flex flex-col rounded-[var(--radius-card)] bg-white px-[18px] pb-[18px] pt-4 shadow-tile"
      style={{ border: `1px solid ${best ? 'var(--color-gold)' : 'var(--color-line)'}` }}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-muted-soft">{pathway.country}</p>
          <h3 className="mt-0.5 text-[16.5px] font-bold tracking-[-0.01em] text-navy">{pathway.name}</h3>
        </div>
        {best && <span className="shrink-0 rounded-pill bg-gold-soft px-2.5 py-[3px] text-[10px] font-bold text-[#7a5c05]">Best match</span>}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <FitBadge status={pathway.status} />
        <span className="text-[10px] font-bold uppercase tracking-[0.11em] text-muted-soft">{pathway.category}</span>
      </div>

      <p className="mt-2.5 text-[12.8px] leading-[1.6] text-muted">
        {pathway.requirementsMet.length} signal{pathway.requirementsMet.length === 1 ? '' : 's'} met,{' '}
        {pathway.missingRequirements.length} to confirm from your Kolmari Profile.
      </p>

      <dl className="mt-3 grid grid-cols-2 gap-2.5 border-t border-[#f0f3f7] pt-3">
        {facts.slice(0, 4).map(([label, value]) => (
          <div key={label}>
            <dt className="text-[9.5px] uppercase tracking-[0.08em] text-muted-soft">{label}</dt>
            <dd className="mt-0.5 line-clamp-2 text-[12.5px] font-bold text-navy">{value}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-3 flex items-center gap-1.5 text-[11.5px] font-bold text-gold-deep"
      >
        {open ? 'Hide requirements' : 'View requirements'}
        <ChevronDown size={13} aria-hidden="true" className={`transition-transform duration-[var(--duration-standard)] ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-3 border-t border-[#f0f3f7] pt-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wide text-teal-deep">Requirements met</h4>
          {pathway.requirementsMet.length ? (
            <ul className="mt-2 space-y-1.5">
              {pathway.requirementsMet.map((item) => (
                <li key={item} className="flex gap-2 text-[12px] leading-5 text-navy">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-teal-deep" aria-hidden="true" /><span>{item}</span>
                </li>
              ))}
            </ul>
          ) : <p className="mt-2 text-[12px] text-muted">No profile requirements confirmed yet.</p>}

          <h4 className="mt-3 text-[10px] font-bold uppercase tracking-wide text-warn">Missing or unconfirmed</h4>
          {pathway.missingRequirements.length ? (
            <ul className="mt-2 space-y-1.5">
              {pathway.missingRequirements.map((item) => (
                <li key={item} className="flex gap-2 text-[12px] leading-5 text-navy">
                  <Info size={14} className="mt-0.5 shrink-0 text-warn" aria-hidden="true" /><span>{item}</span>
                </li>
              ))}
            </ul>
          ) : <p className="mt-2 text-[12px] text-muted">No profile gaps identified.</p>}

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {pathway.officialSource && (
              <a
                href={pathway.officialSource} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-gold-deep underline-offset-4 hover:underline"
              >
                <ExternalLink size={13} aria-hidden="true" />
                {pathway.sourceLabel ?? 'Official source'}
              </a>
            )}
            <span className="text-[10.5px] text-muted-soft">Verified {pathway.lastVerified}</span>
          </div>
        </div>
      )}
    </article>
  )
}
