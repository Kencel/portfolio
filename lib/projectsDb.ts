import { mapRow, type Project } from './projects';
import { queryRows } from './db';

// Server-only: reads every project for the ISR page render. Failure policy
// (never throw, one cold-start retry) lives in lib/db.ts#queryRows.
export function getProjects(): Promise<Project[]> {
  return queryRows('getProjects', sql => sql`
    select id, title, description, image_url, link_url, year, tags
    from projects
    order by year desc, title asc
  `, mapRow);
}
