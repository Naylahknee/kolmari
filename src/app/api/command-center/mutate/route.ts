import { z } from 'zod'
import { getRequestUser } from '@/lib/auth'
import { isSameOrigin } from '@/lib/security'
import {
  getBoard,
  addDestination,
  renameDestination,
  deleteDestination,
  addItem,
  setItemChecked,
  editItem,
  deleteItem,
  upsertNote,
  addMember,
  editMember,
  deleteMember,
  upsertMemberNote,
} from '@/lib/command-center'

export const runtime = 'nodejs'

const id = z.string().trim().min(1).max(64)
const name = z.string().trim().min(1).max(120)
const text = z.string().trim().min(1).max(400)
const body = z.string().max(4000)
const category = z.enum(['work', 'visa', 'schools', 'safety', 'community'])
const age = z.number().int().min(0).max(120).nullable().optional()

const action = z.discriminatedUnion('type', [
  z.object({ type: z.literal('add-destination'), name }),
  z.object({ type: z.literal('rename-destination'), id, name }),
  z.object({ type: z.literal('delete-destination'), id }),
  z.object({ type: z.literal('add-item'), destinationId: id, category, text }),
  z.object({ type: z.literal('toggle-item'), id, checked: z.boolean() }),
  z.object({ type: z.literal('edit-item'), id, text }),
  z.object({ type: z.literal('delete-item'), id }),
  z.object({ type: z.literal('upsert-note'), destinationId: id, category, body }),
  z.object({ type: z.literal('add-member'), name, age, needs: body.optional() }),
  z.object({ type: z.literal('edit-member'), id, name, age, needs: body.optional() }),
  z.object({ type: z.literal('delete-member'), id }),
  z.object({ type: z.literal('upsert-member-note'), memberId: id, destinationId: id, body }),
])

// Single mutation endpoint for the Command Center. Same-origin guarded; every
// handler is scoped to the signed-in user inside the lib. Returns the fresh
// board so the client can replace its state without a second round trip.
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Request blocked.' }, { status: 403 })
  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = action.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'Invalid request.' }, { status: 400 })
  const a = parsed.data
  const uid = user.id

  try {
    switch (a.type) {
      case 'add-destination': await addDestination(uid, a.name); break
      case 'rename-destination': await renameDestination(uid, a.id, a.name); break
      case 'delete-destination': await deleteDestination(uid, a.id); break
      case 'add-item': await addItem(uid, a.destinationId, a.category, a.text); break
      case 'toggle-item': await setItemChecked(uid, a.id, a.checked); break
      case 'edit-item': await editItem(uid, a.id, a.text); break
      case 'delete-item': await deleteItem(uid, a.id); break
      case 'upsert-note': await upsertNote(uid, a.destinationId, a.category, a.body); break
      case 'add-member': await addMember(uid, a.name, a.age ?? null, a.needs ?? ''); break
      case 'edit-member': await editMember(uid, a.id, a.name, a.age ?? null, a.needs ?? ''); break
      case 'delete-member': await deleteMember(uid, a.id); break
      case 'upsert-member-note': await upsertMemberNote(uid, a.memberId, a.destinationId, a.body); break
    }
    return Response.json(await getBoard(uid))
  } catch (error) {
    console.error('Command Center mutation failed', error)
    return Response.json({ error: 'Could not save your change.' }, { status: 500 })
  }
}
