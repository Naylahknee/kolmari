'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, CheckCircle2, Download, KeyRound, LogOut, Mail, Trash2 } from 'lucide-react'

// ─── Shared helpers ──────────────────────────────────────────────────────────

function SectionHeading({ icon: Icon, title, description }: { icon: typeof KeyRound; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[var(--radius-field)] bg-gold-soft" aria-hidden="true">
        <Icon size={16} />
      </span>
      <div>
        <h2 className="font-bold text-navy">{title}</h2>
        <p className="mt-0.5 text-sm text-muted">{description}</p>
      </div>
    </div>
  )
}

function StatusMessage({ message, error }: { message: string; error: boolean }) {
  if (!message) return null
  return (
    <p role="alert" className={`mt-3 flex items-center gap-2 rounded-[var(--radius-field)] px-4 py-3 text-sm font-medium ${error ? 'bg-danger/10 text-danger' : 'bg-ok/10 text-ok'}`}>
      {error ? <AlertTriangle size={14} aria-hidden="true" /> : <CheckCircle2 size={14} aria-hidden="true" />}
      {message}
    </p>
  )
}

// ─── Change Password ──────────────────────────────────────────────────────────

function ChangePasswordSection({ email }: { email: string }) {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (newPassword !== confirm) {
      setIsError(true)
      setMsg('New passwords do not match.')
      return
    }
    if (newPassword.length < 8) {
      setIsError(true)
      setMsg('New password must be at least 8 characters.')
      return
    }
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setIsError(true)
        setMsg(data.error ?? 'Unable to change password.')
      } else {
        setIsError(false)
        setMsg('Password changed. You have been signed out for security. Please sign in again.')
        setTimeout(() => router.push('/login'), 2500)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card-surface p-6" aria-labelledby="change-password-heading">
      <SectionHeading icon={KeyRound} title="Change Password" description="Use a strong password you do not reuse elsewhere." />
      <form onSubmit={handleSubmit} className="mt-5 space-y-4" id="change-password-heading">
        <div>
          <label className="block text-sm font-bold text-navy">
            Account email
            <input className="field mt-2 bg-canvas" value={email} disabled aria-label="Account email (read only)" />
          </label>
        </div>
        <div>
          <label className="block text-sm font-bold text-navy">
            Current password
            <input
              type="password"
              className="field mt-2"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold text-navy">
            New password
            <input
              type="password"
              className="field mt-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>
          <label className="block text-sm font-bold text-navy">
            Confirm new password
            <input
              type="password"
              className="field mt-2"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </label>
        </div>
        <StatusMessage message={msg} error={isError} />
        <button type="submit" disabled={loading} className="gold-button disabled:opacity-60">
          {loading ? 'Saving…' : 'Change Password'}
        </button>
      </form>
    </section>
  )
}

// ─── Change Email ────────────────────────────────────────────────────────────

function ChangeEmailSection({ email }: { email: string }) {
  const [newEmail, setNewEmail] = useState('')
  const [msg] = useState('')
  const [isError] = useState(false)

  return (
    <section className="card-surface p-6" aria-labelledby="change-email-heading">
      <SectionHeading icon={Mail} title="Change Email" description="A verification step will be required before your email is updated." />
      <div className="mt-5 space-y-4">
        <label className="block text-sm font-bold text-navy">
          Current email
          <input className="field mt-2 bg-canvas" value={email} disabled aria-label="Current email (read only)" />
        </label>
        <label className="block text-sm font-bold text-navy">
          New email address
          <input
            type="email"
            className="field mt-2"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="your@newemail.com"
          />
        </label>
        <StatusMessage message={msg} error={isError} />
        <div className="rounded-[var(--radius-field)] border border-line bg-canvas px-4 py-3 text-sm text-muted">
          Email change verification is not yet available. This feature is coming soon.
        </div>
      </div>
    </section>
  )
}

// ─── Sign Out of All Devices ─────────────────────────────────────────────────

function SignOutAllSection() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch('/api/account/sign-out-all', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setIsError(true)
        setMsg(data.error ?? 'Unable to sign out.')
      } else {
        setIsError(false)
        setMsg('Signed out. Redirecting to login…')
        setTimeout(() => router.push('/login'), 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card-surface p-6" aria-labelledby="sign-out-all-heading">
      <SectionHeading icon={LogOut} title="Sign Out of All Devices" description="This will sign your account out on every device. You will need to sign in again." />
      <div className="mt-5 space-y-4">
        {!confirmed ? (
          <button
            type="button"
            onClick={() => setConfirmed(true)}
            className="rounded-[var(--radius-field)] border border-navy px-4 py-2.5 text-sm font-bold text-navy hover:bg-canvas"
          >
            Sign out of all devices
          </button>
        ) : (
          <div className="rounded-[var(--radius-card)] border border-line bg-canvas p-4">
            <p className="text-sm font-semibold text-navy">Confirm sign out of all devices?</p>
            <p className="mt-1 text-xs text-muted">Your current session will also be ended.</p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={loading}
                className="rounded-[var(--radius-field)] bg-navy px-4 py-2 text-sm font-bold text-white hover:bg-navy-deep disabled:opacity-60"
              >
                {loading ? 'Signing out…' : 'Confirm sign out'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmed(false)}
                className="rounded-[var(--radius-field)] border border-line px-4 py-2 text-sm text-muted hover:bg-canvas"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <StatusMessage message={msg} error={isError} />
      </div>
    </section>
  )
}

// ─── Data Export ─────────────────────────────────────────────────────────────

function DataExportSection() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)

  async function handleExport() {
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch('/api/account/data-export', { method: 'POST' })
      if (!res.ok) {
        const data = await res.json()
        setIsError(true)
        setMsg(data.error ?? 'Unable to prepare export.')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'nexit-data-export.json'
      a.click()
      URL.revokeObjectURL(url)
      setIsError(false)
      setMsg('Export downloaded.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card-surface p-6" aria-labelledby="data-export-heading">
      <SectionHeading icon={Download} title="Download My Data" description="Export a copy of your Nexit Profile, plan, and settings as a JSON file." />
      <div className="mt-5 space-y-3">
        <p className="text-sm text-muted">
          Your export will include your profile, Nexit Plan, and settings. It will not include password hashes or internal security records.
        </p>
        <StatusMessage message={msg} error={isError} />
        <button
          type="button"
          onClick={handleExport}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-[var(--radius-field)] border border-navy px-4 py-2.5 text-sm font-bold text-navy hover:bg-canvas disabled:opacity-60"
        >
          <Download size={14} aria-hidden="true" />
          {loading ? 'Preparing…' : 'Download my data'}
        </button>
      </div>
    </section>
  )
}

// ─── Delete Account ───────────────────────────────────────────────────────────

const REQUIRED_PHRASE = 'DELETE MY NEXIT ACCOUNT'

function DeleteAccountSection() {
  const router = useRouter()
  const [stage, setStage] = useState<'idle' | 'confirm' | 'deleting' | 'done'>('idle')
  const [password, setPassword] = useState('')
  const [phrase, setPhrase] = useState('')
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)

  const phraseMatches = phrase === REQUIRED_PHRASE

  async function handleDelete(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!phraseMatches) return
    setStage('deleting')
    setMsg('')
    try {
      const res = await fetch('/api/account/deletion-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmationPhrase: REQUIRED_PHRASE, currentPassword: password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setIsError(true)
        setMsg(data.error ?? 'Unable to delete account.')
        setStage('confirm')
      } else {
        setStage('done')
        setIsError(false)
        setMsg('Your account has been deleted.')
        setTimeout(() => router.push('/'), 3000)
      }
    } catch {
      setIsError(true)
      setMsg('A network error occurred. Please try again.')
      setStage('confirm')
    }
  }

  return (
    <section className="rounded-[var(--radius-card)] border-2 border-danger/30 bg-danger/5 p-6" aria-labelledby="delete-account-heading">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[var(--radius-field)] bg-danger/10 text-danger" aria-hidden="true">
          <Trash2 size={16} />
        </span>
        <div>
          <h2 id="delete-account-heading" className="font-bold text-danger">Delete My Account</h2>
          <p className="mt-0.5 text-sm text-muted">This action is permanent and cannot be undone.</p>
        </div>
      </div>

      {stage === 'idle' && (
        <div className="mt-5 space-y-3">
          <p className="text-sm text-muted">Deleting your account will permanently remove:</p>
          <ul className="space-y-1 text-sm text-muted">
            {[
              'Your Nexit Profile and all saved answers',
              'Your Nexit Plan, tasks, and budget',
              'Your saved Nextinations',
              'All account and session data',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-danger/60" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted">
            Community contributions may be anonymized rather than deleted. A minimal operational record of the deletion may be retained for fraud and security purposes.
          </p>
          <button
            type="button"
            onClick={() => setStage('confirm')}
            className="mt-2 rounded-[var(--radius-field)] border border-danger px-4 py-2.5 text-sm font-bold text-danger hover:bg-danger/10"
          >
            Continue to account deletion
          </button>
        </div>
      )}

      {(stage === 'confirm' || stage === 'deleting') && (
        <form onSubmit={handleDelete} className="mt-5 space-y-4">
          <div className="rounded-[var(--radius-field)] border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-muted">
            <strong className="block font-bold text-danger">This is permanent.</strong>
            Your account and all associated data will be deleted immediately. This cannot be reversed.
          </div>
          <label className="block text-sm font-bold text-navy">
            Current password
            <input
              type="password"
              className="field mt-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <label className="block text-sm font-bold text-navy">
            Type <span className="font-mono text-danger">{REQUIRED_PHRASE}</span> to confirm
            <input
              type="text"
              className={`field mt-2 font-mono ${phrase && !phraseMatches ? 'border-danger' : ''}`}
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              required
              autoComplete="off"
              spellCheck={false}
            />
            {phrase && !phraseMatches && (
              <span className="mt-1 block text-xs text-danger">Phrase does not match exactly.</span>
            )}
          </label>
          <StatusMessage message={msg} error={isError} />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!phraseMatches || stage === 'deleting' || !password}
              className="rounded-[var(--radius-field)] bg-danger px-4 py-2.5 text-sm font-bold text-white hover:bg-danger/90 disabled:opacity-40"
            >
              {stage === 'deleting' ? 'Deleting…' : 'Delete my account permanently'}
            </button>
            <button
              type="button"
              onClick={() => { setStage('idle'); setPhrase(''); setPassword(''); setMsg('') }}
              className="rounded-[var(--radius-field)] border border-line px-4 py-2 text-sm text-muted hover:bg-canvas"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {stage === 'done' && (
        <div className="mt-5 rounded-[var(--radius-field)] bg-ok/10 px-4 py-3 text-sm font-semibold text-ok">
          Your account has been deleted. Redirecting…
        </div>
      )}
    </section>
  )
}

// ─── Privacy & Account page ───────────────────────────────────────────────────

export function PrivacyAccountPage({ email }: { email: string }) {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Settings</p>
        <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">Privacy &amp; Account</h1>
        <p className="mt-1 text-sm text-muted">Manage your credentials, sessions, data, and account.</p>
      </div>

      {/* Account Information */}
      <section aria-labelledby="account-info-heading">
        <h2 id="account-info-heading" className="mb-4 text-xs font-bold uppercase tracking-widest text-muted">Account Information</h2>
        <div className="space-y-4">
          <ChangeEmailSection email={email} />
          <ChangePasswordSection email={email} />
        </div>
      </section>

      {/* Security */}
      <section aria-labelledby="security-heading">
        <h2 id="security-heading" className="mb-4 text-xs font-bold uppercase tracking-widest text-muted">Security</h2>
        <SignOutAllSection />
      </section>

      {/* Your Data */}
      <section aria-labelledby="your-data-heading">
        <h2 id="your-data-heading" className="mb-4 text-xs font-bold uppercase tracking-widest text-muted">Your Data</h2>
        <DataExportSection />
      </section>

      {/* Danger Zone */}
      <section aria-labelledby="danger-zone-heading">
        <h2 id="danger-zone-heading" className="mb-4 text-xs font-bold uppercase tracking-widest text-muted">Danger Zone</h2>
        <DeleteAccountSection />
      </section>
    </div>
  )
}
