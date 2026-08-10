'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  CC_CATEGORIES,
  categoryProgress,
  destinationProgress,
  householdProgress,
  type CCBoard,
  type CCCategory,
  type CCItem,
} from '@/lib/command-center-model'

/* Relocation Command Center board (client). Multi-destination × 5-category
 * checklist grid + a household-member panel. Every edit posts to
 * /api/command-center/mutate, which returns the fresh board — so the server
 * stays the single source of truth and the UI just replaces state. */

type MutateAction =
  | { type: 'add-destination'; name: string }
  | { type: 'rename-destination'; id: string; name: string }
  | { type: 'delete-destination'; id: string }
  | { type: 'add-item'; destinationId: string; category: CCCategory; text: string }
  | { type: 'toggle-item'; id: string; checked: boolean }
  | { type: 'delete-item'; id: string }
  | { type: 'upsert-note'; destinationId: string; category: CCCategory; body: string }
  | { type: 'add-member'; name: string; age: number | null; needs: string }
  | { type: 'edit-member'; id: string; name: string; age: number | null; needs: string }
  | { type: 'delete-member'; id: string }
  | { type: 'upsert-member-note'; memberId: string; destinationId: string; body: string }

function Bar({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <span className="h-1.5 flex-1 overflow-hidden rounded-pill bg-[#eef1f6]">
        <span className="block h-full rounded-pill bg-gold" style={{ width: `${pct}%` }} />
      </span>
      <span className="w-10 shrink-0 text-right text-[11px] font-bold text-navy">{done}/{total}</span>
    </div>
  )
}

export function CommandCenterBoard({ initial }: { initial: CCBoard }) {
  const [board, setBoard] = useState<CCBoard>(initial)
  const [activeId, setActiveId] = useState<string | null>(initial.destinations[0]?.id ?? null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const mutate = useCallback(async (action: MutateAction, opts?: { selectNewest?: boolean }) => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/command-center/mutate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? 'Could not save your change.')
        return
      }
      const next = (await res.json()) as CCBoard
      setBoard(next)
      setActiveId((cur) => {
        if (opts?.selectNewest && next.destinations.length) {
          return next.destinations.reduce((a, b) => (b.position > a.position ? b : a)).id
        }
        if (cur && next.destinations.some((d) => d.id === cur)) return cur
        return next.destinations[0]?.id ?? null
      })
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setBusy(false)
    }
  }, [])

  const activeDest = board.destinations.find((d) => d.id === activeId) ?? null
  const household = householdProgress(board.items)

  return (
    <div className="space-y-5">
      {error && (
        <p className="rounded-[var(--radius-field)] border border-danger/30 bg-[#fde9ec] px-3 py-2 text-xs font-semibold text-[#b3243c]">{error}</p>
      )}

      {/* Destination switcher + household roll-up */}
      <section className="rounded-[var(--radius-card)] border border-line bg-white p-4 shadow-tile">
        <div className="flex flex-wrap items-center gap-2">
          {board.destinations.map((d) => {
            const p = destinationProgress(board.items, d.id)
            const on = d.id === activeId
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveId(d.id)}
                aria-pressed={on}
                className={`rounded-pill border px-3 py-1.5 text-xs font-semibold transition ${
                  on ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:border-navy/40'
                }`}
              >
                {d.name}
                <span className={`ml-1.5 ${on ? 'text-white/70' : 'text-muted'}`}>{p.done}/{p.total}</span>
              </button>
            )
          })}
          <AddDestination busy={busy} onAdd={(name) => mutate({ type: 'add-destination', name }, { selectNewest: true })} />
        </div>
        {board.destinations.length > 0 && (
          <div className="mt-3 border-t border-line pt-3">
            <p className="mb-1 text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted-soft">Household progress across all destinations</p>
            <Bar done={household.done} total={household.total} />
          </div>
        )}
      </section>

      {board.destinations.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-[#fafbfd] p-10 text-center">
          <p className="text-sm font-semibold text-navy">Add your first destination</p>
          <p className="mx-auto mt-1 max-w-md text-xs text-muted">
            Each destination gets its own checklist across work, visa, schools, safety, and community — so you can
            compare what a move to each one really takes.
          </p>
        </div>
      ) : activeDest ? (
        <>
          {/* Rename / delete the active destination */}
          <DestinationHeader
            key={activeDest.id}
            name={activeDest.name}
            busy={busy}
            onRename={(name) => mutate({ type: 'rename-destination', id: activeDest.id, name })}
            onDelete={() => mutate({ type: 'delete-destination', id: activeDest.id })}
          />

          {/* 5 category cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {CC_CATEGORIES.map((c) => (
              <CategoryCard
                key={c.key}
                category={c.key}
                label={c.label}
                destinationId={activeDest.id}
                items={board.items}
                note={board.notes.find((n) => n.destinationId === activeDest.id && n.category === c.key)?.body ?? ''}
                busy={busy}
                mutate={mutate}
              />
            ))}
          </div>

          {/* Household member panel */}
          <MemberPanel board={board} destinationId={activeDest.id} busy={busy} mutate={mutate} />
        </>
      ) : null}
    </div>
  )
}

function AddDestination({ busy, onAdd }: { busy: boolean; onAdd: (name: string) => void }) {
  const [value, setValue] = useState('')
  const submit = () => {
    const v = value.trim()
    if (!v) return
    onAdd(v)
    setValue('')
  }
  return (
    <div className="inline-flex items-center gap-1.5">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="Add destination"
        className="w-36 rounded-pill border border-line px-3 py-1.5 text-xs text-navy outline-none focus:border-navy/40"
      />
      <button
        type="button"
        onClick={submit}
        disabled={busy || !value.trim()}
        className="rounded-pill bg-gold px-3 py-1.5 text-xs font-bold text-navy-deep transition hover:bg-[#e0b40c] disabled:opacity-50"
      >
        Add
      </button>
    </div>
  )
}

function DestinationHeader({
  name, busy, onRename, onDelete,
}: { name: string; busy: boolean; onRename: (name: string) => void; onDelete: () => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(name)
  const [confirm, setConfirm] = useState(false)

  return (
    <div className="flex items-center justify-between gap-3">
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="rounded-[var(--radius-field)] border border-line px-3 py-1.5 text-lg font-bold text-navy outline-none focus:border-navy/40"
            autoFocus
          />
          <button
            type="button"
            disabled={busy || !draft.trim()}
            onClick={() => { onRename(draft.trim()); setEditing(false) }}
            className="rounded-[var(--radius-field)] bg-navy px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
          >
            Save
          </button>
          <button type="button" onClick={() => { setDraft(name); setEditing(false) }} className="text-xs font-semibold text-muted">Cancel</button>
        </div>
      ) : (
        <h2 className="text-xl font-bold text-navy">
          {name}
          <button type="button" onClick={() => setEditing(true)} className="ml-2 text-xs font-semibold text-info hover:text-navy">Rename</button>
        </h2>
      )}
      {confirm ? (
        <span className="flex items-center gap-2 text-xs">
          <span className="text-muted">Remove this destination?</span>
          <button type="button" disabled={busy} onClick={onDelete} className="font-bold text-[#b3243c]">Remove</button>
          <button type="button" onClick={() => setConfirm(false)} className="font-semibold text-muted">Keep</button>
        </span>
      ) : (
        <button type="button" onClick={() => setConfirm(true)} className="text-xs font-semibold text-muted hover:text-[#b3243c]">Remove</button>
      )}
    </div>
  )
}

function CategoryCard({
  category, label, destinationId, items, note, busy, mutate,
}: {
  category: CCCategory
  label: string
  destinationId: string
  items: CCItem[]
  note: string
  busy: boolean
  mutate: (a: MutateAction) => void
}) {
  const scoped = items
    .filter((i) => i.destinationId === destinationId && i.category === category)
    .sort((a, b) => a.position - b.position)
  const p = categoryProgress(items, destinationId, category)
  const [newItem, setNewItem] = useState('')

  const addItem = () => {
    const v = newItem.trim()
    if (!v) return
    mutate({ type: 'add-item', destinationId, category, text: v })
    setNewItem('')
  }

  return (
    <section className="flex flex-col rounded-[var(--radius-card)] border border-line bg-white p-4 shadow-tile">
      <div className="mb-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-navy">{label}</h3>
        </div>
        <div className="mt-1.5"><Bar done={p.done} total={p.total} /></div>
      </div>

      <ul className="space-y-1.5">
        {scoped.map((item) => (
          <li key={item.id} className="group flex items-start gap-2">
            <input
              type="checkbox"
              checked={item.checked}
              disabled={busy}
              onChange={(e) => mutate({ type: 'toggle-item', id: item.id, checked: e.target.checked })}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-gold-deep)]"
            />
            <span className={`flex-1 text-[13px] leading-5 ${item.checked ? 'text-muted line-through' : 'text-navy'}`}>{item.text}</span>
            <button
              type="button"
              onClick={() => mutate({ type: 'delete-item', id: item.id })}
              className="shrink-0 text-[11px] font-semibold text-muted opacity-0 transition group-hover:opacity-100 hover:text-[#b3243c]"
              aria-label="Remove task"
            >
              ✕
            </button>
          </li>
        ))}
        {scoped.length === 0 && <li className="text-[12px] text-muted-soft">No tasks yet.</li>}
      </ul>

      <div className="mt-2 flex items-center gap-1.5">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          placeholder="Add a task"
          className="flex-1 rounded-[var(--radius-field)] border border-line px-2.5 py-1.5 text-xs text-navy outline-none focus:border-navy/40"
        />
        <button type="button" onClick={addItem} disabled={busy || !newItem.trim()} className="rounded-[var(--radius-field)] border border-line px-2.5 py-1.5 text-xs font-bold text-navy disabled:opacity-50">Add</button>
      </div>

      <NoteField
        key={`${destinationId}:${category}`}
        label="Notes"
        initial={note}
        busy={busy}
        onSave={(body) => mutate({ type: 'upsert-note', destinationId, category, body })}
      />
    </section>
  )
}

function NoteField({
  label, initial, busy, onSave,
}: { label: string; initial: string; busy: boolean; onSave: (body: string) => void }) {
  const [value, setValue] = useState(initial)
  return (
    <div className="mt-3">
      <label className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted-soft">{label}</label>
      <textarea
        value={value}
        disabled={busy}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => { if (value !== initial) onSave(value) }}
        rows={2}
        placeholder="Add a note…"
        className="mt-1 w-full resize-y rounded-[var(--radius-field)] border border-line bg-[#fafbfd] px-2.5 py-1.5 text-[12px] leading-5 text-navy outline-none focus:border-navy/40"
      />
    </div>
  )
}

function MemberPanel({
  board, destinationId, busy, mutate,
}: {
  board: CCBoard
  destinationId: string
  busy: boolean
  mutate: (a: MutateAction) => void
}) {
  const members = [...board.members].sort((a, b) => a.position - b.position)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [needs, setNeeds] = useState('')

  const addMember = () => {
    const n = name.trim()
    if (!n) return
    const parsedAge = age.trim() ? Number(age) : null
    mutate({ type: 'add-member', name: n, age: Number.isFinite(parsedAge) ? parsedAge : null, needs: needs.trim() })
    setName(''); setAge(''); setNeeds('')
  }

  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-white p-4 shadow-tile">
      <h3 className="text-sm font-bold text-navy">Household</h3>
      <p className="mt-0.5 text-xs text-muted">Who&rsquo;s moving, and how each destination addresses their needs.</p>

      <ul className="mt-3 space-y-3">
        {members.map((m) => {
          const mn = board.memberNotes.find((x) => x.memberId === m.id && x.destinationId === destinationId)?.body ?? ''
          return (
            <li key={m.id} className="rounded-[var(--radius-field)] border border-line p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[13px] font-bold text-navy">
                    {m.name}
                    {m.age != null && <span className="ml-1.5 text-xs font-normal text-muted">age {m.age}</span>}
                  </p>
                  {m.needs && <p className="mt-0.5 text-xs text-muted">{m.needs}</p>}
                </div>
                <button type="button" onClick={() => mutate({ type: 'delete-member', id: m.id })} className="text-[11px] font-semibold text-muted hover:text-[#b3243c]">Remove</button>
              </div>
              <NoteField
                key={`${m.id}:${destinationId}`}
                label="How this destination fits"
                initial={mn}
                busy={busy}
                onSave={(body) => mutate({ type: 'upsert-member-note', memberId: m.id, destinationId, body })}
              />
            </li>
          )
        })}
        {members.length === 0 && <li className="text-[12px] text-muted-soft">No household members added yet.</li>}
      </ul>

      <div className="mt-3 grid gap-2 border-t border-line pt-3 sm:grid-cols-[1fr_80px_1.4fr_auto]">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="rounded-[var(--radius-field)] border border-line px-2.5 py-1.5 text-xs text-navy outline-none focus:border-navy/40" />
        <input value={age} onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Age" inputMode="numeric" className="rounded-[var(--radius-field)] border border-line px-2.5 py-1.5 text-xs text-navy outline-none focus:border-navy/40" />
        <input value={needs} onChange={(e) => setNeeds(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addMember()} placeholder="Needs (e.g. allergy-safe school)" className="rounded-[var(--radius-field)] border border-line px-2.5 py-1.5 text-xs text-navy outline-none focus:border-navy/40" />
        <button type="button" onClick={addMember} disabled={busy || !name.trim()} className="rounded-[var(--radius-field)] bg-navy px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50">Add</button>
      </div>
    </section>
  )
}
