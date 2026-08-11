'use client'

import { useEffect, useState } from 'react'

/**
 * Time-of-day greeting.
 *
 * The server has no reliable way to know the viewer's timezone, so it renders a
 * neutral "Welcome back" and this upgrades to the local time of day after mount.
 * That keeps the server and first client render identical (no hydration
 * mismatch) while still being accurate to the user's actual clock.
 */
export function Greeting({ firstName }: { firstName: string }) {
  const [prefix, setPrefix] = useState('Welcome back')

  useEffect(() => {
    const hour = new Date().getHours()
    setPrefix(hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening')
  }, [])

  return <>{prefix}, {firstName}.</>
}
