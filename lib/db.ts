import { Pool, QueryResultRow } from 'pg';

const DEFAULT_DB_URL = 'postgresql://postgres:8e3d1a4f280745feb9d43a0094e24ece@sa4ue85s.ap-southeast.database.insforge.app:5432/insforge?sslmode=require';
const connectionString = process.env.DATABASE_URL || DEFAULT_DB_URL;

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
