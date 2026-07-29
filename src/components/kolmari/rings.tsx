/**
 * Rings & donuts (from the Kolmari design handoff).
 *  - ScoreRing:  Match Score / Move Readiness / Pathway Match (gold arc on a track).
 *  - BudgetDonut: Budget breakdown via conic-gradient + legend.
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

export const BUDGET_COLORS = [
  '#F3C516', // gold — housing
  '#1F9D94', // teal — food
  '#17305B', // navy — transport
  '#3b82d4', // blue — healthcare
  '#6B7A92', // slate — other
] as const

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
          <li key={s.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
                aria-hidden="true"
              />
              {s.label}
            </span>
            <strong>${s.amount.toLocaleString()}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
