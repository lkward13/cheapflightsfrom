/** Format a price as USD with no decimals */
export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "N/A";
  return `$${price.toLocaleString("en-US")}`;
}

/** Convert a metro name to a URL slug */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Month number (01-12) to full month name */
const MONTH_NAMES: Record<string, string> = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December",
};

export function monthName(key: string): string {
  return MONTH_NAMES[key] || key;
}

/** Month number to short name */
const MONTH_SHORT: Record<string, string> = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec",
};

export function monthShort(key: string): string {
  return MONTH_SHORT[key] || key;
}

/** Find the cheapest months from monthly_typical JSONB */
export function getCheapestMonths(
  monthlyData: Record<string, number> | null,
  count = 3
): string[] {
  if (!monthlyData) return [];
  return Object.entries(monthlyData)
    .filter(([, price]) => price != null && price > 0)
    .sort(([, a], [, b]) => a - b)
    .slice(0, count)
    .map(([month]) => monthName(month));
}

/** Generate a "best time to fly" narrative from data */
export function generateBestTimeNarrative(
  origin: string,
  destination: string,
  monthlyTypical: Record<string, number> | null
): string {
  if (!monthlyTypical || Object.keys(monthlyTypical).length === 0) {
    return `Check back soon for price trends on flights from ${origin} to ${destination}.`;
  }

  const entries = Object.entries(monthlyTypical)
    .filter(([, price]) => price != null && price > 0)
    .sort(([, a], [, b]) => a - b);

  if (entries.length === 0) return "";

  const cheapest = entries[0];
  const expensive = entries[entries.length - 1];
  const cheapMonths = entries.slice(0, 3).map(([m]) => monthName(m));

  return `The cheapest time to fly from ${origin} to ${destination} is typically ${monthName(cheapest[0])}, when fares average around ${formatPrice(cheapest[1])}. The most expensive month tends to be ${monthName(expensive[0])} at around ${formatPrice(expensive[1])}. For the best deals, consider flying in ${cheapMonths.join(", ")}.`;
}
