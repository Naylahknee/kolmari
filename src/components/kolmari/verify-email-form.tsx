'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'

/**
 * The verify screen (Kolmari Flow design, Screen 5). Sends a 6-digit code on
 * mount, then checks the code the user types. Resend has a 60-second cooldown.
 */
export function VerifyEmailForm({ nextPath }: { nextPath: string }) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [sending, setSending] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const sendOnce = useRef(false)

  async function send() {
    setSending(true)
    setError('')
    try {
      const response = await fetch('/api/auth/verify/send', { method: 'POST' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Unable to send the code.')
      if (result.alreadyVerified) {
        router.push(nextPath)
        router.refresh()
        return
      }
      setNotice('Code sent. Check your inbox.')
      setCooldown(60)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to send the code.')
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    if (sendOnce.current) return
    sendOnce.current = true
    send()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!/^\d{6}$/.test(code.trim())) {
      setError('Enter the 6-digit code from your email.')
      return
    }
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch('/api/auth/verify/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Unable to verify.')
      router.push(nextPath)
      router.refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to verify.')
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    await fetch('/api/logout', { method: 'POST' }).catch(() => {})
    router.push('/signup')
    router.refresh()
  }

  return (
    <div className="mt-8">
      {sending ? <p className="text-sm font-semibold text-muted">Sending your code…</p> : null}
      {notice && !error ? <p role="status" className="rounded-xl bg-gold-soft/60 px-4 py-3 text-sm font-semibold text-navy">{notice}</p> : null}
      <form onSubmit={verify} className="mt-4 space-y-5">
        <label className="block text-sm font-bold text-navy">
          Enter code
          <input
            className="field mt-2 text-center text-2xl font-extrabold tracking-[0.5em]"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="••••••"
          />
        </label>
        {error ? <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p> : null}
        <button className="gold-button w-full" disabled={busy || sending || code.trim().length !== 6}>
          {busy ? 'Verifying…' : 'Verify my email'} {!busy ? <ArrowRight size={17} /> : null}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">
        Didn&apos;t get it?{' '}
        {cooldown > 0 ? (
          <span className="font-bold">Resend in {cooldown}s</span>
        ) : (
          <button type="button" onClick={send} disabled={sending} className="font-extrabold text-gold-deep disabled:opacity-50">
            Resend code
          </button>
        )}
      </p>
      <p className="mt-2 text-center text-sm text-muted">
        Wrong email?{' '}
        <button type="button" onClick={signOut} className="font-extrabold text-gold-deep">
          Start over
        </button>
      </p>
    </div>
  )
}
