'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, Check, Sparkles, X } from 'lucide-react'
import type { PlanTier } from '@/lib/plan-tiers'
import { Greeting } from './dashboard/greeting'

type TargetRect = { top: number; left: number; width: number; height: number }

const STEPS = [
  {
    selector: '#next-action-heading',
    title: 'Start with one clear action',
    copy: 'Kolmari puts the highest-priority planning action first so you always know what to do next.',
  },
  {
    selector: '#dashboard-destinations',
    title: 'See your strongest fits',
    copy: 'Your Destinations panel shows your top matched countries and a concise visa-options preview.',
  },
  {
    selector: '[data-onboarding="explore-nav"]',
    title: 'Explore your options',
    copy: 'Use Explore for destination research, comparisons, and saved places.',
  },
  {
    selector: '[data-onboarding="plan-nav"]',
    title: 'Turn research into a plan',
    copy: 'Use Plan for pathways, tasks, documents, budget, and your move timeline.',
  },
] as const

function hasSavedDestinations() {
  try {
    const saved = JSON.parse(window.localStorage.getItem('kolmari:saved') ?? '[]')
    return Array.isArray(saved) && saved.length > 0
  } catch {
    return false
  }
}

function UpgradeSection({ planTier }: { planTier: PlanTier }) {
  if (planTier === 'navigator') return null

  const copy = planTier === 'free'
    ? {
        eyebrow: 'Explorer plan',
        title: 'Unlock your full move plan',
        detail: 'Personalized Pathway eligibility, full Documents and Readiness Tracker, plus the full Cost Calculator.',
        cta: 'View upgrade options',
      }
    : {
        eyebrow: 'Plus plan',
        title: 'Need multi-destination planning?',
        detail: 'Navigator adds side-by-side comparison, household modeling, and multiple active Move Plans.',
        cta: 'Compare with Navigator',
      }

  return (
    <section
      className="min-w-0 rounded-[var(--radius-card)] border border-line bg-white px-4 py-3 shadow-tile sm:max-w-[520px]"
      aria-label="Kolmari plan options"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-gold-deep">
            <Sparkles size={12} aria-hidden="true" /> {copy.eyebrow}
          </p>
          <p className="mt-1 text-sm font-bold text-navy">{copy.title}</p>
          <p className="mt-0.5 text-[11.5px] leading-5 text-muted">{copy.detail}</p>
        </div>
        <Link
          href="/settings?tab=billing"
          className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-[var(--radius-btn)] bg-gold px-3.5 text-xs font-bold text-navy-deep transition-colors hover:bg-[#e0b40c]"
        >
          {copy.cta} <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
      {planTier === 'free' && (
        <p className="mt-2 flex items-center gap-1.5 text-[10.5px] font-semibold text-muted">
          <Check size={12} className="text-ok" aria-hidden="true" /> Your Explorer features stay available if you do not upgrade.
        </p>
      )}
    </section>
  )
}

export function DashboardWelcome({ firstName, firstVisitCandidate, profileComplete, planTier }: {
  firstName: string
  firstVisitCandidate: boolean
  profileComplete: boolean
  planTier: PlanTier
}) {
  const [firstVisit, setFirstVisit] = useState(firstVisitCandidate)
  const [tourOpen, setTourOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState<TargetRect | null>(null)

  const completeTour = useCallback(() => {
    setTourOpen(false)
    setFirstVisit(false)
    try { window.localStorage.setItem('kolmari:dashboard-onboarding', 'complete') } catch {}
    void fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dashboard_onboarding_completed: true }),
    })
  }, [])

  useEffect(() => {
    if (!firstVisitCandidate) return
    let completedLocally = false
    try { completedLocally = window.localStorage.getItem('kolmari:dashboard-onboarding') === 'complete' } catch {}
    const eligible = !completedLocally && !hasSavedDestinations()
    /* eslint-disable react-hooks/set-state-in-effect */
    setFirstVisit(eligible)
    setTourOpen(eligible)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [firstVisitCandidate])

  useEffect(() => {
    if (!tourOpen) return
    const updateRect = () => {
      const target = document.querySelector<HTMLElement>(STEPS[step].selector)
      if (!target) {
        setRect(null)
        return
      }
      if (step < 2) target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const box = target.getBoundingClientRect()
      setRect({ top: box.top, left: box.left, width: box.width, height: box.height })
    }
    const timer = window.setTimeout(updateRect, 220)
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, true)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [step, tourOpen])

  const tooltipStyle = rect
    ? {
        left: Math.max(16, Math.min(window.innerWidth - 336, rect.left)),
        top: Math.max(16, Math.min(window.innerHeight - 190, rect.top + rect.height + 12)),
      }
    : { left: 16, bottom: 16 }

  return (
    <>
      <div id="dashboard-header" className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex min-h-12 items-center">
          <h1 className="font-display text-[22px] font-bold text-navy sm:text-[26px]">
            {firstVisit ? <>Welcome, {firstName}</> : <Greeting firstName={firstName} />}
          </h1>
        </div>
        {profileComplete ? (
          <UpgradeSection planTier={planTier} />
        ) : (
          <Link href="/profile-wizard" className="gold-button self-start">
            Build My Kolmari Plan <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {tourOpen && (
        <div className="fixed inset-0 z-[160] pointer-events-none" aria-live="polite">
          <div className="absolute inset-0 bg-navy/25" aria-hidden="true" />
          {rect && (
            <div
              className="fixed rounded-[var(--radius-card)] border-2 border-gold bg-white/5 shadow-[0_0_0_9999px_rgba(13,27,57,.15)]"
              style={{ top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12 }}
              aria-hidden="true"
            />
          )}
          <div
            role="dialog"
            aria-label="Dashboard walkthrough"
            className="pointer-events-auto fixed w-[320px] rounded-[var(--radius-card)] border border-gold/40 bg-white p-4 shadow-card"
            style={tooltipStyle}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gold-deep">
                {step + 1} of {STEPS.length}
              </span>
              <button type="button" onClick={completeTour} className="grid size-7 place-items-center rounded-full text-muted hover:bg-canvas hover:text-navy" aria-label="Dismiss walkthrough">
                <X size={15} />
              </button>
            </div>
            <h2 className="mt-3 text-base font-bold text-navy">{STEPS[step].title}</h2>
            <p className="mt-1 text-sm leading-5 text-muted">{STEPS[step].copy}</p>
            <div className="mt-4 flex items-center justify-between">
              <button type="button" onClick={completeTour} className="text-xs font-bold text-muted hover:text-navy">Skip</button>
              <button
                type="button"
                onClick={() => step === STEPS.length - 1 ? completeTour() : setStep((current) => current + 1)}
                className="gold-button"
              >
                {step === STEPS.length - 1 ? 'Done' : 'Next'} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
