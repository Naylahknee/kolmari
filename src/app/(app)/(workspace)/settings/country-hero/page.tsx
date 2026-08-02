'use client'

import { useState, type FormEvent } from 'react'

type GeneratedImage = {
  imageDataUrl: string
  filename: string
  prompt: string
  model: string
}

const initialForm = {
  cityName: 'Lisbon',
  countryName: 'Portugal',
  cityLocationDescription: 'on Portugal’s western coast near the Tagus River and Atlantic Ocean',
  flagSymbols: 'the national coat of arms and golden armillary sphere',
  flagSymbolLocation: 'at the boundary between the green and red fields',
  safeMapPosition: 'bottom-right corner within the red field',
  decorativeFlourish: 'minimal olive branch or azulejo-inspired line flourish',
  regionalStyle: 'elegant Portuguese and European editorial aesthetic',
  cityPinPosition: 'on the western coast, slightly below the vertical center of the country',
  includeLabels: true,
  quality: 'medium',
}

export default function CountryHeroGeneratorPage() {
  const [form, setForm] = useState(initialForm)
  const [generated, setGenerated] = useState<GeneratedImage | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setGenerated(null)

    try {
      const response = await fetch('/api/admin/country-hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const body = await response.json() as GeneratedImage & { error?: string }
      if (!response.ok) throw new Error(body.error || 'Image generation failed.')
      setGenerated(body)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Image generation failed.')
    } finally {
      setLoading(false)
    }
  }

  function updateField(name: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  function downloadImage() {
    if (!generated) return
    const link = document.createElement('a')
    link.href = generated.imageDataUrl
    link.download = generated.filename
    link.click()
  }

  const fields: Array<{ name: keyof typeof form; label: string; help?: string }> = [
    { name: 'cityName', label: 'City' },
    { name: 'countryName', label: 'Country' },
    { name: 'cityLocationDescription', label: 'City location description', help: 'Example: on the western coast near the Tagus River.' },
    { name: 'cityPinPosition', label: 'Pin position on the map' },
    { name: 'flagSymbols', label: 'Flag symbols that must remain visible' },
    { name: 'flagSymbolLocation', label: 'Where those symbols appear on the flag' },
    { name: 'safeMapPosition', label: 'Preferred safe map position' },
    { name: 'decorativeFlourish', label: 'Decorative flourish' },
    { name: 'regionalStyle', label: 'Regional visual style' },
  ]

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Kolmari design tools</p>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">Country flag + map generator</h1>
        <p className="mt-3 text-base leading-7 text-neutral-600">
          Enter the destination details once. Kolmari builds the approved design prompt and generates a reusable country-page hero image.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.name} className={field.name.includes('Description') || field.name.includes('Symbols') ? 'sm:col-span-2' : ''}>
                <span className="mb-2 block text-sm font-medium text-neutral-800">{field.label}</span>
                <input
                  value={String(form[field.name])}
                  onChange={(event) => updateField(field.name, event.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-base text-neutral-950 outline-none transition focus:border-neutral-700 focus:ring-2 focus:ring-neutral-200"
                  required
                />
                {field.help && <span className="mt-1.5 block text-sm text-neutral-500">{field.help}</span>}
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-neutral-200 pt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-800">
              <input
                type="checkbox"
                checked={form.includeLabels}
                onChange={(event) => updateField('includeLabels', event.target.checked)}
                className="h-4 w-4"
              />
              Include city and country labels
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-neutral-800">
              Quality
              <select
                value={form.quality}
                onChange={(event) => updateField('quality', event.target.value)}
                className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>

          {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Generating image…' : 'Generate country hero'}
          </button>
        </form>

        <section aria-live="polite" className="min-h-[420px] rounded-3xl border border-neutral-200 bg-neutral-50 p-5 sm:p-7">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-950">Preview</h2>
              <p className="text-sm text-neutral-500">Wide WebP · 1536 × 1024</p>
            </div>
            {generated && (
              <button type="button" onClick={downloadImage} className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100">
                Download
              </button>
            )}
          </div>

          {generated ? (
            <>
              {/* A generated data URL is intentionally rendered with img rather than next/image. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={generated.imageDataUrl} alt={`Generated ${form.cityName}, ${form.countryName} country hero`} className="aspect-[3/2] w-full rounded-2xl border border-neutral-200 object-cover" />
              <details className="mt-5 rounded-xl border border-neutral-200 bg-white p-4">
                <summary className="cursor-pointer text-sm font-medium text-neutral-900">View generated prompt</summary>
                <pre className="mt-3 whitespace-pre-wrap text-xs leading-5 text-neutral-600">{generated.prompt}</pre>
              </details>
            </>
          ) : (
            <div className="flex aspect-[3/2] items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white px-8 text-center text-sm leading-6 text-neutral-500">
              {loading ? 'The image model is composing the flag, map, and city marker. This can take a minute.' : 'Your generated country hero will appear here.'}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
