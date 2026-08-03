import { flagSrc } from '@/lib/flags'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen, Building2, FileSearch, MapPinned } from 'lucide-react'
import type { DiscoverableCountry } from '@/lib/countries'

export function CountryResearchPage({ country }: { country: DiscoverableCountry }) {
  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/destinations" className="hover:text-navy">Destinations</Link>
        <span className="px-2">/</span>
        <span className="font-semibold text-navy">{country.name}</span>
      </nav>

      <section className="hero-grid overflow-hidden rounded-card bg-navy-deep p-7 text-white sm:p-10">
        <div className="max-w-2xl">
          <Image src={flagSrc(country.code)} alt={`${country.name} flag`} width={80} height={48} className="h-12 w-20 rounded-sm object-cover shadow-card" />
          <p className="mt-6 text-xs font-bold uppercase tracking-widest text-gold">Explore this Destination</p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{country.name}</h1>
          <p className="mt-4 max-w-xl leading-7 text-white/75">
            Begin your relocation research with official sources, city-level comparisons, and Pathway questions tailored to your circumstances.
          </p>
        </div>
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Country research workspace</p>
        <h2 className="mt-1 text-3xl font-bold text-navy">Start with {country.city}</h2>
        <p className="mt-2 max-w-3xl text-muted">
          This page is available from Destinations, but it is not automatically added to your Destinations. Save it only when you want to compare or plan around it.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            [MapPinned, 'Places to compare', `Research ${country.city} and other cities before choosing a neighborhood.`],
            [FileSearch, 'Residency Pathways', 'Confirm current eligibility and document requirements with official authorities.'],
            [Building2, 'Cost and housing', 'Enter your own verified rent and monthly expense research in the Cost Calculator.'],
            [BookOpen, 'Community context', 'Use Greenbook prompts to investigate daily life and belonging at city level.'],
          ].map(([Icon, title, copy]) => {
            const CardIcon = Icon as typeof MapPinned
            return (
              <article key={title as string} className="card-surface p-5">
                <CardIcon size={20} className="text-gold-deep" aria-hidden="true" />
                <h3 className="mt-4 font-bold text-navy">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{copy as string}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="rounded-card border border-line bg-white p-6 shadow-card">
        <h2 className="text-xl font-bold text-navy">Research status</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Detailed country facts, costs, and visa guidance are being verified. Kolmari does not preload unverified figures or present editorial popularity as personal eligibility.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/pathways" className="gold-button">Review Pathways <ArrowRight size={15} /></Link>
          <Link href="/cost-calculator" className="inline-flex min-h-11 items-center rounded-[var(--radius-btn)] border border-line px-5 text-sm font-bold text-navy">Open Cost Calculator</Link>
        </div>
      </section>
    </div>
  )
}
