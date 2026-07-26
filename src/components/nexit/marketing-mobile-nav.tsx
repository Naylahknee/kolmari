'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function MarketingMobileNav() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-marketing-menu"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        onClick={() => setOpen((v) => !v)}
        className="grid size-10 place-items-center rounded-xl border border-white/15"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <nav
          id="mobile-marketing-menu"
          aria-label="Mobile navigation"
          className="absolute right-0 top-12 w-64 rounded-[var(--radius-card)] border border-white/10 bg-navy-card p-3 shadow-2xl"
        >
          <div className="mb-2 px-2 py-1">
            <Link href="/" aria-label="Nexit home" onClick={() => setOpen(false)}>
              <Image
                src="/brand/NexitWordMark.svg"
                alt="Nexit"
                width={88}
                height={22}
                style={{ width: 'auto', height: 22 }}
                priority
              />
            </Link>
          </div>
          {[
            ['How it works', '#how-it-works'],
            ['Features', '#features'],
            ['Nextinations', '#nextinations'],
            ['Community', '#community'],
            ['Sign in', '/login'],
            ['Start Your Nexit', '/quiz'],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`block rounded-xl px-4 py-3 text-sm font-bold ${
                label === 'Start Your Nexit'
                  ? 'mt-1 bg-gold text-navy'
                  : 'text-white/80 hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
