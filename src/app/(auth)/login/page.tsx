import Link from 'next/link'
import { AuthForm } from '@/components/kolmari/auth-form'
import { AuthShell } from '@/components/kolmari/auth-shell'
import { safeNextPath } from '@/lib/navigation'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  // Returning users land in the Command Center, per the Kolmari Flow design
  // (Screen 11: sign in skips straight to the Command Center).
  const nextPath = safeNextPath((await searchParams).next, '/command-center')
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Welcome back"
      subtitle="Pick up where your move left off."
    >
      <AuthForm mode="login" nextPath={nextPath} />
      <p className="mt-4 text-center text-sm text-muted">
        Have a demo code? <Link href="/demo" className="font-extrabold text-gold-deep">Explore the demo</Link>
      </p>
      <p className="mt-2 text-center text-sm text-muted">
        Just exploring? <Link href="/quiz" className="font-extrabold text-gold-deep">Take the Match Quiz</Link>
      </p>
    </AuthShell>
  )
}
