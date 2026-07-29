'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Lock, MapPin, Sparkles, Stamp } from 'lucide-react'
import { UnitsProvider } from './client/UnitsControl'
import { CountrySnapshotMap } from '@/components/country-workspace/CountrySnapshotMap'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'

// Structural shape shared by both country registries (CountryDetail and
// DiscoverableCountry).
type SimpleCountry = { slug: string; name: string; code: string; city: string; region: string }
type LatLng = { lat: number; lng: number }

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

export function SimpleCountryView({
  country,
  center,
  visaType,
  incomeRequired,
  summary,
}: {
  country: SimpleCountry
  center: LatLng | null
  visaType?: string
  incomeRequired?: number
  summary?: string
}) {
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
            <div className="mx-auto max-w-3xl space-y-6">
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

              {/* Small real map */}
              <section className="overflow-hidden rounded-card border border-line bg-white shadow-card">
                {center ? (
                  <CountrySnapshotMap
                    countryName={country.name}
                    lat={center.lat}
                    lng={center.lng}
                    alt={`Map of ${country.name}`}
                  />
                ) : (
                  <div
                    role="img"
                    aria-label={`${country.name} map unavailable`}
                    className="flex aspect-[16/9] min-h-48 items-center justify-center gap-2 bg-canvas text-sm font-semibold text-muted"
                  >
                    <MapPin size={18} className="text-gold-deep" /> Map for {country.name} is being added
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

              {/* Upgrade CTA */}
              <section className="relative overflow-hidden rounded-card border border-gold/40 bg-gold-soft/30 p-6">
                <span className="inline-flex items-center gap-1.5 rounded-pill bg-white px-2.5 py-1 text-xs font-bold text-gold-deep">
                  <Lock size={13} aria-hidden="true" /> Plus feature
                </span>
                <h2 className="mt-3 text-lg font-bold text-navy">Unlock the full {country.name} page</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-navy/80">
                  Plus opens the full research page for {country.name}: the country snapshot, top cities with
                  maps, verified pathways and thresholds, your Match Score, cost breakdowns, and a step-by-step
                  Move Plan. Explorer stays free.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/#pricing" className="gold-button">
                    Upgrade to Plus <ArrowRight size={15} />
                  </Link>
                  <Link
                    href="/cost-calculator"
                    className="inline-flex min-h-11 items-center rounded-[var(--radius-btn)] border border-line bg-white px-5 text-sm font-bold text-navy"
                  >
                    <Sparkles size={15} className="mr-2 text-gold-deep" /> Open Cost Calculator
                  </Link>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </UnitsProvider>
  )
}
