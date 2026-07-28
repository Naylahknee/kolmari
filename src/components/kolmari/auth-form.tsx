'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { authHref, safeNextPath } from '@/lib/navigation'

export function AuthForm({ mode, nextPath = '/dashboard' }: { mode: 'login' | 'signup'; nextPath?: string }) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const signup = mode === 'signup'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      const response = await fetch('/api/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), password: form.get('password'), mode }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Unable to continue.')
      router.push(signup ? '/welcome' : safeNextPath(nextPath))
      router.refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to continue.')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <label className="block text-sm font-bold text-navy">Email address<input className="field mt-2" name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
      <label className="block text-sm font-bold text-navy">Password<span className="relative mt-2 block"><input className="field pr-12" name="password" type={showPassword ? 'text' : 'password'} minLength={8} maxLength={72} autoComplete={signup ? 'new-password' : 'current-password'} required placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
      {error ? <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p> : null}
      <button className="gold-button w-full" disabled={loading}>{loading ? 'Please wait…' : signup ? 'Create my account' : 'Sign in'} {!loading ? <ArrowRight size={17} /> : null}</button>
      <p className="text-center text-sm text-muted">{signup ? 'Already planning with Kolmari?' : 'New to Kolmari?'} <Link href={authHref(signup ? 'login' : 'signup', nextPath)} className="font-extrabold text-gold-deep">{signup ? 'Sign in' : 'Create an account'}</Link></p>
    </form>
  )
}
