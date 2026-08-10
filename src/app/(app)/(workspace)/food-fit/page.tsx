import type { Metadata } from 'next'
import { requireCurrentUser } from '@/lib/auth'
import { FoodCultureFilter } from '@/components/kolmari/food-culture-filter'

export const metadata: Metadata = {
  title: 'Food & Health | Kolmari',
  description: 'Filter destinations by cuisine archetype and tracked allergens to see where the food culture fits your household.',
}

export default async function FoodFitPage() {
  await requireCurrentUser()
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
      <FoodCultureFilter />
    </main>
  )
}
