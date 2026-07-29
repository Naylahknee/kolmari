import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

// Honest, generic descriptors for each plan stage — no fabricated durations
// or dates. Stage names come from the plan model (Explore → Settle).
const STAGE_DETAIL: Record<string, string> = {
  Explore: 'Compare destinations and pathways',
  Decide: 'Choose a destination and route',
  Prepare: 'Gather documents and budget',
  Apply: 'Submit your visa application',
  Move: 'Relocate and arrive',
  Settle: 'Set up life and integrate',
}

/**
 * Dashboard journey-progress tracker (request: a tracker like the reference,
 * based on Kolmari). A horizontal stepper over the user's plan stages. The
 * app is not gated, so there are no locked steps or upgrade prompts —
 * every stage is always visible and reachable.
 */
export function MoveTracker({ stages, currentIndex }: { stages: readonly string[]; currentIndex: number }) {
  const started = currentIndex >= 0
  const activeIndex = started ? currentIndex : 0

  return (
    <section className="card-surface p-6" aria-labelledby="tracker-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Progress Tracker</p>
          <h2 id="tracker-heading" className="mt-1 text-lg font-bold text-navy">Your journey progress</h2>
          <p className="mt-1 text-sm text-muted">
            {started
              ? `You're in the ${stages[activeIndex]} stage of your move.`
              : 'Start your plan to track each stage of your move.'}
          </p>
        </div>
        <Link href="/nexit-plan" className="inline-flex items-center gap-1 text-xs font-bold text-gold-deep hover:text-navy">
          Open My Plan <ArrowRight size={12} />
        </Link>
      </div>

      <ol className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Relocation stages">
        {stages.map((stage, index) => {
          const done = started && index < currentIndex
          const active = started && index === currentIndex
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
                        : 'border-line bg-white text-muted',
                  ].join(' ')}
                >
                  {done ? <Check size={16} /> : index + 1}
                </span>
                <span className={`h-0.5 flex-1 ${index === stages.length - 1 ? 'opacity-0' : done ? 'bg-gold' : 'bg-line'}`} />
              </div>
              <p className={`mt-2 text-sm font-bold ${active ? 'text-gold-deep' : 'text-navy'}`}>{stage}</p>
              <p className="mt-0.5 text-xs leading-4 text-muted">{STAGE_DETAIL[stage] ?? ''}</p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
