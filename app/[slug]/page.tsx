import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { METRO_BY_SLUG, isDomestic } from "@/lib/metro-data";
import { getCityName } from "@/lib/city-mapping";
import {
  getHubDestinations,
  getDestinationCount,
  getRecentDeals,
  getCheapestFlightsNow,
  getAllHubDestinations,
} from "@/lib/queries";
import { formatPrice, getCheapestMonths } from "@/lib/utils";
import {
  getDestRegion,
  REGION_LABELS,
  REGION_ORDER,
  type DestRegion,
} from "@/lib/destination-regions";
import PriceTable from "@/components/PriceTable";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import CheapestNow from "@/components/CheapestNow";
import RegionTabs from "@/components/RegionTabs";
import type { RegionDestRow } from "@/components/RegionTabs";
import FAQSection from "@/components/FAQSection";
import EmailSignup from "@/components/EmailSignup";
import BreadCrumb from "@/components/BreadCrumb";

export const revalidate = 21600; // ISR: 6 hours (slightly longer hub cache)

const PREFIX = "cheap-flights-from-";

function extractMetroSlug(slug: string): string | null {
  if (!slug.startsWith(PREFIX)) return null;
  return slug.slice(PREFIX.length);
}

// Don't pre-generate all hub pages at build time to avoid DB connection limits.
// Pages are generated on first visit and cached via ISR (revalidate above).
export async function generateStaticParams() {
  return [];
}

type PageProps = { params: Promise<{ slug: string }> };

const getHubCoreData = cache(async (metroSlug: string) => {
  const metro = METRO_BY_SLUG[metroSlug];
  if (!metro) return null;

  const [destinations, destCount] = await Promise.all([
    getHubDestinations(metro.airports),
    getDestinationCount(metro.airports),
  ]);

  return { metro, destinations, destCount };
});

const getHubSupplementalData = cache(async (metroSlug: string) => {
  const metro = METRO_BY_SLUG[metroSlug];
  if (!metro) return null;

  const [recentDeals, cheapestNow, allDestinations] = await Promise.all([
    getRecentDeals(metro.airports),
    getCheapestFlightsNow(metro.airports, 30),
    getAllHubDestinations(metro.airports),
  ]);

  return { recentDeals, cheapestNow, allDestinations };
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const metroSlug = extractMetroSlug(slug);
  if (!metroSlug) return {};

  const core = await getHubCoreData(metroSlug);
  if (!core) return {};

  const cheapest = core.destinations[0]?.low_price_threshold;
  const codes = core.metro.airports.join(", ");

  return {
    title: `Cheap Flights From ${core.metro.displayName} - Deals from ${formatPrice(cheapest)}`,
    description: `Find cheap flights from ${core.metro.displayName} (${codes}). Fares as low as ${formatPrice(cheapest)}. We track ${core.destCount} destinations daily and alert you when prices drop.`,
    openGraph: {
      title: `Cheap Flights From ${core.metro.displayName}`,
      description: `Deals starting at ${formatPrice(cheapest)} from ${codes}`,
    },
  };
}

function deduplicateByDestination(
  rows: Awaited<ReturnType<typeof getHubDestinations>>
) {
  const best = new Map<string, (typeof rows)[number]>();
  for (const row of rows) {
    const existing = best.get(row.destination);
    if (
      !existing ||
      (row.low_price_threshold || 9999) < (existing.low_price_threshold || 9999)
    ) {
      best.set(row.destination, row);
    }
  }
  return [...best.values()];
}

/** Interleave domestic and international so both appear throughout the table */
function mixDomesticInternational(
  deduped: Awaited<ReturnType<typeof getHubDestinations>>
) {
  const domestic = deduped.filter((d) => isDomestic(d.destination));
  const international = deduped.filter((d) => !isDomestic(d.destination));

  // Sort each group by cheapest
  domestic.sort((a, b) => (a.low_price_threshold || 9999) - (b.low_price_threshold || 9999));
  international.sort((a, b) => (a.low_price_threshold || 9999) - (b.low_price_threshold || 9999));

  // Interleave: ~3 domestic per 1 international to create a natural mix
  const mixed: typeof deduped = [];
  let di = 0;
  let ii = 0;
  while (mixed.length < 50 && (di < domestic.length || ii < international.length)) {
    // Add up to 3 domestic
    for (let n = 0; n < 3 && di < domestic.length; n++) {
      mixed.push(domestic[di++]);
    }
    // Add 1 international
    if (ii < international.length) {
      mixed.push(international[ii++]);
    }
  }

  return mixed;
}

function aggregateMonthlyPrices(
  destinations: Awaited<ReturnType<typeof getHubDestinations>>
): Record<string, number> {
  const monthly: Record<string, number[]> = {};
  for (const dest of destinations) {
    if (!dest.monthly_typical) continue;
    for (const [month, price] of Object.entries(dest.monthly_typical)) {
      if (price > 0) {
        if (!monthly[month]) monthly[month] = [];
        monthly[month].push(price);
      }
    }
  }
  const result: Record<string, number> = {};
  for (const [month, prices] of Object.entries(monthly)) {
    result[month] = Math.round(
      prices.reduce((a, b) => a + b, 0) / prices.length
    );
  }
  return result;
}

export default async function HubPage({ params }: PageProps) {
  const { slug } = await params;
  const metroSlug = extractMetroSlug(slug);
  if (!metroSlug) notFound();

  const core = await getHubCoreData(metroSlug);
  const supplemental = await getHubSupplementalData(metroSlug);
  if (!core || !supplemental) notFound();

  const { metro, destinations, destCount } = core;
  const { recentDeals, cheapestNow, allDestinations } = supplemental;

  const dedupedAll = deduplicateByDestination(destinations);
  const deduped = mixDomesticInternational(dedupedAll);
  const monthlyAgg = aggregateMonthlyPrices(dedupedAll);
  const cheapMonths = getCheapestMonths(monthlyAgg, 3);

  // Build region-tagged destination list (deduplicated)
  const regionDestMap = new Map<string, RegionDestRow>();
  for (const d of allDestinations) {
    const existing = regionDestMap.get(d.destination);
    if (
      !existing ||
      (d.low_price_threshold || 9999) < (existing.low_price_threshold || 9999)
    ) {
      regionDestMap.set(d.destination, {
        destination: d.destination,
        low_price_threshold: d.low_price_threshold,
        typical_price: d.typical_price,
        region: getDestRegion(d.destination),
      });
    }
  }
  const regionDests = [...regionDestMap.values()].sort(
    (a, b) => (a.low_price_threshold || 9999) - (b.low_price_threshold || 9999)
  );

  // Count destinations per region
  const regionCounts = {} as Record<DestRegion, number>;
  for (const r of REGION_ORDER) regionCounts[r] = 0;
  for (const d of regionDests) regionCounts[d.region]++;

  // Count international destinations for FAQ
  const intlCount = regionDests.filter((d) => d.region !== "domestic").length;

  const airportDesc =
    metro.airports.length > 1
      ? `${metro.airports.join(", ")} airports`
      : `${metro.airports[0]} airport`;

  // Build international region summary for FAQ
  const intlRegionSummaries: string[] = [];
  for (const r of REGION_ORDER) {
    if (r === "domestic" || regionCounts[r] === 0) continue;
    const cheapest = regionDests.find((d) => d.region === r);
    if (cheapest) {
      intlRegionSummaries.push(
        `${REGION_LABELS[r]} (${regionCounts[r]} destinations, from ${formatPrice(cheapest.low_price_threshold)})`
      );
    }
  }

  const faqItems = [
    {
      question: `What is the cheapest flight from ${metro.displayName}?`,
      answer: deduped[0]
        ? `The cheapest flights from ${metro.displayName} are to ${getCityName(deduped[0].destination)} starting at ${formatPrice(deduped[0].low_price_threshold)}. We track ${destCount} destinations daily to find the best deals.`
        : `We track ${destCount} destinations from ${metro.displayName} daily. Check back for current deals.`,
    },
    {
      question: `When is the cheapest time to fly from ${metro.displayName}?`,
      answer: cheapMonths.length > 0
        ? `Based on our data, ${cheapMonths.join(", ")} tend to have the lowest fares from ${metro.displayName}. Prices vary by destination — check individual routes for specifics.`
        : `Prices vary by destination. Check individual route pages for the best months to fly.`,
    },
    ...(intlCount > 0
      ? [
          {
            question: `Can I find cheap international flights from ${metro.displayName}?`,
            answer: `Yes! We track ${intlCount} international destinations from ${metro.displayName} across ${intlRegionSummaries.length} regions: ${intlRegionSummaries.join("; ")}. Use the "Browse Destinations by Region" section above to explore flights by continent.`,
          },
        ]
      : []),
    {
      question: `How do I get flight deal alerts from ${metro.displayName}?`,
      answer: `Sign up for our free email alerts and we'll send you the best deals from ${airportDesc} as soon as we find them.`,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 page-shell">
      <BreadCrumb
        items={[
          { label: "Home", href: "/" },
          { label: `Cheap Flights From ${metro.displayName}` },
        ]}
      />

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
        Cheap Flights From {metro.displayName}
      </h1>
      <p className="text-gray-700 mb-6">
        We track prices to {destCount} destinations from {airportDesc} daily.
        Here are the best fares right now.
      </p>

      {deduped.length > 0 ? (
        <>
          {/* Cheapest flights right now (live matrix prices) */}
          <CheapestNow
            flights={cheapestNow}
            metroSlug={metro.slug}
            metroName={metro.displayName}
          />

          {/* Classic top destinations table */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Top Destinations
            </h2>
            <PriceTable destinations={deduped} metroSlug={metro.slug} />
          </section>

          {/* Region-tabbed browser */}
          <RegionTabs
            destinations={regionDests}
            metroSlug={metro.slug}
            regionCounts={regionCounts}
          />

          <MonthlyCalendar
            data={monthlyAgg}
            title={`Best Months to Fly From ${metro.displayName}`}
          />
        </>
      ) : (
        <p className="text-gray-500 py-8">
          We&apos;re still building price data for {metro.displayName}. Check back soon!
        </p>
      )}

      {recentDeals.length > 0 && (
        <section className="section-shell-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Recent Deals From {metro.displayName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentDeals.map((deal, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">
                    {deal.origin} → {getCityName(deal.destination)}
                  </span>
                  <span className="text-brand-accent font-bold">
                    {formatPrice(deal.price)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Found{" "}
                  {new Date(deal.sent_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Email signup */}
      <section className="bg-brand-dark rounded-xl p-6 lg:p-7 text-center my-6">
        <h2 className="text-2xl font-bold text-white mb-1">
          Get Deal Alerts From {metro.displayName}
        </h2>
        <EmailSignup darkBg defaultOrigin={metro.slug} />
      </section>

      <FAQSection items={faqItems} />
    </div>
  );
}
