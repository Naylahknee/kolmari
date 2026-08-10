'use client'

import { useCallback, useMemo, useState } from 'react'
import { COUNTRIES } from '@/lib/countries'
import {
  CC_CATEGORIES,
  destinationProgress,
  householdProgress,
  type CCBoard,
  type CCCategory,
  type CCItem,
} from '@/lib/command-center-model'
import { COUNTRY_FOOD_CULTURE } from '@/lib/food-culture/data'
import {
  TRACKED_ALLERGENS,
  ARCHETYPE_LABELS,
  ALLERGEN_LABELS,
  PREVALENCE_LABELS,
  type CountryFoodCulture,
} from '@/lib/food-culture/types'

/* Relocation Command Center board (client) — matches the demo design:
 * a dark overall-progress banner, a full-width add-destination row, destination
 * tabs, five category cards with checklists + notes, a Food & Health fit card
 * that surfaces the selected destination's food profile, and a "Who's moving"
 * household panel. Every edit posts to /api/command-center/mutate, which returns
 * the fresh board so the server stays the source of truth. */

// Demo palette (Kolmari brand + supporting slates), kept exact for fidelity.
const C = {
  navy: '#17305b', navyDeep: '#0d1b39', gold: '#f3c516', goldHover: '#ffd633',
  slate: '#5a6a83', slate2: '#42536e', muted: '#9aa6b8', line: '#e7ebf1',
  goldSoft: '#fdf1c2', goldBorder: '#f3d97a', danger: '#b3261e',
}

type MutateAction =
  | { type: 'add-destination'; name: string }
  | { type: 'delete-destination'; id: string }
  | { type: 'add-item'; destinationId: string; category: CCCategory; text: string }
  | { type: 'toggle-item'; id: string; checked: boolean }
  | { type: 'delete-item'; id: string }
  | { type: 'upsert-note'; destinationId: string; category: CCCategory; body: string }
  | { type: 'add-member'; name: string; age: number | null; needs: string }
  | { type: 'edit-member'; id: string; name: string; age: number | null; needs: string }
  | { type: 'delete-member'; id: string }
  | { type: 'upsert-member-note'; memberId: string; destinationId: string; body: string }

function slugify(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
function resolveFood(name: string): { entry: CountryFoodCulture; countryName: string; exact: boolean } | null {
  const lower = name.trim().toLowerCase()
  const bySlug = COUNTRY_FOOD_CULTURE[slugify(name)]
  if (bySlug) return { entry: bySlug, countryName: displayName(bySlug.countrySlug), exact: displayName(bySlug.countrySlug).toLowerCase() === lower }
  for (const key of Object.keys(COUNTRY_FOOD_CULTURE)) {
    if (displayName(key).toLowerCase() === lower) {
      return { entry: COUNTRY_FOOD_CULTURE[key], countryName: displayName(key), exact: true }
    }
  }
  return null
}
function displayName(slug: string) {
  const known = COUNTRIES.find((c) => c.slug === slug)
  if (known) return known.name
  return slug.split('-').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ')
}

export function CommandCenterBoard({ initial }: { initial: CCBoard }) {
  const [board, setBoard] = useState<CCBoard>(initial)
  const [activeId, setActiveId] = useState<string | null>(initial.destinations[0]?.id ?? null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [newDest, setNewDest] = useState('')

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
  const overall = householdProgress(board.items)
  const overallPct = overall.total ? Math.round((overall.done / overall.total) * 100) : 0

  const addDestination = () => {
    const v = newDest.trim()
    if (!v) return
    setNewDest('')
    mutate({ type: 'add-destination', name: v }, { selectNewest: true })
  }

  return (
    <div style={{ fontFamily: 'inherit', color: C.navy }}>
      {error && (
        <div style={{ marginBottom: 18, padding: '12px 15px', background: '#fdecea', border: '1px solid #f5c6c3', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13.5, color: C.danger }}>{error}</span>
          <button type="button" onClick={() => setError('')} style={{ fontSize: 12, fontWeight: 600, color: C.danger, background: 'none', border: 'none', cursor: 'pointer' }}>Dismiss</button>
        </div>
      )}

      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display, Poppins), sans-serif', fontWeight: 700, fontSize: 27, letterSpacing: '-.02em' }}>Relocation Command Center</h1>
        <p style={{ margin: '8px 0 0', fontSize: 14, color: C.slate, maxWidth: 560 }}>
          Compare the places you&rsquo;re considering against work, visa, schools, safety, community — and what each person in your household needs.
        </p>
      </div>

      {/* Overall progress banner */}
      <div style={{ background: C.navyDeep, borderRadius: 16, padding: '20px 22px', color: '#fff', marginBottom: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: C.gold }}>Overall progress</p>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: '#c8d3e6' }}>
              {overall.done} of {overall.total} checklist items done across {board.destinations.length} destination{board.destinations.length === 1 ? '' : 's'}
            </p>
          </div>
          <span style={{ fontFamily: 'var(--font-display, Poppins), sans-serif', fontWeight: 700, fontSize: 34, lineHeight: 1 }}>{overallPct}%</span>
        </div>
        <div style={{ marginTop: 14, height: 8, background: 'rgba(255,255,255,.14)', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${overallPct}%`, background: C.gold, borderRadius: 'inherit', transition: 'width .2s' }} />
        </div>
      </div>

      {/* Add destination */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 24 }}>
        <input
          value={newDest}
          onChange={(e) => setNewDest(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addDestination()}
          placeholder="Add a destination — e.g. Lisbon, Mexico City"
          style={{ flex: 1, minWidth: 220, fontSize: 14.5, color: C.navy, background: '#fff', border: `1.5px solid #dde3ec`, borderRadius: 12, padding: '12px 15px', outline: 'none' }}
        />
        <button
          type="button"
          onClick={addDestination}
          disabled={busy || !newDest.trim()}
          style={{ fontSize: 14, fontWeight: 700, color: C.navy, background: C.gold, border: 'none', borderRadius: 999, padding: '12px 22px', cursor: 'pointer', opacity: busy || !newDest.trim() ? 0.6 : 1 }}
        >
          Add destination
        </button>
      </div>

      {board.destinations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: '#fff', border: `1px dashed #cfd7e3`, borderRadius: 16 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display, Poppins), sans-serif', fontWeight: 700, fontSize: 20 }}>No destinations yet</h2>
          <p style={{ margin: '10px auto 0', maxWidth: 400, fontSize: 14, color: C.slate, lineHeight: 1.6 }}>
            Add the first place you&rsquo;re considering above. We&rsquo;ll set up a research checklist across all five categories so you can start comparing right away.
          </p>
        </div>
      ) : activeDest ? (
        <>
          {/* Destination tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
            {board.destinations.map((d) => {
              const on = d.id === activeId
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setActiveId(d.id)}
                  style={{ fontSize: 13.5, fontWeight: 600, color: on ? C.navy : C.slate2, background: on ? C.goldSoft : '#fff', border: `1.5px solid ${on ? C.gold : '#dde3ec'}`, borderRadius: 999, padding: '8px 16px', cursor: 'pointer' }}
                >
                  {d.name}
                </button>
              )
            })}
          </div>

          {/* Selected destination header */}
          <SelectedHeader
            board={board}
            destId={activeDest.id}
            name={activeDest.name}
            busy={busy}
            onDelete={() => { if (window.confirm('Remove this destination and everything under it?')) mutate({ type: 'delete-destination', id: activeDest.id }) }}
          />

          {/* Category cards */}
          <div className="cc-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 26 }}>
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

          {/* Food & health fit */}
          <FoodFitCard destName={activeDest.name} />

          {/* Who's moving */}
          <MemberPanel board={board} destinationId={activeDest.id} destName={activeDest.name} busy={busy} mutate={mutate} />
        </>
      ) : null}

      <style>{`@media (max-width: 760px){ .cc-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}

function SelectedHeader({
  board, destId, name, busy, onDelete,
}: { board: CCBoard; destId: string; name: string; busy: boolean; onDelete: () => void }) {
  const p = destinationProgress(board.items, destId)
  const pct = p.total ? Math.round((p.done / p.total) * 100) : 0
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
      <div>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display, Poppins), sans-serif', fontWeight: 700, fontSize: 22 }}>{name}</h2>
        <p style={{ margin: '5px 0 0', fontSize: 13, color: C.slate }}>{p.total ? `${p.done} of ${p.total} done · ${pct}%` : 'No checklist items yet'}</p>
      </div>
      <button type="button" disabled={busy} onClick={onDelete} style={{ fontSize: 12.5, fontWeight: 600, color: C.danger, background: '#fff', border: '1px solid #f2cfcb', borderRadius: 999, padding: '8px 14px', cursor: 'pointer' }}>Remove destination</button>
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
  const scoped = items.filter((i) => i.destinationId === destinationId && i.category === category).sort((a, b) => a.position - b.position)
  const done = scoped.filter((i) => i.checked).length
  const pct = scoped.length ? Math.round((done / scoped.length) * 100) : 0
  const [newText, setNewText] = useState('')
  const [noteDraft, setNoteDraft] = useState(note)

  const addItem = () => {
    const v = newText.trim()
    if (!v) return
    setNewText('')
    mutate({ type: 'add-item', destinationId, category, text: v })
  }

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.line}`, borderRadius: 14, padding: '16px 17px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-display, Poppins), sans-serif', fontWeight: 700, fontSize: 15.5 }}>{label}</h3>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.slate }}>{done}/{scoped.length}</span>
      </div>
      <div style={{ margin: '11px 0 13px', height: 6, background: '#eef1f6', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: C.gold, borderRadius: 'inherit', transition: 'width .2s' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {scoped.map((i) => (
          <div key={i.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
            <input type="checkbox" checked={i.checked} disabled={busy} onChange={(e) => mutate({ type: 'toggle-item', id: i.id, checked: e.target.checked })} style={{ width: 17, height: 17, marginTop: 1, accentColor: C.gold, cursor: 'pointer', flex: '0 0 auto' }} />
            <span style={{ fontSize: 13, lineHeight: 1.45, color: i.checked ? C.muted : C.navy, textDecoration: i.checked ? 'line-through' : 'none' }}>{i.text}</span>
            <button type="button" onClick={() => mutate({ type: 'delete-item', id: i.id })} aria-label="Remove item" style={{ marginLeft: 'auto', fontSize: 15, lineHeight: 1, color: '#c2ccda', background: 'none', border: 'none', cursor: 'pointer', flex: '0 0 auto' }}>×</button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 7, marginTop: 11 }}>
        <input value={newText} onChange={(e) => setNewText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addItem()} placeholder="Add an item…" style={{ flex: 1, minWidth: 0, fontSize: 13, color: C.navy, background: '#f7f8fb', border: '1px solid #e4e8f0', borderRadius: 9, padding: '8px 10px', outline: 'none' }} />
        <button type="button" onClick={addItem} disabled={busy || !newText.trim()} style={{ fontSize: 13, fontWeight: 600, color: C.navy, background: '#eef1f6', border: 'none', borderRadius: 9, padding: '8px 12px', cursor: 'pointer' }}>Add</button>
      </div>

      <textarea
        value={noteDraft}
        disabled={busy}
        onChange={(e) => setNoteDraft(e.target.value)}
        onBlur={() => { if (noteDraft !== note) mutate({ type: 'upsert-note', destinationId, category, body: noteDraft }) }}
        placeholder="Notes for this category…"
        rows={2}
        style={{ marginTop: 10, width: '100%', fontSize: 13, color: C.slate2, background: '#fbfcfe', border: '1px solid #e4e8f0', borderRadius: 9, padding: '9px 11px', outline: 'none', lineHeight: 1.5, resize: 'vertical' }}
      />
    </div>
  )
}

function FoodFitCard({ destName }: { destName: string }) {
  const match = useMemo(() => resolveFood(destName), [destName])
  if (!match) {
    return (
      <div style={{ background: '#fbfcfe', border: '1px dashed #d7dee8', borderRadius: 14, padding: '14px 16px', marginBottom: 26 }}>
        <p style={{ margin: 0, fontSize: 13, color: C.slate }}>No food &amp; health profile matched &ldquo;{destName}&rdquo; yet — try a country name.</p>
      </div>
    )
  }
  const { entry, countryName, exact } = match
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.line}`, borderRadius: 16, padding: '18px 19px', marginBottom: 26 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display, Poppins), sans-serif', fontWeight: 700, fontSize: 18 }}>Food &amp; health fit</h2>
          <p style={{ margin: '5px 0 0', fontSize: 12.5, color: C.muted }}>{exact ? `Everyday cuisine in ${countryName}` : `Based on ${countryName}`}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
        {entry.archetypes.map((a) => (
          <span key={a} style={{ fontSize: 11.5, fontWeight: 600, borderRadius: 8, padding: '4px 9px', background: '#f4f6fa', color: C.slate, border: `1px solid ${C.line}` }}>{ARCHETYPE_LABELS[a]}</span>
        ))}
      </div>

      <p style={{ margin: '13px 0 6px', fontSize: 10.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: C.muted }}>Allergen prevalence in everyday food</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {TRACKED_ALLERGENS.map((a) => {
          const prev = entry.allergenPrevalence[a]
          const common = prev === 'common'
          return (
            <span key={a} style={{ fontSize: 11.5, fontWeight: 600, borderRadius: 8, padding: '4px 9px', border: `1px solid ${common ? '#f0b1a8' : '#eef1f6'}`, background: common ? '#fdecea' : '#fbfcfe', color: common ? '#a23b2e' : '#8a97ab' }}>
              {ALLERGEN_LABELS[a]} · {PREVALENCE_LABELS[prev].toLowerCase()}
            </span>
          )
        })}
      </div>

      <p style={{ margin: '12px 0 0', fontSize: 12.5, lineHeight: 1.55, color: C.slate2 }}><strong style={{ color: C.navy }}>Heart note.</strong> {entry.cardioNote}</p>
      <p style={{ margin: '13px 0 0', paddingTop: 11, borderTop: '1px solid #f0f2f6', fontSize: 11, lineHeight: 1.5, color: C.muted }}>
        Kolmari editorial assessment · reviewed {entry.lastReviewed}
      </p>
    </div>
  )
}

function MemberPanel({
  board, destinationId, destName, busy, mutate,
}: {
  board: CCBoard
  destinationId: string
  destName: string
  busy: boolean
  mutate: (a: MutateAction) => void
}) {
  const members = [...board.members].sort((a, b) => a.position - b.position)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')

  const addMember = () => {
    const n = name.trim()
    if (!n) return
    const parsedAge = age.trim() ? Number(age) : null
    setName(''); setAge('')
    mutate({ type: 'add-member', name: n, age: Number.isFinite(parsedAge) ? parsedAge : null, needs: '' })
  }

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.line}`, borderRadius: 16, padding: '18px 19px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display, Poppins), sans-serif', fontWeight: 700, fontSize: 18 }}>Who&rsquo;s moving</h2>
        <span style={{ fontSize: 12.5, color: C.muted }}>How {destName} works for each person</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
        {members.map((m) => (
          <MemberCard
            key={m.id}
            member={m}
            destinationId={destinationId}
            destName={destName}
            memberNote={board.memberNotes.find((x) => x.memberId === m.id && x.destinationId === destinationId)?.body ?? ''}
            busy={busy}
            mutate={mutate}
          />
        ))}
        {members.length === 0 && <p style={{ margin: 0, fontSize: 13, color: C.muted }}>No one added yet.</p>}
      </div>

      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #eef1f6', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addMember()} placeholder="Name" style={{ flex: 2, minWidth: 120, fontSize: 13.5, color: C.navy, background: '#fff', border: '1px solid #dde3ec', borderRadius: 9, padding: '9px 11px', outline: 'none' }} />
        <input value={age} onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" placeholder="Age" style={{ flex: '0 0 82px', width: 82, fontSize: 13.5, color: C.navy, background: '#fff', border: '1px solid #dde3ec', borderRadius: 9, padding: '9px 11px', outline: 'none' }} />
        <button type="button" onClick={addMember} disabled={busy || !name.trim()} style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, background: C.gold, border: 'none', borderRadius: 999, padding: '9px 18px', cursor: 'pointer', opacity: busy || !name.trim() ? 0.6 : 1 }}>Add person</button>
      </div>
    </div>
  )
}

function MemberCard({
  member, destinationId, destName, memberNote, busy, mutate,
}: {
  member: CCBoard['members'][number]
  destinationId: string
  destName: string
  memberNote: string
  busy: boolean
  mutate: (a: MutateAction) => void
}) {
  const [needs, setNeeds] = useState(member.needs)
  const [note, setNote] = useState(memberNote)
  const ageTxt = member.age != null ? `, ${member.age}` : ''

  return (
    <div style={{ border: '1px solid #eef1f6', borderRadius: 12, padding: '13px 14px', background: '#fbfcfe' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <p style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: C.navy }}>{member.name}{ageTxt}</p>
        <button type="button" onClick={() => { if (window.confirm('Remove this person?')) mutate({ type: 'delete-member', id: member.id }) }} style={{ fontSize: 12, fontWeight: 600, color: C.danger, background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
      </div>
      <textarea
        value={needs}
        disabled={busy}
        onChange={(e) => setNeeds(e.target.value)}
        onBlur={() => { if (needs !== member.needs) mutate({ type: 'edit-member', id: member.id, name: member.name, age: member.age, needs }) }}
        placeholder="What this person needs (e.g. school continuity, an established friend group)…"
        rows={2}
        style={{ marginTop: 9, width: '100%', fontSize: 13, color: C.slate2, background: '#fff', border: '1px solid #e4e8f0', borderRadius: 9, padding: '9px 11px', outline: 'none', lineHeight: 1.5, resize: 'vertical' }}
      />
      <textarea
        value={note}
        disabled={busy}
        onChange={(e) => setNote(e.target.value)}
        onBlur={() => { if (note !== memberNote) mutate({ type: 'upsert-member-note', memberId: member.id, destinationId, body: note }) }}
        placeholder={`How does ${destName} address this for ${member.name}?`}
        rows={2}
        style={{ marginTop: 8, width: '100%', fontSize: 13, color: C.slate2, background: '#fff', border: '1px solid #e4e8f0', borderRadius: 9, padding: '9px 11px', outline: 'none', lineHeight: 1.5, resize: 'vertical' }}
      />
    </div>
  )
}
