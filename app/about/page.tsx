import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - CheapFlightsFrom.us",
  description: "Learn how CheapFlightsFrom.us tracks flight prices and finds deals from your city.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">About Us</h1>

      <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
        <p>
          <strong>CheapFlightsFrom.us</strong> was built for one reason: finding flight deals
          shouldn&apos;t be a full-time job. We track thousands of routes daily using advanced
          price-monitoring algorithms so you don&apos;t have to.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">How It Works</h2>
        <p>
          Our system monitors flight prices across major U.S. airports multiple times a day.
          We compare current fares against historical pricing data to identify when a route is
          significantly cheaper than usual.
        </p>
        <p>
          When we find a deal, we surface it on our city-specific pages and can send it to your
          inbox. No noise, no spam — just real deals worth booking.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">What Makes a &ldquo;Deal&rdquo;?</h2>
        <p>
          A deal isn&apos;t just a low price — it&apos;s a price that&apos;s significantly lower than what
          the route typically costs. We calculate the 25th percentile (&ldquo;deal threshold&rdquo;) for
          each route based on historical data. Fares below this threshold are flagged as deals.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">Our Coverage</h2>
        <p>
          We currently track 90+ metro areas across the United States, covering over 100 airports.
          Our price database spans thousands of domestic and international routes with months of
          historical pricing data.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">Get In Touch</h2>
        <p>
          Have a question or suggestion? We&apos;d love to hear from you. Drop us a line at{" "}
          <a href="mailto:lkward13@gmail.com" className="text-brand-primary hover:underline">
            lkward13@gmail.com
          </a>.
        </p>
      </div>
    </div>
  );
}
