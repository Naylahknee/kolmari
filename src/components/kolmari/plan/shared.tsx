'use client'

import { Check } from 'lucide-react'
import { DOC_STATUS_LABELS, PLAN_TABS, type DocStatus, type KolmariPlan, type TabId } from '@/lib/plan-types'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export { PLAN_TABS }
export type { TabId }

// Everything each tab needs from the workspace container.
export type PlanCtx = {
  plan: KolmariPlan
  update: <K extends keyof KolmariPlan>(key: K, value: KolmariPlan[K]) => void
  goToTab: (tab: TabId) => void
  openDetails: () => void
  saveStatus: SaveStatus
  savedAtLabel: string | null
  retry: () => void
  nextinations: string[]
  pathways: string[]
  monthlyIncome: number | null
}

export function SaveChip({ status, onRetry, className = '' }: { status: SaveStatus; onRetry?: () => void; className?: string }) {
  if (status === 'error') {
    return (
      <span className={`inline-flex items-center gap-2 text-xs font-semibold text-danger ${className}`} role="status">
        Save failed
        {onRetry && <button type="button" onClick={onRetry} className="rounded-full border border-danger/40 px-2 py-0.5 font-bold hover:bg-danger/5">Retry</button>}
      </span>
    )
  }
  const label = status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : 'All changes saved'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${status === 'saving' ? 'bg-canvas text-muted' : 'bg-ok-soft text-ok'} ${className}`}
      role="status"
      aria-live="polite"
    >
      {label}
    </span>
  )
}

export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-line ${className}`}>
      <div className="h-full rounded-full bg-gold transition-[width]" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

const STATUS_STYLES: Record<DocStatus, string> = {
  APPROVED: 'bg-ok-soft text-ok',
  UPLOADED: 'bg-gold-soft text-gold-deep',
  TRANSLATED: 'bg-gold-soft text-gold-deep',
  APOSTILLED: 'bg-gold-soft text-gold-deep',
  MISSING: 'bg-canvas text-muted',
}
const STATUS_DOT: Record<DocStatus, string> = {
  APPROVED: 'bg-ok', UPLOADED: 'bg-gold', TRANSLATED: 'bg-gold', APOSTILLED: 'bg-gold', MISSING: 'bg-muted/50',
}
export function StatusDot({ status }: { status: DocStatus }) {
  return <span className={`size-2.5 shrink-0 rounded-full ${STATUS_DOT[status]}`} aria-hidden="true" />
}
export function StatusBadge({ status }: { status: DocStatus }) {
  return <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLES[status]}`}>{DOC_STATUS_LABELS[status]}</span>
}

type StepItem = { label: string; hint?: string }
export function Stepper({ items, current, onSelect, ariaLabel }: { items: StepItem[]; current: number; onSelect?: (index: number) => void; ariaLabel: string }) {
  return (
    <ol className="flex items-start" aria-label={ariaLabel}>
      {items.map((item, index) => {
        const done = index < current
        const active = index === current
        const node = (
          <span
            className={[
              'relative z-10 grid size-8 place-items-center rounded-full border-2 text-xs font-bold transition-colors',
              done ? 'border-ok bg-ok text-white'
                : active ? 'border-gold bg-gold text-navy'
                : 'border-line bg-white text-muted',
            ].join(' ')}
          >
            {done ? <Check size={15} strokeWidth={3} aria-hidden="true" /> : index + 1}
          </span>
        )
        return (
          <li key={item.label} className="flex flex-1 flex-col items-center text-center last:flex-none">
            <div className="flex w-full items-center">
              <span className={`h-0.5 flex-1 ${index === 0 ? 'opacity-0' : 'bg-line'}`} aria-hidden="true" />
              {onSelect ? (
                <button type="button" onClick={() => onSelect(index)} aria-current={active ? 'step' : undefined} aria-label={`${item.label}${active ? ' (current)' : ''}`} className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                  {node}
                </button>
              ) : node}
              <span className={`h-0.5 flex-1 ${index === items.length - 1 ? 'opacity-0' : 'bg-line'}`} aria-hidden="true" />
            </div>
            <span className={`mt-2 px-1 text-xs font-bold ${active ? 'text-navy' : done ? 'text-navy/70' : 'text-muted'}`}>{item.label}</span>
            {item.hint && <span className="text-[10px] text-muted">{item.hint}</span>}
          </li>
        )
      })}
    </ol>
  )
}
