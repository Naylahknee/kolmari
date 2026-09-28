'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { ArrowRight, Check, LoaderCircle } from 'lucide-react'
import type { PathwayGoal, RelocationProfile, WizardStatus } from '@/lib/profile'
import { activeAnswers, chooseAnswer, emptyOnboarding, isAnswered, LANE_IDS, LANE_LINKS, LANES, QUIZ_CARRYOVER_QUESTIONS, QUIZ_SITUATION_GOAL, QUIZ_WHO_HOUSEHOLD, quizLaneSuggestion, quizRegionDestinations, type LaneId, type OnboardingState, type Question } from '@/lib/onboarding'
const EnergyPortal = dynamic(() => import('@/components/kolmari/energy/energy-portal').then(module => module.EnergyPortal))
import styles from './profile-wizard.module.css'

const destinations = ['Portugal', 'Spain', 'Uruguay', 'Mexico', 'Costa Rica', 'Ghana', 'Malaysia', 'Albania']
const priorities: Record<LaneId, string> = { health: 'Healthcare & schools', community: 'Safety', energy: 'Quality of life', work: 'Career', family: 'Healthcare & schools', money: 'Affordability' }
const goals = ['Remote Work', 'Employment', 'Entrepreneurship', 'Passive Income / Retirement', 'Education', 'Family Reunification', 'Ancestry', 'Investment'] as const

/** Seed a fresh setup from the Match Quiz snapshot: preselect approach lanes from
 *  the priority answer and starter destinations from the region answer.
 *  Never overrides lanes or destinations the user already chose. */
function initialSetup(profile: RelocationProfile): OnboardingState {
  const existing = profile.onboarding ?? emptyOnboarding()
  const quiz = existing.quiz
  if (!quiz) return existing
  const lanes = existing.lanes.length ? existing.lanes : quizLaneSuggestion(quiz.answers.priority)
  const seeded = existing.destinations.length ? existing.destinations : quizRegionDestinations(quiz.answers.region)
  if (lanes === existing.lanes && seeded === existing.destinations) return existing
  return { ...existing, lanes, destinations: seeded }
}

/** Prefill unambiguous household fields from the quiz snapshot.
 *  Only fills fields the user has not set; never overwrites existing values. */
function initialProfile(profile: RelocationProfile): RelocationProfile {
  const quiz = profile.onboarding?.quiz
  if (!quiz) return profile
  const household = QUIZ_WHO_HOUSEHOLD[quiz.answers.who ?? '']
  const goal = QUIZ_SITUATION_GOAL[quiz.answers.situation ?? ''] as PathwayGoal | undefined
  if ((!household || profile.household_type) && (!goal || (profile.goals as string[]).includes(goal))) return profile
  const next = { ...profile }
  if (household && !next.household_type) next.household_type = household
  if (goal && !(next.goals as string[]).includes(goal)) next.goals = [...next.goals, goal]
  return next
}

export function ProfileWizard({ initial }: { initial: RelocationProfile }) {
  const router = useRouter()
  const [profile, setProfile] = useState(() => initialProfile(initial))
  const [setup, setSetup] = useState<OnboardingState>(() => initialSetup(initial))
  const [step, setStep] = useState(initial.onboarding?.step ?? 0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [missing, setMissing] = useState<string[]>([])
  const errorRef = useRef<HTMLParagraphElement>(null)
  const [destination, setDestination] = useState('')
  const busy = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const retake = initial.wizard_status === 'completed'
  const questions = setup.lanes.flatMap(lane => LANES[lane].qs.map(q => ({ ...q, lane })))
  const energyStep = setup.lanes.includes('energy') ? questions.length + 1 : -1
  const originStep = questions.length + 1 + (energyStep > 0 ? 1 : 0)
  const householdStep = originStep + 1
  const reviewStep = householdStep + 1
  const currentStep = Math.min(step, reviewStep)
  const question = currentStep > 0 && currentStep <= questions.length ? questions[currentStep - 1] : null
  const phase = currentStep === 0 ? 0 : currentStep < originStep ? 1 : currentStep < reviewStep ? 2 : 3
  const selectedLanes = setup.lanes.map(id => LANES[id].short).join(', ')
  const quiz = setup.quiz
  const quizSuggestedLanes = quiz ? quizLaneSuggestion(quiz.answers.priority) : []
  const showQuizLaneBanner = currentStep === 0 && quizSuggestedLanes.length > 0
    && quizSuggestedLanes.length === setup.lanes.length
    && quizSuggestedLanes.every(id => setup.lanes.includes(id))
  const seededDestinationsFromQuiz = Boolean(
    quiz && (initial.onboarding?.destinations?.length ?? 0) === 0
    && quizRegionDestinations(quiz.answers.region).length > 0
    && setup.destinations.length > 0,
  )

  function update<K extends keyof RelocationProfile>(key: K, value: RelocationProfile[K]) {
    setProfile(previous => ({ ...previous, [key]: value }))
    setMissing(previous => previous.filter(k => k !== key))
    setError('')
  }
  function navigate(next: number) {
    setStep(next)
    window.scrollTo({ top: 0, behavior: 'instant' })
    requestAnimationFrame(() => heading.current?.focus())
  }
  function toggleLane(lane: LaneId) {
    setSetup(previous => ({ ...previous, lanes: previous.lanes.includes(lane) ? previous.lanes.filter(id => id !== lane) : previous.lanes.length < 3 ? [...previous.lanes, lane] : previous.lanes }))
    setMissing(previous => previous.filter(k => k !== 'lanes'))
    setError('')
  }
  function answer(q: Question, option: string) {
    setSetup(previous => ({ ...previous, answers: { ...previous.answers, [q.id]: chooseAnswer(q, previous.answers[q.id], option) } }))
    setMissing(previous => previous.filter(k => k !== 'question'))
    setError('')
  }
  /** What is still needed before this step can continue, as field keys and
   *  human-readable labels. Shown when the user hits Continue with gaps, so a
   *  blocked Continue is never silent. */
  function missingForStep(): { keys: string[]; labels: string[] } {
    if (currentStep === 0)
      return setup.lanes.length ? { keys: [], labels: [] } : { keys: ['lanes'], labels: ['Choose at least one approach'] }
    if (question)
      return isAnswered(setup.answers[question.id]) ? { keys: [], labels: [] } : { keys: ['question'], labels: ['Choose an answer'] }
    if (currentStep === originStep) {
      const keys: string[] = []
      const labels: string[] = []
      if (!profile.display_name?.trim()) { keys.push('display_name'); labels.push('What should we call you?') }
      if (!profile.current_country?.trim()) { keys.push('current_country'); labels.push('Country where you live now') }
      if (!profile.citizenship?.trim()) { keys.push('citizenship'); labels.push('Passport citizenship(s)') }
      return { keys, labels }
    }
    if (currentStep === householdStep) {
      const keys: string[] = []
      const labels: string[] = []
      if (!profile.household_type) { keys.push('household_type'); labels.push('Who is moving?') }
      if (!profile.family_size) { keys.push('family_size'); labels.push('Total people, including you') }
      if (profile.spouse === null) { keys.push('spouse'); labels.push('Is a partner moving with you?') }
      if (profile.dependents === null) { keys.push('dependents'); labels.push('Number of dependants') }
      if (!profile.timeline) { keys.push('timeline'); labels.push('When would you like to move?') }
      if (!profile.goals.length) { keys.push('goals'); labels.push('Which routes do you want to research? (pick at least one)') }
      if (profile.family_size !== null && profile.family_size < 1 + (profile.spouse ? 1 : 0) + (profile.dependents ?? 0)) { keys.push('family_size'); labels.push('Total people must include you, your partner and all dependants') }
      return { keys, labels }
    }
    return { keys: [], labels: [] }
  }
  async function persist(status: WizardStatus, nextStep: number) {
    const response = await fetch('/api/profile', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wizard_status: status,
        display_name: profile.display_name, citizenship: profile.citizenship, current_country: profile.current_country,
        household_type: profile.household_type, family_size: profile.family_size, spouse: profile.spouse, dependents: profile.dependents,
        timeline: profile.timeline, goals: profile.goals, priority: setup.lanes[0] ? priorities[setup.lanes[0]] : profile.priority,
        monthly_income: profile.monthly_income, annual_income: profile.monthly_income != null ? profile.monthly_income * 12 : null, income_type: profile.income_type,
        remote: profile.remote, occupation: profile.occupation, credentials: profile.credentials, education: profile.education,
        savings: profile.savings, ancestry_connections: profile.ancestry_connections, preferred_regions: profile.preferred_regions,
        preferred_region: profile.preferred_regions[0] ?? profile.preferred_region,
        onboarding: { ...setup, answers: activeAnswers(setup), step: nextStep },
        completed_at: status === 'completed' ? profile.completed_at ?? new Date().toISOString() : profile.completed_at,
      }),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error ?? 'Unable to save your progress. Please try again.')
  }
  async function saveAndContinue(exit = false) {
    if (busy.current) return
    if (!exit) {
      const gaps = missingForStep()
      if (gaps.keys.length) {
        setMissing(gaps.keys)
        setError(gaps.labels.length === 1 ? `Please answer this to continue: ${gaps.labels[0]}.` : `Please complete these to continue: ${gaps.labels.join('; ')}.`)
        requestAnimationFrame(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
        return
      }
    }
    busy.current = true; setSaving(true); setError(''); setMissing([])
    try {
      const complete = currentStep === reviewStep && !exit
      const nextStep = exit || complete ? currentStep : currentStep + 1
      await persist(complete || retake ? 'completed' : exit ? 'skipped' : 'in_progress', nextStep)
      if (exit || complete) { router.push(complete ? '/command-center' : retake ? '/settings' : '/destinations'); router.refresh() }
      else navigate(nextStep)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to save. Your answers are still on this screen.')
    } finally { busy.current = false; setSaving(false) }
  }
  function toggleDestination(name: string) {
    setSetup(previous => ({ ...previous, destinations: previous.destinations.includes(name) ? previous.destinations.filter(value => value !== name) : previous.destinations.length < 12 ? [...previous.destinations, name] : previous.destinations }))
  }
  const laneShort = setup.lanes.length ? setup.lanes.map(id => LANES[id].short).join(' and ') : 'your priorities'
  // Demo structure: the page heading is the lane's framing; each question is
  // its own card below it.
  const title = currentStep === 0 ? 'How do you want to approach this move?'
    : question ? LANES[question.lane].h1 : currentStep === energyStep ? 'Explore your Energy focus'
    : currentStep === originStep ? 'Where are you starting from?'
    : currentStep === householdStep ? 'Who is moving, and when?'
    : 'Your Command Center is built around ' + laneShort
  const intro = currentStep === 0 ? 'Pick up to three, in the order you care about them. The first one becomes your primary: it opens first and leads the country rankings. Each one you add asks its own three questions. Nothing gets hidden either way.'
    : question ? LANES[question.lane].note : currentStep === energyStep ? 'Optional and experimental. Practical visa, budget, health and safety research always stays separate. You can skip this and continue setup.' : currentStep === originStep ? 'Your residence and passport countries help you research the relevant routes. Neither is assumed.' : currentStep === householdStep ? 'Tell us who the plan needs to work for. Leave financial details unknown until you have them.' : 'Your answers and selected destinations will be saved to your account. No sample households, progress or matches.'
  // Demo-style progress: 1 approach pick + lane questions + 6 household fields.
  const laneQsDone = questions.filter(q => isAnswered(setup.answers[q.id])).length
  const householdDone = [
    Boolean(profile.household_type),
    profile.family_size !== null,
    profile.spouse !== null,
    profile.dependents !== null,
    Boolean(profile.timeline),
    profile.goals.length > 0,
  ].filter(Boolean).length
  const totalQs = 1 + questions.length + 6
  const totalDone = (setup.lanes.length ? 1 : 0) + laneQsDone + householdDone
  const firstName = profile.display_name?.trim().split(/\s+/)[0] || ''
  const railItems = [
    { label: 'Your approach', note: setup.lanes.length ? selectedLanes : 'Not chosen yet' },
    { label: setup.lanes.length > 1 ? `Your ${setup.lanes.length} lanes` : 'Your lane', note: setup.lanes.length ? `${laneQsDone} of ${questions.length} answered` : 'Unlocks after question 1' },
    { label: 'Household', note: `${householdDone} of 6 answered` },
    { label: 'Command Center', note: 'Built from your answers' },
  ]
  const continueLabel = currentStep === 0
    ? (setup.lanes.length > 1 ? `Continue with ${setup.lanes.length} lanes` : 'Continue')
    : currentStep === reviewStep ? 'Build & open Command Center'
    : currentStep === energyStep ? 'Continue to household' : 'Continue'

  return <main className={styles.page}>
    <header className={styles.header}>
      <span className={styles.brand}><img src="/brand/favicon-48.png" alt="" width="28" height="28" />Kolmari</span>
      <span className={styles.headerTitle}>{firstName ? `Setting up ${firstName}’s Command Center` : 'Setting up your Command Center'}</span>
      <button onClick={() => saveAndContinue(true)} disabled={saving} className={styles.exit}>Save and finish later</button>
    </header>
    <div className={styles.layout}>
      <aside className={styles.rail} aria-label="Setup progress">
        <p className={styles.eyebrow}>SETUP</p>
        <ol>{railItems.map((item, i) => {
          const on = phase === i
          const past = phase > i
          return <li key={item.label} className={on ? styles.on : past ? styles.past : undefined} aria-current={on ? 'step' : undefined}>
            <span className={styles.railDot}>{past ? <Check size={13} /> : i + 1}</span>
            <div><strong>{item.label}</strong><small>{item.note}</small></div>
          </li>
        })}</ol>
        <p className={styles.railNote}>Your answers set up the Command Center, then keep the country rankings honest. Everything saves automatically.</p>
      </aside>
      <section className={styles.content}>
        <p className={styles.eyebrow}>{question ? `${LANES[question.lane].short} · priority ${setup.lanes.indexOf(question.lane) + 1}` : ['QUESTION 1 — IT SETS THE REST', 'YOUR PRIORITIES', 'EVERY APPROACH ASKS THIS', 'READY TO BUILD'][phase]}</p>
        <h1 ref={heading} tabIndex={-1}>{title}</h1>
        <p className={styles.intro}>{intro}</p>
        {showQuizLaneBanner && quiz && <p className={styles.note}>You said {quiz.answers.priority} matters most, so {quizSuggestedLanes.map(id => LANES[id].short).join(' and ')} {quizSuggestedLanes.length > 1 ? 'are' : 'is'} preselected. Change it freely.</p>}
        <fieldset disabled={saving} className={styles.fields}>
        {currentStep === 0 && <div className={`${styles.lanes}${missing.includes('lanes') ? ` ${styles.invalidGroup}` : ''}`}>{LANE_IDS.map(id => { const lane = LANES[id]; const rank = setup.lanes.indexOf(id); const on = rank >= 0; const full = !on && setup.lanes.length >= 3; return <button type="button" key={id} aria-pressed={on} disabled={full} onClick={() => toggleLane(id)} className={styles.lane}><span className={styles.laneTop}><span className={styles.laneIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={lane.d} /></svg></span><strong>{lane.title}</strong></span><span className={styles.laneBlurb}>{lane.blurb}</span><small className={styles.laneTag}>{on ? `${['Primary', '2nd priority', '3rd priority'][rank]} · ${lane.tag}` : full ? 'Three is the maximum' : lane.tag}</small></button> })}</div>}
        {question && <section className={styles.qcard} aria-label={question.q}>
          <div className={styles.qhead}><h2>{question.q}</h2><span className={styles.qmode}>{question.mode}</span></div>
          {question.help && <p className={styles.qhelp}>{question.help}</p>}
          <div className={`${styles.choices}${missing.includes('question') ? ` ${styles.invalidGroup}` : ''}`}>{question.opts.map(option => { const value = setup.answers[question.id]; return <Choice key={option} active={Array.isArray(value) ? value.includes(option) : value === option} onClick={() => answer(question, option)}>{option}</Choice> })}</div>
          {question.lane === 'health' && <p className={styles.note}>Saved for your research checklist. An allergen flag does not remove a destination or certify food safety.</p>}
        </section>}
        {currentStep === energyStep && <EnergyPortal />}
        {currentStep === originStep && <div className={styles.formGrid}><TextField label="What should we call you?" required invalid={missing.includes('display_name')} value={profile.display_name} onChange={v => update('display_name', v)} maxLength={80} autoComplete="given-name" /><TextField label="Country where you live now" required invalid={missing.includes('current_country')} value={profile.current_country} onChange={v => update('current_country', v)} maxLength={80} autoComplete="country-name" /><TextField label="Passport citizenship(s)" required invalid={missing.includes('citizenship')} value={profile.citizenship} onChange={v => update('citizenship', v)} maxLength={80} /><TextField label="Ancestry or family connections abroad (optional)" value={profile.ancestry_connections} onChange={v => update('ancestry_connections', v)} maxLength={500} /></div>}
        {currentStep === householdStep && <>
          {quiz && <section className={styles.card} aria-label="From your Match Quiz">
            <h2>From your Match Quiz</h2>
            <p>Six of these came from your Match Quiz and are already filled in. Check them, then complete your household details below.</p>
            <ol className={styles.priorityList}>
              {QUIZ_CARRYOVER_QUESTIONS.map(({ key, label }) => quiz.answers[key] ? <li key={key}><span>{label}: {quiz.answers[key]}</span><b>FROM YOUR QUIZ</b></li> : null)}
            </ol>
          </section>}
          <div className={styles.formGrid}><SelectField label="Who is moving?" required invalid={missing.includes('household_type')} value={profile.household_type} options={['Solo', 'Couple', 'Family', 'Other']} onChange={v => update('household_type', v)} /><NumberField label="Total people, including you" required invalid={missing.includes('family_size')} value={profile.family_size} min={1} max={12} onChange={v => update('family_size', v)} /><SelectField label="Is a partner moving with you?" required invalid={missing.includes('spouse')} value={profile.spouse === null ? null : profile.spouse ? 'Yes' : 'No'} options={['Yes', 'No']} onChange={v => update('spouse', v === 'Yes')} /><NumberField label="Number of dependants" required invalid={missing.includes('dependents')} value={profile.dependents} min={0} max={11} onChange={v => update('dependents', v)} /><SelectField label="When would you like to move?" required invalid={missing.includes('timeline')} value={profile.timeline} options={['0-3 months', '3-6 months', '6-12 months', '12+ months', 'Just researching']} onChange={v => update('timeline', v)} /></div>
          <h2 className={styles.subheading}>Which routes do you want to research?<span className={styles.req} aria-hidden="true"> *</span></h2><div className={`${styles.choices}${missing.includes('goals') ? ` ${styles.invalidGroup}` : ''}`}>{goals.map(goal => <Choice key={goal} active={profile.goals.includes(goal)} onClick={() => update('goals', profile.goals.includes(goal) ? profile.goals.filter(g => g !== goal) : [...profile.goals, goal])}>{goal}</Choice>)}</div>
          {profile.family_size !== null && profile.family_size < 1 + (profile.spouse ? 1 : 0) + (profile.dependents ?? 0) && <p role="alert" className={styles.error}>Total people must include you, your partner and all dependants.</p>}
          <details className={styles.details}><summary>Income, work and regional preferences (optional)</summary><p>These improve practical comparisons. A budget is not treated as income.</p><div className={styles.formGrid}><NumberField label="Monthly income (USD)" value={profile.monthly_income} onChange={v => update('monthly_income', v)} max={1_000_000} /><NumberField label="Savings (USD)" value={profile.savings} onChange={v => update('savings', v)} max={100_000_000} /><SelectField label="Income type" value={profile.income_type} options={['Employment', 'Self-employment', 'Pension', 'Investments', 'Mixed', 'Other']} onChange={v => update('income_type', v)} /><SelectField label="Working remotely?" value={profile.remote === null ? null : profile.remote ? 'Yes' : 'No'} options={['Yes', 'No']} onChange={v => update('remote', v === 'Yes')} /><TextField label="Occupation" value={profile.occupation} onChange={v => update('occupation', v)} maxLength={120} /><SelectField label="Education" value={profile.education} options={['Secondary school', 'Associate degree', 'Bachelor’s degree', 'Master’s degree', 'Doctorate', 'Professional credential', 'Other']} onChange={v => update('education', v)} /><TextField label="Credentials" value={profile.credentials} onChange={v => update('credentials', v)} maxLength={500} /></div><h3>Regions to research</h3><div className={styles.choices}>{['North America', 'Latin America', 'Europe', 'Africa', 'Asia', 'Oceania', 'Open to anywhere'].map(region => <Choice key={region} active={profile.preferred_regions.includes(region)} onClick={() => update('preferred_regions', profile.preferred_regions.includes(region) ? profile.preferred_regions.filter(r => r !== region) : [...profile.preferred_regions, region])}>{region}</Choice>)}</div></details>
        </>}
        {currentStep === reviewStep && <>
          <section className={styles.summary}><p className={styles.eyebrow}>YOUR STARTING POINT</p><h2>{profile.display_name}’s Kolmari Plan</h2><p>{profile.current_country} · {profile.family_size} {profile.family_size === 1 ? 'person' : 'people'} · {profile.timeline}</p><p>Passport citizenship(s): {profile.citizenship}</p></section>
          <div className={styles.reviewGrid}><section className={styles.card}><h2>Your planning rail</h2><p>In the priority order you chose.</p><ol className={styles.priorityList}>{setup.lanes.map((id, i) => <li key={id}><span>{LANE_LINKS[id].label}</span><b>{i === 0 ? 'First' : `Priority ${i + 1}`}</b></li>)}</ol></section><section className={styles.card}><h2>What happens next</h2><p>Your Command Center links to these tools and keeps your priorities visible. Each new destination gets research tasks from your answers.</p><p>Country rankings and eligibility are not recalculated from unverified health or astrology claims.</p></section></div>
          <section className={styles.card}><h2>First destinations to compare</h2>{seededDestinationsFromQuiz ? <p>Suggested from your Match Quiz region. Change them freely.</p> : <p>Choose your own shortlist. You can also start with an empty board.</p>}<div className={styles.choices}>{Array.from(new Set([...destinations, ...setup.destinations])).map(name => <Choice key={name} active={setup.destinations.includes(name)} onClick={() => toggleDestination(name)}>{name}</Choice>)}</div><div className={styles.addDestination}><label>Another destination<input value={destination} maxLength={100} onChange={e => setDestination(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); const name = destination.trim(); if (name && !setup.destinations.some(d => d.toLowerCase() === name.toLowerCase())) toggleDestination(name); setDestination('') } }} placeholder="e.g. Lisbon or Mexico City" /></label><button type="button" disabled={!destination.trim() || setup.destinations.length >= 12} onClick={() => { const name = destination.trim(); if (name && !setup.destinations.some(d => d.toLowerCase() === name.toLowerCase())) toggleDestination(name); setDestination('') }}>Add destination</button></div><small>{setup.destinations.length} of 12 selected</small></section>
        </>}
        </fieldset>
        {error && <p ref={errorRef} role="alert" className={styles.error}>{error}</p>}
        <footer className={styles.actions}>
          {currentStep > 0 && <button type="button" disabled={saving} onClick={() => navigate(Math.max(0, currentStep - 1))} className={styles.backText}>Back</button>}
          <button type="button" onClick={() => saveAndContinue()} disabled={saving} className={styles.primary}>{saving ? <LoaderCircle size={18} className="animate-spin" /> : null}{continueLabel}<ArrowRight size={18} /></button>
          <span className={styles.progressLabel}>{currentStep === reviewStep ? `All ${totalQs} answered` : `${totalDone} of ${totalQs} answered`}</span>
          {saving && <span className={styles.savingLabel}>Building your Command Center…</span>}
        </footer>
        <p className={styles.footnote}>Progress saves when you continue. {currentStep === energyStep ? 'Birth details stay in this session; city lookup uses Mapbox.' : 'Your answers support research, not visa approval or medical advice.'}</p>
      </section>
    </div>
  </main>
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={styles.choice}>{children}{active && <Check size={14} aria-hidden="true" />}</button>
}
function TextField({ label, value, onChange, maxLength, autoComplete, required, invalid }: { label: string; value: string | null; onChange: (value: string) => void; maxLength: number; autoComplete?: string; required?: boolean; invalid?: boolean }) {
  return <label className={invalid ? styles.invalid : undefined}>{label}{required && <span className={styles.req} aria-hidden="true"> *</span>}<input value={value ?? ''} onChange={e => onChange(e.target.value)} maxLength={maxLength} autoComplete={autoComplete} aria-required={required || undefined} /></label>
}
function NumberField({ label, value, onChange, min = 0, max, required, invalid }: { label: string; value: number | null; onChange: (value: number | null) => void; min?: number; max: number; required?: boolean; invalid?: boolean }) {
  return <label className={invalid ? styles.invalid : undefined}>{label}{required && <span className={styles.req} aria-hidden="true"> *</span>}<input type="number" min={min} max={max} step={1} value={value ?? ''} onChange={e => { const n = e.target.valueAsNumber; onChange(Number.isFinite(n) ? Math.min(max, Math.max(min, Math.trunc(n))) : null) }} aria-required={required || undefined} /></label>
}
function SelectField({ label, value, options, onChange, required, invalid }: { label: string; value: string | null; options: readonly string[]; onChange: (value: string) => void; required?: boolean; invalid?: boolean }) {
  return <label className={invalid ? styles.invalid : undefined}>{label}{required && <span className={styles.req} aria-hidden="true"> *</span>}<select value={value ?? ''} onChange={e => onChange(e.target.value)} aria-required={required || undefined}><option value="" disabled>Select one</option>{options.map(option => <option key={option}>{option}</option>)}</select></label>
}
