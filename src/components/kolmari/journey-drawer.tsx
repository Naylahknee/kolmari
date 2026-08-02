'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import type { JourneyStage, JourneyStageRow } from '@/lib/plan-types'

/**
 * Kolmari Tracker — the vertical journey drawer that lives on the right edge of
 * the Dashboard. Expanded it is a 322px card listing all eight plan stages with
 * their saved tasks; collapsed it becomes a 56px rail that still shows stage
 * position. All content is passed in already derived from real plan data.
 */
export function JourneyDrawer({
  rows,
  currentStage,
  currentStageName,
  percent,
  totalStages,
  savedAt,
}: {
  rows: JourneyStageRow[]
  currentStage: JourneyStage
  currentStageName: string
  percent: number
  totalStages: number
  savedAt: string | null
}) {
  const [collapsed, setCollapsed] = useState(false)
  // Only one stage is open at a time; the stage the user is actually in opens first.
  const [openStage, setOpenStage] = useState<number | null>(currentStage)
  // Below the workspace mobile breakpoint the drawer is always shown in full,
  // so the collapsed state must not hide the panel from assistive technology.
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 900px)')
    const sync = () => setCompact(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  const panelHidden = collapsed && !compact

  return (
    <div className={`k-journey${collapsed ? ' is-collapsed' : ''}`}>
      <section className="k-journey-panel" aria-labelledby="journey-heading" aria-hidden={panelHidden}>
        <header className="k-journey-head">
          <div className="k-journey-head-top">
            <div>
              <p className="k-journey-eyebrow">Progress tracker</p>
              <h2 id="journey-heading" className="k-journey-title">Journey</h2>
            </div>
            <button
              type="button"
              className="k-journey-collapse"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse progress tracker"
              aria-expanded={!collapsed}
              tabIndex={panelHidden ? -1 : undefined}
            >
              <ChevronRight size={15} aria-hidden="true" />
            </button>
          </div>

          <p className="k-journey-status">
            <span>Stage {currentStage} of {totalStages} · {currentStageName}</span>
            <span className="k-journey-pct">{percent}%</span>
          </p>
          <div
            className="k-journey-bar"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Journey completion"
          >
            <span style={{ width: `${percent}%` }} />
          </div>
        </header>

        <ol className="k-journey-list">
          {rows.map((row) => {
            const open = openStage === row.index
            return (
              <li key={row.stage} className="k-journey-stage" data-state={row.state}>
                <button
                  type="button"
                  className="k-journey-row"
                  onClick={() => setOpenStage(open ? null : row.index)}
                  aria-expanded={open}
                  tabIndex={panelHidden ? -1 : undefined}
                >
                  <span className="k-journey-dot" aria-hidden="true">
                    {row.state === 'done' && <Check size={11} strokeWidth={3.2} />}
                  </span>
                  <span className="k-journey-label">
                    <span className="k-journey-name">
                      {row.stage}
                      {row.state === 'current' && <span className="sr-only"> (current stage)</span>}
                    </span>
                    <span className="k-journey-meta">{row.meta}</span>
                  </span>
                  <ChevronDown size={14} className="k-journey-chev" aria-hidden="true" />
                </button>

                {open && (
                  <div className="k-journey-tasks">
                    {row.tasks.length ? (
                      <ul>
                        {row.tasks.map((task) => (
                          <li key={task.id} data-status={task.status}>
                            <span className="k-journey-task-dot" aria-hidden="true" />
                            <span className="k-journey-task-text">{task.text}</span>
                            {task.tag && <span className="k-journey-tag">{task.tag}</span>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="k-journey-empty">No saved tasks for this stage yet.</p>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ol>

        <footer className="k-journey-foot">
          <Link href="/my-plan" className="k-journey-cta" tabIndex={panelHidden ? -1 : undefined}>
            Open My Plan
          </Link>
          <span className="k-journey-saved">{savedAt ? `Saved ${savedAt}` : 'Not saved yet'}</span>
        </footer>
      </section>

      <button
        type="button"
        className="k-journey-rail"
        onClick={() => setCollapsed(false)}
        aria-label="Open progress tracker"
        aria-expanded={!collapsed}
        tabIndex={panelHidden ? undefined : -1}
        aria-hidden={!panelHidden}
      >
        <span className="k-journey-rail-icon" aria-hidden="true">
          <ChevronLeft size={14} strokeWidth={2.6} />
        </span>
        <span className="k-journey-rail-word" aria-hidden="true">Journey</span>
        <span className="k-journey-rail-dots" aria-hidden="true">
          {rows.map((row) => (
            <span key={row.stage} data-state={row.state} />
          ))}
        </span>
        <span className="k-journey-rail-count" aria-hidden="true">{currentStage}/{totalStages}</span>
      </button>
    </div>
  )
}
