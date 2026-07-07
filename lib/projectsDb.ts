import { neon } from '@neondatabase/serverless';
import { mapRow, type Project } from './projects';

// Server-only: reads every project for the ISR page render. Never throws —
// CI builds without DATABASE_URL, and a DB outage must not take the page down.
// Trade-off: returning [] on failure means ISR's revalidation "succeeds" with
// an empty list, so an outage renders the themed empty state (rather than
// stale-serving the last good page) until the DB recovers.
// One retry absorbs Neon's scale-to-zero cold start, which has timed out a
// Vercel build fetch before and baked the empty state into the prerender.
const RETRY_DELAY_MS = 2000;

export async function getProjects(): Promise<Project[]> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn('getProjects: DATABASE_URL not set — rendering no projects');
    return [];
  }
  const sql = neon(url);
  const query = () => sql`
    select id, title, description, image_url, link_url, year, tags
    from projects
    order by year desc, title asc
  `;
  try {
    let rows;
    try {
      rows = await query();
    } catch (err) {
      console.warn('getProjects: first attempt failed, retrying once:', err);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      rows = await query();
    }
    return (rows as Record<string, unknown>[]).map(mapRow).filter((p): p is Project => p !== null);
  } catch (err) {
    console.error('getProjects failed:', err);
    return [];
  }
}
