import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — Kolmari',
  description: 'How Kolmari collects, uses, and protects your information, in plain language.',
}

// Plain-language privacy policy. Mirrors what the product actually does:
// account + quiz data, Resend for verification email, no data selling.
const sections = [
  {
    heading: 'What we collect',
    body: [
      'Account information: your name, email address, and password (stored securely, never in readable form).',
      'Your planning data: quiz answers, household details, destinations you save, and checklist progress.',
      'Basic usage information: pages you visit and actions you take, so we can keep the service working and improve it.',
    ],
  },
  {
    heading: 'How we use it',
    body: [
      'To run Kolmari: signing you in, saving your profile, showing your destinations and plan.',
      'To communicate with you: verification codes when you sign up, and important notices about your account. We do not send marketing email you did not ask for.',
      'To improve the product: understanding which features people use, in aggregate.',
    ],
  },
  {
    heading: 'Email delivery',
    body: [
      'We send verification emails through Resend, our email delivery provider. Your email address is shared with them only to deliver messages you triggered, like a verification code.',
    ],
  },
  {
    heading: 'What we never do',
    body: [
      'We do not sell your personal information. We do not share your planning data with advertisers or data brokers.',
    ],
  },
  {
    heading: 'Cookies',
    body: [
      'Kolmari uses a small number of cookies to keep you signed in and remember basic preferences. There is no third-party advertising tracking.',
    ],
  },
  {
    heading: 'Your control',
    body: [
      'You can review and update your account information at any time. You can delete your account and all stored data at any time from your account settings. Deletion is permanent.',
      'If you want a copy of your data or have questions about it, contact support@kolmari.com.',
    ],
  },
  {
    heading: 'Security',
    body: [
      'We protect your data with industry-standard measures, including encrypted connections and hashed passwords. No system is perfectly secure, so we keep what we store to the minimum the product needs.',
    ],
  },
  {
    heading: 'Children',
    body: [
      'Kolmari is not intended for children under 13. We do not knowingly collect information from children under 13.',
    ],
  },
  {
    heading: 'Changes to this policy',
    body: [
      'We may update this policy as Kolmari changes. If we make a meaningful change, we will tell you in the app before it takes effect.',
    ],
  },
  {
    heading: 'Contact',
    body: [
      'Questions about your privacy? Reach us at support@kolmari.com.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-gold-deep">
        <ArrowLeft size={15} aria-hidden="true" /> Back to home
      </Link>
      <p className="mt-8 text-xs font-bold uppercase tracking-widest text-muted">Last updated September 28, 2026</p>
      <h1 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">Privacy Policy</h1>
      <p className="mt-4 text-base leading-7 text-muted">
        The short version: we collect what the product needs to work, we never sell your data,
        and you can delete everything whenever you want.
      </p>
      <div className="mt-10 space-y-10">
        {sections.map(section => (
          <section key={section.heading}>
            <h2 className="text-xl font-extrabold text-navy">{section.heading}</h2>
            <div className="mt-3 space-y-3">
              {section.body.map((paragraph, index) => (
                <p key={index} className="text-base leading-7 text-muted">{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="mt-12 rounded-2xl bg-gold-soft px-6 py-5">
        <p className="text-sm leading-6 text-navy">
          Also see our <Link href="/terms" className="font-extrabold text-gold-deep underline">Terms of Service</Link> for
          the rules of using Kolmari.
        </p>
      </div>
    </main>
  )
}
