import { mapCompetitionRow, type Competition } from './competitions';
import { queryRows } from './db';

// Server-only: reads every competition for the ISR page render. Failure policy
// (never throw, one cold-start retry) lives in lib/db.ts#queryRows.
export function getCompetitions(): Promise<Competition[]> {
  return queryRows('getCompetitions', sql => sql`
    select id, name, event_date, team, result, placement, note, cert_image_url
    from competitions
    order by event_date desc, id desc
  `, mapCompetitionRow);
}
