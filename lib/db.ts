import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const config: ConstructorParameters<typeof Pool>[0] = {
      connectionString: process.env.DATABASE_URL,
      max: 1,
      idleTimeoutMillis: 5000,
      connectionTimeoutMillis: 5000,
    };

    if (process.env.DATABASE_URL?.includes("34.")) {
      config.ssl = { rejectUnauthorized: false };
    }

    pool = new Pool(config);

    pool.on("error", () => {
      pool = null;
    });
  }
  return pool;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface QueryOptions {
  name?: string;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
  options?: QueryOptions
): Promise<T[]> {
  const maxRetries = 3;
  const slowQueryMs = parseInt(process.env.DB_SLOW_QUERY_MS || "300", 10);
  const shouldLogAll = process.env.LOG_DB_TIMINGS === "true";
  const queryName = options?.name || text.split(/\s+/).slice(0, 3).join(" ");

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const startedAt = Date.now();

    try {
      const p = getPool();
      const result = await p.query(text, params);
      const durationMs = Date.now() - startedAt;

      if (shouldLogAll || durationMs >= slowQueryMs) {
        const logLevel = durationMs >= slowQueryMs ? "warn" : "info";
        console[logLevel]("[db.query]", {
          query: queryName,
          duration_ms: durationMs,
          row_count: result.rowCount,
          retry_attempt: attempt,
        });
      }

      return result.rows as T[];
    } catch (error: unknown) {
      const durationMs = Date.now() - startedAt;
      const msg = error instanceof Error ? error.message : "";
      const isConnectionError =
        msg.includes("remaining connection slots") ||
        msg.includes("timeout") ||
        msg.includes("Connection terminated") ||
        msg.includes("ECONNREFUSED");

      console.error("[db.query.error]", {
        query: queryName,
        duration_ms: durationMs,
        retry_attempt: attempt,
        error: msg || "Unknown database error",
      });

      if (isConnectionError && attempt < maxRetries - 1) {
        pool = null;
        await sleep(1000 * (attempt + 1));
        continue;
      }
      throw error;
    }
  }

  return [];
}
