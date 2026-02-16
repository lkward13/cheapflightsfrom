import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cache } from "react";
import { METRO_BY_SLUG } from "@/lib/metro-data";
import { getCityName, getDestSlug, findIataFromSlug } from "@/lib/city-mapping";
import {
  getRouteInsights,
  getRoutePriceTrend,
  getDestinationsForOrigins,
} from "@/lib/queries";
import { formatPrice, getCheapestMonths, generateBestTimeNarrative } from "@/lib/utils";
import PriceSummaryCard from "@/components/PriceSummaryCard";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import PriceTrend from "@/components/PriceTrend";
import BreadCrumb from "@/components/BreadCrumb";

export const revalidate = 43200; // ISR: 12 hours for deep route pages
export const dynamicParams = true; // Allow on-demand generation

const HUB_PREFIX = "cheap-flights-from-";
const DEST_PREFIX = "to-";

function parseParams(slug: string, destRoute: string) {
  if (!slug.startsWith(HUB_PREFIX)) return null;
  if (!destRoute.startsWith(DEST_PREFIX)) return null;
  const metroSlug = slug.slice(HUB_PREFIX.length);
  const destSlug = destRoute.slice(DEST_PREFIX.length);
  return { metroSlug, destSlug };
}

// Don't pre-generate 28K+ route pages at build time.
// They'll be generated on first visit and cached via ISR.
export async function generateStaticParams() {
  return [];
}

type PageProps = { params: Promise<{ slug: string; destRoute: string }> };

const getRouteCoreData = cache(async (slug: string, destRoute: string) => {
  const parsed = parseParams(slug, destRoute);
  if (!parsed) return null;

  const metro = METRO_BY_SLUG[parsed.metroSlug];
  if (!metro) return null;

  const destIata = findIataFromSlug(parsed.destSlug);
  if (!destIata) return null;

  const insights = await getRouteInsights(metro.airports, destIata);
  if (!insights) return null;

  return {
    metro,
    destIata,
    destCity: getCityName(destIata),
    insights,
  };
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, destRoute } = await params;
  const routeCore = await getRouteCoreData(slug, destRoute);
  if (!routeCore) return {};

  const cheapMonths = getCheapestMonths(routeCore.insights.monthly_typical || null, 3);

  return {
    title: `${routeCore.metro.displayName} to ${routeCore.destCity} Flights - From ${formatPrice(routeCore.insights?.low_price_threshold)}`,
    description: `${routeCore.metro.displayName} to ${routeCore.destCity} flights typically cost ${formatPrice(routeCore.insights?.typical_price)}. We've seen fares as low as ${formatPrice(routeCore.insights?.min_price_ever)}. Best months: ${cheapMonths.join(", ") || "varies"}.`,
  };
}

export default async function RoutePage({ params }: PageProps) {
  const { slug, destRoute } = await params;
  const routeCore = await getRouteCoreData(slug, destRoute);
  if (!routeCore) notFound();

  const { metro, destIata, destCity, insights } = routeCore;

  const [priceTrend, otherDests] = await Promise.all([
    getRoutePriceTrend(metro.airports, destIata),
    getDestinationsForOrigins(metro.airports),
  ]);

  const narrative = generateBestTimeNarrative(
    metro.displayName,
    destCity,
    insights.monthly_typical
  );

  const relatedDests = otherDests
    .filter((d) => d !== destIata)
    .slice(0, 12);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadCrumb
        items={[
          { label: "Home", href: "/" },
          {
            label: `Cheap Flights From ${metro.displayName}`,
            href: `/cheap-flights-from-${metro.slug}`,
          },
          { label: `To ${destCity}` },
        ]}
      />

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        Cheap Flights From {metro.displayName} to {destCity}
      </h1>

      <PriceSummaryCard
        typicalPrice={insights.typical_price}
        lowPrice={insights.low_price_threshold}
        highPrice={insights.high_price_threshold}
        allTimeLow={insights.min_price_ever}
        sampleSize={insights.sample_size}
        dataQuality={insights.data_quality}
      />

      <MonthlyCalendar
        data={insights.monthly_typical}
        title="Monthly Price Guide"
      />

      {narrative && (
        <section className="py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Best Time to Fly from {metro.displayName} to {destCity}
          </h2>
          <p className="text-gray-700 leading-relaxed">{narrative}</p>
        </section>
      )}

      <PriceTrend data={priceTrend} />

      {/* Booking link */}
      <section className="py-6">
        <a
          href={`https://www.google.com/travel/flights?q=flights+from+${insights.origin.trim()}+to+${destIata}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary transition-colors"
        >
          Search Flights on Google
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </section>

      {/* Related Routes */}
      {relatedDests.length > 0 && (
        <section className="py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Other Destinations From {metro.displayName}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {relatedDests.map((dest) => (
              <Link
                key={dest}
                href={`/cheap-flights-from-${metro.slug}/to-${getDestSlug(dest)}`}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm hover:border-brand-primary hover:shadow transition-all"
              >
                <span className="font-medium text-gray-800">
                  {getCityName(dest)}
                </span>
                <span className="text-xs text-gray-400 ml-1">({dest})</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
