import { CountrySnapshotMap } from '@/components/country-workspace/CountrySnapshotMap'
import { getCountryLocation } from '@/lib/maps/country-locations'

export function PlanHeaderLocator({ country, city }: { country: string | null; city: string | null }) {
  const location = getCountryLocation(country)
  if (!location) return null

  return (
    <div className="pointer-events-none absolute right-5 top-5 z-[1] hidden h-[132px] w-[250px] overflow-hidden rounded-card border border-white/15 opacity-45 shadow-card lg:block xl:w-[290px]" aria-hidden="true">
      <CountrySnapshotMap
        countryName={location.name}
        countryCode={location.code}
        cityName={city || location.city}
        lat={location.lat}
        lng={location.lng}
        alt={`Map showing ${city || location.city}, ${location.name}`}
        fallback="locator"
      />
    </div>
  )
}
