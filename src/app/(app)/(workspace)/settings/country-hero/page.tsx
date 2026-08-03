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
  focalToObjectPosition,
  type HeroImageInput,
  type CityImageInput,
  type SnapshotMapConfig,
} from '@/lib/country-visuals/schema'
import { DEFAULT_COUNTRY_PAGE_LAYOUT } from '@/lib/country-page/default-layout'

type EngineTab = 'hero' | 'layout' | 'snapshot' | 'city' | 'content'
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
  flagCode: 'MX',
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
  focalPoint: { x: 50, y: 50 },
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

// Saves an approved generated image to Neon so the country page serves it from
// /api/country-asset without a redeploy.
function SaveToSiteButton({ payload }: { payload: Record<string, unknown> }) {
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState(false)
  async function save() {
    setSaving(true); setMsg(''); setOk(false)
    try {
      const res = await fetch('/api/admin/country-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(body.error || 'Save failed.')
      setOk(true); setMsg('Saved — live on the country page.')
    } catch (caught) {
      setMsg(caught instanceof Error ? caught.message : 'Save failed.')
    } finally {
      setSaving(false)
    }
  }
  return (
    <span className="inline-flex items-center gap-2">
      <button type="button" onClick={save} disabled={saving} className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60">
        {saving ? 'Saving…' : 'Save to site'}
      </button>
      {msg && <span className={`text-xs font-medium ${ok ? 'text-emerald-700' : 'text-red-700'}`}>{msg}</span>}
    </span>
  )
}

// Read a picked file as a base64 data URL, rejecting anything over the cap
// (base64 inflates ~33%, and the bytes travel in a JSON/DB request body).
function readFileAsDataUrl(file: File, maxBytes = 6_000_000): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > maxBytes) {
      reject(new Error(`Image is too large (max ${Math.round(maxBytes / 1_000_000)} MB).`))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.readAsDataURL(file)
  })
}

// A file picker that hands back a base64 data URL and previews the selection.
function UploadImageField({ label, help, value, onChange }: { label: string; help?: string; value: string; onChange: (dataUrl: string) => void }) {
  const [err, setErr] = useState('')
  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setErr('')
    try {
      onChange(await readFileAsDataUrl(file))
    } catch (caught) {
      setErr(caught instanceof Error ? caught.message : 'Upload failed.')
      onChange('')
    }
  }
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-neutral-800">{label}</span>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={pick}
        className="block w-full text-sm text-neutral-700 file:mr-3 file:rounded-full file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-neutral-800"
      />
      {help && <span className="mt-1 block text-xs text-neutral-500">{help}</span>}
      {err && <span className="mt-1 block text-xs font-medium text-red-700">{err}</span>}
      {value && <img src={value} alt="Upload preview" className="mt-3 max-h-44 w-full rounded-xl border border-neutral-200 object-contain" />}
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
  // Optional style-reference image fed to the AI so its output matches an
  // approved hero's look, and a separate finished-art upload saved as-is.
  const [styleRef, setStyleRef] = useState('')
  const [uploadArt, setUploadArt] = useState('')

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
        body: JSON.stringify({ assetType: 'hero', ...parsed.data, ...(styleRef ? { styleReferenceDataUrl: styleRef } : {}) }),
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
    <>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-neutral-950">Hero Image</h2>
        <p className="text-sm font-semibold text-neutral-500">National Flag Shadow Hero (Standard)</p>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">
          The official flag as full-bleed woven fabric with the country&rsquo;s silhouette as a translucent shadow that inherits the flag colors. The emblem stays in its official position. Mexico is the reference — every country uses its own flag, emblem, and outline.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.95fr)]">
      <form onSubmit={submit} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setForm(MEXICO_SHADOW_STANDARD)}
            className="rounded-full border border-neutral-300 bg-neutral-50 px-3.5 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-100"
          >
            Load preset · National Flag Shadow Hero (Mexico reference)
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Country">
            <input className={inputClass} value={form.countryName} onChange={(e) => { const v = e.target.value; setForm((f) => ({ ...f, countryName: v, countrySlug: toSlug(v) })) }} required />
          </Field>
          <Field label="Country slug">
            <input className={inputClass} value={form.countrySlug} onChange={(e) => set('countrySlug', e.target.value)} required />
          </Field>
          <Field label="Flag code (ISO-2)" wide help="e.g. PT, MX, ES. Feeds the country's real flag to the AI so it isn't reinvented. Leave blank to use the text prompt only.">
            <input className={inputClass} value={form.flagCode ?? ''} maxLength={2} placeholder="PT" onChange={(e) => set('flagCode', e.target.value.toUpperCase() || undefined)} />
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
          <Field label={`Focal point X ${form.focalPoint.x}%`} help="Horizontal object-position when the hero is cropped.">
            <input type="range" min={0} max={100} value={form.focalPoint.x} onChange={(e) => set('focalPoint', { ...form.focalPoint, x: Number(e.target.value) })} className="w-full" />
          </Field>
          <Field label={`Focal point Y ${form.focalPoint.y}%`}>
            <input type="range" min={0} max={100} value={form.focalPoint.y} onChange={(e) => set('focalPoint', { ...form.focalPoint, y: Number(e.target.value) })} className="w-full" />
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

        <div className="mt-6 border-t border-neutral-200 pt-6">
          <UploadImageField
            label="Style reference (optional)"
            help="With a flag code set, the built-in National Flag Shadow Hero standard is applied automatically. Upload here only to override it with a different approved hero — the AI keeps this country's real flag and matches the reference's fabric, shadow, and silhouette treatment. With no flag code and no reference, it uses the written prompt only."
            value={styleRef}
            onChange={setStyleRef}
          />
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
                <img src={generated.imageDataUrl} alt="Generated hero" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: focalToObjectPosition(form.focalPoint) }} />
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
            <div className="flex flex-wrap items-center gap-2">
              <a href={generated.imageDataUrl} download={generated.filename} className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100">Download WebP</a>
              <SaveToSiteButton payload={{ assetType: 'hero', countrySlug: form.countrySlug, imageDataUrl: generated.imageDataUrl }} />
            </div>
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

      <section className="mt-8 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
        <h3 className="text-lg font-semibold text-neutral-950">Use your own finished art</h3>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">
          Already have the exact hero image? Skip generation — upload it here and it saves to <code>{form.countrySlug || 'country'}</code> pixel-for-pixel. Uses the same <b>Country</b>/<b>Country slug</b> above.
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
          <UploadImageField
            label="Hero image file"
            help="PNG, JPEG, or WebP up to 6 MB. Wide format (about 3:1) reads best."
            value={uploadArt}
            onChange={setUploadArt}
          />
          <div className="flex flex-col items-start justify-end gap-3">
            {uploadArt
              ? <SaveToSiteButton payload={{ assetType: 'hero', countrySlug: form.countrySlug, imageDataUrl: uploadArt }} />
              : <p className="text-sm text-neutral-500">Choose a file to enable saving.</p>}
          </div>
        </div>
      </section>
    </>
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
  const [uploadArt, setUploadArt] = useState('')

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
    <>
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
            <div className="flex flex-wrap items-center gap-2">
              <a href={generated.imageDataUrl} download={generated.filename} className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100">Download</a>
              <SaveToSiteButton payload={{ assetType: 'city', countrySlug: form.countrySlug, citySlug: form.citySlug, imageDataUrl: generated.imageDataUrl }} />
            </div>
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

    <section className="mt-8 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
      <h3 className="text-lg font-semibold text-neutral-950">Use your own city photo</h3>
      <p className="mt-1 max-w-2xl text-sm text-neutral-500">
        Already have the photo? Upload it here and it saves to <code>{form.countrySlug || 'country'}</code> / <code>{form.citySlug || 'city'}</code> as-is. Uses the <b>Country slug</b> and <b>City slug</b> above.
      </p>
      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        <UploadImageField
          label="City image file"
          help="PNG, JPEG, or WebP up to 6 MB. Square (1:1) reads best on the card."
          value={uploadArt}
          onChange={setUploadArt}
        />
        <div className="flex flex-col items-start justify-end gap-3">
          {uploadArt
            ? <SaveToSiteButton payload={{ assetType: 'city', countrySlug: form.countrySlug, citySlug: form.citySlug, imageDataUrl: uploadArt }} />
            : <p className="text-sm text-neutral-500">Choose a file to enable saving.</p>}
        </div>
      </div>
    </section>
    </>
  )
}

// ===========================================================================
// Page Layout tab (Kolmari Country Page Standard — read-only reference + preview)
// ===========================================================================
function PageLayoutTab() {
  const [device, setDevice] = useState<Device>('desktop')
  const cfg = DEFAULT_COUNTRY_PAGE_LAYOUT
  return (
    <>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-neutral-950">Page Layout</h2>
        <p className="text-sm font-semibold text-neutral-500">Kolmari Country Page Standard</p>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">
          One shared layout for every country (reference implementation: Portugal). Foundational spacing and structure are fixed; only limited, explicit fields are overridable.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
        <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-neutral-950">Responsive skeleton</h3>
            <DeviceTabs device={device} onChange={setDevice} />
          </div>
          <div className="flex justify-center overflow-x-auto rounded-2xl bg-neutral-200/60 p-4">
            <div style={{ width: DEVICE_WIDTH[device], maxWidth: '100%' }} className="shrink-0 space-y-2">
              {/* hero + metric strip */}
              <div className="overflow-hidden rounded-lg border border-neutral-300">
                <div className="relative bg-gradient-to-br from-[#122a52] to-[#1b3f68]" style={{ height: device === 'mobile' ? 150 : 110 }}>
                  <div className="absolute bottom-2 left-3 h-4 w-24 rounded bg-white/80" />
                </div>
                <div className={`grid ${device === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'} divide-x divide-white/10 bg-[#0f2247]`}>
                  {cfg.hero.metrics.map((m) => (
                    <div key={m.id} className="p-2"><div className="h-2 w-10 rounded bg-white/40" /><div className="mt-1 h-3 w-12 rounded bg-white/70" /></div>
                  ))}
                </div>
              </div>
              {/* tabs */}
              <div className="flex gap-1.5 overflow-hidden rounded-lg border border-neutral-300 bg-white p-1.5">
                {cfg.tabs.slice(0, device === 'mobile' ? 4 : 8).map((t) => <div key={t.id} className="h-4 flex-1 rounded bg-neutral-200" />)}
              </div>
              {/* main + sidebar */}
              <div className={`grid gap-2 ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-[3fr_0.9fr]'}`}>
                <div className="space-y-2">
                  <div className="h-16 rounded-lg border border-neutral-300 bg-white" />
                  <div className="h-24 rounded-lg border border-neutral-300 bg-white" />
                  <div className={`grid gap-2 ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-4'}`}>
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 rounded-lg border border-neutral-300 bg-white" />)}
                  </div>
                </div>
                <div className="h-40 rounded-lg border border-neutral-300 bg-white" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-neutral-500">Order: hero → tabs → Personalized Summary + Match Score → Country Snapshot + Recommended Actions → Top Cities → remaining sections.</p>
        </section>
        <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 sm:p-7">
          <p className="mb-2 text-sm font-medium text-neutral-900">CountryPageLayoutConfig (default)</p>
          <pre className="max-h-[520px] overflow-auto rounded-xl border border-neutral-200 bg-white p-4 text-xs leading-5 text-neutral-700">{JSON.stringify(cfg, null, 2)}</pre>
        </section>
      </div>
    </>
  )
}

// ===========================================================================
// Country Content tab (structured content reference)
// ===========================================================================
function CountryContentTab() {
  const groups: Array<{ title: string; fields: string[] }> = [
    { title: 'Hero', fields: ['regionEyebrow', 'countryName', 'introduction', 'statusIndicators[]', 'heroMetrics[4]'] },
    { title: 'Personalized Summary', fields: ['summary', 'explanation', 'overallFit', 'blockingIssue', 'outcome', 'callouts[]', 'rank', 'categoryScores[]'] },
    { title: 'Country Snapshot', fields: ['snapshotEyebrow', 'summaryParagraphs[]', 'honestTradeoff', 'facts[]', 'mapCaption', 'climate{winter,summer,timeDiff}'] },
    { title: 'Top Cities', fields: ['cities[]{name,description,badges,imageSrc,metrics,editorialNote}'] },
    { title: 'Sidebar', fields: ['matchScore', 'comparisonTarget', 'recommendedFirstActions[]'] },
  ]
  return (
    <>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-neutral-950">Country Content</h2>
        <p className="text-sm font-semibold text-neutral-500">Structured content model</p>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">
          The shared content structure every country page reads from. Classify each value as verified data, user-calculated, editorial, or unavailable — never silently convert editorial estimates into verified facts, and never fabricate.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <div key={g.title} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-950">{g.title}</h3>
            <ul className="mt-2 space-y-1">
              {g.fields.map((f) => <li key={f} className="text-xs text-neutral-600"><code className="rounded bg-neutral-100 px-1 py-0.5">{f}</code></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Data classification is required: <b>verified</b> · <b>user-calculated</b> · <b>editorial</b> · <b>unavailable</b>. Unavailable data renders an honest empty state, not a fabricated value.
      </div>
    </>
  )
}

// ===========================================================================
// Page shell
// ===========================================================================
export default function CountryPageGeneratorEnginePage() {
  const [tab, setTab] = useState<EngineTab>('hero')
  const tabs: Array<{ id: EngineTab; label: string }> = [
    { id: 'hero', label: 'Hero Image' },
    { id: 'layout', label: 'Page Layout' },
    { id: 'snapshot', label: 'Snapshot Map' },
    { id: 'city', label: 'City Images' },
    { id: 'content', label: 'Country Content' },
  ]

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 max-w-3xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Kolmari design tools</p>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">Country Page Generator Engine</h1>
        <p className="mt-3 text-base leading-7 text-neutral-600">
          The Country Design System control panel — hero artwork (National Flag Shadow Hero), the Kolmari Country Page Standard layout, the Mapbox snapshot locator, city photography, and country content. Review and download before committing to <code>/public</code>. Nothing publishes automatically.
        </p>
      </div>

      <div className="mb-6 inline-flex flex-wrap rounded-2xl border border-neutral-200 bg-white p-1 text-sm font-semibold shadow-sm">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-4 py-2 transition ${tab === t.id ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-900'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'hero' && <HeroTab />}
      {tab === 'layout' && <PageLayoutTab />}
      {tab === 'snapshot' && <SnapshotTab />}
      {tab === 'city' && <CityTab />}
      {tab === 'content' && <CountryContentTab />}
    </main>
  )
}
