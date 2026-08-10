'use client'

/* eslint-disable @next/next/no-img-element */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { MapPin } from 'lucide-react'

import {
  SIGNS,
  chartFromBigThree,
  computeChart,
  type BigThreeInput,
  type Chart,
} from '@/lib/energy/astro'
import {
  ANCHOR_COPY,
  DOMAIN_COPY,
  scoreChart,
  type Domain,
  type ScoreResult,
} from '@/lib/energy/scoring'
import { MODECOPY, portalState, type ModeCopy, type PortalMode } from '@/lib/energy/portal-state'

import styles from './energy-portal.module.css'

type Screen = 'enter' | 'result' | 'ritual' | 'declaration' | 'upgrade'
const SCREEN_ORDER: Screen[] = ['enter', 'result', 'ritual', 'declaration', 'upgrade']

type InputMode = 'birth' | 'big3'

interface GeoFeature {
  center: [number, number]
  place_name: string
}

const CONCERNS: { key: string; label: string }[] = [
  { key: 'Health', label: 'Health / Energy' },
  { key: 'Wealth', label: 'Money / Wealth' },
  { key: 'Career', label: 'Career / Purpose' },
  { key: 'Relationships', label: 'Relationships' },
  { key: 'Growth', label: 'Personal Growth' },
  { key: 'Unknown', label: "I honestly don't know" },
]

interface RitualStep {
  num: number
  title: string
  theme: string
  ask: string
  placeholder: string
}

const CHIP_ORDER = [
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto',
  'NorthNode',
] as const

function tzOptions(): { value: number; label: string }[] {
  const opts: { value: number; label: string }[] = []
  for (let o = -12; o <= 14; o += 0.5) {
    const sign = o >= 0 ? '+' : '−'
    const abs = Math.abs(o)
    const hh = Math.floor(abs)
    const mm = abs % 1 ? '30' : '00'
    opts.push({ value: o, label: `UTC ${sign}${hh}:${mm}` })
  }
  return opts
}

function EnergyPortalInner(): React.JSX.Element {
  const searchParams = useSearchParams()

  const ps = useMemo(() => portalState(new Date()), [])
  const mode: PortalMode = useMemo(() => {
    const forced = searchParams.get('mode')
    if (forced === 'gate') return 'gate'
    if (forced === 'evergreen') return 'evergreen'
    return ps.mode
  }, [searchParams, ps.mode])

  const copy: ModeCopy = useMemo(() => MODECOPY({ ...ps, mode }), [ps, mode])
  const domainCopy = useMemo(() => DOMAIN_COPY(mode), [mode])

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  const [screen, setScreen] = useState<Screen>('enter')
  const [inputMode, setInputMode] = useState<InputMode>('birth')
  const [concern, setConcern] = useState<string | null>(null)

  const [bDate, setBDate] = useState('')
  const [bTime, setBTime] = useState('12:00')
  const [bTz, setBTz] = useState('-8')

  const [cityQuery, setCityQuery] = useState('')
  const [lat, setLat] = useState<number | null>(null)
  const [lon, setLon] = useState<number | null>(null)
  const [placeName, setPlaceName] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<GeoFeature[]>([])
  const [showList, setShowList] = useState(false)
  const [mapNote, setMapNote] = useState('')
  const geoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipNextGeo = useRef(false)

  const [big3, setBig3] = useState<Record<string, string>>({
    sun: '',
    moon: '',
    rising: '',
    mars: '',
    venus: '',
    jupiter: '',
    mc: '',
    h2: '',
    h6: '',
    h10: '',
    nn: '',
  })

  const [chart, setChart] = useState<Chart | null>(null)
  const [scores, setScores] = useState<ScoreResult | null>(null)

  const [enterErr, setEnterErr] = useState('')
  const [ritualErr, setRitualErr] = useState('')
  const enterErrTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const ritualErrTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [ritual, setRitual] = useState<string[]>(() => Array<string>(8).fill(''))
  const [declLines, setDeclLines] = useState<string[]>(() => Array<string>(5).fill(''))

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const tz = useMemo(() => tzOptions(), [])

  const go = useCallback((next: Screen): void => {
    setScreen(next)
    if (typeof window !== 'undefined') window.scrollTo(0, 0)
  }, [])

  const progressPct = (SCREEN_ORDER.indexOf(screen) / (SCREEN_ORDER.length - 1)) * 100

  const showEnterErr = useCallback((msg: string): void => {
    setEnterErr(msg)
    if (enterErrTimer.current) clearTimeout(enterErrTimer.current)
    enterErrTimer.current = setTimeout(() => setEnterErr(''), 6000)
  }, [])

  const showRitualErr = useCallback((msg: string): void => {
    setRitualErr(msg)
    if (ritualErrTimer.current) clearTimeout(ritualErrTimer.current)
    ritualErrTimer.current = setTimeout(() => setRitualErr(''), 6000)
  }, [])

  /* ---- Geocoding (debounced) ---- */
  useEffect(() => {
    if (!mapboxToken) return
    if (skipNextGeo.current) {
      skipNextGeo.current = false
      return
    }
    const q = cityQuery.trim()
    if (q.length < 3) {
      setShowList(false)
      return
    }
    if (geoTimer.current) clearTimeout(geoTimer.current)
    geoTimer.current = setTimeout(() => {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        q,
      )}.json?access_token=${mapboxToken}&types=place&limit=5`
      fetch(url)
        .then((res) => res.json())
        .then((data: { features?: GeoFeature[] }) => {
          if (!data.features || !data.features.length) {
            setShowList(false)
            return
          }
          setSuggestions(data.features)
          setShowList(true)
        })
        .catch(() => setShowList(false))
    }, 350)
    return () => {
      if (geoTimer.current) clearTimeout(geoTimer.current)
    }
  }, [cityQuery, mapboxToken])

  const pickPlace = useCallback((pLat: number, pLon: number, name: string): void => {
    setLat(pLat)
    setLon(pLon)
    setPlaceName(name)
    skipNextGeo.current = true
    setCityQuery(name)
    setShowList(false)
    const suggested = Math.round(pLon / 15)
    const clamped = Math.max(-12, Math.min(14, suggested))
    setBTz(String(clamped))
    setMapNote(
      `Suggested time zone from longitude: UTC ${suggested >= 0 ? '+' : ''}${suggested}. Adjust if your birthplace keeps a different civil time or daylight saving was in effect.`,
    )
  }, [])

  const onCityInput = useCallback((value: string): void => {
    setCityQuery(value)
    setLat(null)
    setLon(null)
    setPlaceName(null)
  }, [])

  /* ---- Run the portal ---- */
  const runPortal = useCallback((): void => {
    let nextChart: Chart
    if (inputMode === 'birth') {
      if (!bDate) return showEnterErr('Add your birth date to open the portal.')
      if (lat === null || lon === null) {
        return showEnterErr(
          mapboxToken
            ? 'Pick your birth city from the list so we can compute your rising sign.'
            : 'City search needs a Mapbox token, or switch to the Big Three path above.',
        )
      }
      const [y, mo, d] = bDate.split('-').map(Number)
      const timeVal = bTime || '12:00'
      const [hh, mm] = timeVal.split(':').map(Number)
      const tzOffset = parseFloat(bTz)
      nextChart = computeChart(y, mo, d, hh, mm, tzOffset, lat, lon)
    } else {
      const v: BigThreeInput = {
        sun: big3.sun,
        moon: big3.moon,
        rising: big3.rising,
        mars: big3.mars || undefined,
        venus: big3.venus || undefined,
        jupiter: big3.jupiter || undefined,
        mc: big3.mc || undefined,
        h2: big3.h2 || undefined,
        h6: big3.h6 || undefined,
        h10: big3.h10 || undefined,
        nn: big3.nn || undefined,
      }
      if (!v.sun || !v.moon || !v.rising)
        return showEnterErr('Sun, Moon and Rising are the minimum to open the portal.')
      nextChart = chartFromBigThree(v)
    }
    if (!concern)
      return showEnterErr(
        'Tell the portal what needs the most attention right now. "I honestly don\'t know" counts.',
      )

    setChart(nextChart)
    setScores(scoreChart(nextChart, concern, mode))
    go('result')
  }, [inputMode, bDate, bTime, bTz, lat, lon, mapboxToken, big3, concern, mode, go, showEnterErr])

  /* ---- Ritual → Declaration ---- */
  const composeDeclaration = useCallback((): void => {
    const vals = ritual.map((r) => r.trim())
    const [, , , r4, r5, , r7, r8] = vals
    if (!r4)
      return showRitualErr('Step 4 is the ritual. Complete "I choose..." before composing your declaration.')
    if (!r5) return showRitualErr('Step 5 makes it survivable. Name one repeatable action.')
    if (!r7) return showRitualErr('Step 7 makes it real. Name one move you can make before sleep.')
    if (!r8) return showRitualErr(copy.step8Err)

    const clean = (t: string, strip: 'choose' | 'nolonger' | 'will'): string => {
      const s = t
        .replace(/^i\s+choose\s+/i, (m) => (strip === 'choose' ? '' : m))
        .replace(/^(\.\.\.)?\s*no\s+longer\s+/i, (m) => (strip === 'nolonger' ? '' : m))
        .replace(/^before\s+i\s+sleep\s+(tonight,?\s*)?i\s+will\s+/i, (m) =>
          strip === 'will' ? '' : m,
        )
      return s.replace(/\.$/, '')
    }
    const decision = clean(r4, 'choose')
    const release = clean(r8, 'nolonger')
    const action = r5.replace(/\.$/, '')
    const move = clean(r7, 'will')
    const focus = scores ? domainCopy[scores.primary].label : ''

    setDeclLines([
      `I am choosing ${decision}.`,
      `I am releasing ${release}.`,
      `My focus is ${focus}.`,
      `I will protect it through ${action}.`,
      `Before today ends, I will ${move}.`,
    ])
    go('declaration')
  }, [ritual, scores, domainCopy, copy.step8Err, go, showRitualErr])

  /* ---- Shareable card (canvas → PNG) ---- */
  const downloadCard = useCallback((): void => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const W = 1080
    const H = 1350
    const isGate = mode === 'gate'

    const palette = isGate
      ? {
          g0: '#F3DFA6',
          g1: '#F7C89C',
          g2: '#F4B7AC',
          ink: '#6B3A2E',
          inkArc: 'rgba(107,58,46,0.16)',
          foot: 'rgba(107,58,46,0.75)',
        }
      : {
          g0: '#17305b',
          g1: '#1d3a6b',
          g2: '#0d1b39',
          ink: '#ffffff',
          inkArc: 'rgba(255,255,255,0.14)',
          foot: 'rgba(255,255,255,0.7)',
        }

    const grad = ctx.createLinearGradient(0, 0, W * 0.4, H)
    grad.addColorStop(0, palette.g0)
    grad.addColorStop(0.55, palette.g1)
    grad.addColorStop(1, palette.g2)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // gate arch watermark
    ctx.strokeStyle = palette.inkArc
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.arc(W / 2, 330, 210, Math.PI, 0)
    ctx.lineTo(W / 2 + 210, 560)
    ctx.lineTo(W / 2 - 210, 560)
    ctx.closePath()
    ctx.stroke()

    ctx.fillStyle = palette.ink
    ctx.textAlign = 'center'
    ctx.font = "500 30px ui-monospace, 'SFMono-Regular', Menlo, monospace"
    ctx.fillText(copy.cardHeader, W / 2, 130)

    let y = 300
    ctx.font = "500 40px 'Poppins', system-ui, sans-serif"
    for (const t of declLines) {
      y = wrapText(ctx, t, W / 2, y, 860, 52) + 26
    }

    ctx.font = "700 58px 'Poppins', system-ui, sans-serif"
    wrapText(ctx, 'THIS IS WHAT GETS MY ENERGY NOW.', W / 2, Math.max(y + 60, 1040), 880, 68)

    ctx.font = "500 26px ui-monospace, 'SFMono-Regular', Menlo, monospace"
    ctx.fillStyle = palette.foot
    ctx.fillText('iter8me.com', W / 2, H - 70)

    const a = document.createElement('a')
    a.download = copy.cardFile
    a.href = cv.toDataURL('image/png')
    a.click()
  }, [mode, copy.cardHeader, copy.cardFile, declLines])

  const ritualSteps: RitualStep[] = useMemo(
    () => [
      {
        num: 1,
        title: 'Locate',
        theme: 'Where are you actually?',
        ask: 'If your life made the front page this morning, what would the headline say?',
        placeholder: 'Write the headline...',
      },
      {
        num: 2,
        title: 'Differentiate',
        theme: "What's yours and what's performance?",
        ask: 'What have you been pursuing because you genuinely want it, and what have you been pursuing because you think you should?',
        placeholder: 'Mine: ...  Performance: ...',
      },
      {
        num: 3,
        title: 'Evaluate',
        theme: 'What is repetition costing you?',
        ask: copy.askCost,
        placeholder: 'The real cost...',
      },
      {
        num: 4,
        title: 'Authorize',
        theme: 'Make the decision.',
        ask: 'Complete the sentence: I choose ____________.',
        placeholder: 'I choose...',
      },
      {
        num: 5,
        title: 'Regulate',
        theme: 'Make it survivable.',
        ask: 'What is one action small enough that you can actually repeat it?',
        placeholder: 'One small repeatable action...',
      },
      {
        num: 6,
        title: 'Calibrate',
        theme: 'Reduce the friction.',
        ask: 'What needs to become easier, smaller, earlier, later, automated, delegated or removed?',
        placeholder: 'The friction I am removing...',
      },
      {
        num: 7,
        title: 'Activate',
        theme: 'Move something today.',
        ask: 'What can you do before you go to sleep that makes your decision real? Not plan. Not research. Move.',
        placeholder: 'Before I sleep tonight, I will...',
      },
      {
        num: 8,
        title: 'Integrate',
        theme: copy.themeClose,
        ask: 'Finish this: The version of me entering 8/9 no longer ____________.',
        placeholder: '...no longer...',
      },
    ],
    [copy.askCost, copy.themeClose],
  )

  /* ---- Derived result data ---- */
  const result = useMemo(() => {
    if (!scores || !chart) return null
    const P = domainCopy[scores.primary]
    const Su = domainCopy[scores.supporting]

    const chips: string[] = []
    chips.push(`ASC ${chart.asc.sign}`)
    if (chart.mc) chips.push(`MC ${chart.mc.sign}`)
    for (const k of CHIP_ORDER) {
      const pl = chart.placements[k]
      if (pl) {
        const nm = k === 'NorthNode' ? 'NN' : k
        chips.push(`${nm} ${pl.sign} · H${pl.house}`)
      }
    }

    const why = scores.signals.slice(0, 8).map((s) => ({
      text: `${s.why} → ${domainCopy[s.domain as Domain].label}`,
      pts: s.pts,
    }))

    const flags: string[] = []
    if (chart.computed) {
      for (const k of ['Sun', 'Moon'] as const) {
        const d = chart.placements[k]?.degIn
        if (d !== undefined && (d < 1.5 || d > 28.5))
          flags.push(
            `${k} sits within 1.5° of a sign boundary. If your birth time is uncertain, verify this placement.`,
          )
      }
      const ascDeg = chart.asc.degIn
      if (ascDeg !== undefined && (ascDeg < 2 || ascDeg > 28)) {
        flags.push(
          'Your Ascendant is near a sign boundary. Rising signs are sensitive to birth time; a few minutes can shift it.',
        )
      }
    }

    return { P, Su, chips, why, flags, anchor: scores.anchor }
  }, [scores, chart, domainCopy])

  const mapPinColor = mode === 'gate' ? 'EACB74' : '17305B'
  const locationPreview =
    mapboxToken && lat !== null && lon !== null ? (
      <LocationPreview
        lat={lat}
        lon={lon}
        name={placeName ?? cityQuery}
        token={mapboxToken}
        pinColor={mapPinColor}
      />
    ) : null

  const setBig3Field = (key: string, value: string): void =>
    setBig3((prev) => ({ ...prev, [key]: value }))

  const setRitualField = (idx: number, value: string): void =>
    setRitual((prev) => {
      const next = [...prev]
      next[idx] = value
      return next
    })

  return (
    <div className={styles.portal} data-mode={mode}>
      <div className={styles.progress}>
        <div className={styles.progressBar} style={{ width: `${progressPct}%` }} />
      </div>

      {/* ================= SCREEN 1: ENTER ================= */}
      {screen === 'enter' && (
        <section>
          <div className={styles.shell}>
            <div className={styles.gateMark}>8</div>
            <div className={styles.eyebrow}>{copy.eyebrow}</div>
            <div className={`${styles.gateStatus} ${copy.statusClosed ? styles.closed : ''}`}>
              {copy.status}
            </div>
            <h1>{copy.heroTitle}</h1>
            <p className={styles.sub}>{copy.heroSub}</p>

            {enterErr && <div className={styles.err}>{enterErr}</div>}

            <div className={styles.tabs}>
              <button
                type="button"
                className={`${styles.tab} ${inputMode === 'birth' ? styles.on : ''}`}
                onClick={() => setInputMode('birth')}
              >
                Full birth details
              </button>
              <button
                type="button"
                className={`${styles.tab} ${inputMode === 'big3' ? styles.on : ''}`}
                onClick={() => setInputMode('big3')}
              >
                I know my Big Three
              </button>
            </div>

            {inputMode === 'birth' && (
              <div className={styles.card}>
                <h3>Your birth details</h3>
                <p className={styles.hint}>
                  We compute your placements in your browser. Nothing is stored or sent anywhere.
                </p>
                <div className={styles.row}>
                  <div>
                    <label htmlFor="bDate">Birth date</label>
                    <input
                      type="date"
                      id="bDate"
                      min="1900-01-01"
                      max="2026-08-08"
                      value={bDate}
                      onChange={(e) => setBDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="bTime">Birth time</label>
                    <input
                      type="time"
                      id="bTime"
                      value={bTime}
                      onChange={(e) => setBTime(e.target.value)}
                    />
                  </div>
                </div>

                {mapboxToken ? (
                  <>
                    <label htmlFor="bCity">Birth city</label>
                    <div className={styles.geoResults}>
                      <input
                        type="text"
                        id="bCity"
                        placeholder="Start typing a city..."
                        autoComplete="off"
                        value={cityQuery}
                        onChange={(e) => onCityInput(e.target.value)}
                        onBlur={() => setTimeout(() => setShowList(false), 150)}
                      />
                      {showList && suggestions.length > 0 && (
                        <div className={styles.geoList}>
                          {suggestions.map((f, i) => (
                            <button
                              key={`${f.place_name}-${i}`}
                              type="button"
                              className={styles.geoItem}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => pickPlace(f.center[1], f.center[0], f.place_name)}
                            >
                              {f.place_name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {locationPreview && <div className={styles.mapImgWrap}>{locationPreview}</div>}
                  </>
                ) : (
                  <p className={styles.note} style={{ textAlign: 'left' }}>
                    City search needs a Mapbox token. Type your city and pick your UTC offset
                    manually, or use the Big Three path.
                  </p>
                )}

                <div className={styles.row} style={{ marginTop: 12 }}>
                  <div>
                    <label htmlFor="bTz">Time zone of birth (UTC offset)</label>
                    <select id="bTz" value={bTz} onChange={(e) => setBTz(e.target.value)}>
                      {tz.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>&nbsp;</label>
                    <div className={styles.note} style={{ textAlign: 'left', marginTop: 0 }}>
                      If daylight saving was in effect at your birth, pick the DST offset (one hour
                      ahead).
                    </div>
                  </div>
                </div>
                {mapNote && (
                  <div className={styles.note} style={{ textAlign: 'left' }}>
                    {mapNote}
                  </div>
                )}
              </div>
            )}

            {inputMode === 'big3' && (
              <div className={styles.card}>
                <h3>Already know your Big Three?</h3>
                <p className={styles.hint}>
                  Sun, Moon, Rising. Add the advanced fields if you know them and the reading gets
                  sharper.
                </p>
                <div className={styles.row}>
                  <div>
                    <label htmlFor="g3sun">Sun sign</label>
                    <SignSelect
                      id="g3sun"
                      value={big3.sun}
                      onChange={(v) => setBig3Field('sun', v)}
                    />
                  </div>
                  <div>
                    <label htmlFor="g3moon">Moon sign</label>
                    <SignSelect
                      id="g3moon"
                      value={big3.moon}
                      onChange={(v) => setBig3Field('moon', v)}
                    />
                  </div>
                </div>
                <label htmlFor="g3rising">Rising sign</label>
                <SignSelect
                  id="g3rising"
                  value={big3.rising}
                  onChange={(v) => setBig3Field('rising', v)}
                />

                <details className={styles.adv}>
                  <summary>Advanced placements (optional)</summary>
                  <div className={styles.row}>
                    <div>
                      <label htmlFor="g3mars">Mars sign</label>
                      <SignSelect
                        id="g3mars"
                        optional
                        value={big3.mars}
                        onChange={(v) => setBig3Field('mars', v)}
                      />
                    </div>
                    <div>
                      <label htmlFor="g3jupiter">Jupiter sign</label>
                      <SignSelect
                        id="g3jupiter"
                        optional
                        value={big3.jupiter}
                        onChange={(v) => setBig3Field('jupiter', v)}
                      />
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div>
                      <label htmlFor="g3venus">Venus sign</label>
                      <SignSelect
                        id="g3venus"
                        optional
                        value={big3.venus}
                        onChange={(v) => setBig3Field('venus', v)}
                      />
                    </div>
                    <div>
                      <label htmlFor="g3mc">Midheaven sign</label>
                      <SignSelect
                        id="g3mc"
                        optional
                        value={big3.mc}
                        onChange={(v) => setBig3Field('mc', v)}
                      />
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div>
                      <label htmlFor="g3h2">2nd house sign</label>
                      <SignSelect
                        id="g3h2"
                        optional
                        value={big3.h2}
                        onChange={(v) => setBig3Field('h2', v)}
                      />
                    </div>
                    <div>
                      <label htmlFor="g3h6">6th house sign</label>
                      <SignSelect
                        id="g3h6"
                        optional
                        value={big3.h6}
                        onChange={(v) => setBig3Field('h6', v)}
                      />
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div>
                      <label htmlFor="g3h10">10th house sign</label>
                      <SignSelect
                        id="g3h10"
                        optional
                        value={big3.h10}
                        onChange={(v) => setBig3Field('h10', v)}
                      />
                    </div>
                    <div>
                      <label htmlFor="g3nn">North Node sign</label>
                      <SignSelect
                        id="g3nn"
                        optional
                        value={big3.nn}
                        onChange={(v) => setBig3Field('nn', v)}
                      />
                    </div>
                  </div>
                </details>
              </div>
            )}

            <div className={styles.card}>
              <h3>What needs the most attention right now?</h3>
              <div className={styles.concernGrid}>
                {CONCERNS.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    className={`${styles.concern} ${concern === c.key ? styles.on : ''}`}
                    onClick={() => setConcern(c.key)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" className={styles.btn} onClick={runPortal}>
              {copy.btnRun}
            </button>
            <p className={styles.note}>
              A reflection tool, not a prediction machine. Astronomy computed in your browser with
              Meeus and JPL approximation methods.
            </p>
          </div>
        </section>
      )}

      {/* ================= SCREEN 2: RESULT ================= */}
      {screen === 'result' && result && (
        <section>
          <div className={styles.shell}>
            <div className={styles.eyebrow}>{copy.focusEyebrow}</div>
            <div className={styles.focusHero}>
              <div className={styles.flame}>🔥</div>
              <h2>{result.P.hero}</h2>
              <p className={styles.focusLine}>
                <strong>Primary:</strong> {result.P.label}
              </p>
              <p className={styles.focusLine}>
                <strong>Supporting:</strong> {result.Su.label}
              </p>
              <div className={styles.instruction}>
                {copy.instructionPrefix + result.P.instruction}
              </div>
            </div>

            <div className={styles.card}>
              <h3>Your reading</h3>
              <p style={{ fontSize: 15 }}>{result.P.body}</p>
              <div className={styles.qBox}>Your question: {result.P.question}</div>
            </div>

            <div className={styles.card}>
              <h3>Supporting: {result.Su.label}</h3>
              <p style={{ fontSize: 15 }}>{result.Su.body}</p>
              <div className={styles.qBox}>Your question: {result.Su.question}</div>
            </div>

            <div className={styles.card}>
              <span className={styles.anchorChip}>Your Iter8 Anchor</span>
              <h3>{result.anchor}</h3>
              <p style={{ fontSize: 15, marginBottom: 0 }}>{ANCHOR_COPY[result.anchor]}</p>
            </div>

            <div className={styles.card}>
              <h3>Why you got this</h3>
              <p className={styles.hint}>Deterministic scoring. Same inputs, same result, every time.</p>
              <div className={styles.placements}>
                {result.chips.map((c, i) => (
                  <span key={`${c}-${i}`} className={styles.placement}>
                    {c}
                  </span>
                ))}
              </div>
              <ul className={styles.whyList}>
                {result.why.length > 0 ? (
                  result.why.map((w, i) => (
                    <li key={i}>
                      <span>{w.text}</span>
                      <span className={styles.pts}>+{w.pts}</span>
                    </li>
                  ))
                ) : (
                  <li>
                    <span>{copy.quietChart}</span>
                    <span className={styles.pts}>+0</span>
                  </li>
                )}
              </ul>
              {result.flags.length > 0 && (
                <div className={styles.cuspFlag}>
                  {result.flags.map((f, i) => (
                    <span key={i}>
                      {f}
                      {i < result.flags.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button type="button" className={`${styles.btn} ${styles.warm}`} onClick={() => go('ritual')}>
              {copy.btnBegin}
            </button>
            <button type="button" className={`${styles.btn} ${styles.ghost}`} onClick={() => go('enter')}>
              Start over
            </button>
          </div>
        </section>
      )}

      {/* ================= SCREEN 3: RITUAL ================= */}
      {screen === 'ritual' && (
        <section>
          <div className={styles.shell}>
            <div className={styles.eyebrow}>{copy.ritualEyebrow}</div>
            <h1 style={{ fontSize: 'clamp(26px,5vw,36px)' }}>Eight minutes. One decision.</h1>
            <p className={styles.sub}>
              Don&apos;t give today eight activities. Give it one short ritual. Answer honestly,
              move slowly.
            </p>

            {ritualErr && <div className={styles.err}>{ritualErr}</div>}

            {ritualSteps.map((step, idx) => (
              <div className={styles.stepCard} key={step.num}>
                <div className={styles.num}>{step.num}</div>
                <h3>{step.title}</h3>
                <p className={styles.theme}>{step.theme}</p>
                <p className={styles.ask}>{step.ask}</p>
                <textarea
                  placeholder={step.placeholder}
                  value={ritual[idx]}
                  onChange={(e) => setRitualField(idx, e.target.value)}
                />
              </div>
            ))}

            <button type="button" className={styles.btn} onClick={composeDeclaration}>
              {copy.btnCompose}
            </button>
          </div>
        </section>
      )}

      {/* ================= SCREEN 4: DECLARATION ================= */}
      {screen === 'declaration' && (
        <section>
          <div className={styles.shell}>
            <div className={styles.eyebrow}>{copy.declEyebrow}</div>
            <div className={styles.decl}>
              {declLines.map((l, i) => (
                <p key={i}>{l}</p>
              ))}
              <p className={styles.big}>THIS IS WHAT GETS MY ENERGY NOW.</p>
            </div>
            <button type="button" className={styles.btn} onClick={downloadCard}>
              {copy.btnSave}
            </button>
            <button type="button" className={`${styles.btn} ${styles.ghost}`} onClick={() => go('upgrade')}>
              You opened the door. Keep going →
            </button>
            <canvas ref={canvasRef} width={1080} height={1350} className={styles.hiddenCanvas} />
          </div>
        </section>
      )}

      {/* ================= SCREEN 5: UPGRADE ================= */}
      {screen === 'upgrade' && (
        <section>
          <div className={styles.shell}>
            <div className={styles.eyebrow}>Continue Your Iter8</div>
            <h1 style={{ fontSize: 'clamp(26px,5vw,36px)' }}>
              You opened the door. Want to keep going?
            </h1>
            <p className={styles.sub}>
              Today gave you a decision. Iter8 gives you the process for becoming the person who
              follows through on it.
            </p>

            <div className={styles.card}>
              <h3>Today</h3>
              <ul className={styles.journey}>
                <li className={styles.done}>
                  <strong>{copy.ckPortal}</strong>
                  <span>Complete</span>
                </li>
                <li className={styles.done}>
                  <strong>Your Focus</strong>
                  <span>{scores ? domainCopy[scores.primary].label : ''}</span>
                </li>
                <li className={styles.done}>
                  <strong>{copy.ckReset}</strong>
                  <span>Complete</span>
                </li>
                <li className={styles.done}>
                  <strong>Declaration</strong>
                  <span>Saved</span>
                </li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>Next</h3>
              <ul className={styles.journey}>
                <li>
                  <strong>Locate</strong>
                  <span>See the pattern clearly.</span>
                </li>
                <li>
                  <strong>Differentiate</strong>
                  <span>Separate yourself from the role you&apos;ve been performing.</span>
                </li>
                <li>
                  <strong>Evaluate</strong>
                  <span>Calculate what staying stuck is actually costing.</span>
                </li>
                <li>
                  <strong>Authorize</strong>
                  <span>Make the choice.</span>
                </li>
                <li>
                  <strong>Regulate</strong>
                  <span>Create behavior you can repeat.</span>
                </li>
                <li>
                  <strong>Calibrate</strong>
                  <span>Adjust without starting over.</span>
                </li>
                <li>
                  <strong>Activate</strong>
                  <span>Create movement.</span>
                </li>
                <li>
                  <strong>Integrate</strong>
                  <span>Make the change part of who you are.</span>
                </li>
              </ul>
            </div>

            <div className={styles.card} style={{ background: 'var(--soft-grad)' }}>
              <span className={styles.anchorChip}>Your Iter8 Anchor</span>
              <h3>{scores?.anchor ?? ''}</h3>
              <p style={{ fontSize: 15, marginBottom: 0 }}>
                {scores ? ANCHOR_COPY[scores.anchor] : ''}
              </p>
            </div>

            <p className={styles.bridge}>{copy.bridge}</p>

            <h2 className={styles.upgradeHeading}>Don&apos;t stop at the portal. Iter8 it.</h2>
            <p className={styles.sub} style={{ marginBottom: 22 }}>
              {copy.upgradeSub}
            </p>
            <a href="https://iter8me.com" target="_blank" rel="noopener noreferrer" className={styles.ctaLink}>
              <button type="button" className={`${styles.btn} ${styles.warm}`}>
                Continue My Iter8 →
              </button>
            </a>
            <button type="button" className={`${styles.btn} ${styles.ghost}`} onClick={() => go('enter')}>
              Run the portal for someone else
            </button>
          </div>
        </section>
      )}

      <div className={styles.footer}>
        The 8/8 Portal is a reflection tool. Placements are computed in your browser using standard
        astronomical approximation methods (Meeus solar and lunar theory, JPL planetary elements,
        whole-sign houses). Nothing you enter is stored or transmitted, except the city lookup sent
        to Mapbox if you use the map.
      </div>
    </div>
  )
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(' ')
  let line = ''
  let yy = y
  for (const w of words) {
    const test = line ? line + ' ' + w : w
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy)
      line = w
      yy += lineHeight
    } else {
      line = test
    }
  }
  ctx.fillText(line, x, yy)
  return yy + lineHeight
}

interface SignSelectProps {
  id: string
  value: string
  optional?: boolean
  onChange: (value: string) => void
}

function SignSelect({ id, value, optional = false, onChange }: SignSelectProps): React.JSX.Element {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{optional ? 'Not sure' : 'Choose...'}</option>
      {SIGNS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  )
}

interface LocationPreviewProps {
  lat: number
  lon: number
  name: string
  token: string
  pinColor: string
}

function LocationPreview({
  lat,
  lon,
  name,
  token,
  pinColor,
}: LocationPreviewProps): React.JSX.Element {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        role="img"
        aria-label={name}
        style={{
          display: 'flex',
          height: 190,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          background: '#cfe6f5',
        }}
      >
        <MapPin size={15} aria-hidden="true" />
        <span style={{ fontSize: 12, fontWeight: 600 }}>{name}</span>
      </div>
    )
  }

  const marker = `pin-s+${pinColor}(${lon},${lat})`
  const camera = `${lon},${lat},6,0`
  const src = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${marker}/${camera}/640x380@2x?access_token=${encodeURIComponent(
    token,
  )}`

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ display: 'block', width: '100%', height: 190, objectFit: 'cover' }}
    />
  )
}

export function EnergyPortal(): React.JSX.Element {
  return (
    <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
      <EnergyPortalInner />
    </Suspense>
  )
}
