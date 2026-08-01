'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, LoaderCircle } from 'lucide-react'

export function WelcomeActions() {
  const router = useRouter()
  const [skipping, setSkipping] = useState(false)
  const [error, setError] = useState('')

  async function skip() {
    setSkipping(true)
    setError('')
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wizard_status: 'skipped' }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Unable to continue right now.')
      router.push('/destinations')
      router.refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to continue right now.')
      setSkipping(false)
    }
  }

  return (
    <div className="mt-8 grid gap-3">
      <Link href="/profile-wizard" className="gold-button w-full">Start Profile Wizard <ArrowRight size={17} /></Link>
      <button type="button" onClick={skip} disabled={skipping} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-5 font-bold text-white transition hover:border-gold hover:text-gold disabled:opacity-60">
        {skipping ? <LoaderCircle size={16} className="animate-spin" /> : null}{skipping ? 'Opening Destinations…' : 'Skip for now and explore'}
      </button>
      {error ? <p role="alert" className="text-sm font-semibold text-danger">{error}</p> : null}
    </div>
  )
}
