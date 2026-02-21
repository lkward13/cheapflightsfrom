import Link from "next/link";
import { METROS } from "@/lib/metro-data";

const POPULAR_CITIES = ["new-york-city", "los-angeles", "chicago", "miami", "dallas", "atlanta", "denver", "seattle"];

export default function NotFound() {
  const popular = METROS.filter((m) => POPULAR_CITIES.includes(m.slug));

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <p className="text-6xl font-extrabold text-brand-primary mb-4">404</p>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
        Page Not Found
      </h1>
      <p className="text-gray-500 mb-10 max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Try browsing deals from one of our popular cities instead.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {popular.map((metro) => (
          <Link
            key={metro.slug}
            href={`/cheap-flights-from-${metro.slug}`}
            className="block rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm font-medium text-gray-700 shadow-sm hover:border-brand-primary hover:text-brand-primary transition-colors"
          >
            {metro.displayName}
          </Link>
        ))}
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand-primary/90 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
        </svg>
        Back to Homepage
      </Link>
    </div>
  );
}
