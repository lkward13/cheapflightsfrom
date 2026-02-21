#!/usr/bin/env python3
"""
One-time backfill: correct min_price_ever in route_insights using the true
minimum from matrix_prices.  Only updates rows where the stored value is
NULL or higher than the actual minimum.
"""

import os
import sys
import psycopg2

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    # Try loading from .env.local in the cheapflightsfrom directory
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env.local")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith("DATABASE_URL="):
                    DATABASE_URL = line.strip().split("=", 1)[1]
                    break

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not set and .env.local not found")
    sys.exit(1)


def main():
    print("Connecting to database...")
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    conn.autocommit = False
    cur = conn.cursor()

    # Preview: how many rows will change?
    print("Scanning for mismatched min_price_ever values...")
    cur.execute("""
        SELECT COUNT(*)
        FROM route_insights ri
        JOIN (
            SELECT origin, destination, MIN(price) as true_min
            FROM matrix_prices
            GROUP BY origin, destination
        ) sub ON ri.origin = sub.origin AND ri.destination = sub.destination
        WHERE ri.min_price_ever IS NULL OR sub.true_min < ri.min_price_ever
    """)
    mismatch_count = cur.fetchone()[0]
    print(f"Found {mismatch_count:,} routes where min_price_ever needs correction.")

    if mismatch_count == 0:
        print("Nothing to fix. Exiting.")
        conn.close()
        return

    # Run the backfill
    print("Applying backfill UPDATE...")
    cur.execute("""
        UPDATE route_insights ri
        SET min_price_ever = sub.true_min,
            updated_at = NOW()
        FROM (
            SELECT origin, destination, MIN(price) as true_min
            FROM matrix_prices
            GROUP BY origin, destination
        ) sub
        WHERE ri.origin = sub.origin
          AND ri.destination = sub.destination
          AND (ri.min_price_ever IS NULL OR sub.true_min < ri.min_price_ever)
    """)
    updated = cur.rowcount
    conn.commit()
    print(f"Updated {updated:,} rows.")

    # Quick verification sample
    print()
    print("Verification sample (5 routes):")
    cur.execute("""
        SELECT ri.origin, ri.destination, ri.min_price_ever,
               (SELECT MIN(price) FROM matrix_prices mp
                WHERE mp.origin = ri.origin AND mp.destination = ri.destination) as true_min
        FROM route_insights ri
        ORDER BY RANDOM()
        LIMIT 5
    """)
    for row in cur.fetchall():
        match = "OK" if row[2] == row[3] else "MISMATCH"
        print(f"  {row[0]}->{row[1]}: stored=${row[2]}, actual_min=${row[3]} [{match}]")

    conn.close()
    print()
    print("Backfill complete.")


if __name__ == "__main__":
    main()
