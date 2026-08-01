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

const PAD = 46
const GAP = 104
const WIDTH = PAD * 2 + GAP * (PLAN_STAGES.length - 1)
const HEIGHT = 142
const LOW = 90
const HIGH = 52
const LABEL_Y = 132
const NODES = PLAN_STAGES.map((_, i) => ({ x: PAD + GAP * i, y: i % 2 === 0 ? LOW : HIGH }))

function segment(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2
  return `C ${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`
}

const FULL_PATH =
  `M ${NODES[0].x} ${NODES[0].y} ` + NODES.slice(1).map((node, i) => segment(NODES[i], node)).join(' ')

function pathUpTo(upTo: number) {
  if (upTo <= 0) return ''
  let d = `M ${NODES[0].x} ${NODES[0].y}`
  for (let i = 0; i < upTo; i += 1) d += ` ${segment(NODES[i], NODES[i + 1])}`
  return d
}

export function KolmariTracker({ currentStage }: { currentStage: JourneyStage }) {
  const idx = Math.max(0, Math.min(PLAN_STAGES.length - 1, currentStage - 1))
  const currentName = PLAN_STAGES[idx]
  const donePath = pathUpTo(idx)

  return (
    <section id="dashboard-progress" className="card-surface p-5 sm:p-6" aria-labelledby="tracker-heading">
      <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Progress Tracker</p>
      <h2 id="tracker-heading" className="mt-1 text-lg font-bold text-navy">Your journey progress</h2>
      <p className="mt-1 text-sm text-muted">
        You&rsquo;re in the <span className="font-semibold text-navy">{currentName}</span> stage — {STAGE_DETAIL[currentName].toLowerCase()}.
      </p>

      <div className="mt-5 overflow-x-auto pb-1">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full min-w-[720px]"
          role="img"
          aria-label={`Journey progress — currently in ${currentName}, step ${idx + 1} of ${PLAN_STAGES.length}`}
        >
          <path d={FULL_PATH} fill="none" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="1.5 7" className="stroke-line" />
          {donePath && <path d={donePath} fill="none" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="1.5 7" className="stroke-gold" />}

          {NODES.map((node, i) => {
            const done = i < idx
            const active = i === idx
            const circleClass = done
              ? 'fill-gold stroke-gold'
              : active
                ? 'fill-white stroke-gold'
                : 'fill-canvas stroke-line'
            return (
              <g key={PLAN_STAGES[i]}>
                <circle cx={node.x} cy={node.y} r={14} strokeWidth={active ? 3 : 2.25} className={circleClass} />
                {done ? (
                  <path
                    d={`M ${node.x - 5} ${node.y} L ${node.x - 1.2} ${node.y + 3.8} L ${node.x + 5.5} ${node.y - 4.2}`}
                    fill="none"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="stroke-navy-deep"
                  />
                ) : (
                  <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize={11.5} fontWeight={700} className={active ? 'fill-navy' : 'fill-muted'}>
                    {i + 1}
                  </text>
                )}
                <text
                  x={node.x}
                  y={LABEL_Y}
                  textAnchor="middle"
                  fontSize={11.5}
                  fontWeight={700}
                  className={active ? 'fill-gold-deep' : done ? 'fill-navy' : 'fill-muted'}
                >
                  {PLAN_STAGES[i]}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </section>
  )
}
