'use client'

import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'

/* Shared, reusable Personalized Summary for every country page (Country Design
 * System). One implementation — never a per-country variant. Renders only when
 * the caller has real, calculated Match Score data (the page decides visibility;
 * this component never fabricates or shows an empty placeholder). */
export type PersonalizedCountrySummaryProps = {
  countrySlug: string
  summary: string
  explanation: string
  /** Discrete reason phrases; rendered as a spaced list. Falls back to
   *  `explanation` as a single paragraph when empty. */
  reasons?: string[]
  overallFit: number
  blockingIssue: { label: string; detail?: string }
  outcome: { label: string; value: string; detail?: string }
  callouts: Array<{ title: string; body: string }>
  rank: number
  totalRanked: number
  categoryScores: Array<{ label: string; score: number }>
  defaultOpen: boolean
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-[var(--radius-field)] border border-line bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-lg font-bold leading-tight text-navy">{value}</p>
      {detail && <p className="mt-0.5 text-[11px] leading-4 text-muted">{detail}</p>}
    </div>
  )
}

export function PersonalizedCountrySummary({
  summary, explanation, reasons, overallFit, blockingIssue, outcome, callouts, rank, totalRanked, categoryScores, defaultOpen,
}: PersonalizedCountrySummaryProps) {
  const reasonList = (reasons ?? []).map((r) => r.trim()).filter(Boolean)
  const [open, setOpen] = useState(defaultOpen)
  const bodyId = useId()

  return (
    <section className="card-surface overflow-hidden p-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="flex w-full items-center gap-3 p-5 text-left transition hover:bg-gold-soft/15"
      >
        <span className="mt-1 size-2.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-gold-deep">Personalized Summary</span>
          <span className="mt-0.5 block truncate text-sm font-semibold text-navy">{summary}</span>
        </span>
        <ChevronDown size={18} className={`shrink-0 text-muted transition ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div id={bodyId} className="border-t border-line p-5 pt-4">
          {reasonList.length > 0 ? (
            <ul className="max-w-3xl space-y-2">
              {reasonList.map((reason, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-6 text-navy/85">
                  <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="max-w-3xl text-sm leading-6 text-navy/85">{explanation}</p>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MetricCard label="Overall Fit" value={`${overallFit}%`} detail={`Rank #${rank} of ${totalRanked}`} />
            <MetricCard label="Blocking Issue" value={blockingIssue.label} detail={blockingIssue.detail} />
            <MetricCard label={outcome.label} value={outcome.value} detail={outcome.detail} />
          </div>

          {categoryScores.length > 0 && (
            <div className="mt-4 space-y-2">
              {categoryScores.map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-[11px] font-semibold text-muted">{c.label}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                    <span className="block h-full rounded-full bg-gold" style={{ width: `${Math.max(0, Math.min(100, c.score))}%` }} />
                  </span>
                  <span className="w-9 shrink-0 text-right text-[11px] font-bold text-navy">{c.score}%</span>
                </div>
              ))}
            </div>
          )}

          {callouts.length > 0 && (
            <div className="mt-4 space-y-2.5">
              {callouts.map((c, i) => (
                <div key={i} className="rounded-[var(--radius-field)] border-l-[3px] border-gold bg-gold-soft/30 px-3.5 py-2.5">
                  <p className="text-sm font-bold text-navy">{c.title}</p>
                  <p className="mt-0.5 text-[13px] leading-5 text-navy/80">{c.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
