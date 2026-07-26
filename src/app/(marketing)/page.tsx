import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  MapPinned,
  MessageCircleMore,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { MarketingMobileNav } from '@/components/nexit/marketing-mobile-nav'
import { Wordmark } from '@/components/nexit/wordmark'
import { QuestionsSection } from '@/components/nexit/questions-section'

const nexitSteps = [
  {
    image: '/images/journey-globe-pins.png',
    title: 'Choose a Nextination',
    copy: 'Compare Nextinations, Pathways, and monthly costs side by side.',
  },
  {
    image: '/images/passport-visa-documents.png',
    title: 'Review your Pathways',
    copy: 'Answer focused questions and get a practical starting shortlist.',
  },
  {
    image: '/images/luggage-tropical-coast.png',
    title: 'Build your Nexit Plan',
    copy: 'Track documents, budget, and the tasks that turn a plan into a departure.',
  },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-canvas">
      <div className="mx-auto max-w-[1236px] px-4 pt-4 sm:px-6 sm:pt-6 lg:px-7">
        <section className="hero-grid relative min-h-[660px] overflow-hidden rounded-[26px] bg-navy-deep text-white shadow-[0_28px_70px_-42px_rgba(13,27,57,.85)]">
          <Image
            src="/images/hero-airplane-window.png"
            alt="Golden-hour coastline seen through an airplane window"
            fill
            priority
            sizes="(min-width: 1280px) 1180px, 100vw"
            className="object-cover object-[68%_center] sm:object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0d1b39_0%,#0d1b39_35%,rgba(13,27,57,.82)_49%,rgba(13,27,57,.12)_76%)]" />

          <header className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-11">
            <Wordmark dark />
            <nav className="hidden items-center gap-7 text-sm font-semibold text-white/75 md:flex" aria-label="Landing navigation">
              <a href="#how-it-works" className="transition hover:text-white">How it works</a>
              <a href="#features" className="transition hover:text-white">Features</a>
              <a href="#nextinations" className="transition hover:text-white">Nextinations</a>
              <a href="#community" className="transition hover:text-white">Community</a>
              <Link href="/login" className="transition hover:text-white">Sign in</Link>
              <Link href="/signup?next=%2Fnexitnation" className="gold-button !min-h-10 !px-4">Start Your Nexit</Link>
            </nav>
            <MarketingMobileNav />
          </header>

          <div className="relative z-10 flex min-h-[550px] items-center px-6 pb-16 pt-8 sm:px-10 lg:px-12">
            <div className="max-w-[530px]">
              <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.24em] text-gold sm:text-sm">Your move, made clearer</p>
              <h1 className="font-display text-[2.85rem] font-extrabold leading-[1.04] sm:text-6xl lg:text-[4.25rem]">
                Plan your exit.<br />
                <span className="italic text-gold">Build your next<br className="hidden sm:block" /> life abroad.</span>
              </h1>
              <p className="mt-6 max-w-[430px] text-base leading-7 text-[#c3d0e6]">
                Compare Nextinations, review Pathways, and build a realistic Nexit Plan without piecing it together across a dozen tabs.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup?next=%2Fnexitnation" className="gold-button">Start Your Nexit <ArrowRight size={17} /></Link>
                <Link href="#how-it-works" className="inline-flex min-h-12 items-center rounded-xl border border-white/25 px-5 font-bold text-white transition hover:bg-white/8">
                  See how it works
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="relative z-20 mx-3 -mt-9 grid overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_20px_50px_-30px_rgba(16,34,68,.4)] sm:mx-8 sm:grid-cols-3">
          {[
            [Sparkles, 'Find your strongest Pathway', 'Match Scores based on your Nexit Profile'],
            [Calculator, 'Plan your budget', 'Understand realistic costs before you move'],
            [CheckCircle2, 'Move with confidence', 'A step-by-step checklist that stays on track'],
          ].map(([Icon, title, copy], index) => (
            <div key={String(title)} className={`flex items-center gap-4 px-5 py-5 sm:px-7 sm:py-6 ${index ? 'border-t border-line sm:border-l sm:border-t-0' : ''}`}>
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold-soft text-gold-deep"><Icon size={20} /></span>
              <div><p className="text-sm font-extrabold text-navy">{String(title)}</p><p className="mt-1 text-xs leading-5 text-muted">{String(copy)}</p></div>
            </div>
          ))}
        </section>

        <section id="how-it-works" className="pb-20 pt-24 sm:pt-28">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-gold-deep">A practical path forward</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold text-navy sm:text-5xl">Your Nexit starts here</h2>
            <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gold" />
          </div>

          <div id="nextinations" className="mt-11 grid gap-5 md:grid-cols-3">
            {nexitSteps.map((item) => (
              <article key={item.title} className="group overflow-hidden rounded-[20px] border border-line bg-white shadow-card">
                <div className="relative aspect-[4/3] overflow-hidden bg-canvas">
                  <Image src={item.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.025]" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-navy">{item.title}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-muted">{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <QuestionsSection />

      <section id="community" className="mx-auto max-w-[1236px] px-4 py-20 sm:px-6 lg:px-7">
        <div className="mb-9 max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-teal-deep">Community insight, built in</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold text-navy sm:text-5xl">Join our community of Nexiters</h2>
          <p className="mt-4 text-base leading-7 text-muted">Connect with people planning real international moves, compare practical notes, and make decisions with better context.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <article className="relative min-h-80 overflow-hidden rounded-[24px] bg-teal-deep p-7 text-white lg:col-span-7 sm:p-10">
            <div className="absolute -right-16 -top-20 size-72 rounded-full border-[48px] border-white/8" />
            <UsersRound size={34} className="text-teal-soft" />
            <h3 className="mt-10 max-w-lg font-display text-3xl font-extrabold sm:text-4xl">A place for the questions that don’t fit on an application form.</h3>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/75">Learn from people researching neighborhoods, paperwork, budgets, healthcare, and the everyday reality of starting again somewhere new.</p>
            <Link href="/signup?next=%2Fnexitnation" className="gold-button mt-7">Join the Nexiters <ArrowRight size={17} /></Link>
          </article>

          <div className="grid gap-5 lg:col-span-5">
            <article className="rounded-[24px] border border-line bg-white p-7 shadow-card">
              <span className="grid size-12 place-items-center rounded-xl bg-teal-soft text-teal-deep"><MessageCircleMore size={22} /></span>
              <h3 className="mt-6 text-xl font-extrabold text-navy">Country conversations</h3>
              <p className="mt-2 text-sm leading-6 text-muted">Trade grounded, location-specific insight with people considering the same move.</p>
            </article>
            <article className="rounded-[24px] border border-line bg-white p-7 shadow-card">
              <span className="grid size-12 place-items-center rounded-xl bg-teal-soft text-teal-deep"><MapPinned size={22} /></span>
              <h3 className="mt-6 text-xl font-extrabold text-navy">Real relocation notes</h3>
              <p className="mt-2 text-sm leading-6 text-muted">See what planners are learning about documents, costs, housing, and arrival logistics.</p>
            </article>
          </div>
        </div>
      </section>

      <footer className="relative w-full overflow-hidden bg-navy-deep text-white">
        <Image src="/images/footer-beach-ocean.png" alt="Golden beach and ocean at sunset" width={2172} height={724} className="h-72 w-full object-cover opacity-65" />
        <div className="absolute inset-0 flex items-center bg-gradient-to-r from-navy-deep via-navy-deep/78 to-navy-deep/20">
          <div className="mx-auto w-full max-w-[1180px] px-5">
            <h2 className="max-w-xl font-display text-4xl font-extrabold">Your next chapter deserves a real plan.</h2>
            <p className="mt-3 text-white/75">Compare clearly. Prepare practically. Move with confidence.</p>
            <Link href="/signup?next=%2Fnexitnation" className="gold-button mt-6">Start Your Nexit <ArrowRight size={17} /></Link>
          </div>
        </div>
        <div className="border-t border-white/10 px-5 py-5">
          <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-4 text-center text-xs text-white/55 sm:flex-row sm:text-left">
            <Wordmark dark compact />
            <p>© 2026 Nexit. Visa recommendations are planning guidance, not legal advice.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
