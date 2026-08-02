'use client'

import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { PLAN_TIERS, type PlanTier } from '@/lib/plan-tiers'
import type { AdminOverview, AdminUser, SiteAnnouncement } from '@/lib/admin-data'

const PLAN_LABEL: Record<PlanTier, string> = { free: 'Free', plus: 'Plus', navigator: 'Navigator' }

export function AdminClient({
  users: initialUsers, overview, announcement, currentUserId,
}: {
  users: AdminUser[]
  overview: AdminOverview
  announcement: SiteAnnouncement | null
  currentUserId: number
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold-deep">
          <ShieldCheck size={14} aria-hidden="true" /> Admin
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-navy sm:text-4xl">Console</h1>
        <p className="mt-1 text-sm text-muted">Manage accounts, plan access, and site-wide content. Visible to admins only.</p>
      </div>

      <OverviewSection overview={overview} />
      <UsersSection initialUsers={initialUsers} currentUserId={currentUserId} />
      <AnnouncementSection initial={announcement} />
    </div>
  )
}

function OverviewSection({ overview }: { overview: AdminOverview }) {
  const stats = [
    { label: 'Total accounts', value: overview.totalUsers, hint: 'Registered users' },
    { label: 'Completed profiles', value: overview.completedProfiles, hint: 'Finished the wizard' },
    { label: 'Plus', value: overview.planCounts.plus, hint: 'On the Plus tier' },
    { label: 'Navigator', value: overview.planCounts.navigator, hint: 'On the Navigator tier' },
  ]
  return (
    <section>
      <h2 className="text-lg font-bold text-navy">Overview</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-surface p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-navy">{s.value}</p>
            <p className="mt-1 text-xs text-muted">{s.hint}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">Plan split — Free {overview.planCounts.free} · Plus {overview.planCounts.plus} · Navigator {overview.planCounts.navigator}.</p>
    </section>
  )
}

function UsersSection({ initialUsers, currentUserId }: { initialUsers: AdminUser[]; currentUserId: number }) {
  const [users, setUsers] = useState(initialUsers)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function changePlan(id: number, plan: PlanTier) {
    setBusyId(id)
    setError(null)
    const prev = users
    setUsers((list) => list.map((u) => (u.id === id ? { ...u, plan } : u)))
    try {
      const res = await fetch('/api/admin/users/plan', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, plan }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setUsers(prev)
        setError(data?.error ?? 'Unable to update plan.')
      }
    } catch {
      setUsers(prev)
      setError('Unable to update plan.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section>
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-lg font-bold text-navy">Users &amp; plans</h2>
        <span className="text-xs text-muted">{users.length} account{users.length === 1 ? '' : 's'}</span>
      </div>
      {error && <p className="mt-2 rounded-[var(--radius-field)] bg-danger/10 p-2.5 text-xs font-semibold text-danger">{error}</p>}
      <div className="card-surface mt-3 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-bold">Account</th>
              <th className="px-4 py-3 font-bold">Profile</th>
              <th className="px-4 py-3 font-bold">Plan</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <p className="font-bold text-navy">{u.display_name || '—'}{u.is_admin && <span className="ml-2 rounded-pill bg-navy px-1.5 py-0.5 text-[10px] font-bold text-gold">Admin</span>}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                </td>
                <td className="px-4 py-3 text-xs text-muted">{u.wizard_status.replace(/_/g, ' ')}</td>
                <td className="px-4 py-3">
                  <select
                    className="field h-10 w-40"
                    value={u.plan}
                    disabled={busyId === u.id || u.is_admin}
                    title={u.is_admin ? 'Admins are always on the top tier' : undefined}
                    onChange={(e) => changePlan(u.id, e.target.value as PlanTier)}
                    aria-label={`Plan for ${u.email}`}
                  >
                    {PLAN_TIERS.map((p) => <option key={p} value={p}>{PLAN_LABEL[p]}</option>)}
                  </select>
                  {u.id === currentUserId && <span className="ml-2 text-[11px] text-muted">(you)</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted">Admin accounts are always promoted to Navigator on load, so their plan can&rsquo;t be lowered here.</p>
    </section>
  )
}

function AnnouncementSection({ initial }: { initial: SiteAnnouncement | null }) {
  const [text, setText] = useState(initial?.text ?? '')
  const [href, setHref] = useState(initial?.href ?? '')
  const [linkLabel, setLinkLabel] = useState(initial?.linkLabel ?? '')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  async function save(clear = false) {
    setStatus('saving')
    try {
      const res = await fetch('/api/admin/announcement', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clear ? { text: '' } : { text, href, linkLabel }),
      })
      if (!res.ok) { setStatus('error'); return }
      if (clear) { setText(''); setHref(''); setLinkLabel('') }
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section>
      <h2 className="text-lg font-bold text-navy">Site content</h2>
      <p className="mt-1 text-sm text-muted">Publish a site-wide announcement bar shown above the header for every user. Leave the message empty to hide it.</p>
      <div className="card-surface mt-3 space-y-3 p-5">
        <div>
          <label htmlFor="ann-text" className="text-xs font-bold text-navy">Message</label>
          <input id="ann-text" className="field mt-1" value={text} maxLength={300} onChange={(e) => { setText(e.target.value); setStatus('idle') }} placeholder="e.g. New Greenbook insights for Portugal are live." />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="ann-href" className="text-xs font-bold text-navy">Link URL (optional)</label>
            <input id="ann-href" className="field mt-1" value={href} maxLength={500} onChange={(e) => { setHref(e.target.value); setStatus('idle') }} placeholder="/greenbook" />
          </div>
          <div>
            <label htmlFor="ann-label" className="text-xs font-bold text-navy">Link label (optional)</label>
            <input id="ann-label" className="field mt-1" value={linkLabel} maxLength={60} onChange={(e) => { setLinkLabel(e.target.value); setStatus('idle') }} placeholder="Learn more" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="gold-button" onClick={() => save(false)} disabled={status === 'saving' || !text.trim()}>
            {status === 'saving' ? 'Saving…' : 'Publish announcement'}
          </button>
          <button type="button" className="inline-flex min-h-11 items-center rounded-[var(--radius-btn)] border border-line bg-white px-4 text-sm font-bold text-navy hover:bg-canvas" onClick={() => save(true)} disabled={status === 'saving'}>
            Clear
          </button>
          {status === 'saved' && <span className="text-xs font-semibold text-ok">Saved.</span>}
          {status === 'error' && <span className="text-xs font-semibold text-danger">Couldn&rsquo;t save.</span>}
        </div>
      </div>
    </section>
  )
}
