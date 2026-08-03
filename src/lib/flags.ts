/* Local country flag assets (public-domain SVGs under /public/flags), replacing
 * the external flagcdn dependency. Files are named by lowercase ISO-3166-1
 * alpha-2 code, e.g. /flags/pt.svg. */
export function flagSrc(code: string): string {
  return `/flags/${code.toLowerCase()}.svg`
}
