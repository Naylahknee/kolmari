'use client'

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState, type FormEvent } from 'react'
import { CountrySnapshotMap } from '@/components/country-workspace/CountrySnapshotMap'
import {
  heroImageInputSchema,
  dashboardDestinationImageInputSchema,
  cityImageInputSchema,
  snapshotMapConfigSchema,
  CITY_IMAGE_TYPES,
  focalToObjectPosition,
  type HeroImageInput,
  type DashboardDestinationImageInput,
  type CityImageInput,
  type SnapshotMapConfig,
} from '@/lib/country-visuals/schema'
import { DEFAULT_COUNTRY_PAGE_LAYOUT } from '@/lib/country-page/default-layout'

type EngineTab = 'hero' | 'layout' | 'snapshot' | 'city' | 'dashboard' | 'content'
type Device = 'desktop' | 'tablet' | 'mobile'
type GeneratedImage = {
  imageDataUrl: string
  filename: string
  prompt: string
  model: string
  assetType: 'hero' | 'city' | 'dashboard_destination'
}

const HERO_REFERENCE: HeroImageInput = {
  countryName: 'Mexico',
  countrySlug: 'mexico',
  flagCode: 'MX',
  protectedSymbolDescription: 'the national coat of arms exactly as it appears on the official flag',
  protectedSymbolPosition: 'its official position on the flag',
  safeZonePercent: 15,
  geographicRequirements: 'the complete mainland plus relevant peninsulas and islands',
  silhouetteScale: 'large enough to read clearly while protecting the emblem',
  silhouettePosition: 'centered across the flag, nudged away from the emblem',
  shadowOpacity: 22,
  shadowDepth: 'gentle embossed relief with soft edge definition',
  flagTextureIntensity: 'subtle matte woven fabric with soft folds',
  focalPoint: { x: 50, y: 50 },
  quality: 'high',
}

const DASHBOARD_REFERENCE: DashboardDestinationImageInput = {
  countryName: 'Portugal',
  countrySlug: 'portugal',
  flagCode: 'PT',
  protectedSymbolDescription: 'the national coat of arms exactly as it appears on the official flag',
  protectedSymbolPosition: 'its official position on the flag',
  safeZonePercent: 15,
  compositionGuidance: 'simple flag-led composition with strong national recognition at small card size',
  cropSafeZone: 70,
  focalPoint: { x: 50, y: 50 },
  quality: 'high',
}

const EMPTY_CITY: CityImageInput = {
  countryName: 'Portugal',
  countrySlug: 'portugal',
  cityName: 'Lisbon',
  citySlug: 'lisbon',
  imageType: 'streetscape',
  settingDescription: 'an authentic Lisbon streetscape in natural daylight',
  landmarkGuidance: '',
  exclusions: '',
  quality: 'medium',
}

const DEFAULT_SNAPSHOT: SnapshotMapConfig = {
  countrySlug: 'portugal',
  countryName: 'Portugal',
  countryCode: 'PT',
  centerLat: 39.5,
  centerLng: -8,
  zoom: 5.2,
  capitalName: 'Lisbon',
  capitalLat: 38.7223,
  capitalLng: -9.1393,
  showCapitalMarker: true,
  mapStyle: 'mapbox/light-v11',
}

const DEVICE_WIDTH: Record<Device, number> = { desktop: 1024, tablet: 768, mobile: 390 }
const toSlug = (value: string) => value.toLowerCase().normalize('NFKD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const inputClass = 'w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-950 outline-none transition focus:border-neutral-700 focus:ring-2 focus:ring-neutral-200'

function Field({ label, help, wide, children }: { label: string; help?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={wide ? 'sm:col-span-2' : ''}>
      <span className="mb-1.5 block text-sm font-medium text-neutral-800">{label}</span>
      {children}
      {help ? <span className="mt-1 block text-xs text-neutral-500">{help}</span> : null}
    </label>
  )
}

function DeviceTabs({ device, onChange }: { device: Device; onChange: (device: Device) => void }) {
  return (
    <div className="inline-flex rounded-full border border-neutral-300 bg-white p-1 text-xs font-semibold">
      {(['desktop', 'tablet', 'mobile'] as Device[]).map((item) => (
        <button key={item} type="button" onClick={() => onChange(item)} className={`rounded-full px-3 py-1.5 capitalize ${device === item ? 'bg-neutral-950 text-white' : 'text-neutral-600'}`}>
          {item}
        </button>
      ))}
    </div>
  )
}

function SaveToSiteButton({ payload }: { payload: Record<string, unknown> }) {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  async function save() {
    setSaving(true); setMessage('')
    try {
      const res = await fetch('/api/admin/country-asset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(body.error || 'Save failed.')
      setMessage('Approved asset saved.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Save failed.')
    } finally {
      setSaving(false)
    }
  }
  return (
    <span className="inline-flex items-center gap-2">
      <button type="button" onClick={save} disabled={saving} className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save approved image'}</button>
      {message ? <span className="text-xs text-neutral-600">{message}</span> : null}
    </span>
  )
}

function GeneratedPreview({ generated, filename, payload, focalPoint, aspect = '3 / 2' }: {
  generated: GeneratedImage | null
  filename: string
  payload: Record<string, unknown>
  focalPoint?: { x: number; y: number }
  aspect?: string
}) {
  if (!generated) return <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 text-sm text-neutral-500">Generate one image to preview it here.</div>
  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100" style={{ aspectRatio: aspect }}>
        <img src={generated.imageDataUrl} alt="Generated preview" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: focalToObjectPosition(focalPoint) }} />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <code className="text-xs text-neutral-600">{filename}</code>
        <div className="flex flex-wrap gap-2">
          <a href={generated.imageDataUrl} download={filename} className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium">Download WebP</a>
          <SaveToSiteButton payload={{ ...payload, imageDataUrl: generated.imageDataUrl }} />
        </div>
      </div>
      <details className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-medium">View generated prompt</summary>
        <pre className="mt-3 whitespace-pre-wrap text-xs leading-5 text-neutral-600">{generated.prompt}</pre>
      </details>
    </div>
  )
}

function HeroTab() {
  const [form, setForm] = useState<HeroImageInput>(HERO_REFERENCE)
  const [generated, setGenerated] = useState<GeneratedImage | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: FormEvent) {
    event.preventDefault(); setError('')
    const parsed = heroImageInputSchema.safeParse(form)
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? 'Check the fields.')
    setLoading(true); setGenerated(null)
    try {
      const res = await fetch('/api/admin/country-hero', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assetType: 'hero', ...parsed.data }) })
      const body = (await res.json()) as GeneratedImage & { error?: string }
      if (!res.ok) throw new Error(body.error || 'Generation failed.')
      setGenerated(body)
    } catch (err) { setError(err instanceof Error ? err.message : 'Generation failed.') } finally { setLoading(false) }
  }
  return (
    <GeneratorShell title="Hero Image" subtitle="National Flag Shadow Hero · Reference example: Mexico">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Country"><input className={inputClass} value={form.countryName} onChange={(e) => setForm({ ...form, countryName: e.target.value, countrySlug: toSlug(e.target.value) })} /></Field>
        <Field label="Country slug"><input className={inputClass} value={form.countrySlug} onChange={(e) => setForm({ ...form, countrySlug: e.target.value })} /></Field>
        <Field label="Flag code"><input className={inputClass} value={form.flagCode ?? ''} maxLength={2} onChange={(e) => setForm({ ...form, flagCode: e.target.value.toUpperCase() || undefined })} /></Field>
        <Field label="Quality"><select className={inputClass} value={form.quality} onChange={(e) => setForm({ ...form, quality: e.target.value as HeroImageInput['quality'] })}><option>low</option><option>medium</option><option>high</option></select></Field>
        <Field label="Protected symbol" wide><input className={inputClass} value={form.protectedSymbolDescription} onChange={(e) => setForm({ ...form, protectedSymbolDescription: e.target.value })} /></Field>
        <Field label="Official symbol position" wide><input className={inputClass} value={form.protectedSymbolPosition} onChange={(e) => setForm({ ...form, protectedSymbolPosition: e.target.value })} /></Field>
        <Field label="Geographic requirements" wide><input className={inputClass} value={form.geographicRequirements} onChange={(e) => setForm({ ...form, geographicRequirements: e.target.value })} /></Field>
        {error ? <p className="sm:col-span-2 text-sm text-red-700">{error}</p> : null}
        <button disabled={loading} className="sm:col-span-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{loading ? 'Generating…' : 'Generate hero image'}</button>
      </form>
      <GeneratedPreview generated={generated} filename={`${form.countrySlug}-hero.webp`} payload={{ assetType: 'hero', countrySlug: form.countrySlug }} focalPoint={form.focalPoint} />
    </GeneratorShell>
  )
}

function DashboardImageTab() {
  const [form, setForm] = useState<DashboardDestinationImageInput>(DASHBOARD_REFERENCE)
  const [generated, setGenerated] = useState<GeneratedImage | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [device, setDevice] = useState<Device>('desktop')
  async function submit(event: FormEvent) {
    event.preventDefault(); setError('')
    const parsed = dashboardDestinationImageInputSchema.safeParse(form)
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? 'Check the fields.')
    setLoading(true); setGenerated(null)
    try {
      const res = await fetch('/api/admin/country-hero', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assetType: 'dashboard_destination', ...parsed.data }) })
      const body = (await res.json()) as GeneratedImage & { error?: string }
      if (!res.ok) throw new Error(body.error || 'Generation failed.')
      setGenerated(body)
    } catch (err) { setError(err instanceof Error ? err.message : 'Generation failed.') } finally { setLoading(false) }
  }
  const cardWidth = device === 'desktop' ? 340 : device === 'tablet' ? 300 : 358
  return (
    <GeneratorShell title="Dashboard Destination Images" subtitle="Dedicated matched-country card artwork · 1536×1024 master · central 70% crop-safe zone">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Country"><input className={inputClass} value={form.countryName} onChange={(e) => setForm({ ...form, countryName: e.target.value, countrySlug: toSlug(e.target.value) })} /></Field>
        <Field label="Country slug"><input className={inputClass} value={form.countrySlug} onChange={(e) => setForm({ ...form, countrySlug: e.target.value })} /></Field>
        <Field label="Flag code"><input className={inputClass} value={form.flagCode ?? ''} maxLength={2} onChange={(e) => setForm({ ...form, flagCode: e.target.value.toUpperCase() || undefined })} /></Field>
        <Field label="Crop-safe zone %"><input type="number" min={50} max={90} className={inputClass} value={form.cropSafeZone} onChange={(e) => setForm({ ...form, cropSafeZone: Number(e.target.value) })} /></Field>
        <Field label="Protected symbol" wide><input className={inputClass} value={form.protectedSymbolDescription} onChange={(e) => setForm({ ...form, protectedSymbolDescription: e.target.value })} /></Field>
        <Field label="Official symbol position" wide><input className={inputClass} value={form.protectedSymbolPosition} onChange={(e) => setForm({ ...form, protectedSymbolPosition: e.target.value })} /></Field>
        <Field label="Composition guidance" wide><input className={inputClass} value={form.compositionGuidance} onChange={(e) => setForm({ ...form, compositionGuidance: e.target.value })} /></Field>
        {error ? <p className="sm:col-span-2 text-sm text-red-700">{error}</p> : null}
        <button disabled={loading} className="sm:col-span-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{loading ? 'Generating…' : 'Generate Dashboard destination image'}</button>
      </form>
      <section>
        <div className="mb-3 flex items-center justify-between gap-3"><p className="text-sm font-semibold">Dashboard crop preview</p><DeviceTabs device={device} onChange={setDevice} /></div>
        <div className="flex justify-center rounded-2xl bg-neutral-100 p-4">
          <div className="relative h-[190px] max-w-full overflow-hidden rounded-2xl bg-[#0d1b39]" style={{ width: cardWidth }}>
            {generated ? <img src={generated.imageDataUrl} alt="Dashboard crop preview" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: focalToObjectPosition(form.focalPoint) }} /> : null}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(13,27,57,.55),rgba(13,27,57,.82))]" />
            <div className="absolute inset-0 flex flex-col justify-between p-4 text-white"><b>#1</b><b className="text-xl">{form.countryName.toUpperCase()}</b></div>
          </div>
        </div>
        <div className="mt-4">
          <GeneratedPreview generated={generated} filename={`${form.countrySlug}-dashboard-destination.webp`} payload={{ assetType: 'dashboard_destination', countrySlug: form.countrySlug }} focalPoint={form.focalPoint} />
        </div>
      </section>
    </GeneratorShell>
  )
}

function CityTab() {
  const [form, setForm] = useState<CityImageInput>(EMPTY_CITY)
  const [generated, setGenerated] = useState<GeneratedImage | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: FormEvent) {
    event.preventDefault(); setError('')
    const parsed = cityImageInputSchema.safeParse(form)
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? 'Check the fields.')
    setLoading(true); setGenerated(null)
    try {
      const res = await fetch('/api/admin/country-hero', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assetType: 'city', ...parsed.data }) })
      const body = (await res.json()) as GeneratedImage & { error?: string }
      if (!res.ok) throw new Error(body.error || 'Generation failed.')
      setGenerated(body)
    } catch (err) { setError(err instanceof Error ? err.message : 'Generation failed.') } finally { setLoading(false) }
  }
  return (
    <GeneratorShell title="City Images" subtitle="City-specific editorial photography; never reused as Dashboard or hero artwork">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Country"><input className={inputClass} value={form.countryName} onChange={(e) => setForm({ ...form, countryName: e.target.value, countrySlug: toSlug(e.target.value) })} /></Field>
        <Field label="City"><input className={inputClass} value={form.cityName} onChange={(e) => setForm({ ...form, cityName: e.target.value, citySlug: toSlug(e.target.value) })} /></Field>
        <Field label="Image type"><select className={inputClass} value={form.imageType} onChange={(e) => setForm({ ...form, imageType: e.target.value as CityImageInput['imageType'] })}>{CITY_IMAGE_TYPES.map((item) => <option key={item}>{item}</option>)}</select></Field>
        <Field label="Quality"><select className={inputClass} value={form.quality} onChange={(e) => setForm({ ...form, quality: e.target.value as CityImageInput['quality'] })}><option>low</option><option>medium</option><option>high</option></select></Field>
        <Field label="Setting description" wide><input className={inputClass} value={form.settingDescription} onChange={(e) => setForm({ ...form, settingDescription: e.target.value })} /></Field>
        <Field label="Landmark guidance" wide><input className={inputClass} value={form.landmarkGuidance} onChange={(e) => setForm({ ...form, landmarkGuidance: e.target.value })} /></Field>
        {error ? <p className="sm:col-span-2 text-sm text-red-700">{error}</p> : null}
        <button disabled={loading} className="sm:col-span-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{loading ? 'Generating…' : 'Generate city image'}</button>
      </form>
      <GeneratedPreview generated={generated} filename={`${form.citySlug}.webp`} payload={{ assetType: 'city', countrySlug: form.countrySlug, citySlug: form.citySlug }} />
    </GeneratorShell>
  )
}

function GeneratorShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const parts = Array.isArray(children) ? children : [children]
  return (
    <>
      <div className="mb-5"><h2 className="text-xl font-semibold text-neutral-950">{title}</h2><p className="mt-1 text-sm text-neutral-500">{subtitle}</p></div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,.9fr)]">
        <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">{parts[0]}</section>
        <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 sm:p-7">{parts[1]}</section>
      </div>
    </>
  )
}

function SnapshotTab() {
  const [cfg, setCfg] = useState<SnapshotMapConfig>(DEFAULT_SNAPSHOT)
  const [device, setDevice] = useState<Device>('desktop')
  const record = useMemo(() => ({ countrySlug: cfg.countrySlug, snapshotMap: { center: [cfg.centerLng, cfg.centerLat], zoom: cfg.zoom, capital: cfg.showCapitalMarker && cfg.capitalName && cfg.capitalLat != null && cfg.capitalLng != null ? { name: cfg.capitalName, lat: cfg.capitalLat, lng: cfg.capitalLng } : undefined } }), [cfg])
  const valid = snapshotMapConfigSchema.safeParse(cfg).success
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,.9fr)]">
      <section className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-7">
        <h2 className="text-xl font-semibold">Snapshot Map</h2><p className="mt-1 text-sm text-neutral-500">Mapbox configuration only. Never AI-generated.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Country"><input className={inputClass} value={cfg.countryName} onChange={(e) => setCfg({ ...cfg, countryName: e.target.value, countrySlug: toSlug(e.target.value) })} /></Field>
          <Field label="Country code"><input className={inputClass} value={cfg.countryCode} onChange={(e) => setCfg({ ...cfg, countryCode: e.target.value.toUpperCase() })} /></Field>
          <Field label="Center latitude"><input type="number" className={inputClass} value={cfg.centerLat} onChange={(e) => setCfg({ ...cfg, centerLat: Number(e.target.value) })} /></Field>
          <Field label="Center longitude"><input type="number" className={inputClass} value={cfg.centerLng} onChange={(e) => setCfg({ ...cfg, centerLng: Number(e.target.value) })} /></Field>
          <Field label="Zoom"><input type="number" step="0.1" className={inputClass} value={cfg.zoom} onChange={(e) => setCfg({ ...cfg, zoom: Number(e.target.value) })} /></Field>
          <Field label="Capital"><input className={inputClass} value={cfg.capitalName} onChange={(e) => setCfg({ ...cfg, capitalName: e.target.value })} /></Field>
        </div>
        <pre className="mt-5 overflow-auto rounded-xl bg-neutral-50 p-4 text-xs">{JSON.stringify(record, null, 2)}</pre>
        <p className={`mt-2 text-xs ${valid ? 'text-emerald-700' : 'text-red-700'}`}>{valid ? 'Configuration valid.' : 'Configuration needs correction.'}</p>
      </section>
      <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 sm:p-7">
        <div className="mb-4 flex items-center justify-between"><b>Responsive locator preview</b><DeviceTabs device={device} onChange={setDevice} /></div>
        <div className="mx-auto overflow-hidden rounded-xl" style={{ width: DEVICE_WIDTH[device], maxWidth: '100%' }}>
          <CountrySnapshotMap countryName={cfg.countryName} countryCode={cfg.countryCode} cityName={cfg.capitalName || undefined} lat={cfg.capitalLat ?? cfg.centerLat} lng={cfg.capitalLng ?? cfg.centerLng} alt={`Locator map showing ${cfg.countryName}`} fallback="locator" />
        </div>
      </section>
    </div>
  )
}

function PageLayoutTab() {
  const [device, setDevice] = useState<Device>('desktop')
  const cfg = DEFAULT_COUNTRY_PAGE_LAYOUT
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,.9fr)]">
      <section className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-7">
        <div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold">Page Layout</h2><p className="text-sm text-neutral-500">Kolmari Country Page Standard · Reference implementation: Portugal</p></div><DeviceTabs device={device} onChange={setDevice} /></div>
        <div className="mt-5 space-y-2 rounded-2xl bg-neutral-100 p-4">
          <div className="h-32 rounded-xl bg-[#17305b]" />
          <div className="h-10 rounded-xl bg-white" />
          <div className={`grid gap-2 ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-[3fr_.9fr]'}`}><div className="h-40 rounded-xl bg-white" /><div className="h-40 rounded-xl bg-white" /></div>
          <div className="h-28 rounded-xl bg-white" />
        </div>
      </section>
      <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 sm:p-7"><b>CountryPageLayoutConfig</b><pre className="mt-3 max-h-[520px] overflow-auto rounded-xl bg-white p-4 text-xs">{JSON.stringify(cfg, null, 2)}</pre></section>
    </div>
  )
}

function CountryContentTab() {
  const groups = [
    ['Hero', 'regionEyebrow · introduction · statusIndicators · heroMetrics'],
    ['Personalized Summary', 'summary · explanation · overallFit · blockingIssue · outcome · callouts · rank · categoryScores'],
    ['Country Snapshot', 'summaryParagraphs · honestTradeoff · facts · mapCaption · climate'],
    ['Top Cities', 'name · description · badges · imageSrc · metrics · editorialNote'],
    ['Sidebar', 'matchScore · comparisonTarget · recommendedFirstActions'],
  ]
  return (
    <div><h2 className="text-xl font-semibold">Country Content</h2><p className="mt-1 text-sm text-neutral-500">Classify every value as verified, user-calculated, editorial, or unavailable.</p><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{groups.map(([title, fields]) => <div key={title} className="rounded-2xl border border-neutral-200 bg-white p-5"><b>{title}</b><p className="mt-2 text-xs leading-5 text-neutral-600">{fields}</p></div>)}</div></div>
  )
}

export default function CountryPageGeneratorEnginePage() {
  const [tab, setTab] = useState<EngineTab>('hero')
  const tabs: Array<{ id: EngineTab; label: string }> = [
    { id: 'hero', label: 'Hero Image' },
    { id: 'layout', label: 'Page Layout' },
    { id: 'snapshot', label: 'Snapshot Map' },
    { id: 'city', label: 'City Images' },
    { id: 'dashboard', label: 'Dashboard Destination Images' },
    { id: 'content', label: 'Country Content' },
  ]

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 max-w-3xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Kolmari design tools</p>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">Country Page Generator Engine</h1>
        <p className="mt-3 text-base leading-7 text-neutral-600">Country Design System controls for country-page artwork/layout, Mapbox snapshot configuration, city photography, Dashboard destination artwork, and structured country content. Image generation is admin-only and one image per request. Review before saving.</p>
      </div>

      <div className="mb-6 inline-flex flex-wrap rounded-2xl border border-neutral-200 bg-white p-1 text-sm font-semibold shadow-sm">
        {tabs.map((item) => <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`rounded-xl px-4 py-2 ${tab === item.id ? 'bg-neutral-950 text-white' : 'text-neutral-600'}`}>{item.label}</button>)}
      </div>

      {tab === 'hero' && <HeroTab />}
      {tab === 'layout' && <PageLayoutTab />}
      {tab === 'snapshot' && <SnapshotTab />}
      {tab === 'city' && <CityTab />}
      {tab === 'dashboard' && <DashboardImageTab />}
      {tab === 'content' && <CountryContentTab />}
    </main>
  )
}
