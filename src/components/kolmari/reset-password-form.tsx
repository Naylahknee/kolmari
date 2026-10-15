'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'

/**
 * Two-step password reset: enter your email to get a code, then enter the
 * code plus a new password. The request endpoint always answers { ok: true },
 * so this screen never reveals whether an email has an account.
 */
export function ResetPasswordForm() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  async function requestCode(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    const address = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setError('Enter a valid email address.')
      return
    }
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch('/api/auth/reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: address }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Unable to send the code.')
      setEmail(address)
      setStep('code')
      setNotice('If that email has a Kolmari account, a code is on its way.')
      setCooldown(60)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to send the code.')
    } finally {
      setBusy(false)
    }
  }

  async function confirmReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!/^\d{6}$/.test(code.trim())) {
      setError('Enter the 6-digit code from your email.')
      return
    }
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch('/api/auth/reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: code.trim(), newPassword }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Unable to reset the password.')
      router.push('/login?reset=done')
      router.refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to reset the password.')
    } finally {
      setBusy(false)
    }
  }

  const passwordHint =
    newPassword.length > 0 && (newPassword.length < 10 || !/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword))
      ? 'Use at least 10 characters, with letters and numbers.'
      : ''

  return (
    <div className="mt-8">
      {step === 'email' ? (
        <form onSubmit={requestCode} className="space-y-5">
          <label className="block text-sm font-bold text-navy">
            Email
            <input
              className="field mt-2"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          {error ? <p className="text-sm font-bold text-red-700">{error}</p> : null}
          <button className="gold-button w-full" disabled={busy}>
            {busy ? 'Please wait…' : 'Send reset code'} {!busy ? <ArrowRight size={17} /> : null}
          </button>
        </form>
      ) : (
        <form onSubmit={confirmReset} className="space-y-5">
          <p className="text-sm text-muted">
            Code sent to <span className="font-bold text-navy">{email}</span>.{' '}
            <button
              type="button"
              className="font-extrabold text-gold-deep disabled:opacity-50"
              disabled={busy || cooldown > 0}
              onClick={() => requestCode()}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
          </p>
          <label className="block text-sm font-bold text-navy">
            6-digit code
            <input
              className="field mt-2"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
            />
          </label>
          <label className="block text-sm font-bold text-navy">
            New password
            <input
              className="field mt-2"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={10}
              maxLength={72}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 10 characters, letters and numbers"
            />
          </label>
          {passwordHint ? <p className="text-sm text-muted">{passwordHint}</p> : null}
          {error ? <p className="text-sm font-bold text-red-700">{error}</p> : null}
          {notice ? <p className="text-sm font-bold text-navy">{notice}</p> : null}
          <button className="gold-button w-full" disabled={busy}>
            {busy ? 'Please wait…' : 'Set new password'} {!busy ? <ArrowRight size={17} /> : null}
          </button>
        </form>
      )}
    </div>
  )
}
