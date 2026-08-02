// Plan data model + pure derivations. No server-only / db imports here so both
// the server (kolmari-plan.ts) and client components can share it.
//
// Phase 1 of the My Plan overhaul: budget is now a line-item model (one-time vs
// monthly, system baseline vs user override), documents use the MISSING→APPROVED
// status pipeline with an expiration date, and checklist items carry an
// isSystemTemplate flag. Legacy rows (the old 5-key budget object, the old
// document statuses, plain strings) are coerced on read by the normalize*
// functions, so existing saved plans keep working.

export const PLAN_STAGES = ['Explore', 'Assess', 'Shortlist', 'Decide', 'Prepare', 'Apply', 'Move', 'Settle In'] as const
export type PlanStage = (typeof PLAN_STAGES)[number]
export type JourneyStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

// Tab identifiers live here (a server-safe module) so the server page can read
// ?tab= without importing from a 'use client' module — doing that turns the
// value into a client reference and crashes the page at request time.
export const PLAN_TABS = ['overview', 'checklist', 'documents', 'budget', 'notes'] as const
export type TabId = (typeof PLAN_TABS)[number]

// Lifestyle tier chooses which baseline cost band to load for a destination.
export const LIFESTYLE_TIERS = ['Budget', 'Standard', 'Premium'] as const
export type LifestyleTier = (typeof LIFESTYLE_TIERS)[number]

// --- Documents ---
export type DocStatus = 'MISSING' | 'UPLOADED' | 'TRANSLATED' | 'APOSTILLED' | 'APPROVED'
export const DOC_STATUS_LABELS: Record<DocStatus, string> = {
  MISSING: 'Missing',
  UPLOADED: 'Uploaded',
  TRANSLATED: 'Translated',
  APOSTILLED: 'Apostilled',
  APPROVED: 'Approved',
}
export const DOC_STATUS_ORDER: DocStatus[] = ['MISSING', 'UPLOADED', 'TRANSLATED', 'APOSTILLED', 'APPROVED']
const DOC_STATUS_STEP: Record<DocStatus, number> = { MISSING: 0, UPLOADED: 1, TRANSLATED: 2, APOSTILLED: 3, APPROVED: 4 }

export const DOC_STEPS = ['Collect', 'Apostille', 'Translate', 'Compile', 'Submit'] as const
export type DocStep = (typeof DOC_STEPS)[number]
export const DOC_STEP_HINTS: Record<DocStep, string> = {
  Collect: 'Originals', Apostille: 'Authenticate', Translate: 'Official', Compile: 'Package', Submit: 'Apply',
}

export type DocumentItem = { id: string; name: string; status: DocStatus; expirationDate: string | null; note: string | null }

// --- Checklist ---
export type ChecklistItem = { id: string; text: string; done: boolean; stage: PlanStage | null; due: string | null; isSystemTemplate: boolean }

// Generic starter tasks true for any international move (no fabricated
// country-specific procedures). Auto-injected when a destination is set and the
// checklist is empty; marked isSystemTemplate so they read as suggestions.
export const CHECKLIST_TEMPLATE: { text: string; stage: PlanStage }[] = [
  { text: 'Compare your shortlisted destinations', stage: 'Explore' },
  { text: 'Research cost of living for your budget', stage: 'Explore' },
  { text: 'Verify official pathway requirements', stage: 'Assess' },
  { text: 'Confirm passport validity for the whole household', stage: 'Assess' },
  { text: 'Compare neighborhoods and housing areas', stage: 'Shortlist' },
  { text: 'Choose your destination and pathway', stage: 'Decide' },
  { text: 'Build your required document list', stage: 'Prepare' },
  { text: 'Review healthcare coverage options', stage: 'Prepare' },
  { text: 'Draft your move budget', stage: 'Prepare' },
  { text: 'Schedule your visa application appointment', stage: 'Apply' },
  { text: 'Book flights and shipping', stage: 'Move' },
  { text: 'Register your local address', stage: 'Settle In' },
  { text: 'Open a local bank account', stage: 'Settle In' },
  { text: 'Register for a local tax number', stage: 'Settle In' },
]

// --- Budget (line-item model) ---
export type BudgetStage = 'ONE_TIME' | 'MONTHLY_RECURRING'
export type BudgetLine = {
  id: string
  category: string
  label: string
  chronologicalStage: BudgetStage
  systemBaseline: number | null
  userOverride: number | null
  isCustom: boolean
}

const BUDGET_TEMPLATE: { category: string; label: string; chronologicalStage: BudgetStage }[] = [
  { category: 'housing', label: 'Housing', chronologicalStage: 'MONTHLY_RECURRING' },
  { category: 'food', label: 'Food', chronologicalStage: 'MONTHLY_RECURRING' },
  { category: 'transport', label: 'Transportation', chronologicalStage: 'MONTHLY_RECURRING' },
  { category: 'healthcare', label: 'Healthcare', chronologicalStage: 'MONTHLY_RECURRING' },
  { category: 'other', label: 'Other', chronologicalStage: 'MONTHLY_RECURRING' },
  { category: 'visa', label: 'Visa & legal fees', chronologicalStage: 'ONE_TIME' },
  { category: 'flights', label: 'Flights & travel', chronologicalStage: 'ONE_TIME' },
  { category: 'deposits', label: 'Housing deposits', chronologicalStage: 'ONE_TIME' },
  { category: 'logistics', label: 'Shipping & logistics', chronologicalStage: 'ONE_TIME' },
]

/** Baseline template of budget lines with empty values (no fabricated baselines). */
export function defaultBudget(): BudgetLine[] {
  return BUDGET_TEMPLATE.map((t) => ({
    id: t.category, category: t.category, label: t.label,
    chronologicalStage: t.chronologicalStage, systemBaseline: null, userOverride: null, isCustom: false,
  }))
}

export type NexitPlan = {
  user_id: number
  saved_nextination: string | null
  destination_city: string | null
  selected_pathway: string | null
  target_move_date: string | null
  household_members: number | null
  // Canonical persisted journey position shared by Dashboard and My Plan.
  journey_stage: JourneyStage
  // Compatibility label kept in the API/database while older clients migrate.
  timeline_stage: PlanStage
  checklist: ChecklistItem[]
  budget: BudgetLine[]
  documents: DocumentItem[]
  notes: string | null
  updated_at: string | null
}

export function emptyNexitPlan(userId: number): NexitPlan {
  return {
    user_id: userId, saved_nextination: null, destination_city: null, selected_pathway: null,
    target_move_date: null, household_members: null, journey_stage: 1, timeline_stage: 'Explore',
    checklist: [], budget: defaultBudget(), documents: [], notes: null, updated_at: null,
  }
}

export function newId(prefix = 'i'): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${prefix}-${Math.floor(Math.random() * 1e9).toString(36)}`
}

// --- Normalization: accept legacy strings / objects and the structured shape ---

function isStage(value: unknown): value is PlanStage {
  return typeof value === 'string' && (PLAN_STAGES as readonly string[]).includes(value)
}

const LEGACY_STAGE_VALUE: Record<string, JourneyStage> = {
  Explore: 1, Assess: 2, Shortlist: 3, Decide: 4, Prepare: 5, Apply: 6, Move: 7, Settle: 8, 'Settle In': 8,
}

export function normalizeJourneyStage(value: unknown, legacyLabel?: unknown): JourneyStage {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 8) return value as JourneyStage
  if (typeof legacyLabel === 'string' && legacyLabel in LEGACY_STAGE_VALUE) return LEGACY_STAGE_VALUE[legacyLabel]
  return 1
}

export function journeyStageLabel(value: JourneyStage): PlanStage {
  return PLAN_STAGES[value - 1]
}

export function normalizeChecklist(value: unknown): ChecklistItem[] {
  if (!Array.isArray(value)) return []
  return value.map((raw, index): ChecklistItem => {
    if (typeof raw === 'string') return { id: `c-${index}`, text: raw, done: false, stage: null, due: null, isSystemTemplate: false }
    const r = (raw ?? {}) as Partial<ChecklistItem>
    return {
      id: typeof r.id === 'string' ? r.id : `c-${index}`,
      text: typeof r.text === 'string' ? r.text : '',
      done: r.done === true,
      stage: isStage(r.stage) ? r.stage : null,
      due: typeof r.due === 'string' && r.due ? r.due : null,
      isSystemTemplate: r.isSystemTemplate === true,
    }
  }).filter((item) => item.text.trim().length > 0)
}

// Map the previous 4-state document statuses onto the new pipeline.
const LEGACY_DOC_STATUS: Record<string, DocStatus> = {
  not_started: 'MISSING', in_progress: 'UPLOADED', needs_review: 'UPLOADED', ready: 'APPROVED',
}
function isDocStatus(value: unknown): value is DocStatus {
  return typeof value === 'string' && DOC_STATUS_ORDER.includes(value as DocStatus)
}

export function normalizeDocuments(value: unknown): DocumentItem[] {
  if (!Array.isArray(value)) return []
  return value.map((raw, index): DocumentItem => {
    if (typeof raw === 'string') return { id: `d-${index}`, name: raw, status: 'MISSING', expirationDate: null, note: null }
    const r = (raw ?? {}) as Partial<DocumentItem> & { due?: unknown; apostille?: unknown; translate?: unknown }
    const status = isDocStatus(r.status)
      ? r.status
      : (typeof r.status === 'string' && r.status in LEGACY_DOC_STATUS ? LEGACY_DOC_STATUS[r.status] : 'MISSING')
    const expirationDate =
      typeof r.expirationDate === 'string' && r.expirationDate ? r.expirationDate
        : typeof r.due === 'string' && r.due ? r.due
          : null
    return {
      id: typeof r.id === 'string' ? r.id : `d-${index}`,
      name: typeof r.name === 'string' ? r.name : '',
      status,
      expirationDate,
      note: typeof r.note === 'string' && r.note ? r.note : null,
    }
  }).filter((item) => item.name.trim().length > 0)
}

function coerceBudgetLine(raw: unknown, index: number): BudgetLine | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Partial<BudgetLine>
  if (typeof r.category !== 'string' || !r.category) return null
  const stage: BudgetStage = r.chronologicalStage === 'ONE_TIME' ? 'ONE_TIME' : 'MONTHLY_RECURRING'
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null)
  return {
    id: typeof r.id === 'string' && r.id ? r.id : `b-${index}`,
    category: r.category,
    label: typeof r.label === 'string' && r.label ? r.label : r.category,
    chronologicalStage: stage,
    systemBaseline: num(r.systemBaseline),
    userOverride: num(r.userOverride),
    isCustom: r.isCustom === true,
  }
}

export function normalizeBudget(value: unknown): BudgetLine[] {
  if (Array.isArray(value)) {
    const lines = value.map((raw, i) => coerceBudgetLine(raw, i)).filter((l): l is BudgetLine => l !== null)
    return lines.length ? lines : defaultBudget()
  }
  // Legacy 5-key object → monthly lines carrying old values as user overrides.
  if (value && typeof value === 'object') {
    const legacy = value as Record<string, unknown>
    return defaultBudget().map((line) => {
      const v = legacy[line.category]
      return typeof v === 'number' && Number.isFinite(v) ? { ...line, userOverride: v, isCustom: true } : line
    })
  }
  return defaultBudget()
}

export function normalizePlan(row: NexitPlan): NexitPlan {
  const base = emptyNexitPlan(row.user_id)
  const journeyStage = normalizeJourneyStage(row.journey_stage, row.timeline_stage)
  return {
    ...base,
    ...row,
    destination_city: typeof row.destination_city === 'string' && row.destination_city ? row.destination_city : null,
    journey_stage: journeyStage,
    timeline_stage: journeyStageLabel(journeyStage),
    checklist: normalizeChecklist(row.checklist),
    documents: normalizeDocuments(row.documents),
    budget: normalizeBudget(row.budget),
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
    plan.budget.some((line) => budgetEffective(line) !== null),
    plan.documents.length > 0,
  ]
}

// --- Budget derivations ---
export function budgetEffective(line: BudgetLine): number | null {
  return line.userOverride ?? line.systemBaseline
}
export function budgetStageTotal(plan: NexitPlan, stage: BudgetStage): number | null {
  const vals = plan.budget.filter((l) => l.chronologicalStage === stage).map(budgetEffective).filter((v): v is number => v !== null)
  return vals.length ? vals.reduce((a, b) => a + b, 0) : null
}
export function budgetTotal(plan: NexitPlan): number | null {
  const vals = plan.budget.map(budgetEffective).filter((v): v is number => v !== null)
  return vals.length ? vals.reduce((a, b) => a + b, 0) : null
}
export function upfrontTotal(plan: NexitPlan): number | null { return budgetStageTotal(plan, 'ONE_TIME') }
export function monthlyTotal(plan: NexitPlan): number | null { return budgetStageTotal(plan, 'MONTHLY_RECURRING') }
export function budgetEnteredCount(plan: NexitPlan): number {
  return plan.budget.filter((l) => budgetEffective(l) !== null).length
}
export function budgetCustomizedCount(plan: NexitPlan): number {
  return plan.budget.filter((l) => l.isCustom).length
}

// --- Document derivations ---
export type DocCounts = { MISSING: number; UPLOADED: number; TRANSLATED: number; APOSTILLED: number; APPROVED: number; total: number }
export function docCounts(plan: NexitPlan): DocCounts {
  const counts: DocCounts = { MISSING: 0, UPLOADED: 0, TRANSLATED: 0, APOSTILLED: 0, APPROVED: 0, total: plan.documents.length }
  for (const doc of plan.documents) counts[doc.status] += 1
  return counts
}
/** Percent of documents that are past MISSING (any progress made). */
export function docProgress(plan: NexitPlan): number | null {
  if (!plan.documents.length) return null
  const c = docCounts(plan)
  return Math.round(((c.total - c.MISSING) / c.total) * 100)
}
export function docReadyCount(plan: NexitPlan): number {
  return plan.documents.filter((d) => d.status === 'APPROVED').length
}

/** Current step in the Collect → Apostille → Translate → Compile → Submit workflow (least-advanced document). */
export function documentStep(plan: NexitPlan): { index: number; name: DocStep } | null {
  const docs = plan.documents
  if (!docs.length) return null
  const index = Math.min(...docs.map((d) => DOC_STATUS_STEP[d.status]))
  return { index, name: DOC_STEPS[index] }
}

export type Deadline = { label: string; date: string; kind: 'document' | 'task' }
export function upcomingDeadlines(plan: NexitPlan): Deadline[] {
  const items: Deadline[] = []
  for (const d of plan.documents) if (d.expirationDate && d.status !== 'APPROVED') items.push({ label: d.name, date: d.expirationDate, kind: 'document' })
  for (const c of plan.checklist) if (c.due && !c.done) items.push({ label: c.text, date: c.due, kind: 'task' })
  return items.sort((a, b) => a.date.localeCompare(b.date))
}

export type ProcessingBuckets = { apostille: number; translation: number }
export function processingBuckets(plan: NexitPlan): ProcessingBuckets {
  return {
    apostille: plan.documents.filter((d) => d.status === 'UPLOADED').length,
    translation: plan.documents.filter((d) => d.status === 'TRANSLATED').length,
  }
}

// --- Journey tracker derivations (Dashboard progress drawer) ---
//
// Every value below is derived from persisted plan data: the saved journey
// stage and the user's own checklist items. Nothing is invented — a stage with
// no saved tasks reports that it has none rather than showing filler.

export type JourneyTaskStatus = 'done' | 'blocked' | 'todo'
export type JourneyTask = { id: string; text: string; status: JourneyTaskStatus; tag: string | null }
export type JourneyStageState = 'done' | 'current' | 'upcoming'
export type JourneyStageRow = {
  stage: PlanStage
  /** 1-based position in PLAN_STAGES. */
  index: number
  state: JourneyStageState
  meta: string
  tasks: JourneyTask[]
  doneCount: number
  blockerCount: number
}

function stageMeta(state: JourneyStageState, total: number, done: number, blockers: number): string {
  if (total === 0) {
    if (state === 'done') return 'Complete'
    return state === 'current' ? 'In progress' : 'No tasks yet'
  }
  if (done === total) return 'Complete'
  const blockerSuffix = blockers > 0 ? ` · ${blockers} blocker${blockers === 1 ? '' : 's'}` : ''
  if (state === 'upcoming') return `${total} task${total === 1 ? '' : 's'}${blockerSuffix}`
  return `${done} of ${total}${blockerSuffix}`
}

/**
 * One row per plan stage, with the saved checklist items that belong to it.
 * A task counts as blocked only when it carries a real due date that has
 * already passed. `today` is supplied by the caller so the server renders the
 * same result the client hydrates.
 */
export function journeyStages(plan: NexitPlan | null, today: Date): JourneyStageRow[] {
  const current = plan?.journey_stage ?? 1
  return PLAN_STAGES.map((stage, i) => {
    const index = i + 1
    const state: JourneyStageState = index < current ? 'done' : index === current ? 'current' : 'upcoming'
    const tasks: JourneyTask[] = (plan?.checklist ?? [])
      .filter((item) => item.stage === stage)
      .map((item) => {
        const overdue = !item.done && item.due !== null && (daysUntil(item.due, today) ?? 0) < 0
        return {
          id: item.id,
          text: item.text,
          status: item.done ? 'done' : overdue ? 'blocked' : 'todo',
          tag: overdue ? 'Blocker' : null,
        }
      })
    const doneCount = tasks.filter((task) => task.status === 'done').length
    const blockerCount = tasks.filter((task) => task.status === 'blocked').length
    return { stage, index, state, tasks, doneCount, blockerCount, meta: stageMeta(state, tasks.length, doneCount, blockerCount) }
  })
}

/**
 * Journey completion as a percentage: fully-passed stages plus the share of the
 * current stage's saved tasks that are done. A current stage with no saved
 * tasks contributes nothing rather than assuming partial credit.
 */
export function journeyPercent(rows: JourneyStageRow[], currentStage: JourneyStage): number {
  const currentRow = rows[currentStage - 1]
  const fraction = currentRow && currentRow.tasks.length > 0 ? currentRow.doneCount / currentRow.tasks.length : 0
  return Math.round(((currentStage - 1 + fraction) / PLAN_STAGES.length) * 100)
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
      detail: 'This is the nearest deadline on your plan.',
      dueDate: top.date,
      tab: top.kind === 'document' ? 'documents' : 'checklist',
      caughtUp: false,
    }
  }
  const inProgress = plan.documents.find((d) => d.status === 'UPLOADED' || d.status === 'TRANSLATED' || d.status === 'APOSTILLED')
  if (inProgress) return { title: `Finish “${inProgress.name}”`, detail: 'A document is in progress — move it to approved.', dueDate: null, tab: 'documents', caughtUp: false }
  const missing = plan.documents.find((d) => d.status === 'MISSING')
  if (missing) return { title: `Start “${missing.name}”`, detail: 'This document has not been started yet.', dueDate: null, tab: 'documents', caughtUp: false }
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

/** Days between today (UTC) and an ISO date; negative if past. For the Phase 5 expiration engine. */
export function daysUntil(iso: string | null, today: Date): number | null {
  if (!iso) return null
  const p = parts(iso)
  if (!p) return null
  const target = Date.UTC(p[0], p[1] - 1, p[2])
  const now = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  return Math.round((target - now) / 86_400_000)
}
