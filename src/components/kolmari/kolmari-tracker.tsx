import { PLAN_STAGES, type JourneyStage } from '@/lib/plan-types'

const STAGE_DETAIL: Record<(typeof PLAN_STAGES)[number], string> = {
  Explore: 'Research destinations and possibilities',
  Assess: 'Compare your profile with real requirements',
  Shortlist: 'Narrow the places and pathways worth pursuing',
  Decide: 'Choose where and how you plan to move',
  Prepare: 'Build your documents, budget, and timeline',
  Apply: 'Submit and track your applications',
  Move: 'Coordinate the practical move',
  'Settle In': 'Establish your new day-to-day life',
}

export function KolmariTracker({ currentStage }: { currentStage: JourneyStage }) {
  const idx = Math.max(0, Math.min(PLAN_STAGES.length - 1, currentStage - 1))
  const currentName = PLAN_STAGES[idx]

  return (
    <section id="dashboard-progress" className="card-surface px-4 py-3.5 sm:px-5" aria-labelledby="tracker-heading">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-1">
        <div className="flex items-baseline gap-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gold-deep">Progress Tracker</p>
          <h2 id="tracker-heading" className="text-sm font-bold text-navy">{currentName}</h2>
        </div>
        <p className="text-xs text-muted">
          {STAGE_DETAIL[currentName]} <span className="font-semibold text-navy">· {idx + 1} of {PLAN_STAGES.length}</span>
        </p>
      </div>

      <div className="mt-3 overflow-x-auto pb-0.5">
        <ol
          className="flex min-w-[640px]"
          aria-label={`Journey progress — currently in ${currentName}, step ${idx + 1} of ${PLAN_STAGES.length}`}
        >
          {PLAN_STAGES.map((stage, i) => {
            const done = i < idx
            const active = i === idx
            return (
              <li key={stage} className="relative flex flex-1 flex-col items-center">
                {i > 0 && (
                  <span
                    className={`absolute right-1/2 top-[10px] h-0.5 w-full ${i <= idx ? 'bg-gold' : 'bg-line'}`}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={[
                    'relative z-10 grid size-5 place-items-center rounded-full border-2 text-[9px] font-bold',
                    done
                      ? 'border-gold bg-gold text-navy-deep'
                      : active
                        ? 'border-gold bg-white text-navy'
                        : 'border-line bg-canvas text-muted',
                  ].join(' ')}
                  aria-current={active ? 'step' : undefined}
                >
                  {done ? '✓' : i + 1}
                </span>
                <span className={`mt-1.5 text-[10px] font-semibold ${active ? 'text-gold-deep' : done ? 'text-navy' : 'text-muted'}`}>
                  {stage}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
