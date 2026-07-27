'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
import { fmtMoney, fmtTemp, type Currency, type TempUnit } from '@/lib/country-template/format'

type Units = { currency: Currency; temp: TempUnit; setCurrency: (c: Currency) => void; setTemp: (t: TempUnit) => void }
const Ctx = createContext<Units | null>(null)
export const useUnits = () => {
  const v = useContext(Ctx)
  if (!v) throw new Error('useUnits must be used inside <UnitsProvider>')
  return v
}

/** Persist to the user profile in production rather than component state. */
export function UnitsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('EUR')
  const [temp, setTemp] = useState<TempUnit>('C')
  return <Ctx.Provider value={{ currency, temp, setCurrency, setTemp }}>{children}</Ctx.Provider>
}

export const Money = ({ eur, dec }: { eur: number; dec?: number }) => <>{fmtMoney(eur, useUnits().currency, dec)}</>
export const Temp = ({ c, hi }: { c: number; hi?: number }) => <>{fmtTemp(c, useUnits().temp, hi)}</>

export function UnitsControl() {
  const { currency, temp, setCurrency, setTemp } = useUnits()
  return (
    <div className="units nu" role="group" aria-label="Display units">
      <span className="ulabel">Units</span>
      <div className="useg" role="group" aria-label="Currency">
        {(['EUR', 'USD'] as Currency[]).map(c => (
          <button key={c} aria-pressed={currency === c} onClick={() => setCurrency(c)}>{c}</button>
        ))}
      </div>
      <div className="useg" role="group" aria-label="Temperature">
        {(['C', 'F'] as TempUnit[]).map(t => (
          <button key={t} aria-pressed={temp === t} onClick={() => setTemp(t)}>&deg;{t}</button>
        ))}
      </div>
    </div>
  )
}
