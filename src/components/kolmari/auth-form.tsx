'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { authHref, safeNextPath } from '@/lib/navigation'
import { syncQuizResultToProfile } from '@/lib/quiz-sync'

/**
 * Quiz context chip on the signup form, per the Kolmari Flow design:
 * "{N} answers saved · {Stage} stage. They prefill your setup."
 * Reads the anonymous quiz result from localStorage; renders nothing when absent.
 */
function QuizSignupNote() {
  const [note, setNote] = useState<string | null>(null)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('kolmari-quiz-result')
      if (!raw) return
      const parsed = JSON.parse(raw) as { answers?: Record<string, unknown>; stage?: unknown }
      const count = parsed.answers ? Object.keys(parsed.answers).length : 0
      const stage = typeof parsed.stage === 'string' && parsed.stage.trim() ? parsed.stage.trim() : ''
      if (count > 0 && stage) setNote(`${count} answers saved · ${stage} stage. They prefill your setup.`)
    } catch {
      // No quiz context; the form works exactly the same without it.
    }
  }, [])
  if (!note) return null
  return (
    <div className="rounded-xl border border-gold/50 bg-gold-soft/60 px-4 py-3">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold-deep">Match Quiz</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-navy">{note}</p>
    </div>
  )
}

export function AuthForm({ mode, nextPath = '/command-center' }: { mode: 'login' | 'signup'; nextPath?: string }) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const signup = mode === 'signup'

  // Mirror the server rules: valid email, password length, and for signup a
  // non-empty name plus the terms checkbox (Kolmari Flow design, Screen 4).
  const canSubmit =
    !loading &&
    /.+@.+\..+/.test(email.trim()) &&
    password.length >= (signup ? 10 : 8) &&
    (!signup || (name.trim().length > 0 && agreed))

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, mode }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Unable to continue.')
      // Carry an anonymous Match Quiz result into the new/existing profile so the
      // quiz -> account -> profile-wizard spine stays connected. On signup the
      // full name rides along in the same PUT. Never blocks navigation.
      await syncQuizResultToProfile(signup ? { displayName: name.trim() } : undefined)
      const destination = safeNextPath(nextPath)
      if (result.verificationRequired) {
        router.push(`/verify-email?next=${encodeURIComponent(destination)}`)
      } else {
        router.push(destination)
      }
      router.refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to continue.')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      {signup ? <QuizSignupNote /> : null}
      {signup ? <label className="block text-sm font-bold text-navy">Full name<input className="field mt-2" name="name" type="text" autoComplete="name" maxLength={80} required value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></label> : null}
      <label className="block text-sm font-bold text-navy">Email address<input className="field mt-2" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label>
      <label className="block text-sm font-bold text-navy">Password<span className="relative mt-2 block"><input className="field pr-12" name="password" type={showPassword ? 'text' : 'password'} minLength={signup ? 10 : 8} maxLength={72} autoComplete={signup ? 'new-password' : 'current-password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder={signup ? 'At least 10 characters, letters and numbers' : 'Your password'} /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
      {signup ? (
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-navy">
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 size-5 shrink-0 accent-[var(--color-gold-deep)]" />
          <span>I agree to the <Link href="/terms" className="font-extrabold text-gold-deep underline">Terms</Link> and <Link href="/privacy" className="font-extrabold text-gold-deep underline">Privacy Policy</Link>. I can delete my account and stored data at any time.</span>
        </label>
      ) : null}
      {error ? <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p> : null}
      <button className="gold-button w-full" disabled={!canSubmit}>{loading ? 'Please wait…' : signup ? 'Create account' : 'Sign in'} {!loading ? <ArrowRight size={17} /> : null}</button>
      <p className="text-center text-sm text-muted">{signup ? 'Already have an account?' : 'New to Kolmari?'} <Link href={authHref(signup ? 'login' : 'signup', nextPath)} className="font-extrabold text-gold-deep">{signup ? 'Sign in' : 'Create an account'}</Link></p>
    </form>
  )
}
