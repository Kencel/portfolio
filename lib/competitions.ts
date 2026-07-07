import { sanitizeImageUrl } from './projects';

export interface Competition {
  id: number;
  name: string;
  eventDate: string; // ISO yyyy-mm-dd; sort key and display source
  team: string | null;
  result: string;
  placement: string | null;
  note: string | null;
  certImageUrl: string | null;
}

// The Neon HTTP driver may hand back `date` columns as strings or Date objects
// depending on type parsers; normalize both to yyyy-mm-dd.
// Note: the driver parses date columns as local midnight (new Date(y, m-1, d)),
// so we must derive the ISO string from local date parts, not toISOString().
function isoDate(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  return null;
}

function optionalText(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

// Rows are hand-edited in the Neon dashboard: anything structurally unusable
// becomes null and is dropped rather than crashing the page (same policy as
// projects' mapRow).
export function mapCompetitionRow(row: Record<string, unknown>): Competition | null {
  if (typeof row.name !== 'string' || typeof row.result !== 'string') return null;
  const id = typeof row.id === 'number' ? row.id : Number(row.id);
  if (!Number.isFinite(id)) return null;
  const eventDate = isoDate(row.event_date);
  if (!eventDate) return null;
  return {
    id,
    name: row.name,
    eventDate,
    team: optionalText(row.team),
    result: row.result,
    placement: optionalText(row.placement),
    note: optionalText(row.note),
    certImageUrl: sanitizeImageUrl(row.cert_image_url),
  };
}

export function formatMonthYear(isoDate: string): string {
  return new Date(isoDate + 'T00:00:00Z')
    .toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .toUpperCase();
}
