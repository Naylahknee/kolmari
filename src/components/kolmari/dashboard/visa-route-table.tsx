'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Building2,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Landmark,
  Laptop,
  Lock,
  ScrollText,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { flagSrc } from '@/lib/flags'
import type { PathwayGoal } from '@/lib/profile'
import type { CountryDetail } from '@/lib/countries'
import type { PathwayDefinition } from '@/lib/pathways'
import { summaryFor } from '@/lib/pathway-summary'
import type { VisaGroup } from './visa-info'

export type { VisaGroup }

const CATEGORY_ICON: Record<PathwayGoal, LucideIcon> = {
  'Remote Work': Laptop,
  Employment: Building2,
  Entrepreneurship: Briefcase,
  'Passive Income / Retirement': Landmark,
  Education: GraduationCap,
  'Family Reunification': Users,
  Ancestry: ScrollText,
  Investment: TrendingUp,
}

function formatReviewDate(iso: string): string {
  const parts = iso.split('-')
  if (parts.length !== 3) return iso
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[Number(parts[1]) - 1]
  if (!month) return iso
  return `${Number(parts[2])} ${month} ${parts[0]}`
}

function processingHeadline(processing: string): string {
  return processing === 'Varies' ? 'Varies by consulate' : processing
}

const COLUMN_HEAD = 'text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted-soft'

function RouteRow({ pathway, open, onToggle }: { pathway: PathwayDefinition; open: boolean; onToggle: () => void }) {
  const summary = summaryFor(pathway.id, pathway.name)
  const Icon = CATEGORY_ICON[pathway.category] ?? ScrollText
  const Chevron = open ? ChevronUp : ChevronDown

  return (
    <div className={open ? 'rounded-[14px] bg-[#fdf6e3] shadow-[inset_3px_0_0_0_var(--color-gold,#e8b400)]' : ''}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`visa-route-${pathway.id}`}
        className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 text-left sm:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:gap-6 ${open ? '' : 'transition-colors hover:bg-canvas/60'}`}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className={`grid size-11 flex-none place-items-center rounded-[10px] ${open ? 'bg-white text-navy shadow-sm' : 'bg-canvas text-navy'}`}>
            <Icon size={20} aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[14.5px] font-bold text-navy">{summary.shortName}</span>
            <span className="block truncate text-[12.5px] text-muted">{pathway.name}</span>
          </span>
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block text-[13px] font-bold text-navy">{summary.keyFact}</span>
          <span className="block text-[12px] text-muted-soft">Confirm the current threshold</span>
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block text-[13px] font-bold text-navy">{processingHeadline(summary.processing)}</span>
          <span className="block text-[12px] text-muted-soft">Confirm timing with the issuing authority</span>
        </span>
        <span className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-white">
          <Chevron size={18} aria-hidden="true" />
        </span>
      </button>

      {open && (
        <div id={`visa-route-${pathway.id}`} className="px-4 pb-4 sm:px-5">
          <div className="grid gap-3 rounded-[12px] border border-line/70 bg-white p-4 sm:grid-cols-2">
            <div className="flex gap-3">
              <span className="grid size-11 flex-none place-items-center rounded-[10px] bg-[#fdf6e3] text-navy">
                <Wallet size={20} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[13.5px] font-bold text-navy">Income requirement</span>
                <span className="mt-0.5 block text-[12.5px] leading-5 text-muted">{pathway.incomeThreshold}.</span>
              </span>
            </div>
            <div className="flex gap-3">
              <span className="grid size-11 flex-none place-items-center rounded-[10px] bg-[#fdf6e3] text-navy">
                <CalendarClock size={20} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[13.5px] font-bold text-navy">Processing details</span>
                <span className="mt-0.5 block text-[12.5px] leading-5 text-muted">{pathway.estimatedProcessingTime}.</span>
              </span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-3">
            <p className="text-[12px] text-muted-soft">Record review date: {formatReviewDate(pathway.lastVerified)}</p>
            <Link href="/pathways" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-navy hover:text-info">
              Explore this route <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Image-6 design: the researched visa routes for one country as an expandable
 * comparison table (route / financial requirement / processing). Free tiers see
 * route names only with the upgrade path; paid tiers see the full detail.
 */
export function VisaRouteTable({ group, detailed }: { group: VisaGroup; detailed: boolean }) {
  const [openId, setOpenId] = useState<string | null>(group.pathways[0]?.id ?? null)
  const country: CountryDetail = group.country

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image
            src={flagSrc(country.code)}
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-full border border-line object-cover"
          />
          <div>
            <h3 className="text-[21px] font-bold tracking-[-0.01em] text-navy">Visa options for {country.name}</h3>
            <p className="mt-0.5 text-[13px] text-muted">Compare the basics, then explore each route.</p>
          </div>
        </div>
        <Link
          href={`/nextinations/${country.slug}/v2/overview`}
          className="inline-flex items-center gap-1 text-[13px] font-bold text-navy hover:text-info"
        >
          {country.name} guide <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>

      {detailed ? (
        group.pathways.length > 0 ? (
          <div className="mt-4">
            <div className="hidden grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-6 px-4 sm:grid" aria-hidden="true">
              <p className={COLUMN_HEAD}>Visa route</p>
              <p className={COLUMN_HEAD}>Financial requirement</p>
              <p className={COLUMN_HEAD}>Processing</p>
              <span />
            </div>
            <div className="mt-1 divide-y divide-line/70">
              {group.pathways.map((pathway) => (
                <RouteRow
                  key={pathway.id}
                  pathway={pathway}
                  open={openId === pathway.id}
                  onToggle={() => setOpenId((current) => (current === pathway.id ? null : pathway.id))}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 rounded-[10px] border border-dashed border-line-strong bg-canvas px-4 py-3 text-[12px] leading-5 text-muted">
            No researched visa pathways are available for this country yet.
          </p>
        )
      ) : (
        <div className="mt-4">
          {group.pathways.length > 0 ? (
            <ul className="divide-y divide-line/70 rounded-[10px] border border-line">
              {group.pathways.map((pathway) => (
                <li key={pathway.id} className="px-4 py-3">
                  <p className="text-[13px] font-bold text-navy">{pathway.name}</p>
                  <p className="mt-0.5 text-[12px] text-muted-soft">{pathway.category}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-[10px] border border-dashed border-line-strong bg-canvas px-4 py-3 text-[12px] leading-5 text-muted">
              No researched visa pathways are available for this country yet.
            </p>
          )}
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted">
            <Lock size={13} className="text-gold-deep" aria-hidden="true" />
            <span>Showing route names only.</span>
            <Link href="/settings?tab=billing" className="inline-flex items-center gap-1 font-bold text-info hover:text-navy">
              Upgrade for requirements, timelines, and fees <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-4">
        <p className="max-w-[52ch] text-[11.5px] leading-5 text-muted-soft">
          Research preview. Confirm current requirements with the responsible authority.
        </p>
        <Link href="/pathways" className="gold-button">
          Explore {country.name} pathways <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
