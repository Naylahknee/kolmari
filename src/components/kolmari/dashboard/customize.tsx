'use client'

import { useEffect, useMemo, useRef, useState, type DragEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowLeftRight, ArrowUp, Check, ChevronDown, GripVertical, LoaderCircle, Monitor, RotateCcw, Smartphone } from 'lucide-react'
import {
  DASHBOARD_TEMPLATES,
  DASHBOARD_WIDGETS,
  DEFAULT_LAYOUT,
  FIXED_WIDGETS,
  isDefaultLayout,
  layoutFromTemplate,
  widgetDef,
  type DashboardLayout,
  type DashboardTemplateId,
  type DashboardZone,
  type JourneyCollapse,
  type JourneyPlacement,
  type WidgetId,
} from '@/lib/dashboard-layout'

/**
 * Dashboard layout designer (restored Sep 2026): pick a template, then
 * fine-tune it. Panels drag between the main and second columns, reorder
 * within a column, or hide entirely. The top sections (question hero, your
 * matches, visa options) stay fixed; the Ask Kolmari hero and Journey tracker
 * are managed separately and never appear in the draggable lists.
 */

type Over = { zone: DashboardZone; id?: WidgetId } | null
type Device = 'desktop' | 'mobile'

/** Fixed-position widgets never live in the draggable zones. */
function sanitize(layout: DashboardLayout): DashboardLayout {
  return {
    ...layout,
    main: layout.main.filter((id) => !FIXED_WIDGETS.has(id)),
    side: layout.side.filter((id) => !FIXED_WIDGETS.has(id)),
  }
}

export function DashboardCustomizer({ initial }: { initial: DashboardLayout }) {
  const [layout, setLayout] = useState(() => sanitize(initial))
  const [dragging, setDragging] = useState<WidgetId | null>(null)
  const [over, setOver] = useState<Over>(null)
  const [device, setDevice] = useState<Device>('desktop')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const disabled = useMemo(() => new Set(layout.disabled), [layout.disabled])

  async function persist(next: DashboardLayout, message: string) {
    const clean = sanitize(next)
    setLayout(clean); setSaving(true); setStatus(message)
    try {
      const response = await fetch('/api/dashboard-layout', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ layout: clean }) })
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
    const index = before ? list.indexOf(before) : list.length
    list.splice(index < 0 ? list.length : index, 0, id)
    void persist(withCustom({ ...layout, main, side }), `Moved ${widgetDef(id).label} to the ${target === 'main' ? 'main' : 'second'} column.`)
  }

  function drop(zone: DashboardZone, before?: WidgetId) {
    if (!dragging) return
    if (dragging !== before) moveZone(dragging, zone, before)
    setDragging(null); setOver(null)
  }

  function applyTemplate(id: Exclude<DashboardTemplateId, 'custom'>) {
    void persist(layoutFromTemplate(id), `Applied ${DASHBOARD_TEMPLATES.find((item) => item.id === id)?.label ?? 'layout'} template.`)
  }

  function setJourneyPlacement(value: JourneyPlacement) {
    void persist(withCustom({ ...layout, journeyPlacement: value, journeyPlacementChosen: true }), value === 'header' ? 'Journey tracker will appear in the header menu.' : 'Journey tracker will appear on the right side of your dashboard.')
  }

  function setJourneyCollapse(value: JourneyCollapse) {
    void persist(withCustom({ ...layout, journeyCollapse: value }), value === 'horizontal' ? 'Journey tracker will collapse sideways into a slim rail.' : 'Journey tracker will collapse upward into its header bar.')
  }

  async function reset() {
    setLayout(sanitize(DEFAULT_LAYOUT)); setSaving(true); setStatus('Restoring the default dashboard…')
    try { const response = await fetch('/api/dashboard-layout', { method: 'DELETE' }); setStatus(response.ok ? 'Default dashboard restored.' : 'Could not reset your layout.') }
    catch { setStatus('Could not reset your layout.') } finally { setSaving(false) }
  }

  const dnd = { dragging, over, setDragging, setOver, drop }
  const headerJ = layout.journeyPlacement === 'header' && !disabled.has('journeyTracker')
  const zoneIds = [...layout.main, ...layout.side]
  const visibleCount = zoneIds.filter((id) => !disabled.has(id)).length + (headerJ ? 1 : 0)
  const organizableCount = zoneIds.length + (disabled.has('journeyTracker') ? 0 : 1)
  const activeTemplate = DASHBOARD_TEMPLATES.find((t) => t.id === layout.template)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 flex-1 basis-[420px]">
          <h2 className="text-2xl font-bold tracking-tight text-navy">Dashboard layout</h2>
          <p className="mt-1 max-w-[70ch] text-sm leading-6 text-muted">Pick a layout, then fine-tune it. Your top sections stay put — drag the panels below them, here or in the live preview, to rearrange.</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="flex min-h-5 items-center gap-1.5 text-xs font-semibold text-muted" role="status" aria-live="polite">{saving && <LoaderCircle size={12} className="animate-spin" />}{status}</p>
          <button type="button" onClick={reset} disabled={isDefaultLayout(layout) || saving} className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-btn)] border border-line bg-white px-3 text-sm font-semibold text-navy hover:border-line-strong disabled:opacity-45"><RotateCcw size={14} /> Reset</button>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-5">
        {/* Controls */}
        <div className="flex min-w-0 max-w-[420px] flex-1 basis-[320px] flex-col gap-4">
          <section className="card-surface p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-navy">Start from a layout</h3>
              {layout.template === 'custom' && <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-gold-deep">Custom</span>}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {DASHBOARD_TEMPLATES.map((template) => {
                const on = layout.template === template.id
                return (
                  <button key={template.id} type="button" onClick={() => applyTemplate(template.id)} title={template.description}
                    className={`block w-full rounded-[11px] border-[1.5px] p-2 pb-2.5 text-left transition ${on ? 'border-gold bg-[#fffbea] ring-[3px] ring-gold/20' : 'border-line bg-white hover:border-gold'}`}>
                    <TemplateThumb template={template} />
                    <span className="mt-2 flex items-center gap-1.5">
                      <span className="min-w-0 flex-1 text-[12.8px] font-bold text-navy">{template.label}</span>
                      {on && <span className="grid size-4 flex-none place-items-center rounded-full bg-gold text-navy-deep"><Check size={10} strokeWidth={3.2} /></span>}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="card-surface p-4">
            <h3 className="text-sm font-bold text-navy">Journey tracker</h3>
            <p className="mt-0.5 text-xs text-muted-soft">Lives on the right side of your dashboard by default. Move it to the header menu only if you prefer it there.</p>
            <div className="mt-3 grid grid-cols-2 gap-1 rounded-[10px] bg-[#f1f3f7] p-1">
              <Seg on={layout.journeyPlacement === 'panel'} onClick={() => setJourneyPlacement('panel')}>Right-side panel</Seg>
              <Seg on={layout.journeyPlacement === 'header'} onClick={() => setJourneyPlacement('header')}>Header menu</Seg>
            </div>
            <p className="mb-1.5 mt-4 text-xs font-semibold text-muted">When shown as a panel, it collapses:</p>
            <div className="grid grid-cols-2 gap-1 rounded-[10px] bg-[#f1f3f7] p-1">
              <Seg on={layout.journeyCollapse === 'horizontal'} onClick={() => setJourneyCollapse('horizontal')}>Collapse sideways</Seg>
              <Seg on={layout.journeyCollapse === 'vertical'} onClick={() => setJourneyCollapse('vertical')}>Collapse upward</Seg>
            </div>
          </section>

          <section className="card-surface flex flex-col gap-4 p-4">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-sm font-bold text-navy">Panels</h3>
              <span className="text-[11.5px] font-semibold text-muted-soft">{visibleCount} of {organizableCount} shown</span>
            </div>
            {(['main', 'side'] as DashboardZone[]).map((zone) => (
              <PanelList key={zone} zone={zone} layout={layout} disabled={disabled} {...dnd} toggle={toggle} moveWithin={moveWithin} moveZone={moveZone} />
            ))}
          </section>
        </div>

        {/* Live preview */}
        <div className="sticky top-4 min-w-0 flex-[999_1_460px]">
          <section className="card-surface overflow-hidden" aria-labelledby="dashboard-preview-heading">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-teal shadow-[0_0_0_3px_rgba(31,157,148,.18)]" />
                <h3 id="dashboard-preview-heading" className="text-sm font-bold text-navy">Live preview</h3>
                <span className="text-xs text-muted-soft">{activeTemplate?.label ?? 'Custom layout'}</span>
              </div>
              <div className="flex gap-0.5 rounded-[9px] bg-[#f1f3f7] p-0.5">
                <Seg on={device === 'desktop'} onClick={() => setDevice('desktop')}><Monitor size={13} />Desktop</Seg>
                <Seg on={device === 'mobile'} onClick={() => setDevice('mobile')}><Smartphone size={13} />Mobile</Seg>
              </div>
            </div>
            <DashboardLayoutPreview layout={layout} disabled={disabled} device={device} {...dnd} />
          </section>
        </div>
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

const THUMB_H: Record<WidgetId, number> = { nextAction: 15, askKolmari: 10, shortlist: 17, foodHealth: 15, commandCenter: 14, planningAreas: 15, activePathway: 16, deadlines: 15, journeyTracker: 13 }

function TemplateThumb({ template }: { template: (typeof DASHBOARD_TEMPLATES)[number] }) {
  const l = template.layout
  const off = new Set(l.disabled)
  const blocks = (ids: WidgetId[]) => ids.filter((id) => !off.has(id) && !FIXED_WIDGETS.has(id)).map((id) => (
    <span key={id} style={{ height: THUMB_H[id] }}
      className={`flex-none rounded-[3px] border ${id === 'nextAction' ? 'border-navy bg-navy' : 'border-line-strong bg-white'}`} />
  ))
  return (
    <div className="overflow-hidden rounded-[7px] bg-[#eef1f6] p-[5px]">
      <div className="overflow-hidden rounded border border-[#e1e6ee] bg-[#f7f8fb]">
        <div className="flex h-[9px] items-center gap-[3px] border-b border-line bg-white px-1">
          <span className="h-[3px] w-3 rounded-sm bg-navy" />
          {l.journeyPlacement === 'header' && <span className="ml-auto h-1 w-[18px] rounded-sm bg-gold" />}
        </div>
        <div className="flex h-[74px] gap-[3px] overflow-hidden p-1">
          <div className="flex min-w-0 flex-[1.9_1_0] flex-col gap-[3px]">{blocks(l.main)}</div>
          <div className="flex min-w-0 flex-1 flex-col gap-[3px]">{blocks(l.side)}</div>
        </div>
      </div>
    </div>
  )
}

type DndProps = { dragging: WidgetId | null; over: Over; setDragging: (id: WidgetId | null) => void; setOver: (v: Over) => void; drop: (zone: DashboardZone, id?: WidgetId) => void }

function dragHandlers(id: WidgetId, zone: DashboardZone, { dragging, over, setDragging, setOver, drop }: DndProps) {
  return {
    draggable: true,
    onDragStart: (e: DragEvent) => { e.stopPropagation(); e.dataTransfer.effectAllowed = 'move'; setDragging(id) },
    onDragEnd: () => { setDragging(null); setOver(null) },
    onDragOver: (e: DragEvent) => { if (!dragging) return; e.preventDefault(); e.stopPropagation(); if (over?.id !== id) setOver({ zone, id }) },
    onDrop: (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); drop(zone, id) },
    indicator: over?.id === id && dragging !== null && dragging !== id,
  }
}

function zoneHandlers(zone: DashboardZone, { dragging, over, setOver, drop }: DndProps) {
  return {
    onDragOver: (e: DragEvent) => { if (!dragging) return; e.preventDefault(); if (over?.zone !== zone || over.id) setOver({ zone }) },
    onDrop: (e: DragEvent) => { e.preventDefault(); drop(zone) },
  }
}

function PanelList(props: DndProps & { zone: DashboardZone; layout: DashboardLayout; disabled: Set<WidgetId>; toggle: (id: WidgetId) => void; moveWithin: (zone: DashboardZone, id: WidgetId, delta: number) => void; moveZone: (id: WidgetId, zone: DashboardZone) => void }) {
  const { zone, layout, disabled, toggle, moveWithin, moveZone } = props
  const ids = layout[zone]
  const shown = ids.filter((id) => !disabled.has(id)).length
  return (
    <div {...zoneHandlers(zone, props)} className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted-soft">{zone === 'main' ? 'Main column' : 'Second column'}</span>
        <span className="text-[11px] text-muted-soft">{shown} shown</span>
      </div>
      {ids.map((id, index) => {
        const def = widgetDef(id)
        const on = !disabled.has(id)
        const { indicator, ...h } = dragHandlers(id, zone, props)
        return (
          <div key={id} {...h} className={`relative flex items-center gap-2 rounded-[10px] border p-2 ${props.dragging === id ? 'border-gold opacity-50' : 'border-[#edf0f5]'} ${on ? 'bg-white' : 'bg-[#f8f9fb]'}`}>
            {indicator && <span className="absolute inset-x-0 -top-[5px] h-[3px] rounded-sm bg-gold" />}
            <GripVertical size={14} className="flex-none cursor-grab text-muted-soft" />
            <div className="min-w-0 flex-1" title={def.description}>
              <p className={`truncate text-[12.8px] font-semibold ${on ? 'text-navy' : 'text-muted-soft'}`}>{def.label}</p>
              <p className="truncate text-[11px] text-muted-soft">{def.description}</p>
            </div>
            <div className="flex flex-none items-center gap-0.5">
              <IconBtn label={`Move ${def.label} up`} disabled={index === 0} onClick={() => moveWithin(zone, id, -1)}><ArrowUp size={13} /></IconBtn>
              <IconBtn label={`Move ${def.label} down`} disabled={index === ids.length - 1} onClick={() => moveWithin(zone, id, 1)}><ArrowDown size={13} /></IconBtn>
              <IconBtn label={zone === 'main' ? `Move ${def.label} to second column` : `Move ${def.label} to main column`} onClick={() => moveZone(id, zone === 'main' ? 'side' : 'main')}><ArrowLeftRight size={14} /></IconBtn>
              <button type="button" role="switch" aria-checked={on} aria-label={`Show ${def.label}`} onClick={() => toggle(id)}
                className={`ml-1 flex h-[18px] w-8 rounded-full p-0.5 transition-colors ${on ? 'justify-end bg-navy' : 'justify-start bg-[#d6dce6]'}`}>
                <span className={`size-3.5 rounded-full ${on ? 'bg-gold' : 'bg-white'}`} />
              </button>
            </div>
          </div>
        )
      })}
      {ids.length === 0 && <div className="rounded-[10px] border-[1.5px] border-dashed border-line-strong p-3.5 text-center text-xs text-muted-soft">Drop a panel here</div>}
    </div>
  )
}

function IconBtn({ label, disabled, onClick, children }: { label: string; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick} className="grid size-[26px] place-items-center rounded-[7px] text-muted hover:bg-[#f1f3f7] disabled:text-[#d3d9e3] disabled:hover:bg-transparent">{children}</button>
}

/* ─── Live preview ─────────────────────────────────────────
   Renders the real dashboard chrome and panel shapes with static sample
   content, scaled to fit. Driven only by the in-memory layout; it runs no
   Dashboard data queries and mutates no plan state. */

function DashboardLayoutPreview(props: DndProps & { layout: DashboardLayout; disabled: Set<WidgetId>; device: Device }) {
  const { layout, disabled, device } = props
  const stageRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 800, h: 900 })
  const desk = device === 'desktop'
  const baseW = desk ? 1280 : 390

  useEffect(() => {
    const measure = () => {
      const s = stageRef.current, i = innerRef.current
      if (!s || !i) return
      setSize((prev) => {
        const w = s.clientWidth - 36, h = i.offsetHeight
        return Math.abs(w - prev.w) > 1 || Math.abs(h - prev.h) > 1 ? { w, h } : prev
      })
    }
    const ro = new ResizeObserver(measure)
    if (stageRef.current) ro.observe(stageRef.current)
    if (innerRef.current) ro.observe(innerRef.current)
    measure()
    return () => ro.disconnect()
  }, [])

  const scale = Math.max(0.2, desk ? size.w / baseW : Math.min(1, size.w / baseW))
  const vw = Math.round(baseW * scale), vh = Math.round(size.h * scale)
  const headerJ = layout.journeyPlacement === 'header' && !disabled.has('journeyTracker')
  const visible = (ids: WidgetId[]) => ids.filter((id) => !disabled.has(id) && !FIXED_WIDGETS.has(id))
  const cols: [DashboardZone, WidgetId[]][] = [['main', visible(layout.main)], ['side', visible(layout.side)]]

  return (
    <div ref={stageRef} className="max-h-[calc(100vh-110px)] overflow-auto bg-[#e9edf3] p-[18px]">
      <div className={desk ? 'mx-auto overflow-hidden rounded-[10px] bg-white shadow-[0_18px_40px_-20px_rgba(13,27,57,.35),0_0_0_1px_rgba(13,27,57,.08)]' : 'mx-auto rounded-[38px] bg-navy-deep p-2.5 shadow-[0_18px_40px_-20px_rgba(13,27,57,.45)]'} style={{ width: desk ? vw : vw + 20 }}>
        {desk && (
          <div className="flex h-[30px] items-center gap-1.5 border-b border-[#e1e6ee] bg-[#f7f8fb] px-3">
            <span className="size-[9px] rounded-full bg-[#f0a8a0]" /><span className="size-[9px] rounded-full bg-[#f3d27a]" /><span className="size-[9px] rounded-full bg-[#9fd6a8]" />
            <span className="mx-auto rounded-md border border-line bg-white px-10 py-0.5 text-[11px] text-muted-soft">app.kolmari.com/dashboard</span>
          </div>
        )}
        <div className={`relative overflow-hidden bg-canvas ${desk ? '' : 'rounded-[29px]'}`} style={{ width: vw, height: vh }} aria-hidden={false}>
          <div ref={innerRef} className={`absolute left-0 top-0 origin-top-left bg-canvas ${desk ? 'pb-7' : 'pb-5'}`} style={{ width: baseW, transform: `scale(${scale})` }}>
            <div className="flex h-14 items-center gap-3.5 border-b border-line bg-[#f7f8fb] px-5">
              <span className="font-[Poppins,sans-serif] text-[21px] font-extrabold tracking-[-0.015em] text-navy">Kolmari</span>
              {desk && (
                <div className="ml-4 flex gap-0.5 text-[13px] font-semibold text-muted">
                  <span className="rounded-lg border border-line bg-white px-3 py-1.5 font-bold text-navy">Dashboard</span>
                  <span className="px-3 py-1.5">My Plan</span><span className="px-3 py-1.5">Your World</span><span className="px-3 py-1.5">Clubs</span>
                </div>
              )}
              <div className="ml-auto flex items-center gap-2.5">
                {headerJ && (
                  <span className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-gold bg-white py-1.5 pl-3 pr-2.5">
                    <span className="whitespace-nowrap text-[11.5px] font-bold text-navy">Stage 4 of 8 · Prepare</span>
                    {desk && <span className="flex gap-0.5">{SAMPLE.stages.map((s, i) => <span key={s} className={`h-1 w-2.5 rounded-sm ${stageColor(i)}`} />)}</span>}
                    <ChevronDown size={12} strokeWidth={2.4} />
                  </span>
                )}
                <span className="grid size-8 place-items-center rounded-full bg-navy text-xs font-bold text-gold">JR</span>
              </div>
            </div>

            <div className={desk ? 'px-7 pt-6' : 'px-3.5 pt-[18px]'}>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold-deep">Your relocation journey</p>
              <h1 className="mb-4 mt-1 text-[26px] font-bold tracking-[-0.02em] text-navy">Good morning, Jordan</h1>
              <div className={desk ? 'flex items-start gap-5' : 'flex flex-col gap-3.5'}>
                {cols.map(([zone, ids]) => (
                  <div key={zone} {...zoneHandlers(zone, props)} className={`flex min-w-0 flex-col ${desk ? 'gap-4' : 'gap-3.5'} ${desk ? (zone === 'main' ? 'flex-1' : 'w-[380px] flex-none') : ''}`}>
                    {ids.map((id) => {
                      const { indicator, ...h } = dragHandlers(id, zone, props)
                      return (
                        <div key={id} {...h} className="relative cursor-grab rounded-xl hover:outline hover:outline-[3px] hover:outline-offset-[3px] hover:outline-gold">
                          {indicator && <span className="absolute inset-x-0 -top-[11px] z-10 h-[5px] rounded-[3px] bg-gold" />}
                          <PreviewPanel id={id} />
                        </div>
                      )
                    })}
                    {ids.length === 0 && <div className="rounded-xl border-2 border-dashed border-[#d6dce6] px-4 py-10 text-center text-[13px] text-muted-soft">Drop a panel here</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const stageColor = (i: number) => (i < 3 ? 'bg-navy' : i === 3 ? 'bg-gold' : 'bg-line')

const SAMPLE = {
  stages: ['Dream', 'Research', 'Decide', 'Prepare', 'Apply', 'Move', 'Arrive', 'Settle'],
  areas: [['Eligibility', 80], ['Documents', 45], ['Budget', 70], ['Housing', 20], ['Healthcare', 35], ['Schools', 10]] as [string, number][],
  alerts: [
    { title: 'Passport expires in 7 months', meta: 'Renew before D7 filing · Due Nov 14', tag: 'Blocker', dot: 'bg-[#d0493a]', chip: 'bg-[#fdecea] text-[#a3352a]' },
    { title: 'Proof of funds statement', meta: 'Bank letter, 3 months · Due Dec 2', tag: 'Soon', dot: 'bg-[#e0a800]', chip: 'bg-[#fdf4d6] text-[#8a6a00]' },
    { title: 'Book NIF appointment', meta: 'Lisbon Loja do Cidadão · Jan 8', tag: 'Dated', dot: 'bg-[#a3aec0]', chip: 'bg-[#f1f3f7] text-muted' },
  ],
  shortlist: [
    { name: 'Portugal', match: '92', s1: 'Cost of living · Moderate', s2: 'English · Common', bg: 'linear-gradient(160deg,#1b3f68,#3f86a8)' },
    { name: 'Spain', match: '87', s1: 'Cost of living · Moderate', s2: 'English · Some', bg: 'linear-gradient(160deg,#2a4a3a,#6f9a6a)' },
    { name: 'Netherlands', match: '81', s1: 'Cost of living · High', s2: 'English · Widespread', bg: 'linear-gradient(160deg,#1b3f68,#3f86a8)' },
  ],
}

const card = 'rounded-xl border border-line bg-white shadow-[0_1px_3px_0_rgba(16,34,68,.08)]'
const Bar = ({ pct, tone = 'bg-navy' }: { pct: number; tone?: string }) => (
  <div className="h-[5px] overflow-hidden rounded-full bg-[#eef1f6]"><div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} /></div>
)
const Head = ({ title, link }: { title: string; link?: string }) => (
  <div className="flex items-center justify-between gap-3"><h2 className="text-[15px] font-bold text-navy">{title}</h2>{link && <span className="text-xs font-bold text-info">{link}</span>}</div>
)

function PreviewPanel({ id }: { id: WidgetId }) {
  switch (id) {
    case 'nextAction':
      return (
        <div className="rounded-xl bg-[linear-gradient(135deg,#0d1b39_0%,#17305b_58%,#1b3f68_100%)] px-[22px] py-5 text-white">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold">Recommended next action</p>
          <h2 className="mt-2 text-xl font-bold tracking-[-0.015em]">Open your international bank account</h2>
          <p className="mt-2 max-w-[56ch] text-[13.5px] leading-[1.62] text-white/80">Three later tasks depend on this one: proof of funds, your D7 filing, and your first rent deposit. Due Nov 30.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-lg bg-gold px-4 py-2.5 text-[13px] font-bold text-navy-deep">Open in My Plan</span>
            <span className="rounded-lg border border-white/25 px-4 py-2.5 text-[13px] font-semibold">Why this matters</span>
          </div>
        </div>
      )
    case 'planningAreas':
      return (
        <div className={`${card} px-5 pb-5 pt-[18px]`}>
          <Head title="Progress by planning area" link="View plan" />
          <div className="mt-4 grid grid-cols-2 gap-x-[18px] gap-y-3">
            {SAMPLE.areas.map(([label, pct]) => (
              <div key={label}>
                <div className="mb-1.5 flex items-baseline justify-between gap-2"><span className="text-[12.5px] font-semibold text-navy">{label}</span><span className="text-[11.5px] font-bold text-muted">{pct}%</span></div>
                <Bar pct={pct} tone={pct < 30 ? 'bg-gold-deep' : 'bg-navy'} />
              </div>
            ))}
          </div>
        </div>
      )
    case 'deadlines':
      return (
        <div className={`${card} overflow-hidden`}>
          <div className="border-b border-line px-[17px] pb-3 pt-[15px]"><h2 className="text-[15px] font-bold text-navy">Deadlines and blockers</h2></div>
          {SAMPLE.alerts.map((a) => (
            <div key={a.title} className="flex items-start gap-3 border-b border-[#f0f3f7] px-[17px] py-3">
              <span className={`mt-1.5 size-2 flex-none rounded-full ${a.dot}`} />
              <div className="min-w-0 flex-1"><p className="text-[12.8px] font-semibold leading-snug text-navy">{a.title}</p><p className="mt-0.5 text-[11px] text-muted-soft">{a.meta}</p></div>
              <span className={`flex-none rounded-full px-2 py-0.5 text-[10px] font-bold ${a.chip}`}>{a.tag}</span>
            </div>
          ))}
        </div>
      )
    case 'activePathway':
      return (
        <div className={`${card} px-[18px] pb-[18px] pt-4`}>
          <div className="flex items-center justify-between"><h2 className="text-[15px] font-bold text-navy">Active pathway</h2><span className="rounded-full bg-teal-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-teal-deep">In plan</span></div>
          <p className="mt-2.5 text-sm font-bold text-navy">D7 Passive Income Visa</p>
          <p className="text-[11.5px] text-muted-soft">Portugal · Temporary residence, renewable</p>
          <div className="mb-1.5 mt-3 flex justify-between text-[11px] font-semibold text-muted"><span>Step 3 of 7</span><span>43%</span></div>
          <Bar pct={43} />
          <div className="mt-3 flex flex-col gap-1.5 text-xs">
            {[['Confirm eligibility', true], ['Open Portuguese bank account', true], ['Gather proof of passive income', false]].map(([t, done]) => (
              <div key={String(t)} className="flex items-center gap-2">
                <span className={`grid size-[15px] flex-none place-items-center rounded ${done ? 'bg-navy' : 'border-[1.5px] border-[#c3ccd9]'}`}>{done && <Check size={9} strokeWidth={3.4} className="text-white" />}</span>
                <span className={done ? 'text-muted-soft line-through' : 'font-semibold text-navy'}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      )
    case 'journeyTracker':
      return (
        <div className={`${card} px-[18px] pb-[18px] pt-4`}>
          <Head title="Your journey" link="My Plan" />
          <p className="mt-1 text-xs text-muted">Stage 4 of 8 · <strong className="text-navy">Prepare</strong> · 11 of 19 tasks done</p>
          <div className="mt-3 grid grid-cols-8 gap-1">
            {SAMPLE.stages.map((s, i) => (
              <div key={s} className="min-w-0"><div className={`h-1.5 rounded-[3px] ${stageColor(i)}`} /><p className={`mt-1 truncate text-[9.5px] ${i === 3 ? 'font-bold' : 'font-medium'} ${i <= 3 ? 'text-navy' : 'text-[#a3aec0]'}`}>{s}</p></div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-[9px] border border-[#f6d8d2] bg-[#fff6f4] px-3 py-2">
            <span className="size-[7px] flex-none rounded-full bg-[#d0493a]" />
            <span className="text-[11.5px] font-semibold text-[#8c2e22]">1 blocker: passport expires before your D7 filing</span>
          </div>
        </div>
      )
    case 'askKolmari':
      return (
        <div className={`${card} px-[18px] pb-[18px] pt-4`}>
          <h2 className="text-[15px] font-bold text-navy">Ask Kolmari</h2>
          <div className="mt-3 flex items-center gap-2.5 rounded-[10px] border border-line-strong bg-[#f9fafc] py-2.5 pl-3.5 pr-2.5">
            <span className="flex-1 text-[13px] text-muted-soft">Ask about visas, taxes, schools…</span>
            <span className="grid size-[30px] place-items-center rounded-lg bg-navy text-gold">→</span>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {['Can I keep my US 401(k)?', 'D7 vs D8 for freelancers', 'Schools in Lisbon'].map((q) => <span key={q} className="rounded-full bg-info-soft px-2.5 py-1 text-[11.5px] font-semibold text-info">{q}</span>)}
          </div>
        </div>
      )
    case 'shortlist':
      return (
        <div className={`${card} px-[18px] pb-[18px] pt-4`}>
          <Head title="Your shortlist" link="Compare" />
          <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2.5">
            {SAMPLE.shortlist.map((s) => (
              <div key={s.name} className="overflow-hidden rounded-[10px] border border-line">
                <div className="relative h-[70px]" style={{ background: s.bg }}><span className="absolute right-2 top-2 rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-navy-deep">{s.match}</span></div>
                <div className="px-3 pb-3 pt-2"><p className="text-[13px] font-bold text-navy">{s.name}</p><p className="mt-0.5 text-[10.8px] text-muted-soft">{s.s1}</p><p className="text-[10.8px] text-muted-soft">{s.s2}</p></div>
              </div>
            ))}
          </div>
        </div>
      )
    case 'foodHealth':
      return (
        <div className={`${card} px-[18px] pb-[18px] pt-4`}>
          <div className="flex items-baseline justify-between"><h2 className="text-[15px] font-bold text-navy">Food &amp; health fit</h2><span className="text-[11px] text-muted-soft">Portugal</span></div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">{['Atlantic seafood', 'Bakery & pastry', 'Grilled meats'].map((c) => <span key={c} className="rounded-full bg-[#f4f6fa] px-2.5 py-1 text-[11.5px] font-semibold text-navy">{c}</span>)}</div>
          <div className="mt-3 flex flex-col gap-2">
            {([['Shellfish', 85, 'Very common'], ['Gluten', 70, 'Common'], ['Tree nuts', 40, 'Moderate']] as [string, number, string][]).map(([n, p, l]) => (
              <div key={n} className="grid grid-cols-[78px_minmax(0,1fr)_auto] items-center gap-2.5 text-xs"><span className="font-semibold text-navy">{n}</span><Bar pct={p} tone={p > 80 ? 'bg-[#d0493a]' : 'bg-gold-deep'} /><span className="text-[10.8px] text-muted-soft">{l}</span></div>
            ))}
          </div>
        </div>
      )
    case 'commandCenter':
      return (
        <div className={`${card} overflow-hidden`}>
          <div className="border-b border-line px-[17px] pb-3 pt-[15px]"><Head title="Command Center" link="Open" /></div>
          {([['Portugal', '5 of 6 areas researched', 78], ['Spain', '3 of 6 areas researched', 54], ['Netherlands', '2 of 6 areas researched', 31]] as [string, string, number][]).map(([n, m, p]) => (
            <div key={n} className="grid grid-cols-[minmax(0,1fr)_90px_38px] items-center gap-3 border-b border-[#f0f3f7] px-[17px] py-3">
              <div className="min-w-0"><p className="text-[12.8px] font-semibold text-navy">{n}</p><p className="text-[10.8px] text-muted-soft">{m}</p></div>
              <Bar pct={p} /><span className="text-right text-xs font-bold text-navy">{p}%</span>
            </div>
          ))}
        </div>
      )
  }
}
