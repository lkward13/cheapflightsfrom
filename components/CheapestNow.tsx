import Link from "next/link";
import { getCityName, getDestSlug } from "@/lib/city-mapping";
import { formatPrice } from "@/lib/utils";
import { isDomestic } from "@/lib/metro-data";
import type { CheapestNow as CheapestNowType } from "@/lib/queries";

interface CheapestNowProps {
  flights: CheapestNowType[];
  metroSlug: string;
  metroName: string;
}

export default function CheapestNow({
  flights,
  metroSlug,
  metroName,
}: CheapestNowProps) {
  if (flights.length === 0) return null;

  // Mix domestic and international: take cheapest of each
  const domestic = flights.filter((f) => isDomestic(f.destination));
  const international = flights.filter((f) => !isDomestic(f.destination));

  // Interleave: show a blend, capped at 12
  const mixed: CheapestNowType[] = [];
  let di = 0;
  let ii = 0;
  while (mixed.length < 12 && (di < domestic.length || ii < international.length)) {
    if (di < domestic.length) mixed.push(domestic[di++]);
    if (di < domestic.length) mixed.push(domestic[di++]);
    if (ii < international.length) mixed.push(international[ii++]);
  }

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Cheapest Flights Right Now
        </h2>
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        Live fares from {metroName} updated in the last 72 hours
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {mixed.map((flight) => {
          const destSlug = getDestSlug(flight.destination);
          const city = getCityName(flight.destination);
          const isIntl = !isDomestic(flight.destination);

          return (
            <Link
              key={`${flight.origin}-${flight.destination}`}
              href={`/cheap-flights-from-${metroSlug}/to-${destSlug}`}
              prefetch={false}
              className="group bg-white border border-gray-200 rounded-lg p-3 hover:border-brand-primary hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:text-brand-primary truncate">
                    {city}
                  </p>
                  <p className="text-xs text-gray-400">
                    {flight.destination}
                    {isIntl && (
                      <span className="ml-1 text-brand-primary">intl</span>
                    )}
                  </p>
                </div>
                <span className="text-lg font-bold text-brand-accent whitespace-nowrap ml-2">
                  {formatPrice(flight.price)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
