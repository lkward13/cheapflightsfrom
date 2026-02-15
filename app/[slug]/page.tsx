import { Metadata } from "next";
import { notFound } from "next/navigation";
import { METROS, METRO_BY_SLUG, isDomestic } from "@/lib/metro-data";
import { getCityName } from "@/lib/city-mapping";
import { getHubDestinations, getDestinationCount, getRecentDeals } from "@/lib/queries";
import { formatPrice, getCheapestMonths } from "@/lib/utils";
import PriceTable from "@/components/PriceTable";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import FAQSection from "@/components/FAQSection";
import BreadCrumb from "@/components/BreadCrumb";

export const revalidate = 14400; // ISR: 4 hours

const PREFIX = "cheap-flights-from-";

function extractMetroSlug(slug: string): string | null {
  if (!slug.startsWith(PREFIX)) return null;
  return slug.slice(PREFIX.length);
}

export async function generateStaticParams() {
  return METROS.map((metro) => ({ slug: `${PREFIX}${metro.slug}` }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const metroSlug = extractMetroSlug(slug);
  if (!metroSlug) return {};

  const metro = METRO_BY_SLUG[metroSlug];
  if (!metro) return {};

  const destinations = await getHubDestinations(metro.airports);
  const cheapest = destinations[0]?.low_price_threshold;
  const destCount = await getDestinationCount(metro.airports);
  const codes = metro.airports.join(", ");

  return {
    title: `Cheap Flights From ${metro.displayName} - Deals from ${formatPrice(cheapest)}`,
    description: `Find cheap flights from ${metro.displayName} (${codes}). Fares as low as ${formatPrice(cheapest)}. We track ${destCount} destinations daily and alert you when prices drop.`,
    openGraph: {
      title: `Cheap Flights From ${metro.displayName}`,
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

  const metro = METRO_BY_SLUG[metroSlug];
  if (!metro) notFound();

  const [destinations, destCount, recentDeals] = await Promise.all([
    getHubDestinations(metro.airports),
    getDestinationCount(metro.airports),
    getRecentDeals(metro.airports),
  ]);

  const dedupedAll = deduplicateByDestination(destinations);
  const deduped = mixDomesticInternational(dedupedAll);
  const monthlyAgg = aggregateMonthlyPrices(dedupedAll);
  const cheapMonths = getCheapestMonths(monthlyAgg, 3);

  const airportDesc =
    metro.airports.length > 1
      ? `${metro.airports.join(", ")} airports`
      : `${metro.airports[0]} airport`;

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
    {
      question: `How do I get flight deal alerts from ${metro.displayName}?`,
      answer: `Sign up for our free email alerts and we'll send you the best deals from ${airportDesc} as soon as we find them.`,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadCrumb
        items={[
          { label: "Home", href: "/" },
          { label: `Cheap Flights From ${metro.displayName}` },
        ]}
      />

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
        Cheap Flights From {metro.displayName}
      </h1>
      <p className="text-gray-600 mb-8">
        We track prices to {destCount} destinations from {airportDesc} daily.
        Here are the best fares right now.
      </p>

      {deduped.length > 0 ? (
        <>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Top Destinations
            </h2>
            <PriceTable destinations={deduped} metroSlug={metro.slug} />
          </section>

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
        <section className="py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
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

      <FAQSection items={faqItems} />
    </div>
  );
}
