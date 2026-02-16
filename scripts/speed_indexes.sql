-- Query performance indexes for cheapflightsfrom.us
-- Use CONCURRENTLY in production to avoid long write locks.

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_route_insights_origin_quality_sample
ON route_insights (origin, data_quality, sample_size)
WHERE typical_price IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_route_insights_origin_destination_low
ON route_insights (origin, destination, low_price_threshold);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_matrix_prices_origin_destination_scraped
ON matrix_prices (origin, destination, scraped_date DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_explorer_prices_origin_destination_scraped
ON explorer_prices (origin, destination, scraped_date DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sent_deals_origin_sent_at_desc
ON sent_deals (origin, sent_at DESC);
