const FALLBACK_SITE_URL = 'https://kolmari.madincrease.workers.dev'

export function getSiteUrl() {
  const candidate = process.env.SITE_URL?.trim() || FALLBACK_SITE_URL

  try {
    const url = new URL(candidate)
    return url.origin
  } catch {
    return FALLBACK_SITE_URL
  }
}

export function absoluteUrl(path = '/') {
  return new URL(path, `${getSiteUrl()}/`).toString()
}
