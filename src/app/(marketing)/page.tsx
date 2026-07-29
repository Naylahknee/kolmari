import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Gauge,
  Globe2,
  MapPinned,
  MessageCircleMore,
  NotebookTabs,
  Route,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { MarketingMobileNav } from '@/components/kolmari/marketing-mobile-nav'
import { MarketingLogo } from '@/components/kolmari/marketing-logo'
import { QuestionsSection } from '@/components/kolmari/questions-section'

// The product journey — the trust layer is honest process transparency, not
// fabricated stats or testimonials. Each step mirrors a real product feature.
const journey = [
  { icon: ClipboardList, label: 'Quiz', copy: 'Answer a few focused questions about your situation.' },
  { icon: Globe2, label: 'Destination Match', copy: 'See destinations that fit your Profile, with a Match Score.' },
  { icon: Route, label: 'Visa Pathway', copy: 'Review the visa pathways you may qualify for.' },
  { icon: NotebookTabs, label: 'Move Plan', copy: 'Build a practical plan: documents, budget, and tasks.' },
  { icon: Gauge, label: 'Readiness Tracker', copy: "Track your progress until you're move-ready." },
]

const benefits = [
  [Sparkles, 'Find your strongest pathway', 'Match Scores based on your Profile — not guesswork.'],
  [Calculator, 'Plan a realistic budget', 'Understand true monthly costs before you commit.'],
  [CheckCircle2, 'Move with confidence', 'A step-by-step plan that stays on track to departure.'],
] as const

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-canvas">
      {/* ── Sticky header (persistent CTA) ──────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1236px] items-center justify-between px-4 py-3 sm:px-6 lg:px-7">
          <MarketingLogo />
          <nav className="hidden items-center gap-7 text-sm font-semibold text-navy/75 md:flex" aria-label="Landing navigation">
            <a href="#how-it-works" className="transition hover:text-navy">How it works</a>
            <a href="#community" className="transition hover:text-navy">Community</a>
            <Link href="/login" className="transition hover:text-navy">Sign in</Link>
            <Link href="/quiz" className="gold-button !min-h-10 !px-4">Build My Move Plan</Link>
          </nav>
          <MarketingMobileNav />
        </div>
      </header>

      <div className="mx-auto max-w-[1236px] px-4 pt-4 sm:px-6 sm:pt-6 lg:px-7">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="hero-grid relative min-h-[620px] overflow-hidden rounded-[26px] bg-navy-deep text-white shadow-[0_28px_70px_-42px_rgba(13,27,57,.85)]">
          <Image
            src="/images/hero-airplane-window.png"
            alt="Golden-hour coastline seen through an airplane window"
            fill
            priority
            sizes="(min-width: 1280px) 1180px, 100vw"
            className="object-cover object-[68%_center] sm:object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0d1b39_0%,#0d1b39_35%,rgba(13,27,57,.82)_49%,rgba(13,27,57,.12)_76%)]" />

          <div className="relative z-10 flex min-h-[620px] items-center px-6 py-16 sm:px-10 lg:px-12">
            <div className="max-w-[540px]">
              <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.24em] text-gold sm:text-sm">Your move, made clearer</p>
              <h1 className="font-display text-[2.85rem] font-extrabold leading-[1.04] sm:text-6xl lg:text-[4.25rem]">
                Build a life<br />
                <span className="italic text-gold">without borders.</span>
              </h1>
              <p className="mt-6 max-w-[440px] text-base leading-7 text-[#c3d0e6]">
                Compare destinations, review visa pathways, and build a realistic move plan — without piecing it together across a dozen tabs.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/quiz" className="gold-button">Build My Move Plan <ArrowRight size={17} /></Link>
                <Link href="#how-it-works" className="inline-flex min-h-12 items-center rounded-xl border border-white/25 px-5 font-bold text-white transition hover:bg-white/10">
                  See how it works
                </Link>
              </div>
              <p className="mt-5 text-sm font-medium text-white/70">
                Free to start · No credit card · About 3 minutes
              </p>
            </div>
          </div>
        </section>

        {/* ── Benefits strip (overlaps hero) ────────────────────────────── */}
        <section id="features" className="relative z-20 mx-3 -mt-9 grid overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_20px_50px_-30px_rgba(16,34,68,.4)] sm:mx-8 sm:grid-cols-3">
          {benefits.map(([Icon, title, copy], index) => (
            <div key={title} className={`flex items-center gap-4 px-5 py-5 sm:px-7 sm:py-6 ${index ? 'border-t border-line sm:border-l sm:border-t-0' : ''}`}>
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold-soft text-gold-deep"><Icon size={20} /></span>
              <div>
                <p className="text-sm font-extrabold text-navy">{title}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{copy}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── The journey (how Kolmari works) ───────────────────────────── */}
        <section id="how-it-works" className="pb-20 pt-24 sm:pt-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-gold-deep">How Kolmari works</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold text-navy sm:text-5xl">From first question to move-ready</h2>
            <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gold" />
            <p className="mt-5 text-base leading-7 text-muted">
              One connected path — each step builds on the last, all in one place.
            </p>
          </div>

          <ol className="mt-12 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
            {journey.map((step, index) => (
              <Fragment key={step.label}>
                <li className="flex flex-1 flex-col rounded-[18px] border border-line bg-white p-6 text-center shadow-card">
                  <span className="mx-auto grid size-12 place-items-center rounded-xl bg-navy-deep text-gold">
                    <step.icon size={22} aria-hidden="true" />
                  </span>
                  <span className="mt-4 inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-deep">
                    Step {index + 1}
                  </span>
                  <h3 className="mt-1 text-lg font-extrabold text-navy">{step.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{step.copy}</p>
                </li>
                {index < journey.length - 1 && (
                  <span className="flex shrink-0 items-center justify-center text-gold" aria-hidden="true">
                    <ChevronDown size={22} className="lg:hidden" />
                    <ChevronRight size={22} className="hidden lg:block" />
                  </span>
                )}
              </Fragment>
            ))}
          </ol>

          <div className="mt-11 text-center">
            <Link href="/quiz" className="gold-button">Build My Move Plan <ArrowRight size={17} /></Link>
            <p className="mt-3 text-sm text-muted">About 3 minutes · No relocation knowledge required</p>
          </div>
        </section>
      </div>

      <QuestionsSection />

      {/* ── Community — secondary to the single /quiz goal ──────────────── */}
      <section id="community" className="mx-auto max-w-[1236px] px-4 py-20 sm:px-6 lg:px-7">
        <div className="mb-9 max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-gold-deep">Community built in</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold text-navy sm:text-5xl">Join Kolmari Klub</h2>
          <p className="mt-4 text-base leading-7 text-muted">Connect with people planning real international moves, compare practical notes, and make decisions with better context.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <article className="relative min-h-80 overflow-hidden rounded-[24px] bg-navy-deep p-7 text-white lg:col-span-7 sm:p-10">
            <div className="absolute -right-16 -top-20 size-72 rounded-full border-[48px] border-white/5" />
            <UsersRound size={34} className="text-gold" />
            <h3 className="mt-10 max-w-lg font-display text-3xl font-extrabold sm:text-4xl">A place for the questions that don&apos;t fit on an application form.</h3>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/75">Learn from people researching neighborhoods, paperwork, budgets, healthcare, and the everyday reality of starting again somewhere new.</p>
            <Link href="/signup?next=%2Fcommunity" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/30 px-5 font-bold text-white transition hover:border-gold hover:text-gold">
              Join Kolmari Klub <ArrowRight size={17} />
            </Link>
          </article>

          <div className="grid gap-5 lg:col-span-5">
            <article className="rounded-[24px] border border-line bg-white p-7 shadow-card">
              <span className="grid size-12 place-items-center rounded-xl bg-gold-soft text-gold-deep"><MessageCircleMore size={22} /></span>
              <h3 className="mt-6 text-xl font-extrabold text-navy">Destination conversations</h3>
              <p className="mt-2 text-sm leading-6 text-muted">Trade grounded, location-specific insight with people considering the same move.</p>
            </article>
            <article className="rounded-[24px] border border-line bg-white p-7 shadow-card">
              <span className="grid size-12 place-items-center rounded-xl bg-gold-soft text-gold-deep"><MapPinned size={22} /></span>
              <h3 className="mt-6 text-xl font-extrabold text-navy">Real relocation notes</h3>
              <p className="mt-2 text-sm leading-6 text-muted">See what planners are learning about documents, costs, housing, and arrival logistics.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Final CTA + footer ──────────────────────────────────────────── */}
      <footer className="relative w-full overflow-hidden bg-navy-deep text-white">
        <Image src="/images/footer-beach-ocean.png" alt="Golden beach and ocean at sunset" width={2172} height={724} className="h-72 w-full object-cover opacity-60" />
        <div className="absolute inset-0 flex items-center bg-gradient-to-r from-navy-deep via-navy-deep/80 to-navy-deep/20">
          <div className="mx-auto w-full max-w-[1180px] px-5">
            <h2 className="max-w-xl font-display text-4xl font-extrabold">Your next chapter deserves a real plan.</h2>
            <p className="mt-3 text-white/75">Compare clearly. Prepare practically. Move with confidence.</p>
            <Link href="/quiz" className="gold-button mt-6">Build My Move Plan <ArrowRight size={17} /></Link>
          </div>
        </div>
        <div className="border-t border-white/10 px-5 py-5">
          <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-4 text-center text-xs text-white/55 sm:flex-row sm:text-left">
            <MarketingLogo compact tone="light" />
            <p>© 2026 Kolmari. Visa recommendations are planning guidance, not legal advice.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
