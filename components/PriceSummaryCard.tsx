import { formatPrice } from "@/lib/utils";

interface PriceSummaryCardProps {
  typicalPrice: number | null;
  lowPrice: number | null;
  highPrice: number | null;
  allTimeLow: number | null;
  sampleSize: number;
  dataQuality: string;
}

export default function PriceSummaryCard({
  typicalPrice,
  lowPrice,
  highPrice,
  allTimeLow,
  sampleSize,
  dataQuality,
}: PriceSummaryCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="text-center">
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Typical Price</div>
          <div className="text-2xl font-bold text-gray-900">{formatPrice(typicalPrice)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Deals From</div>
          <div className="text-2xl font-bold text-brand-accent">{formatPrice(lowPrice)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Usually Costs</div>
          <div className="text-lg font-semibold text-gray-700">
            {formatPrice(lowPrice)} – {formatPrice(highPrice)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Lowest We&apos;ve Seen</div>
          <div className="text-2xl font-bold text-green-600">{formatPrice(allTimeLow)}</div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-4 text-xs text-gray-500">
        <span>Based on {sampleSize.toLocaleString()} price points</span>
        <span className={`px-2 py-0.5 rounded-full font-medium ${
          dataQuality === "high"
            ? "bg-green-100 text-green-700"
            : dataQuality === "medium"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-600"
        }`}>
          {dataQuality} confidence
        </span>
      </div>
    </div>
  );
}
