import { formatPrice } from "@/lib/utils";
import type { PriceTrendPoint } from "@/lib/queries";

interface PriceTrendProps {
  data: PriceTrendPoint[];
}

export default function PriceTrend({ data }: PriceTrendProps) {
  if (data.length === 0) return null;

  const prices = data.map((d) => d.min_price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;

  return (
    <section className="py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Price Trend (Last 30 Days)</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-end gap-1 h-32">
          {data.map((point, i) => {
            const height = ((point.min_price - minPrice) / range) * 100;
            const barHeight = Math.max(100 - height, 5);
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-end group relative"
              >
                <div
                  className="w-full bg-brand-primary/20 hover:bg-brand-primary/40 rounded-t transition-colors"
                  style={{ height: `${barHeight}%` }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {formatPrice(point.min_price)} — {new Date(point.scraped_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{new Date(data[0].scraped_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          <span>{new Date(data[data.length - 1].scraped_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low: {formatPrice(minPrice)}</span>
          <span>High: {formatPrice(maxPrice)}</span>
        </div>
      </div>
    </section>
  );
}
