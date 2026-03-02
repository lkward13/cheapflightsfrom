import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Use CheapFlightsFrom.us",
  description:
    "Get the most from CheapFlightsFrom.us: browse deals by city, sign up for email alerts, and find the best flight prices.",
};

export default function HowToUsePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        How to Get the Most From CheapFlightsFrom.us
      </h1>

      <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
        <p>
          We make it easy to find flight deals from your city. Here&apos;s how to use the site
          and never miss a great fare.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">
          1. Browse Deals by Your City
        </h2>
        <p>
          Start on the{" "}
          <Link href="/" className="text-brand-primary hover:underline font-medium">
            homepage
          </Link>{" "}
          and select your departure city. Each city page shows the best current deals from that
          metro, sorted by price and destination. Click any deal to see more details and book
          directly on Google Flights.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">
          2. Sign Up for Email Alerts
        </h2>
        <p>
          The best deals often sell out in 24–72 hours. Sign up for free email alerts and we&apos;ll
          notify you when we find great fares from your city. No spam — we only send when there are
          real deals worth sharing.
        </p>
        <p>
          <strong>Tip:</strong> Add <strong>deals@cheapflightsfrom.us</strong> to your contacts and
          move our emails to your Inbox (not Spam) so you never miss an alert.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">
          3. Explore Route Pages
        </h2>
        <p>
          Each route (e.g., Dallas → Cancun) has its own page with price trends and historical
          data. Use these to decide if a fare is worth booking now or if you should wait for a
          better price.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">
          4. What to Expect From Our Emails
        </h2>
        <p>
          We send deal emails 2–3 times per week when we find fares that beat our historical
          thresholds. Each email includes:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Fire deals (exceptional prices) and great deals (solid discounts)</li>
          <li>Direct links to book on Google Flights</li>
          <li>Links to our site for more route details</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">
          5. Book When You See a Deal
        </h2>
        <p>
          Flight deals don&apos;t last long. When you get an alert for a route you&apos;re
          interested in, act quickly. Our links take you straight to Google Flights so you can
          book in a few clicks.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">
          Questions?
        </h2>
        <p>
          Check out our{" "}
          <Link href="/about" className="text-brand-primary hover:underline font-medium">
            About
          </Link>{" "}
          page for more on how we find deals, or{" "}
          <Link href="/contact" className="text-brand-primary hover:underline font-medium">
            contact us
          </Link>{" "}
          if you need help.
        </p>

        <div className="mt-10 pt-6 border-t border-gray-200">
          <Link
            href="/"
            className="inline-block bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
          >
            Browse Flight Deals →
          </Link>
        </div>
      </div>
    </div>
  );
}
