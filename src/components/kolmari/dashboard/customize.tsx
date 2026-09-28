'use client'

import { useMemo, useState, type DragEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, GripVertical, LoaderCircle, RotateCcw } from 'lucide-react'
import {
  DEFAULT_LAYOUT,
  isDefaultLayout,
  widgetDef,
  type DashboardLayout,
  type DashboardZone,
  type JourneyCollapse,
  type JourneyPlacement,
  type WidgetId,
} from '@/lib/dashboard-layout'

/**
 * Restricted customizer (Sep 2026): the dashboard opens with "What do you need
 * to figure out?" full-width, then the destinations section. Users may only
 * change how the third column is organized, where the Journey tracker lives,
 * and how the tracker collapses. Everything else is locked.
 */

type Over = { zone: DashboardZone; id?: WidgetId } | null

/** Widgets the user is allowed to organize: the third column only. Fixed
 * widgets (ask hero, Journey tracker) never appear here. */
function thirdColumnIds(layout: DashboardLayout): WidgetId[] {
  return layout.side.filter((id) => id !== 'journeyTracker' && id !== 'askKolmari')
}

export function DashboardCustomizer({ initial }: { initial: DashboardLayout }) {
  const [layout, setLayout] = useState(initial)
  const [dragging, setDragging] = useState<WidgetId | null>(null)
  const [over, setOver] = useState<Over>(null)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const disabled = useMemo(() => new Set(layout.disabled), [layout.disabled])
  const sideIds = thirdColumnIds(layout)

  async function persist(next: DashboardLayout, message: string) {
    setLayout(next); setSaving(true); setStatus(message)
    try {
      const response = await fetch('/api/dashboard-layout', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ layout: next }) })
      setStatus(response.ok ? 'Saved.' : 'Could not save your layout.')
    } catch { setStatus('Could not save your layout.') } finally { setSaving(false) }
  }

  function withCustom(next: DashboardLayout): DashboardLayout { return { ...next, template: 'custom' } }

  function toggle(id: WidgetId) {
    const next = new Set(layout.disabled)
    if (next.has(id)) next.delete(id); else next.add(id)
    void persist(withCustom({ ...layout, disabled: [...next] }), `${widgetDef(id).label} ${next.has(id) ? 'hidden' : 'shown'}.`)
  }

  function moveWithin(id: WidgetId, delta: number) {
    const list = [...layout.side]; const from = list.indexOf(id); const to = from + delta
    if (from < 0 || to < 0 || to >= list.length) return
    list.splice(to, 0, list.splice(from, 1)[0])
    void persist(withCustom({ ...layout, side: list }), `Moved ${widgetDef(id).label}.`)
  }

  function drop(before?: WidgetId) {
    if (!dragging) return
    if (dragging !== before) {
      const list = layout.side.filter((item) => item !== dragging)
      const index = before ? list.indexOf(before) : list.length
      list.splice(index < 0 ? list.length : index, 0, dragging)
      void persist(withCustom({ ...layout, side: list }), `Moved ${widgetDef(dragging).label}.`)
    }
    setDragging(null); setOver(null)
  }

  function setJourneyPlacement(value: JourneyPlacement) {
    void persist(withCustom({ ...layout, journeyPlacement: value }), value === 'header' ? 'Journey tracker will appear in the header menu.' : 'Journey tracker will appear below "What do you need to figure out?", next to your matches.')
  }

  function setJourneyCollapse(value: JourneyCollapse) {
    void persist(withCustom({ ...layout, journeyCollapse: value }), value === 'horizontal' ? 'Journey tracker will collapse sideways into a slim rail.' : 'Journey tracker will collapse upward into its header bar.')
  }

  async function reset() {
    setLayout(DEFAULT_LAYOUT); setSaving(true); setStatus('Restoring the default dashboard…')
    try { const response = await fetch('/api/dashboard-layout', { method: 'DELETE' }); setStatus(response.ok ? 'Default dashboard restored.' : 'Could not reset your layout.') }
    catch { setStatus('Could not reset your layout.') } finally { setSaving(false) }
  }

  const dnd = { dragging, over, setDragging, setOver, drop }
  const visibleCount = sideIds.filter((id) => !disabled.has(id)).length

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 flex-1 basis-[420px]">
          <h2 className="text-2xl font-bold tracking-tight text-navy">Dashboard layout</h2>
          <p className="mt-1 max-w-[70ch] text-sm leading-6 text-muted">
            Your dashboard always starts with &ldquo;What do you need to figure out?&rdquo; and your destinations.
            Here you can organize the third column, choose where the Journey tracker lives, and how it collapses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="flex min-h-5 items-center gap-1.5 text-xs font-semibold text-muted" role="status" aria-live="polite">{saving && <LoaderCircle size={12} className="animate-spin" />}{status}</p>
          <button type="button" onClick={reset} disabled={isDefaultLayout(layout) || saving} className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-btn)] border border-line bg-white px-3 text-sm font-semibold text-navy hover:border-line-strong disabled:opacity-45"><RotateCcw size={14} /> Reset</button>
        </div>
      </div>

      <div className="flex max-w-[720px] flex-col gap-4">
        <section className="card-surface p-4">
          <h3 className="text-sm font-bold text-navy">Journey tracker placement</h3>
          <p className="mt-0.5 text-xs text-muted-soft">Keep it in the header menu, or nest it next to your matched destinations.</p>
          <div className="mt-3 grid grid-cols-2 gap-1 rounded-[10px] bg-[#f1f3f7] p-1">
            <Seg on={layout.journeyPlacement === 'header'} onClick={() => setJourneyPlacement('header')}>Header menu</Seg>
            <Seg on={layout.journeyPlacement === 'panel'} onClick={() => setJourneyPlacement('panel')}>Below &ldquo;What do you need to figure out&rdquo;</Seg>
          </div>

          <h3 className="mt-5 text-sm font-bold text-navy">Tracker collapse direction</h3>
          <p className="mt-0.5 text-xs text-muted-soft">Applies when the tracker is a dashboard panel next to your matches.</p>
          <div className="mt-3 grid grid-cols-2 gap-1 rounded-[10px] bg-[#f1f3f7] p-1">
            <Seg on={layout.journeyCollapse === 'horizontal'} onClick={() => setJourneyCollapse('horizontal')}>Collapse sideways</Seg>
            <Seg on={layout.journeyCollapse === 'vertical'} onClick={() => setJourneyCollapse('vertical')}>Collapse upward</Seg>
          </div>
        </section>

        <section className="card-surface flex flex-col gap-4 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-navy">Third column</h3>
              <p className="mt-0.5 text-xs text-muted-soft">Reorder or hide these panels. Drag, or use the arrow buttons.</p>
            </div>
            <span className="text-[11.5px] font-semibold text-muted-soft">{visibleCount} of {sideIds.length} shown</span>
          </div>
          <PanelList layout={layout} ids={sideIds} disabled={disabled} {...dnd} toggle={toggle} moveWithin={moveWithin} />
          <p className="text-[11.5px] leading-5 text-muted-soft">
            The question hero, your destinations, and visa options always stay in place above these panels.
          </p>
        </section>
      </div>
    </div>
  )
}

function Seg({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on}
      className={`flex items-center justify-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-center text-[12.5px] ${on ? 'bg-white font-bold text-navy-deep shadow-[0_1px_2px_rgba(16,34,68,.12)]' : 'font-semibold text-muted'}`}>
      {children}
    </button>
  )
}

type DndProps = { dragging: WidgetId | null; over: Over; setDragging: (id: WidgetId | null) => void; setOver: (v: Over) => void; drop: (id?: WidgetId) => void }

function dragHandlers(id: WidgetId, { dragging, over, setDragging, setOver, drop }: DndProps) {
  return {
    draggable: true,
    onDragStart: (e: DragEvent) => { e.stopPropagation(); e.dataTransfer.effectAllowed = 'move'; setDragging(id) },
    onDragEnd: () => { setDragging(null); setOver(null) },
    onDragOver: (e: DragEvent) => { if (!dragging) return; e.preventDefault(); e.stopPropagation(); if (over?.id !== id) setOver({ zone: 'side', id }) },
    onDrop: (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); drop(id) },
    indicator: over?.id === id && dragging !== null && dragging !== id,
  }
}

function PanelList(props: DndProps & { layout: DashboardLayout; ids: WidgetId[]; disabled: Set<WidgetId>; toggle: (id: WidgetId) => void; moveWithin: (id: WidgetId, delta: number) => void }) {
  const { layout, ids, disabled, toggle, moveWithin } = props
  const shown = ids.filter((id) => !disabled.has(id)).length
  return (
    <div
      onDragOver={(e: DragEvent) => { if (!props.dragging) return; e.preventDefault(); if (props.over?.zone !== 'side' || props.over.id) props.setOver({ zone: 'side' }) }}
      onDrop={(e: DragEvent) => { e.preventDefault(); props.drop() }}
      className="flex flex-col gap-1.5"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted-soft">Third column</span>
        <span className="text-[11px] text-muted-soft">{shown} shown</span>
      </div>
      {ids.map((id, index) => {
        const def = widgetDef(id)
        const on = !disabled.has(id)
        const { indicator, ...h } = dragHandlers(id, props)
        return (
          <div key={id} {...h} className={`relative flex items-center gap-2 rounded-[10px] border p-2 ${props.dragging === id ? 'border-gold opacity-50' : 'border-[#edf0f5]'} ${on ? 'bg-white' : 'bg-[#f8f9fb]'}`}>
            {indicator && <span className="absolute inset-x-0 -top-[5px] h-[3px] rounded-sm bg-gold" />}
            <GripVertical size={14} className="flex-none cursor-grab text-muted-soft" />
            <div className="min-w-0 flex-1" title={def.description}>
              <p className={`truncate text-[12.8px] font-semibold ${on ? 'text-navy' : 'text-muted-soft'}`}>{def.label}</p>
              <p className="truncate text-[11px] text-muted-soft">{def.description}</p>
            </div>
            <div className="flex flex-none items-center gap-0.5">
              <IconBtn label={`Move ${def.label} up`} disabled={index === 0} onClick={() => moveWithin(id, -1)}><ArrowUp size={13} /></IconBtn>
              <IconBtn label={`Move ${def.label} down`} disabled={index === ids.length - 1} onClick={() => moveWithin(id, 1)}><ArrowDown size={13} /></IconBtn>
              <button type="button" role="switch" aria-checked={on} aria-label={`Show ${def.label}`} onClick={() => toggle(id)}
                className={`ml-1 flex h-[18px] w-8 rounded-full p-0.5 transition-colors ${on ? 'justify-end bg-navy' : 'justify-start bg-[#d6dce6]'}`}>
                <span className={`size-3.5 rounded-full ${on ? 'bg-gold' : 'bg-white'}`} />
              </button>
            </div>
          </div>
        )
      })}
      {ids.length === 0 && <div className="rounded-[10px] border-[1.5px] border-dashed border-line-strong p-3.5 text-center text-xs text-muted-soft">No panels in the third column</div>}
    </div>
  )
}

function IconBtn({ label, disabled, onClick, children }: { label: string; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick} className="grid size-[26px] place-items-center rounded-[7px] text-muted hover:bg-[#f1f3f7] disabled:text-[#d3d9e3] disabled:hover:bg-transparent">{children}</button>
}
