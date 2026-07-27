'use client'
import { useState } from 'react'
import { estimate, type EarnerType } from '@/lib/country-template/tax'
import { useUnits, Money } from './UnitsControl'
import { FX } from '@/lib/country-template/format'

/* Replaces section 1 of the Tax & Money tab. The arithmetic lives in
   lib/country-template/tax.ts so it can be unit tested without a DOM. */
export function TaxEstimator() {
  const [income, setIncome] = useState(60_000)
  const [mode, setMode] = useState<EarnerType>('self')
  const [ifici, setIfici] = useState(false)
  const r = estimate(income, mode, ifici)
  const usd = income * FX
  useUnits() // subscribe so the figures re-render on a currency switch

  return (
    <div className="calc">
      <div>
        <div className="ctrl">
          <label className="cl" htmlFor="tmIncome">
            <span className="cn">Annual gross income</span>
            <span className="cv"><Money eur={income} /></span>
          </label>
          <input id="tmIncome" type="range" min={10_000} max={200_000} step={1000}
                 value={income} onChange={e => setIncome(+e.target.value)} />
        </div>
        <div className="ctrl">
          <div className="seg full" role="group" aria-label="Income type">
            {([['employee','Employed'],['self','Self-employed'],['passive','Pension or passive']] as const).map(([v,l]) => (
              <button key={v} aria-pressed={mode === v} onClick={() => setMode(v)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="ctrl">
          <div className="seg full" role="group" aria-label="Tax regime">
            <button aria-pressed={!ifici} onClick={() => setIfici(false)}>Standard rates</button>
            <button aria-pressed={ifici} onClick={() => setIfici(true)}>IFICI flat 20%</button>
          </div>
        </div>
      </div>
      <div>
        <div className="res">
          <div className="kpi big">
            <div className="k">Estimated net, after Portuguese tax</div>
            <div className="v"><Money eur={r.net} /></div>
            <div className="n"><Money eur={r.net / 12} /> per month</div>
          </div>
          <div className="kpi">
            <div className="k">Income tax (IRS)</div>
            <div className="v"><Money eur={r.irs} /></div>
            <div className="n">{(r.effective * 100).toFixed(1)}% effective{r.flat ? ' \u00b7 IFICI flat rate' : ''}</div>
          </div>
          <div className="kpi">
            <div className="k">Social security</div>
            <div className="v"><Money eur={r.ss} /></div>
          </div>
        </div>
        <div className="callout info">
          <span>Your income is roughly <b>${Math.round(usd).toLocaleString('en-US')}</b>.{' '}
          {mode === 'passive'
            ? 'The Foreign Earned Income Exclusion does not apply to pensions or investment income.'
            : usd <= 130_000
              ? 'That sits under the roughly $130,000 exclusion.'
              : `That exceeds the exclusion by about $${Math.round(usd - 130_000).toLocaleString('en-US')}.`}
          </span>
        </div>
      </div>
    </div>
  )
}
