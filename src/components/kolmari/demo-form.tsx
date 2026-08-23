'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { ArrowRight } from 'lucide-react'

/**
 * Demo code entry. Deliberately the same shape as AuthForm — `field`,
 * `gold-button`, the same error treatment — so the demo door does not look
 * like a different product.
 */
export function DemoForm({ initialCode = '' }: { initialCode?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: form.get('code') }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error ?? 'Unable to start the demo.')
      router.push('/dashboard')
      router.refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to start the demo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <label className="block text-sm font-bold text-navy">
        Demo code
        <input
          className="field mt-2"
          name="code"
          type="text"
          defaultValue={initialCode}
          autoComplete="off"
          spellCheck={false}
          required
          placeholder="Enter the code you were given"
        />
      </label>
      {error ? (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p>
      ) : null}
      <button className="gold-button w-full" disabled={loading}>
        {loading ? 'Starting…' : 'Explore the demo'} {!loading ? <ArrowRight size={17} /> : null}
      </button>
      <p className="text-center text-sm text-muted">
        Have an account? <Link href="/login" className="font-extrabold text-gold-deep">Sign in</Link>
      </p>
    </form>
  )
}
