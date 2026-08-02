'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'

type TargetRect = { top: number; left: number; width: number; height: number }

const STEPS = [
  {
    selector: '#dashboard-progress',
    title: 'See the whole journey',
    copy: 'Your Progress Tracker keeps the same eight-stage position as My Plan.',
  },
  {
    selector: '#dashboard-destinations',
    title: 'Find your strongest fits',
    copy: 'Your Top Destinations becomes personalized after you complete your profile.',
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

export function DashboardWelcome({ firstName, firstVisitCandidate, profileComplete }: {
  firstName: string
  firstVisitCandidate: boolean
  profileComplete: boolean
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
      <div id="dashboard-header" className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold-deep">Your relocation journey</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-navy sm:text-4xl">
            {firstVisit ? 'Welcome' : 'Welcome back'}, {firstName}{firstVisit ? '' : '.'}
          </h1>
          <p className="mt-1 text-sm text-muted">Continue building your move plan.</p>
        </div>
        <Link href={profileComplete ? '/flutter' : '/profile-wizard'} className="gold-button">
          {profileComplete ? 'Enter Flutter Mode' : 'Build My Kolmari Plan'} <ArrowRight size={16} />
        </Link>
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
