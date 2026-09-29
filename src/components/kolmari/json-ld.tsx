/**
 * Renders a JSON-LD structured-data block. Used for Organization / WebSite
 * markup in the root layout so search engines and AI crawlers can identify
 * Kolmari. Inline JSON-LD is allowed by the site's Content-Security-Policy
 * (script-src includes 'unsafe-inline').
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
