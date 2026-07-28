'use client'

import { useRef, useState } from 'react'
import { FileCheck2, FilePlus2, Trash2, Upload } from 'lucide-react'

type LocalDocument = { id: string; name: string; size: string }

export function DocumentsManager() {
  const input = useRef<HTMLInputElement>(null)
  const [documents, setDocuments] = useState<LocalDocument[]>([])

  function handleFiles(files: FileList | null) {
    if (!files) return
    const added = Array.from(files).map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
    }))
    setDocuments((current) => [
      ...current.filter((item) => !added.some((newItem) => newItem.id === item.id)),
      ...added,
    ])
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Document organizer</p>
          <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">My Documents</h1>
          <p className="mt-1 text-sm text-muted">
            Keep a local working list of the documents your move may require. Files are not uploaded to Kolmari servers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="gold-button"
        >
          <Upload size={16} aria-hidden="true" /> Add documents
        </button>
        <input
          ref={input}
          type="file"
          multiple
          className="hidden"
          aria-hidden="true"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
        />
      </div>

      {/* Privacy notice */}
      <p className="mt-4 rounded-[var(--radius-field)] bg-canvas px-4 py-3 text-xs text-muted">
        Files added here are stored in your browser session only. They are not sent to Kolmari servers and will be cleared when you close or refresh the page.
      </p>

      {/* Document list */}
      <section className="mt-6 card-surface p-6" aria-labelledby="docs-heading">
        <h2 id="docs-heading" className="font-semibold text-navy">Uploaded this session</h2>

        {documents.length > 0 ? (
          <ul className="mt-5 space-y-3" aria-label="Uploaded documents">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center gap-4 rounded-[var(--radius-field)] border border-line p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-field)] bg-gold-soft" aria-hidden="true">
                  <FileCheck2 size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-navy">{doc.name}</p>
                  <p className="text-xs text-muted">{doc.size}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDocuments((current) => current.filter((item) => item.id !== doc.id))}
                  aria-label={`Remove ${doc.name}`}
                  className="grid size-9 place-items-center rounded-[var(--radius-field)] text-muted hover:bg-canvas hover:text-danger"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          /* Empty state — honest about what is not yet available */
          <div className="mt-4">
            <button
              type="button"
              onClick={() => input.current?.click()}
              className="grid min-h-48 w-full place-items-center rounded-[var(--radius-field)] border-2 border-dashed border-line bg-canvas text-center transition-colors hover:border-gold/40"
            >
              <span>
                <FilePlus2 className="mx-auto text-gold-deep" aria-hidden="true" />
                <p className="mt-3 font-semibold text-navy">No documents added yet</p>
                <p className="mt-1 text-sm text-muted">
                  Select files from your device to build a working list for your Move Plan.
                </p>
                <p className="mt-2 text-xs text-muted">Files stay in this session only.</p>
              </span>
            </button>
          </div>
        )}
      </section>

      {/* Persistent document groups — honest unavailable state */}
      <section className="mt-6 rounded-[var(--radius-card)] border border-line bg-canvas p-6" aria-labelledby="doc-groups-heading">
        <h2 id="doc-groups-heading" className="font-semibold text-navy">Document groups</h2>
        <p className="mt-1 text-sm text-muted">
          Organized document categories — Identity, Civil records, Financial, Employment, Visa-specific, and others — are not yet implemented. They will appear here when available.
        </p>
      </section>
    </div>
  )
}
