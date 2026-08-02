'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, ChevronDown, ExternalLink, Info, Route } from 'lucide-react'
import type { RelocationProfile } from '@/lib/profile'
import { evaluatePathways, RESEARCH_DISCLAIMER, type PathwayEvaluation, type PathwayMatchStatus } from '@/lib/pathways'

// ─── Status presentation ────────────────────────────────────────────────
//
// Labels stay on the app's researched-signal language. Kolmari does not
// assert visa eligibility, so a route is never described as "qualified".

const STATUS_LABELS: Record<PathwayMatchStatus, string> = {
  'Strong Match': 'Strong Match',
  'Possible Match': 'Possible Match',
  'Missing Requirements': 'More information needed',
}
const STATUS_TONES: Record<PathwayMatchStatus, string> = {
  'Strong Match': 'bg-teal-soft text-teal-deep',
  'Possible Match': 'bg-gold-soft text-warn',
  'Missing Requirements': 'bg-canvas text-muted',
}
const STATUS_RING: Record<PathwayMatchStatus, string> = {
  'Strong Match': 'var(--color-teal)',
  'Possible Match': 'var(--color-gold)',
  'Missing Requirements': 'var(--color-line-strong)',
}
const GROUPS: Array<{ status: PathwayMatchStatus; description: string }> = [
  { status: 'Strong Match', description: 'Your profile shows the strongest alignment with these routes. Official requirements still apply.' },
  { status: 'Possible Match', description: 'Your profile has relevant signals, with important details still to verify.' },
  { status: 'Missing Requirements', description: 'More profile information or official research is needed before comparing these routes.' },
]

const COUNTRY_CODES: Record<string, string> = {
  Canada: 'CA', Germany: 'DE', Ireland: 'IE', 'New Zealand': 'NZ', Portugal: 'PT', Spain: 'ES',
}
function countryCode(country: string) {
  return COUNTRY_CODES[country] ?? country.slice(0, 2).toUpperCase()
}

/**
 * Share of this route's checked signals that the profile currently satisfies.
 * This is a count of researched requirement signals — not an eligibility score
 * and not a probability of approval.
 */
function metShare(pathway: PathwayEvaluation): number {
  const total = pathway.requirementsMet.length + pathway.missingRequirements.length
  return total === 0 ? 0 : Math.round((pathway.requirementsMet.length / total) * 100)
}

function StatusBadge({ status }: { status: PathwayMatchStatus }) {
  return <span className={`shrink-0 rounded-pill px-2.5 py-1 text-[11px] font-bold ${STATUS_TONES[status]}`}>{STATUS_LABELS[status]}</span>
}

function CountryLabel({ country }: { country: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold text-muted">
      <span className="rounded-[var(--radius-field)] border border-line bg-canvas px-2 py-1 font-bold text-navy">{countryCode(country)}</span>
      {country}
    </span>
  )
}

/** Ring showing the share of checked signals met. Labelled, never presented as a probability. */
function MatchRing({ value, status, size = 52 }: { value: number; status: PathwayMatchStatus; size?: number }) {
  const stroke = size >= 80 ? 9 : 6
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${value}% of checked signals met`} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e6eaf1" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={STATUS_RING[status]} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${(circumference * value) / 100} ${circumference}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
        fontSize={size >= 80 ? 22 : 14} fontWeight={800} fill="var(--color-navy)"
      >
        {value}%
      </text>
    </svg>
  )
}

// ─── Explorer controls ──────────────────────────────────────────────────

function Segmented<T extends string | number | boolean | null>({ label, value, options, onChange }: {
  label: string
  value: T
  options: { label: string; value: T }[]
  onChange: (value: T) => void
}) {
  return (
    <div>
      <p className="text-xs font-bold text-navy">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value
          return (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={[
                'min-h-9 rounded-[10px] border px-3 text-xs font-semibold transition-colors',
                active ? 'border-navy bg-navy text-white' : 'border-line-strong bg-white text-muted hover:border-navy/30 hover:text-navy',
              ].join(' ')}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const SAVINGS_MAX = 60_000

// ─── Page ───────────────────────────────────────────────────────────────

export function PathwaysResults({ profile }: { profile: RelocationProfile }) {
  const complete = profile.wizard_status === 'completed'

  // Exploratory overrides. These never write to the saved Kolmari Profile —
  // they let someone see how a different figure would change their signals.
  const [income, setIncome] = useState<number | null>(profile.monthly_income)
  const [savings, setSavings] = useState<number | null>(profile.savings)
  const [remote, setRemote] = useState<boolean | null>(profile.remote)
  const [dependents, setDependents] = useState<number>(profile.dependents ?? 0)
  const [activeCategory, setActiveCategory] = useState('All')

  const touched =
    income !== profile.monthly_income ||
    savings !== profile.savings ||
    remote !== profile.remote ||
    dependents !== (profile.dependents ?? 0)

  // Until the wizard is complete nothing is assumed: every route reports that
  // more information is needed rather than showing an invented signal.
  const evaluated = useMemo<PathwayEvaluation[]>(() => {
    if (!complete) {
      return evaluatePathways({ ...profile, goals: [], monthly_income: null, savings: null, remote: null, dependents: null })
        .map((pathway) => ({ ...pathway, status: 'Missing Requirements' as const, requirementsMet: [], missingRequirements: [] }))
    }
    return evaluatePathways({ ...profile, monthly_income: income, savings, remote, dependents })
  }, [complete, profile, income, savings, remote, dependents])

  const counts = useMemo(() => ({
    'Strong Match': evaluated.filter((p) => p.status === 'Strong Match').length,
    'Possible Match': evaluated.filter((p) => p.status === 'Possible Match').length,
    'Missing Requirements': evaluated.filter((p) => p.status === 'Missing Requirements').length,
  }), [evaluated])

  // Strongest status first, then the share of signals met — so a route that
  // still needs information never outranks a Strong Match on percentage alone.
  const live = useMemo(() => {
    const rank: Record<PathwayMatchStatus, number> = { 'Strong Match': 0, 'Possible Match': 1, 'Missing Requirements': 2 }
    return [...evaluated]
      .sort((a, b) => rank[a.status] - rank[b.status] || metShare(b) - metShare(a))
      .slice(0, 3)
  }, [evaluated])

  const categories = ['All', ...Array.from(new Set(evaluated.map((p) => p.category)))]
  const filtered = activeCategory === 'All' ? evaluated : evaluated.filter((p) => p.category === activeCategory)
  const firstStrongId = filtered.find((p) => p.status === 'Strong Match')?.id
  const categoryCount = (category: string) =>
    category === 'All' ? evaluated.length : evaluated.filter((p) => p.category === category).length

  return (
    <div>
      <header className="rounded-[20px] bg-navy-deep p-7 text-white sm:p-10">
        <div className="flex items-center gap-3">
          <Route size={22} className="text-gold" aria-hidden="true" />
          <p className="text-sm font-bold text-gold">Kolmari Pathways</p>
        </div>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Research the routes that fit your facts.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
          Your Kolmari Profile supplies the inputs. This page organizes official Pathway research. It does not
          determine your eligibility or guarantee any outcome.
        </p>
        {!complete && (
          <div className="mt-6 rounded-[var(--radius-card)] border border-gold/30 bg-white/8 p-5">
            <p className="font-semibold">Complete your Profile to see personalized Pathway signals.</p>
            <p className="mt-1 text-sm text-white/70">Until then, all Pathways show as needing more information — no match is assumed.</p>
            <Link href="/profile-wizard" className="gold-button mt-4 inline-flex items-center gap-2">
              Start Profile Wizard <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </header>

      {/* Sticky summary of where the routes currently stand. */}
      <div className="sticky top-0 z-20 -mx-1 mt-6 bg-canvas/95 px-1 py-2 backdrop-blur">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[var(--radius-card)] border border-line bg-white px-4 py-3 shadow-tile">
          {GROUPS.map((group) => (
            <span key={group.status} className="flex items-center gap-2 text-xs font-semibold text-muted">
              <span className="size-2 rounded-pill" style={{ background: STATUS_RING[group.status] }} aria-hidden="true" />
              {STATUS_LABELS[group.status]}
              <span className="font-bold text-navy">{counts[group.status]}</span>
            </span>
          ))}
          <span className="ml-auto text-[11px] text-muted-soft">{evaluated.length} researched routes</span>
        </div>
      </div>

      {complete && (
        <section className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" aria-labelledby="explore-heading">
          <div className="card-surface p-6 sm:p-7">
            <h2 id="explore-heading" className="text-[19px] font-bold text-navy">Tell us about your situation</h2>
            <p className="mt-1 text-[12.5px] text-muted">
              Adjust these to see how your signals change. Nothing here changes your saved Kolmari Profile.
            </p>

            <div className="mt-5 space-y-5">
              <div>
                <label htmlFor="pw-income" className="text-xs font-bold text-navy">Monthly income</label>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-bold text-muted">$</span>
                  <input
                    id="pw-income"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={income ?? ''}
                    placeholder="Not set"
                    onChange={(e) => setIncome(e.target.value === '' ? null : Math.max(0, Number(e.target.value)))}
                    className="field"
                  />
                </div>
              </div>

              <Segmented
                label="Remote work"
                value={remote}
                onChange={setRemote}
                options={[
                  { label: 'Yes, fully remote', value: true },
                  { label: 'No', value: false },
                  { label: 'Not set', value: null },
                ]}
              />

              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <label htmlFor="pw-savings" className="text-xs font-bold text-navy">Savings available for relocation</label>
                  <span className="rounded-pill bg-gold-soft px-2.5 py-0.5 text-[11px] font-bold text-warn">
                    {savings === null ? 'Not set' : `$${savings.toLocaleString()}${savings >= SAVINGS_MAX ? '+' : ''}`}
                  </span>
                </div>
                <input
                  id="pw-savings"
                  type="range"
                  min={0}
                  max={SAVINGS_MAX}
                  step={1000}
                  value={savings ?? 0}
                  onChange={(e) => setSavings(Number(e.target.value))}
                  className="mt-3 w-full accent-[var(--color-gold)]"
                />
                <div className="mt-1 flex justify-between text-[10.5px] text-muted-soft">
                  <span>$0</span><span>${(SAVINGS_MAX / 1000).toFixed(0)}k+</span>
                </div>
              </div>

              <Segmented
                label="Household size"
                value={dependents}
                onChange={setDependents}
                options={[
                  { label: 'Just me', value: 0 },
                  { label: '2', value: 1 },
                  { label: '3', value: 2 },
                  { label: '4+', value: 3 },
                ]}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/profile-wizard" className="gold-button">Update my Profile</Link>
              {touched && (
                <button
                  type="button"
                  onClick={() => {
                    setIncome(profile.monthly_income); setSavings(profile.savings)
                    setRemote(profile.remote); setDependents(profile.dependents ?? 0)
                  }}
                  className="inline-flex min-h-11 items-center rounded-[var(--radius-btn)] border border-line px-4 text-xs font-bold text-navy hover:bg-canvas"
                >
                  Reset to my Profile
                </button>
              )}
            </div>
            {touched && (
              <p className="mt-3 text-[11px] font-semibold text-warn">
                Showing exploratory figures — these are not saved to your Profile.
              </p>
            )}
          </div>

          <div className="rounded-[var(--radius-card)] border border-white/10 bg-navy-deep p-6 text-white shadow-shell">
            <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-gold">Live Pathway Match</p>
            <div className="mt-4 space-y-3">
              {live.map((pathway, index) => {
                const share = metShare(pathway)
                return (
                  <article
                    key={pathway.id}
                    className="rounded-[var(--radius-field)] border p-4"
                    style={{
                      background: 'var(--color-navy-card)',
                      borderColor: index === 0 ? 'rgba(243,197,22,.35)' : 'rgba(255,255,255,.1)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 text-[15px] font-bold leading-5 text-white">{pathway.name}</p>
                      <span className={`shrink-0 text-lg font-extrabold ${pathway.status === 'Strong Match' ? 'text-gold' : 'text-white/60'}`}>
                        {share}%
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-white/60">{pathway.country} · {pathway.category}</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-pill bg-white/12">
                      <div
                        className="h-full rounded-pill"
                        style={{ width: `${share}%`, background: pathway.status === 'Strong Match' ? 'var(--color-gold)' : 'var(--color-info)' }}
                      />
                    </div>
                    <div className="mt-3">
                      <StatusBadge status={pathway.status} />
                    </div>
                  </article>
                )
              })}
            </div>
            <p className="mt-4 text-[10.5px] leading-5 text-white/55">
              Percentages show how many of the researched signals for each route your profile currently meets.
              They are not an eligibility decision — final eligibility is confirmed with official sources.
            </p>
          </div>
        </section>
      )}

      <section className="mt-8" aria-label="Filter Pathways by category">
        <div className="-mx-1 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
          <div className="flex w-max min-w-full gap-2">
            {categories.map((category) => {
              const active = activeCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveCategory(category)}
                  className={[
                    'shrink-0 rounded-pill border px-3.5 py-2 text-xs font-bold transition-colors',
                    active ? 'border-navy bg-navy text-white' : 'border-line bg-white text-muted hover:border-navy/30 hover:text-navy',
                  ].join(' ')}
                >
                  {category} <span className={active ? 'text-white/70' : 'text-muted-soft'}>{categoryCount(category)}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mt-6" aria-labelledby="all-pathways-heading">
        <h2 id="all-pathways-heading" className="text-lg font-bold text-navy">
          {activeCategory === 'All' ? 'Explore all Pathways' : `${activeCategory} Pathways`}
        </h2>
        {filtered.length > 0 ? (
          <div className="mt-5 space-y-8">
            {GROUPS.map((group) => {
              const items = filtered.filter((p) => p.status === group.status)
              if (!items.length) return null
              return (
                <section key={group.status} aria-labelledby={`pathway-group-${group.status.replace(/\s+/g, '-')}`}>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 id={`pathway-group-${group.status.replace(/\s+/g, '-')}`} className="text-base font-bold text-navy">
                      {STATUS_LABELS[group.status]}
                    </h3>
                    <span className="rounded-pill bg-canvas px-2 py-0.5 text-xs font-bold text-muted">{items.length}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{group.description}</p>
                  <div className="mt-3 space-y-3">
                    {items.map((pathway) => <PathwayRow key={pathway.id} pathway={pathway} defaultOpen={pathway.id === firstStrongId} />)}
                  </div>
                </section>
              )
            })}
          </div>
        ) : (
          <div className="card-surface mt-5 p-8 text-sm text-muted">No Pathways found for this category.</div>
        )}
      </section>

      <section className="mt-8 rounded-[var(--radius-card)] border border-line bg-canvas p-6 text-sm text-muted" aria-label="Sources and research notes">
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

function PathwayRow({ pathway, defaultOpen }: { pathway: PathwayEvaluation; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const headingId = `pathway-heading-${pathway.id}`
  const panelId = `pathway-panel-${pathway.id}`
  const facts = [
    ['Income guide', pathway.incomeThreshold],
    ['Dependents', pathway.dependentsAllowed],
    ['Local work rights', pathway.localWorkRights],
    ['Estimated fees', pathway.estimatedFees],
    ['Estimated processing', pathway.estimatedProcessingTime],
    ['Last verified', pathway.lastVerified],
  ].filter((fact): fact is [string, string] => Boolean(fact[1]))

  return (
    <article className="card-surface overflow-hidden">
      <h3>
        <button
          type="button"
          id={headingId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
          className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-canvas focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-gold/50"
        >
          <MatchRing value={metShare(pathway)} status={pathway.status} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-deep">{pathway.category}</span>
              <StatusBadge status={pathway.status} />
            </div>
            <p className="mt-2 line-clamp-2 text-base font-bold leading-6 text-navy">{pathway.name}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
              <CountryLabel country={pathway.country} />
              {pathway.estimatedProcessingTime && <span className="text-xs text-muted">{pathway.estimatedProcessingTime}</span>}
              <span className="text-xs font-semibold text-muted">
                {pathway.requirementsMet.length} met, {pathway.missingRequirements.length} to confirm
              </span>
            </div>
          </div>
          <ChevronDown size={19} aria-hidden="true" className={`shrink-0 text-muted transition-transform duration-[var(--duration-standard)] ${open ? 'rotate-180' : ''}`} />
        </button>
      </h3>

      {open && (
        <div id={panelId} role="region" aria-labelledby={headingId} className="border-t border-line px-5 pb-6 pt-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-teal-deep">Requirements met</h4>
              {pathway.requirementsMet.length ? (
                <ul className="mt-3 space-y-2 text-sm text-navy">
                  {pathway.requirementsMet.map((item) => (
                    <li key={item} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teal-deep" aria-hidden="true" /><span>{item}</span></li>
                  ))}
                </ul>
              ) : <p className="mt-3 text-sm text-muted">No profile requirements confirmed yet.</p>}
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-warn">Missing or unconfirmed</h4>
              {pathway.missingRequirements.length ? (
                <ul className="mt-3 space-y-2 text-sm text-navy">
                  {pathway.missingRequirements.map((item) => (
                    <li key={item} className="flex gap-2"><Info size={16} className="mt-0.5 shrink-0 text-warn" aria-hidden="true" /><span>{item}</span></li>
                  ))}
                </ul>
              ) : <p className="mt-3 text-sm text-muted">No profile gaps identified.</p>}
            </div>
          </div>

          {facts.length > 0 && (
            <dl className="mt-6 grid gap-x-8 gap-y-4 border-t border-line pt-5 text-sm sm:grid-cols-2">
              {facts.map(([label, value]) => (
                <div key={label}><dt className="text-xs font-bold text-muted">{label}</dt><dd className="mt-1 leading-6 text-navy">{value}</dd></div>
              ))}
            </dl>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {pathway.officialSource && (
              <a
                href={pathway.officialSource}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[var(--radius-field)] text-xs font-bold text-gold-deep underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-gold/50"
              >
                <ExternalLink size={14} aria-hidden="true" />
                {pathway.sourceLabel ?? 'Official source'}
              </a>
            )}
            <Link href="/my-plan?tab=checklist" className="inline-flex min-h-9 items-center rounded-[var(--radius-btn)] border border-line px-3.5 text-xs font-bold text-navy hover:bg-canvas">
              Add to plan
            </Link>
          </div>
        </div>
      )}
    </article>
  )
}
