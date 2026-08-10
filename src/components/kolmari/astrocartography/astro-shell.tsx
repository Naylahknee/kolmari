'use client'

import { useState } from 'react'

/* Astrocartography relocation shell — SCAFFOLD ONLY (owner-approved).
 *
 * Some people use astrocartography (planetary lines from a birth chart) to help
 * decide where to move. This page frames that as a Kolmari relocation tool: the
 * interaction flow (birth details → "map my lines" → results) is here, but the
 * actual line calculation is deliberately NOT implemented. Real lines need an
 * ephemeris (accurate planetary positions for a birth moment) from a data source
 * that hasn't been chosen. Per the data-integrity rules we never invent planetary
 * line positions, so the results panel shows an honest "being built" state.
 *
 * Birth details stay in this component's state only — nothing is sent anywhere or
 * persisted. */

// What the tool will map once a data source is connected — shown so the page
// explains itself, framed as forthcoming, not as a reading of the user's chart.
const PLANNED_LINES = [
  { body: 'Sun', theme: 'Vitality, visibility, where you feel most yourself' },
  { body: 'Moon', theme: 'Comfort, belonging, emotional home' },
  { body: 'Venus', theme: 'Ease, relationships, quality of daily life' },
  { body: 'Jupiter', theme: 'Growth, opportunity, expansion' },
  { body: 'Saturn', theme: 'Structure, discipline, weight' },
]

export function AstrocartographyShell() {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [unknownTime, setUnknownTime] = useState(false)
  const [place, setPlace] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = date.trim() !== '' && place.trim() !== ''

  return (
    <div className="space-y-6">
      {/* Portal hero — ritual/energy framing, on-brand navy + gold */}
      <section
        className="relative overflow-hidden rounded-[var(--radius-card)] px-6 py-8 text-white sm:px-8"
        style={{ background: 'radial-gradient(120% 140% at 80% 0%, #1b3f68 0%, #17305b 40%, #0d1b39 100%)' }}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">Relocation astrocartography</p>
        <h1 className="mt-2 max-w-xl font-display text-2xl font-bold leading-tight sm:text-3xl">
          Where do your lines point?
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
          Astrocartography maps the planetary lines from your birth chart onto the world — some people use it as one more
          lens when deciding where to move. Enter your birth details to set up your map.
        </p>
      </section>

      {/* Birth details form */}
      <section className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-tile sm:p-6">
        <h2 className="text-sm font-bold text-navy">Your birth details</h2>
        <p className="mt-0.5 text-xs text-muted">
          Accurate lines need the date, time, and place of birth. These stay on this page — nothing is saved yet.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted-soft">Date of birth</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-[var(--radius-field)] border border-line px-3 py-2 text-sm text-navy outline-none focus:border-navy/40"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted-soft">Time of birth</span>
            <input
              type="time"
              value={time}
              disabled={unknownTime}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 w-full rounded-[var(--radius-field)] border border-line px-3 py-2 text-sm text-navy outline-none focus:border-navy/40 disabled:bg-neutral-100 disabled:text-muted"
            />
            <span className="mt-1 flex items-center gap-1.5 text-[11px] text-muted">
              <input type="checkbox" checked={unknownTime} onChange={(e) => setUnknownTime(e.target.checked)} className="h-3.5 w-3.5 accent-[color:var(--color-gold-deep)]" />
              I don&rsquo;t know my birth time
            </span>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted-soft">Place of birth</span>
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="City, country"
              className="mt-1 w-full rounded-[var(--radius-field)] border border-line px-3 py-2 text-sm text-navy outline-none focus:border-navy/40"
            />
          </label>
        </div>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => setSubmitted(true)}
          className="mt-4 rounded-[var(--radius-btn,999px)] bg-gold px-5 py-2.5 text-sm font-bold text-navy-deep transition hover:bg-[#e0b40c] disabled:opacity-50"
        >
          Map my lines
        </button>
        {unknownTime && (
          <p className="mt-2 text-[11px] text-muted">
            Without a birth time, some lines (especially the Ascendant/Midheaven angles) can&rsquo;t be placed precisely — the
            map will note where accuracy is limited.
          </p>
        )}
      </section>

      {/* Results — honest "being built" state; NO fabricated lines */}
      {submitted && (
        <section className="rounded-[var(--radius-card)] border border-gold/40 bg-gold-soft/40 p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-deep">Your map is being built</p>
          <h2 className="mt-1 text-lg font-bold text-navy">Line calculation isn&rsquo;t live yet</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-navy/80">
            Kolmari calculates relocation lines from a real astronomical ephemeris — never estimated or invented positions.
            That data source is being connected, so your personalized lines aren&rsquo;t available yet. Your details above
            aren&rsquo;t stored; nothing here is a reading of your chart.
          </p>

          <div className="mt-4 rounded-[var(--radius-field)] border border-line bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-soft">What your map will show</p>
            <ul className="mt-2 divide-y divide-line">
              {PLANNED_LINES.map((l) => (
                <li key={l.body} className="flex items-baseline justify-between gap-4 py-2">
                  <span className="text-sm font-bold text-navy">{l.body} line</span>
                  <span className="text-right text-xs text-muted">{l.theme}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] text-muted-soft">
              Each planet&rsquo;s lines will be plotted on the world map and related to the destinations you&rsquo;re
              considering — as one lens among Match Score, cost, and pathway fit, never a relocation recommendation on its own.
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
