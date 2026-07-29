import Link from 'next/link'
import { ArrowRight, Check, Lock, Sparkles } from 'lucide-react'

// Honest, generic descriptors for each plan stage — no fabricated durations or
// dates (data-integrity rule; owner decision: no durations). Stage names come
// from the plan model (Explore → Settle).
const STAGE_DETAIL: Record<string, string> = {
  Explore: 'Compare destinations and pathways',
  Decide: 'Choose a destination and route',
  Prepare: 'Gather documents and budget',
  Apply: 'Submit your visa application',
  Move: 'Relocate and arrive',
  Settle: 'Set up life and integrate',
}

/**
 * Free-plan journey progress tracker.
 *
 * Unlike the paid `MoveTracker` (every stage open), the free view keeps the
 * first stage open and truly gates the later stages: locked stages render a
 * padlock, are non-interactive, and route only to the upgrade page. This is a
 * calm "Plus feature" upsell — no scarcity, urgency, or countdown framing
 * (interaction rules) — matching the country-page lock treatment.
 */
export function JourneyProgress({
  stages,
  currentIndex,
}: {
  stages: readonly string[]
  currentIndex: number
}) {
  // Reflect the real plan stage so the tracker updates as the user progresses.
  // Completed stages show a check, the current stage is highlighted, and later
  // stages are locked (Plus).
  const started = currentIndex >= 0
  const activeIndex = started ? currentIndex : 0

  return (
    <section className="card-surface p-6" aria-labelledby="journey-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Progress Tracker</p>
          <h2 id="journey-heading" className="mt-1 text-lg font-bold text-navy">Your journey progress</h2>
          <p className="mt-1 text-sm text-muted">
            {started
              ? `You're in the ${stages[activeIndex]} stage. Unlock later stages with Plus.`
              : `Start in the ${stages[0]} stage. Unlock later stages with Plus.`}
          </p>
        </div>
      </div>

      {/* Upgrade banner — calm, single CTA, no scarcity framing. */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-field)] border border-gold/30 bg-gold-soft/40 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-navy">
          <Sparkles size={16} className="shrink-0 text-gold-deep" aria-hidden="true" />
          Unlock every stage of your move with Plus.
        </p>
        <Link href="/#pricing" className="gold-button shrink-0">
          Upgrade <ArrowRight size={15} />
        </Link>
      </div>

      <ol className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Relocation stages">
        {stages.map((stage, index) => {
          const done = index < activeIndex
          const active = index === activeIndex
          const locked = index > activeIndex
          return (
            <li key={stage} className="flex min-w-[8.5rem] flex-1 flex-col items-center text-center">
              <div className="flex w-full items-center">
                <span className={`h-0.5 flex-1 ${index === 0 ? 'opacity-0' : done || active ? 'bg-gold' : 'bg-line'}`} />
                <span
                  aria-hidden="true"
                  className={[
                    'grid size-9 shrink-0 place-items-center rounded-full border-2 text-xs font-bold',
                    done ? 'border-gold bg-gold text-navy-deep'
                      : active ? 'border-gold bg-gold-soft text-navy'
                        : 'border-line bg-canvas text-muted',
                  ].join(' ')}
                >
                  {done ? <Check size={16} /> : locked ? <Lock size={14} /> : index + 1}
                </span>
                <span className={`h-0.5 flex-1 ${index === stages.length - 1 ? 'opacity-0' : done ? 'bg-gold' : 'bg-line'}`} />
              </div>
              <p className={`mt-2 text-sm font-bold ${active ? 'text-gold-deep' : locked ? 'text-muted' : 'text-navy'}`}>
                {stage}
              </p>
              <p className="mt-0.5 text-xs leading-4 text-muted">{STAGE_DETAIL[stage] ?? ''}</p>
              {locked && (
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-pill bg-white px-2 py-0.5 text-[10px] font-bold text-gold-deep">
                  <Lock size={10} aria-hidden="true" /> Plus
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
