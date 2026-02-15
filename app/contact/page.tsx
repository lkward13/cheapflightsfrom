import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - CheapFlightsFrom.us",
  description: "Get in touch with the CheapFlightsFrom.us team.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <p className="text-gray-700 mb-6">
          Have a question, suggestion, or just want to say hello? We&apos;d love to hear from you.
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-brand-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900">Email</h3>
              <a href="mailto:lkward13@gmail.com" className="text-brand-primary hover:underline">
                lkward13@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-brand-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900">Website</h3>
              <a href="https://cheapflightsfrom.us" className="text-brand-primary hover:underline">
                cheapflightsfrom.us
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-brand-light rounded-lg">
          <p className="text-sm text-brand-dark">
            <strong>Tip:</strong> Want flight deal alerts from your city? Browse your city&apos;s page
            to see current deals and sign up for email alerts.
          </p>
        </div>
      </div>
    </div>
  );
}
