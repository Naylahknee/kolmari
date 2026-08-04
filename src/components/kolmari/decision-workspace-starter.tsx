'use client'

import Link from 'next/link'
import { useState, useSyncExternalStore } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  ExternalLink,
  FileText,
  Globe2,
  History,
  ListChecks,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  Stamp,
  WalletCards,
  type LucideIcon,
} from 'lucide-react'
import type { KolmariCopilotAnswer, KolmariCopilotResponse } from '@/lib/kolmari-copilot'
import { isKolmariCopilotError } from '@/lib/kolmari-copilot'
import {
  parseWorkspaceActivity,
  WORKSPACE_ACTIVITY_EVENT,
  WORKSPACE_ACTIVITY_STORAGE_KEY,
} from '@/lib/workspace-activity'

type Starter = {
  question: string
  href: string
  icon: LucideIcon
}

const STARTERS: Starter[] = [
  { question: 'Where can I realistically move?', href: '/your-world', icon: Globe2 },
  { question: 'Which Pathways might fit me?', href: '/pathways', icon: Stamp },
  { question: 'Can my family afford this?', href: '/cost-calculator', icon: WalletCards },
  { question: 'How do I turn this into a plan?', href: '/my-plan', icon: ListChecks },
  { question: 'Where might we feel welcomed?', href: '/greenbook', icon: ShieldCheck },
  { question: 'What documents will I need?', href: '/documents', icon: FileText },
]

function subscribeToWorkspaceActivity(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === WORKSPACE_ACTIVITY_STORAGE_KEY) onStoreChange()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener(WORKSPACE_ACTIVITY_EVENT, onStoreChange)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(WORKSPACE_ACTIVITY_EVENT, onStoreChange)
  }
}

const readWorkspaceActivity = () => window.localStorage.getItem(WORKSPACE_ACTIVITY_STORAGE_KEY)
const readServerWorkspaceActivity = () => null

function statusLabel(status: KolmariCopilotAnswer['status']) {
  if (status === 'verified_information') return 'Verified information'
  if (status === 'needs_professional_review') return 'Professional review recommended'
  return 'Decision support'
}

export function DecisionWorkspaceStarter() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<KolmariCopilotAnswer | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const activityValue = useSyncExternalStore(
    subscribeToWorkspaceActivity,
    readWorkspaceActivity,
    readServerWorkspaceActivity,
  )
  const activity = parseWorkspaceActivity(activityValue)

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
      aria-labelledby="decision-workspace-heading"
    >
      <div className="border-b border-line px-5 py-5 sm:px-6">
        <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold-deep">
          <Sparkles size={13} aria-hidden="true" /> Ask Kolmari
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="decision-workspace-heading" className="text-2xl font-bold tracking-[-0.02em] text-navy sm:text-[28px]">
              What do you need to figure out?
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Ask a relocation question. Kolmari will research it, explain the limits, and connect you to the right workspace.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-soft">
            Questions are not added to your profile
          </span>
        </div>

        <form className="mt-4" onSubmit={submitQuestion}>
          <div className="flex items-center gap-2 rounded-[var(--radius-field)] border border-line-strong bg-canvas/45 p-2 transition-[border-color,box-shadow] focus-within:border-gold-deep focus-within:shadow-[0_0_0_3px_rgba(243,197,22,0.16)]">
            <label className="sr-only" htmlFor="kolmari-decision-question">Ask Kolmari a relocation question</label>
            <input
              id="kolmari-decision-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="For example: Can my family afford Portugal?"
              maxLength={1200}
              className="min-h-11 min-w-0 flex-1 border-0 bg-transparent px-2 text-[15px] text-navy outline-none placeholder:text-muted-soft"
            />
            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="grid size-10 flex-none place-items-center rounded-[var(--radius-btn)] bg-gold text-navy-deep transition-[background-color,transform] duration-150 hover:-translate-y-0.5 hover:bg-[#ffd83d] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              aria-label="Ask Kolmari"
            >
              {loading ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : <ArrowUp size={18} strokeWidth={2.4} aria-hidden="true" />}
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

        {!answer && activity && (
          <Link
            href={activity.href}
            className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-full border border-line bg-canvas/60 px-3 text-xs font-semibold text-navy transition hover:border-gold-deep hover:bg-gold-soft/25"
          >
            <History size={14} className="text-gold-deep" aria-hidden="true" />
            Continue where you left off: <span className="font-bold">{activity.label}</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        )}
      </div>

      <div className="grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-3">
        {STARTERS.map(({ question: starterQuestion, href, icon: Icon }) => (
          <button
            key={starterQuestion}
            type="button"
            onClick={() => setQuestion(starterQuestion)}
            className="group flex min-h-[76px] items-center gap-3 bg-white px-5 py-4 text-left transition-colors duration-150 hover:bg-[#fdfbf3]"
          >
            <span className="grid size-9 flex-none place-items-center rounded-[10px] bg-gold-soft/55 text-gold-deep transition-colors duration-150 group-hover:bg-gold-soft">
              <Icon size={17} strokeWidth={1.9} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 text-[13px] font-semibold leading-5 text-navy">{starterQuestion}</span>
            <ArrowRight size={15} className="flex-none text-muted-soft transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-gold-deep" aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  )
}
