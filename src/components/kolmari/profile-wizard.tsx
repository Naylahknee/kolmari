'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from 'lucide-react'
import type { PathwayGoal, RelocationProfile, WizardStatus } from '@/lib/profile'

const incomeTypes = ['Employment', 'Self-employment', 'Pension', 'Investments', 'Mixed', 'Other'] as const
const educationLevels = ['Secondary school', 'Associate degree', 'Bachelorâ€™s degree', 'Masterâ€™s degree', 'Doctorate', 'Professional credential', 'Other'] as const
const householdTypes = ['Solo', 'Couple', 'Family', 'Other'] as const
const regions = ['North America', 'Latin America', 'Europe', 'Africa', 'Asia', 'Oceania', 'Open to anywhere'] as const
const timelines = ['0-3 months', '3-6 months', '6-12 months', '12+ months', 'Just researching'] as const
const goals: PathwayGoal[] = ['Remote Work', 'Employment', 'Entrepreneurship', 'Passive Income / Retirement', 'Education', 'Family Reunification', 'Ancestry', 'Investment']
const priorities = ['Affordability', 'Safety', 'Career', 'Healthcare & schools', 'Quality of life'] as const

export function ProfileWizard({ initial }: { initial: RelocationProfile }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isRetake = initial.wizard_status === 'completed'

  function update<K extends keyof RelocationProfile>(key: K, value: RelocationProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }))
  }

  function payload(wizardStatus: WizardStatus) {
    return {
      wizard_status: wizardStatus,
      display_name: profile.display_name,
      // v1 is built for US-based movers; we assume a US starting point rather
      // than asking for citizenship directly. Ancestry ties are collected in a
      // later step. Existing values are preserved for retakes.
      citizenship: profile.citizenship ?? 'United States',
      current_country: profile.current_country,
      monthly_income: profile.monthly_income,
      annual_income: profile.annual_income,
      income_type: profile.income_type,
      remote: profile.remote,
      occupation: profile.occupation,
      credentials: profile.credentials,
      education: profile.education,
      savings: profile.savings,
      household_type: profile.household_type,
      family_size: profile.family_size,
      spouse: profile.spouse,
      dependents: profile.dependents,
      ancestry_connections: profile.ancestry_connections,
      preferred_regions: profile.preferred_regions,
      preferred_region: profile.preferred_regions[0] ?? null,
      timeline: profile.timeline,
      priority: profile.priority,
      goals: profile.goals,
      completed_at: wizardStatus === 'completed' ? new Date().toISOString() : profile.completed_at,
    }
  }

  async function persist(wizardStatus: WizardStatus) {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload(wizardStatus)),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error ?? 'Unable to save your Profile.')
  }

  function canContinue() {
    if (step === 0) return profile.goals.length > 0 && Boolean(profile.priority)
    if (step === 1) return Boolean(profile.display_name?.trim() && profile.current_country?.trim())
    if (step === 2) return Boolean(profile.income_type)
    if (step === 3) return profile.remote !== null && Boolean(profile.occupation?.trim() && profile.education && profile.household_type)
      && profile.family_size !== null && profile.dependents !== null && profile.spouse !== null
      && (profile.ancestry_connections === 'None known' || Boolean(profile.ancestry_connections?.trim()))
    if (step === 4) return profile.preferred_regions.length > 0
    return Boolean(profile.timeline)
  }

  async function next() {
    if (!canContinue()) return
    setSaving(true)
    setError('')
    try {
      await persist(isRetake ? 'completed' : 'in_progress')
      setStep((current) => current + 1)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to save your progress.')
    } finally {
      setSaving(false)
    }
  }

  async function finish() {
    if (!canContinue()) return
    setSaving(true)
    setError('')
    try {
      await persist('completed')
      router.push('/nextinations?source=quiz')
      router.refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to complete your Profile.')
      setSaving(false)
    }
  }

  async function skip() {
    setSaving(true)
    setError('')
    try {
      await persist('skipped')
      router.push('/destinations')
      router.refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to continue right now.')
      setSaving(false)
    }
  }

  const panels = [
    <section key="goal"><StepLabel step={1} title="What's your main reason for moving?" copy="This is the biggest factor â€” it decides which Pathways even apply. Choose every category that fits." /><div className="mt-7 grid gap-3 sm:grid-cols-2">{goals.map((goal) => <Choice key={goal} active={profile.goals.includes(goal)} onClick={() => update('goals', profile.goals.includes(goal) ? profile.goals.filter((item) => item !== goal) : [...profile.goals, goal])}>{goal}</Choice>)}</div>
      <div className="mt-8"><p className="text-sm font-bold text-navy">And what matters most in this move?</p><p className="mt-1 text-xs text-muted">Your top priority gets the most weight in your Match Scores. Pick one.</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{priorities.map((p) => <Choice key={p} active={profile.priority === p} onClick={() => update('priority', p)}>{p}</Choice>)}</div></div></section>,
    <section key="origin"><StepLabel step={2} title="Where are you starting from?" copy="Kolmari is built for US-based movers, so we assume a US starting point â€” no citizenship or passport questions. Ancestry ties come in a later step." /><div className="mt-7 grid gap-5 sm:grid-cols-2"><TextField label="What should we call you?" value={profile.display_name} onChange={(value) => update('display_name', value)} /><TextField label="Current country of residence" value={profile.current_country} onChange={(value) => update('current_country', value)} /></div></section>,
    <section key="money"><StepLabel step={3} title="How do you earn?" copy="Just the category for now â€” how your income comes in. Exact income and savings figures come later, only when you build your Kolmari Plan." /><div className="mt-7 grid gap-5 sm:grid-cols-2"><SelectField label="Primary income type" value={profile.income_type} options={incomeTypes} onChange={(value) => update('income_type', value)} /></div></section>,
    <section key="life"><StepLabel step={4} title="Your work, household, and ties" copy="These shape eligibility â€” remote work, credentials, dependents, and any ancestry connection." />
      <div className="mt-7"><p className="text-sm font-bold">Can your current work be performed remotely?</p><div className="mt-3 grid grid-cols-2 gap-3"><Choice active={profile.remote === true} onClick={() => update('remote', true)}>Yes</Choice><Choice active={profile.remote === false} onClick={() => update('remote', false)}>No</Choice></div></div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2"><TextField label="Occupation" value={profile.occupation} onChange={(value) => update('occupation', value)} /><SelectField label="Highest education or credential" value={profile.education} options={educationLevels} onChange={(value) => update('education', value)} /><TextField label="Licenses or credentials (optional)" value={profile.credentials} onChange={(value) => update('credentials', value)} /><SelectField label="Household type" value={profile.household_type} options={householdTypes} onChange={(value) => update('household_type', value)} /><NumberField label="Total household members" value={profile.family_size} min={1} max={12} onChange={(value) => update('family_size', value)} /><NumberField label="Dependents" value={profile.dependents} min={0} max={11} onChange={(value) => update('dependents', value)} /></div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2"><div><p className="text-sm font-bold">Spouse or partner included?</p><div className="mt-2 grid grid-cols-2 gap-2"><Choice active={profile.spouse === true} onClick={() => update('spouse', true)}>Yes</Choice><Choice active={profile.spouse === false} onClick={() => update('spouse', false)}>No</Choice></div></div><div><p className="text-sm font-bold">Ancestry or family connections abroad?</p><div className="mt-2 grid grid-cols-2 gap-2"><Choice active={profile.ancestry_connections === 'None known'} onClick={() => update('ancestry_connections', 'None known')}>None known</Choice><Choice active={Boolean(profile.ancestry_connections && profile.ancestry_connections !== 'None known')} onClick={() => update('ancestry_connections', '')}>Yes</Choice></div></div></div>
      {profile.ancestry_connections !== null && profile.ancestry_connections !== 'None known' ? <div className="mt-5"><TextField label="Countries and relationships" value={profile.ancestry_connections} onChange={(value) => update('ancestry_connections', value)} /></div> : null}</section>,
    <section key="destination"><StepLabel step={5} title="Where are you drawn to?" copy="Choose the regions to prioritize. Pick 'Open to anywhere' if you want Kolmari to cast a wide net." /><div className="mt-7 grid gap-3 sm:grid-cols-2">{regions.map((region) => <Choice key={region} active={profile.preferred_regions.includes(region)} onClick={() => update('preferred_regions', profile.preferred_regions.includes(region) ? profile.preferred_regions.filter((item) => item !== region) : [...profile.preferred_regions, region])}>{region}</Choice>)}</div></section>,
    <section key="timeline"><StepLabel step={6} title="When are you planning to move?" copy="Timing affects which routes are realistic. Finish to reveal your top Destination." /><div className="mt-8 max-w-sm"><SelectField label="Desired relocation timeline" value={profile.timeline} options={timelines} onChange={(value) => update('timeline', value)} /></div></section>,
  ]

  return (
    <main className="min-h-screen bg-canvas px-5 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold text-gold-deep">{isRetake ? 'Edit Profile' : 'Profile Wizard'}</p><p className="text-xs text-muted">Step {step + 1} of {panels.length}</p></div><Link href={isRetake ? '/settings' : '/destinations'} className="text-sm font-bold text-muted">Exit wizard</Link></div>
        <div className="mt-4 flex gap-1.5" aria-hidden>{panels.map((_, index) => <span key={index} className={`h-2 flex-1 rounded-full ${index <= step ? 'bg-gold' : 'bg-line'}`} />)}</div>
        <div className="card-surface mt-6 p-6 sm:p-10">{panels[step]}{error ? <p role="alert" className="mt-6 rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p> : null}<div className="mt-10 flex items-center justify-between gap-3"><button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0 || saving} className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 font-bold text-muted disabled:opacity-0"><ArrowLeft size={17} />Back</button>{step < panels.length - 1 ? <button type="button" onClick={next} disabled={!canContinue() || saving} className="gold-button disabled:cursor-not-allowed disabled:opacity-50">{saving ? <LoaderCircle size={16} className="animate-spin" /> : null}Continue<ArrowRight size={17} /></button> : <button type="button" onClick={finish} disabled={!canContinue() || saving} className="gold-button disabled:cursor-not-allowed disabled:opacity-50">{saving ? <LoaderCircle size={16} className="animate-spin" /> : null}Reveal my top Destination<ArrowRight size={17} /></button>}</div></div>
        {!isRetake ? <button type="button" onClick={skip} disabled={saving} className="mx-auto mt-5 block text-sm font-bold text-muted underline-offset-4 hover:underline">Skip for now and explore destinations</button> : null}
        <p className="mx-auto mt-5 max-w-xl text-center text-xs leading-5 text-muted">Your answers support planning information only. Kolmari does not provide legal approval or immigration advice.</p>
      </div>
    </main>
  )
}

function StepLabel({ step, title, copy }: { step: number; title: string; copy: string }) {
  return <div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-gold-deep">Step {step}</p><h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">{title}</h1><p className="mt-3 text-sm leading-6 text-muted">{copy}</p></div>
}

function TextField({ label, value, onChange }: { label: string; value: string | null; onChange: (value: string) => void }) {
  return <label className="text-sm font-bold">{label}<input className="field mt-2" value={value ?? ''} onChange={(event) => onChange(event.target.value)} /></label>
}

function NumberField({ label, value, onChange, min = 0, max = 100_000_000 }: { label: string; value: number | null; onChange: (value: number | null) => void; min?: number; max?: number }) {
  return <label className="text-sm font-bold">{label}<input className="field mt-2" type="number" min={min} max={max} value={value ?? ''} onChange={(event) => onChange(event.target.value === '' ? null : Math.min(max, Math.max(min, Number(event.target.value))))} /></label>
}

function SelectField<T extends string>({ label, value, options, onChange }: { label: string; value: string | null; options: readonly T[]; onChange: (value: T) => void }) {
  return <label className="text-sm font-bold">{label}<select className="field mt-2" value={value ?? ''} onChange={(event) => onChange(event.target.value as T)}><option value="" disabled>Select one</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} aria-pressed={active} className={`flex min-h-14 items-center justify-between rounded-card border px-4 py-3 text-left text-sm font-bold transition ${active ? 'border-gold bg-gold-soft/60' : 'border-line bg-white hover:border-gold/50'}`}>{children}{active ? <Check size={17} /> : null}</button>
}

