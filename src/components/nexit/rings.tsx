/**
 * Rings & donuts (from the Nexit design handoff).
 *  - ScoreRing:  Nexit Score / Nexit Readiness / Pathway Match (gold arc on a track).
 *  - BudgetDonut: Nexit Budget breakdown via conic-gradient + legend.
 * Pure SVG/CSS, no deps. Server-component safe.
 */

export function ScoreRing({
  value,
  size = 120,
  stroke = 10,
  label,
  suffix = '%',
}: {
  value: number
  size?: number
  stroke?: number
  label?: string
  suffix?: string
}) {
  const r = (size - stroke) / 2 - 4
  const c = 2 * Math.PI * r
  const offset = c * (1 - Math.max(0, Math.min(100, value)) / 100)
  const mid = size / 2
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={mid} cy={mid} r={r} fill="none" stroke="#e6eaf1" strokeWidth={stroke} />
        <circle
          cx={mid} cy={mid} r={r} fill="none" stroke="#F3C516" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          transform={`rotate(-90 ${mid} ${mid})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-sans font-extrabold text-navy" style={{ fontSize: size * 0.27 }}>
          {value}{suffix}
        </span>
        {label ? <span className="font-sans text-[10px] font-semibold text-muted-soft">{label}</span> : null}
      </div>
    </div>
  )
}

export type BudgetSlice = { label: string; amount: number; color: string }

export function BudgetDonut({ slices, total, size = 132 }: { slices: BudgetSlice[]; total: number; size?: number }) {
  const stops = slices
    .reduce<{ stops: string[]; acc: number }>(
      ({ stops: prev, acc }, s) => {
        const start = (acc / total) * 100
        const next = acc + s.amount
        const end = (next / total) * 100
        return { stops: [...prev, `${s.color} ${start}% ${end}%`], acc: next }
      },
      { stops: [], acc: 0 },
    )
    .stops.join(',')
  return (
    <div className="flex items-center gap-[22px]">
      <div className="relative shrink-0 rounded-full" style={{ width: size, height: size, background: `conic-gradient(${stops})` }}>
        <div className="absolute flex flex-col items-center justify-center rounded-full bg-white" style={{ inset: size * 0.18 }}>
          <span className="font-sans text-[20px] font-extrabold text-navy">${total.toLocaleString()}</span>
          <span className="font-sans text-[10px] font-medium text-muted-soft">Total</span>
        </div>
      </div>
      <ul className="flex flex-1 flex-col gap-2.5">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center gap-2 font-sans text-[12.5px] font-medium text-[#42536e]">
            <span className="size-[11px] rounded-[3px]" style={{ background: s.color }} />
            {s.label}
            <b className="ml-auto text-navy">${s.amount.toLocaleString()}</b>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Shared palette for budget slices (matches mockups).
export const BUDGET_COLORS = ['#F3C516', '#17305B', '#7d9ccb', '#C99A00', '#c3cdda']
