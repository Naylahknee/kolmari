/**
 * Dashboard layout preferences.
 *
 * The dashboard ships a default arrangement; each user can reorder it and turn
 * individual panels on or off from Account → Dashboard. This module is the
 * shared, client-safe contract: the widget registry, the stored shape, and the
 * resolver that turns a saved preference into a render order.
 *
 * Forward-compatible on purpose: a widget added to the registry later is not
 * present in an existing user's saved `order`, so the resolver splices it back in
 * at its default position rather than dropping it. Unknown ids in a saved layout
 * (a widget we removed) are ignored.
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

export type WidgetDef = {
  id: WidgetId
  label: string
  description: string
  /** Whether the panel is part of the out-of-the-box dashboard. */
  defaultOn: boolean
  /** Panels that span the full content column rather than sitting in the grid. */
  full: boolean
}

/** Registry, in default display order. */
export const DASHBOARD_WIDGETS: WidgetDef[] = [
  {
    id: 'nextAction',
    label: 'Recommended next action',
    description: 'The single most important thing to do next, with its deadline.',
    defaultOn: true,
    full: true,
  },
  {
    id: 'planningAreas',
    label: 'Progress by planning area',
    description: 'Coverage across eligibility, documents, budget, housing, healthcare, and schools.',
    defaultOn: true,
    full: true,
  },
  {
    id: 'deadlines',
    label: 'Deadlines and blockers',
    description: 'Dated items from your plan, blockers first.',
    defaultOn: true,
    full: false,
  },
  {
    id: 'destinations',
    label: 'Destinations',
    description: 'Your saved and matched destinations with their Match Scores.',
    defaultOn: true,
    full: false,
  },
  {
    id: 'activePathway',
    label: 'Active pathway',
    description: 'The visa or residency route saved to your Kolmari Plan.',
    defaultOn: true,
    full: false,
  },
  {
    id: 'askKolmari',
    label: 'Ask Kolmari',
    description: 'Ask a relocation question and get a researched answer.',
    defaultOn: false,
    full: true,
  },
  {
    id: 'shortlist',
    label: 'Your shortlist',
    description: 'Destination cards with imagery, Match Score, and key signals.',
    defaultOn: false,
    full: true,
  },
  {
    id: 'foodHealth',
    label: 'Food & health fit',
    description: 'Cuisine archetypes and allergen prevalence for your destination.',
    defaultOn: false,
    full: true,
  },
  {
    id: 'commandCenter',
    label: 'Command Center summary',
    description: 'Research progress across the destinations you are comparing.',
    defaultOn: false,
    full: true,
  },
]

const BY_ID = new Map(DASHBOARD_WIDGETS.map((w) => [w.id, w]))
export const DEFAULT_ORDER: WidgetId[] = DASHBOARD_WIDGETS.map((w) => w.id)
export const DEFAULT_DISABLED: WidgetId[] = DASHBOARD_WIDGETS.filter((w) => !w.defaultOn).map((w) => w.id)

export function isWidgetId(value: unknown): value is WidgetId {
  return typeof value === 'string' && BY_ID.has(value as WidgetId)
}
export function widgetDef(id: WidgetId): WidgetDef {
  const def = BY_ID.get(id)
  if (!def) throw new Error(`Unknown dashboard widget: ${id}`)
  return def
}

/** What we persist. Kept tiny and versioned. */
export type DashboardLayout = {
  v: 1
  order: WidgetId[]
  disabled: WidgetId[]
}

export const DEFAULT_LAYOUT: DashboardLayout = {
  v: 1,
  order: DEFAULT_ORDER,
  disabled: DEFAULT_DISABLED,
}

/**
 * Coerce untrusted stored/posted JSON into a valid layout. Never throws —
 * anything unrecognized falls back to the default arrangement.
 */
export function parseLayout(value: unknown): DashboardLayout {
  if (!value || typeof value !== 'object') return DEFAULT_LAYOUT
  const raw = value as Partial<DashboardLayout>

  const order: WidgetId[] = []
  if (Array.isArray(raw.order)) {
    for (const id of raw.order) {
      if (isWidgetId(id) && !order.includes(id)) order.push(id)
    }
  }
  // Splice any widget the saved layout predates back into its default slot, so
  // new panels appear for existing users instead of vanishing.
  for (const id of DEFAULT_ORDER) {
    if (!order.includes(id)) {
      const defaultIndex = DEFAULT_ORDER.indexOf(id)
      const insertAt = order.findIndex((existing) => DEFAULT_ORDER.indexOf(existing) > defaultIndex)
      if (insertAt === -1) order.push(id)
      else order.splice(insertAt, 0, id)
    }
  }

  const disabled: WidgetId[] = []
  if (Array.isArray(raw.disabled)) {
    for (const id of raw.disabled) {
      if (isWidgetId(id) && !disabled.includes(id)) disabled.push(id)
    }
  } else {
    // No saved disabled list at all — respect the shipped defaults.
    disabled.push(...DEFAULT_DISABLED)
  }

  return { v: 1, order, disabled }
}

/** The widgets to render, in order. */
export function visibleWidgets(layout: DashboardLayout): WidgetId[] {
  const off = new Set(layout.disabled)
  return layout.order.filter((id) => !off.has(id))
}

export function isDefaultLayout(layout: DashboardLayout): boolean {
  return (
    layout.order.join(',') === DEFAULT_ORDER.join(',') &&
    [...layout.disabled].sort().join(',') === [...DEFAULT_DISABLED].sort().join(',')
  )
}
