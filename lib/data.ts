export type SectionId = 'about' | 'cp' | 'projects' | 'skills' | 'education' | 'contact';
export interface Section { id: SectionId; n: string; label: string; sub: string }
export interface Skill { name: string; w: string; tag: string }

export const SECTIONS: Section[] = [
  { id: 'about',     n: '01', label: 'ABOUT ME',           sub: 'PROFILE' },
  { id: 'cp',        n: '02', label: 'COMP. PROG',         sub: 'BATTLE RECORD' },
  { id: 'projects',  n: '03', label: 'PROJECTS',           sub: 'TREASURES' },
  { id: 'skills',    n: '04', label: 'SKILLS',             sub: 'ARCANA' },
  { id: 'education', n: '05', label: 'EDUCATION',          sub: 'STATUS' },
  { id: 'contact',   n: '06', label: 'CONTACT',            sub: 'CONFIDANTS' },
];

export const SKILLS: Skill[] = [
  { name: 'C++ / ALGORITHMS', w: '92%', tag: 'MAIN' },
  { name: 'NEXT.JS / REACT',  w: '85%', tag: 'WEB' },
  { name: 'TAILWINDCSS',      w: '84%', tag: 'WEB' },
  { name: 'SHADCN/UI',        w: '78%', tag: 'WEB' },
  { name: 'NITRO',            w: '70%', tag: 'API' },
  { name: 'PRISMA',           w: '74%', tag: 'DATA' },
  { name: 'POSTGRESQL',       w: '72%', tag: 'DATA' },
  { name: 'PNPM / GIT',       w: '80%', tag: 'TOOL' },
];

export const CF_HANDLE = 'RamenNagi';
export const CF_DEFAULTS = { rating: 1445, maxRating: 1452, rank: 'Specialist' };
export const SOLVED = 472;
export const MARQUEE =
  'RAMENNAGI  ✦  PHANTOM THIEF OF ALGORITHMS  ✦  TAKE YOUR HEART  ✦  SPECIALIST  ✦  472 SOLVED  ✦ ';

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
