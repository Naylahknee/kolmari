import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service — Kolmari',
  description: 'The plain-language terms for using Kolmari.',
}

// Plain-language terms. Kolmari is a planning tool, not a law firm, so the
// terms say that up front and keep everything else short and readable.
const sections = [
  {
    heading: 'What Kolmari is',
    body: [
      'Kolmari is a relocation planning tool. It helps you compare destinations, understand visa pathways, and organize a move plan.',
      'Kolmari is not legal, immigration, financial, or tax advice. Visa rules change often and vary by country. Always confirm requirements with official government sources or a qualified professional before making decisions.',
    ],
  },
  {
    heading: 'Your account',
    body: [
      'You need an account to use Kolmari. You are responsible for keeping your password private and for everything done under your account.',
      'Provide accurate information when you sign up. One account per person. You must be at least 13 years old to use Kolmari.',
    ],
  },
  {
    heading: 'What you agree not to do',
    body: [
      'Use Kolmari only for lawful purposes. Do not abuse, overload, or attempt to break the service. Do not scrape content at scale, resell access, or use Kolmari to harm others.',
      'If you do these things, we may suspend or close your account.',
    ],
  },
  {
    heading: 'Your data',
    body: [
      'What you put into Kolmari stays yours. You give us permission to store and process it so the service can work: showing your profile, your destinations, and your plan.',
      'You can delete your account and stored data at any time from your account settings. Deletion is permanent.',
    ],
  },
  {
    heading: 'Plans and pricing',
    body: [
      'Kolmari is launching with a free plan. Paid plans may be added later. If that happens, we will explain exactly what each plan includes before you pay for anything.',
    ],
  },
  {
    heading: 'Availability',
    body: [
      'We work to keep Kolmari running, but we cannot promise it will always be available or error-free. We may update or change features as the product grows.',
    ],
  },
  {
    heading: 'Changes to these terms',
    body: [
      'We may update these terms as Kolmari changes. If we make a meaningful change, we will tell you in the app. Continuing to use Kolmari after a change means you accept the updated terms.',
    ],
  },
  {
    heading: 'Contact',
    body: [
      'Questions about these terms? Reach us at support@kolmari.com.',
    ],
  },
]

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-gold-deep">
        <ArrowLeft size={15} aria-hidden="true" /> Back to home
      </Link>
      <p className="mt-8 text-xs font-bold uppercase tracking-widest text-muted">Last updated September 28, 2026</p>
      <h1 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">Terms of Service</h1>
      <p className="mt-4 text-base leading-7 text-muted">
        The short version: Kolmari is a planning tool, not legal advice. Treat your account responsibly,
        your data stays yours, and you can delete everything whenever you want.
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
          Also see our <Link href="/privacy" className="font-extrabold text-gold-deep underline">Privacy Policy</Link> for
          how we handle your information.
        </p>
      </div>
    </main>
  )
}
