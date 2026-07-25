import type { Metadata } from 'next'
import { NexitWorldBoard } from '@/components/nexit/NexitWorldBoard'

export const metadata: Metadata = {
  title: 'Nexit World | Nexit',
  description: 'Your relocation planning board — save destinations, track their status, and plan your Nexit on a world map.',
}

export default function NexitWorldPage() {
  return <NexitWorldBoard />
}
