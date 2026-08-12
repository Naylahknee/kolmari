'use client'

import { useMemo, useState } from 'react'
import { ArrowDown, ArrowLeftRight, ArrowUp, GripVertical, LayoutDashboard, LoaderCircle, RotateCcw } from 'lucide-react'
import {
  DASHBOARD_TEMPLATES,
  DASHBOARD_WIDGETS,
  DEFAULT_LAYOUT,
  isDefaultLayout,
  layoutFromTemplate,
  widgetDef,
  type DashboardLayout,
  type DashboardTemplateId,
  type DashboardZone,
  type WidgetId,
} from '@/lib/dashboard-layout'

export function DashboardCustomizer({ initial }: { initial: DashboardLayout }) {
  const [layout, setLayout] = useState(initial)
  const [dragging, setDragging] = useState<WidgetId | null>(null)
  const [over, setOver] = useState<{ zone: DashboardZone; id?: WidgetId } | null>(null)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const disabled = useMemo(() => new Set(layout.disabled), [layout.disabled])

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

  function moveWithin(zone: DashboardZone, id: WidgetId, delta: number) {
    const list = [...layout[zone]]; const from = list.indexOf(id); const to = from + delta
    if (from < 0 || to < 0 || to >= list.length) return
    list.splice(to, 0, list.splice(from, 1)[0])
    void persist(withCustom({ ...layout, [zone]: list }), `Moved ${widgetDef(id).label}.`)
  }

  function moveZone(id: WidgetId, target: DashboardZone, before?: WidgetId) {
    const main = layout.main.filter((item) => item !== id)
    const side = layout.side.filter((item) => item !== id)
    const list = target === 'main' ? main : side
    const index = before ? Math.max(0, list.indexOf(before)) : list.length
    list.splice(index < 0 ? list.length : index, 0, id)
    const next = withCustom({ ...layout, main, side })
    void persist(next, `Moved ${widgetDef(id).label} to the ${target === 'main' ? 'main' : 'second'} column.`)
  }

  function drop(zone: DashboardZone, before?: WidgetId) {
    if (!dragging) return
    moveZone(dragging, zone, before); setDragging(null); setOver(null)
  }

  function applyTemplate(id: Exclude<DashboardTemplateId, 'custom'>) {
    void persist(layoutFromTemplate(id), `Applied ${DASHBOARD_TEMPLATES.find((item) => item.id === id)?.label ?? 'layout'} template.`)
  }

  function setJourneyPlacement(value: 'header' | 'panel') {
    void persist(withCustom({ ...layout, journeyPlacement: value }), `Journey tracker will appear as a ${value === 'header' ? 'header dropdown' : 'Dashboard panel'}.`)
  }

  async function reset() {
    setLayout(DEFAULT_LAYOUT); setSaving(true); setStatus('Restoring the default dashboard…')
    try { const response = await fetch('/api/dashboard-layout', { method: 'DELETE' }); setStatus(response.ok ? 'Default dashboard restored.' : 'Could not reset your layout.') }
    catch { setStatus('Could not reset your layout.') } finally { setSaving(false) }
  }

  return (
    <div className="space-y-5">
      <section className="card-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><h2 className="text-lg font-bold text-navy">Dashboard layout</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-muted">Choose an optimized layout or build your own. Drag panels between columns, reorder them, show or hide them, and choose whether Journey lives in the header or on the Dashboard.</p></div>
          <button type="button" onClick={reset} disabled={isDefaultLayout(layout) || saving} className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-btn)] border border-line px-3 text-xs font-bold text-navy disabled:opacity-45"><RotateCcw size={13}/> Reset</button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {DASHBOARD_TEMPLATES.map((template) => <button key={template.id} type="button" onClick={() => applyTemplate(template.id)} className={`rounded-xl border p-4 text-left transition ${layout.template === template.id ? 'border-gold bg-gold-soft/40 ring-2 ring-gold/20' : 'border-line bg-white hover:border-gold'}`}><span className="flex items-center gap-2 text-sm font-bold text-navy"><LayoutDashboard size={15}/>{template.label}</span><span className="mt-1 block text-xs leading-5 text-muted">{template.description}</span></button>)}
        </div>
      </section>

      <section className="card-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold text-navy">Journey tracker placement</h3><p className="mt-1 text-xs text-muted">Header dropdown remains the default. Switch to Dashboard panel to make Journey part of the draggable canvas.</p></div><div className="inline-flex rounded-full border border-line bg-canvas p-1"><button type="button" onClick={() => setJourneyPlacement('header')} className={`rounded-full px-3 py-1.5 text-xs font-bold ${layout.journeyPlacement === 'header' ? 'bg-white text-navy shadow-sm' : 'text-muted'}`}>Header dropdown</button><button type="button" onClick={() => setJourneyPlacement('panel')} className={`rounded-full px-3 py-1.5 text-xs font-bold ${layout.journeyPlacement === 'panel' ? 'bg-white text-navy shadow-sm' : 'text-muted'}`}>Dashboard panel</button></div></div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <LayoutColumn title="Main column" zone="main" ids={layout.main} layout={layout} disabled={disabled} dragging={dragging} over={over} setDragging={setDragging} setOver={setOver} drop={drop} toggle={toggle} moveWithin={moveWithin} moveZone={moveZone} />
        <LayoutColumn title="Second column" zone="side" ids={layout.side} layout={layout} disabled={disabled} dragging={dragging} over={over} setDragging={setDragging} setOver={setOver} drop={drop} toggle={toggle} moveWithin={moveWithin} moveZone={moveZone} />
      </section>

      <p className="flex min-h-5 items-center gap-1.5 text-xs text-muted" role="status" aria-live="polite">{saving && <LoaderCircle size={12} className="animate-spin"/>}{status}</p>
    </div>
  )
}

function LayoutColumn(props: { title: string; zone: DashboardZone; ids: WidgetId[]; layout: DashboardLayout; disabled: Set<WidgetId>; dragging: WidgetId | null; over: { zone: DashboardZone; id?: WidgetId } | null; setDragging: (id: WidgetId | null) => void; setOver: (value: { zone: DashboardZone; id?: WidgetId } | null) => void; drop: (zone: DashboardZone, id?: WidgetId) => void; toggle: (id: WidgetId) => void; moveWithin: (zone: DashboardZone, id: WidgetId, delta: number) => void; moveZone: (id: WidgetId, zone: DashboardZone, before?: WidgetId) => void }) {
  const { title, zone, ids, layout, disabled, dragging, over, setDragging, setOver, drop, toggle, moveWithin, moveZone } = props
  return <div className={`rounded-2xl border p-3 ${over?.zone === zone && !over.id ? 'border-gold bg-gold-soft/20' : 'border-line bg-canvas/50'}`} onDragOver={(event) => { event.preventDefault(); setOver({ zone }) }} onDrop={(event) => { event.preventDefault(); drop(zone) }}><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold text-navy">{title}</h3><span className="text-[11px] font-semibold text-muted">{ids.length} panels</span></div><ul className="space-y-2">{ids.map((id, index) => { const def = widgetDef(id); const on = !disabled.has(id); const inactiveJourney = id === 'journeyTracker' && layout.journeyPlacement === 'header'; return <li key={id} draggable onDragStart={() => setDragging(id)} onDragEnd={() => { setDragging(null); setOver(null) }} onDragOver={(event) => { event.preventDefault(); event.stopPropagation(); setOver({ zone, id }) }} onDrop={(event) => { event.preventDefault(); event.stopPropagation(); drop(zone, id) }} className={`rounded-xl border bg-white p-3 ${over?.zone === zone && over.id === id && dragging !== id ? 'border-gold ring-2 ring-gold/20' : 'border-line'} ${dragging === id ? 'opacity-45' : ''}`}><div className="flex gap-2"><span className="mt-0.5 cursor-grab text-muted-soft"><GripVertical size={16}/></span><div className="min-w-0 flex-1"><p className="text-sm font-bold text-navy">{def.label}</p><p className="mt-0.5 text-xs leading-5 text-muted">{def.description}</p>{inactiveJourney && <p className="mt-1 text-[11px] font-semibold text-gold-deep">Currently shown in header</p>}</div><label className="inline-flex items-center"><input type="checkbox" checked={on} onChange={() => toggle(id)} className="size-4 accent-[var(--color-gold-deep)]" aria-label={`Show ${def.label}`} /></label></div><div className="mt-2 flex justify-end gap-1"><button type="button" onClick={() => moveWithin(zone, id, -1)} disabled={index === 0} className="grid size-7 place-items-center rounded-md border border-line text-muted disabled:opacity-30" aria-label={`Move ${def.label} up`}><ArrowUp size={13}/></button><button type="button" onClick={() => moveWithin(zone, id, 1)} disabled={index === ids.length - 1} className="grid size-7 place-items-center rounded-md border border-line text-muted disabled:opacity-30" aria-label={`Move ${def.label} down`}><ArrowDown size={13}/></button><button type="button" onClick={() => moveZone(id, zone === 'main' ? 'side' : 'main')} className="inline-flex h-7 items-center gap-1 rounded-md border border-line px-2 text-[11px] font-bold text-navy"><ArrowLeftRight size={12}/>{zone === 'main' ? 'Second' : 'Main'}</button></div></li> })}</ul></div>
}
