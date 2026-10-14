'use client'
import { useMemo, useState } from 'react'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { getWorldFeatures, ISO2_TO_NE_ID } from '@/lib/world-geo'
import { PASSPORTS, REQUIREMENT_LABEL, decodeRequirement, type RequirementKind } from '@/lib/passport-index'

const W=920,H=470
const features=getWorldFeatures().filter((f)=>String(f.id)!=='010') // omit Antarctica
const projection=geoNaturalEarth1().fitExtent([[6,6],[W-6,H-6]],{type:'FeatureCollection',features} as never)
const path=geoPath(projection)
export const KIND_COLORS:Record<RequirementKind,string>={
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
const KINDS=Object.keys(KIND_COLORS) as RequirementKind[]
export function PassportAccessMap({passport,onSelect,counts}:{passport:string;onSelect:(code:string)=>void;counts?:Record<RequirementKind,number>}) {
 const [hovered,setHovered]=useState<string|null>(null)
 const entry=PASSPORTS[passport]
 const regions=useMemo(()=>features.map(f=>{
   const code=neToIso.get(String(f.id))??aliases[normalize(f.properties.name)]??byName.get(normalize(f.properties.name))
   const raw=code?entry.d[code]:undefined
   const kind=raw?decodeRequirement(raw).kind:null
   return {feature:f,code,kind,home:code===passport}
 }),[entry,passport])
 const active=regions.find(r=>r.code===hovered)
 return <section className="card-surface overflow-hidden p-5">
  <h2 className="text-base font-bold text-navy">Global access for {entry.n}</h2><p className="text-xs text-muted">Click a country to see its entry requirement.</p>
  <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="group" aria-label={`World map of entry requirements for ${entry.n} passport holders`}>
   {regions.map(({feature,code,kind,home})=><path key={String(feature.id)} d={path(feature as Parameters<typeof path>[0])??''} fill={home?'#17305b':kind?KIND_COLORS[kind]:'#cbd5e1'} stroke="#fff" strokeWidth={.7} tabIndex={code&&kind?0:undefined} role={code&&kind?'button':undefined} aria-label={code&&kind?`${PASSPORTS[code]?.n??feature.properties.name}: ${REQUIREMENT_LABEL[kind]}`:undefined} onMouseEnter={()=>setHovered(code??null)} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(code??null)} onBlur={()=>setHovered(null)} onClick={()=>{if(code&&kind)onSelect(code)}} onKeyDown={e=>{if(code&&kind&&(e.key==='Enter'||e.key===' ')){e.preventDefault();onSelect(code)}}} className={code&&kind?'cursor-pointer outline-none focus:stroke-gold focus:stroke-[3px]':''}><title>{home?`${entry.n} (your passport)`:`${feature.properties.name}: ${kind?REQUIREMENT_LABEL[kind]:'No mapped entry data'}`}</title></path>)}
  </svg>
  <p aria-live="polite" className="mt-1 min-h-5 text-xs font-semibold text-navy">{active?.code&&active.kind?`${PASSPORTS[active.code]?.n??active.feature.properties.name} · ${REQUIREMENT_LABEL[active.kind]}`:''}</p>
  <ul className="mt-2 space-y-1.5 text-[13px] text-navy">
    {KINDS.map(k=><li key={k} className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{backgroundColor:KIND_COLORS[k]}}/><span className="flex-1">{REQUIREMENT_LABEL[k]}</span>{counts&&<span className="font-semibold tabular-nums">{counts[k]}</span>}</li>)}
  </ul>
 </section>
}
