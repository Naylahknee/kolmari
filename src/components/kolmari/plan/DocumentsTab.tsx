'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download, Plus, Search } from 'lucide-react'
import {
  DOC_STATUS_LABELS, DOC_STATUS_ORDER, DOC_STEPS, docCounts, documentStep,
  formatShortDate, newId, processingBuckets, type DocStatus, type DocumentItem,
} from '@/lib/plan-types'
import { StatusBadge, StatusDot, Stepper, type PlanCtx } from './shared'

export function DocumentsTab({ ctx }: { ctx: PlanCtx }) {
  const { plan, update } = ctx
  const docs = plan.documents
  const [name, setName] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | DocStatus>('all')
  const [showAll, setShowAll] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const counts = docCounts(plan)
  const progressing = counts.total - counts.MISSING
  const pct = counts.total ? Math.round((progressing / counts.total) * 100) : 0
  const step = documentStep(plan)
  const processing = processingBuckets(plan)
  const deadlines = docs.filter((d) => d.expirationDate && d.status !== 'APPROVED').sort((a, b) => (a.expirationDate ?? '').localeCompare(b.expirationDate ?? ''))
  const nextDoc = docs.find((d) => d.status === 'UPLOADED' || d.status === 'TRANSLATED' || d.status === 'APOSTILLED') ?? docs.find((d) => d.status === 'MISSING')

  function setDocs(next: DocumentItem[]) { update('documents', next) }
  function add() {
    const clean = name.trim()
    if (!clean || docs.some((d) => d.name.toLowerCase() === clean.toLowerCase())) return
    setDocs([...docs, { id: newId('d'), name: clean, status: 'MISSING', expirationDate: null, note: null }])
    setName('')
  }
  function patch(id: string, changes: Partial<DocumentItem>) { setDocs(docs.map((d) => (d.id === id ? { ...d, ...changes } : d))) }
  function remove(id: string) {
    const doc = docs.find((d) => d.id === id)
    if (doc && !window.confirm(`Remove “${doc.name}”?`)) return
    setDocs(docs.filter((d) => d.id !== id))
    setEditingId(null)
  }
  function download() {
    if (!docs.length) return
    const lines = docs.map((d) => `- [${d.status === 'APPROVED' ? 'x' : ' '}] ${d.name}${d.note ? ` (${d.note})` : ''}${d.expirationDate ? ` — expires ${d.expirationDate}` : ''}`)
    const blob = new Blob([`My Plan — Documents\n\n${lines.join('\n')}\n`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'kolmari-documents.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const q = query.trim().toLowerCase()
  const filtered = docs.filter((d) => (statusFilter === 'all' || d.status === statusFilter) && (!q || d.name.toLowerCase().includes(q)))
  const shown = showAll ? filtered : filtered.slice(0, 8)
  const eyebrow = [plan.saved_nextination, plan.selected_pathway].filter(Boolean).join(' · ')

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.85fr)_minmax(260px,.85fr)]">
      <div className="space-y-5">
        {/* Header + progress */}
        <section className="card-surface p-5">
          {eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{eyebrow}</p>}
          <h2 className="mt-1 text-xl font-bold text-navy">Document workspace</h2>
          <p className="mt-1 text-sm text-muted">Collect, authenticate, translate, compile, and submit your visa documents.</p>
          {counts.total > 0 && (
            <>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-sm font-bold text-navy">{progressing} of {counts.total} ready or in progress</span>
                <span className="text-sm font-bold text-muted">{pct}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} /></div>
            </>
          )}
        </section>

        {/* Document workflow */}
        {step && (
          <section className="card-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-navy">Document workflow</h3>
                <p className="mt-0.5 text-xs text-muted">The detailed workflow inside your Prepare stage.</p>
              </div>
              <span className="shrink-0 rounded-full bg-gold-soft px-3 py-1.5 text-[11px] font-bold text-gold-deep">Step {step.index + 1} of 5</span>
            </div>
            <div className="mt-5 overflow-x-auto pb-1">
              <div className="min-w-[480px]">
                <Stepper ariaLabel="Document workflow" items={DOC_STEPS.map((s) => ({ label: s }))} current={step.index} />
              </div>
            </div>
          </section>
        )}

        {/* Master document list */}
        <section className="card-surface p-5" aria-label="Documents">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-navy">Documents</h3>
              <p className="mt-0.5 text-xs text-muted">One master list for every required document.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input className="field h-9 w-36 pl-8 text-xs" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" aria-label="Search documents" />
              </div>
              <select className="field h-9 w-auto text-xs" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} aria-label="Filter by status">
                <option value="all">All statuses</option>
                {DOC_STATUS_ORDER.map((s) => <option key={s} value={s}>{DOC_STATUS_LABELS[s]}</option>)}
              </select>
            </div>
          </div>

          {/* Add document */}
          <div className="mt-4 flex gap-2">
            <input className="field flex-1" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }} placeholder="Add a document you need" aria-label="New document" />
            <button type="button" onClick={add} aria-label="Add document" className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-btn)] bg-navy text-white"><Plus size={17} /></button>
          </div>

          <ul className="mt-4 divide-y divide-line">
            {shown.length === 0 ? (
              <li className="py-6 text-center text-sm text-muted">{docs.length ? 'No documents match your filters.' : 'No documents yet — add the records your pathway requires.'}</li>
            ) : shown.map((doc) => (
              <li key={doc.id} className="py-3">
                <div className="flex items-center gap-3">
                  <StatusDot status={doc.status} />
                  <button type="button" onClick={() => setEditingId(editingId === doc.id ? null : doc.id)} className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-bold text-navy">{doc.name}</p>
                    <p className="truncate text-xs text-muted">
                      {doc.note ?? 'Tap to set status & expiration'}
                      {doc.expirationDate ? ` · Expires ${formatShortDate(doc.expirationDate)}` : ''}
                    </p>
                  </button>
                  <StatusBadge status={doc.status} />
                </div>
                {editingId === doc.id && (
                  <div className="mt-3 space-y-3 rounded-[var(--radius-field)] bg-canvas p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label className="text-xs font-semibold text-navy">Status
                        <select className="field mt-1" value={doc.status} onChange={(e) => patch(doc.id, { status: e.target.value as DocStatus })}>
                          {DOC_STATUS_ORDER.map((s) => <option key={s} value={s}>{DOC_STATUS_LABELS[s]}</option>)}
                        </select>
                      </label>
                      <label className="text-xs font-semibold text-navy">Expiration / deadline
                        <input className="field mt-1" type="date" value={doc.expirationDate ?? ''} onChange={(e) => patch(doc.id, { expirationDate: e.target.value || null })} />
                      </label>
                    </div>
                    <input className="field" value={doc.note ?? ''} onChange={(e) => patch(doc.id, { note: e.target.value || null })} placeholder="Note (e.g. state-issued long form)" aria-label="Document note" />
                    <button type="button" onClick={() => remove(doc.id)} className="text-xs font-bold text-danger hover:underline">Remove document</button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            {filtered.length > 8 && <button type="button" onClick={() => setShowAll((v) => !v)} className="rounded-[var(--radius-btn)] border border-line px-3.5 py-2 text-xs font-bold text-navy hover:bg-canvas">{showAll ? 'Show fewer' : `View all ${filtered.length} documents`}</button>}
            {docs.length > 0 && <button type="button" onClick={download} className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-deep hover:underline"><Download size={13} aria-hidden="true" /> Download checklist</button>}
          </div>
        </section>

        {/* Processing time combines tracking counts with clearly labeled planning estimates. */}
        {(processing.apostille > 0 || processing.translation > 0) && (
          <section className="card-surface p-5">
            <h3 className="text-base font-bold text-navy">Processing time</h3>
            <p className="mt-0.5 text-xs text-muted">Apostille tracking and time impact combined.</p>
            <div className="mt-4 space-y-5 text-sm">
              <ProcessingRow count={processing.apostille} label="in apostille" estimate="2–6 weeks" progress={58} tone="gold" />
              <ProcessingRow count={processing.translation} label="in translation" estimate="1–2 weeks" progress={31} tone="info" />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-field)] bg-navy-deep px-4 py-3 text-xs text-white">
              <p className="font-semibold">Plan ahead: third-party processing time is outside your control.</p>
              <Link href="/greenbook" className="font-bold text-white underline-offset-4 hover:underline">Review planning guidance</Link>
            </div>
          </section>
        )}
      </div>

      {/* Right column */}
      <aside className="space-y-5">
        <section className="card-surface p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Next action</p>
          {nextDoc ? (
            <>
              <p className="mt-2 text-sm font-bold text-navy">{nextDoc.name}</p>
              <p className="mt-1 text-xs text-muted">{DOC_STATUS_LABELS[nextDoc.status]}{nextDoc.expirationDate ? ` · expires ${formatShortDate(nextDoc.expirationDate)}` : ''}</p>
              <button type="button" onClick={() => { setShowAll(true); setEditingId(nextDoc.id) }} className="gold-button mt-4 w-full text-xs">View details</button>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted">{docs.length ? 'Every document is ready.' : 'Add documents to see your next action.'}</p>
          )}
        </section>

        <section className="card-surface p-5">
          <p className="text-base font-bold text-navy">Upcoming deadlines</p>
          <p className="mt-0.5 text-xs text-muted">Nearest dates first.</p>
          <ul className="mt-3 divide-y divide-line text-sm">
            {deadlines.length === 0 ? <li className="text-xs text-muted">No document deadlines yet. Add an expiration date on a document to track it.</li> : deadlines.slice(0, 5).map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-3 first:pt-0">
                <span className="min-w-0 truncate font-semibold text-navy">{d.name}</span>
                <span className="shrink-0 text-xs font-bold text-gold-deep">{formatShortDate(d.expirationDate)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card-surface p-5 lg:mt-56">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Need help?</p>
          <p className="mt-3 text-sm text-muted">Get clarity on a requirement.</p>
          <div className="mt-3 grid gap-2">
            <Link href="/pathways" className="rounded-[var(--radius-btn)] border border-line-strong bg-white px-3.5 py-2.5 text-center text-xs font-bold text-navy hover:bg-canvas">View pathway requirements</Link>
            <Link href="/community" className="rounded-[var(--radius-btn)] border border-line-strong bg-white px-3.5 py-2.5 text-center text-xs font-bold text-navy hover:bg-canvas">Ask the community</Link>
          </div>
        </section>
      </aside>
    </div>
  )
}

function ProcessingRow({ count, label, estimate, progress, tone }: { count: number; label: string; estimate: string; progress: number; tone: 'gold' | 'info' }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold text-navy">{count} document{count === 1 ? '' : 's'} {label}</span>
        <span className="text-xs text-muted">{estimate}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
        <div className={`h-full rounded-full ${tone === 'gold' ? 'bg-gold' : 'bg-info'}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
