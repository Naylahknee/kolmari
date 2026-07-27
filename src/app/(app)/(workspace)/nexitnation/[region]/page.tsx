import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { CountryShapePanel } from '@/components/nexit/CountryShapePanel'
import { PassportIndexLink } from '@/components/nexit/PassportIndexLink'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'
import { calculateRegionMatches } from '@/lib/userProfile'
import { NEXIT_LEXICON } from '@/lib/lexicon'
import { isNexitnationRegion, regionList, regions } from '@/lib/nexitnation-data'

type RegionPageProps = {
  params: Promise<{ region: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return regionList.map((region) => ({ region: region.slug }))
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const { region: slug } = await params
  const region = isNexitnationRegion(slug) ? regions[slug] : null

  if (!region) return { title: 'Nextination Not Found | Nexit' }

  return {
    title: `${region.name} Nextination Guide | Nexit`,
    description: region.description,
  }
}

export default async function NextinationRegionPage({ params }: RegionPageProps) {
  const { region: slug } = await params
  if (!isNexitnationRegion(slug)) notFound()

  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  const matches = calculateRegionMatches(profile)
  const profileComplete = profile.wizard_status === 'completed'
  const region = regions[slug]

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-muted">
        <Link href="/nexitnation" className="font-semibold transition hover:text-navy">Nexitnation</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span className="font-semibold text-navy">{region.name}</span>
      </nav>

      <section className="relative min-h-[360px] overflow-hidden rounded-card bg-navy-deep">
        <Image
          src={region.image}
          alt={`${region.name} geographic artwork`}
          fill
          priority
          sizes="(min-width: 1280px) 1024px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/72 to-navy-deep/10" />
        <div className="relative z-10 flex min-h-[360px] max-w-2xl flex-col justify-end p-7 text-white sm:p-10">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-gold">{NEXIT_LEXICON.regionTitle}</p>
          <h1 className="mt-2 text-5xl font-bold">{region.name}</h1>
          <p className="mt-4 max-w-xl leading-7 text-white/80">{region.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-pill border border-gold/45 bg-gold/12 px-3 py-1.5 text-xs font-bold text-gold">{matches ? `Nexit Match ${matches[slug]}%` : 'Popular region research'}</span>
            <span className="rounded-pill border border-white/20 bg-black/20 px-3 py-1.5 text-xs backdrop-blur">{region.countryCount} countries</span>
            {region.indicators.map((indicator) => (
              <span key={indicator} className="rounded-pill border border-white/20 bg-black/20 px-3 py-1.5 text-xs backdrop-blur">{indicator}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">{matches ? 'Connected to your Nexit Profile' : 'Popular places to research'}</p>
            <h2 className="mt-1 text-3xl font-bold text-navy">Nextinations in {region.name}</h2>
            {!profileComplete && <p className="mt-2 max-w-2xl text-sm text-muted">These are editorial starting points, not personalized rankings. Complete your Nexit Profile to compare regions against your facts.</p>}
          </div>
          <Link href="/countries" className="text-sm font-semibold text-navy transition hover:text-gold-deep">View all Nextinations</Link>
        </div>

        {region.countries.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {region.countries.map((country) => (
              <article key={`${country.slug}-${country.city}`} className="overflow-hidden rounded-card border border-line bg-white shadow-card">
                <CountryShapePanel code={country.code} country={country.name} city={country.city} />
                <div className="p-5">
                  <h3 className="text-lg font-extrabold text-navy">{country.name}</h3>
                  <p className="text-sm text-muted">{country.code} · {country.city}</p>
                  {profileComplete && (country.pathway || country.communityFit || country.monthlyCost) ? (
                    <dl className="mt-4 space-y-2 text-sm">
                      {country.pathway && <div><dt className="text-muted">{NEXIT_LEXICON.pathways}</dt><dd className="font-semibold text-navy">{country.pathway}</dd></div>}
                      {country.communityFit && <div className="flex justify-between gap-3"><dt className="text-muted">{NEXIT_LEXICON.communityFit}</dt><dd className="font-semibold text-navy">{country.communityFit}</dd></div>}
                      {country.monthlyCost !== undefined && <div className="flex justify-between gap-3"><dt className="text-muted">Estimated cost</dt><dd className="font-semibold text-navy">${country.monthlyCost.toLocaleString()}/mo</dd></div>}
                    </dl>
                  ) : (
                    <div className="mt-4 rounded-[var(--radius-field)] bg-canvas p-3 text-xs leading-5 text-muted">
                      {profileComplete ? 'Country research is being verified.' : 'Popular research starting point. Personalized comparison is not available until your profile is complete.'}
                    </div>
                  )}
                  {country.guideAvailable ? (
                    <Link href={`/countries/${country.slug}`} className="gold-button mt-5 w-full">View Nextination <ArrowRight size={15} /></Link>
                  ) : (
                    <span className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-[var(--radius-btn)] bg-canvas px-4 text-sm font-bold text-muted">Country guide in progress</span>
                  )}
                  <PassportIndexLink countrySlug={country.slug} countryName={country.name} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-card border border-line bg-white p-8 text-muted shadow-card">
            Country recommendations for this region are being added. You can still review the region and refine your Pathways now.
          </div>
        )}
      </section>

      <section className="grid gap-6 pb-10 lg:grid-cols-2">
        <article className="rounded-card border border-line bg-white p-6 shadow-card">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">{NEXIT_LEXICON.pathways}</p>
          <h2 className="mt-1 text-2xl font-bold text-navy">{matches ? 'Residency options matched to you' : 'Research residency options'}</h2>
          <p className="mt-3 text-muted">Review visa, residency, work, retirement, and study Pathways based on your Nexit Profile.</p>
          <Link href={matches ? '/pathways' : '/profile-wizard'} className="mt-5 inline-flex rounded-field bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-deep">{matches ? 'Review my Pathways' : 'Start Nexit Profile Wizard'}</Link>
        </article>

        <article className="rounded-card border border-line bg-white p-6 shadow-card">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-deep">{NEXIT_LEXICON.greenbookInsights}</p>
          <h2 className="mt-1 text-2xl font-bold text-navy">Community context to research</h2>
          <p className="mt-3 text-muted">Review belonging signals, neighborhood questions, and practical context without treating editorial guidance as a safety guarantee.</p>
          <Link href="/countries" className="mt-5 inline-flex rounded-field border border-navy px-5 py-3 text-sm font-semibold text-navy transition hover:bg-canvas">Compare Community Fit</Link>
        </article>
      </section>

      <section className="pb-10">
        <PassportIndexLink variant="banner" />
      </section>

      <section className="pb-6">
        <div className="rounded-card bg-navy-deep p-7 text-white sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold">Your {NEXIT_LEXICON.plan}</p>
            <h2 className="mt-1 text-3xl font-bold">Save, compare, and build your relocation plan.</h2>
          </div>
          <Link href="/nexit-plan" className="gold-button mt-5 sm:mt-0">{NEXIT_LEXICON.executionCta} <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  )
}
