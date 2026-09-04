import { Pool, QueryResultRow } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL belum dikonfigurasi. Tambahkan DATABASE_URL ke .env.local dan environment deployment.'
  );
}

const globalForPg = globalThis as typeof globalThis & { pgPool?: Pool };

export const pool =
  globalForPg.pgPool ||
  new Pool({
    connectionString,
    ssl: connectionString.includes('sslmode=require') || connectionString.includes('insforge.app')
      ? { rejectUnauthorized: false }
      : false,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
    max: 10,
  });

if (process.env.NODE_ENV !== 'production') globalForPg.pgPool = pool;

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
  return pool.query<T>(text, params);
}
