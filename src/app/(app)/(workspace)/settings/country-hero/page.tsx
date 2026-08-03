'use client'

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState, type FormEvent } from 'react'
import { CountrySnapshotMap } from '@/components/country-workspace/CountrySnapshotMap'
import {
  heroImageInputSchema,
  cityImageInputSchema,
  snapshotMapConfigSchema,
  CITY_IMAGE_TYPES,
  heroAssetPath,
  cityAssetPath,
  type HeroImageInput,
  type CityImageInput,
  type SnapshotMapConfig,
} from '@/lib/country-visuals/schema'

type EngineTab = 'hero' | 'snapshot' | 'city'
type Device = 'desktop' | 'tablet' | 'mobile'

type GeneratedImage = {
  imageDataUrl: string
  filename: string
  prompt: string
  model: string
  assetType: 'hero' | 'city'
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------
const MEXICO_SHADOW_STANDARD: HeroImageInput = {
  countryName: 'Mexico',
  countrySlug: 'mexico',
  protectedSymbolDescription:
    'the national coat of arms — a golden eagle perched on a prickly-pear cactus devouring a serpent, ringed by oak and laurel',
  protectedSymbolPosition: 'centered on the white middle band',
  safeZonePercent: 15,
  geographicRequirements: 'the full mainland plus the Baja California peninsula and the Yucatán Peninsula',
  silhouetteScale: 'large, spanning most of the flag width',
  silhouettePosition: 'spread across all three flag bands, kept clear of the central emblem',
  shadowOpacity: 22,
  shadowDepth: 'gentle embossed relief with soft edge definition',
  flagTextureIntensity: 'subtle matte woven fabric with soft diagonal folds',
  quality: 'high',
}

const EMPTY_CITY: CityImageInput = {
  countryName: 'Mexico',
  countrySlug: 'mexico',
  cityName: 'Mérida',
  citySlug: 'merida',
  imageType: 'streetscape',
  settingDescription: 'a colonial-era street in the historic center under warm afternoon light',
  landmarkGuidance: '',
  exclusions: '',
  quality: 'medium',
}

const DEFAULT_SNAPSHOT: SnapshotMapConfig = {
  countrySlug: 'mexico',
  countryName: 'Mexico',
  countryCode: 'MX',
  centerLat: 23.6,
  centerLng: -102.0,
  zoom: 3.8,
  capitalName: 'Mexico City',
  capitalLat: 19.4326,
  capitalLng: -99.1332,
  showCapitalMarker: true,
  mapStyle: 'mapbox/light-v11',
}

const DEVICE_WIDTH: Record<Device, number> = { desktop: 1024, tablet: 768, mobile: 390 }

// A slug helper so slugs stay in sync with the name as the admin types.
const toSlug = (v: string) =>
  v.toLowerCase().normalize('NFKD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// ---------------------------------------------------------------------------
// Small shared UI
// ---------------------------------------------------------------------------
function Field({ label, help, wide, children }: { label: string; help?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={wide ? 'sm:col-span-2' : ''}>
      <span className="mb-1.5 block text-sm font-medium text-neutral-800">{label}</span>
      {children}
      {help && <span className="mt-1 block text-xs text-neutral-500">{help}</span>}
    </label>
  )
}

const inputClass =
  'w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-950 outline-none transition focus:border-neutral-700 focus:ring-2 focus:ring-neutral-200'

function DeviceTabs({ device, onChange }: { device: Device; onChange: (d: Device) => void }) {
  return (
    <div className="inline-flex rounded-full border border-neutral-300 bg-white p-1 text-xs font-semibold">
      {(['desktop', 'tablet', 'mobile'] as Device[]).map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => onChange(d)}
          className={`rounded-full px-3 py-1.5 capitalize transition ${device === d ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-900'}`}
        >
          {d}
        </button>
      ))}
    </div>
  )
}

// ===========================================================================
// Hero tab
// ===========================================================================
function HeroTab() {
  const [form, setForm] = useState<HeroImageInput>(MEXICO_SHADOW_STANDARD)
  const [generated, setGenerated] = useState<GeneratedImage | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [device, setDevice] = useState<Device>('desktop')

  const set = <K extends keyof HeroImageInput>(k: K, v: HeroImageInput[K]) => setForm((f) => ({ ...f, [k]: v }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const parsed = heroImageInputSchema.safeParse(form)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please correct the hero fields.')
      return
    }
    setLoading(true)
    setGenerated(null)
    try {
      const res = await fetch('/api/admin/country-hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetType: 'hero', ...parsed.data }),
      })
      const body = (await res.json()) as GeneratedImage & { error?: string }
      if (!res.ok) throw new Error(body.error || 'Image generation failed.')
      setGenerated(body)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Image generation failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.95fr)]">
      <form onSubmit={submit} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setForm(MEXICO_SHADOW_STANDARD)}
            className="rounded-full border border-neutral-300 bg-neutral-50 px-3.5 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-100"
          >
            Load preset · Mexico Shadow Standard
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Country">
            <input className={inputClass} value={form.countryName} onChange={(e) => { const v = e.target.value; setForm((f) => ({ ...f, countryName: v, countrySlug: toSlug(v) })) }} required />
          </Field>
          <Field label="Country slug">
            <input className={inputClass} value={form.countrySlug} onChange={(e) => set('countrySlug', e.target.value)} required />
          </Field>
          <Field label="Protected national symbol" wide help="What must never be moved, covered, or recolored.">
            <input className={inputClass} value={form.protectedSymbolDescription} onChange={(e) => set('protectedSymbolDescription', e.target.value)} required />
          </Field>
          <Field label="Symbol position" wide>
            <input className={inputClass} value={form.protectedSymbolPosition} onChange={(e) => set('protectedSymbolPosition', e.target.value)} required />
          </Field>
          <Field label="Geographic requirements" wide help="Islands, peninsulas, or regions that must stay visible.">
            <input className={inputClass} value={form.geographicRequirements} onChange={(e) => set('geographicRequirements', e.target.value)} required />
          </Field>
          <Field label="Silhouette scale">
            <input className={inputClass} value={form.silhouetteScale} onChange={(e) => set('silhouetteScale', e.target.value)} />
          </Field>
          <Field label="Silhouette position">
            <input className={inputClass} value={form.silhouettePosition} onChange={(e) => set('silhouettePosition', e.target.value)} />
          </Field>
          <Field label="Shadow depth">
            <input className={inputClass} value={form.shadowDepth} onChange={(e) => set('shadowDepth', e.target.value)} />
          </Field>
          <Field label="Flag texture">
            <input className={inputClass} value={form.flagTextureIntensity} onChange={(e) => set('flagTextureIntensity', e.target.value)} />
          </Field>
          <Field label={`Safe zone ${form.safeZonePercent}%`} help="Clear space kept around the emblem.">
            <input type="range" min={5} max={40} value={form.safeZonePercent} onChange={(e) => set('safeZonePercent', Number(e.target.value))} className="w-full" />
          </Field>
          <Field label={`Shadow opacity ${form.shadowOpacity}%`}>
            <input type="range" min={5} max={60} value={form.shadowOpacity} onChange={(e) => set('shadowOpacity', Number(e.target.value))} className="w-full" />
          </Field>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-neutral-200 pt-6">
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-800">
            Quality
            <select value={form.quality} onChange={(e) => set('quality', e.target.value as HeroImageInput['quality'])} className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <span className="text-xs text-neutral-500">Output: 1536 × 1024 WebP · {heroAssetPath(form.countrySlug || 'country')}</span>
        </div>

        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

        <button type="submit" disabled={loading} className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? 'Generating hero…' : 'Generate hero image'}
        </button>
      </form>

      <section aria-live="polite" className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 sm:p-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-neutral-950">Responsive preview</h2>
            <p className="text-sm text-neutral-500">Behind left-aligned page content</p>
          </div>
          <DeviceTabs device={device} onChange={setDevice} />
        </div>

        <div className="flex justify-center overflow-x-auto rounded-2xl bg-neutral-200/60 p-4">
          <div style={{ width: DEVICE_WIDTH[device], maxWidth: '100%' }} className="shrink-0">
            <div className="relative overflow-hidden rounded-xl border border-neutral-300" style={{ aspectRatio: '3 / 1' }}>
              {generated ? (
                <img src={generated.imageDataUrl} alt="Generated hero" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#122a52] to-[#1b3f68]" />
              )}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(13,27,57,.72),rgba(13,27,57,.15) 60%,transparent)' }} />
              <div className="absolute inset-0 flex flex-col justify-center gap-2 px-5 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">{form.countryName || 'Country'}</p>
                <p className="text-2xl font-bold leading-none">{form.countryName || 'Country'}</p>
                <p className="max-w-[52%] text-[11px] leading-4 text-white/80">Sample overlay content sits here, so check the flag and silhouette stay readable behind text.</p>
              </div>
            </div>
          </div>
        </div>

        {generated && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <code className="rounded bg-white px-2 py-1 text-xs text-neutral-700">{generated.filename}</code>
            <a href={generated.imageDataUrl} download={generated.filename} className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100">
              Download WebP
            </a>
          </div>
        )}
        {generated && (
          <details className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-medium text-neutral-900">View generated prompt</summary>
            <pre className="mt-3 whitespace-pre-wrap text-xs leading-5 text-neutral-600">{generated.prompt}</pre>
          </details>
        )}
        {!generated && (
          <p className="mt-4 text-center text-sm text-neutral-500">
            {loading ? 'Composing the flag + silhouette. This can take a minute.' : 'Generate to preview across desktop, tablet, and mobile. Then download and commit to /public before it appears on the country page.'}
          </p>
        )}
      </section>
    </div>
  )
}

// ===========================================================================
// Snapshot Map tab (no AI — configures the existing Mapbox locator)
// ===========================================================================
function SnapshotTab() {
  const [cfg, setCfg] = useState<SnapshotMapConfig>(DEFAULT_SNAPSHOT)
  const [device, setDevice] = useState<Device>('desktop')
  const [saved, setSaved] = useState<string | null>(null)
  const [error, setError] = useState('')

  const set = <K extends keyof SnapshotMapConfig>(k: K, v: SnapshotMapConfig[K]) => { setCfg((c) => ({ ...c, [k]: v })); setSaved(null) }

  const record = useMemo(() => ({
    countrySlug: cfg.countrySlug,
    snapshotMap: {
      center: [cfg.centerLng, cfg.centerLat] as [number, number],
      zoom: cfg.zoom,
      capital: cfg.showCapitalMarker && cfg.capitalName && cfg.capitalLat != null && cfg.capitalLng != null
        ? { name: cfg.capitalName, lat: cfg.capitalLat, lng: cfg.capitalLng }
        : undefined,
    },
  }), [cfg])

  function save() {
    setError('')
    const parsed = snapshotMapConfigSchema.safeParse(cfg)
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Please correct the map fields.'); return }
    setSaved(JSON.stringify(record, null, 2))
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.95fr)]">
      <form onSubmit={(e) => { e.preventDefault(); save() }} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
        <p className="mb-5 rounded-xl bg-neutral-50 px-4 py-3 text-xs leading-5 text-neutral-600">
          The Country Snapshot is a real Mapbox locator — never AI-generated. Configure its camera + capital marker here; the preview uses the same component the country page renders (locator fallback until <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> is set).
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Country">
            <input className={inputClass} value={cfg.countryName} onChange={(e) => { const v = e.target.value; setCfg((c) => ({ ...c, countryName: v, countrySlug: toSlug(v) })); setSaved(null) }} />
          </Field>
          <Field label="Country slug"><input className={inputClass} value={cfg.countrySlug} onChange={(e) => set('countrySlug', e.target.value)} /></Field>
          <Field label="Country code (ISO-2)"><input className={inputClass} value={cfg.countryCode} maxLength={2} onChange={(e) => set('countryCode', e.target.value.toUpperCase())} /></Field>
          <Field label="Map style"><input className={inputClass} value={cfg.mapStyle} onChange={(e) => set('mapStyle', e.target.value)} /></Field>
          <Field label="Center latitude"><input type="number" step="0.0001" className={inputClass} value={cfg.centerLat} onChange={(e) => set('centerLat', Number(e.target.value))} /></Field>
          <Field label="Center longitude"><input type="number" step="0.0001" className={inputClass} value={cfg.centerLng} onChange={(e) => set('centerLng', Number(e.target.value))} /></Field>
          <Field label={`Zoom ${cfg.zoom}`} wide><input type="range" min={0} max={12} step={0.1} value={cfg.zoom} onChange={(e) => set('zoom', Number(e.target.value))} className="w-full" /></Field>
          <Field label="Capital name"><input className={inputClass} value={cfg.capitalName} onChange={(e) => set('capitalName', e.target.value)} /></Field>
          <Field label="Show capital marker">
            <label className="mt-1 flex items-center gap-2 text-sm text-neutral-800"><input type="checkbox" checked={cfg.showCapitalMarker} onChange={(e) => set('showCapitalMarker', e.target.checked)} className="h-4 w-4" /> Marker on</label>
          </Field>
          <Field label="Capital latitude"><input type="number" step="0.0001" className={inputClass} value={cfg.capitalLat ?? ''} onChange={(e) => set('capitalLat', e.target.value === '' ? undefined : Number(e.target.value))} /></Field>
          <Field label="Capital longitude"><input type="number" step="0.0001" className={inputClass} value={cfg.capitalLng ?? ''} onChange={(e) => set('capitalLng', e.target.value === '' ? undefined : Number(e.target.value))} /></Field>
        </div>
        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        <button type="submit" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800">Save configuration</button>
      </form>

      <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 sm:p-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-neutral-950">Live locator preview</h2>
          <DeviceTabs device={device} onChange={setDevice} />
        </div>
        <div className="flex justify-center overflow-x-auto rounded-2xl bg-neutral-200/60 p-4">
          <div style={{ width: DEVICE_WIDTH[device], maxWidth: '100%' }} className="shrink-0 overflow-hidden rounded-xl border border-neutral-300 bg-white">
            <CountrySnapshotMap
              key={`${cfg.centerLat},${cfg.centerLng},${cfg.countryCode}`}
              countryName={cfg.countryName || 'Country'}
              countryCode={cfg.countryCode}
              cityName={cfg.showCapitalMarker ? cfg.capitalName || undefined : undefined}
              lat={cfg.showCapitalMarker && cfg.capitalLat != null ? cfg.capitalLat : cfg.centerLat}
              lng={cfg.showCapitalMarker && cfg.capitalLng != null ? cfg.capitalLng : cfg.centerLng}
              alt={`Locator map showing ${cfg.countryName}`}
              fallback="locator"
            />
          </div>
        </div>
        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-neutral-900">CountryVisualAssets.snapshotMap</p>
          <pre className="max-h-64 overflow-auto rounded-xl border border-neutral-200 bg-white p-4 text-xs leading-5 text-neutral-700">{saved ?? JSON.stringify(record, null, 2)}</pre>
          {saved && <p className="mt-2 text-xs font-medium text-emerald-700">Configuration validated — copy into the country-visuals registry.</p>}
        </div>
      </section>
    </div>
  )
}

// ===========================================================================
// City Images tab
// ===========================================================================
function CityTab() {
  const [form, setForm] = useState<CityImageInput>(EMPTY_CITY)
  const [generated, setGenerated] = useState<GeneratedImage | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = <K extends keyof CityImageInput>(k: K, v: CityImageInput[K]) => setForm((f) => ({ ...f, [k]: v }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const parsed = cityImageInputSchema.safeParse(form)
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Please correct the city fields.'); return }
    setLoading(true)
    setGenerated(null)
    try {
      const res = await fetch('/api/admin/country-hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetType: 'city', ...parsed.data }),
      })
      const body = (await res.json()) as GeneratedImage & { error?: string }
      if (!res.ok) throw new Error(body.error || 'Image generation failed.')
      setGenerated(body)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Image generation failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.95fr)]">
      <form onSubmit={submit} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Country"><input className={inputClass} value={form.countryName} onChange={(e) => { const v = e.target.value; setForm((f) => ({ ...f, countryName: v, countrySlug: toSlug(v) })) }} required /></Field>
          <Field label="Country slug"><input className={inputClass} value={form.countrySlug} onChange={(e) => set('countrySlug', e.target.value)} required /></Field>
          <Field label="City"><input className={inputClass} value={form.cityName} onChange={(e) => { const v = e.target.value; setForm((f) => ({ ...f, cityName: v, citySlug: toSlug(v) })) }} required /></Field>
          <Field label="City slug"><input className={inputClass} value={form.citySlug} onChange={(e) => set('citySlug', e.target.value)} required /></Field>
          <Field label="Image type">
            <select className={inputClass} value={form.imageType} onChange={(e) => set('imageType', e.target.value as CityImageInput['imageType'])}>
              {CITY_IMAGE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Quality">
            <select className={inputClass} value={form.quality} onChange={(e) => set('quality', e.target.value as CityImageInput['quality'])}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </Field>
          <Field label="Setting description" wide help="What the scene should show — kept authentic to the city.">
            <input className={inputClass} value={form.settingDescription} onChange={(e) => set('settingDescription', e.target.value)} required />
          </Field>
          <Field label="Landmark guidance" wide help="Optional. Only real landmarks; never invented.">
            <input className={inputClass} value={form.landmarkGuidance} onChange={(e) => set('landmarkGuidance', e.target.value)} />
          </Field>
          <Field label="Extra exclusions" wide help="Optional. Anything else to keep out of the frame.">
            <input className={inputClass} value={form.exclusions} onChange={(e) => set('exclusions', e.target.value)} />
          </Field>
        </div>
        <p className="mt-5 text-xs text-neutral-500">Output: 1024 × 1024 WebP · {cityAssetPath(form.countrySlug || 'country', form.citySlug || 'city')}</p>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        <button type="submit" disabled={loading} className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? 'Generating city image…' : 'Generate city image'}
        </button>
      </form>

      <section aria-live="polite" className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 sm:p-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-neutral-950">Preview</h2>
          {generated && (
            <a href={generated.imageDataUrl} download={generated.filename} className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100">Download</a>
          )}
        </div>
        {generated ? (
          <>
            <img src={generated.imageDataUrl} alt={`${form.cityName} preview`} className="aspect-square w-full rounded-2xl border border-neutral-200 object-cover" />
            <p className="mt-3"><code className="rounded bg-white px-2 py-1 text-xs text-neutral-700">{generated.filename}</code></p>
            <details className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
              <summary className="cursor-pointer text-sm font-medium text-neutral-900">View generated prompt</summary>
              <pre className="mt-3 whitespace-pre-wrap text-xs leading-5 text-neutral-600">{generated.prompt}</pre>
            </details>
          </>
        ) : (
          <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white px-8 text-center text-sm leading-6 text-neutral-500">
            {loading ? 'Composing a realistic city photograph…' : 'Your generated city image will appear here. Download and commit to /public/images/countries/{slug}/cities/.'}
          </div>
        )}
      </section>
    </div>
  )
}

// ===========================================================================
// Page shell
// ===========================================================================
export default function CountryVisualAssetEnginePage() {
  const [tab, setTab] = useState<EngineTab>('hero')
  const tabs: Array<{ id: EngineTab; label: string }> = [
    { id: 'hero', label: 'Hero Image' },
    { id: 'snapshot', label: 'Snapshot Map' },
    { id: 'city', label: 'City Images' },
  ]

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 max-w-3xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Kolmari design tools</p>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">Country Visual Asset Engine</h1>
        <p className="mt-3 text-base leading-7 text-neutral-600">
          Generate and configure every country-page visual — the flag + silhouette hero, the Mapbox snapshot locator, and premium city photography — then review and download before committing to <code>/public</code>. Nothing publishes automatically.
        </p>
      </div>

      <div className="mb-6 inline-flex rounded-full border border-neutral-200 bg-white p-1 text-sm font-semibold shadow-sm">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 transition ${tab === t.id ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-900'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'hero' && <HeroTab />}
      {tab === 'snapshot' && <SnapshotTab />}
      {tab === 'city' && <CityTab />}
    </main>
  )
}
