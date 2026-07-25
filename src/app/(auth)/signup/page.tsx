import { AuthForm } from '@/components/nexit/auth-form'
import { Wordmark } from '@/components/nexit/wordmark'
import { safeNextPath } from '@/lib/navigation'

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const nextPath = safeNextPath((await searchParams).next)
  return (
    <main className="grid min-h-screen place-items-center bg-navy-deep px-5 py-12">
      <section className="w-full max-w-md rounded-[22px] bg-white p-7 shadow-2xl sm:p-10">
        <Wordmark href="/signup" />
        <p className="mt-8 text-sm font-bold uppercase tracking-[.18em] text-gold-deep">Start Your Nexit</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-navy">Build your Nexit Plan.</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Create your secure Nexit workspace, then build your Nexit Profile.
        </p>
        <AuthForm mode="signup" nextPath={nextPath} />
      </section>
    </main>
  )
}
