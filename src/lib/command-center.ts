import 'server-only'

import { getSql } from './db'
import { CC_CATEGORIES, type CCCategory, type CCBoard } from './command-center-model'
import { rankNextinations } from './userProfile'
import type { RelocationProfile } from './profile'

export { CC_CATEGORIES, isCategory, categoryProgress, destinationProgress, householdProgress } from './command-center-model'
export type { CCCategory, CCBoard, CCDestination, CCItem, CCNote, CCMember, CCMemberNote } from './command-center-model'

/* Relocation Command Center — persistent, multi-destination household planning
 * board. Distinct from the single-destination Kolmari Plan + 8-stage Tracker:
 * this is a topic × destination grid (5 fixed categories per destination) plus a
 * household-member panel, scoped to the signed-in user via real auth (user_id) —
 * not the demo's cookie owner_key. Translated from the kolmari-demo D1 model to
 * Neon Postgres, reusing the ensureTable()/getSql() + getRequestUser patterns.
 *
 * Data integrity: checklist template text is generic planning prompts (not
 * country facts); nothing here fabricates Match Scores, eligibility, or country
 * data. Progress is computed from the user's own checked/total items. */

const CATEGORY_KEYS = CC_CATEGORIES.map((c) => c.key) as CCCategory[]

// Generic starter tasks seeded on each new destination (is_default = true).
// Prompts, not facts — the user makes them real by checking / editing them.
const DEFAULT_ITEMS: Record<CCCategory, string[]> = {
  work: ['Confirm remote-work or local employment options', 'Check work authorization for your route'],
  visa: ['Identify the visa or residence route', 'List the required documents', 'Check income or savings thresholds'],
  schools: ['Research schooling options for the household', 'Check enrollment timelines and requirements'],
  safety: ['Review neighborhood safety and healthcare access', 'Note any location-specific health considerations'],
  community: ['Find local community and support groups', 'Plan a scouting visit'],
}

let tableReady: Promise<void> | null = null
async function ensureTables() {
  if (!tableReady) {
    tableReady = (async () => {
      const sql = getSql()
      await sql`
        CREATE TABLE IF NOT EXISTS cc_destination (
          id TEXT PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          position INT NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`
      await sql`CREATE INDEX IF NOT EXISTS idx_cc_dest_user ON cc_destination(user_id)`
      await sql`
        CREATE TABLE IF NOT EXISTS cc_checklist_item (
          id TEXT PRIMARY KEY,
          destination_id TEXT NOT NULL REFERENCES cc_destination(id) ON DELETE CASCADE,
          category TEXT NOT NULL,
          text TEXT NOT NULL,
          checked BOOLEAN NOT NULL DEFAULT FALSE,
          is_default BOOLEAN NOT NULL DEFAULT FALSE,
          position INT NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`
      await sql`CREATE INDEX IF NOT EXISTS idx_cc_item_dest ON cc_checklist_item(destination_id, category)`
      await sql`
        CREATE TABLE IF NOT EXISTS cc_note (
          id TEXT PRIMARY KEY,
          destination_id TEXT NOT NULL REFERENCES cc_destination(id) ON DELETE CASCADE,
          category TEXT NOT NULL,
          body TEXT NOT NULL DEFAULT '',
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE (destination_id, category)
        )`
      await sql`
        CREATE TABLE IF NOT EXISTS cc_member (
          id TEXT PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          age INT,
          needs TEXT NOT NULL DEFAULT '',
          position INT NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`
      await sql`CREATE INDEX IF NOT EXISTS idx_cc_member_user ON cc_member(user_id)`
      await sql`
        CREATE TABLE IF NOT EXISTS cc_member_note (
          id TEXT PRIMARY KEY,
          member_id TEXT NOT NULL REFERENCES cc_member(id) ON DELETE CASCADE,
          destination_id TEXT NOT NULL REFERENCES cc_destination(id) ON DELETE CASCADE,
          body TEXT NOT NULL DEFAULT '',
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE (member_id, destination_id)
        )`
    })().catch((error) => { tableReady = null; throw error })
  }
  await tableReady
}

function newId(): string {
  return crypto.randomUUID()
}

/** Full board for a user — one hydration payload. */
export async function getBoard(userId: number): Promise<CCBoard> {
  await ensureTables()
  const sql = getSql()
  const [destinations, items, notes, members, memberNotes] = await Promise.all([
    sql`SELECT id, name, position FROM cc_destination WHERE user_id = ${userId} ORDER BY position, created_at`,
    sql`SELECT i.id, i.destination_id, i.category, i.text, i.checked, i.is_default, i.position
        FROM cc_checklist_item i JOIN cc_destination d ON d.id = i.destination_id
        WHERE d.user_id = ${userId} ORDER BY i.position, i.created_at`,
    sql`SELECT n.destination_id, n.category, n.body
        FROM cc_note n JOIN cc_destination d ON d.id = n.destination_id
        WHERE d.user_id = ${userId}`,
    sql`SELECT id, name, age, needs, position FROM cc_member WHERE user_id = ${userId} ORDER BY position, created_at`,
    sql`SELECT mn.member_id, mn.destination_id, mn.body
        FROM cc_member_note mn JOIN cc_member m ON m.id = mn.member_id
        WHERE m.user_id = ${userId}`,
  ])
  return {
    destinations: (destinations as Record<string, unknown>[]).map((r) => ({
      id: String(r.id), name: String(r.name), position: Number(r.position),
    })),
    items: (items as Record<string, unknown>[]).map((r) => ({
      id: String(r.id), destinationId: String(r.destination_id), category: String(r.category) as CCCategory,
      text: String(r.text), checked: Boolean(r.checked), isDefault: Boolean(r.is_default), position: Number(r.position),
    })),
    notes: (notes as Record<string, unknown>[]).map((r) => ({
      destinationId: String(r.destination_id), category: String(r.category) as CCCategory, body: String(r.body ?? ''),
    })),
    members: (members as Record<string, unknown>[]).map((r) => ({
      id: String(r.id), name: String(r.name), age: r.age == null ? null : Number(r.age),
      needs: String(r.needs ?? ''), position: Number(r.position),
    })),
    memberNotes: (memberNotes as Record<string, unknown>[]).map((r) => ({
      memberId: String(r.member_id), destinationId: String(r.destination_id), body: String(r.body ?? ''),
    })),
  }
}

/** True when a destination belongs to the user (ownership guard for item/note ops). */
async function ownsDestination(userId: number, destinationId: string): Promise<boolean> {
  const rows = (await getSql()`SELECT 1 FROM cc_destination WHERE id = ${destinationId} AND user_id = ${userId} LIMIT 1`) as unknown[]
  return rows.length > 0
}
async function ownsMember(userId: number, memberId: string): Promise<boolean> {
  const rows = (await getSql()`SELECT 1 FROM cc_member WHERE id = ${memberId} AND user_id = ${userId} LIMIT 1`) as unknown[]
  return rows.length > 0
}

export async function addDestination(userId: number, name: string): Promise<void> {
  await ensureTables()
  const sql = getSql()
  const id = newId()
  const posRows = (await sql`SELECT COALESCE(MAX(position), -1) + 1 AS next FROM cc_destination WHERE user_id = ${userId}`) as { next: number }[]
  const position = Number(posRows[0]?.next ?? 0)
  await sql`INSERT INTO cc_destination (id, user_id, name, position) VALUES (${id}, ${userId}, ${name}, ${position})`
  // Seed the default checklist for all five categories.
  let pos = 0
  for (const category of CATEGORY_KEYS) {
    for (const text of DEFAULT_ITEMS[category]) {
      await sql`INSERT INTO cc_checklist_item (id, destination_id, category, text, is_default, position)
                VALUES (${newId()}, ${id}, ${category}, ${text}, TRUE, ${pos++})`
    }
  }
}

export async function renameDestination(userId: number, id: string, name: string): Promise<void> {
  await ensureTables()
  await getSql()`UPDATE cc_destination SET name = ${name} WHERE id = ${id} AND user_id = ${userId}`
}

export async function deleteDestination(userId: number, id: string): Promise<void> {
  await ensureTables()
  // ON DELETE CASCADE clears items/notes/member_notes for this destination.
  await getSql()`DELETE FROM cc_destination WHERE id = ${id} AND user_id = ${userId}`
}

export async function addItem(userId: number, destinationId: string, category: CCCategory, text: string): Promise<void> {
  await ensureTables()
  if (!(await ownsDestination(userId, destinationId))) return
  const sql = getSql()
  const posRows = (await sql`SELECT COALESCE(MAX(position), -1) + 1 AS next FROM cc_checklist_item WHERE destination_id = ${destinationId} AND category = ${category}`) as { next: number }[]
  await sql`INSERT INTO cc_checklist_item (id, destination_id, category, text, is_default, position)
            VALUES (${newId()}, ${destinationId}, ${category}, ${text}, FALSE, ${Number(posRows[0]?.next ?? 0)})`
}

export async function setItemChecked(userId: number, id: string, checked: boolean): Promise<void> {
  await ensureTables()
  await getSql()`
    UPDATE cc_checklist_item SET checked = ${checked}
    WHERE id = ${id} AND destination_id IN (SELECT id FROM cc_destination WHERE user_id = ${userId})`
}

export async function editItem(userId: number, id: string, text: string): Promise<void> {
  await ensureTables()
  await getSql()`
    UPDATE cc_checklist_item SET text = ${text}
    WHERE id = ${id} AND destination_id IN (SELECT id FROM cc_destination WHERE user_id = ${userId})`
}

export async function deleteItem(userId: number, id: string): Promise<void> {
  await ensureTables()
  await getSql()`
    DELETE FROM cc_checklist_item
    WHERE id = ${id} AND destination_id IN (SELECT id FROM cc_destination WHERE user_id = ${userId})`
}

export async function upsertNote(userId: number, destinationId: string, category: CCCategory, body: string): Promise<void> {
  await ensureTables()
  if (!(await ownsDestination(userId, destinationId))) return
  await getSql()`
    INSERT INTO cc_note (id, destination_id, category, body, updated_at)
    VALUES (${newId()}, ${destinationId}, ${category}, ${body}, NOW())
    ON CONFLICT (destination_id, category) DO UPDATE SET body = EXCLUDED.body, updated_at = NOW()`
}

export async function addMember(userId: number, name: string, age: number | null, needs: string): Promise<void> {
  await ensureTables()
  const sql = getSql()
  const posRows = (await sql`SELECT COALESCE(MAX(position), -1) + 1 AS next FROM cc_member WHERE user_id = ${userId}`) as { next: number }[]
  await sql`INSERT INTO cc_member (id, user_id, name, age, needs, position)
            VALUES (${newId()}, ${userId}, ${name}, ${age}, ${needs}, ${Number(posRows[0]?.next ?? 0)})`
}

export async function editMember(userId: number, id: string, name: string, age: number | null, needs: string): Promise<void> {
  await ensureTables()
  await getSql()`UPDATE cc_member SET name = ${name}, age = ${age}, needs = ${needs} WHERE id = ${id} AND user_id = ${userId}`
}

export async function deleteMember(userId: number, id: string): Promise<void> {
  await ensureTables()
  await getSql()`DELETE FROM cc_member WHERE id = ${id} AND user_id = ${userId}`
}

export async function upsertMemberNote(userId: number, memberId: string, destinationId: string, body: string): Promise<void> {
  await ensureTables()
  if (!(await ownsMember(userId, memberId)) || !(await ownsDestination(userId, destinationId))) return
  await getSql()`
    INSERT INTO cc_member_note (id, member_id, destination_id, body, updated_at)
    VALUES (${newId()}, ${memberId}, ${destinationId}, ${body}, NOW())
    ON CONFLICT (member_id, destination_id) DO UPDATE SET body = EXCLUDED.body, updated_at = NOW()`
}

// Generic household member names derived from the profile's household shape.
// Names only — no invented ages or needs (keeps with "prompts, not facts").
function householdMemberNames(profile: RelocationProfile): string[] {
  const names = ['You']
  if (profile.spouse === true) names.push('Partner')
  const dependents = Math.max(0, Math.min(8, profile.dependents ?? 0))
  for (let i = 1; i <= dependents; i += 1) names.push(`Child ${i}`)
  const cap = profile.family_size && profile.family_size > 0 ? Math.min(12, profile.family_size) : names.length
  return names.slice(0, Math.max(1, cap))
}

/**
 * Seed a brand-new user's Command Center once, at profile-wizard completion.
 * Seeds the user's top real matched destinations (each auto-gets the generic
 * default checklist) and generic household-member rows. Idempotent: does
 * nothing if the board already has any destination, so a wizard retake never
 * duplicates. Best-effort — callers must not let a seed failure block the save.
 */
export async function seedCommandCenterFromProfile(userId: number, profile: RelocationProfile): Promise<void> {
  const board = await getBoard(userId)
  if (board.destinations.length > 0) return

  const ranked = rankNextinations(profile).slice(0, 3)
  for (const { country } of ranked) {
    await addDestination(userId, country.name)
  }

  if (ranked.length > 0) {
    for (const name of householdMemberNames(profile)) {
      await addMember(userId, name, null, '')
    }
  }
}
