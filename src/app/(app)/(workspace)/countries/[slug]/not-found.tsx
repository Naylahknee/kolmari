import Link from 'next/link'

export default function CountryNotFound() {
  return <div className="card-surface mx-auto max-w-xl p-10 text-center"><h1 className="font-display text-3xl font-bold">Destination not found</h1><p className="mt-3 text-muted">That destination is not in the Kolmari directory yet.</p><Link href="/countries" className="gold-button mt-6">Browse Destinations</Link></div>
}
