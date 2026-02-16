#!/usr/bin/env python3
"""
Print EXPLAIN ANALYZE plans for key site queries.

Usage:
  DATABASE_URL=... python3 scripts/validate_query_plans.py
"""

from __future__ import annotations

import os
import psycopg2


EXPLAIN_QUERIES = [
    (
        "hub_destinations",
        """
        EXPLAIN (ANALYZE, BUFFERS)
        SELECT origin, destination, typical_price, low_price_threshold
        FROM route_insights
        WHERE origin = ANY(%s)
          AND data_quality IN ('high', 'medium')
          AND sample_size >= 5
          AND typical_price IS NOT NULL
        ORDER BY low_price_threshold ASC NULLS LAST
        LIMIT 80
        """,
        (["ATL", "OKC", "BOS"],),
    ),
    (
        "route_insights",
        """
        EXPLAIN (ANALYZE, BUFFERS)
        SELECT origin, destination, low_price_threshold
        FROM route_insights
        WHERE origin = ANY(%s)
          AND destination = %s
        ORDER BY low_price_threshold ASC NULLS LAST
        LIMIT 1
        """,
        (["ATL", "OKC"], "CUN"),
    ),
    (
        "route_price_trend_matrix_only",
        """
        EXPLAIN (ANALYZE, BUFFERS)
        SELECT MIN(price) as min_price, scraped_date
        FROM matrix_prices
        WHERE origin = ANY(%s)
          AND destination = %s
          AND scraped_date > NOW() - INTERVAL '90 days'
        GROUP BY scraped_date
        ORDER BY scraped_date ASC
        """,
        (["ATL", "OKC"], "CUN"),
    ),
]


def main() -> None:
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise SystemExit("DATABASE_URL is required")

    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    cur.execute(
        """
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema='public' AND table_name='explorer_prices'
        )
        """
    )
    explorer_exists = cur.fetchone()[0]

    for name, sql, params in EXPLAIN_QUERIES:
        print()
        print("=" * 80)
        print(name)
        print("=" * 80)
        cur.execute(sql, params)
        for row in cur.fetchall():
            print(row[0])

    if explorer_exists:
        print()
        print("=" * 80)
        print("route_price_trend_combined")
        print("=" * 80)
        cur.execute(
            """
            EXPLAIN (ANALYZE, BUFFERS)
            SELECT MIN(min_price) as min_price, scraped_date
            FROM (
              SELECT MIN(price) as min_price, scraped_date
              FROM matrix_prices
              WHERE origin = ANY(%s)
                AND destination = %s
                AND scraped_date > NOW() - INTERVAL '90 days'
              GROUP BY scraped_date
              UNION ALL
              SELECT MIN(price) as min_price, scraped_date
              FROM explorer_prices
              WHERE origin = ANY(%s)
                AND destination = %s
                AND scraped_date > NOW() - INTERVAL '90 days'
              GROUP BY scraped_date
            ) combined
            GROUP BY scraped_date
            ORDER BY scraped_date ASC
            """,
            (["ATL", "OKC"], "CUN", ["ATL", "OKC"], "CUN"),
        )
        for row in cur.fetchall():
            print(row[0])

    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
