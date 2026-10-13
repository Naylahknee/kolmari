'use client'
import { BookOpen } from 'lucide-react'

/** Register only images with verified sources and reuse permissions. */
const VERIFIED_COVERS: Record<string,string> = {}
export function PassportCover({ code, name, large=false }:{code:string;name:string;large?:boolean}) {
 const src=VERIFIED_COVERS[code]
 return <span className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-navy/15 bg-navy-deep text-white shadow-sm ${large?'h-40 w-28':'h-12 w-9'}`} title={`${name} passport`}>
 {src?<img src={src} alt={`${name} passport cover`} loading={large?'eager':'lazy'} className="h-full w-full object-contain" />:<span className="flex flex-col items-center gap-1 text-center"><BookOpen size={large?28:14} className="text-gold"/><span className={large?'text-xs':'text-[9px]'}>{code}</span></span>}
 </span>
}
