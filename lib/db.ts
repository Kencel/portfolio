import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

// Shared scaffold for the server-only Neon fetchers. Never throws —
// CI builds without DATABASE_URL, and a DB outage must not take the page down.
// Trade-off: returning [] on failure means ISR's revalidation "succeeds" with
// an empty list, so an outage renders the themed empty state (rather than
// stale-serving the last good page) until the DB recovers.
// One retry absorbs Neon's scale-to-zero cold start, which has timed out a
// Vercel build fetch before and baked the empty state into the prerender.
const RETRY_DELAY_MS = 2000;

export async function queryRows<T>(
  label: string,
  runQuery: (sql: NeonQueryFunction<false, false>) => Promise<unknown>,
  mapRow: (row: Record<string, unknown>) => T | null,
): Promise<T[]> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn(`${label}: DATABASE_URL not set — rendering no rows`);
    return [];
  }
  const sql = neon(url);
  try {
    let rows;
    try {
      rows = await runQuery(sql);
    } catch (err) {
      console.warn(`${label}: first attempt failed, retrying once:`, err);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      rows = await runQuery(sql);
    }
    return (rows as Record<string, unknown>[]).map(mapRow).filter((r): r is T => r !== null);
  } catch (err) {
    console.error(`${label} failed:`, err);
    return [];
  }
}
