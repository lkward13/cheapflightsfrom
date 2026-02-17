import { unstable_cache } from "next/cache";
import { query } from "./db";

function normalizeCode(value: string): string {
  return value.trim().toUpperCase();
}

function normalizeCodes(values: string[]): string[] {
  return [...new Set(values.map(normalizeCode))].sort();
}

const hasExplorerPricesTableCached = unstable_cache(
  async (): Promise<boolean> => {
    const rows = await query<{ exists: boolean }>(
      `SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'explorer_prices'
      ) AS exists`,
      undefined,
      { name: "hasExplorerPricesTable" }
    );
    return rows[0]?.exists ?? false;
  },
  ["has-explorer-prices-table-v1"],
  {
    revalidate: 60 * 60 * 24,
  }
);

// ---- Types ----

export interface RouteInsight {
  origin: string;
  destination: string;
  typical_price: number | null;
  low_price_threshold: number | null;
  high_price_threshold: number | null;
  min_price_ever: number | null;
  max_price_ever: number | null;
  avg_price: number | null;
  monthly_typical: Record<string, number> | null;
  sample_size: number;
  data_quality: string;
  days_tracked: number | null;
  last_scraped: string | null;
}

export interface SentDeal {
  origin: string;
  destination: string;
  price: number;
  outbound_date: string;
  return_date: string;
  sent_at: string;
}

export interface PriceTrendPoint {
  min_price: number;
  scraped_date: string;
}

// ---- Hub Page Queries ----

/** Get top destinations from a metro's airports, sorted by cheapest */
const getHubDestinationsCached = unstable_cache(
  async (
    airportCodes: string[]
  ): Promise<RouteInsight[]> => {
    return query<RouteInsight>(
      `SELECT
        origin,
        destination,
        typical_price,
        low_price_threshold,
        high_price_threshold,
        min_price_ever,
        monthly_typical,
        sample_size,
        data_quality
      FROM route_insights
      WHERE origin = ANY($1)
        AND data_quality IN ('high', 'medium')
        AND sample_size >= 5
        AND typical_price IS NOT NULL
      ORDER BY low_price_threshold ASC NULLS LAST
      LIMIT 80`,
      [airportCodes],
      { name: "getHubDestinations" }
    );
  },
  ["hub-destinations-v1"],
  {
    revalidate: 60 * 60 * 2,
    tags: ["route-insights"],
  }
);

export async function getHubDestinations(
  airportCodes: string[]
): Promise<RouteInsight[]> {
  return getHubDestinationsCached(normalizeCodes(airportCodes));
}

/** Count unique destinations tracked for a metro */
const getDestinationCountCached = unstable_cache(
  async (airportCodes: string[]): Promise<number> => {
    const rows = await query<{ count: string }>(
      `SELECT COUNT(DISTINCT destination) as count
       FROM route_insights
       WHERE origin = ANY($1)
         AND data_quality IN ('high', 'medium')`,
      [airportCodes],
      { name: "getDestinationCount" }
    );
    return parseInt(rows[0]?.count || "0", 10);
  },
  ["destination-count-v1"],
  {
    revalidate: 60 * 60 * 2,
    tags: ["route-insights"],
  }
);

export async function getDestinationCount(airportCodes: string[]): Promise<number> {
  return getDestinationCountCached(normalizeCodes(airportCodes));
}

/** Get recent deals sent from a metro's airports */
const getRecentDealsCached = unstable_cache(
  async (
    airportCodes: string[],
    limit: number
  ): Promise<SentDeal[]> => {
    return query<SentDeal>(
      `SELECT origin, destination, price, outbound_date, return_date, sent_at
       FROM sent_deals
       WHERE origin = ANY($1)
         AND sent_at > NOW() - INTERVAL '30 days'
       ORDER BY sent_at DESC
       LIMIT $2`,
      [airportCodes, limit],
      { name: "getRecentDeals" }
    );
  },
  ["recent-deals-v1"],
  {
    revalidate: 60 * 60,
    tags: ["sent-deals"],
  }
);

export async function getRecentDeals(
  airportCodes: string[],
  limit = 10
): Promise<SentDeal[]> {
  return getRecentDealsCached(normalizeCodes(airportCodes), limit);
}

// ---- Cheapest Flights Now (matrix_prices) ----

export interface CheapestNow {
  origin: string;
  destination: string;
  price: number;
  scraped_date: string;
}

/** Get cheapest current flights from matrix_prices (last 3 days) */
const getCheapestFlightsNowCached = unstable_cache(
  async (
    airportCodes: string[],
    limit: number
  ): Promise<CheapestNow[]> => {
    return query<CheapestNow>(
      `SELECT
        origin,
        destination,
        MIN(price) as price,
        MAX(scraped_date::text) as scraped_date
      FROM matrix_prices
      WHERE origin = ANY($1)
        AND scraped_date > NOW() - INTERVAL '3 days'
      GROUP BY origin, destination
      ORDER BY MIN(price) ASC
      LIMIT $2`,
      [airportCodes, limit],
      { name: "getCheapestFlightsNow" }
    );
  },
  ["cheapest-flights-now-v1"],
  {
    revalidate: 60 * 60,
    tags: ["matrix-prices"],
  }
);

export async function getCheapestFlightsNow(
  airportCodes: string[],
  limit = 20
): Promise<CheapestNow[]> {
  return getCheapestFlightsNowCached(normalizeCodes(airportCodes), limit);
}

// ---- All Destinations by Region (route_insights) ----

export interface RegionDestination {
  origin: string;
  destination: string;
  typical_price: number | null;
  low_price_threshold: number | null;
  sample_size: number;
}

/** Get ALL qualifying destinations for the region browser (no LIMIT) */
const getAllHubDestinationsCached = unstable_cache(
  async (
    airportCodes: string[],
    limit: number
  ): Promise<RegionDestination[]> => {
    return query<RegionDestination>(
      `WITH ranked AS (
        SELECT
          origin,
          destination,
          typical_price,
          low_price_threshold,
          sample_size,
          ROW_NUMBER() OVER (
            PARTITION BY destination
            ORDER BY low_price_threshold ASC NULLS LAST
          ) AS row_num
        FROM route_insights
        WHERE origin = ANY($1)
          AND data_quality IN ('high', 'medium')
          AND sample_size >= 5
          AND typical_price IS NOT NULL
      )
      SELECT
        origin,
        destination,
        typical_price,
        low_price_threshold,
        sample_size
      FROM ranked
      WHERE row_num = 1
      ORDER BY low_price_threshold ASC NULLS LAST
      LIMIT $2`,
      [airportCodes, limit],
      { name: "getAllHubDestinations" }
    );
  },
  ["all-hub-destinations-v2"],
  {
    revalidate: 60 * 60 * 2,
    tags: ["route-insights"],
  }
);

export async function getAllHubDestinations(
  airportCodes: string[],
  limit = 500
): Promise<RegionDestination[]> {
  return getAllHubDestinationsCached(normalizeCodes(airportCodes), limit);
}

// ---- Route Page Queries ----

/** Get route insights -- picks best airport for a multi-airport metro */
const getRouteInsightsCached = unstable_cache(
  async (
    airportCodes: string[],
    destination: string
  ): Promise<RouteInsight | null> => {
    const rows = await query<RouteInsight>(
      `SELECT origin, destination, typical_price, low_price_threshold,
              high_price_threshold, min_price_ever, max_price_ever,
              avg_price, monthly_typical, sample_size, data_quality,
              days_tracked, last_scraped::text
       FROM route_insights
       WHERE origin = ANY($1) AND destination = $2
       ORDER BY low_price_threshold ASC NULLS LAST
       LIMIT 1`,
      [airportCodes, destination],
      { name: "getRouteInsights" }
    );
    return rows[0] || null;
  },
  ["route-insights-v1"],
  {
    revalidate: 60 * 60 * 2,
    tags: ["route-insights"],
  }
);

export async function getRouteInsights(
  airportCodes: string[],
  destination: string
): Promise<RouteInsight | null> {
  return getRouteInsightsCached(
    normalizeCodes(airportCodes),
    normalizeCode(destination)
  );
}

/** Get recent price points for price trend */
const getRoutePriceTrendCached = unstable_cache(
  async (
    origins: string[],
    destination: string
  ): Promise<PriceTrendPoint[]> => {
    const hasExplorerPricesTable = await hasExplorerPricesTableCached();

    if (!hasExplorerPricesTable) {
      return query<PriceTrendPoint>(
        `SELECT
          MIN(price) as min_price,
          scraped_date::text as scraped_date
        FROM matrix_prices
        WHERE origin = ANY($1) AND destination = $2
          AND scraped_date > NOW() - INTERVAL '90 days'
        GROUP BY scraped_date
        ORDER BY scraped_date ASC`,
        [origins, destination],
        { name: "getRoutePriceTrend.matrixOnly" }
      );
    }

    return query<PriceTrendPoint>(
      `SELECT
        MIN(min_price) as min_price,
        scraped_date::text as scraped_date
      FROM (
        SELECT MIN(price) as min_price, scraped_date
        FROM matrix_prices
        WHERE origin = ANY($1) AND destination = $2
          AND scraped_date > NOW() - INTERVAL '90 days'
        GROUP BY scraped_date
        UNION ALL
        SELECT MIN(price) as min_price, scraped_date
        FROM explorer_prices
        WHERE origin = ANY($1) AND destination = $2
          AND scraped_date > NOW() - INTERVAL '90 days'
        GROUP BY scraped_date
      ) combined
      GROUP BY scraped_date
      ORDER BY scraped_date ASC`,
      [origins, destination],
      { name: "getRoutePriceTrend.combined" }
    );
  },
  ["route-price-trend-v1"],
  {
    revalidate: 60 * 60 * 2,
    tags: ["matrix-prices", "explorer-prices"],
  }
);

export async function getRoutePriceTrend(
  origins: string[],
  destination: string
): Promise<PriceTrendPoint[]> {
  return getRoutePriceTrendCached(
    normalizeCodes(origins),
    normalizeCode(destination)
  );
}

// ---- Static Params Queries ----

/** Get all routes that qualify for a route page */
const getAllQualifyingRoutesCached = unstable_cache(
  async (): Promise<{ origin: string; destination: string }[]> => {
    return query<{ origin: string; destination: string }>(
      `SELECT origin, destination
       FROM route_insights
       WHERE data_quality IN ('high', 'medium')
         AND sample_size >= 10
         AND typical_price IS NOT NULL`,
      undefined,
      { name: "getAllQualifyingRoutes" }
    );
  },
  ["all-qualifying-routes-v1"],
  {
    revalidate: 60 * 60 * 24,
    tags: ["route-insights"],
  }
);

export async function getAllQualifyingRoutes(): Promise<
  { origin: string; destination: string }[]
> {
  return getAllQualifyingRoutesCached();
}

/** Get qualifying destinations from a set of origins */
const getDestinationsForOriginsCached = unstable_cache(
  async (
    airportCodes: string[]
  ): Promise<string[]> => {
    const rows = await query<{ destination: string }>(
      `SELECT DISTINCT destination
       FROM route_insights
       WHERE origin = ANY($1)
         AND data_quality IN ('high', 'medium')
         AND sample_size >= 10
         AND typical_price IS NOT NULL
       ORDER BY destination`,
      [airportCodes],
      { name: "getDestinationsForOrigins" }
    );
    return rows.map((r) => r.destination);
  },
  ["destinations-for-origins-v1"],
  {
    revalidate: 60 * 60 * 4,
    tags: ["route-insights"],
  }
);

export async function getDestinationsForOrigins(
  airportCodes: string[]
): Promise<string[]> {
  return getDestinationsForOriginsCached(normalizeCodes(airportCodes));
}

// ---- Homepage Queries ----

/** Get recent deals across all origins for homepage showcase */
export async function getRecentDealsAll(limit = 20): Promise<SentDeal[]> {
  return query<SentDeal>(
    `SELECT origin, destination, price, outbound_date, return_date, sent_at
     FROM sent_deals
     WHERE sent_at > NOW() - INTERVAL '7 days'
     ORDER BY sent_at DESC
     LIMIT $1`,
    [limit],
    { name: "getRecentDealsAll" }
  );
}

/** Get overall stats for homepage */
export async function getSiteStats(): Promise<{
  totalRoutes: number;
  totalOrigins: number;
  cheapestPrice: number | null;
}> {
  const [routeRows, priceRows] = await Promise.all([
    query<{ route_count: string; origin_count: string }>(
      `SELECT COUNT(*) as route_count, COUNT(DISTINCT origin) as origin_count
       FROM route_insights
       WHERE data_quality IN ('high', 'medium')`,
      undefined,
      { name: "getSiteStatsCounts" }
    ),
    query<{ min_price: number }>(
      `SELECT MIN(low_price_threshold) as min_price
       FROM route_insights
       WHERE data_quality IN ('high', 'medium')
         AND low_price_threshold > 0`,
      undefined,
      { name: "getSiteStatsMinPrice" }
    ),
  ]);

  return {
    totalRoutes: parseInt(routeRows[0]?.route_count || "0"),
    totalOrigins: parseInt(routeRows[0]?.origin_count || "0"),
    cheapestPrice: priceRows[0]?.min_price || null,
  };
}
