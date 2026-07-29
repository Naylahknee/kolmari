import { MarketingLogo } from './marketing-logo'

/**
 * Wordmark — the Kolmari logo lockup (butterfly mark + "Kolmari" wordmark).
 *
 * Delegates to the shared MarketingLogo so there is a single logo implementation
 * across the app. The previous `/brand/KolmariWordMark.svg` asset does not exist
 * in public/brand/ (only favicons ship), which rendered a broken image on the
 * auth pages; the lockup uses the on-disk favicon mark instead.
 */
export function Wordmark({
  compact = false,
  href = '/',
  dark = false,
}: {
  /** When the wordmark sits on a dark surface, render the text in white. */
  dark?: boolean
  compact?: boolean
  href?: string
}) {
  return <MarketingLogo compact={compact} href={href} tone={dark ? 'light' : 'dark'} />
}
