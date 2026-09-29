'use client'

import { useEffect, useRef, useState } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { getCountryFeature } from '@/lib/world-geo'
import { KOLMARI_MAP_STYLE } from '@/lib/kolmari-map'
import { CountrySnapshotMap } from '@/components/country-workspace/CountrySnapshotMap'

type Props = {
  countryName: string
  countryCode?: string
  lat: number
  lng: number
  alt: string
  cityName?: string
  /** Optional trailing label for the pin pill, e.g. a match score ("87%"). */
  pinLabel?: string
  className?: string
}

/**
 * Interactive country mini map: OpenFreeMap vector tiles (MapLibre GL) with
 * the country's own Natural Earth polygon drawn as a dashed highlight and a
 * gold pin at the given coordinates. If WebGL or the tile endpoint is
 * unavailable, the D3 + Natural Earth SVG locator renders instead.
 */
export function CountryVectorMap({ countryName, countryCode, lat, lng, alt, cityName, pinLabel, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let map: { remove: () => void } | null = null
    let cancelled = false

    async function init() {
      if (!containerRef.current) return
      try {
        const [maplibregl, feature] = await Promise.all([
          import('maplibre-gl'),
          Promise.resolve(getCountryFeature(countryCode)),
        ])
        await import('maplibre-gl/dist/maplibre-gl.css')
        if (cancelled || !containerRef.current) return

        const instance = new maplibregl.Map({
          container: containerRef.current,
          style: KOLMARI_MAP_STYLE,
          attributionControl: { compact: true },
          cooperativeGestures: true,
          interactive: true,
          dragRotate: false,
          touchPitch: false,
        })

        instance.on('error', () => {
          if (!cancelled) setFailed(true)
        })

        // Zoom controls, per the approved 1a mockup (no compass).
        instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')

        instance.on('load', () => {
          if (cancelled) return
          if (feature?.geometry) {
            const mercator = geoMercator()
            const bounds = geoPath(mercator).bounds(feature as never)
            const toLngLat = (point: [number, number]): [number, number] => {
              const inverted = mercator.invert?.(point)
              return inverted ? [inverted[0], inverted[1]] : [0, 0]
            }
            try {
              instance.fitBounds([toLngLat(bounds[0]), toLngLat(bounds[1])], { padding: 36, maxZoom: 6 })
            } catch {
              instance.setCenter([lng, lat])
              instance.setZoom(4.5)
            }
            instance.addSource('country-highlight', { type: 'geojson', data: feature as never })
            instance.addLayer({
              id: 'country-fill',
              type: 'fill',
              source: 'country-highlight',
              paint: { 'fill-color': '#F3C516', 'fill-opacity': 0.28 },
            })
            instance.addLayer({
              id: 'country-outline',
              type: 'line',
              source: 'country-highlight',
              paint: { 'line-color': '#C0392B', 'line-width': 2, 'line-dasharray': [3, 2.5] },
            })
          } else {
            instance.setCenter([lng, lat])
            instance.setZoom(4.5)
          }

          const pin = document.createElement('div')
          pin.className = 'kolmari-vector-pin'
          const dot = document.createElement('span')
          dot.className = 'kolmari-vector-pin__dot'
          pin.appendChild(dot)
          if (cityName || pinLabel) {
            const label = document.createElement('span')
            label.className = 'kolmari-vector-pin__label'
            label.textContent = [cityName, pinLabel].filter(Boolean).join(' · ')
            pin.appendChild(label)
          }
          new maplibregl.Marker({ element: pin, anchor: 'center' }).setLngLat([lng, lat]).addTo(instance)
        })

        map = instance
      } catch {
        if (!cancelled) setFailed(true)
      }
    }

    init()
    return () => {
      cancelled = true
      map?.remove()
      map = null
    }
  }, [countryCode, lat, lng, cityName, pinLabel])

  if (failed) {
    return (
      <CountrySnapshotMap
        countryName={countryName}
        countryCode={countryCode}
        lat={lat}
        lng={lng}
        alt={alt}
        cityName={cityName}
        fallback="locator"
      />
    )
  }

  return (
    <div className={className} role="img" aria-label={alt}>
      <div ref={containerRef} className="h-full w-full" />
      <style>{`
        .kolmari-vector-pin { display: flex; align-items: center; gap: 6px; }
        .kolmari-vector-pin__dot { width: 18px; height: 18px; border-radius: 9999px; background: #F3C516; border: 3px solid #fff; box-shadow: 0 1px 6px rgba(0,0,0,.35); flex: none; }
        .kolmari-vector-pin__label { background: #fff; color: #0e2a47; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; box-shadow: 0 1px 6px rgba(0,0,0,.25); white-space: nowrap; }
        .maplibregl-ctrl-attrib { font-size: 10px; }
      `}</style>
    </div>
  )
}
