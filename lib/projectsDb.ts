import { neon } from '@neondatabase/serverless';
import { mapRow, type Project } from './projects';

// Server-only: reads every project for the ISR page render. Never throws —
// CI builds without DATABASE_URL, and a DB outage must not take the page down.
export async function getProjects(): Promise<Project[]> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn('getProjects: DATABASE_URL not set — rendering no projects');
    return [];
  }
  try {
    const sql = neon(url);
    const rows = await sql`
      select id, title, description, image_url, link_url, year, tags
      from projects
      order by year desc, title asc
    `;
    return (rows as Record<string, unknown>[]).map(mapRow).filter((p): p is Project => p !== null);
  } catch (err) {
    console.error('getProjects failed:', err);
    return [];
  }
}
