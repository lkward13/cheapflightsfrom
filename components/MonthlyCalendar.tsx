import { monthShort, formatPrice } from "@/lib/utils";

interface MonthlyCalendarProps {
  data: Record<string, number> | null;
  title?: string;
}

const MONTHS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

export default function MonthlyCalendar({ data, title = "Monthly Price Guide" }: MonthlyCalendarProps) {
  if (!data || Object.keys(data).length === 0) return null;

  const prices = MONTHS.map((m) => data[m] || 0).filter((p) => p > 0);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const getColor = (price: number) => {
    if (price === 0) return "bg-gray-100 text-gray-400";
    const ratio = (price - minPrice) / (maxPrice - minPrice || 1);
    if (ratio <= 0.33) return "bg-green-100 text-green-800 ring-1 ring-green-300";
    if (ratio <= 0.66) return "bg-yellow-50 text-yellow-800";
    return "bg-red-50 text-red-700";
  };

  return (
    <section className="section-shell-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
        {MONTHS.map((m) => {
          const price = data[m] || 0;
          return (
            <div
              key={m}
              className={`rounded-lg p-3 text-center ${getColor(price)}`}
            >
              <div className="text-xs font-semibold uppercase">{monthShort(m)}</div>
              <div className="text-sm font-bold mt-1">
                {price > 0 ? formatPrice(price) : "—"}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-100 ring-1 ring-green-300" /> Cheapest
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-yellow-50" /> Average
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-50" /> Expensive
        </span>
      </div>
    </section>
  );
}
