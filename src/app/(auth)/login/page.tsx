import { AuthForm } from '@/components/kolmari/auth-form'
import { AuthShell } from '@/components/kolmari/auth-shell'
import { safeNextPath } from '@/lib/navigation'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const nextPath = safeNextPath((await searchParams).next)
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Continue My Move Plan."
      subtitle="Sign in to return to your saved Pathways, budget, and Progress Tracker."
    >
      <AuthForm mode="login" nextPath={nextPath} />
    </AuthShell>
  )
}
