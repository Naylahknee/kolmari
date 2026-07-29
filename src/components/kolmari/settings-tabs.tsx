'use client'
import { useState } from 'react'
import type { RelocationProfile } from '@/lib/profile'
import { SettingsForm } from './settings-form'
import { PrivacyAccountPage } from './privacy-account-page'

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'account', label: 'Privacy & Account' },
] as const
type TabId = (typeof TABS)[number]['id']

/**
 * Settings on a single screen with tabs across the top (General ·
 * Privacy & Account) instead of separate pages.
 */
export function SettingsTabs({
  initial,
  email,
  initialTab = 'general',
}: {
  initial: RelocationProfile
  email: string
  initialTab?: TabId
}) {
  const [tab, setTab] = useState<TabId>(initialTab)

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Settings</h1>
      <div className="mt-4 flex gap-1 border-b border-line" role="tablist" aria-label="Settings sections">
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
                '-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition',
                active ? 'border-gold text-navy' : 'border-transparent text-muted hover:text-navy',
              ].join(' ')}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <div className="mt-6" role="tabpanel">
        {tab === 'general' ? <SettingsForm initial={initial} email={email} /> : <PrivacyAccountPage email={email} />}
      </div>
    </div>
  )
}
