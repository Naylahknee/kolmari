import {
  AlertTriangle,
  CalendarClock,
  FileCheck2,
  HeartPulse,
  Home,
  School,
  ShieldCheck,
} from 'lucide-react'
import {
  budgetEffective,
  budgetEnteredCount,
  docCounts,
  formatShortDate,
  upcomingDeadlines,
  type NexitPlan,
} from '@/lib/plan-types'

function hasBudgetCategory(plan: NexitPlan | null, category: string): boolean {
  const line = plan?.budget.find((l) => l.category === category)
  return line ? budgetEffective(line) !== null : false
}

type Tag = 'Blocker' | 'At risk' | 'Watch'
type PlanningItem = { title: string; due: string; tag: Tag }

const TAG_STYLE: Record<Tag, string> = {
  Blocker: 'text-[rgb(179,36,60)]',
  Watch: 'text-[rgb(44,71,120)]',
  'At risk': 'text-[rgb(122,92,5)]',
}

function deadlineTag(date: string): Tag {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(`${date}T00:00:00`)
  const days = Math.ceil((due.getTime() - today.getTime()) / 86_400_000)
  if (days < 0) return 'Blocker'
  if (days <= 30) return 'At risk'
  return 'Watch'
}

function planningItems(plan: NexitPlan | null, profileComplete: boolean): PlanningItem[] {
  const items: PlanningItem[] = []
  if (!profileComplete) items.push({ title: 'Complete your profile', due: 'No due date', tag: 'Blocker' })

  if (plan) {
    for (const deadline of upcomingDeadlines(plan)) {
      items.push({
        title: deadline.label,
        due: `Due ${formatShortDate(deadline.date)}`,
        tag: deadlineTag(deadline.date),
      })
      if (items.length === 3) return items
    }
    const setup = [
      !plan.saved_nextination ? 'Choose a destination' : null,
      !plan.selected_pathway ? 'Select a pathway' : null,
      !plan.target_move_date ? 'Set your target move date' : null,
    ].filter((item): item is string => Boolean(item))
    for (const title of setup) {
      items.push({ title, due: 'No due date', tag: 'Watch' })
      if (items.length === 3) break
    }
  } else {
    for (const title of ['Choose a destination', 'Select a pathway']) {
      items.push({ title, due: 'No due date', tag: 'Watch' })
      if (items.length === 3) break
    }
  }
  return items.slice(0, 3)
}

export function DashboardPlanningColumn({ plan, profileComplete, dependents }: {
  plan: NexitPlan | null
  profileComplete: boolean
  dependents: number | null
}) {
  const blockers = planningItems(plan, profileComplete)
  const documents = plan ? docCounts(plan) : null
  const budgetCategories = plan ? budgetEnteredCount(plan) : 0
  const schoolTask = plan?.checklist.find((item) => /school|education|childcare/i.test(item.text))

  const progress = [
    {
      icon: ShieldCheck,
      label: 'Eligibility',
      status: !profileComplete
        ? 'Complete your profile to assess fit.'
        : plan?.selected_pathway
          ? 'Pathway selected.'
          : 'Ready to review pathway matches.',
    },
    {
      icon: FileCheck2,
      label: 'Documents / Budget',
      status: `${documents ? `${documents.APPROVED} of ${documents.total} documents ready` : 'No documents listed'} · ${budgetCategories} budget ${budgetCategories === 1 ? 'area' : 'areas'} entered.`,
    },
    {
      icon: Home,
      label: 'Housing',
      status: hasBudgetCategory(plan, 'housing') ? 'Monthly estimate added.' : 'Add a housing estimate.',
    },
    {
      icon: HeartPulse,
      label: 'Healthcare',
      status: hasBudgetCategory(plan, 'healthcare') ? 'Monthly estimate added.' : 'Add coverage research or an estimate.',
    },
    {
      icon: School,
      label: 'Schools',
      status: dependents && dependents > 0
        ? schoolTask
          ? schoolTask.done ? 'School planning task complete.' : 'School planning task in progress.'
          : 'Add school research to your checklist.'
        : 'Not indicated for your current household.',
    },
  ]

  return (
    <aside className="space-y-4">
      <section className="card-surface p-5" aria-labelledby="deadlines-heading">
        <div className="flex items-center gap-2">
          <CalendarClock size={17} className="text-gold-deep" aria-hidden="true" />
          <h2 id="deadlines-heading" className="text-base font-bold text-navy">Deadlines &amp; Blockers</h2>
        </div>
        <div className="mt-4 divide-y divide-line">
          {blockers.length ? blockers.map((item) => (
            <div key={`${item.title}-${item.due}`} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <AlertTriangle size={15} className="mt-0.5 shrink-0 text-muted" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-navy">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted">{item.due}</p>
              </div>
              <span className={`shrink-0 text-[10px] font-bold uppercase ${TAG_STYLE[item.tag]}`}>{item.tag}</span>
            </div>
          )) : (
            <p className="text-sm text-muted">No open deadlines or blockers.</p>
          )}
        </div>
      </section>

      <section className="card-surface p-5" aria-labelledby="planning-progress-heading">
        <h2 id="planning-progress-heading" className="text-base font-bold text-navy">Progress by planning area</h2>
        <div className="mt-3 divide-y divide-line">
          {progress.map(({ icon: Icon, label, status }) => (
            <div key={label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <span className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-field)] bg-canvas text-navy" aria-hidden="true">
                <Icon size={14} />
              </span>
              <div>
                <p className="text-sm font-bold text-navy">{label}</p>
                <p className="mt-0.5 text-xs leading-5 text-muted">{status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}
