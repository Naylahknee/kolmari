'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import {
  Leaf,
  ShoppingBasket,
  Fish,
  Sprout,
  ShieldCheck,
  Salad,
  Milk,
  Nut,
  Package,
  Shell,
  Wheat,
  Egg,
  Bean,
  HeartPulse,
  ClipboardCheck,
  ExternalLink,
  Info,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react'
import { COUNTRIES, countryFlag } from '@/lib/countries'
import {
  TRACKED_ALLERGENS,
  ARCHETYPE_LABELS,
  ALLERGEN_LABELS,
  archetypeMatchCount,
  type FoodArchetype,
  type TrackedAllergen,
  type AllergenPrevalence,
  type CountryFoodCulture,
} from '@/lib/food-culture/types'
import styles from './country-food-fit-card.module.css'

/* CountryFoodFitCard — the reusable, redesigned country food-fit panel.
 *
 * Presentation-layer redesign of the previous FoodCultureCard. All data, scoring,
 * and ranking still come from src/lib/food-culture; this component only renders.
 * Not hard-coded to any country — pass any CountryFoodCulture entry.
 *
 * The only derived (adapter) values are display-only: source-quality is inferred
 * from whether a citation exists, and the prevalence word "Sometimes" is a label
 * for the underlying `occasional` value. No source data or business logic changes. */

const ARCHETYPE_ICONS: Record<FoodArchetype, LucideIcon> = {
  mediterranean: Leaf,
  'farm-to-table': ShoppingBasket,
  'seafood-forward': Fish,
  'plant-forward': Sprout,
  'strict-allergen-labeling': ShieldCheck,
  'low-processed-food': Salad,
  'dairy-heavy': Milk,
  'nut-heavy': Nut,
  'high-processed-food': Package,
}

const ALLERGEN_ICONS: Record<TrackedAllergen, LucideIcon> = {
  shellfish: Shell,
  treeNuts: Nut,
  peanuts: Bean,
  dairy: Milk,
  gluten: Wheat,
  eggs: Egg,
}

/* Semantic, restrained treatments — green / amber / muted-rose, never a wall of red. */
const PREVALENCE: Record<
  AllergenPrevalence,
  { label: string; wrap: string; text: string; dot: string; sentence: string }
> = {
  rare: {
    label: 'Rare',
    wrap: 'border-emerald-200 bg-emerald-50/60',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    sentence: 'rarely appears',
  },
  occasional: {
    label: 'Sometimes',
    wrap: 'border-amber-200 bg-amber-50/50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    sentence: 'shows up sometimes',
  },
  common: {
    label: 'Common',
    wrap: 'border-rose-200 bg-rose-50/60',
    text: 'text-rose-600',
    dot: 'bg-rose-500',
    sentence: 'is common',
  },
}

function flagCodeFor(slug: string): string | null {
  return COUNTRIES.find((c) => c.slug === slug)?.code ?? null
}

/** SVG flag with an emoji fallback, then an initials chip — no broken images. */
function CountryFlag({ code, name }: { code: string | null; name: string }) {
  const [errored, setErrored] = useState(false)
  if (code && !errored) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static flag asset, no optimization needed
      <img
        src={`/flags/${code.toLowerCase()}.svg`}
        alt=""
        width={44}
        height={30}
        onError={() => setErrored(true)}
        className="h-[30px] w-11 rounded-[4px] object-cover shadow-sm ring-1 ring-black/5"
      />
    )
  }
  if (code) {
    return (
      <span aria-hidden className="text-3xl leading-none">
        {countryFlag(code)}
      </span>
    )
  }
  return (
    <span
      aria-hidden
      className="grid h-[30px] w-11 place-items-center rounded-[4px] bg-neutral-100 text-[11px] font-bold text-neutral-500"
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  )
}

export function CountryFoodFitCard({
  country,
  name,
  selected = [],
  flagged = [],
}: {
  country: CountryFoodCulture
  name: string
  selected?: FoodArchetype[]
  flagged?: TrackedAllergen[]
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [openAllergen, setOpenAllergen] = useState<TrackedAllergen | null>(null)

  useEffect(() => {
    setAnimate(true)
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true)
            io.disconnect()
          }
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const hasSelection = selected.length > 0
  const matches = archetypeMatchCount(country, selected)
  const segCount = hasSelection ? selected.length : country.archetypes.length
  const filled = hasSelection ? matches : country.archetypes.length
  const wellSourced = Boolean(country.sourceUrl)
  const code = flagCodeFor(country.countrySlug)

  // Stagger helper: incrementing delays for the reveal / segment animations.
  let step = 0
  const delay = (ms = 45): CSSProperties => ({ '--d': `${(step++ * ms).toFixed(0)}ms` }) as CSSProperties

  return (
    <div
      ref={rootRef}
      data-visible={visible}
      className={`${styles.root} ${animate ? styles.animate : ''} flex h-full flex-col rounded-card border border-neutral-200 bg-white p-5 shadow-card sm:p-6`}
    >
      {/* ---------- Header ---------- */}
      <div className={`${styles.reveal} flex items-start justify-between gap-3`} style={delay()}>
        <div className="flex min-w-0 items-center gap-3">
          <CountryFlag code={code} name={name} />
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold tracking-[-0.01em] text-navy-deep">{name}</h3>
            <div className="mt-1 flex items-center gap-2.5">
              <span className="text-xs font-medium text-neutral-500">
                {hasSelection ? `${matches} of your ${selected.length} fits` : `${country.archetypes.length} food-culture traits`}
              </span>
              <span className="flex items-center gap-1" role="img" aria-label={`${filled} of ${segCount}`}>
                {Array.from({ length: segCount }).map((_, i) => (
                  <span
                    key={i}
                    style={i < filled ? delay(60) : undefined}
                    className={`h-1.5 w-4 rounded-full ${i < filled ? `${styles.seg} bg-gold` : 'bg-neutral-200'}`}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-pill border px-2.5 py-1 text-[11px] font-bold ${
            wellSourced ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-gold-soft bg-gold-soft/50 text-navy'
          }`}
        >
          {wellSourced ? <Leaf className="h-3.5 w-3.5" /> : <Info className="h-3.5 w-3.5" />}
          {wellSourced ? 'Well-sourced' : 'Editorial'}
        </span>
      </div>

      {/* ---------- Food traits ---------- */}
      <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-3">
        {country.archetypes.map((a) => {
          const Icon = ARCHETYPE_ICONS[a]
          const on = selected.includes(a)
          return (
            <div
              key={a}
              style={delay()}
              className={`${styles.reveal} ${styles.chip} flex items-center gap-2 rounded-field border px-2.5 py-2 text-xs font-semibold ${
                on ? 'border-gold-deep bg-gold-soft/70 text-navy-deep' : 'border-gold-soft bg-gold-soft/30 text-navy'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
              <span className="leading-tight">{ARCHETYPE_LABELS[a]}</span>
            </div>
          )
        })}
      </div>

      {/* ---------- Allergen prevalence ---------- */}
      <div className={`${styles.reveal} mt-5`} style={delay()}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">Allergen prevalence in everyday food</p>
          <span className="hidden items-center gap-1 text-[11px] font-medium text-neutral-400 sm:flex">
            <Info className="h-3.5 w-3.5" /> Tap for details
          </span>
        </div>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {TRACKED_ALLERGENS.map((a) => {
            const prev = country.allergenPrevalence[a]
            const meta = PREVALENCE[prev]
            const Icon = ALLERGEN_ICONS[a]
            const isOpen = openAllergen === a
            const isFlagged = flagged.includes(a) && prev === 'common'
            return (
              <div key={a} className={`rounded-field border ${meta.wrap} ${isFlagged ? 'ring-1 ring-rose-300' : ''}`}>
                <button
                  type="button"
                  onClick={() => setOpenAllergen((cur) => (cur === a ? null : a))}
                  aria-expanded={isOpen}
                  className={`${styles.tap} flex w-full items-center gap-2 rounded-field px-2.5 py-2 text-left`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${meta.text}`} aria-hidden />
                  <span className="text-xs font-semibold text-navy-deep">{ALLERGEN_LABELS[a]}</span>
                  <span className={`ml-auto flex items-center gap-1.5 text-[11px] font-bold ${meta.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                <div className={styles.disclosure} data-open={isOpen}>
                  <div className={styles.disclosureInner}>
                    <p className="px-2.5 pb-2.5 text-[11px] leading-4 text-neutral-600">
                      {ALLERGEN_LABELS[a]} {meta.sentence} in everyday and traditional cooking here
                      {isFlagged ? ' — flagged because you asked to watch it.' : '.'}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ---------- Heart note ---------- */}
      {country.cardioNote && (
        <div className={`${styles.reveal} mt-5 flex items-start gap-3`} style={delay()}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-pill bg-rose-50 text-rose-500">
            <HeartPulse className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-bold text-navy-deep">Heart note</p>
            <p className="mt-0.5 text-xs leading-5 text-neutral-600">{country.cardioNote}</p>
          </div>
        </div>
      )}

      {/* ---------- Labeling ---------- */}
      <div className={`${styles.reveal} mt-4 flex items-start gap-3`} style={delay()}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-pill bg-navy-deep/5 text-navy">
          <ClipboardCheck className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-bold text-navy-deep">Labeling</p>
          <p className="mt-0.5 text-xs leading-5 text-neutral-600">{country.labelingLaw}</p>
          {country.sourceUrl && (
            <a
              href={country.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-gold-deep hover:underline"
            >
              Source <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* ---------- Footer ---------- */}
      <p className="mt-5 border-t border-neutral-100 pt-3 text-[10px] leading-4 text-neutral-400">
        Kolmari editorial assessment · reviewed {country.lastReviewed}. Verify allergen and labeling details with official
        sources before relying on them for a move.
      </p>
    </div>
  )
}
