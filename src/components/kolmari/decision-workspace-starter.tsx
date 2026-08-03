'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useSyncExternalStore } from 'react'
import {
  ArrowRight,
  ArrowUp,
  FileText,
  Globe2,
  History,
  ListChecks,
  ShieldCheck,
  Stamp,
  WalletCards,
  type LucideIcon,
} from 'lucide-react'
import { routeDecisionQuestion } from '@/lib/decision-routing'
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

export function DecisionWorkspaceStarter() {
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const activityValue = useSyncExternalStore(
    subscribeToWorkspaceActivity,
    readWorkspaceActivity,
    readServerWorkspaceActivity,
  )
  const activity = parseWorkspaceActivity(activityValue)

  function submitQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = question.trim()
    if (!value) return
    router.push(routeDecisionQuestion(value).href)
  }

  return (
    <section
      className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-card"
      aria-labelledby="decision-workspace-heading"
    >
      <div className="border-b border-line px-5 py-5 sm:px-6">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold-deep">Start with the hard question</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="decision-workspace-heading" className="text-2xl font-bold tracking-[-0.02em] text-navy sm:text-[28px]">
              What do you need to figure out?
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Ask in plain language. Kolmari will open the workspace designed to help you answer it.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-soft">
            Your question is not saved
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
              className="min-h-11 min-w-0 flex-1 border-0 bg-transparent px-2 text-[15px] text-navy outline-none placeholder:text-muted-soft"
            />
            <button
              type="submit"
              disabled={!question.trim()}
              className="grid size-10 flex-none place-items-center rounded-[var(--radius-btn)] bg-gold text-navy-deep transition-[background-color,transform] duration-150 hover:-translate-y-0.5 hover:bg-[#ffd83d] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              aria-label="Find the right Kolmari workspace"
            >
              <ArrowUp size={18} strokeWidth={2.4} aria-hidden="true" />
            </button>
          </div>
        </form>
        {activity && (
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
          <Link
            key={starterQuestion}
            href={href}
            className="group flex min-h-[76px] items-center gap-3 bg-white px-5 py-4 transition-colors duration-150 hover:bg-[#fdfbf3]"
          >
            <span className="grid size-9 flex-none place-items-center rounded-[10px] bg-gold-soft/55 text-gold-deep transition-colors duration-150 group-hover:bg-gold-soft">
              <Icon size={17} strokeWidth={1.9} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 text-[13px] font-semibold leading-5 text-navy">{starterQuestion}</span>
            <ArrowRight size={15} className="flex-none text-muted-soft transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-gold-deep" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  )
}
