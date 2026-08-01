// Plan data model + pure derivations. No server-only / db imports here so both
// the server (kolmari-plan.ts) and client components can share it.
//
// Checklist items and documents were originally plain `string[]`. They are now
// structured records so completion, due dates, and document status/apostille/
// translation are REAL user-owned data — every count, %, deadline, and step on
// the My Plan workspace is derived from these, never hardcoded. Legacy string
// rows are coerced on read (see normalize*), so existing saved plans keep working.

export const PLAN_STAGES = ['Explore', 'Decide', 'Prepare', 'Apply', 'Move', 'Settle'] as const
export type PlanStage = (typeof PLAN_STAGES)[number]

export type DocStatus = 'not_started' | 'in_progress' | 'needs_review' | 'ready'
export const DOC_STATUS_LABELS: Record<DocStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  needs_review: 'Needs review',
  ready: 'Ready',
}
export const DOC_STATUS_ORDER: DocStatus[] = ['not_started', 'in_progress', 'needs_review', 'ready']

export const DOC_STEPS = ['Collect', 'Apostille', 'Translate', 'Compile', 'Submit'] as const
export type DocStep = (typeof DOC_STEPS)[number]
export const DOC_STEP_HINTS: Record<DocStep, string> = {
  Collect: 'Originals', Apostille: 'Authenticate', Translate: 'Official', Compile: 'Package', Submit: 'Apply',
}

export type ChecklistItem = { id: string; text: string; done: boolean; stage: PlanStage | null; due: string | null }
export type DocumentItem = { id: string; name: string; status: DocStatus; apostille: boolean; translate: boolean; due: string | null; note: string | null }

export type PlanBudget = { housing: number | null; food: number | null; transport: number | null; healthcare: number | null; other: number | null }
export const BUDGET_KEYS = ['housing', 'food', 'transport', 'healthcare', 'other'] as const
export type BudgetKey = (typeof BUDGET_KEYS)[number]
export const BUDGET_META: Record<BudgetKey, { label: string; hint: string }> = {
  housing: { label: 'Housing', hint: 'Rent, utilities, and recurring housing costs' },
  food: { label: 'Food', hint: 'Groceries, household supplies, and dining' },
  transport: { label: 'Transportation', hint: 'Transit, fuel, rides, or vehicle costs' },
  healthcare: { label: 'Healthcare', hint: 'Insurance, medication, and routine care' },
  other: { label: 'Other', hint: 'Phone, subscriptions, and flexible expenses' },
}

export type NexitPlan = {
  user_id: number
  saved_nextination: string | null
  selected_pathway: string | null
  target_move_date: string | null
  household_members: number | null
  timeline_stage: PlanStage
  checklist: ChecklistItem[]
  budget: PlanBudget
  documents: DocumentItem[]
  notes: string | null
  updated_at: string | null
}

export function emptyBudget(): PlanBudget {
  return { housing: null, food: null, transport: null, healthcare: null, other: null }
}

export function emptyNexitPlan(userId: number): NexitPlan {
  return {
    user_id: userId, saved_nextination: null, selected_pathway: null, target_move_date: null,
    household_members: null, timeline_stage: 'Explore', checklist: [], budget: emptyBudget(),
    documents: [], notes: null, updated_at: null,
  }
}

export function newId(prefix = 'i'): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${prefix}-${Math.floor(Math.random() * 1e9).toString(36)}`
}

// --- Normalization: accept both legacy strings and the structured shape ---

function isStage(value: unknown): value is PlanStage {
  return typeof value === 'string' && (PLAN_STAGES as readonly string[]).includes(value)
}
function isStatus(value: unknown): value is DocStatus {
  return typeof value === 'string' && DOC_STATUS_ORDER.includes(value as DocStatus)
}

export function normalizeChecklist(value: unknown): ChecklistItem[] {
  if (!Array.isArray(value)) return []
  return value.map((raw, index): ChecklistItem => {
    if (typeof raw === 'string') return { id: `c-${index}`, text: raw, done: false, stage: null, due: null }
    const r = (raw ?? {}) as Partial<ChecklistItem>
    return {
      id: typeof r.id === 'string' ? r.id : `c-${index}`,
      text: typeof r.text === 'string' ? r.text : '',
      done: r.done === true,
      stage: isStage(r.stage) ? r.stage : null,
      due: typeof r.due === 'string' && r.due ? r.due : null,
    }
  }).filter((item) => item.text.trim().length > 0)
}

export function normalizeDocuments(value: unknown): DocumentItem[] {
  if (!Array.isArray(value)) return []
  return value.map((raw, index): DocumentItem => {
    if (typeof raw === 'string') return { id: `d-${index}`, name: raw, status: 'not_started', apostille: false, translate: false, due: null, note: null }
    const r = (raw ?? {}) as Partial<DocumentItem>
    return {
      id: typeof r.id === 'string' ? r.id : `d-${index}`,
      name: typeof r.name === 'string' ? r.name : '',
      status: isStatus(r.status) ? r.status : 'not_started',
      apostille: r.apostille === true,
      translate: r.translate === true,
      due: typeof r.due === 'string' && r.due ? r.due : null,
      note: typeof r.note === 'string' && r.note ? r.note : null,
    }
  }).filter((item) => item.name.trim().length > 0)
}

export function normalizePlan(row: NexitPlan): NexitPlan {
  const base = emptyNexitPlan(row.user_id)
  const budget = typeof row.budget === 'object' && row.budget ? row.budget : base.budget
  return {
    ...base,
    ...row,
    timeline_stage: isStage(row.timeline_stage) ? row.timeline_stage : 'Explore',
    checklist: normalizeChecklist(row.checklist),
    documents: normalizeDocuments(row.documents),
    budget: { ...base.budget, ...budget },
  }
}

// --- Derived metrics (pure, real-data only) ---

export const READINESS_LABELS = ['Destination chosen', 'Pathway selected', 'Target date set', 'Checklist started', 'Budget entered', 'Documents listed'] as const

export function readinessChecks(plan: NexitPlan): boolean[] {
  return [
    Boolean(plan.saved_nextination),
    Boolean(plan.selected_pathway),
    Boolean(plan.target_move_date),
    plan.checklist.length > 0,
    Object.values(plan.budget).some((value) => value !== null),
    plan.documents.length > 0,
  ]
}

export function budgetTotal(plan: NexitPlan): number | null {
  const entered = Object.values(plan.budget).filter((v): v is number => v !== null)
  return entered.length ? entered.reduce((a, b) => a + b, 0) : null
}
export function budgetEnteredCount(plan: NexitPlan): number {
  return Object.values(plan.budget).filter((v) => v !== null).length
}

export type DocCounts = { ready: number; in_progress: number; needs_review: number; not_started: number; total: number }
export function docCounts(plan: NexitPlan): DocCounts {
  const counts: DocCounts = { ready: 0, in_progress: 0, needs_review: 0, not_started: 0, total: plan.documents.length }
  for (const doc of plan.documents) counts[doc.status] += 1
  return counts
}
/** Percent of documents that are ready or actively in progress (needs_review counts as progressing). */
export function docProgress(plan: NexitPlan): number | null {
  if (!plan.documents.length) return null
  const c = docCounts(plan)
  return Math.round(((c.ready + c.in_progress + c.needs_review) / c.total) * 100)
}

/** Current step in the Collect → Apostille → Translate → Compile → Submit workflow, derived from real statuses. */
export function documentStep(plan: NexitPlan): { index: number; name: DocStep } | null {
  const docs = plan.documents
  if (!docs.length) return null
  if (docs.some((d) => d.status === 'not_started')) return { index: 0, name: 'Collect' }
  if (docs.some((d) => d.apostille && d.status !== 'ready')) return { index: 1, name: 'Apostille' }
  if (docs.some((d) => d.translate && d.status !== 'ready')) return { index: 2, name: 'Translate' }
  if (docs.some((d) => d.status !== 'ready')) return { index: 3, name: 'Compile' }
  return { index: 4, name: 'Submit' }
}

export type Deadline = { label: string; date: string; kind: 'document' | 'task' }
export function upcomingDeadlines(plan: NexitPlan): Deadline[] {
  const items: Deadline[] = []
  for (const d of plan.documents) if (d.due && d.status !== 'ready') items.push({ label: d.name, date: d.due, kind: 'document' })
  for (const c of plan.checklist) if (c.due && !c.done) items.push({ label: c.text, date: c.due, kind: 'task' })
  return items.sort((a, b) => a.date.localeCompare(b.date))
}

export type ProcessingBuckets = { apostille: number; translation: number }
export function processingBuckets(plan: NexitPlan): ProcessingBuckets {
  return {
    apostille: plan.documents.filter((d) => d.apostille && d.status !== 'ready').length,
    translation: plan.documents.filter((d) => d.translate && d.status !== 'ready').length,
  }
}

export type NextAction = {
  title: string
  detail: string
  dueDate: string | null
  tab: 'overview' | 'checklist' | 'documents' | 'budget'
  caughtUp: boolean
}
export function nextBestAction(plan: NexitPlan): NextAction {
  const deadlines = upcomingDeadlines(plan)
  if (deadlines.length) {
    const top = deadlines[0]
    return {
      title: top.kind === 'document' ? `Move “${top.label}” forward` : `Complete “${top.label}”`,
      detail: `This is the nearest deadline on your plan.`,
      dueDate: top.date,
      tab: top.kind === 'document' ? 'documents' : 'checklist',
      caughtUp: false,
    }
  }
  const inProgress = plan.documents.find((d) => d.status === 'in_progress' || d.status === 'needs_review')
  if (inProgress) return { title: `Finish “${inProgress.name}”`, detail: 'A document is in progress — move it to ready.', dueDate: null, tab: 'documents', caughtUp: false }
  const notStarted = plan.documents.find((d) => d.status === 'not_started')
  if (notStarted) return { title: `Start “${notStarted.name}”`, detail: 'This document has not been started yet.', dueDate: null, tab: 'documents', caughtUp: false }
  const task = plan.checklist.find((c) => !c.done)
  if (task) return { title: `Do: ${task.text}`, detail: 'The next open task on your move checklist.', dueDate: task.due, tab: 'checklist', caughtUp: false }

  // Nothing tracked yet — point at the first unmet setup milestone.
  const checks = readinessChecks(plan)
  const setup: { title: string; detail: string; tab: NextAction['tab'] }[] = [
    { title: 'Choose your destination', detail: 'Pick where you are planning to move.', tab: 'overview' },
    { title: 'Select your pathway', detail: 'Choose the visa or residency route you are pursuing.', tab: 'overview' },
    { title: 'Set your target move date', detail: 'Give your plan a date to work back from.', tab: 'overview' },
    { title: 'Start your move checklist', detail: 'Add the first relocation task.', tab: 'checklist' },
    { title: 'Enter your move budget', detail: 'Add your own planning figures.', tab: 'budget' },
    { title: 'List your visa documents', detail: 'Add the documents your pathway needs.', tab: 'documents' },
  ]
  const firstUnmet = checks.findIndex((c) => !c)
  if (firstUnmet !== -1) return { ...setup[firstUnmet], dueDate: null, caughtUp: false }
  return { title: 'You’re caught up', detail: 'No open deadlines or tasks. Review your plan or advance your move stage.', dueDate: null, tab: 'overview', caughtUp: true }
}

// --- Formatting (currency-neutral: the app stores no currency) ---

export function formatAmount(value: number): string {
  return value.toLocaleString('en-US')
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/** Parse a 'YYYY-MM-DD' plan date without timezone drift. */
function parts(iso: string): [number, number, number] | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return null
  return [Number(m[1]), Number(m[2]), Number(m[3])]
}
export function formatShortDate(iso: string | null): string {
  if (!iso) return ''
  const p = parts(iso)
  return p ? `${MONTHS_SHORT[p[1] - 1]} ${p[2]}` : iso
}
export function formatMonthYear(iso: string | null): string {
  if (!iso) return ''
  const p = parts(iso)
  return p ? `${MONTHS_LONG[p[1] - 1]} ${p[0]}` : iso
}
