import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  BadgeDollarSign,
  BookOpenText,
  CheckCircle2,
  ExternalLink,
  MapPinned,
  Route,
  ShieldCheck,
} from 'lucide-react'
import { Wordmark } from '@/components/kolmari/wordmark'
import { countryFlag } from '@/lib/countries'
import { NEXIT_LEXICON } from '@/lib/lexicon'
import { authHref } from '@/lib/navigation'
import { getSeoPage, SEO_PAGES } from '@/lib/seoContent'
import { absoluteUrl } from '@/lib/site'

type Props = { params: Promise<{ seoSlug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return SEO_PAGES.map((page) => ({ seoSlug: page.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seoSlug } = await params
  const page = getSeoPage(seoSlug)
  if (!page) return {}
  const canonical = absoluteUrl(`/${page.slug}`)

  return {
    title: `${page.title} | Kolmari`,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical },
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'article',
      url: canonical,
      publishedTime: page.lastReviewed,
      modifiedTime: page.lastReviewed,
      images: [{ url: absoluteUrl('/og.png'), width: 1536, height: 1024, alt: 'Kolmari — Build a life without borders' }],
    },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description, images: [absoluteUrl('/og.png')] },
  }
}

function JsonLd({ data }: { data: object }) {
  const value = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: value }} />
}

export default async function SeoPageRoute({ params }: Props) {
  const { seoSlug } = await params
  const page = getSeoPage(seoSlug)
  if (!page) notFound()

  const canonical = absoluteUrl(`/${page.slug}`)
  const signupHref = authHref('signup', page.mapHref)
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.h1,
    description: page.description,
    datePublished: page.lastReviewed,
    dateModified: page.lastReviewed,
    mainEntityOfPage: canonical,
    author: { '@type': 'Organization', name: 'Kolmari' },
    publisher: { '@type': 'Organization', name: 'Kolmari', url: absoluteUrl('/') },
  }
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Kolmari', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: page.h1, item: canonical },
    ],
  }
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
  const howTo = page.steps ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `${page.h1}: build your Move Plan`,
    description: `A practical planning sequence for ${page.h1.toLowerCase()}.`,
    step: page.steps.map((step, index) => ({ '@type': 'HowToStep', position: index + 1, name: step.name, text: step.text })),
  } : null

  return (
    <main className="min-h-screen bg-canvas text-navy">
      <JsonLd data={article} />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={faq} />
      {howTo ? <JsonLd data={howTo} /> : null}

      <header className="border-b border-white/10 bg-navy-deep text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-7">
          <Wordmark dark />
          <nav className="flex items-center gap-4 text-sm font-bold" aria-label="SEO page navigation">
            <Link href="/login" className="hidden text-white/72 transition hover:text-white sm:inline">Sign in</Link>
            <Link href={signupHref} className="gold-button !min-h-10 !px-4">Build Your Kolmari Plan</Link>
          </nav>
        </div>
      </header>

      <section className="hero-grid bg-navy-deep px-5 pb-20 pt-14 text-white sm:px-7 sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="text-xs font-bold text-white/55">
            <Link href="/" className="hover:text-white">Kolmari</Link><span className="mx-2">/</span><span>{page.eyebrow}</span>
          </nav>
          <p className="mt-8 text-xs font-extrabold uppercase tracking-[.22em] text-gold">{page.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-tight sm:text-6xl">{page.h1}</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[#c3d0e6] sm:text-lg">{page.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={signupHref} className="gold-button">Build Your Kolmari Plan<ArrowRight size={17} /></Link>
            <Link href={page.mapHref} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/20 px-5 font-bold text-white transition hover:bg-white/8">
              Kolmarination<MapPinned size={17} />
            </Link>
          </div>
          <p className="mt-6 text-xs text-white/50">Last reviewed {page.lastReviewed}. Planning guidance, not legal, tax, or safety advice.</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-5 py-16 sm:px-7 sm:py-20">
        <section aria-labelledby="match-heading">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-gold-deep">Decision engine</p>
            <h2 id="match-heading" className="mt-2 font-display text-3xl font-bold sm:text-4xl">Compare your strongest signals</h2>
            <p className="mt-3 leading-7 text-muted">Scores are planning signals, not guarantees. Your Kolmari Profile produces the personalized decision.</p>
          </div>
          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {page.countryCards.map((item) => (
              <article key={item.country} className="card-surface overflow-hidden">
                <div className="bg-navy px-6 py-5 text-white">
                  <div className="flex items-center justify-between gap-4"><span className="text-4xl" aria-hidden>{countryFlag(item.code)}</span><strong className="text-2xl text-gold">{item.matchScore}%</strong></div>
                  <h3 className="mt-4 text-2xl font-extrabold">{item.country}</h3>
                </div>
                <dl className="space-y-4 p-6 text-sm">
                  <div><dt className="font-bold text-muted">{NEXIT_LEXICON.matchScore}</dt><dd className="mt-1 font-extrabold">{item.matchScore}% planning signal</dd></div>
                  <div><dt className="font-bold text-muted">{NEXIT_LEXICON.pathways}</dt><dd className="mt-1 font-extrabold">{item.pathways}</dd></div>
                  <div><dt className="font-bold text-muted">{NEXIT_LEXICON.communityFit}</dt><dd className="mt-1 font-extrabold">{item.communityFit}</dd></div>
                </dl>
                <Link href={item.href} className="mx-6 mb-6 inline-flex items-center gap-2 text-sm font-extrabold text-gold-deep">Explore This Destination<ArrowRight size={15} /></Link>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="cost-heading" className="rounded-[24px] bg-white p-6 shadow-card sm:p-9">
          <div className="max-w-3xl"><p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em] text-gold-deep"><BadgeDollarSign size={17} />Cost of living</p><h2 id="cost-heading" className="mt-3 font-display text-3xl font-bold sm:text-4xl">{page.costHeading}</h2><p className="mt-4 leading-7 text-muted">{page.costIntro}</p></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {page.costItems.map((item) => <article key={item.label} className="rounded-[16px] border border-line bg-canvas p-5"><p className="text-xs font-bold text-muted">{item.label}</p><p className="mt-2 text-2xl font-extrabold">{item.value}</p><p className="mt-3 text-sm leading-6 text-muted">{item.detail}</p></article>)}
          </div>
        </section>

        <section aria-labelledby="pathways-heading">
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em] text-gold-deep"><Route size={17} />{NEXIT_LEXICON.pathways}</p>
          <h2 id="pathways-heading" className="mt-3 font-display text-3xl font-bold sm:text-4xl">Review your Pathways</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {page.pathways.map((item) => (
              <article key={item.name} className="card-surface p-6">
                <CheckCircle2 className="text-ok" size={22} /><h3 className="mt-4 text-xl font-extrabold">{item.name}</h3><p className="mt-3 text-sm leading-6 text-muted">{item.detail}</p>
                {item.sourceUrl ? <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-gold-deep">Check the official source<ExternalLink size={13} /></a> : null}
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="greenbook-heading" className="overflow-hidden rounded-[24px] bg-teal-deep p-6 text-white sm:p-9">
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em] text-teal-soft"><BookOpenText size={17} />{NEXIT_LEXICON.greenbookInsights}</p>
          <h2 id="greenbook-heading" className="mt-3 font-display text-3xl font-bold sm:text-4xl">Community context before commitment</h2>
          <div className="mt-7 grid gap-5 lg:grid-cols-[.7fr_1.3fr]">
            <dl className="rounded-[18px] bg-white p-6 text-navy">
              <div><dt className="text-xs font-bold text-muted">{NEXIT_LEXICON.communityFit}</dt><dd className="mt-1 text-xl font-extrabold">{page.greenbook.communityFit}</dd></div>
              <div className="mt-5"><dt className="text-xs font-bold text-muted">Best areas to research</dt><dd className="mt-1 font-bold">{page.greenbook.bestAreas.join(', ')}</dd></div>
              <div className="mt-5"><dt className="text-xs font-bold text-muted">Watch areas</dt><dd className="mt-1 font-bold">{page.greenbook.watchAreas.join(', ')}</dd></div>
            </dl>
            <div className="rounded-[18px] border border-white/12 bg-white/8 p-6"><p className="leading-7 text-white/82">{page.greenbook.summary}</p><a href={page.greenbook.sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-gold">Source: {page.greenbook.sourceTitle}<ExternalLink size={13} /></a><p className="mt-3 text-xs text-white/55">Editorial synthesis; not a member rating or personal safety guarantee.</p></div>
          </div>
        </section>

        {page.steps ? (
          <section aria-labelledby="steps-heading">
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-gold-deep">Move action layer</p>
            <h2 id="steps-heading" className="mt-3 font-display text-3xl font-bold sm:text-4xl">Build your Move Plan</h2>
            <ol className="mt-7 grid gap-4 md:grid-cols-2">
              {page.steps.map((step, index) => <li key={step.name} className="card-surface flex gap-4 p-6"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold font-extrabold">{index + 1}</span><div><h3 className="font-extrabold">{step.name}</h3><p className="mt-2 text-sm leading-6 text-muted">{step.text}</p></div></li>)}
            </ol>
          </section>
        ) : null}

        <section aria-labelledby="faq-heading">
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em] text-gold-deep"><ShieldCheck size={17} />Clear answers</p>
          <h2 id="faq-heading" className="mt-3 font-display text-3xl font-bold sm:text-4xl">Questions to answer before you decide</h2>
          <div className="mt-7 space-y-4">{page.faqs.map((item) => <article key={item.question} className="card-surface p-6 sm:p-7"><h3 className="text-lg font-extrabold">{item.question}</h3><p className="mt-3 leading-7 text-muted">{item.answer}</p></article>)}</div>
        </section>

        <section aria-labelledby="sources-heading" className="border-t border-line pt-10">
          <h2 id="sources-heading" className="text-lg font-extrabold">Official and editorial sources</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">{page.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="font-bold text-navy underline decoration-gold/70 underline-offset-4">{source.title}</a><span> — {source.publisher}; accessed {source.accessed}</span></li>)}</ul>
        </section>

        <section className="rounded-[24px] bg-navy-deep p-7 text-white sm:p-10">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-gold">From planning to doing</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold sm:text-4xl">Turn this research into your Move Plan.</h2>
          <p className="mt-4 max-w-2xl leading-7 text-white/70">Build your Kolmari Profile, compare personalized Match Scores, review Pathways, and enter Flutter Mode when you&apos;re ready to move.</p>
          <Link href={signupHref} className="gold-button mt-7">Build Your Kolmari Plan<ArrowRight size={17} /></Link>
        </section>
      </div>

      <footer className="bg-navy-deep px-5 py-8 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center text-xs text-white/55 sm:flex-row sm:text-left">
          <Wordmark dark compact />
          <p>© 2026 Kolmari. Planning guidance is not legal, tax, medical, or safety advice.</p>
        </div>
      </footer>
    </main>
  )
}
