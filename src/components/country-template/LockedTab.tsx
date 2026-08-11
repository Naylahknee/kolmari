import Link from 'next/link'
import { ArrowRight, Lock } from 'lucide-react'

/**
 * The locked tab body a free account sees on every country tab except Overview.
 *
 * It names what the tab contains — the real section titles and their count — so
 * the value is legible without giving away the research itself. Titles are the
 * tab's actual sections, never invented.
 */
export function LockedTab({
  countryName,
  tabLabel,
  title,
  sections,
}: {
  countryName: string
  tabLabel: string
  title: string
  sections: string[]
}) {
  return (
    <section className="card-surface p-5 sm:p-6" aria-labelledby="locked-tab-heading">
      <p className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold-deep">
        <Lock size={12} aria-hidden="true" /> Kolmari Pro
      </p>

      <h2 id="locked-tab-heading" className="mt-2 text-xl font-bold text-navy">{title}</h2>
      <p className="mt-1.5 max-w-2xl text-[13px] leading-6 text-muted">
        This tab is part of your personalized workspace. It carries the full {tabLabel.toLowerCase()} research
        for {countryName} on this subject, written against your household and income rather than a general
        audience.
      </p>

      {sections.length > 0 && (
        <ol className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((name, i) => (
            <li
              key={name}
              className="flex items-start gap-2.5 rounded-[var(--radius-field)] border border-line bg-canvas/40 px-3 py-2.5"
            >
              <span
                className="mt-px grid size-[18px] flex-none place-items-center rounded-full bg-white text-[10px] font-bold text-muted ring-1 ring-line"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="text-[12.5px] font-semibold leading-[1.35] text-navy">{name}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link href="/coming-soon?feature=plus" className="gold-button">
          Unlock Kolmari Pro <ArrowRight size={15} aria-hidden="true" />
        </Link>
        {sections.length > 0 && (
          <span className="text-xs font-semibold text-muted">
            {sections.length} section{sections.length === 1 ? '' : 's'} in this tab
          </span>
        )}
      </div>
    </section>
  )
}
