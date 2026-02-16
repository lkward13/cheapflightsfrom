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

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const p = getPool();
      const result = await p.query(text, params);
      return result.rows as T[];
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "";
      const isConnectionError =
        msg.includes("remaining connection slots") ||
        msg.includes("timeout") ||
        msg.includes("Connection terminated") ||
        msg.includes("ECONNREFUSED");

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
