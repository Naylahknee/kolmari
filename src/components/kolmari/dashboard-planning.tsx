import Link from 'next/link'
import {
  budgetEffective,
  budgetEnteredCount,
  docCounts,
  formatShortDate,
  upcomingDeadlines,
  type NexitPlan,
} from '@/lib/plan-types'

// ─── Progress by planning area ──────────────────────────────────────────
//
// Each area reports a real count where the plan holds one, and an honest
// status word where it does not. Nothing is scored or estimated.

type Area = {
  label: string
  /** Right-aligned figure: a real ratio, or a status word when no count exists. */
  num: string
  /** null when there is nothing to fill — the bar stays empty rather than guessing. */
  pct: number
  tone: 'complete' | 'partial' | 'empty'
  note: string
}

const TONE_COLOR: Record<Area['tone'], string> = {
  complete: 'var(--color-teal)',
  partial: 'var(--color-gold)',
  empty: 'var(--color-line)',
}
const TONE_NUM: Record<Area['tone'], string> = {
  complete: 'text-ok',
  partial: 'text-warn',
  empty: 'text-muted-soft',
}

function ratio(done: number, total: number): Pick<Area, 'num' | 'pct' | 'tone'> {
  if (total === 0) return { num: 'Not started', pct: 0, tone: 'empty' }
  return {
    num: `${done}/${total}`,
    pct: Math.round((done / total) * 100),
    tone: done === total ? 'complete' : done === 0 ? 'empty' : 'partial',
  }
}

function budgetLineSet(plan: NexitPlan | null, category: string): boolean {
  const line = plan?.budget.find((l) => l.category === category)
  return line ? budgetEffective(line) !== null : false
}

function flag(set: boolean, setNote: string, emptyNote: string): Pick<Area, 'num' | 'pct' | 'tone' | 'note'> {
  return set
    ? { num: 'Set', pct: 100, tone: 'complete', note: setNote }
    : { num: 'Not started', pct: 0, tone: 'empty', note: emptyNote }
}

function planningAreas(plan: NexitPlan | null, profileComplete: boolean, dependents: number | null): Area[] {
  // Eligibility: the four setup facts that decide whether a route can be assessed.
  const eligibilityChecks = [
    profileComplete,
    Boolean(plan?.saved_nextination),
    Boolean(plan?.selected_pathway),
    Boolean(plan?.target_move_date),
  ]
  const eligibilityDone = eligibilityChecks.filter(Boolean).length

  const docs = plan ? docCounts(plan) : null
  const budgetEntered = plan ? budgetEnteredCount(plan) : 0
  const budgetLines = plan?.budget.length ?? 0
  const schoolTask = plan?.checklist.find((item) => /school|education|childcare/i.test(item.text))

  const areas: Area[] = [
    {
      label: 'Eligibility',
      ...ratio(eligibilityDone, 4),
      note: profileComplete ? 'Profile, destination, pathway, and move date' : 'Complete your profile to assess fit',
    },
    {
      label: 'Documents',
      ...ratio(docs?.APPROVED ?? 0, docs?.total ?? 0),
      note: docs && docs.total > 0 ? `${docs.MISSING} not started` : 'No documents listed yet',
    },
    {
      label: 'Budget',
      ...ratio(budgetEntered, budgetLines),
      note: budgetEntered > 0 ? `${budgetEntered} of ${budgetLines} cost areas entered` : 'No figures entered yet',
    },
    {
      label: 'Housing',
      ...flag(budgetLineSet(plan, 'housing'), 'Monthly estimate added', 'Add a housing estimate'),
    },
    {
      label: 'Healthcare',
      ...flag(budgetLineSet(plan, 'healthcare'), 'Monthly estimate added', 'Add coverage research or an estimate'),
    },
    dependents && dependents > 0
      ? {
        label: 'Schools',
        ...(schoolTask
          ? schoolTask.done
            ? { num: 'Done', pct: 100, tone: 'complete' as const }
            : { num: 'In progress', pct: 50, tone: 'partial' as const }
          : { num: 'Not started', pct: 0, tone: 'empty' as const }),
        note: schoolTask ? 'School planning task on your checklist' : 'Add school research to your checklist',
      }
      : {
        label: 'Schools',
        num: 'N/A',
        pct: 0,
        tone: 'empty' as const,
        note: 'Not indicated for your current household',
      },
  ]
  return areas
}

export function DashboardPlanningAreasCard({ plan, profileComplete, dependents }: {
  plan: NexitPlan | null
  profileComplete: boolean
  dependents: number | null
}) {
  const areas = planningAreas(plan, profileComplete, dependents)

  return (
    <section
      className="rounded-[var(--radius-card)] border border-line bg-white px-5 pb-5 pt-[18px] shadow-tile"
      aria-labelledby="planning-progress-heading"
    >
      <div className="mb-[15px] flex items-center justify-between gap-4">
        <h2 id="planning-progress-heading" className="text-[16px] font-bold tracking-[-0.01em] text-navy">
          Progress by planning area
        </h2>
        <Link href="/my-plan" className="text-xs font-bold text-info hover:text-navy">View plan</Link>
      </div>

      <div className="grid gap-x-[18px] gap-y-[11px] [grid-template-columns:repeat(2,minmax(0,1fr))]">
        {areas.map((area) => (
          <div key={area.label}>
            <div className="flex items-baseline justify-between gap-2.5">
              <span className="text-[12.5px] font-semibold text-navy">{area.label}</span>
              <span className={`text-[12.5px] font-bold ${TONE_NUM[area.tone]}`}>{area.num}</span>
            </div>
            <div className="mt-1.5 h-[5px] overflow-hidden rounded-pill bg-[#eef1f6]">
              <div className="h-full rounded-pill" style={{ width: `${area.pct}%`, background: TONE_COLOR[area.tone] }} />
            </div>
            <div className="mt-1 text-[10.5px] text-muted-soft">{area.note}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Deadlines and blockers ─────────────────────────────────────────────

type Tag = 'Blocker' | 'At risk' | 'Watch'
type PlanningItem = { title: string; meta: string; tag: string; tone: Tag }

const DOT_STYLE: Record<Tag, string> = {
  Blocker: 'bg-danger',
  'At risk': 'bg-gold',
  Watch: 'bg-info',
}
const TAG_STYLE: Record<Tag, string> = {
  Blocker: 'bg-[#fde9ec] text-[#b3243c]',
  'At risk': 'bg-gold-soft text-warn',
  Watch: 'bg-info-soft text-info',
}

function dayTone(days: number): Tag {
  if (days < 0) return 'Blocker'
  if (days <= 60) return 'At risk'
  return 'Watch'
}

function planningItems(plan: NexitPlan | null, today: Date): PlanningItem[] {
  if (!plan) return []
  const midnight = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  return upcomingDeadlines(plan).slice(0, 3).map((deadline) => {
    const [y, m, d] = deadline.date.split('-').map(Number)
    const days = Math.round((Date.UTC(y, m - 1, d) - midnight) / 86_400_000)
    const tone = dayTone(days)
    return {
      title: deadline.label,
      meta: `Due ${formatShortDate(deadline.date)} · ${deadline.kind === 'document' ? 'Document' : 'Task'}`,
      tag: tone === 'Blocker' ? 'Overdue' : tone === 'At risk' ? `${days} days` : 'Watch',
      tone,
    }
  })
}

export function DashboardDeadlinesCard({ plan, today }: { plan: NexitPlan | null; today: Date }) {
  const items = planningItems(plan, today)

  return (
    <section
      className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-tile"
      aria-labelledby="deadlines-heading"
    >
      <div className="border-b border-line px-[17px] pb-3 pt-[15px]">
        <h2 id="deadlines-heading" className="text-[15px] font-bold text-navy">Deadlines and blockers</h2>
      </div>
      {items.length ? items.map((item) => (
        <div key={`${item.title}-${item.meta}`} className="flex items-start gap-[11px] border-b border-[#f0f3f7] px-[17px] py-3 last:border-b-0">
          <span className={`mt-[5px] size-[7px] shrink-0 rounded-pill ${DOT_STYLE[item.tone]}`} aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <div className="text-[12.8px] font-semibold leading-[1.4] text-navy">{item.title}</div>
            <div className="mt-0.5 text-[11px] text-muted-soft">{item.meta}</div>
          </div>
          <span className={`shrink-0 rounded-pill px-2 py-0.5 text-[9.5px] font-bold ${TAG_STYLE[item.tone]}`}>{item.tag}</span>
        </div>
      )) : (
        <p className="px-[17px] py-4 text-[12.5px] text-muted">No dated deadlines or blockers yet.</p>
      )}
    </section>
  )
}
