'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import {
  Bell,
  BookOpen,
  Calculator,
  Compass,
  ChevronDown,
  FileText,
  Globe2,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Menu,
  NotebookTabs,
  Route,
  Search,
  Settings,
  UserRound,
  X,
} from 'lucide-react'
import { Wordmark } from './wordmark'
import type { WizardStatus } from '@/lib/profile'

const navigation = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/nexitnation', label: 'Nexitnation Map', icon: MapPinned },
  { href: '/nextinations', label: 'My Nextination', icon: Compass },
  { href: '/pathways', label: 'Nexit Pathways', icon: Route },
  { href: '/countries', label: 'All Countries', icon: Globe2 },
  { href: '/cost-calculator', label: 'Cost Calculator', icon: Calculator },
  { href: '/nexit-plan', label: 'Nexit Plan', icon: NotebookTabs },
  { href: '/greenbook', label: 'Greenbook', icon: BookOpen },
  { href: '/documents', label: 'My Documents', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function AppShell({ children, email, wizardStatus }: { children: React.ReactNode; email: string; wizardStatus: WizardStatus }) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [noticesOpen, setNoticesOpen] = useState(false)
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false)
  const initials = email.slice(0, 1).toUpperCase()
  const mobilePrimary = navigation.filter(({ href }) => ['/dashboard', '/nexitnation', '/pathways', '/nexit-plan'].includes(href))
  const mobileMore = navigation.filter(({ href }) => !mobilePrimary.some((item) => item.href === href))
  const profileComplete = wizardStatus === 'completed'

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const query = String(form.get('query') ?? '').trim()
    router.push(query ? `/countries?q=${encodeURIComponent(query)}` : '/countries')
  }

  async function logout() {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-canvas md:grid md:grid-cols-[236px_1fr]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[236px] flex-col overflow-y-auto bg-navy-deep px-4 py-5 md:flex">
        <div className="px-2 pb-5 pt-1">
          <Link href="/dashboard" aria-label="Nexit home" className="inline-flex items-center gap-2.5">
            <Image src="/brand/nexit-butterfly.png" alt="" width={34} height={34} priority style={{ width: 34, height: 34 }} className="h-auto" />
            <span className="font-display text-2xl font-bold leading-none text-white"><span className="text-gold">N</span>exit</span>
          </Link>
        </div>
        <nav className="space-y-1" aria-label="Main navigation">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${active ? 'bg-gold text-navy' : 'text-[#9fb0cc] hover:bg-white/5 hover:text-white'}`}>
                <Icon size={18} />{label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-5 rounded-card border border-white/10 bg-navy-card p-4 text-center">
          <p className="text-xs font-semibold text-[#cdd7e8]">Nexit Readiness</p>
          <p className="mt-3 text-lg font-extrabold text-white">{profileComplete ? 'Profile complete' : 'Not Started'}</p>
          <Link href="/profile-wizard" className="mt-3 inline-flex text-xs font-bold text-gold">{profileComplete ? 'Edit Profile / Retake Wizard' : 'Start Wizard'}</Link>
        </div>
      </aside>

      <div className="min-w-0 md:col-start-2">
        <header className="sticky top-0 z-20 border-b border-line bg-canvas/95 px-4 py-3 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <div className="md:hidden"><Wordmark compact /></div>
            <form onSubmit={search} className="ml-auto hidden max-w-xl flex-1 items-center gap-2 rounded-field border border-line bg-white px-3 md:flex">
              <Search size={17} className="text-muted" />
              <input name="query" aria-label="Search Nextinations" placeholder="Search Nextinations, Pathways, and more..." className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none" />
            </form>
            <div className="relative">
              <button type="button" onClick={() => setNoticesOpen((value) => !value)} aria-label="Notifications" className="relative grid size-11 place-items-center rounded-xl border border-line bg-white text-navy">
                <Bell size={19} /><span className="absolute right-2.5 top-2.5 size-2 rounded-full border border-white bg-danger" />
              </button>
              {noticesOpen ? <div className="absolute right-0 top-13 w-72 rounded-card border border-line bg-white p-4 text-sm shadow-xl"><p className="font-bold">{profileComplete ? 'Your Nexit Profile is ready' : 'Personalized matches are off'}</p><p className="mt-1 text-muted">{profileComplete ? 'Review Nexit Pathways or continue your Nexit Plan.' : 'Complete your Nexit Profile to see personalized matches.'}</p></div> : null}
            </div>
            <div className="relative">
              <button type="button" onClick={() => setMenuOpen((value) => !value)} className="flex items-center gap-2 rounded-xl border border-line bg-white p-1.5 pr-3 text-sm font-semibold text-navy">
                <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-gold to-orange-400 text-white">{initials}</span>
                <span className="hidden max-w-32 truncate lg:block">{email.split('@')[0]}</span><ChevronDown size={14} />
              </button>
              {menuOpen ? <div className="absolute right-0 top-13 w-56 rounded-card border border-line bg-white p-2 shadow-xl"><Link href="/profile-wizard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-canvas"><UserRound size={16} />{profileComplete ? 'Edit Nexit Profile' : 'Start Nexit Profile'}</Link><Link href="/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-canvas"><Settings size={16} />Settings</Link><button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-canvas"><LogOut size={16} />Sign out</button></div> : null}
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">{children}</main>
      </div>

      {mobileMoreOpen ? (
        <div className="fixed inset-x-4 bottom-20 z-40 rounded-card border border-line bg-white p-3 shadow-2xl md:hidden">
          <div className="mb-2 flex items-center justify-between px-2 py-1">
            <p className="text-sm font-extrabold text-navy">More from Nexit</p>
            <button type="button" onClick={() => setMobileMoreOpen(false)} aria-label="Close more navigation" className="grid size-9 place-items-center rounded-lg text-muted"><X size={18} /></button>
          </div>
          <nav className="grid grid-cols-2 gap-1" aria-label="More navigation">
            {mobileMore.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileMoreOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-navy hover:bg-canvas">
                <Icon size={17} className="text-gold-deep" />{label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-line bg-white px-2 py-2 md:hidden" aria-label="Mobile navigation">
        {mobilePrimary.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return <Link key={href} href={href} className={`flex min-w-12 flex-col items-center gap-1 rounded-lg px-1 py-1 text-[10px] font-semibold ${active ? 'text-gold-deep' : 'text-muted'}`}><Icon size={20} /><span>{label.replace('Nexit Pathways', 'Pathways').replace('Nexitnation', 'Map').replace('Nexit Plan', 'Plan')}</span></Link>
        })}
        <button type="button" onClick={() => setMobileMoreOpen((value) => !value)} aria-expanded={mobileMoreOpen} className={`flex min-w-12 flex-col items-center gap-1 rounded-lg px-1 py-1 text-[10px] font-semibold ${mobileMoreOpen ? 'text-gold-deep' : 'text-muted'}`}><Menu size={20} /><span>More</span></button>
      </nav>
    </div>
  )
}
