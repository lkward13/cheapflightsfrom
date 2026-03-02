import { formatPrice } from "@/lib/utils";
import type { ActiveDeal } from "@/lib/queries";

interface ActiveDealBannerProps {
  deal: ActiveDeal;
  originCode: string;
  destCity: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ActiveDealBanner({
  deal,
  originCode,
  destCity,
}: ActiveDealBannerProps) {
  const isFire = deal.tier === 1;
  const badge = isFire ? "🔥 Fire Deal" : "⭐ Great Deal";
  const borderColor = isFire ? "border-red-500" : "border-violet-500";
  const badgeBg = isFire
    ? "bg-red-50 text-red-700"
    : "bg-violet-50 text-violet-700";
  const priceBg = isFire ? "text-red-600" : "text-violet-600";

  const gfUrl = `https://www.google.com/travel/flights?q=flights+from+${originCode}+to+${deal.destination}`;

  return (
    <div
      className={`rounded-2xl border-2 ${borderColor} bg-white p-5 shadow-md mb-6`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${badgeBg}`}
          >
            {badge}
          </span>
          <span className="text-xs text-gray-500">
            Found {timeAgo(deal.sent_at)}
          </span>
        </div>
        <span className={`text-3xl font-extrabold ${priceBg}`}>
          {formatPrice(deal.price)}
        </span>
      </div>

      {deal.deal_body && (
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          {deal.deal_body}
        </p>
      )}

      {deal.date_count != null && deal.date_count > 0 && (
        <p className="text-xs text-gray-500 mb-4">
          ✓ {deal.date_count} date combination
          {deal.date_count !== 1 ? "s" : ""} found at this price
        </p>
      )}

      <a
        href={gfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 ${
          isFire
            ? "bg-red-600 hover:bg-red-700"
            : "bg-violet-600 hover:bg-violet-700"
        } text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors`}
      >
        Search Google Flights
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  );
}
