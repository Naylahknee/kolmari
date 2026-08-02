import Link from 'next/link'
import { ArrowRight, Check, Lock } from 'lucide-react'

// The free view of Flutter Mode: what the execution report contains, which
// quiz results are readable, and what Pro opens. Structure is shown openly —
// the numbers behind it are the paid part.

const COVERS = [
  { title: 'Kolmari Readiness', body: 'One figure for how close you are, broken into legal and financial readiness.' },
  { title: 'Immediate priority', body: 'The single next action, with its deadline and effort estimate.' },
  { title: 'Kolmari Protocol Checklist', body: 'Your plan tasks with their current status, worked in one place.' },
  { title: 'Greenbook Insights', body: 'Neighborhood-level reporting for your destination city.' },
]

const PRO_FEATURES = [
  'Readiness scoring for your file',
  'Your immediate priority and deadline',
  'Protocol checklist with current status',
  'Greenbook Insights for your city',
  'Share and export the report',
]

export type QuizResult = { slug: string; name: string; region: string; code: string; unlocked: boolean }

export function FlutterGate({ results }: { results: QuizResult[] }) {
  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] border border-gold/30 bg-gold-soft/50 px-5 py-3.5">
        <p className="flex items-center gap-2.5 text-[13px] text-navy">
          <Lock size={15} className="shrink-0 text-gold-deep" aria-hidden="true" />
          Upgrade to unlock your personalized relocation plan, pathway matching, and the full country research.
        </p>
        <Link href="/settings" className="gold-button shrink-0">Upgrade now</Link>
      </section>

      <header>
        <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold-deep">Plan</p>
        <h1 className="mt-1 text-[26px] font-bold tracking-[-0.02em] text-navy">Flutter Mode</h1>
        <p className="mt-1.5 max-w-[70ch] text-[13.5px] leading-[1.62] text-muted">
          Fluttering is the doing phase — the decision is made, and the work is crossing requirements off the list.
          Flutter Mode is the execution report for a chosen destination: readiness scoring, your immediate priority,
          and the protocol checklist. Built from your quiz and your selected country.
        </p>
      </header>

      <div className="grid items-start gap-4 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        <div className="space-y-4">
          <section className="rounded-[var(--radius-card)] border border-line bg-white px-5 pb-5 pt-[18px] shadow-tile" aria-labelledby="covers-heading">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="covers-heading" className="text-[16px] font-bold tracking-[-0.01em] text-navy">What the report covers</h2>
                <p className="mt-0.5 text-[12.5px] text-muted">Structure is open; the numbers are yours.</p>
              </div>
              <span className="shrink-0 rounded-pill bg-ok-soft px-2.5 py-1 text-[10.5px] font-bold text-ok">Included free</span>
            </div>
            <div className="mt-4 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
              {COVERS.map((item) => (
                <div key={item.title} className="rounded-[10px] border border-line px-3.5 py-3">
                  <p className="text-[12.5px] font-bold text-navy">{item.title}</p>
                  <p className="mt-1 text-[11.5px] leading-[1.55] text-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-line bg-white px-5 pb-5 pt-[18px] shadow-tile" aria-labelledby="quiz-heading">
            <h2 id="quiz-heading" className="text-[16px] font-bold tracking-[-0.01em] text-navy">Your quiz results</h2>
            <p className="mt-0.5 text-[12.5px] text-muted">Matched from what you told us. Country names are free; the scoring behind them is not.</p>
            {results.length ? (
              <ul className="mt-4 space-y-2">
                {results.map((item) => (
                  <li key={item.slug} className="flex items-center gap-3 rounded-[10px] border border-line px-3 py-2.5">
                    <span className="grid h-6 w-[34px] flex-none place-items-center rounded-[4px] bg-navy text-[10.5px] font-bold text-gold" aria-hidden="true">{item.code}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-bold text-navy">{item.name}</span>
                      <span className="block truncate text-[10.5px] text-muted-soft">{item.region}</span>
                    </span>
                    {item.unlocked ? (
                      <Link href={`/nextinations/${item.slug}`} className="shrink-0 text-[12px] font-bold text-gold-deep hover:text-navy">
                        View overview <ArrowRight size={11} className="inline" aria-hidden="true" />
                      </Link>
                    ) : (
                      <span className="flex shrink-0 items-center gap-1 text-[11.5px] font-semibold text-muted-soft">
                        <Lock size={11} aria-hidden="true" /> Locked
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-[12.5px] leading-6 text-muted">
                No quiz results yet. <Link href="/profile-wizard" className="font-bold text-gold-deep">Complete the Profile Wizard</Link> to see your matches.
              </p>
            )}
          </section>
        </div>

        <section
          className="rounded-[var(--radius-card)] px-6 py-6 text-white shadow-shell"
          style={{ background: 'linear-gradient(135deg,#0d1b39 0%,#17305b 58%,#1b3f68 100%)' }}
          aria-labelledby="pro-heading"
        >
          <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-gold">
            <Lock size={12} aria-hidden="true" /> Kolmari Pro
          </p>
          <h2 id="pro-heading" className="mt-2.5 text-[21px] font-bold tracking-[-0.015em]">Your execution report</h2>
          <p className="mt-1.5 text-[12.8px] leading-[1.6] text-white/70">
            Generated once you finish the quiz and choose a destination.
          </p>
          <ul className="mt-4 space-y-2">
            {PRO_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 rounded-[var(--radius-field)] bg-white/8 px-3.5 py-2.5">
                <Check size={13} className="shrink-0 text-gold" strokeWidth={3} aria-hidden="true" />
                <span className="text-[12.5px] font-semibold">{feature}</span>
              </li>
            ))}
          </ul>
          <Link href="/settings" className="gold-button mt-5 w-full">Upgrade now</Link>
          <p className="mt-2.5 text-center text-[11px] text-white/55">Cancel anytime</p>
        </section>
      </div>
    </div>
  )
}
