export function safeNextPath(value: string | string[] | undefined, fallback = '/dashboard') {
  const candidate = Array.isArray(value) ? value[0] : value
  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//')) return fallback
  if (/[\\\u0000-\u001f\u007f]/.test(candidate)) return fallback

  try {
    const url = new URL(candidate, 'https://kolmari.local')
    if (url.origin !== 'https://kolmari.local') return fallback
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}

export function authHref(mode: 'login' | 'signup', nextPath: string) {
  return `/${mode}?next=${encodeURIComponent(safeNextPath(nextPath))}`
}
