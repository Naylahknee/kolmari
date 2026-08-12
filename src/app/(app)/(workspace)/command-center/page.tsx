import type { Metadata } from 'next'
import Link from 'next/link'
import { requireCurrentUser } from '@/lib/auth'
import { COUNTRIES } from '@/lib/countries'
import { getBoard } from '@/lib/command-center'
import { emptyKolmariPlan, getKolmariPlan } from '@/lib/kolmari-plan'
import { PATHWAYS } from '@/lib/pathways'
import { getProfile, hasCompletedProfile } from '@/lib/profile'
import { rankNextinations } from '@/lib/userProfile'
import { DocumentsManager } from '@/components/kolmari/documents-manager'
import { PlanWorkspace } from '@/components/kolmari/plan/PlanWorkspace'
import { CommandCenterBoard } from '@/components/kolmari/command-center/board'
import { TopCountriesGrid } from '@/components/kolmari/command-center/top-countries'

export const metadata: Metadata = { title: 'Command Center | Kolmari' }

type CommandTab = 'my-plan' | 'quiz-results' | 'documents'

const TABS: Array<{ id: CommandTab; label: string }> = [
  { id: 'my-plan', label: 'My Plan' },
  { id: 'quiz-results', label: 'Quiz Results' },
  { id: 'documents', label: 'Documents' },
]

export default async function CommandCenterPage({ searchParams }: { searchParams: Promise<{ tab?: string; planTab?: string }> }) {
  const user = await requireCurrentUser()
  const params = await searchParams
  const active: CommandTab = TABS.some((tab) => tab.id === params.tab) ? params.tab as CommandTab : 'my-plan'
  const [board, profile, existingPlan] = await Promise.all([
    getBoard(user.id),
    getProfile(user.id),
    getKolmariPlan(user.id),
  ])
  const plan = existingPlan ?? emptyKolmariPlan(user.id)
  const profileComplete = hasCompletedProfile(profile)
  const ranked = profileComplete ? rankNextinations(profile) : []
  const planTab = ['overview', 'checklist', 'documents', 'budget', 'notes'].includes(params.planTab ?? '')
    ? params.planTab as 'overview' | 'checklist' | 'documents' | 'budget' | 'notes'
    : 'overview'

  return (
    <main className="mx-auto w-full" style={{ maxWidth: 1180, padding: '26px 30px 70px' }}>
      <div className="mb-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-gold-deep">Planning workspace</p>
        <h1 className="mt-1 font-display text-[27px] font-bold text-navy">Command Center</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">Keep your plan, assessment results, destination research, and relocation documents together in one workspace.</p>
      </div>

      <nav className="mb-6 flex flex-wrap gap-2 border-b border-line pb-3" aria-label="Command Center sections">
        {TABS.map((tab) => (
          <Link key={tab.id} href={`/command-center?tab=${tab.id}`} aria-current={active === tab.id ? 'page' : undefined} className={`rounded-full px-4 py-2 text-sm font-bold transition ${active === tab.id ? 'bg-navy text-white' : 'border border-line bg-white text-navy hover:border-gold/50'}`}>
            {tab.label}
          </Link>
        ))}
      </nav>

      {active === 'my-plan' ? (
        <>
          <TopCountriesGrid initial={board} suggested={ranked.slice(0, 3).map(({ country }) => country.name)} />
          <PlanWorkspace
            initial={plan}
            nextinations={COUNTRIES.map((country) => country.name)}
            pathways={PATHWAYS.map((pathway) => `${pathway.country} — ${pathway.name}`)}
            profileHousehold={profile.wizard_status === 'completed' ? profile.family_size : null}
            profileMonthlyIncome={profile.wizard_status === 'completed' ? profile.monthly_income : null}
            profileComplete={profileComplete}
            dependents={profile.dependents}
            initialTab={planTab}
          />
          <div className="mt-8 border-t border-line pt-8">
            <CommandCenterBoard initial={board} />
          </div>
        </>
      ) : null}

      {active === 'quiz-results' ? (
        <section aria-labelledby="quiz-results-heading">
          <div className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-tile">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-gold-deep">Assessment</p>
            <h2 id="quiz-results-heading" className="mt-1 font-display text-xl font-bold text-navy">Your Quiz Results</h2>
            {!profileComplete ? (
              <div className="mt-4 rounded-xl border border-dashed border-line-strong bg-canvas p-5">
                <p className="text-sm font-semibold text-navy">You have not completed your Kolmari Profile yet.</p>
                <Link href="/profile-wizard" className="gold-button mt-3 inline-flex">Complete quiz</Link>
              </div>
            ) : (
              <>
                <p className="mt-1 text-sm text-muted">These are your current top matches based on your saved profile answers. Editing your profile can change the ranking.</p>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {ranked.slice(0, 3).map(({ country, match }, index) => (
                    <Link key={country.slug} href={`/nextinations/${country.slug}/v2/overview`} className="rounded-xl border border-line bg-canvas p-4 transition hover:border-gold/50">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">#{index + 1} match</p>
                          <h3 className="mt-1 text-lg font-bold text-navy">{country.name}</h3>
                          <p className="text-xs text-muted">{country.city} · {country.region}</p>
                        </div>
                        <span className="text-lg font-extrabold text-gold-deep">{match.score}%</span>
                      </div>
                      {match.reasons[0] ? <p className="mt-3 text-xs leading-5 text-muted">{match.reasons[0]}</p> : null}
                    </Link>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href="/profile-wizard" className="rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-navy hover:border-gold/50">Edit quiz answers</Link>
                  <Link href="/your-world" className="rounded-full bg-gold px-4 py-2 text-xs font-bold text-navy">Explore all countries</Link>
                </div>
              </>
            )}
          </div>
        </section>
      ) : null}

      {active === 'documents' ? <DocumentsManager /> : null}
    </main>
  )
}
