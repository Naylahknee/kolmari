'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

const questions = [
  {
    id: 'who',
    prompt: 'Who are you planning this move for?',
    options: ['Just me', 'Me and a partner', 'My family', 'I am only exploring'],
  },
  {
    id: 'priority',
    prompt: 'What matters most in your next life abroad?',
    options: ['Affordability', 'Safety and belonging', 'Career opportunities', 'Healthcare and schools', 'Quality of life'],
  },
  {
    id: 'region',
    prompt: 'Which part of the world are you most curious about?',
    options: ['Europe', 'Latin America and the Caribbean', 'Africa', 'Asia and the Pacific', 'I am open to anywhere'],
  },
  {
    id: 'situation',
    prompt: 'Which description is closest to your current situation?',
    options: ['I work remotely', 'I may work abroad', 'I want to study', 'I am retired or planning retirement', 'I run or want to start a business'],
  },
  {
    id: 'ties',
    prompt: 'Do you have citizenship, ancestry, or close family ties outside your current country?',
    options: ['Yes', 'No', 'I am not sure'],
  },
  {
    id: 'budget',
    prompt: 'What monthly housing budget feels realistic?',
    options: ['Under $1,000', '$1,000–$2,000', '$2,000–$3,500', 'More than $3,500', 'I am not sure yet'],
  },
  {
    id: 'timeline',
    prompt: 'When would you ideally like to relocate?',
    options: ['Within 12 months', 'In 1–3 years', 'More than 3 years', 'Someday'],
  },
  {
    id: 'obstacle',
    prompt: 'What feels like your biggest obstacle right now?',
    options: ['Choosing a country', 'Understanding visas', 'Money and budgeting', 'Employment', 'Documents and logistics', 'I do not know where to begin'],
  },
] as const

type Answers = Record<string, string>

function buildResult(answers: Answers) {
  const timeline = answers.timeline
  const obstacle = answers.obstacle
  const region = answers.region
  const situation = answers.situation
  const ties = answers.ties

  const stage =
    timeline === 'Within 12 months' && !['Choosing a country', 'I do not know where to begin'].includes(obstacle)
      ? 'Planning Stage'
      : timeline === 'Someday' || obstacle === 'I do not know where to begin'
        ? 'Discovery Stage'
        : 'Research Stage'

  const pathways: string[] = []
  if (situation === 'I work remotely') pathways.push('remote-work and digital nomad pathways')
  if (situation === 'I may work abroad') pathways.push('employment and skilled-worker pathways')
  if (situation === 'I want to study') pathways.push('student pathways')
  if (situation === 'I am retired or planning retirement') pathways.push('retirement and passive-income pathways')
  if (situation === 'I run or want to start a business') pathways.push('entrepreneur and business pathways')
  if (ties === 'Yes' || ties === 'I am not sure') pathways.push('ancestry or family-based pathways')

  return {
    stage,
    region: region === 'I am open to anywhere' ? 'a broad regional comparison' : region,
    pathway: pathways.slice(0, 2).join(' and ') || 'several possible pathway categories',
    firstStep:
      obstacle === 'Choosing a country'
        ? 'Build a shortlist of three to five Nextinations.'
        : obstacle === 'Understanding visas'
          ? 'Compare the pathway categories connected to your situation.'
          : obstacle === 'Money and budgeting'
            ? 'Create a realistic relocation budget and savings target.'
            : obstacle === 'Employment'
              ? 'Map your work, remote-income, or study options.'
              : obstacle === 'Documents and logistics'
                ? 'Organize your documents, timeline, and moving checklist.'
                : 'Start by narrowing your priorities and strongest regions.',
  }
}

export default function NexitQuizPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [complete, setComplete] = useState(false)

  const current = questions[step]
  const selected = answers[current?.id]
  const result = useMemo(() => buildResult(answers), [answers])

  function choose(value: string) {
    setAnswers((previous) => ({ ...previous, [current.id]: value }))
  }

  function next() {
    if (!selected) return
    if (step < questions.length - 1) {
      setStep((value) => value + 1)
      return
    }

    try {
      window.localStorage.setItem(
        'nexit-quiz-result',
        JSON.stringify({ answers, completedAt: new Date().toISOString() }),
      )
    } catch {
      // The result remains visible even when storage is unavailable.
    }
    setComplete(true)
  }

  if (complete) {
    return (
      <main className="min-h-screen bg-canvas px-5 py-10 sm:py-16">
        <section className="mx-auto max-w-2xl overflow-hidden rounded-[24px] border border-line bg-white shadow-card">
          <div className="bg-navy-deep px-6 py-8 text-center text-white sm:px-10">
            <Image src="/brand/favicon-32.png" alt="" width={40} height={40} className="mx-auto h-10 w-10" />
            <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.22em] text-gold">Your Nexit starting point</p>
            <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">You are in the {result.stage}.</h1>
          </div>

          <div className="space-y-6 p-6 sm:p-10">
            <div className="grid gap-3">
              {[
                `Start with ${result.region}.`,
                `Explore ${result.pathway}.`,
                result.firstStep,
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-4 text-sm leading-6 text-navy">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-deep"><Check size={11} strokeWidth={3} /></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-gold/40 bg-gold-soft/40 p-4 text-sm leading-6 text-navy">
              Create a free account to save these results and build your full Nexit Plan. You may delete your account and stored data at any time.
            </div>

            <Link href="/signup?next=%2Fnexitnation&source=nexit-quiz" className="gold-button w-full justify-center text-center">
              Create My Free Account <ArrowRight size={17} />
            </Link>

            <p className="text-center text-xs text-muted">
              Already have an account? <Link href="/login?next=%2Fnexitnation" className="font-bold text-navy underline underline-offset-2">Sign in</Link>
            </p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-canvas px-5 py-8 sm:py-12">
      <section className="mx-auto max-w-2xl overflow-hidden rounded-[24px] border border-line bg-white shadow-card">
        <div className="border-b border-line bg-navy-deep px-6 py-6 text-white sm:px-10">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-white/75 hover:text-white"><ArrowLeft size={16} /> Back</Link>
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold">Nexit Quiz</span>
          </div>
          <h1 className="mt-6 font-display text-3xl font-extrabold sm:text-4xl">Build your Nexit starting point.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">Eight focused questions. No relocation knowledge required.</p>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex flex-1 gap-1" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={questions.length}>
              {questions.map((question, index) => (
                <span key={question.id} className={`h-1 flex-1 rounded-full ${index <= step ? 'bg-gold' : 'bg-line'}`} />
              ))}
            </div>
            <span className="text-xs font-bold text-muted">{step + 1} of {questions.length}</span>
          </div>

          <h2 className="font-display text-2xl font-extrabold leading-tight text-navy sm:text-3xl">{current.prompt}</h2>

          <div className="mt-6 space-y-3" role="radiogroup" aria-label={current.prompt}>
            {current.options.map((option) => {
              const active = selected === option
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => choose(option)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-4 text-left text-sm font-semibold transition ${active ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:border-navy/30 hover:bg-canvas'}`}
                >
                  <span className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${active ? 'border-white bg-white text-navy' : 'border-line-strong'}`}>
                    {active && <Check size={11} strokeWidth={3} />}
                  </span>
                  {option}
                </button>
              )
            })}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((value) => Math.max(0, value - 1))}
              disabled={step === 0}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-line px-5 text-sm font-bold text-navy disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button type="button" onClick={next} disabled={!selected} className="gold-button disabled:cursor-not-allowed disabled:opacity-40">
              {step === questions.length - 1 ? 'See My Starting Point' : 'Next'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
