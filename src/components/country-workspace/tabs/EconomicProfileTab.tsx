import type { EconomicProfileContent, SourcedFact } from '@/lib/country-workspace/country-content'

type DisplayMetric = SourcedFact & { label: string }

export function EconomicProfileTab({ content, countryName }: { content: EconomicProfileContent | null; countryName: string }) {
  if (!content) return <ResearchInProgress countryName={countryName} />

  const metrics: DisplayMetric[] = [
    content.gdpPerCapita ? { label: 'GDP per capita', ...content.gdpPerCapita } : null,
    content.growthTrend ? { label: 'Real GDP growth', ...content.growthTrend } : null,
    content.inflation ? { label: 'Annual inflation (CPI)', ...content.inflation } : null,
    content.unemployment ? { label: 'Unemployment rate', ...content.unemployment } : null,
    content.avgMonthlyWage ? { label: 'Average monthly wage', ...content.avgMonthlyWage } : null,
    content.minimumWage ? { label: 'Minimum wage', ...content.minimumWage } : null,
  ].filter((m): m is DisplayMetric => m !== null)

  return (
    <div className="space-y-5">
      {/* Headline */}
      <section className="card-surface p-6">
        <h2 className="font-display text-2xl font-bold text-navy">Economic Profile of {countryName}</h2>
        <p className="mt-2 text-sm text-muted">Wages, purchasing power, inflation, and the labour market — keeping your plan grounded in the real economy, not just the idea of moving abroad.</p>
      </section>

      {/* Key metrics */}
      <section className="card-surface p-6">
        <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">Key indicators</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl bg-canvas p-4">
              <p className="text-xs text-muted">{m.label}</p>
              <p className="mt-1 text-lg font-extrabold text-navy">{m.value}</p>
              <p className="mt-1.5 text-[10px] leading-4 text-muted/80">
                {m.source} · {m.period} · Verified {m.lastVerified}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Industry structure */}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="card-surface p-5">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">Top industries</p>
          <ul className="mt-3 space-y-1.5">
            {content.topIndustries.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-navy"><span className="size-1.5 shrink-0 rounded-full bg-gold" />{s}</li>
            ))}
          </ul>
        </section>
        <section className="card-surface p-5">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">Growing sectors</p>
          <ul className="mt-3 space-y-1.5">
            {content.growingSectors.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-navy"><span className="size-1.5 shrink-0 rounded-full bg-teal" />{s}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* Personalised interpretation */}
      <section className="overflow-hidden rounded-card border border-gold/30 bg-gold-soft/30 p-6">
        <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">What this economy may mean for you</p>
        <p className="mt-3 text-sm leading-7 text-navy">{content.personalInterpretation}</p>
      </section>

      <p className="rounded-xl border border-line bg-canvas px-4 py-3 text-xs text-muted">{content.disclaimer}</p>
    </div>
  )
}

function ResearchInProgress({ countryName }: { countryName: string }) {
  return (
    <section className="card-surface p-8 text-center">
      <p className="font-extrabold text-navy">Research in progress</p>
      <p className="mt-1 text-sm text-muted">Economic data for {countryName} is being verified with official sources. Every metric will show its source, period, and last-verified date.</p>
    </section>
  )
}
