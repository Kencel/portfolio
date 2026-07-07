import { neon } from '@neondatabase/serverless';
import { mapCompetitionRow, type Competition } from './competitions';

// Server-only: reads every competition for the ISR page render. Same policy as
// lib/projectsDb.ts — never throws (CI builds without DATABASE_URL; a DB outage
// renders the themed empty state), one retry to absorb Neon cold starts.
const RETRY_DELAY_MS = 2000;

export async function getCompetitions(): Promise<Competition[]> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn('getCompetitions: DATABASE_URL not set — rendering no competitions');
    return [];
  }
  const sql = neon(url);
  const query = () => sql`
    select id, name, event_date, team, result, placement, note, cert_image_url
    from competitions
    order by event_date desc, id desc
  `;
  try {
    let rows;
    try {
      rows = await query();
    } catch (err) {
      console.warn('getCompetitions: first attempt failed, retrying once:', err);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      rows = await query();
    }
    return (rows as Record<string, unknown>[]).map(mapCompetitionRow).filter((c): c is Competition => c !== null);
  } catch (err) {
    console.error('getCompetitions failed:', err);
    return [];
  }
}
