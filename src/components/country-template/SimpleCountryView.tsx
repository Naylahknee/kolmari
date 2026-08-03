'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { BarChart3, Building2, Check, Stamp } from 'lucide-react'
import { UnitsProvider } from './client/UnitsControl'
import { CountryOutline } from './CountryOutline'
import { getApprovedHero } from '@/lib/country-visuals/data'
import { focalToObjectPosition } from '@/lib/country-visuals/schema'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'

// Structural shape shared by both country registries (CountryDetail and
// DiscoverableCountry).
type SimpleCountry = { slug: string; name: string; code: string; city: string; region: string }

/*
  The FREE country view. Every visitor on the free plan sees the same simple,
  non-expanded page for any country: country info, a short summary, basic visa
  info, and a small real map — plus an upgrade CTA. No tabs, no snapshot grid,
  no Match Score ring, no checklist. Those belong to the paid rich page.

  Data integrity: figures appear only when they are verified. Where a country
  has no verified visa dataset, we say so honestly rather than borrowing another
  country's numbers.
*/

function VisaLine({ visaType, incomeRequired, name }: { visaType?: string; incomeRequired?: number; name: string }) {
  if (!visaType) {
    return (
      <p className="text-sm leading-6 text-muted">
        Visa and residency details for {name} are being verified. We show a pathway only once it is
        confirmed against the official immigration authority.
      </p>
    )
  }
  return (
    <div className="text-sm leading-6 text-navy">
      <p>
        <span className="font-bold">Primary route:</span> {visaType}
      </p>
      {typeof incomeRequired === 'number' && incomeRequired > 0 && (
        <p className="mt-1 text-muted">
          Typical income guideline around <b>${incomeRequired.toLocaleString()}/mo</b>. Confirm the current
          threshold with the official authority before you plan around it.
        </p>
      )}
    </div>
  )
}

/** Blurred placeholder card standing in for a locked deep-info section. */
function SkeletonCard({ title, rows }: { title: string; rows: number }) {
  return (
    <div className="card-surface p-5">
      <p className="text-sm font-bold text-navy/70">{title}</p>
      <div className="mt-3 space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="h-3 w-24 rounded bg-line" />
            <span className="h-3 w-12 rounded bg-line" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SimpleCountryView({
  country,
  visaType,
  incomeRequired,
  summary,
}: {
  country: SimpleCountry
  visaType?: string
  incomeRequired?: number
  summary?: string
}) {
  const hero = getApprovedHero(country.slug)
  const toggleRail = () => document.body.classList.toggle('rail-collapsed')
  useEffect(() => {
    if (window.innerWidth <= 900) document.body.classList.remove('rail-collapsed')
  }, [])

  return (
    <UnitsProvider>
      <div className="country-template-root">
        <TopBar onToggleRail={toggleRail} />
        <div className="shell">
          <button type="button" className="rail-backdrop" onClick={toggleRail} aria-label="Close navigation" />
          <Sidebar />
          <main className="main">
            <div className="mx-auto max-w-5xl space-y-6">
              {/* Country header */}
              <section className="card-surface p-6 sm:p-7">
                <div className="text-xs font-bold uppercase tracking-widest text-gold-deep">
                  {country.region} · {country.city}
                </div>
                <h1 className="mt-2 flex items-center gap-3 text-3xl font-extrabold text-navy sm:text-4xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                    alt=""
                    className="h-7 w-10 rounded-sm object-cover shadow"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  {country.name}
                </h1>
                {summary && <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">{summary}</p>}
              </section>

              {/* Hero panel: the country's flag + silhouette artwork (never a
                  locator map). Falls back to the branded gradient + outline when
                  no approved artwork is committed for this country. */}
              <section className="overflow-hidden rounded-card border border-line bg-white shadow-card">
                {hero ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hero.src}
                    alt={`${country.name} flag with the country outline`}
                    className="block aspect-[16/9] w-full object-cover"
                    style={{ objectPosition: focalToObjectPosition(hero.focalPoint) }}
                  />
                ) : (
                  <div
                    role="img"
                    aria-label={`${country.name} flag and outline`}
                    className="relative grid aspect-[16/9] place-items-center overflow-hidden"
                    style={{ background: 'linear-gradient(135deg,#122a52,#1b3f68)' }}
                  >
                    <CountryOutline code={country.code} fill="rgba(255,255,255,0.18)" style={{ height: '76%', width: 'auto' }} />
                  </div>
                )}
              </section>

              {/* Basic visa info */}
              <section className="card-surface p-6">
                <h2 className="flex items-center gap-2 text-base font-bold text-navy">
                  <Stamp size={18} className="text-gold-deep" aria-hidden="true" /> Basic visa info
                </h2>
                <div className="mt-3">
                  <VisaLine visaType={visaType} incomeRequired={incomeRequired} name={country.name} />
                </div>
              </section>

              {/* Deep country information — blurred preview behind an upgrade overlay */}
              <section aria-label="Country information (locked)">
                <h2 className="text-lg font-bold text-navy">Country Information</h2>
                <div className="relative mt-3">
                  {/* Blurred skeleton of the deep sections */}
                  <div className="pointer-events-none select-none blur-[6px] opacity-60" aria-hidden="true">
                    <div className="grid gap-4 md:grid-cols-3">
                      <SkeletonCard title="Country Overview" rows={4} />
                      <SkeletonCard title="Key Metrics" rows={4} />
                      <SkeletonCard title="Popular Cities" rows={4} />
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <SkeletonCard title="Cost of Living" rows={3} />
                      <SkeletonCard title="Pros & Cons" rows={3} />
                    </div>
                  </div>

                  {/* Upgrade overlay */}
                  <div className="absolute inset-0 grid place-items-center p-4">
                    <div className="w-full max-w-md overflow-hidden rounded-card bg-white shadow-drawer">
                      <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-teal to-teal-deep p-4">
                        {[BarChart3, Building2, Stamp].map((Icon, i) => (
                          <span key={i} className="grid size-9 place-items-center rounded-[var(--radius-field)] bg-white/20 text-white"><Icon size={18} /></span>
                        ))}
                      </div>
                      <div className="p-6 text-center">
                        <h3 className="text-lg font-bold text-navy">Dive deeper into {country.name}</h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
                          Unlock detailed stats, cost of living, popular cities, pros &amp; cons, and visa pathways —
                          everything you need to decide if {country.name} is right for you.
                        </p>
                        <ul className="mx-auto mt-4 grid max-w-sm grid-cols-1 gap-2 text-left sm:grid-cols-2">
                          {['Country overview & stats', 'Cost of living breakdown', 'Popular cities to live', 'Pros & cons analysis', 'Visa option details', 'Key quality-of-life metrics'].map((f) => (
                            <li key={f} className="flex items-start gap-1.5 text-sm text-navy/85">
                              <Check size={15} className="mt-0.5 shrink-0 text-teal-deep" aria-hidden="true" /> {f}
                            </li>
                          ))}
                        </ul>
                        <Link href="/coming-soon?feature=plus" className="gold-button mt-5 w-full">View plans</Link>
                        <p className="mt-2 text-xs text-muted">Included with paid Kolmari memberships</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </UnitsProvider>
  )
}
