import { redirect } from 'next/navigation'

export default function DocumentsPage() {
  redirect('/command-center?tab=documents')
}
