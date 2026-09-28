'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Globe2, House, LayoutDashboard, Menu } from 'lucide-react'

const items = [
  { href: '/dashboard', label: 'Home', Icon: House },
  { href: '/your-world', label: 'Your World', Icon: Globe2 },
  { href: '/command-center', label: 'My Plan', Icon: LayoutDashboard },
]

export function MobileNav() {
  const pathname = usePathname()
  return <nav className="kolmari-mobile-nav" aria-label="Mobile navigation">
    {items.map(({ href, label, Icon }) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}><Icon size={21} aria-hidden="true" /><span>{label}</span></Link>)}
    <button type="button" onClick={() => document.body.classList.toggle('rail-collapsed')} aria-label="Open navigation menu"><Menu size={21} aria-hidden="true" /><span>Menu</span></button>
  </nav>
}
