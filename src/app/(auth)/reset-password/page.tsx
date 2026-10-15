import Link from 'next/link'
import { AuthShell } from '@/components/kolmari/auth-shell'
import { ResetPasswordForm } from '@/components/kolmari/reset-password-form'
import { isPasswordResetEnabled } from '@/lib/password-reset'

export default function ResetPasswordPage() {
  const enabled = isPasswordResetEnabled()
  return (
    <AuthShell eyebrow="Locked out?" title="Reset your password" subtitle="We will email you a code to choose a new one.">
      {enabled ? (
        <ResetPasswordForm />
      ) : (
        <p className="mt-8 text-sm text-muted">
          Password reset by email is not set up yet. Please contact support and we will help you back in.
        </p>
      )}
      <p className="mt-4 text-center text-sm text-muted">
        Remembered it?{' '}
        <Link href="/login" className="font-extrabold text-gold-deep">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
