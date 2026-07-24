import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { CostOfLivingContent } from '@/lib/country-workspace/country-content'
import { SourceFooter } from './SourceFooter'

type Props = {
  content: CostOfLivingContent | null
  countryName: string
  monthlyIncome: number | null
  isFamily: boolean
}

export function CostOfLivingTab({ content, countryName, monthlyIncome, isFamily }: Props) {
  if (!content) {
    return (
      <section className="card-surface p-8 text-center">
        <p className="font-extrabold text-navy">Research in progress</p>
        <p className="mt-1 text-sm text-muted">
          Category-level estimates for {countryName} are being verified.
        </p>
        <Link href="/cost-calculator" className="gold-button mt-5">
          Open the Cost Calculator <ArrowRight size={16} />
        </Link>
      </section>
    )
  }

  const total = (isFamily && content.familyTotal) ? content.familyTotal : content.soloTotal
  const fmt = (n: number) => `${content.currency}${n.toLocaleString()}`
  const incomeGap = monthlyIncome && total ? monthlyIncome - total.high : null

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="card-surface p-6">
        <h2 className="font-display text-2xl font-bold text-navy">Cost of Living in {countryName}</h2>
        <p className="mt-2 text-sm text-muted">
          Planning estimates for a {isFamily ? 'family household' : 'solo mover'} based in {content.topCity}. Actual costs vary by city, neighbourhood, and lifestyle.
        </p>

        {/* Total range */}
        <div className="mt-5 flex flex-wrap items-end gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">Estimated monthly total</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-navy">
              {fmt(total.low)}–{fmt(total.high)}<span className="text-base font-semibold text-muted">/mo</span>
            </p>
            <p className="mt-1 text-xs text-muted">{isFamily ? 'Family household' : 'Solo mover'} · {content.topCity} baseline</p>
          </div>

          {monthlyIncome !== null && total ? (
            <div className={`rounded-xl px-4 py-3 ${incomeGap !== null && incomeGap >= 0 ? 'bg-ok-soft' : 'bg-warn-soft'}`}>
              <p className={`text-xs font-bold ${incomeGap !== null && incomeGap >= 0 ? 'text-ok' : 'text-warn'}`}>
                {incomeGap !== null && incomeGap >= 0
                  ? `Your income may leave ~${fmt(incomeGap)}/mo cushion vs. high estimate`
                  : `Your income may be ~${fmt(Math.abs(incomeGap ?? 0))} below the high estimate`}
              </p>
              <p className={`mt-1 text-xs ${incomeGap !== null && incomeGap >= 0 ? 'text-ok/80' : 'text-warn/80'}`}>
                Based on your stated income of {fmt(monthlyIncome)}/mo. Planning guide only.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Category breakdown */}
      <section className="card-surface p-6">
        <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">
          Category breakdown — {isFamily ? 'family' : 'solo'}
        </p>
        <div className="mt-4 divide-y divide-line">
          {content.categories.map((cat) => {
            const low = isFamily && cat.familyLow !== undefined ? cat.familyLow : cat.soloLow
            const high = isFamily && cat.familyHigh !== undefined ? cat.familyHigh : cat.soloHigh
            return (
              <div key={cat.label} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-navy">{cat.label}</p>
                  {cat.notes ? <p className="mt-0.5 text-xs leading-4 text-muted">{cat.notes}</p> : null}
                </div>
                <p className="shrink-0 text-sm font-bold text-navy">
                  {cat.currency}{low.toLocaleString()}–{cat.currency}{high.toLocaleString()}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Budget cities */}
      {content.budgetCities.length > 0 && (
        <section className="card-surface p-6">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">Lower-cost alternatives to {content.topCity}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {content.budgetCities.map((city) => (
              <span key={city} className="rounded-pill bg-canvas px-3.5 py-1.5 text-sm font-semibold text-navy">{city}</span>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Link href="/cost-calculator" className="gold-button">
          Open the Cost Calculator <ArrowRight size={16} />
        </Link>
        <p className="text-xs text-muted">{content.disclaimer}</p>
      </div>
      <SourceFooter disclosure={content.disclosure} />
    </div>
  )
}
