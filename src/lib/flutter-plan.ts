/* Shared relocation-plan task model for Flutter Mode.
 * Pure (no 'use client'), so both the Flutter page and the sidebar can compute
 * the same readiness percentage without duplicating the task list. */

export const FLUTTER_GROUPS = [
  { title: 'Before you go', tasks: ['Passport valid', 'Research Pathways', 'Request official records', 'Arrange travel insurance'] },
  { title: 'Documents', tasks: ['Prepare visa application', 'Make certified copies', 'Store digital document backups'] },
  { title: 'Finances', tasks: ['Build a three-month emergency fund', 'Open international bank account', 'Notify current bank'] },
  { title: 'Housing', tasks: ['Research neighborhoods', 'Book initial accommodation', 'Plan utilities and internet'] },
  { title: 'Shipping & customs', tasks: ['Make an itemized inventory of belongings (many countries require it for duty-free clearance)', 'Get international shipping or moving quotes', 'Decide what to ship vs. replace on arrival', 'Insure your shipment'] },
  { title: 'Winding down at home', tasks: ['Cancel or transfer utilities and subscriptions', 'Set up mail forwarding', 'Notify your bank and tax authority of your move', 'Plan your goodbyes'] },
  { title: 'Arrival day', tasks: ['Map your airport → first accommodation route', 'Get a local SIM or eSIM', 'Register your local address', 'Locate the nearest pharmacy and clinic'] },
] as const

export const FLUTTER_ALL_TASKS: string[] = FLUTTER_GROUPS.flatMap((group) => group.tasks)

/** Relocation-plan readiness as a 0–100 percentage from completed task titles. */
export function flutterReadiness(completed: string[] | null | undefined): number {
  if (!FLUTTER_ALL_TASKS.length) return 0
  const set = new Set(completed ?? [])
  const done = FLUTTER_ALL_TASKS.filter((task) => set.has(task)).length
  return Math.round((done / FLUTTER_ALL_TASKS.length) * 100)
}
