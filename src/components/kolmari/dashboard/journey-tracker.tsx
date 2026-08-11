'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Compass,
  FileText,
  MapPin,
  Plane,
  Scale,
  type LucideIcon,
} from 'lucide-react'
import type { JourneyStageRow, PlanStage } from '@/lib/plan-types'
import { ButterflyMark } from '@/components/kolmari/butterfly-mark'

/**
 * Journey tracker — a collapsible vertical progress rail docked to the right of
 * the dashboard.
 *
 * Every value shown is real: the current stage and per-stage task states come
 * from the saved Kolmari Plan (via `journeyStages`), and the saved-at stamp is
 * the plan's own `updated_at`. Where a stage has no tasks saved yet the tracker
 * shows Kolmari's suggested steps for that stage, clearly marked as suggestions
 * rather than counted as progress.
 */

/** Stage glyphs. State reads through the disc, not the icon. */
const STAGE_ICON: Record<Exclude<PlanStage, 'Settle In'>, LucideIcon> = {
  Explore: Compass,
  Assess: ClipboardCheck,
  Shortlist: Scale,
  Decide: MapPin,
  Prepare: Calendar,
  Apply: FileText,
  Move: Plane,
}

/** Settle uses Kolmari's own butterfly, tinted to the disc's state colour. */
function StageGlyph({ stage }: { stage: PlanStage }) {
  if (stage === 'Settle In') return <ButterflyMark className="jt-bf" gold="currentColor" />
  const Icon = STAGE_ICON[stage]
  return <Icon size={13} strokeWidth={2} aria-hidden="true" />
}

/**
 * Kolmari's suggested steps per stage. Product content, not user data — shown
 * only when the user has saved no tasks of their own for that stage, and always
 * labelled "Suggested" so it is never mistaken for tracked progress.
 */
const STAGE_SUGGESTIONS: Record<PlanStage, string[]> = {
  Explore: ['Take the fit quiz', 'Set household and budget', 'Shortlist first countries'],
  Assess: ['Income threshold check', 'Visa family match', 'Healthcare eligibility'],
  Shortlist: ['Side-by-side cost run', 'City shortlist', 'Tax exposure read'],
  Decide: ['Pick primary country', 'Lock target move date', 'Choose your pathway', 'Open international bank account'],
  Prepare: ['Gather civil documents', 'Apostille and translation', 'Draft moving budget', 'Insurance quote'],
  Apply: ['Book consulate appointment', 'Submit application', 'Track the decision'],
  Move: ['Book flights', 'Ship or sell', 'Sign first lease', 'Register arrival'],
  'Settle In': ['Residency card', 'Tax number and local bank', 'Schools and healthcare', 'Language and community'],
}

export function JourneyTracker({
  rows, currentStage, currentStageName, percent, totalStages, savedAt,
}: {
  rows: JourneyStageRow[]
  currentStage: number
  currentStageName: string
  percent: number
  totalStages: number
  savedAt: string | null
}) {
  const [open, setOpen] = useState(true)
  // Only one stage expanded at a time; the current stage starts open.
  const [expanded, setExpanded] = useState<number | null>(currentStage)

  return (
    <aside className="jt-shell" data-open={open ? 'true' : 'false'} aria-label="Journey tracker">
      {/* Collapsed rail */}
      <button
        type="button"
        className="jt-rail"
        onClick={() => setOpen(true)}
        aria-label="Expand journey tracker"
        aria-expanded={open}
        tabIndex={open ? -1 : 0}
      >
        <span className="jt-rail-badge" aria-hidden="true"><ChevronLeft size={14} strokeWidth={2.4} /></span>
        <span className="jt-rail-word">Journey</span>
        <span className="jt-rail-dots" aria-hidden="true">
          {rows.map((row) => (
            <i key={row.index} data-state={row.state} />
          ))}
        </span>
        <span className="jt-rail-count">{currentStage}/{totalStages}</span>
      </button>

      {/* Expanded panel */}
      <div className="jt-panel" aria-hidden={!open}>
        <div className="jt-head">
          <div className="jt-head-top">
            <div className="min-w-0">
              <p className="jt-eyebrow">Progress tracker</p>
              <h2 className="jt-title">Journey</h2>
            </div>
            <button
              type="button"
              className="jt-collapse"
              onClick={() => setOpen(false)}
              aria-label="Collapse journey tracker"
              tabIndex={open ? 0 : -1}
            >
              <ChevronRight size={15} strokeWidth={2.3} aria-hidden="true" />
            </button>
          </div>
          <div className="jt-summary">
            <span>Stage <b>{currentStage}</b> of {totalStages} · {currentStageName}</span>
            <span className="jt-pct">{percent}%</span>
          </div>
          <div className="jt-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Journey completion">
            <i style={{ width: `${percent}%` }} />
          </div>
        </div>

        <ol className="jt-stages">
          {rows.map((row) => {
            const isOpen = expanded === row.index
            const suggestions = row.tasks.length === 0 ? STAGE_SUGGESTIONS[row.stage] : null
            return (
              <li key={row.index} className="jt-stage" data-state={row.state} data-open={isOpen ? 'true' : 'false'}>
                <button
                  type="button"
                  className="jt-stage-row"
                  aria-expanded={isOpen}
                  onClick={() => setExpanded(isOpen ? null : row.index)}
                >
                  <span className="jt-disc" aria-hidden="true">
                    {row.state === 'done'
                      ? <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                      : <StageGlyph stage={row.stage} />}
                  </span>
                  <span className="jt-stage-text">
                    <span className="jt-stage-name">{row.label}</span>
                    <span className="jt-stage-meta">{row.meta}</span>
                  </span>
                  <ChevronDown size={13} className="jt-chev" strokeWidth={2.2} aria-hidden="true" />
                </button>

                {isOpen && (
                  <div className="jt-tasks">
                    {row.tasks.map((task) => (
                      <p key={task.id} className="jt-task" data-status={task.status}>
                        <i aria-hidden="true" />
                        <span className="jt-task-label">{task.text}</span>
                        {task.tag && <span className="jt-blocker">{task.tag}</span>}
                      </p>
                    ))}

                    {suggestions && (
                      <>
                        <p className="jt-suggested-label">Suggested steps</p>
                        {suggestions.map((text) => (
                          <p key={text} className="jt-task jt-task-suggested" data-status="todo">
                            <i aria-hidden="true" />
                            <span className="jt-task-label">{text}</span>
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ol>

        <div className="jt-foot">
          <Link href="/my-plan" className="jt-cta">Open My Plan</Link>
          {savedAt && <span className="jt-saved">Saved {savedAt}</span>}
        </div>
      </div>
    </aside>
  )
}
