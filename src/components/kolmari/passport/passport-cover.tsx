'use client'
import { useState } from 'react'
import { BookOpen } from 'lucide-react'

/** Commons file names from its passport-cover category. Confirm each file's individual license before redistribution. */
export const PASSPORT_COVER_FILES: Record<string,string> = {
  US: "United States Passport.svg",
  CA: "Canadian passport.svg",
  GB: "British Passport December 2025.svg",
  FR: "French Passport Cover.svg",
  ES: "Pasaporte ES.svg",
  MX: "Pasaporte electrónico Mexicano 2021.svg",
  IN: "Indian Passport (e-Passport, 2024).svg",
  IT: "Italy passport.svg",
  IE: "Irish Passport.svg",
  SG: "Singapore Passport.svg",
  BR: "Brazilian Passport Cover.jpg",
  NO: "Norway passport 2020 Ordinary.svg",
  SE: "Swedish passport 2022.svg",
  UA: "Ukrainian Passport.svg",
  TR: "Turkish Passport.svg",
  PH: "Regular Philippine Passport.svg",
  CN: "People's Republic of China Passport 2012.svg",
  ID: "Indonesian Passport (2025).svg",
  RO: "Romania Passport (2024).svg",
  EG: "Egyptian Passport.svg",
  MA: "Moroccan passport.svg",
  MY: "Malaysia Passport.svg",
  TH: "Thai Passport V.3 (2020-2021).svg",
  RU: "Russian Passport (External).svg",
  IL: "Israeli Passport.svg",
}
export function PassportCover({code,name,large=false}:{code:string;name:string;large?:boolean}) {
 const [failed,setFailed]=useState(false)
 const filename=PASSPORT_COVER_FILES[code]
 const url=filename?'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(filename):null
 const source=filename?'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(filename):null
 return <span className={`inline-flex shrink-0 flex-col items-center gap-1 ${large?'w-28':'w-10'}`}>
 <span className={`inline-flex items-center justify-center overflow-hidden rounded-md border border-navy/15 bg-navy-deep text-white shadow-sm ${large?'h-40 w-28':'h-12 w-9'}`} title={`${name} passport`}>
 {url&&!failed?<img src={url} onError={()=>setFailed(true)} alt={`${name} passport cover illustration`} loading={large?'eager':'lazy'} className="h-full w-full object-contain" />:<span className="flex flex-col items-center gap-1 text-center"><BookOpen size={large?28:14} className="text-gold"/><span className={large?'text-xs':'text-[9px]'}>{code}</span></span>}
 </span>
 {large&&source&&!failed?<a href={source} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted underline">Image source</a>:null}
 </span>
}
