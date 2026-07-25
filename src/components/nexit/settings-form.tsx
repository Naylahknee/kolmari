'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import type { RelocationProfile } from '@/lib/profile'

export function SettingsForm({ initial, email }: { initial: RelocationProfile; email: string }) {
  const [profile, setProfile] = useState(initial)
  const [updates, setUpdates] = useState(true)
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
        priority: profile.priority,
      }),
    })
    setMessage(response.ok ? 'Settings saved.' : 'Unable to save settings.')
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Account</p>
        <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">Settings</h1>
      </div>

      {/* Profile */}
      <form onSubmit={save} className="card-surface p-6 sm:p-8" aria-labelledby="profile-section-heading">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 id="profile-section-heading" className="text-lg font-bold text-navy">Your Nexit Profile</h2>
            <p className="mt-1 text-sm text-muted">
              Status:{' '}
              <span className={profile.wizard_status === 'completed' ? 'text-ok font-semibold' : 'text-muted'}>
                {profile.wizard_status === 'completed' ? 'Complete' : 'Not started'}
              </span>
            </p>
          </div>
          <Link
            href="/profile-wizard"
            className="rounded-[var(--radius-field)] border border-navy px-4 py-2 text-sm font-bold text-navy hover:bg-canvas"
          >
            {profile.wizard_status === 'completed' ? 'Edit Profile / Retake Wizard' : 'Start Wizard'}
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-bold text-navy">
            Display name
            <input
              className="field mt-2"
              value={profile.display_name ?? ''}
              onChange={(e) => setProfile({ ...profile, display_name: e.target.value || null })}
              placeholder="Your name"
            />
          </label>
          <label className="block text-sm font-bold text-navy">
            Email
            <input
              className="field mt-2 bg-canvas"
              value={email}
              disabled
              aria-label="Account email (read only — change in Privacy & Account)"
            />
          </label>
          <label className="block text-sm font-bold text-navy">
            Current country
            <input
              className="field mt-2"
              value={profile.current_country ?? ''}
              onChange={(e) => setProfile({ ...profile, current_country: e.target.value || null })}
              placeholder="e.g. United States"
            />
          </label>
          <label className="block text-sm font-bold text-navy">
            Move timeline
            <select
              className="field mt-2"
              value={profile.timeline ?? ''}
              onChange={(e) => setProfile({ ...profile, timeline: (e.target.value || null) as RelocationProfile['timeline'] })}
            >
              <option value="">Not selected</option>
              <option>0-3 months</option>
              <option>3-6 months</option>
              <option>6-12 months</option>
              <option>12+ months</option>
              <option>Just researching</option>
            </select>
          </label>
        </div>

        {/* Notifications */}
        <label className="mt-7 flex items-center justify-between gap-4 rounded-[var(--radius-field)] bg-canvas p-4">
          <span>
            <strong className="block text-sm text-navy">Planning reminders</strong>
            <small className="text-muted">Show helpful progress notifications in the dashboard.</small>
          </span>
          <input
            type="checkbox"
            checked={updates}
            onChange={(e) => setUpdates(e.target.checked)}
            className="size-4 accent-[var(--color-gold-deep)]"
          />
        </label>

        <div className="mt-6 flex items-center gap-4">
          <button type="submit" className="gold-button">Save changes</button>
          {message && (
            <p role="status" className="text-sm text-muted">{message}</p>
          )}
        </div>
      </form>

      {/* Privacy & Account */}
      <section aria-labelledby="privacy-section-heading">
        <h2 id="privacy-section-heading" className="mb-4 text-xs font-bold uppercase tracking-widest text-muted">Privacy &amp; Account</h2>
        <Link
          href="/settings/privacy"
          className="card-surface flex items-center justify-between p-5 transition-colors hover:bg-gold-soft/20"
          aria-label="Open Privacy and Account settings"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-field)] bg-gold-soft" aria-hidden="true">
              <ShieldCheck size={16} />
            </span>
            <div>
              <p className="font-semibold text-navy">Privacy &amp; Account</p>
              <p className="text-sm text-muted">Change password, download your data, or delete your account.</p>
            </div>
          </div>
          <ArrowRight size={16} className="shrink-0 text-muted" aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}
