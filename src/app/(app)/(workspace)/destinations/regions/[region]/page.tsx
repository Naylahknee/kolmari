import { flagSrc } from '@/lib/flags'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ChevronRight, FlaskConical } from 'lucide-react'
import { RegionCountryArt } from '@/components/kolmari/RegionCountryArt'
import { PassportIndexLink } from '@/components/kolmari/PassportIndexLink'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'
import { calculateRegionMatches } from '@/lib/userProfile'
import { KOLMARI_LEXICON } from '@/lib/lexicon'
import { isKolmariRegion, regionList, regions } from '@/lib/destinations-data'
import { getGeneratedHeroVersion } from '@/lib/country-assets'
import { PATHWAYS, type PathwayDefinition } from '@/lib/pathways'
import { summaryFor } from '@/lib/pathway-summary'
import { LESSER_KNOWN_ROUTES } from '@/lib/pathway-extras'

type RegionPageProps = {
  params: Promise<{ region: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return regionList.map((region) => ({ region: region.slug }))
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const { region: slug } = await params
  const region = isKolmariRegion(slug) ? regions[slug] : null

  if (!region) return { title: 'Destination Not Found | Kolmari' }

  return {
    title: `${region.name} Destination Guide | Kolmari`,
    description: region.description,
  }
}

export default async function NextinationRegionPage({ params }: RegionPageProps) {
  const { region: slug } = await params
  if (!isKolmariRegion(slug)) notFound()

  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  const matches = calculateRegionMatches(profile)
  const region = regions[slug]
  const profileComplete = profile.wizard_status === 'completed'

  const countriesWithPathways = region.countries
    .map((country) => ({
      country,
      pathways: PATHWAYS.filter((pathway: PathwayDefinition) => pathway.country === country.name),
    }))
    .filter((entry) => entry.pathways.length > 0)
  const unresearchedCountries = region.countries.filter(
    (country) => !countriesWithPathways.some((entry) => entry.country.slug === country.slug),
  )
  const regionCountryNames = new Set(region.countries.map((country) => country.name))
  const regionAlternatives = LESSER_KNOWN_ROUTES.filter(
    (route) => regionCountryNames.has(route.country) || (route.country === 'EU-wide' && slug === 'europe'),
  )

  const imageSrcs: Record<string, string> = {}
  await Promise.all(
    region.countries.map(async (country) => {
      const version = await getGeneratedHeroVersion(country.slug)
      if (version) {
        imageSrcs[country.slug] = `/api/country-asset?slug=${country.slug}&type=hero&v=${version}`
      }
    }),
  )

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-muted">
        <Link href="/destinations" className="font-semibold transition hover:text-navy">Destinations</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span className="font-semibold text-navy">{region.name}</span>
      </nav>

      <nav aria-label="Regions" className="mb-5 flex flex-wrap gap-2">
        {regionList.map((item) => (
          <Link
            key={item.slug}
            href={`/destinations/regions/${item.slug}`}
            aria-current={item.slug === slug ? 'page' : undefined}
            className={
              item.slug === slug
                ? 'rounded-pill bg-navy px-4 py-2 text-xs font-bold text-white'
                : 'rounded-pill border border-line bg-white px-4 py-2 text-xs font-bold text-navy transition hover:border-navy'
            }
          >
            {item.name}
          </Link>
        ))}
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
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-gold">{KOLMARI_LEXICON.regionTitle}</p>
          <h1 className="mt-2 text-5xl font-bold">{region.name}</h1>
          <p className="mt-4 max-w-xl leading-7 text-white/80">{region.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-pill border border-gold/45 bg-gold/12 px-3 py-1.5 text-xs font-bold text-gold">{matches ? `Match Score ${matches[slug]}%` : 'Popular region research'}</span>
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
            <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">{matches ? 'Connected to your Profile' : 'Popular places to research'}</p>
            <h2 className="mt-1 text-3xl font-bold text-navy">Destinations in {region.name}</h2>
            {!profileComplete && <p className="mt-2 max-w-2xl text-sm text-muted">These are editorial starting points, not personalized rankings. Complete your Profile to compare regions against your facts.</p>}
          </div>
          <Link href="/destinations" className="text-sm font-semibold text-navy transition hover:text-gold-deep">View all Destinations</Link>
        </div>

        {region.countries.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {region.countries.map((country) => (
              <article key={`${country.slug}-${country.city}`} className="overflow-hidden rounded-card border border-line bg-white shadow-card">
                <RegionCountryArt country={country} imageSrc={imageSrcs[country.slug] ?? null} />
                <div className="p-5">
                  <h3 className="text-lg font-extrabold text-navy">{country.name}</h3>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                    <Image src={flagSrc(country.code)} alt="" width={24} height={16} className="h-4 w-6 rounded-[2px] object-cover" />
                    <span>{country.city}</span>
                  </p>
                  {profileComplete && (country.pathway || country.communityFit || country.monthlyCost) ? (
                    <dl className="mt-4 space-y-2 text-sm">
                      {country.pathway && <div><dt className="text-muted">{KOLMARI_LEXICON.pathways}</dt><dd className="font-semibold text-navy">{country.pathway}</dd></div>}
                      {country.communityFit && <div className="flex justify-between gap-3"><dt className="text-muted">{KOLMARI_LEXICON.communityFit}</dt><dd className="font-semibold text-navy">{country.communityFit}</dd></div>}
                      {country.monthlyCost !== undefined && <div className="flex justify-between gap-3"><dt className="text-muted">Estimated cost</dt><dd className="font-semibold text-navy">${country.monthlyCost.toLocaleString()}/mo</dd></div>}
                    </dl>
                  ) : (
                    <div className="mt-4 rounded-[var(--radius-field)] bg-canvas p-3 text-xs leading-5 text-muted">
                      {profileComplete ? 'Country research is being verified.' : 'Popular research starting point. Personalized comparison is not available until your profile is complete.'}
                    </div>
                  )}
                  {country.guideAvailable ? (
                    <Link href={`/nextinations/${country.slug}/v2/overview`} className="gold-button mt-5 w-full">View Destination <ArrowRight size={15} /></Link>
                  ) : (
                    <span className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-[var(--radius-btn)] bg-canvas px-4 text-sm font-bold text-muted">Country guide in progress</span>
                  )}
                  <div className="mt-3">
                    <PassportIndexLink countrySlug={country.slug} countryName={country.name} countryCode={country.code} lightbox />
                  </div>
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

      <section className="py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">{matches ? 'Connected to your Profile' : 'Research starting points'}</p>
            <h2 className="mt-1 text-3xl font-bold text-navy">Visa routes in {region.name}</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Researched residency routes for this region. Compare the basics here, then open Pathways to explore each route in full.
            </p>
          </div>
          <Link href="/pathways" className="text-sm font-semibold text-navy transition hover:text-gold-deep">Open Pathways</Link>
        </div>

        {countriesWithPathways.length > 0 ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {countriesWithPathways.map(({ country, pathways }) => (
              <article key={country.slug} className="overflow-hidden rounded-card border border-line bg-white shadow-card">
                <div className="flex items-center gap-3 border-b border-line/70 px-5 py-4">
                  <Image src={flagSrc(country.code)} alt="" width={28} height={20} className="h-5 w-7 rounded-[2px] object-cover" />
                  <div>
                    <h3 className="text-base font-extrabold text-navy">{country.name}</h3>
                    <p className="text-xs text-muted">{country.city} · {pathways.length} researched {pathways.length === 1 ? 'route' : 'routes'}</p>
                  </div>
                </div>
                <ul className="divide-y divide-line/70">
                  {pathways.map((pathway) => {
                    const summary = summaryFor(pathway.id, pathway.name)
                    return (
                      <li key={pathway.id}>
                        <Link href="/pathways" className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-canvas/60">
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold text-navy">{summary.shortName}</span>
                            <span className="block truncate text-xs text-muted">{pathway.name}</span>
                          </span>
                          <span className="flex flex-none items-center gap-3">
                            <span className="rounded-pill bg-canvas px-2.5 py-1 text-[11px] font-bold text-navy">{summary.keyFact}</span>
                            <ChevronRight size={16} className="text-muted-soft" aria-hidden="true" />
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
                {country.guideAvailable && (
                  <div className="border-t border-line/70 px-5 py-3">
                    <Link href={`/nextinations/${country.slug}/v2/overview`} className="inline-flex items-center gap-1 text-xs font-bold text-info hover:text-navy">
                      Open {country.name} guide <ArrowRight size={12} aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-card border border-line bg-white p-8 text-muted shadow-card">
            Visa route research for this region is being added. You can still review the region and refine your Pathways now.
          </div>
        )}
        {unresearchedCountries.length > 0 && countriesWithPathways.length > 0 && (
          <p className="mt-4 text-xs text-muted-soft">
            Research in progress for: {unresearchedCountries.map((country) => country.name).join(', ')}.
          </p>
        )}
      </section>

      <section className="pb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Beyond the standard routes</p>
          <h2 className="mt-1 text-3xl font-bold text-navy">Other relocation alternatives</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Lesser-known routes people miss: ancestry, fast-tracks, and special agreements that can skip the standard visa entirely.
          </p>
        </div>
        {regionAlternatives.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {regionAlternatives.map((route) => (
              <article key={`${route.country}-${route.name}`} className="flex flex-col rounded-card border border-line bg-white p-5 shadow-card">
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-pill px-2.5 py-1 text-[11px] font-bold ${route.tone === 'good' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {route.tag}
                  </span>
                  <span className="text-[11px] font-semibold text-muted-soft">{route.country}</span>
                </div>
                <h3 className="mt-3 text-base font-extrabold text-navy">{route.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted">{route.body}</p>
                <p className="mt-3 text-xs font-semibold text-gold-deep">{route.who}</p>
                <Link href="/pathways" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-info hover:text-navy">
                  Compare in Pathways <ArrowRight size={12} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-card border border-dashed border-line-strong bg-white p-8 text-sm text-muted shadow-card">
            Alternative-route research for this region is being verified. <Link href="/pathways" className="font-bold text-info hover:text-navy">Explore all routes in Pathways</Link>.
          </div>
        )}
      </section>

      <section className="grid gap-6 pb-10 lg:grid-cols-2">
        <article className="rounded-card border border-line bg-white p-6 shadow-card">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold-deep"><FlaskConical size={13} aria-hidden="true" /> {KOLMARI_LEXICON.pathways}</p>
          <h2 className="mt-1 text-2xl font-bold text-navy">{matches ? 'Residency options matched to you' : 'Research residency options'}</h2>
          <p className="mt-3 text-muted">Review visa, residency, work, retirement, and study Pathways based on your Profile.</p>
          <Link href={matches ? '/pathways' : '/profile-wizard'} className="mt-5 inline-flex rounded-field bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-deep">{matches ? 'View My Pathways' : 'Build My Kolmari Plan'}</Link>
        </article>

        <article className="rounded-card border border-line bg-white p-6 shadow-card">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-deep">{KOLMARI_LEXICON.greenbookInsights}</p>
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
            <p className="text-xs font-bold uppercase tracking-widest text-gold">Your {KOLMARI_LEXICON.plan}</p>
            <h2 className="mt-1 text-3xl font-bold">Save, compare, and build your relocation plan.</h2>
          </div>
          <Link href="/my-plan" className="gold-button mt-5 sm:mt-0">Enter Flutter Mode <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  )
}
