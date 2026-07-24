import type { SectionDisclosure, ContentStatus } from '@/lib/country-workspace/country-content'

const STATUS_LABELS: Record<ContentStatus, { label: string; className: string }> = {
  official_source_verified: { label: 'Official source verified', className: 'bg-ok-soft text-ok' },
  editorially_reviewed: { label: 'Editorially reviewed', className: 'bg-info-soft text-info' },
  placeholder: { label: 'Placeholder — not verified', className: 'bg-warn-soft text-warn' },
  stale: { label: 'May be out of date', className: 'bg-warn-soft text-warn' },
}

/**
 * Section-level source disclosure footer.
 * Renders a single line: "Last verified: [date] · [sourceNote]" plus a status badge.
 * Only renders when disclosure is provided; silently omitted for null content / research-in-progress states.
 */
export function SourceFooter({ disclosure }: { disclosure: SectionDisclosure | undefined }) {
  if (!disclosure) return null

  const badge = STATUS_LABELS[disclosure.status]
  const date = new Date(disclosure.lastVerified).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4 text-xs text-muted">
      <span>Last verified: {date} · {disclosure.sourceNote}</span>
      <span className={`shrink-0 rounded-pill px-2 py-0.5 font-semibold ${badge.className}`}>
        {badge.label}
      </span>
    </div>
  )
}
