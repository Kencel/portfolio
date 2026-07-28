export type SectionId = 'about' | 'compprog' | 'projects' | 'skills' | 'contact';

interface MenuEntryBase { n: string; label: string; sub: string }
/** A row that opens a panel in place; the id doubles as the URL fragment. */
export interface Section extends MenuEntryBase { id: SectionId; href?: never }
/** A row that leaves the site: new tab, no panel, no history entry. */
export interface ExternalEntry extends MenuEntryBase { id?: never; href: string }
export type MenuEntry = Section | ExternalEntry;

/** Explicit guard: a bare `entry.href` truthiness check narrows one branch of
 *  the union but leaves `entry.id` optional in the other. */
export function isExternal(entry: MenuEntry): entry is ExternalEntry {
  return entry.href !== undefined;
}

// Served by the same deployment as this site — a host rewrite in
// next.config.mjs points the whole subdomain at `public/resume.pdf`.
export const RESUME_URL = 'https://resume.kenazc.com';

// Menu order, digit shortcuts, and panel titles all read from this array.
// Most rows are sections; RESUME is an external entry, so it has an `href`
// instead of an `id` and never becomes a view.
export const SECTIONS: MenuEntry[] = [
  { id: 'about',     n: '01', label: 'ABOUT ME',           sub: 'PROFILE' },
  { id: 'compprog',  n: '02', label: 'COMP. PROG',         sub: 'BATTLE RECORD' },
  { id: 'projects',  n: '03', label: 'PROJECTS',           sub: 'TREASURES' },
  { id: 'skills',    n: '04', label: 'SKILLS',             sub: 'ARCANA' },
  { href: RESUME_URL, n: '05', label: 'RESUME',            sub: 'DOSSIER' },
  { id: 'contact',   n: '06', label: 'CONTACT',            sub: 'CONFIDANTS' },
];

export const SKILLS: string[] = [
  'C++',
  'PYTHON',
  'JAVA',
  'DJANGO',
  'NEXT.JS',
  'REACT',
  'NODE.JS',
  'PNPM',
  'GIT',
  'POSTGRESQL',
];

export const MARQUEE =
  'RAMENNAGI  ✦  COMPUTER SCIENCE @ ATENEO  ✦  COMPETITIVE PROGRAMMER  ✦  PROBLEM SOLVER  ✦ ';

export const CODENAME = 'RAMENNAGI';

// Current-focus lines on the menu status card. Copy is grounded in the About
// section — evergreen, no stale numbers.
export const STATUS: [string, string][] = [
  ['LEARNING', 'AI/ML & DATA SCIENCE'],
  ['BUILDING', 'THIS SITE'],
  ['GRINDING', 'COMPETITIVE PROGRAMMING'],
];

export interface Attribute { axis: string; value: number }

// Persona-style social stats mapped to real developer traits. Placeholder
// values — tune to taste after seeing the radar render.
export const ATTRIBUTES: Attribute[] = [
  { axis: 'KNOWLEDGE',    value: 88 }, // theory / algorithms
  { axis: 'PROFICIENCY',  value: 84 }, // implementation / clean code
  { axis: 'GUTS',         value: 82 }, // hard problems, contest pressure
  { axis: 'DILIGENCE',    value: 80 }, // consistency, the grind
  { axis: 'INGENUITY',    value: 78 }, // creative problem approaches
  { axis: 'ADAPTABILITY', value: 72 }, // picking up new stacks
];
