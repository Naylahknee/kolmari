'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  ExternalLink,
  FileText,
  LoaderCircle,
} from 'lucide-react'
import { KolmariIcon, type KolmariIconName } from '@/components/kolmari/icons'
import type { KolmariCopilotAnswer, KolmariCopilotResponse } from '@/lib/kolmari-copilot'
import { isKolmariCopilotError } from '@/lib/kolmari-copilot'

/** Fixed question shortcuts from the approved dashboard design. Each opens its workspace. */
const QUESTION_CHIPS: Array<{ label: string; href: string; icon: KolmariIconName | null }> = [
  { label: 'Where can I realistically move?', href: '/your-world', icon: 'explore' },
  { label: 'Which Pathways might fit me?', href: '/pathways', icon: 'visa-and-residency' },
  { label: 'Can my family afford this?', href: '/cost-calculator', icon: 'cost-of-living' },
  { label: 'How do I turn this into a plan?', href: '/my-plan', icon: 'stage-plan' },
  { label: 'Where might we feel welcomed?', href: '/greenbook', icon: 'community' },
  { label: 'What documents will I need?', href: '/documents', icon: null },
]

function workspaceLabel(href: string): string {
  if (href.startsWith('/pathways')) return 'Pathways'
  if (href.startsWith('/cost-calculator')) return 'Cost Calculator'
  if (href.startsWith('/my-plan')) return 'My Plan'
  if (href.startsWith('/your-world')) return 'Your World'
  if (href.startsWith('/greenbook')) return 'Greenbook'
  if (href.startsWith('/documents')) return 'Documents'
  if (href.startsWith('/profile-wizard')) return 'Profile Wizard'
  if (href.startsWith('/command-center')) return 'Command Center'
  return 'Dashboard'
}

function statusLabel(status: KolmariCopilotAnswer['status']) {
  if (status === 'verified_information') return 'Verified information'
  if (status === 'needs_professional_review') return 'Professional review recommended'
  return 'Decision support'
}

export function DashboardAskHero({ continueHref }: { continueHref: string | null }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<KolmariCopilotAnswer | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submitQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = question.trim()
    if (!value || loading) return

    setLoading(true)
    setError('')
    setAnswer(null)

    try {
      const response = await fetch('/api/ask-kolmari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: value }),
      })
      const data = (await response.json()) as KolmariCopilotResponse
      if (!response.ok || isKolmariCopilotError(data)) {
        setError(isKolmariCopilotError(data) ? data.error : 'Kolmari could not answer that question.')
        return
      }
      setAnswer(data)
    } catch {
      setError('Kolmari could not connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-card"
      aria-labelledby="dashboard-question-title"
    >
      <div className="px-5 py-6 sm:px-8 sm:py-7">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.13em] text-gold-deep">
          Start with the hard question
        </p>
        <div className="mt-1.5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="dashboard-question-title" className="text-[26px] font-bold leading-tight tracking-[-0.025em] text-navy sm:text-[28px]">
              What do you need to figure out?
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Ask in plain language. Kolmari will open the workspace designed to help you answer it.
            </p>
          </div>
          <span className="text-[11.5px] font-bold text-muted-soft">Your question is not saved</span>
        </div>

        <form className="mt-5" onSubmit={submitQuestion}>
          <div className="flex items-center gap-2.5 rounded-[13px] border border-line-strong bg-canvas/45 p-2 pl-4 transition-[border-color,box-shadow] focus-within:border-gold-deep focus-within:shadow-[0_0_0_3px_rgba(243,197,22,0.16)]">
            <label className="sr-only" htmlFor="dashboard-hero-question">Ask Kolmari a relocation question</label>
            <input
              id="dashboard-hero-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="For example: Can my family afford Portugal?"
              maxLength={1200}
              className="min-h-11 min-w-0 flex-1 border-0 bg-transparent text-[15px] text-navy outline-none placeholder:text-muted-soft"
            />
            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="grid size-11 flex-none place-items-center rounded-[10px] bg-gold text-navy-deep transition-[background-color,transform] duration-150 hover:-translate-y-0.5 hover:bg-[#ffd83d] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              aria-label="Ask Kolmari"
            >
              {loading ? <LoaderCircle size={19} className="animate-spin" aria-hidden="true" /> : <ArrowUp size={19} strokeWidth={2.4} aria-hidden="true" />}
            </button>
          </div>
        </form>

        {loading && (
          <div className="mt-4 rounded-[var(--radius-field)] border border-gold/30 bg-gold-soft/25 px-4 py-3 text-sm text-navy" role="status">
            Kolmari is checking current sources and separating published rules from practical guidance.
          </div>
        )}

        {error && (
          <div className="mt-4 flex gap-2 rounded-[var(--radius-field)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            <AlertTriangle size={17} className="mt-0.5 flex-none" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {answer && (
          <article className="mt-5 overflow-hidden rounded-[var(--radius-field)] border border-line bg-canvas/30" aria-live="polite">
            <div className="flex flex-wrap items-center gap-2 border-b border-line bg-white px-4 py-3">
              <span className="rounded-full bg-gold-soft/60 px-2.5 py-1 text-[11px] font-bold text-navy">
                {statusLabel(answer.status)}
              </span>
              <span className="rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold capitalize text-muted">
                {answer.confidence} confidence
              </span>
            </div>
            <div className="px-4 py-4 sm:px-5">
              <div className="whitespace-pre-wrap text-sm leading-7 text-navy">{answer.answer}</div>

              {answer.nextActions.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-bold text-navy">Next actions</h3>
                  <ol className="mt-2 space-y-2">
                    {answer.nextActions.map((action, index) => (
                      <li key={`${index}-${action}`} className="flex gap-2 text-sm leading-6 text-muted">
                        <span className="grid size-5 flex-none place-items-center rounded-full bg-gold-soft/70 text-[10px] font-bold text-navy">{index + 1}</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {answer.sources.length > 0 && (
                <div className="mt-5 border-t border-line pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Sources checked</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {answer.sources.map((source) => (
                      <a
                        key={source.url}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-navy transition hover:border-gold-deep"
                      >
                        {source.title} <ExternalLink size={11} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <p className="max-w-xl text-xs leading-5 text-muted">
                  Kolmari provides decision support, not legal, tax, medical, or financial advice. Confirm material requirements with the responsible authority or a qualified professional.
                </p>
                <Link href={answer.workspace.href} className="gold-button">
                  Continue in {answer.workspace.label} <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        )}

        {continueHref && !answer && (
          <div className="mt-5">
            <Link
              href={continueHref}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas/45 px-4 py-2.5 text-[12.5px] font-bold text-navy transition hover:border-gold-deep"
            >
              <span className="text-gold-deep" aria-hidden="true">↻</span>
              <span>Continue where you left off:<span className="ml-1.5">{workspaceLabel(continueHref)}</span></span>
              <span aria-hidden="true" className="text-muted-soft">→</span>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Common relocation questions">
        {QUESTION_CHIPS.map(({ label, href, icon }) => (
          <Link
            key={label}
            href={href}
            role="listitem"
            className="group flex min-h-[82px] items-center gap-3.5 border-b border-r border-line bg-white px-6 py-4.5 text-left transition-colors hover:bg-canvas/60"
          >
            <span className="grid size-10 flex-none place-items-center rounded-[11px] bg-[#fff5cf] text-gold-deep" aria-hidden="true">
              {icon ? <KolmariIcon name={icon} className="size-[21px]" /> : <FileText size={20} strokeWidth={1.8} />}
            </span>
            <span className="flex-1 text-[13px] font-bold leading-snug text-navy">{label}</span>
            <span aria-hidden="true" className="text-[19px] font-normal text-muted-soft transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
