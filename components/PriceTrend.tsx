import { formatPrice } from "@/lib/utils";
import type { PriceTrendPoint } from "@/lib/queries";

interface PriceTrendProps {
  data: PriceTrendPoint[];
}

export default function PriceTrend({ data }: PriceTrendProps) {
  if (data.length < 3) return null;

  const prices = data.map((d) => d.min_price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;

  const svgWidth = 800;
  const svgHeight = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartWidth;
    const y =
      padding.top +
      chartHeight -
      ((d.min_price - minPrice) / range) * chartHeight;
    return { x, y, price: d.min_price, date: d.scraped_date };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  const yTicks = 4;
  const yLabels = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round(minPrice + (range * i) / yTicks)
  );

  const dateLabelIndices = [0, Math.floor(data.length / 2), data.length - 1];

  return (
    <section className="section-shell-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Price Trend (Last 90 Days)
      </h2>
      <div className="bg-white rounded-xl border border-gray-200 p-3 lg:p-4">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
          {/* Grid lines */}
          {yLabels.map((label, i) => {
            const y =
              padding.top +
              chartHeight -
              ((label - minPrice) / range) * chartHeight;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-gray-400"
                  fontSize="11"
                >
                  ${label}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#1a365d"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#1a365d"
              stroke="white"
              strokeWidth="1.5"
            />
          ))}

          {/* Date labels */}
          {dateLabelIndices.map((idx) => (
            <text
              key={idx}
              x={points[idx].x}
              y={svgHeight - 5}
              textAnchor={
                idx === 0
                  ? "start"
                  : idx === data.length - 1
                    ? "end"
                    : "middle"
              }
              className="fill-gray-400"
              fontSize="11"
            >
              {new Date(data[idx].scraped_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </text>
          ))}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a365d" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1a365d" stopOpacity="0.02" />
            </linearGradient>
          </defs>
        </svg>

        <div className="flex justify-between text-sm text-gray-600 mt-1 px-1">
          <span>
            Low: <span className="font-semibold text-green-700">{formatPrice(minPrice)}</span>
          </span>
          <span>
            {data.length} price checks
          </span>
          <span>
            High: <span className="font-semibold text-red-600">{formatPrice(maxPrice)}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
