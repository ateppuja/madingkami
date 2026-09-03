import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

const globalForPg = global as unknown as { pgPool: Pool };

export const pool =
  globalForPg.pgPool ||
  new Pool({
    connectionString,
    ssl: connectionString?.includes('sslmode=require') || connectionString?.includes('insforge.app')
      ? { rejectUnauthorized: false }
      : false,
  });

if (process.env.NODE_ENV !== 'production') globalForPg.pgPool = pool;

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  return res;
}
