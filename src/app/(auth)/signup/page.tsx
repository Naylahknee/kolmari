import { AuthForm } from '@/components/kolmari/auth-form'
import { AuthShell } from '@/components/kolmari/auth-shell'
import { safeNextPath } from '@/lib/navigation'

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  // New accounts land straight in the profile wizard (the lane picker), per the
  // owner-approved onboarding flow. /welcome remains available as a route.
  const nextPath = safeNextPath((await searchParams).next, '/profile-wizard')
  return (
    <AuthShell
      eyebrow="Save your starting point"
      title="Create account"
      subtitle="Free. Your quiz answers, destinations and checklist live here."
      panelKicker="Next: set up your Command Center"
      panelCopy="A few questions about how you want to approach the move, then your checklist is built for you."
    >
      <AuthForm mode="signup" nextPath={nextPath} />
    </AuthShell>
  )
}
