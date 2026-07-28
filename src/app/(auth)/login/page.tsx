import { AuthForm } from '@/components/kolmari/auth-form'
import { Wordmark } from '@/components/kolmari/wordmark'
import { safeNextPath } from '@/lib/navigation'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const nextPath = safeNextPath((await searchParams).next)
  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-5 py-12">
      <section className="card-surface w-full max-w-md p-7 sm:p-10">
        <Wordmark href="/login" />
        <p className="mt-8 text-sm font-bold uppercase tracking-[.18em] text-gold-deep">Welcome back</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-navy">Continue your Kolmari Plan.</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Sign in to return to your saved Pathways, budget, and Kolmari Tracker.
        </p>
        <AuthForm mode="login" nextPath={nextPath} />
      </section>
    </main>
  )
}
