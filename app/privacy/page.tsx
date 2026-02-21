import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - CheapFlightsFrom.us",
  description: "Read the CheapFlightsFrom.us privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        Privacy Policy
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm text-gray-700 space-y-5 leading-relaxed">
        <p>
          CheapFlightsFrom.us respects your privacy. This page explains what data we
          collect, how we use it, and your options.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Information We Collect
          </h2>
          <p>
            When you sign up for deal alerts, we collect your email address and
            selected home city/metro so we can send relevant flight deals.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            How We Use Information
          </h2>
          <p>
            We use your information to deliver email deal alerts, improve site
            experience, and analyze usage trends. We do not sell your personal
            information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Cookies and Analytics
          </h2>
          <p>
            We may use cookies and similar technologies for basic functionality,
            performance measurement, and aggregate analytics.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Third-Party Services
          </h2>
          <p>
            We may rely on trusted third-party services (such as hosting, email
            delivery, and analytics providers) to operate the website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Your Choices
          </h2>
          <p>
            You can unsubscribe from emails at any time using the unsubscribe link
            in each message. You can also contact us to request updates or deletion
            of your subscriber record.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact</h2>
          <p>
            Questions about this policy can be sent to{" "}
            <a
              href="mailto:info@cheapflightsfrom.us"
              className="text-brand-primary hover:underline"
            >
              info@cheapflightsfrom.us
            </a>
            .
          </p>
        </section>

        <p className="text-sm text-gray-500">Last updated: February 2026</p>
      </div>
    </div>
  );
}
