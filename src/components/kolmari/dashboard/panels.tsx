import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Compass,
  Sparkles,
} from 'lucide-react'
import type {
  DashAlert,
  NextTask,
  ResumeCard,
  ShortlistItem,
} from '@/lib/dashboard-model'
import { ALERT_KIND_LABEL } from '@/lib/dashboard-model'

/* Dashboard panels. Server components throughout — the only interactive
 * affordances ("Why this?", the collapsed alert list) use native <details>, so
 * the dashboard ships no extra client JavaScript. */

const EYEBROW = 'text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold-deep'
const CARD = 'rounded-[var(--radius-card)] border border-line bg-white shadow-tile'

/** Section label used at the top of each panel. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className={EYEBROW}>{children}</p>
}

// --- Orientation header ------------------------------------------------------

export function OrientationHeader({
  greeting, orientation, percent, currentStage, totalStages,
}: {
  greeting: React.ReactNode
  orientation: string
  percent: number
  currentStage: number
  totalStages: number
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
      <div className="min-w-0">
        <Eyebrow>Your decision workspace</Eyebrow>
        <h1 className="mt-1.5 font-display text-[30px] font-bold leading-tight tracking-[-0.02em] text-navy sm:text-[34px]">
          {greeting}
        </h1>
        <p className="mt-1 text-sm text-muted">{orientation}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="min-w-[190px]">
          <p className="text-xs font-semibold text-muted">Journey progress</p>
          <div className="mt-1 flex items-center gap-2.5">
            <span className="text-[22px] font-bold leading-none text-navy">{percent}%</span>
            <span className="h-1.5 w-24 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <span className="block h-full rounded-full bg-navy" style={{ width: `${Math.max(percent, 2)}%` }} />
            </span>
          </div>
          <p className="mt-1 text-[11.5px] text-muted-soft">
            {currentStage - 1} of {totalStages} stages complete
          </p>
        </div>
        <Link href="/flutter" className="gold-button shrink-0">
          Enter Flutter Mode <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </header>
  )
}

// --- Recommended next action -------------------------------------------------

/**
 * The single most important thing to do next. Same prioritized list that feeds
 * What's Next, showing its top entry; "Why this matters" reveals the reason
 * Kolmari ranked it first.
 */
export function NextActionCard({ task, stageLine }: { task: NextTask; stageLine: string }) {
  return (
    <section
      className="rounded-[var(--radius-card)] px-[22px] py-5 text-white"
      style={{
        background: 'linear-gradient(135deg,#0d1b39 0%,#17305b 58%,#1b3f68 100%)',
        boxShadow: '0 10px 30px -18px rgba(13,27,57,.45)',
      }}
      aria-labelledby="next-action-heading"
    >
      <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold">Recommended next action</p>
      <h2 id="next-action-heading" className="mt-[9px] text-[20px] font-bold tracking-[-0.015em]">
        {task.title}
      </h2>
      <p className="mt-2 max-w-[56ch] text-[13.5px] leading-[1.62] text-white/80">{task.why}</p>

      <details className="group mt-4">
        <summary className="flex list-none flex-wrap items-center gap-[9px] marker:hidden">
          <Link
            href={task.href}
            className="inline-flex items-center gap-[7px] rounded-[var(--radius-btn)] bg-gold px-[17px] py-2.5 text-[13px] font-bold text-navy-deep transition-colors duration-150 hover:bg-[#e0b40c]"
          >
            {task.cta === 'Open' ? 'Open in My Plan' : task.cta}
          </Link>
          <span className="cursor-pointer rounded-[var(--radius-btn)] border border-white/24 px-[15px] py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-white/10">
            Why this matters
          </span>
          {task.minutes !== null && (
            <span className="text-[12px] text-white/55">{task.minutes} min</span>
          )}
          <span className="text-[12px] text-white/55">{stageLine}</span>
        </summary>
        <p className="mt-3 max-w-[62ch] border-l-2 border-gold/60 pl-3 text-[12.5px] leading-[1.6] text-white/75">
          {task.reason}
        </p>
      </details>
    </section>
  )
}

// --- Pick up where you left off ---------------------------------------------

export function ResumePanel({ resume }: { resume: ResumeCard }) {
  return (
    <section
      className="flex flex-col rounded-[var(--radius-card)] px-[22px] py-5 text-white"
      style={{
        background: 'linear-gradient(135deg,#0d1b39 0%,#17305b 58%,#1b3f68 100%)',
        boxShadow: '0 10px 30px -18px rgba(13,27,57,.45)',
      }}
      aria-labelledby="resume-heading"
    >
      <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold">
        Pick up where you left off
      </p>

      {resume.countryName && (
        <div className="mt-3.5 flex items-center gap-2.5">
          {resume.countryCode && (
            <span
              className="grid h-7 w-[38px] flex-none place-items-center rounded-[6px] bg-white/12 text-[11px] font-bold tracking-wide text-gold"
              aria-hidden="true"
            >
              {resume.countryCode}
            </span>
          )}
          <span className="truncate text-[17px] font-bold">{resume.countryName}</span>
        </div>
      )}

      <h2 id="resume-heading" className="mt-3 text-[20px] font-bold leading-snug tracking-[-0.015em]">
        {resume.title}
      </h2>
      <p className="mt-1.5 max-w-[52ch] text-[13.5px] leading-[1.6] text-white/75">{resume.detail}</p>

      <div className="mt-5 pt-1">
        <Link
          href={resume.href}
          className="inline-flex items-center gap-2 rounded-[var(--radius-btn)] bg-gold px-[17px] py-2.5 text-[13px] font-bold text-navy-deep transition-colors duration-150 hover:bg-[#e0b40c]"
        >
          {resume.cta} <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}

// --- Your journey ------------------------------------------------------------

export function JourneyPanel({
  stageName, percent, currentStage, totalStages, nextMilestone,
}: {
  stageName: string
  percent: number
  currentStage: number
  totalStages: number
  nextMilestone: string | null
}) {
  return (
    <section className={`${CARD} flex flex-col px-5 py-5`} aria-labelledby="journey-heading">
      <Eyebrow>Your journey</Eyebrow>

      <h2 id="journey-heading" className="mt-3 flex items-center gap-2.5 text-[19px] font-bold text-navy">
        <span className="grid size-8 flex-none place-items-center rounded-full bg-canvas text-navy" aria-hidden="true">
          <Compass size={17} strokeWidth={1.9} />
        </span>
        {stageName}
      </h2>

      <div className="mt-4 flex gap-1.5" aria-hidden="true">
        {Array.from({ length: totalStages }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < currentStage - 1 ? 'bg-navy' : i === currentStage - 1 ? 'bg-navy/45' : 'bg-line'}`}
          />
        ))}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <p className="text-sm font-bold text-navy">{percent}% complete</p>
        <p className="text-xs text-muted">{currentStage - 1} of {totalStages} stages</p>
      </div>

      {nextMilestone && (
        <div className="mt-4 rounded-[var(--radius-field)] border border-line bg-canvas/45 px-3.5 py-3">
          <p className="text-[11px] font-semibold text-muted">Next milestone</p>
          <p className="mt-0.5 flex items-center justify-between gap-2 text-sm font-semibold text-navy">
            <span className="min-w-0 truncate">{nextMilestone}</span>
            <ChevronRight size={15} className="flex-none text-muted-soft" aria-hidden="true" />
          </p>
        </div>
      )}

      <Link
        href="/my-plan"
        className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-info transition-colors hover:text-navy"
      >
        View full journey <ArrowRight size={13} aria-hidden="true" />
      </Link>
    </section>
  )
}

// --- What's next -------------------------------------------------------------

export function NextActionsPanel({ tasks }: { tasks: NextTask[] }) {
  return (
    <section className={`${CARD} flex flex-col px-5 py-5`} aria-labelledby="next-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="next-heading" className={EYEBROW}>What&rsquo;s next</h2>
      </div>

      <ol className="mt-3.5 flex flex-col gap-2.5">
        {tasks.map((task, index) => (
          <li
            key={task.id}
            className="rounded-[var(--radius-field)] border border-line bg-canvas/35 px-3.5 py-3.5 transition-colors hover:border-line-strong"
          >
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 grid size-6 flex-none place-items-center rounded-full bg-white text-[11px] font-bold text-navy ring-1 ring-line"
                aria-hidden="true"
              >
                {index + 1}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-snug text-navy">{task.title}</p>
                <p className="mt-1 text-[12.5px] leading-[1.55] text-muted">{task.why}</p>

                <details className="group mt-1.5">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-[11px] font-bold text-info marker:hidden hover:text-navy">
                    Why this?
                  </summary>
                  <p className="mt-1.5 border-l-2 border-gold/50 pl-2.5 text-[12px] leading-[1.55] text-muted">
                    {task.reason}
                  </p>
                </details>
              </div>

              {/* Time + action sit alongside the text from 400px up, and drop
                  below it on the narrowest phones so nothing overflows. */}
              <div className="hidden flex-none flex-col items-end gap-2 min-[400px]:flex">
                {task.minutes !== null && (
                  <span className="whitespace-nowrap text-[11px] font-semibold text-muted-soft">
                    {task.minutes} min
                  </span>
                )}
                <Link
                  href={task.href}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-btn)] bg-gold px-3 py-2 text-[12px] font-bold text-navy-deep transition-colors duration-150 hover:bg-[#e0b40c]"
                >
                  {task.cta} <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3 pl-9 min-[400px]:hidden">
              <Link
                href={task.href}
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-btn)] bg-gold px-3 py-2 text-[12px] font-bold text-navy-deep"
              >
                {task.cta} <ArrowRight size={13} aria-hidden="true" />
              </Link>
              {task.minutes !== null && (
                <span className="text-[11px] font-semibold text-muted-soft">{task.minutes} min</span>
              )}
            </div>
          </li>
        ))}
      </ol>

      <Link
        href="/my-plan?tab=checklist"
        className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-info transition-colors hover:text-navy"
      >
        View all tasks <ArrowRight size={13} aria-hidden="true" />
      </Link>
    </section>
  )
}

// --- Needs your attention ----------------------------------------------------

const ALERT_TONE: Record<DashAlert['kind'], { wrap: string; icon: string }> = {
  action: { wrap: 'border-[#f0c9a8] bg-[#fdf5ec]', icon: 'bg-[#e8853a] text-white' },
  changed: { wrap: 'border-gold/40 bg-gold-soft/35', icon: 'bg-gold text-navy-deep' },
  reminder: { wrap: 'border-line bg-canvas/45', icon: 'bg-info-soft text-info' },
}

export function AttentionPanel({ alerts }: { alerts: DashAlert[] }) {
  // Nothing waiting: collapse to a single quiet line rather than a large empty card.
  if (alerts.length === 0) {
    return (
      <section
        className="flex items-center gap-2.5 rounded-[var(--radius-card)] border border-line bg-white px-4 py-3 shadow-tile"
        aria-label="Needs your attention"
      >
        <CheckCircle2 size={16} className="flex-none text-ok" aria-hidden="true" />
        <p className="text-[12.5px] font-semibold text-navy">Nothing needs your attention</p>
        <p className="text-[12.5px] text-muted">You&rsquo;re all caught up.</p>
      </section>
    )
  }

  return (
    <section className={`${CARD} flex flex-col px-5 py-5`} aria-labelledby="attention-heading">
      <h2 id="attention-heading" className={EYEBROW}>Needs your attention</h2>

      <div className="mt-3.5 flex flex-col gap-2.5">
        {alerts.map((alert) => {
          const tone = ALERT_TONE[alert.kind]
          return (
            <article key={alert.id} className={`rounded-[var(--radius-field)] border px-3.5 py-3.5 ${tone.wrap}`}>
              <div className="flex items-start gap-2.5">
                <span className={`grid size-7 flex-none place-items-center rounded-full ${tone.icon}`} aria-hidden="true">
                  <AlertTriangle size={14} strokeWidth={2.2} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
                    {ALERT_KIND_LABEL[alert.kind]}
                  </p>
                  <p className="mt-0.5 text-[13px] font-bold leading-snug text-navy">{alert.title}</p>
                  <p className="mt-1 text-[12px] leading-[1.55] text-muted">{alert.detail}</p>
                  <Link
                    href={alert.href}
                    className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-[#c2571c] hover:underline"
                  >
                    {alert.cta} <ArrowRight size={12} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

// --- Your shortlist ----------------------------------------------------------

export function ShortlistPanel({ items, ranked }: { items: ShortlistItem[]; ranked: boolean }) {
  return (
    <section className={`${CARD} px-5 py-5`} aria-labelledby="shortlist-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="shortlist-heading" className={EYEBROW}>Your shortlist</h2>
          <p className="mt-1 text-[12.5px] text-muted">
            {ranked
              ? 'Your top destinations based on your profile and priorities.'
              : 'Complete your Kolmari Profile to rank these by Match Score.'}
          </p>
        </div>
        <Link href="/your-world" className="inline-flex items-center gap-1.5 text-xs font-bold text-info hover:text-navy">
          View all destinations <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-4 rounded-[var(--radius-field)] border border-dashed border-line-strong bg-canvas/40 px-4 py-8 text-center">
          <p className="text-sm font-semibold text-navy">No destinations shortlisted yet</p>
          <p className="mx-auto mt-1 max-w-sm text-[12.5px] leading-6 text-muted">
            Open the world map to add the first place you&rsquo;re considering.
          </p>
          <Link href="/your-world" className="gold-button mt-4">
            Explore destinations <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <ShortlistCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </section>
  )
}

function ShortlistCard({ item }: { item: ShortlistItem }) {
  return (
    <article className="overflow-hidden rounded-[var(--radius-tile)] border border-line bg-white transition hover:border-gold/45 hover:shadow-card">
      {/* Hero strip. Painted as a background so a country with no generated art
          simply falls back to the navy wash instead of a broken image. */}
      <div
        className="relative h-[132px] bg-navy bg-cover bg-center"
        style={{ backgroundImage: `url(/api/country-asset?slug=${item.slug}&type=hero)` }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg,rgba(9,20,44,.05) 42%,rgba(9,20,44,.78) 100%)' }}
          aria-hidden="true"
        />
        <span
          className="absolute left-3 top-3 h-7 w-[38px] overflow-hidden rounded-[5px] ring-1 ring-white/45"
          role="img"
          aria-label={item.name}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/flags/${item.code.toLowerCase()}.svg`} alt="" className="size-full object-cover" />
        </span>
        <div className="absolute inset-x-3 bottom-2.5 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[17px] font-bold leading-tight text-white">{item.name}</p>
            <p className="truncate text-[11.5px] text-white/75">{item.city}</p>
          </div>
          {item.score !== null && (
            <div className="flex-none text-right">
              <p className="text-[17px] font-bold leading-none text-white">{item.score}%</p>
              <p className="text-[10px] text-white/70">Match Score</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 px-3.5 py-3.5">
        {item.signals.map((signal) => (
          <div key={signal.label} className="min-w-0">
            <p className="truncate text-[9.5px] font-bold uppercase tracking-wider text-muted-soft">{signal.label}</p>
            <p className="mt-0.5 truncate text-[12.5px] font-bold text-navy">{signal.value}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-line px-3.5 py-3">
        <Link
          href={item.href}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-btn)] border border-line px-3 py-2 text-[12.5px] font-bold text-navy transition-colors hover:border-gold hover:bg-[#fdfbf3]"
        >
          View {item.name} details <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

// --- Footer note -------------------------------------------------------------

export function LearningNote() {
  return (
    <p className="flex items-center justify-center gap-2 rounded-[var(--radius-card)] border border-line bg-white px-4 py-3.5 text-[12.5px] text-muted shadow-tile">
      <Sparkles size={14} className="flex-none text-gold-deep" aria-hidden="true" />
      Kolmari is always learning. The more you add, the better your recommendations.
    </p>
  )
}
