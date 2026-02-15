import Link from "next/link";
import { METROS_BY_REGION, REGION_LABELS, type Region } from "@/lib/metro-data";
import FAQSection from "@/components/FAQSection";

export const revalidate = 14400; // 4 hours

const REGIONS: Region[] = ["south", "west", "midwest", "northeast", "southeast"];

const FAQ_ITEMS = [
  {
    question: "Where are the cheapest places to fly?",
    answer:
      "The cheapest flights we find often include routes to Las Vegas, Cancun, New York City, Atlanta, Seattle, and Denver. Prices vary by origin city and time of year.",
  },
  {
    question: "How do I find discounted flights?",
    answer:
      "We track prices on thousands of routes daily using advanced algorithms. When we detect a fare drop significantly below the typical price, we flag it as a deal. Browse any origin city page to see current deals.",
  },
  {
    question: "Which is the cheapest flight ticket you've found?",
    answer:
      "We regularly find domestic fares under $50 and international fares 40-60% below typical prices. Deals can be found as low as $29 for domestic flights.",
  },
  {
    question: "How does Cheap Flights From find flight deals?",
    answer:
      "We use automated price tracking across thousands of routes, comparing current fares against historical data. When a price drops below the 25th percentile for a route, we flag it as a deal.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Pay Less. <span className="text-brand-sky">Travel More.</span>
          </h1>
          <p className="text-xl text-white/80 mb-6">
            Flight Deals From Your City To Your Favorite Destination
          </p>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            We track prices on thousands of routes daily and alert you when fares drop.
            Save more and search less.
          </p>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-brand-primary py-6 text-center">
        <p className="text-white/90 italic text-lg max-w-2xl mx-auto px-4">
          &ldquo;Whether you think you can, or whether you think you can&apos;t, you&apos;re right.&rdquo;
        </p>
      </section>

      {/* Browse by City */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Browse Cheap Flights By City
        </h2>
        <p className="text-center text-gray-500 mb-10">
          Choose your departure city to see the best deals and price trends
        </p>

        {REGIONS.map((region) => (
          <div key={region} className="mb-10">
            <h3 className="text-lg font-bold text-brand-primary mb-3 uppercase tracking-wider">
              {REGION_LABELS[region]}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {METROS_BY_REGION[region].map((metro) => (
                <Link
                  key={metro.slug}
                  href={`/cheap-flights-from-${metro.slug}`}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-brand-primary hover:shadow-md transition-all group"
                >
                  <span className="font-medium text-gray-800 group-hover:text-brand-primary transition-colors">
                    {metro.displayName}
                  </span>
                  <span className="text-xs text-gray-400 block mt-0.5">
                    {metro.airports.join(", ")}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Tips */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Top Tips For Finding Cheap Flights
          </h2>
          <div className="space-y-4">
            {[
              "Book at least three weeks ahead for the best prices. We also find last-minute deals within 1-7 days and share them in our alerts.",
              "June and July are typically the most expensive months to fly. January and February offer the lowest fares, but we find deals to sunny destinations year-round.",
              "Tuesdays and Wednesdays often have the most budget-friendly fares. For weekend trips to Vegas, try departing Wednesday or Friday.",
              "Domestic flights are often cheapest for 4-5 day trips. For international travel, look at 7, 10, or 14-day itineraries for the best value.",
              "Budget carriers like Frontier, Spirit, JetBlue, and Southwest often offer the lowest base fares from many airports.",
              "Flying Southwest? They let you check two bags free, and skis plus boots count as just one item.",
            ].map((tip, i) => (
              <div key={i} className="flex gap-3 bg-white rounded-lg p-4 shadow-sm">
                <span className="text-brand-primary font-bold text-lg shrink-0">
                  {i + 1}.
                </span>
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FAQSection items={FAQ_ITEMS} title="People Also Ask" />
      </section>
    </>
  );
}
