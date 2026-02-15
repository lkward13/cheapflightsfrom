import { query } from "./db";

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
export async function getHubDestinations(
  airportCodes: string[]
): Promise<RouteInsight[]> {
  return query<RouteInsight>(
    `SELECT 
      TRIM(ri.origin) as origin,
      TRIM(ri.destination) as destination,
      ri.typical_price,
      ri.low_price_threshold,
      ri.high_price_threshold,
      ri.min_price_ever,
      ri.monthly_typical,
      ri.sample_size,
      ri.data_quality
    FROM route_insights ri
    WHERE ri.origin = ANY($1)
      AND ri.data_quality IN ('high', 'medium')
      AND ri.sample_size >= 5
      AND ri.typical_price IS NOT NULL
    ORDER BY ri.low_price_threshold ASC NULLS LAST
    LIMIT 80`,
    [airportCodes]
  );
}

/** Count unique destinations tracked for a metro */
export async function getDestinationCount(airportCodes: string[]): Promise<number> {
  const rows = await query<{ count: string }>(
    `SELECT COUNT(DISTINCT TRIM(destination)) as count FROM route_insights
     WHERE origin = ANY($1) AND data_quality IN ('high', 'medium')`,
    [airportCodes]
  );
  return parseInt(rows[0]?.count || "0");
}

/** Get recent deals sent from a metro's airports */
export async function getRecentDeals(
  airportCodes: string[],
  limit = 10
): Promise<SentDeal[]> {
  return query<SentDeal>(
    `SELECT origin, destination, price, outbound_date, return_date, sent_at
     FROM sent_deals
     WHERE origin = ANY($1)
       AND sent_at > NOW() - INTERVAL '30 days'
     ORDER BY sent_at DESC
     LIMIT $2`,
    [airportCodes, limit]
  );
}

// ---- Cheapest Flights Now (matrix_prices) ----

export interface CheapestNow {
  origin: string;
  destination: string;
  price: number;
  scraped_date: string;
}

/** Get cheapest current flights from matrix_prices (last 3 days) */
export async function getCheapestFlightsNow(
  airportCodes: string[],
  limit = 20
): Promise<CheapestNow[]> {
  return query<CheapestNow>(
    `SELECT
      TRIM(origin) as origin,
      TRIM(destination) as destination,
      MIN(price) as price,
      MAX(scraped_date::text) as scraped_date
    FROM matrix_prices
    WHERE origin = ANY($1)
      AND scraped_date > NOW() - INTERVAL '3 days'
    GROUP BY TRIM(origin), TRIM(destination)
    ORDER BY MIN(price) ASC
    LIMIT $2`,
    [airportCodes, limit]
  );
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
export async function getAllHubDestinations(
  airportCodes: string[]
): Promise<RegionDestination[]> {
  return query<RegionDestination>(
    `SELECT
      TRIM(ri.origin) as origin,
      TRIM(ri.destination) as destination,
      ri.typical_price,
      ri.low_price_threshold,
      ri.sample_size
    FROM route_insights ri
    WHERE ri.origin = ANY($1)
      AND ri.data_quality IN ('high', 'medium')
      AND ri.sample_size >= 5
      AND ri.typical_price IS NOT NULL
    ORDER BY ri.low_price_threshold ASC NULLS LAST`,
    [airportCodes]
  );
}

// ---- Route Page Queries ----

/** Get route insights -- picks best airport for a multi-airport metro */
export async function getRouteInsights(
  airportCodes: string[],
  destination: string
): Promise<RouteInsight | null> {
  const rows = await query<RouteInsight>(
    `SELECT origin, destination, typical_price, low_price_threshold,
            high_price_threshold, min_price_ever, max_price_ever,
            avg_price, monthly_typical, sample_size, data_quality,
            days_tracked, last_scraped::text
     FROM route_insights
     WHERE origin = ANY($1) AND TRIM(destination) = $2
     ORDER BY low_price_threshold ASC NULLS LAST
     LIMIT 1`,
    [airportCodes, destination]
  );
  return rows[0] || null;
}

/** Get recent price points for price trend */
export async function getRoutePriceTrend(
  origin: string,
  destination: string
): Promise<PriceTrendPoint[]> {
  return query<PriceTrendPoint>(
    `SELECT 
      MIN(price) as min_price,
      scraped_date::text as scraped_date
    FROM matrix_prices
    WHERE origin = $1 AND destination = $2
      AND scraped_date > NOW() - INTERVAL '30 days'
    GROUP BY scraped_date
    ORDER BY scraped_date ASC`,
    [origin, destination]
  );
}

// ---- Static Params Queries ----

/** Get all routes that qualify for a route page */
export async function getAllQualifyingRoutes(): Promise<
  { origin: string; destination: string }[]
> {
  return query<{ origin: string; destination: string }>(
    `SELECT origin, destination
     FROM route_insights
     WHERE data_quality IN ('high', 'medium')
       AND sample_size >= 10
       AND typical_price IS NOT NULL`
  );
}

/** Get qualifying destinations from a set of origins */
export async function getDestinationsForOrigins(
  airportCodes: string[]
): Promise<string[]> {
  const rows = await query<{ destination: string }>(
    `SELECT DISTINCT destination
     FROM route_insights
     WHERE origin = ANY($1)
       AND data_quality IN ('high', 'medium')
       AND sample_size >= 10
       AND typical_price IS NOT NULL
     ORDER BY destination`,
    [airportCodes]
  );
  return rows.map((r) => r.destination);
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
    [limit]
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
       WHERE data_quality IN ('high', 'medium')`
    ),
    query<{ min_price: number }>(
      `SELECT MIN(low_price_threshold) as min_price
       FROM route_insights
       WHERE data_quality IN ('high', 'medium')
         AND low_price_threshold > 0`
    ),
  ]);

  return {
    totalRoutes: parseInt(routeRows[0]?.route_count || "0"),
    totalOrigins: parseInt(routeRows[0]?.origin_count || "0"),
    cheapestPrice: priceRows[0]?.min_price || null,
  };
}
