import Image from 'next/image'
import { redirect } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { WelcomeActions } from '@/components/kolmari/welcome-actions'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'

const benefits = [
  'Personalized Destination matches',
  'Visa and residency Pathways',
  'Cost estimates',
  'Community Fit insights',
]

export default async function WelcomePage() {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  if (profile.wizard_status === 'completed') redirect('/dashboard')
  if (profile.wizard_status === 'skipped') redirect('/nexitnation')
  if (profile.wizard_status === 'in_progress') redirect('/profile-wizard')

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-navy-deep px-5 py-12 text-white">
      <Image src="/images/hero-airplane-window.png" alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/95 to-navy-deep/70" />
      <section className="relative z-10 w-full max-w-2xl rounded-[20px] border border-white/12 bg-navy-card/88 p-7 shadow-2xl backdrop-blur sm:p-10">
        <p className="text-sm font-extrabold uppercase tracking-[.2em] text-gold">Welcome to Kolmari</p>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Build Your Move Plan</h1>
        <p className="mt-4 max-w-xl leading-7 text-white/70">
          Answer a few questions so Kolmari can personalize destinations, Pathways, costs, and Community Fit.
        </p>
        <ul className="mt-7 grid gap-3 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2 text-sm">
              <CheckCircle2 size={17} className="text-gold" />{benefit}
            </li>
          ))}
        </ul>
        <WelcomeActions />
      </section>
    </main>
  )
}
