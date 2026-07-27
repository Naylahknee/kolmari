import { COUNTRY_SHAPES } from '@/lib/country-shapes'

export function CountryShapePanel({ code, country, city }: { code: string; country: string; city: string }) {
  const shape = COUNTRY_SHAPES[code]

  return (
    <div className="relative flex h-40 items-center justify-center overflow-hidden bg-navy-deep">
      <svg viewBox="0 0 240 120" className="h-full w-full" role="img" aria-label={`Outline map of ${country}`}>
        <defs>
          <pattern id={`grid-${code}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M18 0H0V18" fill="none" stroke="#F3C516" strokeOpacity=".08" strokeWidth=".6" />
          </pattern>
        </defs>
        <rect width="240" height="120" fill={`url(#grid-${code})`} />
        {shape && <path d={shape} fill="#F3C516" stroke="#FBEA91" strokeWidth="1.2" strokeLinejoin="round" />}
      </svg>
      <span className="absolute bottom-3 left-3 rounded-[var(--radius-pill)] bg-navy-deep/85 px-3 py-1 text-[10px] font-bold text-white">{city} · {code}</span>
    </div>
  )
}
