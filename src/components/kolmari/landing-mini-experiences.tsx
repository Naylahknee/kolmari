'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ExperienceId = 'starting-places' | 'pathways' | 'nexit-stage'

export type LandingMiniExperienceResult = {
  experience: ExperienceId
  answers: Record<string, string>
  teaserTitle: string
  teaserItems: string[]
  completedAt: string
}

type Step = {
  id: string
  prompt: string
  options: string[]
}

type Experience = {
  id: ExperienceId
  name: string
  steps: Step[]
  computeTeaser: (answers: Record<string, string>) => { title: string; items: string[]; disclosure?: string }
}

// ─── Experience 1: Find Your Starting Places ─────────────────────────────────

const startingPlacesExperience: Experience = {
  id: 'starting-places',
  name: 'Find Your Starting Places',
  steps: [
    {
      id: 'who',
      prompt: 'Who are you imagining this move for?',
      options: ['Just me', 'Me and a partner', 'My family', 'I am only exploring'],
    },
    {
      id: 'priority',
      prompt: 'What matters most right now?',
      options: ['Affordability', 'Safety and stability', 'Career opportunities', 'Quality of life', 'A fresh start'],
    },
    {
      id: 'budget',
      prompt: 'What monthly housing budget feels realistic?',
      options: ['Under $1,000', '$1,000–$2,000', '$2,000–$3,500', 'Flexible or not sure'],
    },
    {
      id: 'region',
      prompt: 'Which part of the world are you most curious about?',
      options: ['Europe', 'Latin America and the Caribbean', 'Asia and the Pacific', 'Africa', 'I am open to anywhere'],
    },
  ],
  computeTeaser(answers) {
    const region = answers['region'] ?? 'I am open to anywhere'
    const priority = answers['priority'] ?? 'Affordability'

    // Deterministic regional starters — cautious language, no eligibility claims
    const regionMap: Record<string, Array<{ name: string; reason: string }>> = {
      'Europe': [
        { name: 'Portugal', reason: 'commonly researched for affordability and quality of life' },
        { name: 'Spain', reason: 'often explored for daily-life and climate considerations' },
        { name: 'Estonia', reason: 'worth comparing for digital-nomad and low-cost-of-living research' },
      ],
      'Latin America and the Caribbean': [
        { name: 'Mexico', reason: 'commonly researched for affordability and proximity to the US' },
        { name: 'Costa Rica', reason: 'often explored for quality of life and natural environment' },
        { name: 'Panama', reason: 'worth comparing for retiree-focused pathway research' },
      ],
      'Asia and the Pacific': [
        { name: 'Thailand', reason: 'commonly researched for affordability and cost-of-living comparisons' },
        { name: 'Vietnam', reason: 'often explored for low monthly costs and remote-work communities' },
        { name: 'Malaysia', reason: 'worth comparing for English-language infrastructure and budget range' },
      ],
      'Africa': [
        { name: 'South Africa', reason: 'commonly researched for English-speaking infrastructure and value' },
        { name: 'Rwanda', reason: 'worth comparing for growing digital-economy and safety reputation' },
        { name: 'Ghana', reason: 'often explored for diaspora communities and welcoming entry programs' },
      ],
    }

    if (region === 'I am open to anywhere') {
      return {
        title: 'You may want to start with:',
        items: [
          `Countries researched for ${priority.toLowerCase()} — compare Europe and Latin America as starting regions`,
          'Building a short starting list of 3–5 Destinations before narrowing further',
          'Exploring the Destinations map to compare regional costs and Pathway categories',
        ],
      }
    }

    const suggestions = regionMap[region] ?? regionMap['Europe']
    return {
      title: 'You may want to start with:',
      items: suggestions.map(({ name, reason }) => `${name} — ${reason}`),
    }
  },
}

// ─── Experience 2: Explore Your Pathways ─────────────────────────────────────

const pathwaysExperience: Experience = {
  id: 'pathways',
  name: 'Explore Your Pathways',
  steps: [
    {
      id: 'situation',
      prompt: 'Which description is closest to your current situation?',
      options: [
        'I work remotely',
        'I am employed and may work abroad',
        'I want to study',
        'I am retired or planning retirement',
        'I run or want to start a business',
      ],
    },
    {
      id: 'ties',
      prompt: 'Do you have citizenship, ancestry, or family ties outside your current country?',
      options: ['Yes', 'No', 'I am not sure'],
    },
    {
      id: 'willingness',
      prompt: 'Would you be willing to work, study, or start a business overseas?',
      options: ['Yes', 'Maybe', 'No'],
    },
    {
      id: 'timeline',
      prompt: 'How soon are you considering a move?',
      options: ['Within 12 months', 'In 1–3 years', 'More than 3 years', 'I am only exploring'],
    },
  ],
  computeTeaser(answers) {
    const situation = answers['situation'] ?? ''
    const ties = answers['ties'] ?? 'No'
    const willingness = answers['willingness'] ?? 'Maybe'

    const categories: string[] = []

    if (situation === 'I work remotely' || willingness === 'Yes' || willingness === 'Maybe') {
      categories.push('Digital nomad or remote-work pathways')
    }
    if (situation === 'I am employed and may work abroad') {
      categories.push('Skilled worker pathways')
    }
    if (situation === 'I want to study') {
      categories.push('Student pathways')
    }
    if (situation === 'I am retired or planning retirement') {
      categories.push('Retirement pathways')
    }
    if (situation === 'I run or want to start a business') {
      categories.push('Entrepreneurship or business pathways')
    }
    if (ties === 'Yes' || ties === 'I am not sure') {
      categories.push('Ancestry or family-based pathways')
    }

    // Always show at least one
    const items = categories.length > 0
      ? categories.slice(0, 3)
      : ['Digital nomad or remote-work pathways', 'Skilled worker pathways']

    return {
      title: 'You may want to explore:',
      items,
      disclosure: 'This is a starting point for research, not a legal eligibility determination.',
    }
  },
}

// ─── Experience 3: Discover Your Move Stage ──────────────────────────────────

const nexitStageExperience: Experience = {
  id: 'nexit-stage',
  name: 'Discover Your Move Stage',
  steps: [
    {
      id: 'country-in-mind',
      prompt: 'Do you already have a country in mind?',
      options: ['Yes', 'I have a few possibilities', 'No'],
    },
    {
      id: 'passport',
      prompt: 'Do you currently have a valid passport?',
      options: ['Yes', 'No', 'I need to check'],
    },
    {
      id: 'ideal-timeline',
      prompt: 'When would you ideally like to relocate?',
      options: ['Within 12 months', 'In 1–3 years', 'More than 3 years', 'Someday'],
    },
    {
      id: 'obstacle',
      prompt: 'What feels like your biggest obstacle right now?',
      options: [
        'Choosing a country',
        'Understanding visas',
        'Money and budgeting',
        'Employment',
        'Documents and logistics',
        'I do not know where to begin',
      ],
    },
  ],
  computeTeaser(answers) {
    const countryInMind = answers['country-in-mind'] ?? 'No'
    const idealTimeline = answers['ideal-timeline'] ?? 'Someday'
    const obstacle = answers['obstacle'] ?? 'I do not know where to begin'

    // Deterministic stage assignment
    const isDiscovery =
      countryInMind === 'No' ||
      obstacle === 'Choosing a country' ||
      obstacle === 'I do not know where to begin' ||
      idealTimeline === 'Someday' ||
      idealTimeline === 'More than 3 years'

    const isPlanning =
      countryInMind === 'Yes' &&
      (idealTimeline === 'Within 12 months' || idealTimeline === 'In 1–3 years') &&
      (obstacle === 'Documents and logistics' || obstacle === 'Money and budgeting' || obstacle === 'Employment')

    const stage = isPlanning ? 'Planning Stage' : isDiscovery ? 'Discovery Stage' : 'Research Stage'

    const stageDetails: Record<string, { explanation: string; firstStep: string; reason: string }> = {
      'Discovery Stage': {
        explanation: 'You are still orienting — narrowing the possibilities is the most useful place to begin.',
        firstStep: 'Your first step is to narrow the world into a manageable starting list.',
        reason: 'Kolmari helps you compare regions and filter Destinations by what matters to you.',
      },
      'Research Stage': {
        explanation: 'You have some direction and are ready to go deeper on real countries and realistic Pathways.',
        firstStep: 'Your first step is to compare countries and explore realistic Pathway categories.',
        reason: 'Kolmari organizes country data, costs, and Pathway categories in one place.',
      },
      'Planning Stage': {
        explanation: 'You have a target and a timeline — the work now is organizing your documents, budget, and tasks.',
        firstStep: 'Your first step is to organize your timeline, documents, and relocation budget.',
        reason: 'Kolmari tracks documents, costs, and the steps between research and departure.',
      },
    }

    const detail = stageDetails[stage]
    return {
      title: `You are in the ${stage}.`,
      items: [detail.explanation, detail.firstStep, detail.reason],
    }
  },
}

const EXPERIENCES: Record<ExperienceId, Experience> = {
  'starting-places': startingPlacesExperience,
  'pathways': pathwaysExperience,
  'nexit-stage': nexitStageExperience,
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3" aria-label={`Step ${current} of ${total}`}>
      <div className="flex flex-1 gap-1" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={[
              'h-1 flex-1 rounded-full transition-colors',
              i < current ? 'bg-gold' : 'bg-line',
            ].join(' ')}
          />
        ))}
      </div>
      <span className="shrink-0 text-xs font-semibold text-muted">{current} of {total}</span>
    </div>
  )
}

// ─── Single question step ─────────────────────────────────────────────────────

function QuestionStep({
  step,
  selected,
  onSelect,
}: {
  step: Step
  selected: string | undefined
  onSelect: (value: string) => void
}) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-navy sm:text-xl">{step.prompt}</h3>
      <div className="space-y-2.5" role="group" aria-label={step.prompt}>
        {step.options.map((option) => {
          const isSelected = selected === option
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(option)}
              className={[
                'flex w-full items-center gap-3 rounded-[var(--radius-card)] border px-4 py-3.5 text-left text-sm font-medium transition-all',
                'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-gold/50',
                isSelected
                  ? 'border-navy bg-navy text-white shadow-sm'
                  : 'border-line bg-white text-navy hover:border-navy/30 hover:bg-canvas',
              ].join(' ')}
            >
              <span
                className={[
                  'grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors',
                  isSelected ? 'border-white bg-white' : 'border-line-strong',
                ].join(' ')}
                aria-hidden="true"
              >
                {isSelected && <Check size={11} className="text-navy" strokeWidth={3} />}
              </span>
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Teaser result screen ─────────────────────────────────────────────────────

function TeaserScreen({
  result,
  onContinue,
}: {
  result: { title: string; items: string[]; disclosure?: string }
  onContinue: () => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-widest text-gold-deep">Your starting point</p>
        <h3 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">{result.title}</h3>
      </div>

      <ul className="space-y-3">
        {result.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 rounded-[var(--radius-card)] border border-line bg-white p-4 text-sm text-navy shadow-tile">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-deep" aria-hidden="true">
              <Check size={11} strokeWidth={3} />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {result.disclosure && (
        <p className="rounded-[var(--radius-field)] border border-line bg-canvas px-4 py-3 text-xs leading-5 text-muted">
          {result.disclosure}
        </p>
      )}

      <button
        type="button"
        onClick={onContinue}
        className="gold-button w-full"
      >
        See the full picture <ArrowRight size={16} />
      </button>
    </div>
  )
}

// ─── Final account-creation screen ───────────────────────────────────────────

function FinalScreen({ onClose }: { onClose: () => void }) {
  const benefits = [
    'Save your results',
    'Compare Destinations',
    'Explore Pathways in more detail',
    'Build My Kolmari Plan',
    'Track documents, costs, and next steps',
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-widest text-gold-deep">You are ready to begin</p>
        <h3 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
          Your starting point is ready.
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted">
          Create a free Kolmari account to save your result and see the full picture.
        </p>
      </div>

      <ul className="space-y-2.5">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-center gap-3 text-sm font-medium text-navy">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-deep" aria-hidden="true">
              <Check size={11} strokeWidth={3} />
            </span>
            {benefit}
          </li>
        ))}
      </ul>

      <div className="space-y-3">
        <Link
          href="/signup?next=%2Fnexitnation"
          className="gold-button w-full text-center"
        >
          Create My Free Account <ArrowRight size={16} />
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-btn)] border border-line bg-white px-5 py-3 text-sm font-semibold text-navy transition hover:bg-canvas"
        >
          Continue exploring
        </button>
      </div>

      <p className="text-center text-xs text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-navy underline underline-offset-2 hover:text-gold-deep">
          Sign in
        </Link>
      </p>
    </div>
  )
}

// ─── Modal shell ──────────────────────────────────────────────────────────────

type ModalPhase = 'questions' | 'teaser' | 'final'

function MiniExperienceModal({
  experience,
  onClose,
}: {
  experience: Experience
  onClose: () => void
}) {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<ModalPhase>('questions')
  const [teaserResult, setTeaserResult] = useState<{ title: string; items: string[]; disclosure?: string } | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const totalSteps = experience.steps.length
  const currentStep = experience.steps[stepIndex]
  const selectedAnswer = answers[currentStep?.id ?? '']
  const canAdvance = selectedAnswer !== undefined

  // Trap focus within modal
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      if (focusable.length === 0) return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    first?.focus()
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [phase, stepIndex, onClose])

  // Prevent background scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  function handleSelect(value: string) {
    setAnswers((prev) => ({ ...prev, [currentStep.id]: value }))
  }

  function handleNext() {
    if (!canAdvance) return
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1)
    } else {
      const result = experience.computeTeaser(answers)
      setTeaserResult(result)
      setPhase('teaser')
    }
  }

  function handleBack() {
    if (phase === 'teaser') { setPhase('questions'); return }
    if (phase === 'final') { setPhase('teaser'); return }
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  const showBack = phase === 'teaser' || phase === 'final' || stepIndex > 0

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={experience.name}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-deep/55 backdrop-blur-[3px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-full max-h-[92dvh] overflow-y-auto rounded-t-[24px] bg-canvas sm:max-w-[540px] sm:rounded-[20px]"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-canvas px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                className="grid size-8 place-items-center rounded-lg border border-line bg-white text-navy transition hover:bg-canvas focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-gold/50"
              >
                <ArrowLeft size={15} />
              </button>
            )}
            <p className="text-xs font-extrabold uppercase tracking-widest text-gold-deep">
              {experience.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-lg border border-line bg-white text-muted transition hover:text-navy focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-gold/50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6 sm:px-6">
          {phase === 'questions' && (
            <div className="space-y-6">
              <ProgressBar current={stepIndex + 1} total={totalSteps} />
              <QuestionStep
                step={currentStep}
                selected={selectedAnswer}
                onSelect={handleSelect}
              />
              <button
                type="button"
                onClick={handleNext}
                disabled={!canAdvance}
                className="gold-button w-full"
                aria-label={stepIndex < totalSteps - 1 ? 'Next question' : 'See my starting point'}
              >
                {stepIndex < totalSteps - 1 ? 'Next' : 'See my starting point'}
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {phase === 'teaser' && teaserResult && (
            <TeaserScreen
              result={teaserResult}
              onContinue={() => setPhase('final')}
            />
          )}

          {phase === 'final' && (
            <FinalScreen onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Public CTA trigger button ────────────────────────────────────────────────

/**
 * Drop-in replacement for the existing panel CTA anchor.
 * Renders an inline button; opens the matching mini experience in a modal.
 */
export function MiniExperienceTrigger({
  experience: experienceId,
  label,
  className,
}: {
  experience: ExperienceId
  label: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const experience = EXPERIENCES[experienceId]

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className ?? 'inline-flex items-center gap-2 text-sm font-extrabold text-gold-deep'}
      >
        {label}
        <ArrowRight size={15} aria-hidden="true" />
      </button>

      {open && (
        <MiniExperienceModal
          experience={experience}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
