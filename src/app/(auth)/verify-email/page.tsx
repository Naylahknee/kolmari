import { redirect } from 'next/navigation'
import { AuthShell } from '@/components/kolmari/auth-shell'
import { VerifyEmailForm } from '@/components/kolmari/verify-email-form'
import { getCurrentUser } from '@/lib/auth'
import { isDemoEmail } from '@/lib/demo-identity'
import { safeNextPath } from '@/lib/navigation'
import { getEmailVerified, isEmailVerificationEnabled } from '@/lib/verification'

// Kolmari Flow design, Screen 5. Inert until RESEND_API_KEY is set: without it,
// everyone redirects through as if verification did not exist.
export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const nextPath = safeNextPath((await searchParams).next, '/command-center')
  if (
    !isEmailVerificationEnabled() ||
    isDemoEmail(user.email) ||
    (await getEmailVerified(Number(user.id)))
  ) {
    redirect(nextPath)
  }
  return (
    <AuthShell
      eyebrow="Check your inbox"
      title="Verify your email"
      subtitle={`Confirmation email sent to ${user.email}`}
    >
      <VerifyEmailForm nextPath={nextPath} />
    </AuthShell>
  )
}
