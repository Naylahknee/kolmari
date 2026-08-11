'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, GripVertical, LoaderCircle, RotateCcw } from 'lucide-react'
import {
  DASHBOARD_WIDGETS,
  DEFAULT_LAYOUT,
  isDefaultLayout,
  widgetDef,
  type DashboardLayout,
  type WidgetId,
} from '@/lib/dashboard-layout'

/**
 * Account → Dashboard: choose which panels appear and in what order.
 *
 * Reordering uses the native HTML5 drag-and-drop API rather than a library, so
 * this adds no dependency. Drag is a pointer-only interaction, so every row also
 * carries Move up / Move down buttons — that is the keyboard and screen-reader
 * path, not an afterthought — and each move is announced via a live region.
 */
export function DashboardCustomizer({ initial }: { initial: DashboardLayout }) {
  const [layout, setLayout] = useState<DashboardLayout>(initial)
  const [dragging, setDragging] = useState<WidgetId | null>(null)
  const [overId, setOverId] = useState<WidgetId | null>(null)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  const disabled = new Set(layout.disabled)
  const isDefault = isDefaultLayout(layout)

  async function persist(next: DashboardLayout, message: string) {
    setLayout(next)
    setSaving(true)
    setStatus(message)
    try {
      const res = await fetch('/api/dashboard-layout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layout: next }),
      })
      setStatus(res.ok ? 'Saved.' : 'Could not save your layout.')
    } catch {
      setStatus('Could not save your layout.')
    } finally {
      setSaving(false)
    }
  }

  function move(id: WidgetId, delta: number) {
    const order = [...layout.order]
    const from = order.indexOf(id)
    const to = from + delta
    if (from === -1 || to < 0 || to >= order.length) return
    order.splice(to, 0, order.splice(from, 1)[0])
    void persist({ ...layout, order }, `Moved ${widgetDef(id).label} to position ${to + 1}.`)
  }

  function dropOn(target: WidgetId) {
    if (!dragging || dragging === target) return
    const order = [...layout.order]
    const from = order.indexOf(dragging)
    const to = order.indexOf(target)
    if (from === -1 || to === -1) return
    order.splice(to, 0, order.splice(from, 1)[0])
    void persist({ ...layout, order }, `Moved ${widgetDef(dragging).label} to position ${to + 1}.`)
  }

  function toggle(id: WidgetId) {
    const next = new Set(layout.disabled)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    const on = !next.has(id)
    void persist(
      { ...layout, disabled: [...next] },
      `${widgetDef(id).label} ${on ? 'shown on' : 'hidden from'} your dashboard.`,
    )
  }

  async function reset() {
    setLayout(DEFAULT_LAYOUT)
    setSaving(true)
    setStatus('Restoring the default dashboard…')
    try {
      const res = await fetch('/api/dashboard-layout', { method: 'DELETE' })
      setStatus(res.ok ? 'Default dashboard restored.' : 'Could not reset your layout.')
    } catch {
      setStatus('Could not reset your layout.')
    } finally {
      setSaving(false)
    }
  }

  const shownCount = DASHBOARD_WIDGETS.length - disabled.size

  return (
    <section className="card-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-navy">Dashboard layout</h2>
          <p className="mt-1 max-w-prose text-sm leading-6 text-muted">
            Choose which panels appear on your dashboard and drag them into the order you want.
            Changes save automatically. The Journey tracker stays docked to the right.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          disabled={isDefault || saving}
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-[var(--radius-btn)] border border-line px-3 text-xs font-bold text-navy transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-45"
        >
          <RotateCcw size={13} aria-hidden="true" /> Reset to default
        </button>
      </div>

      <p className="mt-4 text-xs font-semibold text-muted">
        {shownCount} of {DASHBOARD_WIDGETS.length} panels shown
      </p>

      <ul className="mt-2 flex flex-col gap-2">
        {layout.order.map((id, index) => {
          const def = widgetDef(id)
          const on = !disabled.has(id)
          return (
            <li
              key={id}
              draggable
              onDragStart={() => setDragging(id)}
              onDragEnd={() => { setDragging(null); setOverId(null) }}
              onDragOver={(e) => { e.preventDefault(); setOverId(id) }}
              onDragLeave={() => setOverId((cur) => (cur === id ? null : cur))}
              onDrop={(e) => { e.preventDefault(); dropOn(id); setOverId(null) }}
              className={[
                'flex items-start gap-3 rounded-[var(--radius-field)] border bg-white p-3 transition',
                dragging === id ? 'opacity-45' : '',
                overId === id && dragging !== id ? 'border-gold ring-2 ring-gold/25' : 'border-line',
                on ? '' : 'bg-canvas/50',
              ].join(' ')}
            >
              <span className="mt-0.5 cursor-grab text-muted-soft active:cursor-grabbing" aria-hidden="true">
                <GripVertical size={16} />
              </span>

              <div className="min-w-0 flex-1">
                <p className={`text-sm font-bold ${on ? 'text-navy' : 'text-muted'}`}>{def.label}</p>
                <p className="mt-0.5 text-xs leading-5 text-muted">{def.description}</p>
              </div>

              <div className="flex flex-none items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(id, -1)}
                  disabled={index === 0}
                  aria-label={`Move ${def.label} up`}
                  className="grid size-7 place-items-center rounded-[6px] border border-line text-muted transition hover:bg-canvas hover:text-navy disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ArrowUp size={13} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(id, 1)}
                  disabled={index === layout.order.length - 1}
                  aria-label={`Move ${def.label} down`}
                  className="grid size-7 place-items-center rounded-[6px] border border-line text-muted transition hover:bg-canvas hover:text-navy disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ArrowDown size={13} aria-hidden="true" />
                </button>

                <label className="ml-1 inline-flex cursor-pointer items-center gap-2">
                  <span className="sr-only">Show {def.label} on the dashboard</span>
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(id)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="relative h-5 w-9 rounded-full bg-line-strong transition peer-checked:bg-gold peer-focus-visible:ring-2 peer-focus-visible:ring-gold/40 peer-focus-visible:ring-offset-2 after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4"
                  />
                </label>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="mt-3 flex min-h-5 items-center gap-1.5 text-xs text-muted" role="status" aria-live="polite">
        {saving && <LoaderCircle size={12} className="animate-spin" aria-hidden="true" />}
        {status}
      </p>
    </section>
  )
}
