import Link from 'next/link'

export const TAB_SLUGS = ['overview', 'move-there', 'cost-housing', 'work-study', 'healthcare', 'family-schools', 'lifestyle-community', 'tax-money'] as const
export type TabSlug = (typeof TAB_SLUGS)[number]

/* Tabs are routes, not state. Each is its own URL, matching the existing
   /nextinations/[countrySlug]/[section] pattern. */
export function TabBar({ slug, active }: { slug: string; active: TabSlug }) {
  return (
    <div className="tabbar">
      <div className="tabs" role="tablist">
        <Link key="overview" className={`tab${active === 'overview' ? ' is-active' : ''}`} aria-selected={active === 'overview'} role="tab" href={`/nextinations/${slug}/v2/overview`}>Overview</Link>
        <Link key="move-there" className={`tab${active === 'move-there' ? ' is-active' : ''}`} aria-selected={active === 'move-there'} role="tab" href={`/nextinations/${slug}/v2/move-there`}>Move There</Link>
        <Link key="cost-housing" className={`tab${active === 'cost-housing' ? ' is-active' : ''}`} aria-selected={active === 'cost-housing'} role="tab" href={`/nextinations/${slug}/v2/cost-housing`}>Cost & Housing</Link>
        <Link key="work-study" className={`tab${active === 'work-study' ? ' is-active' : ''}`} aria-selected={active === 'work-study'} role="tab" href={`/nextinations/${slug}/v2/work-study`}>Work & Study</Link>
        <Link key="healthcare" className={`tab${active === 'healthcare' ? ' is-active' : ''}`} aria-selected={active === 'healthcare'} role="tab" href={`/nextinations/${slug}/v2/healthcare`}>Healthcare</Link>
        <Link key="family-schools" className={`tab${active === 'family-schools' ? ' is-active' : ''}`} aria-selected={active === 'family-schools'} role="tab" href={`/nextinations/${slug}/v2/family-schools`}>Family & Schools</Link>
        <Link key="lifestyle-community" className={`tab${active === 'lifestyle-community' ? ' is-active' : ''}`} aria-selected={active === 'lifestyle-community'} role="tab" href={`/nextinations/${slug}/v2/lifestyle-community`}>Lifestyle & Community</Link>
        <Link key="tax-money" className={`tab${active === 'tax-money' ? ' is-active' : ''}`} aria-selected={active === 'tax-money'} role="tab" href={`/nextinations/${slug}/v2/tax-money`}>Tax & Money</Link>
      </div>
    </div>
  )
}
