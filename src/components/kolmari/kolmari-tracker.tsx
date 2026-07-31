import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

/**
 * Kolmari journey tracker — one component for both plan tiers.
 *
 * The six stages follow the product story (neither a butterfly's path nor a
 * flight path is straight): Liftoff → Match → Explore → Decide → Build →
 * Flutter. They sit on a dashed wave-path connector at the crests and troughs,
 * making the flutter/flight motif literal rather than a flat stepper line.
 *
 * `gated` (free plan): stages after the current one are locked (padlock) and an
 * upgrade banner appears. Ungated (paid): every stage is open, no banner.
 * Completed stages show a check, the current stage is highlighted, later stages
 * are muted. No fabricated dates or durations.
 */
const STAGES: readonly (readonly [string, string])[] = [
  ['Liftoff', 'Begin your Kolmari journey'],
  ['Match', 'See your matched destinations'],
  ['Explore', 'Dig into a destination'],
  ['Decide', 'Choose where and how'],
  ['Build', 'Build your Kolmari Plan'],
  ['Flutter', 'Prepare for lift-off'],
]

// Wave geometry (viewBox units). Even nodes sit low (grounded Liftoff), odd
// nodes high, so the path ends elevated at Flutter.
const PAD = 60
const GAP = 120
const WIDTH = PAD * 2 + GAP * (STAGES.length - 1)
const HEIGHT = 150
const LOW = 96
const HIGH = 54
const LABEL_Y = 138
const NODES = STAGES.map((_, i) => ({ x: PAD + GAP * i, y: i % 2 === 0 ? LOW : HIGH }))

function segment(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2
  return `C ${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`
}

const FULL_PATH =
  `M ${NODES[0].x} ${NODES[0].y} ` + NODES.slice(1).map((n, i) => segment(NODES[i], n)).join(' ')

function pathUpTo(upTo: number) {
  if (upTo <= 0) return ''
  let d = `M ${NODES[0].x} ${NODES[0].y}`
  for (let i = 0; i < upTo; i += 1) d += ` ${segment(NODES[i], NODES[i + 1])}`
  return d
}

export function KolmariTracker({ currentIndex, gated }: { currentIndex: number; gated: boolean }) {
  const idx = Math.max(0, Math.min(STAGES.length - 1, currentIndex))
  const donePath = pathUpTo(idx)
  const [currentName, currentDetail] = STAGES[idx]

  return (
    <section className="card-surface p-6" aria-labelledby="tracker-heading">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Progress Tracker</p>
        <h2 id="tracker-heading" className="mt-1 text-lg font-bold text-navy">Your journey progress</h2>
        <p className="mt-1 text-sm text-muted">
          You&rsquo;re in the <span className="font-semibold text-navy">{currentName}</span> stage — {currentDetail.toLowerCase()}.
          {gated ? ' Unlock later stages with Plus.' : ''}
        </p>
      </div>

      {gated && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-field)] border border-gold/30 bg-gold-soft/40 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-navy">
            <Sparkles size={16} className="shrink-0 text-gold-deep" aria-hidden="true" />
            Unlock every stage of your move with Plus.
          </p>
          <Link href="/coming-soon?feature=plus" className="gold-button shrink-0">
            Build My Kolmari Plan <ArrowRight size={15} />
          </Link>
        </div>
      )}

      <div className="mt-6 overflow-x-auto pb-1">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full min-w-[560px]"
          role="img"
          aria-label={`Journey progress — currently in the ${currentName} stage, step ${idx + 1} of ${STAGES.length}`}
        >
          {/* Full dashed wave (remaining), then the completed portion in gold. */}
          <path d={FULL_PATH} fill="none" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="1.5 7" className="stroke-line" />
          {donePath && (
            <path d={donePath} fill="none" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="1.5 7" className="stroke-gold" />
          )}

          {NODES.map((n, i) => {
            const done = i < idx
            const active = i === idx
            const locked = gated && i > idx
            const circleClass = done
              ? 'fill-gold stroke-gold'
              : active
                ? 'fill-gold-soft stroke-gold'
                : 'fill-white stroke-line'
            return (
              <g key={STAGES[i][0]}>
                <circle cx={n.x} cy={n.y} r={17} strokeWidth={2.5} className={circleClass} />
                {done ? (
                  <path
                    d={`M ${n.x - 6} ${n.y} L ${n.x - 1.5} ${n.y + 4.5} L ${n.x + 6.5} ${n.y - 5}`}
                    fill="none"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="stroke-navy-deep"
                  />
                ) : locked ? (
                  <g strokeWidth={1.6} className="stroke-muted">
                    <rect x={n.x - 5} y={n.y - 1} width={10} height={8} rx={1.6} className="fill-white stroke-muted" />
                    <path d={`M ${n.x - 3} ${n.y - 1} v-2.2 a3 3 0 0 1 6 0 v2.2`} fill="none" />
                  </g>
                ) : (
                  <text x={n.x} y={n.y + 4.5} textAnchor="middle" fontSize={12.5} fontWeight={700} className={active ? 'fill-navy' : 'fill-muted'}>
                    {i + 1}
                  </text>
                )}
                <text
                  x={n.x}
                  y={LABEL_Y}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={700}
                  className={active ? 'fill-gold-deep' : done ? 'fill-navy' : 'fill-muted'}
                >
                  {STAGES[i][0]}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </section>
  )
}

/**
 * Derive the current journey stage index from real progress signals — no
 * fabricated advancement. Liftoff is always reached (the user is in the app);
 * later stages light up only when their signal is present.
 */
export function kolmariStageIndex(
  profileComplete: boolean,
  plan: { saved_nextination: string | null; selected_pathway: string | null } | null,
  completedTasks: number,
): number {
  if (completedTasks > 0) return 5 // Flutter — started the move-readiness checklist
  if (plan?.selected_pathway) return 4 // Build — committed to a pathway
  if (plan?.saved_nextination) return 3 // Decide — chose a destination
  if (profileComplete) return 2 // Explore — matches are ready
  return 1 // Match — Liftoff done, matching in progress
}
