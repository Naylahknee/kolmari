import { SavedNextinations } from '@/components/nexit/saved-nextinations'

export default function DestinationsPage() {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Your shortlist</p>
      <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">Destinations</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        Keep the places you want to compare close while you review Pathways, costs, and Community Fit.
      </p>
      <SavedNextinations />
    </div>
  )
}
