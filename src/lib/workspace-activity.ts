export const WORKSPACE_ACTIVITY_STORAGE_KEY = 'kolmari-workspace-activity-v1'
export const WORKSPACE_ACTIVITY_EVENT = 'kolmari:workspace-activity'

export type WorkspaceActivity = {
  href: string
  label: string
}

const ROUTE_LABELS: Array<{ route: string; label: string }> = [
  { route: '/your-world', label: 'Your World' },
  { route: '/pathways', label: 'Pathways' },
  { route: '/my-plan', label: 'My Plan' },
  { route: '/flutter', label: 'Flutter Mode' },
  { route: '/documents', label: 'Documents' },
  { route: '/cost-calculator', label: 'Cost Calculator' },
  { route: '/greenbook', label: 'Greenbook Insights' },
  { route: '/community', label: 'Kolmari Klub' },
]

const titleCaseSlug = (slug: string) =>
  slug.split('-').map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join(' ')

/** Returns a safe, resumable workspace location for a protected route. */
export function activityForPath(pathname: string): WorkspaceActivity | null {
  const countryMatch = pathname.match(/^\/nextinations\/([^/]+)\/v2(?:\/[^/]+)?$/)
  if (countryMatch) {
    return { href: pathname, label: `${titleCaseSlug(countryMatch[1])} research` }
  }

  const match = ROUTE_LABELS.find(({ route }) => pathname === route || pathname.startsWith(`${route}/`))
  return match ? { href: pathname, label: match.label } : null
}

/** Treat localStorage as untrusted input before rendering it as a link. */
export function parseWorkspaceActivity(value: string | null): WorkspaceActivity | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as Partial<WorkspaceActivity>
    if (typeof parsed.href !== 'string' || typeof parsed.label !== 'string') return null
    if (!parsed.href.startsWith('/') || parsed.href.startsWith('//') || parsed.href.includes('\\')) return null
    if (parsed.label.length === 0 || parsed.label.length > 80) return null
    return { href: parsed.href, label: parsed.label }
  } catch {
    return null
  }
}
