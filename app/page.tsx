import Link from "next/link";
import Image from "next/image";
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
      <section className="relative text-white py-20 sm:py-24 lg:py-32 px-4 overflow-hidden border-b border-white/15">
        <Image
          src="/hero.jpg"
          alt="Scenic travel destination"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/65" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="bg-brand-dark/45 border border-white/20 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-[1px]">
            <p className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-brand-gold bg-black/30 border border-brand-gold/40 rounded-full px-4 py-1.5 mb-4">
              Live Fare Tracking Across Thousands of Routes
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-lg">
              <span className="text-brand-gold">Pay Less.</span>{" "}
              <span className="text-white">Travel More.</span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-white font-semibold mb-3 drop-shadow-lg">
              Flight Deals From Your City To Your Favorite Destination
            </p>
            <p className="text-lg sm:text-xl text-white/95 max-w-3xl mx-auto drop-shadow-lg">
              We track prices on thousands of routes daily and alert you when fares drop.
              Save more and search less.
            </p>
            <EmailSignup darkBg />
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-brand-primary py-6 text-center border-b border-brand-dark/10">
        <p className="text-white/90 italic text-lg sm:text-xl max-w-3xl mx-auto px-4">
          &ldquo;Whether you think you can, or whether you think you can&apos;t, you&apos;re right.&rdquo;
        </p>
      </section>

      {/* Browse by City */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-shell-lg">
        <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 section-title">
          Browse Cheap Flights By City
        </h2>
        <p className="text-center text-gray-600 text-lg section-subtitle">
          Choose your departure city to see the best deals and price trends
        </p>

        {REGIONS.map((region) => (
          <div key={region} className="mb-10">
            <h3 className="text-lg font-bold text-brand-primary mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-10 h-0.5 bg-brand-primary rounded-full" />
              {REGION_LABELS[region]}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4">
              {METROS_BY_REGION[region].map((metro) => (
                <Link
                  key={metro.slug}
                  href={`/cheap-flights-from-${metro.slug}`}
                  className="relative bg-white border border-gray-200 rounded-xl px-5 py-4 lg:px-6 lg:py-5 shadow-sm hover:border-brand-primary/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-primary to-brand-gold rounded-l-xl opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                  <div className="absolute top-0 right-0 h-8 w-8 bg-[rgba(56,183,255,0.06)] rounded-bl-xl" />
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors lg:text-lg block">
                        {metro.displayName}
                      </span>
                      <span className="text-xs lg:text-sm text-gray-500 mt-1 block">
                        {metro.airports.join(", ")}
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-brand-primary/75 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Tips */}
      <section className="bg-gradient-to-b from-gray-50 to-white section-shell-lg px-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-2">
            Top Tips For Finding Cheap Flights
          </h2>
          <p className="text-center text-gray-600 mb-8 text-lg">
            Quick wins that consistently cut flight costs.
          </p>
          <div className="space-y-3 lg:space-y-4">
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
              <div key={i} className="flex gap-4 bg-white rounded-xl p-4 lg:p-5 shadow-md border border-gray-100">
                <span className="text-brand-primary font-bold text-xl shrink-0 bg-brand-primary/10 h-8 w-8 rounded-full inline-flex items-center justify-center">
                  {i + 1}.
                </span>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{tip.title}</p>
                  <p className="text-gray-600 mt-1 lg:text-lg leading-relaxed">{tip.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 section-shell">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-md">
          <FAQSection items={FAQ_ITEMS} title="People Also Ask" />
        </div>
      </section>
    </>
  );
}
