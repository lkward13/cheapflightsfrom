import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const config: ConstructorParameters<typeof Pool>[0] = {
      connectionString: process.env.DATABASE_URL,
      max: 1,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
    };

    if (process.env.DATABASE_URL?.includes("34.")) {
      config.ssl = { rejectUnauthorized: false };
    }

    pool = new Pool(config);
  }
  return pool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const pool = getPool();
  const result = await pool.query(text, params);
  return result.rows as T[];
}
