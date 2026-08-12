/**
 * Dashboard layout preferences.
 *
 * Account → Dashboard is the canonical place to arrange the Dashboard. Users
 * can show/hide panels, drag panels between the primary and secondary columns,
 * or apply an optimized template. The Journey tracker participates in this
 * layout contract while preserving the default header-dropdown presentation.
 */

export type WidgetId =
  | 'nextAction'
  | 'planningAreas'
  | 'deadlines'
  | 'destinations'
  | 'activePathway'
  | 'askKolmari'
  | 'shortlist'
  | 'foodHealth'
  | 'commandCenter'
  | 'journeyTracker'

export type DashboardZone = 'main' | 'side'
export type JourneyPlacement = 'header' | 'panel'
export type DashboardTemplateId = 'focused' | 'balanced' | 'research' | 'execution' | 'custom'

export type WidgetDef = {
  id: WidgetId
  label: string
  description: string
  defaultOn: boolean
  full: boolean
}

export const DASHBOARD_WIDGETS: WidgetDef[] = [
  { id: 'nextAction', label: 'Recommended next action', description: 'The single most important thing to do next, with its deadline.', defaultOn: true, full: true },
  { id: 'planningAreas', label: 'Progress by planning area', description: 'Coverage across eligibility, documents, budget, housing, healthcare, and schools.', defaultOn: true, full: false },
  { id: 'deadlines', label: 'Deadlines and blockers', description: 'Dated items from your plan, blockers first.', defaultOn: true, full: false },
  { id: 'destinations', label: 'Destinations', description: 'Your top matched destinations with a visa-options preview for the #1 match.', defaultOn: true, full: true },
  { id: 'activePathway', label: 'Active pathway', description: 'The visa or residency route saved to your Kolmari Plan.', defaultOn: true, full: false },
  { id: 'askKolmari', label: 'Ask Kolmari', description: 'Ask a relocation question and get a researched answer.', defaultOn: false, full: true },
  { id: 'shortlist', label: 'Your shortlist', description: 'Destination cards with imagery, Match Score, and key signals.', defaultOn: false, full: true },
  { id: 'foodHealth', label: 'Food & health fit', description: 'Cuisine archetypes and allergen prevalence for your destination.', defaultOn: false, full: true },
  { id: 'commandCenter', label: 'Command Center summary', description: 'Research progress across the destinations you are comparing.', defaultOn: false, full: true },
  { id: 'journeyTracker', label: 'Journey progress tracker', description: 'Your eight-stage move journey, task progress, blockers, and My Plan shortcut.', defaultOn: true, full: false },
]

const BY_ID = new Map(DASHBOARD_WIDGETS.map((widget) => [widget.id, widget]))
export const DEFAULT_DISABLED: WidgetId[] = DASHBOARD_WIDGETS.filter((widget) => !widget.defaultOn).map((widget) => widget.id)

export type DashboardLayout = {
  v: 2
  template: DashboardTemplateId
  main: WidgetId[]
  side: WidgetId[]
  disabled: WidgetId[]
  journeyPlacement: JourneyPlacement
}

export type DashboardTemplate = {
  id: Exclude<DashboardTemplateId, 'custom'>
  label: string
  description: string
  layout: Omit<DashboardLayout, 'template'>
}

const BASE_MAIN: WidgetId[] = ['nextAction', 'destinations', 'askKolmari', 'shortlist', 'foodHealth', 'commandCenter']
const BASE_SIDE: WidgetId[] = ['planningAreas', 'activePathway', 'deadlines', 'journeyTracker']

export const DASHBOARD_TEMPLATES: DashboardTemplate[] = [
  {
    id: 'focused',
    label: 'Focused move plan',
    description: 'Destinations and the next action stay primary; planning progress, pathway, and blockers form the second column.',
    layout: { v: 2, main: BASE_MAIN, side: BASE_SIDE, disabled: DEFAULT_DISABLED, journeyPlacement: 'header' },
  },
  {
    id: 'balanced',
    label: 'Balanced overview',
    description: 'A broad planning view with destinations and execution panels split across two columns.',
    layout: {
      v: 2,
      main: ['nextAction', 'destinations', 'planningAreas', 'shortlist', 'commandCenter'],
      side: ['activePathway', 'deadlines', 'journeyTracker', 'foodHealth', 'askKolmari'],
      disabled: [],
      journeyPlacement: 'panel',
    },
  },
  {
    id: 'research',
    label: 'Research mode',
    description: 'Prioritizes matched countries, comparison, food/health fit, and research while keeping planning status nearby.',
    layout: {
      v: 2,
      main: ['destinations', 'shortlist', 'commandCenter', 'foodHealth', 'askKolmari'],
      side: ['planningAreas', 'activePathway', 'deadlines', 'journeyTracker', 'nextAction'],
      disabled: [],
      journeyPlacement: 'header',
    },
  },
  {
    id: 'execution',
    label: 'Execution mode',
    description: 'Puts the move plan, blockers, pathway, and Journey tracker up front after you have chosen a destination.',
    layout: {
      v: 2,
      main: ['nextAction', 'planningAreas', 'journeyTracker', 'deadlines', 'activePathway'],
      side: ['destinations', 'commandCenter', 'shortlist', 'foodHealth', 'askKolmari'],
      disabled: [],
      journeyPlacement: 'panel',
    },
  },
]

export const DEFAULT_LAYOUT: DashboardLayout = {
  ...DASHBOARD_TEMPLATES[0].layout,
  template: 'focused',
}

export function isWidgetId(value: unknown): value is WidgetId {
  return typeof value === 'string' && BY_ID.has(value as WidgetId)
}

export function widgetDef(id: WidgetId): WidgetDef {
  const def = BY_ID.get(id)
  if (!def) throw new Error(`Unknown dashboard widget: ${id}`)
  return def
}

function uniqueWidgets(value: unknown): WidgetId[] {
  if (!Array.isArray(value)) return []
  const result: WidgetId[] = []
  for (const id of value) {
    if (isWidgetId(id) && !result.includes(id)) result.push(id)
  }
  return result
}

function completeZones(mainInput: unknown, sideInput: unknown): { main: WidgetId[]; side: WidgetId[] } {
  const main = uniqueWidgets(mainInput)
  const side = uniqueWidgets(sideInput).filter((id) => !main.includes(id))
  for (const id of DASHBOARD_WIDGETS.map((widget) => widget.id)) {
    if (!main.includes(id) && !side.includes(id)) {
      if (BASE_SIDE.includes(id)) side.push(id)
      else main.push(id)
    }
  }
  return { main, side }
}

export function parseLayout(value: unknown): DashboardLayout {
  if (!value || typeof value !== 'object') return DEFAULT_LAYOUT
  const raw = value as Record<string, unknown>

  // Backward-compatible migration from the v1 order/disabled contract.
  if (raw.v !== 2) {
    const order = uniqueWidgets(raw.order)
    const legacy = order.length ? order : [...BASE_MAIN, ...BASE_SIDE.filter((id) => id !== 'journeyTracker')]
    const main = legacy.filter((id) => !BASE_SIDE.includes(id))
    const side = legacy.filter((id) => BASE_SIDE.includes(id))
    if (!side.includes('journeyTracker')) side.push('journeyTracker')
    return {
      v: 2,
      template: 'custom',
      main,
      side,
      disabled: uniqueWidgets(raw.disabled).length ? uniqueWidgets(raw.disabled) : DEFAULT_DISABLED,
      journeyPlacement: 'header',
    }
  }

  const zones = completeZones(raw.main, raw.side)
  const disabled = uniqueWidgets(raw.disabled)
  const journeyPlacement: JourneyPlacement = raw.journeyPlacement === 'panel' ? 'panel' : 'header'
  const template = ['focused', 'balanced', 'research', 'execution', 'custom'].includes(String(raw.template))
    ? raw.template as DashboardTemplateId
    : 'custom'

  return { v: 2, template, ...zones, disabled, journeyPlacement }
}

export function visibleWidgets(layout: DashboardLayout, zone?: DashboardZone): WidgetId[] {
  const off = new Set(layout.disabled)
  const filter = (ids: WidgetId[]) => ids.filter((id) => !off.has(id) && !(id === 'journeyTracker' && layout.journeyPlacement === 'header'))
  if (zone === 'main') return filter(layout.main)
  if (zone === 'side') return filter(layout.side)
  return [...filter(layout.main), ...filter(layout.side)]
}

export function isDefaultLayout(layout: DashboardLayout): boolean {
  return JSON.stringify(layout) === JSON.stringify(DEFAULT_LAYOUT)
}

export function layoutFromTemplate(id: Exclude<DashboardTemplateId, 'custom'>): DashboardLayout {
  const template = DASHBOARD_TEMPLATES.find((item) => item.id === id) ?? DASHBOARD_TEMPLATES[0]
  return {
    ...template.layout,
    main: [...template.layout.main],
    side: [...template.layout.side],
    disabled: [...template.layout.disabled],
    template: template.id,
  }
}
