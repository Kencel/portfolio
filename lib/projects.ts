export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  linkUrl: string | null;
  year: number;
  tags: string[];
}

export type SortMode = 'newest' | 'alpha';

// Dashboard edits are free-text, so URL-shaped columns are restricted to schemes
// that can't execute script (e.g. `javascript:`) when rendered as href/src.
function sanitizeLinkUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  return value.startsWith('http://') || value.startsWith('https://') ? value : null;
}

function sanitizeImageUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/') ? value : null;
}

// Maps one raw DB row (snake_case columns) to a Project. Rows are hand-edited
// in the Neon dashboard, so anything structurally unusable becomes null and is
// dropped rather than crashing the page.
export function mapRow(row: Record<string, unknown>): Project | null {
  if (typeof row.title !== 'string' || typeof row.description !== 'string') return null;
  const year = typeof row.year === 'number' ? row.year : Number(row.year);
  if (!Number.isFinite(year)) return null;
  const id = typeof row.id === 'number' ? row.id : Number(row.id);
  if (!Number.isFinite(id)) return null;
  return {
    id,
    title: row.title,
    description: row.description,
    imageUrl: sanitizeImageUrl(row.image_url),
    linkUrl: sanitizeLinkUrl(row.link_url),
    year,
    tags: Array.isArray(row.tags) ? row.tags.filter((t): t is string => typeof t === 'string') : [],
  };
}

export function allTags(projects: Project[]): string[] {
  return [...new Set(projects.flatMap(pr => pr.tags))].sort();
}

// OR semantics: a project matches if it has ANY selected tag. Empty selection = all.
export function filterByTags(projects: Project[], selected: ReadonlySet<string>): Project[] {
  if (selected.size === 0) return projects;
  return projects.filter(pr => pr.tags.some(t => selected.has(t)));
}

export function sortProjects(projects: Project[], mode: SortMode): Project[] {
  const out = [...projects];
  if (mode === 'alpha') out.sort((a, b) => a.title.localeCompare(b.title));
  else out.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  return out;
}
