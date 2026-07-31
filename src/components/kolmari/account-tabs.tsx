'use client'
import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, CreditCard, LifeBuoy, LoaderCircle, Sparkles } from 'lucide-react'
import type { RelocationProfile } from '@/lib/profile'
import { PrivacyAccountPage } from './privacy-account-page'

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'billing', label: 'Billing' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'help', label: 'Help' },
] as const
type TabId = (typeof TABS)[number]['id']

/** Account page — Profile · Billing · Notifications · Help on one screen. */
export function AccountTabs({
  initial,
  email,
  initialTab = 'profile',
}: {
  initial: RelocationProfile
  email: string
  initialTab?: TabId
}) {
  const [tab, setTab] = useState<TabId>(initialTab)

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Account</h1>
      <div className="mt-4 flex gap-1 overflow-x-auto border-b border-line" role="tablist" aria-label="Account sections">
        {TABS.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={[
                '-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition',
                active ? 'border-gold text-navy' : 'border-transparent text-muted hover:text-navy',
              ].join(' ')}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <div className="mt-6" role="tabpanel">
        {tab === 'profile' && <ProfilePanel initial={initial} email={email} />}
        {tab === 'billing' && <BillingPanel paid={initial.plan !== 'free'} />}
        {tab === 'notifications' && <NotificationsPanel />}
        {tab === 'help' && <HelpPanel email={email} />}
      </div>
    </div>
  )
}

function ProfilePanel({ initial, email }: { initial: RelocationProfile; email: string }) {
  const [profile, setProfile] = useState(initial)
  const [message, setMessage] = useState('')

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('Saving…')
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        display_name: profile.display_name,
        current_country: profile.current_country,
        timeline: profile.timeline,
      }),
    })
    setMessage(response.ok ? 'Saved.' : 'Unable to save.')
  }

  const avatar = (profile.display_name || email).trim().charAt(0).toUpperCase() || 'K'

  return (
    <div className="space-y-8">
      <form onSubmit={save} className="card-surface p-6 sm:p-8" aria-labelledby="profile-heading">
        <div className="flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-gold-soft text-xl font-bold text-navy" aria-hidden="true">
            {avatar}
          </span>
          <div>
            <h2 id="profile-heading" className="text-lg font-bold text-navy">Your profile</h2>
            <p className="text-sm text-muted">Photo upload is coming soon — for now your initial stands in.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-bold text-navy">
            Display name
            <input className="field mt-2" value={profile.display_name ?? ''} onChange={(e) => setProfile({ ...profile, display_name: e.target.value || null })} placeholder="Your name" />
          </label>
          <label className="block text-sm font-bold text-navy">
            Email
            <input className="field mt-2 bg-canvas" value={email} disabled aria-label="Account email (change it under the security section below)" />
          </label>
          <label className="block text-sm font-bold text-navy">
            Current country
            <input className="field mt-2" value={profile.current_country ?? ''} onChange={(e) => setProfile({ ...profile, current_country: e.target.value || null })} placeholder="e.g. United States" />
          </label>
          <label className="block text-sm font-bold text-navy">
            Move timeline
            <select className="field mt-2" value={profile.timeline ?? ''} onChange={(e) => setProfile({ ...profile, timeline: (e.target.value || null) as RelocationProfile['timeline'] })}>
              <option value="">Not selected</option>
              <option>0-3 months</option>
              <option>3-6 months</option>
              <option>6-12 months</option>
              <option>12+ months</option>
              <option>Just researching</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button type="submit" className="gold-button">Save changes</button>
          <Link href="/profile-wizard" className="text-sm font-bold text-gold-deep hover:text-navy">
            {profile.wizard_status === 'completed' ? 'Retake the quiz' : 'Finish the quiz'}
          </Link>
          {message && <p role="status" className="text-sm text-muted">{message}</p>}
        </div>
      </form>

      {/* Account security & privacy — password, email, data export, deletion. */}
      <PrivacyAccountPage email={email} />
    </div>
  )
}

function BillingPanel({ paid }: { paid: boolean }) {
  return (
    <div className="card-surface p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-field)] bg-gold-soft" aria-hidden="true">
          <CreditCard size={16} className="text-gold-deep" />
        </span>
        <div>
          <h2 className="font-bold text-navy">Your plan</h2>
          <p className="mt-0.5 text-sm text-muted">Manage your Kolmari subscription.</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-field)] border border-line bg-canvas p-4">
        <div className="flex items-center gap-2">
          {paid ? <CheckCircle2 size={18} className="text-ok" /> : <Sparkles size={18} className="text-gold-deep" />}
          <span className="font-semibold text-navy">{paid ? 'Kolmari Plus — active' : 'Free plan'}</span>
        </div>
        {!paid && (
          <Link href="/coming-soon?feature=plus" className="gold-button">
            Build My Kolmari Plan <ArrowRight size={15} />
          </Link>
        )}
      </div>

      <p className="mt-4 text-sm leading-6 text-muted">
        Kolmari is launching free. Paid plans and payment management are coming soon — nothing is charged today.
      </p>
    </div>
  )
}

function NotificationsPanel() {
  const [reminders, setReminders] = useState(true)
  const [product, setProduct] = useState(true)
  return (
    <div className="card-surface p-6 sm:p-8">
      <h2 className="font-bold text-navy">Notifications</h2>
      <p className="mt-0.5 text-sm text-muted">Choose what Kolmari surfaces. Email delivery is coming soon; these control in-app prompts.</p>
      <div className="mt-5 space-y-3">
        {[
          ['Planning reminders', 'Progress nudges and next-step prompts in your dashboard.', reminders, setReminders] as const,
          ['Product updates', 'New destinations, features, and Greenbook entries.', product, setProduct] as const,
        ].map(([title, copy, value, set]) => (
          <label key={title} className="flex items-center justify-between gap-4 rounded-[var(--radius-field)] bg-canvas p-4">
            <span>
              <strong className="block text-sm text-navy">{title}</strong>
              <small className="text-muted">{copy}</small>
            </span>
            <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)} className="size-4 accent-[var(--color-gold-deep)]" />
          </label>
        ))}
      </div>
    </div>
  )
}

function HelpPanel({ email }: { email: string }) {
  const [subject, setSubject] = useState('')
  const [msg, setMsg] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('sending')
    setError('')
    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message: msg }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Unable to send your message.')
      setState('sent')
      setSubject('')
      setMsg('')
    } catch (reason) {
      setState('error')
      setError(reason instanceof Error ? reason.message : 'Unable to send your message.')
    }
  }

  return (
    <div className="card-surface p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-field)] bg-gold-soft" aria-hidden="true">
          <LifeBuoy size={16} className="text-gold-deep" />
        </span>
        <div>
          <h2 className="font-bold text-navy">Get help</h2>
          <p className="mt-0.5 text-sm text-muted">Send us a message and we&rsquo;ll get back to you at {email}.</p>
        </div>
      </div>

      {state === 'sent' ? (
        <div className="mt-5 flex items-center gap-2 rounded-[var(--radius-field)] border border-ok/30 bg-ok/10 px-4 py-3 text-sm font-semibold text-ok">
          <CheckCircle2 size={16} /> Thanks — your message is in. We&rsquo;ll reply by email.
        </div>
      ) : (
        <form onSubmit={send} className="mt-5 space-y-4">
          <label className="block text-sm font-bold text-navy">
            Subject <span className="font-normal text-muted">(optional)</span>
            <input className="field mt-2" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What's this about?" maxLength={140} />
          </label>
          <label className="block text-sm font-bold text-navy">
            Message
            <textarea className="field mt-2 min-h-32" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Tell us what you need help with…" maxLength={4000} required />
          </label>
          {error && <p role="alert" className="text-sm font-semibold text-danger">{error}</p>}
          <button type="submit" disabled={state === 'sending'} className="gold-button disabled:opacity-60">
            {state === 'sending' ? <LoaderCircle size={16} className="animate-spin" /> : null}
            Send message
          </button>
        </form>
      )}
    </div>
  )
}
