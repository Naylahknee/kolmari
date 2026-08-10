/* Command Center — client-safe model: types, category taxonomy, and pure
 * progress helpers. No server-only imports, so both the server data layer
 * (command-center.ts) and the client board component can import from here. */

export const CC_CATEGORIES = [
  { key: 'work', label: 'Work' },
  { key: 'visa', label: 'Visa & legal' },
  { key: 'schools', label: 'Schools' },
  { key: 'safety', label: 'Safety' },
  { key: 'community', label: 'Community' },
] as const
export type CCCategory = (typeof CC_CATEGORIES)[number]['key']
const CATEGORY_KEYS = CC_CATEGORIES.map((c) => c.key) as CCCategory[]
export function isCategory(value: string): value is CCCategory {
  return (CATEGORY_KEYS as string[]).includes(value)
}

export type CCDestination = { id: string; name: string; position: number }
export type CCItem = {
  id: string
  destinationId: string
  category: CCCategory
  text: string
  checked: boolean
  isDefault: boolean
  position: number
}
export type CCNote = { destinationId: string; category: CCCategory; body: string }
export type CCMember = { id: string; name: string; age: number | null; needs: string; position: number }
export type CCMemberNote = { memberId: string; destinationId: string; body: string }
export type CCBoard = {
  destinations: CCDestination[]
  items: CCItem[]
  notes: CCNote[]
  members: CCMember[]
  memberNotes: CCMemberNote[]
}

// --- Progress (pure) ---------------------------------------------------------
export function categoryProgress(items: CCItem[], destinationId: string, category: CCCategory) {
  const scoped = items.filter((i) => i.destinationId === destinationId && i.category === category)
  return { done: scoped.filter((i) => i.checked).length, total: scoped.length }
}
export function destinationProgress(items: CCItem[], destinationId: string) {
  const scoped = items.filter((i) => i.destinationId === destinationId)
  return { done: scoped.filter((i) => i.checked).length, total: scoped.length }
}
export function householdProgress(items: CCItem[]) {
  return { done: items.filter((i) => i.checked).length, total: items.length }
}
