import { AuthShell } from '@/components/kolmari/auth-shell'
import { DemoForm } from '@/components/kolmari/demo-form'

/**
 * Demo entry. Accepts ?code= so a shared link lands the recipient on a
 * prefilled form. The code is only ever checked server-side in /api/demo.
 */
export default async function DemoPage({ searchParams }: { searchParams: Promise<{ code?: string | string[] }> }) {
  const raw = (await searchParams).code
  const code = typeof raw === 'string' ? raw.slice(0, 200) : ''
  return (
    <AuthShell
      eyebrow="Guided demo"
      title="Take Kolmari for a walk."
      subtitle="Enter your demo code to explore a fully populated Kolmari — matched destinations, visa pathways, and a live move plan."
    >
      <DemoForm initialCode={code} />
    </AuthShell>
  )
}
