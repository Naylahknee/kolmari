'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CheckCircle2, Ticket } from 'lucide-react'

/**
 * "Have a trial code?" form. Lives on the coming-soon page where every Upgrade
 * CTA lands, so first users with a code can unlock Plus immediately.
 */
export function TrialRedeemForm({ tight = false }: { tight?: boolean }) {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setMessage('')
    try {
      const res = await fetch('/api/trial/redeem', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
      if (res.ok && data?.ok) {
        setStatus('done')
      } else {
        setStatus('error')
        setMessage(data?.error || 'That code did not work. Check it and try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Could not reach Kolmari. Check your connection and try again.')
    }
  }

  if (status === 'done') {
    return (
      <div className={`${tight ? "mt-4" : "mt-10"} w-full max-w-md rounded-[var(--radius-card)] border border-line bg-white p-6 text-center`}>        <CheckCircle2 className="mx-auto text-teal-deep" size={28} aria-hidden="true" />
        <h2 className="mt-2 text-lg font-extrabold text-navy">Your trial is active</h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          Kolmari Plus is unlocked on your account. Enjoy being one of our first users.
        </p>
        <Link href="/command-center" className="gold-button mt-4 inline-flex">
          Open your Command Center
        </Link>
      </div>
    )
  }

  return (
    <div className={`${tight ? "mt-4" : "mt-10"} w-full max-w-md rounded-[var(--radius-card)] border border-line bg-white p-6 text-center`}>      <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold-deep">
        <Ticket size={13} aria-hidden="true" /> Have a trial code?
      </p>
      <p className="mt-2 text-sm leading-6 text-muted">
        First users can enter their code below to unlock Kolmari Plus free.
      </p>
      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <label htmlFor="trial-code" className="sr-only">
          Trial code
        </label>
        <input
          id="trial-code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
          autoComplete="off"
          autoCapitalize="characters"
          className="min-h-11 min-w-0 flex-1 rounded-[var(--radius-field)] border border-line bg-white px-3 text-sm font-semibold uppercase tracking-wider text-navy placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-soft"
        />
        <button type="submit" disabled={status === 'sending' || code.trim().length === 0} className="gold-button shrink-0 disabled:opacity-50">
          {status === 'sending' ? 'Checking…' : 'Redeem'}
        </button>
      </form>
      {status === 'error' && (
        <p role="alert" className="mt-3 text-sm font-semibold text-danger">
          {message}{' '}
          {message.startsWith('Log in') && (
            <Link href="/login" className="underline underline-offset-2">
              Log in
            </Link>
          )}
        </p>
      )}
    </div>
  )
}
