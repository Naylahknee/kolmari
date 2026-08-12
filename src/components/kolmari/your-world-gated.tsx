import Link from 'next/link'
import { ArrowRight, Check, Lock } from 'lucide-react'
import { WorldMatchMap, type WorldPin } from './world-match-map'

// Countries surfaced from the user's quiz/profile ranking. Names are shown free;
// the Match Score behind them is a Pro feature, so only the top match links
// through to its (free) Overview and the rest show a locked-score chip.
export type QuizMatch = { slug: string; name: string; code: string; region: string }

const UPGRADE_HREF = '/coming-soon?feature=plus'

// What free browsing includes. Descriptive copy only — no per-user data.
const FREE_TILES: { title: string; body: string }[] = [
  { title: 'The interactive map', body: 'Open any region or matched Destination from the illustrated world.' },
  { title: 'Destination overviews', body: 'Read any country\u2019s overview for free. Filtering, scoring, and saving are Pro.' },
  { title: 'Region guides', body: 'What each region tends to be good and bad at.' },
  { title: 'Ways in, by country', body: 'The route families available, without the eligibility check.' },
]

// What the paid tier adds. Honest feature list, mirrors the pricing page.
const PRO_FEATURES: string[] = [
  'Match scores against your profile',
  'Budget, household, and healthcare filters',
  'Save to Destinations',
  'Recently viewed and saved research',
  'Side-by-side comparison',
]

export function YourWorldGated({ matches, pins }: { matches: QuizMatch[]; pins: WorldPin[] }) {
  return (
    <div>
      {/* Upgrade banner */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-gold/40 bg-gold-soft/40 px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-gold-deep">
            <Lock size={15} aria-hidden="true" />
          </span>
          <p className="text-sm text-navy">
            Upgrade to unlock your personalized relocation plan, pathway matching, and the full country research.
          </p>
        </div>
        <Link href={UPGRADE_HREF} className="gold-button min-h-9 px-4 text-sm">Upgrade Now</Link>
      </section>

      {/* Heading */}
      <div className="mt-6">
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Explore</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-navy sm:text-4xl">Your World</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Browse the world map and read any countrys overview for free. Filtering, scoring, and saving are Pro.
        </p>
      </div>

      <div className="mt-5">
        <WorldMatchMap pins={pins} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,1fr)]">
        {/* Left column */}
        <div className="space-y-5">
          {/* Free to browse */}
          <section className="card-surface p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-navy">Free to browse</h2>
                <p className="mt-1 text-sm text-muted">Every countrys Overview tab is open. Portugal is fully researched; the others are in progress.</p>
              </div>
              <span className="shrink-0 rounded-pill bg-ok-soft px-2.5 py-1 text-[11px] font-bold text-ok">Included free</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {FREE_TILES.map((tile) => (
                <div key={tile.title} className="rounded-tile border border-line bg-canvas/60 p-3.5">
                  <p className="text-sm font-bold text-navy">{tile.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{tile.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Quiz results */}
          <section className="card-surface p-5 sm:p-6">
            <h2 className="text-lg font-bold text-navy">Your quiz results</h2>
            <p className="mt-1 text-sm text-muted">Matched from what you told us. Country names are free; the scoring behind them is not.</p>

            {matches.length > 0 ? (
              <ul className="mt-4 divide-y divide-line">
                {matches.map((c, i) => (
                  <li key={c.slug} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-tile bg-navy text-[11px] font-bold text-gold">{c.code}</span>
                      <div>
                        <p className="text-sm font-bold text-navy">{c.name}</p>
                        <p className="text-xs text-muted">{c.region}</p>
                      </div>
                    </div>
                    {i === 0 ? (
                      <Link href={`/nextinations/${c.slug}/v2/overview`} className="inline-flex items-center gap-1 text-xs font-bold text-gold-deep hover:underline">
                        View overview <ArrowRight size={13} aria-hidden="true" />
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
                        <Lock size={13} aria-hidden="true" /> Locked
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-tile border border-gold/25 bg-gold-soft/30 p-4">
                <p className="text-sm text-navy">Take the quiz to see the countries matched to your profile.</p>
                <Link href="/quiz" className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-btn)] border border-line bg-white px-3.5 text-xs font-bold text-navy hover:bg-canvas">
                  Take the quiz <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* Right column — Pro upsell */}
        <aside>
          <section className="rounded-card bg-gradient-to-b from-navy to-navy-deep p-5 text-white sm:p-6">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gold">
              <Lock size={13} aria-hidden="true" /> Kolmari Pro
            </p>
            <h2 className="mt-2 text-xl font-bold">Matching and shortlisting</h2>
            <p className="mt-1 text-sm text-white/70">Turning eight countries into a ranked shortlist for your household.</p>

            <ul className="mt-4 space-y-2">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 rounded-tile bg-white/5 px-3.5 py-2.5 text-sm font-semibold">
                  <Check size={15} className="shrink-0 text-gold" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>

            <Link href={UPGRADE_HREF} className="gold-button mt-5 w-full">Upgrade Now</Link>
            <p className="mt-2 text-center text-xs text-white/60">Cancel anytime</p>
          </section>
        </aside>
      </div>
    </div>
  )
}
