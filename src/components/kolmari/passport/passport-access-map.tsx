'use client'
import { useMemo, useState } from 'react'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { getWorldFeatures, ISO2_TO_NE_ID } from '@/lib/world-geo'
import { PASSPORTS, REQUIREMENT_LABEL, decodeRequirement, type RequirementKind } from '@/lib/passport-index'

const W=920,H=430
const projection=geoNaturalEarth1().fitExtent([[10,10],[W-10,H-10]],{type:'Sphere'})
const path=geoPath(projection)
const COLORS:Record<RequirementKind,string>={
 'visa-free':'#15803d','visa-on-arrival':'#0284c7',eta:'#d97706','e-visa':'#7c3aed','visa-required':'#be123c','no-admission':'#52525b'
}
const normalize=(s:string)=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,'')
const aliases:Record<string,string>={
 'unitedstatesofamerica':'US','demrepcongo':'CD','congo':'CG','southkorea':'KR','northkorea':'KP',
 'russia':'RU','czechia':'CZ','ivorycoast':'CI','westsahara':'EH','taiwan':'TW',
 'tanzania':'TZ','centralafricanrep':'CF','dominicanrep':'DO','eqguinea':'GQ',
 'bosniaandherz':'BA','solomonis':'SB','sudan':'SD','ssudan':'SS','laos':'LA',
 'vietnam':'VN','thegambia':'GM','macedonia':'MK','myanmar':'MM','brunei':'BN',
 'eswatini':'SZ','kosovo':'XK'
}
const byName=new Map(Object.entries(PASSPORTS).map(([code,e])=>[normalize(e.n),code]))
const neToIso=new Map(Object.entries(ISO2_TO_NE_ID).map(([code,id])=>[id,code]))
const features=getWorldFeatures()
export function PassportAccessMap({passport,onSelect}:{passport:string;onSelect:(code:string)=>void}) {
 const [hovered,setHovered]=useState<string|null>(null)
 const entry=PASSPORTS[passport]
 const regions=useMemo(()=>features.map(f=>{
   const code=neToIso.get(String(f.id))??aliases[normalize(f.properties.name)]??byName.get(normalize(f.properties.name))
   const raw=code?entry.d[code]:undefined
   const kind=raw?decodeRequirement(raw).kind:null
   return {feature:f,code,kind}
 }),[entry])
 const active=regions.find(r=>r.code===hovered)
 return <section className="card-surface overflow-hidden p-4 sm:p-5">
  <div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-bold text-navy">Global access map</h2><p className="text-xs text-muted">Entry requirements for {entry.n} passport holders</p></div><span className="text-xs text-muted">Select a country</span></div>
  <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full rounded-lg bg-sky-50" role="group" aria-label="Interactive world map of passport entry requirements">
   {regions.map(({feature,code,kind})=><path key={String(feature.id)} d={path(feature as Parameters<typeof path>[0])??''} fill={kind?COLORS[kind]:'#cbd5e1'} stroke="#fff" strokeWidth={.7} tabIndex={code&&kind?0:undefined} role={code&&kind?'button':undefined} aria-label={code&&kind?`${PASSPORTS[code]?.n??feature.properties.name}: ${REQUIREMENT_LABEL[kind]}`:undefined} onMouseEnter={()=>setHovered(code??null)} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(code??null)} onBlur={()=>setHovered(null)} onClick={()=>{if(code&&kind)onSelect(code)}} onKeyDown={e=>{if(code&&kind&&(e.key==='Enter'||e.key===' ')){e.preventDefault();onSelect(code)}}} className={code&&kind?'cursor-pointer outline-none focus:stroke-gold focus:stroke-[3px]':''}><title>{feature.properties.name}: {kind?REQUIREMENT_LABEL[kind]:'No mapped entry data'}</title></path>)}
  </svg>
  <p aria-live="polite" className="mt-2 min-h-5 text-sm font-semibold text-navy">{active?.code&&active.kind?`${PASSPORTS[active.code]?.n??active.feature.properties.name} — ${REQUIREMENT_LABEL[active.kind]}`:'Hover or select a colored destination to view its requirement.'}</p>
  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs">{Object.entries(COLORS).map(([kind,color])=><span key={kind} className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm" style={{backgroundColor:color}}/>{REQUIREMENT_LABEL[kind as RequirementKind]}</span>)}<span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-slate-300"/>No mapped data</span></div>
  <p className="mt-3 text-xs text-muted">Map boundaries and the passport dataset use different country identifiers; unmapped destinations remain gray. The destination directory is the accessible complete reference.</p>
 </section>
}
