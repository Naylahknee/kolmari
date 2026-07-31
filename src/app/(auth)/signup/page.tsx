import { AuthForm } from '@/components/kolmari/auth-form'
import { AuthShell } from '@/components/kolmari/auth-shell'
import { safeNextPath } from '@/lib/navigation'

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const nextPath = safeNextPath((await searchParams).next)
  return (
    <AuthShell
      eyebrow="Build My Kolmari Plan"
      title="Your move, made clearer."
      subtitle="Create your secure workspace, then build your Move Plan."
    >
      <AuthForm mode="signup" nextPath={nextPath} />
    </AuthShell>
  )
}
