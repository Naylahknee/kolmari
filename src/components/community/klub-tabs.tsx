'use client'

import { useState } from 'react'

type KlubTab = 'chatter' | 'discover' | 'my-klubs'

const TABS: { id: KlubTab; label: string }[] = [
  { id: 'chatter', label: 'Chatter' },
  { id: 'discover', label: 'Discover Klubs' },
  { id: 'my-klubs', label: 'My Klubs' },
]

/**
 * KlubTabs — tab navigation for Kolmari Klub sections.
 * All tabs show honest empty states until community features are built.
 */
export function KlubTabs() {
  const [active, setActive] = useState<KlubTab>('chatter')

  return (
    <div className="mt-6">
      {/* Tab bar */}
      <div className="k-tabbar">
        <div role="tablist" aria-label="Kolmari Klub sections" className="k-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={active === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className="k-tab"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab panels */}
      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className="mt-4"
      >
        {active === 'chatter' && <ChatterFeed />}
        {active === 'discover' && <DiscoverKlubs />}
        {active === 'my-klubs' && <MyKlubs />}
      </div>
    </div>
  )
}

function ChatterFeed() {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-white p-6 text-muted">
      <p className="font-semibold text-navy">No chatter yet.</p>
      <p className="mt-1 text-sm">
        Community discussions open when Kolmari Klub launches. You&apos;ll see destination-specific conversations, relocation notes, and practical questions here.
      </p>
    </div>
  )
}

function DiscoverKlubs() {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-white p-6 text-muted">
      <p className="font-semibold text-navy">No Klubs available yet.</p>
      <p className="mt-1 text-sm">
        Destination-focused Klubs are being created. Check back when Kolmari Klub launches.
      </p>
    </div>
  )
}

function MyKlubs() {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-white p-6 text-muted">
      <p className="font-semibold text-navy">You haven&apos;t joined any Klubs yet.</p>
      <p className="mt-1 text-sm">
        Once Kolmari Klub launches, you can join destination-specific Klubs to connect with others planning the same move.
      </p>
    </div>
  )
}
