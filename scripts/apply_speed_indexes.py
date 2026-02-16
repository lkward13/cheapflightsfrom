#!/usr/bin/env python3
"""
Apply speed-focused PostgreSQL indexes for cheapflightsfrom.

Usage:
  DATABASE_URL=... python3 scripts/apply_speed_indexes.py
"""

from __future__ import annotations

import os
import psycopg2


INDEX_STATEMENTS_ALWAYS = [
    """
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_route_insights_origin_quality_sample
    ON route_insights (origin, data_quality, sample_size)
    WHERE typical_price IS NOT NULL;
    """,
    """
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_route_insights_origin_destination_low
    ON route_insights (origin, destination, low_price_threshold);
    """,
    """
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_matrix_prices_origin_destination_scraped
    ON matrix_prices (origin, destination, scraped_date DESC);
    """,
    """
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sent_deals_origin_sent_at_desc
    ON sent_deals (origin, sent_at DESC);
    """,
]


def main() -> None:
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise SystemExit("DATABASE_URL is required")

    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cur = conn.cursor()

    print("Applying performance indexes...")
    for idx, sql in enumerate(INDEX_STATEMENTS_ALWAYS, start=1):
        print(f"[{idx}/{len(INDEX_STATEMENTS_ALWAYS)}] running...")
        cur.execute(sql)

    cur.execute(
        """
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema='public' AND table_name='explorer_prices'
        )
        """
    )
    explorer_exists = cur.fetchone()[0]
    if explorer_exists:
        print("explorer_prices found, creating index...")
        cur.execute(
            """
            CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_explorer_prices_origin_destination_scraped
            ON explorer_prices (origin, destination, scraped_date DESC);
            """
        )
    else:
        print("explorer_prices table not found; skipping explorer index.")

    print("Running ANALYZE...")
    cur.execute("ANALYZE route_insights;")
    cur.execute("ANALYZE matrix_prices;")
    if explorer_exists:
        cur.execute("ANALYZE explorer_prices;")
    cur.execute("ANALYZE sent_deals;")

    cur.close()
    conn.close()
    print("Done.")


if __name__ == "__main__":
    main()
