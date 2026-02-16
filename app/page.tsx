import Link from "next/link";
import { METROS_BY_REGION, REGION_LABELS, type Region } from "@/lib/metro-data";
import FAQSection from "@/components/FAQSection";
import EmailSignup from "@/components/EmailSignup";

export const revalidate = 14400; // 4 hours

const REGIONS: Region[] = ["south", "west", "midwest", "northeast", "southeast"];

const FAQ_ITEMS = [
  {
    question: "Where are the cheapest places to fly?",
    answer:
      "The cheapest domestic flights are typically to hub cities like Atlanta, Denver, Las Vegas, and Chicago where airline competition drives prices down. For international travel, Cancun, San Juan, and Guatemala City are consistently among the lowest fares from most US cities. Browse your departure city page to see what's cheapest right now.",
  },
  {
    question: "How far in advance should I book flights?",
    answer:
      "For domestic flights, 3-5 weeks ahead is the sweet spot. International fares are best booked 6-8 weeks out. Booking too early (3+ months) or too late (under a week) usually costs more. That said, we regularly find last-minute deals that beat the average -- that's why our email alerts are so valuable.",
  },
  {
    question: "How does Cheap Flights From find deals?",
    answer:
      "We scan thousands of routes daily using automated price-tracking systems. Every fare is compared against months of historical pricing data for that specific route. When a price drops below the 25th percentile -- meaning it's cheaper than 75% of all fares we've ever seen on that route -- we flag it as a deal and send it to subscribers.",
  },
  {
    question: "Are budget airline deals worth it?",
    answer:
      "It depends on your bags. Airlines like Frontier and Spirit offer very low base fares, but checked bag fees ($35-65 each way) can erase the savings. If you can travel with just a personal item, budget carriers are great. If you need bags, compare the total cost against major airlines -- sometimes a $150 Delta fare beats a $79 Spirit fare after bag fees.",
  },
  {
    question: "How long do flight deals last?",
    answer:
      "Most deals last 24-72 hours before prices go back up. Some especially popular routes sell out in under 12 hours. That's why we recommend signing up for email alerts so you can act fast when we spot a price drop.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative text-white py-24 sm:py-32 px-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-brand-dark/50" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-lg">
            <span className="text-brand-gold">Pay Less.</span>{" "}
            <span className="text-white">Travel More.</span>
          </h1>
          <p className="text-xl text-white/90 mb-6 drop-shadow">
            Flight Deals From Your City To Your Favorite Destination
          </p>
          <p className="text-lg text-white/70 max-w-2xl mx-auto drop-shadow">
            We track prices on thousands of routes daily and alert you when fares drop.
            Save more and search less.
          </p>
          <EmailSignup darkBg />
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
              {
                title: "Book 3-8 weeks out for the sweet spot",
                body: "Domestic flights are cheapest 3-5 weeks before departure. International fares hit their lowest 6-8 weeks ahead. We also catch last-minute drops within 1-7 days and share them instantly in our alerts.",
              },
              {
                title: "Fly in January, February, or September",
                body: "These are consistently the cheapest months to fly. June and July are the priciest. Shoulder seasons (April-May, October-November) are great for deals to popular vacation spots without peak crowds.",
              },
              {
                title: "Be flexible on your travel day",
                body: "Tuesdays and Wednesdays often have the lowest fares. For weekend getaways, try departing on a Wednesday and returning on a Monday. A one-day shift can save you $50-100+ per ticket.",
              },
              {
                title: "Compare total cost, not just the base fare",
                body: "Budget carriers like Frontier and Spirit advertise low fares, but bag fees add up fast. Always compare the total cost with bags included. A $30 \"cheap\" fare with $70 in bag fees isn't a deal.",
              },
              {
                title: "Use Google Flights' date grid and price tracking",
                body: "The date grid shows prices across an entire month at a glance. Turn on price tracking for routes you're watching. We do this across thousands of routes daily so you don't have to.",
              },
              {
                title: "Consider nearby airports",
                body: "Flying into a secondary airport can save serious money. Think Oakland instead of SFO, Fort Lauderdale instead of Miami, or Midway instead of O'Hare. Our metro pages already combine nearby airports so you see every option.",
              },
              {
                title: "Book one-way tickets for more flexibility",
                body: "Mixing airlines on separate one-way tickets often beats a round-trip fare. Fly out on one carrier and back on another to combine the cheapest options each way.",
              },
              {
                title: "Set it and forget it with deal alerts",
                body: "The best deals sell out in 24-72 hours. Sign up for our free email alerts and we'll notify you the moment fares drop on your routes -- no need to check every day.",
              },
            ].map((tip, i) => (
              <div key={i} className="flex gap-3 bg-white rounded-lg p-4 shadow-sm">
                <span className="text-brand-primary font-bold text-lg shrink-0">
                  {i + 1}.
                </span>
                <div>
                  <p className="font-semibold text-gray-900">{tip.title}</p>
                  <p className="text-gray-600 mt-1">{tip.body}</p>
                </div>
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
