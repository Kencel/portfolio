# Persona 5 Royal Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable Persona 5 Royal–styled personal portfolio (single interactive page) in Next.js, pixel-faithful to the design prototype, with live Codeforces rating data.

**Architecture:** One Next.js App Router route rendering a single client component tree. Section navigation is local React state (no routing). Pure logic (navigation, Codeforces mapping, SFX gating, row styling, image fallback) lives in `lib/` with Vitest unit tests; visual components port exact inline styles from the prototype and are verified by rendering.

**Tech Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 3.4 · Vitest + Testing Library · `next/font/google`.

## Global Constraints

- **Source of truth for all visuals:** `_handoff/persona-5-royal-portfolio/project/Persona5 Portfolio.dc.html` (referred to below as **PROTOTYPE**). Port exact hex, `clamp()`, transforms, and clip-paths from the cited line ranges. Do not eyeball-approximate.
- **Palette (exact):** bg `#0b0a0a`; ink `#F4F1EA`; panels `#141212` / rows `#151313`; borders `#2a2727`, `#333`; accent `#E4002B` (hardcoded — no switcher); CF teal `#17A2A2`; Discord `#5865F2`.
- **Fonts:** Anton (display), Bebas Neue (labels), Oswald 300–700 (body) via `next/font/google`.
- **Accent** is exposed as CSS custom property `--accent: #E4002B` on the root element; all accent references use `var(--accent)`.
- **Static-export friendly:** no server code, no runtime env. `next.config` uses `output: 'export'`.
- **Problems-solved = manual constant `472`.** Only `rating` / `maxRating` / `rank` come from the live API.
- **Codeforces handle:** `RamenNagi`. **GitHub:** `Kencel`. **Discord:** `ramen.nagi`.
- **Keybindings:** ↑/↓ move; 1–6 jump+open; Enter **or Z** open; Esc **or C** back.
- **Commit** after each task with the message shown in its final step.

## File Structure

```
package.json, tsconfig.json, next.config.mjs, postcss.config.mjs,
tailwind.config.ts, vitest.config.ts, vitest.setup.ts, .gitignore
app/
  layout.tsx        — fonts, <html>/<body>, base background
  page.tsx          — renders <Portfolio/>
  globals.css       — keyframes, custom scrollbar, resets, --accent default
components/
  Portfolio.tsx     — root client: state, keydown/mousemove, clock, composes views
  Backdrop.tsx      — background layers + scrolling marquee band
  MenuView.tsx      — title, menu list, avatar cluster, status bars, clock, controls, mute
  MenuRow.tsx       — one skewed menu item
  SectionPanel.tsx  — back header + active section switch
  ImageSlot.tsx     — image with graceful placeholder fallback
  sections/{About,Cp,Projects,Skills,Education,Contact}.tsx
lib/
  data.ts           — sections[], skills[], constants, contact links
  nav.ts            — pure navigation helpers
  rowStyle.ts       — menu-row style states
  codeforces.ts     — mapCfResponse() + useCodeforces() hook
  useSfx.ts         — Web Audio tones + mute gating
  useClock.ts       — live HH:MM + weekday
public/              — (empty; user drops avatar.* / sinag.* later)
```

---

### Task 1: Project scaffold (Next.js + Tailwind + Vitest + global styles)

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`, `vitest.config.ts`, `vitest.setup.ts`
- Create: `app/layout.tsx`, `app/globals.css`, `app/page.tsx` (temporary placeholder)
- Modify: `.gitignore` (already ignores `node_modules/`, `.next/`, `out/`, `_handoff/` — leave as is)

**Interfaces:**
- Produces: a running Next dev server and a working `npm test` command for all later tasks.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "persona5-portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "15.1.6",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7",
    "vitest": "^2.1.8",
    "@vitejs/plugin-react": "^4.3.4"
  }
}
```

- [ ] **Step 2: Create config files**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "_handoff"]
}
```

`next.config.mjs`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = { output: 'export', images: { unoptimized: true } };
export default nextConfig;
```

`postcss.config.mjs`:
```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

`tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#F4F1EA', base: '#0b0a0a', panel: '#141212', row: '#151313',
        cfteal: '#17A2A2', discord: '#5865F2',
      },
      fontFamily: {
        anton: ['var(--font-anton)'], bebas: ['var(--font-bebas)'], oswald: ['var(--font-oswald)'],
      },
    },
    screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
  },
  plugins: [],
} satisfies Config;
```

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, setupFiles: ['./vitest.setup.ts'] },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
});
```

`vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 3: Create `app/globals.css`** (port keyframes/scrollbar from PROTOTYPE lines 14–26; drop unused `p5spin`/`p5starpop`)

```css
:root { --accent: #E4002B; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #0b0a0a; }

@keyframes p5marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes p5panelIn { from { opacity: 0; transform: translateX(60px) skewX(-4deg); } to { opacity: 1; transform: translateX(0) skewX(0deg); } }
@keyframes p5rowIn { from { opacity: 0; transform: translateX(-80px) skewX(-9deg); } to { opacity: 1; transform: translateX(0) skewX(-9deg); } }
@keyframes p5pulse { 0%,100% { opacity: .85; } 50% { opacity: .35; } }

::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: #0b0a0a; }
::-webkit-scrollbar-thumb { background: var(--accent, #E4002B); }
```

- [ ] **Step 4: Create `app/layout.tsx`** (fonts + body)

```tsx
import type { Metadata } from 'next';
import { Anton, Bebas_Neue, Oswald } from 'next/font/google';
import './globals.css';

const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton' });
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });
const oswald = Oswald({ weight: ['300','400','500','600','700'], subsets: ['latin'], variable: '--font-oswald' });

export const metadata: Metadata = {
  title: 'RAMENNAGI — Phantom Thief of Algorithms',
  description: 'Persona 5 styled portfolio of Kenaz Celestino (@Kencel / CF @RamenNagi).',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${bebas.variable} ${oswald.variable}`}>
      <body style={{ margin: 0, background: '#0b0a0a', color: '#F4F1EA', fontFamily: 'var(--font-oswald), sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Create temporary `app/page.tsx`**

```tsx
export default function Page() {
  return <main style={{ minHeight: '100vh', color: '#F4F1EA', fontFamily: 'var(--font-anton)', padding: 40 }}>SCAFFOLD OK</main>;
}
```

- [ ] **Step 6: Install and verify**

Run: `npm install`
Then run: `npm run dev` — open http://localhost:3000, expect a black page reading "SCAFFOLD OK" in Anton font. Stop the server.
Then run: `npm test` — expect Vitest to run with "No test files found" (exit 0 is fine) or pass.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js + Tailwind + Vitest for portfolio"
```

---

### Task 2: Data layer (`lib/data.ts`)

**Files:**
- Create: `lib/data.ts`
- Test: `lib/data.test.ts`

**Interfaces:**
- Produces:
  - `type SectionId = 'about'|'cp'|'projects'|'skills'|'education'|'contact'`
  - `interface Section { id: SectionId; n: string; label: string; sub: string }`
  - `SECTIONS: Section[]` (length 6, order per PROTOTYPE lines 300–307)
  - `interface Skill { name: string; w: string; tag: string }`
  - `SKILLS: Skill[]` (PROTOTYPE lines 308–317)
  - `CF_DEFAULTS: { rating: number; maxRating: number; rank: string }` = `{ rating: 1445, maxRating: 1452, rank: 'Specialist' }`
  - `SOLVED = 472`
  - `MARQUEE = 'RAMENNAGI  ✦  PHANTOM THIEF OF ALGORITHMS  ✦  TAKE YOUR HEART  ✦  SPECIALIST  ✦  472 SOLVED  ✦ '` (single unit; the marquee component renders it twice)
  - `CF_HANDLE = 'RamenNagi'`

- [ ] **Step 1: Write the failing test** — `lib/data.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { SECTIONS, SKILLS, CF_DEFAULTS, SOLVED } from './data';

describe('data', () => {
  it('has six sections in menu order', () => {
    expect(SECTIONS.map(s => s.id)).toEqual(['about','cp','projects','skills','education','contact']);
    expect(SECTIONS[0]).toMatchObject({ n: '01', label: 'ABOUT ME', sub: 'PROFILE' });
    expect(SECTIONS[5]).toMatchObject({ n: '06', label: 'CONTACT', sub: 'CONFIDANTS' });
  });
  it('has eight skills with percentage widths', () => {
    expect(SKILLS).toHaveLength(8);
    expect(SKILLS[0]).toEqual({ name: 'C++ / ALGORITHMS', w: '92%', tag: 'MAIN' });
    SKILLS.forEach(s => expect(s.w).toMatch(/^\d{1,3}%$/));
  });
  it('exposes CF defaults and manual solved count', () => {
    expect(CF_DEFAULTS).toEqual({ rating: 1445, maxRating: 1452, rank: 'Specialist' });
    expect(SOLVED).toBe(472);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/data.test.ts`
Expected: FAIL — cannot resolve `./data`.

- [ ] **Step 3: Implement `lib/data.ts`** (values verbatim from PROTOTYPE lines 300–317)

```ts
export type SectionId = 'about' | 'cp' | 'projects' | 'skills' | 'education' | 'contact';
export interface Section { id: SectionId; n: string; label: string; sub: string }
export interface Skill { name: string; w: string; tag: string }

export const SECTIONS: Section[] = [
  { id: 'about',     n: '01', label: 'ABOUT ME',          sub: 'PROFILE' },
  { id: 'cp',        n: '02', label: 'COMP. PROGRAMMING',  sub: 'BATTLE RECORD' },
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
  'RAMENNAGI  ✦  PHANTOM THIEF OF ALGORITHMS  ✦  TAKE YOUR HEART  ✦  SPECIALIST  ✦  472 SOLVED  ✦ ';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/data.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/data.ts lib/data.test.ts
git commit -m "feat: add portfolio data layer"
```

---

### Task 3: Navigation helpers (`lib/nav.ts`)

**Files:**
- Create: `lib/nav.ts`
- Test: `lib/nav.test.ts`

**Interfaces:**
- Consumes: `SECTIONS` from `lib/data.ts`.
- Produces:
  - `wrapIndex(current: number | null, dir: 1 | -1, len: number): number` — moving from `null` with `+1` yields `0`; with `-1` yields `len-1`; otherwise `(current + dir + len) % len`. (Mirrors PROTOTYPE `_move`, lines 351–357.)
  - `sectionIndexForDigit(key: string): number` — returns index for `'1'..'6'` via matching `'0'+key` against `Section.n`, else `-1`. (PROTOTYPE line 325.)

- [ ] **Step 1: Write the failing test** — `lib/nav.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { wrapIndex, sectionIndexForDigit } from './nav';

describe('wrapIndex', () => {
  it('starts at 0 when moving down from null', () => expect(wrapIndex(null, 1, 6)).toBe(0));
  it('starts at last when moving up from null', () => expect(wrapIndex(null, -1, 6)).toBe(5));
  it('wraps forward past the end', () => expect(wrapIndex(5, 1, 6)).toBe(0));
  it('wraps backward past the start', () => expect(wrapIndex(0, -1, 6)).toBe(5));
  it('moves normally in the middle', () => expect(wrapIndex(2, 1, 6)).toBe(3));
});

describe('sectionIndexForDigit', () => {
  it('maps "1" to index 0 and "6" to index 5', () => {
    expect(sectionIndexForDigit('1')).toBe(0);
    expect(sectionIndexForDigit('6')).toBe(5);
  });
  it('returns -1 for out-of-range keys', () => {
    expect(sectionIndexForDigit('7')).toBe(-1);
    expect(sectionIndexForDigit('a')).toBe(-1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/nav.test.ts`
Expected: FAIL — cannot resolve `./nav`.

- [ ] **Step 3: Implement `lib/nav.ts`**

```ts
import { SECTIONS } from './data';

export function wrapIndex(current: number | null, dir: 1 | -1, len: number): number {
  const start = current == null ? (dir > 0 ? -1 : 0) : current;
  return (start + dir + len) % len;
}

export function sectionIndexForDigit(key: string): number {
  return SECTIONS.findIndex(s => s.n === '0' + key);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/nav.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/nav.ts lib/nav.test.ts
git commit -m "feat: add navigation helpers"
```

---

### Task 4: Menu row styling (`lib/rowStyle.ts`)

**Files:**
- Create: `lib/rowStyle.ts`
- Test: `lib/rowStyle.test.ts`

**Interfaces:**
- Produces: `rowStyle(hovered: number | null, i: number): React.CSSProperties` — ports PROTOTYPE `_rowStyle` (lines 389–399):
  - `hovered == null` → base.
  - `hovered === i` → selected (accent bg, `#0b0a0a` text, `translateX(30px) scale(1.03)`, white border, `boxShadow: '5px 5px 0 rgba(0,0,0,.55)'`).
  - else → dimmed (`opacity: 0.5`, `translateX(-6px)`).

- [ ] **Step 1: Write the failing test** — `lib/rowStyle.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { rowStyle } from './rowStyle';

describe('rowStyle', () => {
  it('base state when nothing hovered', () => {
    const s = rowStyle(null, 0);
    expect(s.background).toBe('#151313');
    expect(s.opacity).toBe(1);
  });
  it('selected state for the hovered index', () => {
    const s = rowStyle(2, 2);
    expect(s.background).toBe('var(--accent,#E4002B)');
    expect(s.color).toBe('#0b0a0a');
    expect(String(s.transform)).toContain('translateX(30px)');
    expect(s.boxShadow).toBe('5px 5px 0 rgba(0,0,0,.55)');
  });
  it('dimmed state for non-hovered rows while another is active', () => {
    const s = rowStyle(2, 0);
    expect(s.opacity).toBe(0.5);
    expect(String(s.transform)).toContain('translateX(-6px)');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/rowStyle.test.ts`
Expected: FAIL — cannot resolve `./rowStyle`.

- [ ] **Step 3: Implement `lib/rowStyle.ts`** (verbatim ported values from PROTOTYPE 389–399)

```ts
import type { CSSProperties } from 'react';

export function rowStyle(hovered: number | null, i: number): CSSProperties {
  const base: CSSProperties = {
    cursor: 'pointer', padding: '7px 22px 7px 14px',
    transition: 'transform .16s cubic-bezier(.2,.9,.3,1), background .16s, opacity .16s, color .16s, box-shadow .16s',
    transform: 'skewX(-9deg) translateX(0)', opacity: 1, background: '#151313', color: '#F4F1EA',
    border: '2px solid transparent', borderLeft: '5px solid transparent', boxShadow: 'none',
  };
  if (hovered == null) return base;
  if (hovered === i) return {
    ...base, transform: 'skewX(-9deg) translateX(30px) scale(1.03)', background: 'var(--accent,#E4002B)',
    color: '#0b0a0a', border: '2px solid #F4F1EA', borderLeft: '5px solid #0b0a0a',
    boxShadow: '5px 5px 0 rgba(0,0,0,.55)',
  };
  return { ...base, transform: 'skewX(-9deg) translateX(-6px)', opacity: 0.5 };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/rowStyle.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/rowStyle.ts lib/rowStyle.test.ts
git commit -m "feat: add menu row style states"
```

---

### Task 5: Codeforces mapping + hook (`lib/codeforces.ts`)

**Files:**
- Create: `lib/codeforces.ts`
- Test: `lib/codeforces.test.ts`

**Interfaces:**
- Consumes: `CF_DEFAULTS`, `CF_HANDLE` from `lib/data.ts`.
- Produces:
  - `type CfStats = { rating: number; maxRating: number; rank: string }`
  - `mapCfResponse(json: unknown, fallback: CfStats): CfStats` — if `json.status === 'OK'` and `result[0]` has numeric `rating`/`maxRating`, return `{ rating, maxRating, rank: titleCase(result[0].rank ?? fallback.rank) }`; else return `fallback`. `titleCase('specialist') === 'Specialist'`.
  - `cmProgressPct(rating: number): number` — maps rating onto the Newbie→CM scale for the climb bar. Scale floor 800, ceiling 1900 (CM), clamped 0–100: `Math.max(0, Math.min(100, Math.round((rating - 800) / (1900 - 800) * 100)))`. (At 1445 → 59; the design's static 48% is only the fallback when live data is unavailable — see Task 9/10 usage.)
  - `useCodeforces(): CfStats` — React hook; seeds state with `CF_DEFAULTS`, fetches `https://codeforces.com/api/user.info?handles=${CF_HANDLE}` in `useEffect`, applies `mapCfResponse` on success, keeps defaults on any error.

- [ ] **Step 1: Write the failing test** — `lib/codeforces.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { mapCfResponse, cmProgressPct } from './codeforces';

const fallback = { rating: 1445, maxRating: 1452, rank: 'Specialist' };

describe('mapCfResponse', () => {
  it('maps a valid OK response and title-cases the rank', () => {
    const json = { status: 'OK', result: [{ rating: 1500, maxRating: 1600, rank: 'expert' }] };
    expect(mapCfResponse(json, fallback)).toEqual({ rating: 1500, maxRating: 1600, rank: 'Expert' });
  });
  it('falls back on a FAILED status', () => {
    expect(mapCfResponse({ status: 'FAILED', comment: 'nope' }, fallback)).toEqual(fallback);
  });
  it('falls back on malformed json', () => {
    expect(mapCfResponse(null, fallback)).toEqual(fallback);
    expect(mapCfResponse({ status: 'OK', result: [] }, fallback)).toEqual(fallback);
    expect(mapCfResponse({ status: 'OK', result: [{ rating: 'x' }] }, fallback)).toEqual(fallback);
  });
});

describe('cmProgressPct', () => {
  it('clamps and scales rating onto 0-100', () => {
    expect(cmProgressPct(800)).toBe(0);
    expect(cmProgressPct(1900)).toBe(100);
    expect(cmProgressPct(1445)).toBe(59);
    expect(cmProgressPct(400)).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/codeforces.test.ts`
Expected: FAIL — cannot resolve `./codeforces`.

- [ ] **Step 3: Implement `lib/codeforces.ts`**

```ts
'use client';
import { useEffect, useState } from 'react';
import { CF_DEFAULTS, CF_HANDLE } from './data';

export type CfStats = { rating: number; maxRating: number; rank: string };

function titleCase(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
}

export function mapCfResponse(json: unknown, fallback: CfStats): CfStats {
  const j = json as { status?: string; result?: Array<{ rating?: unknown; maxRating?: unknown; rank?: unknown }> };
  const u = j && j.status === 'OK' && Array.isArray(j.result) ? j.result[0] : undefined;
  if (!u || typeof u.rating !== 'number' || typeof u.maxRating !== 'number') return fallback;
  return {
    rating: u.rating,
    maxRating: u.maxRating,
    rank: typeof u.rank === 'string' ? titleCase(u.rank) : fallback.rank,
  };
}

export function cmProgressPct(rating: number): number {
  return Math.max(0, Math.min(100, Math.round(((rating - 800) / (1900 - 800)) * 100)));
}

export function useCodeforces(): CfStats {
  const [stats, setStats] = useState<CfStats>(CF_DEFAULTS);
  useEffect(() => {
    let live = true;
    fetch(`https://codeforces.com/api/user.info?handles=${CF_HANDLE}`)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('cf http ' + r.status))))
      .then(json => { if (live) setStats(mapCfResponse(json, CF_DEFAULTS)); })
      .catch(() => { /* keep defaults */ });
    return () => { live = false; };
  }, []);
  return stats;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/codeforces.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/codeforces.ts lib/codeforces.test.ts
git commit -m "feat: add Codeforces mapping and live hook"
```

---

### Task 6: SFX hook (`lib/useSfx.ts`)

**Files:**
- Create: `lib/useSfx.ts`
- Test: `lib/useSfx.test.ts`

**Interfaces:**
- Produces:
  - `type Sfx = { select: () => void; confirm: () => void; back: () => void }`
  - `useSfx(muted: boolean): Sfx` — synthesizes square-wave tones via a lazily-created `AudioContext` (PROTOTYPE `_tone`/`_select`/`_confirm`/`_backSfx`, lines 360–387). When `muted` is true, no oscillator is created.
  - Internally testable pure factory: `createSfx(getMuted: () => boolean, AudioCtx: typeof AudioContext): Sfx` — the hook wraps this. Exported for tests.

- [ ] **Step 1: Write the failing test** — `lib/useSfx.test.ts`

```ts
import { describe, it, expect, vi } from 'vitest';
import { createSfx } from './useSfx';

function fakeAudioCtx() {
  const osc = { type: '', frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn(), start: vi.fn(), stop: vi.fn() };
  const gain = { gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn() };
  const ctx = { currentTime: 0, state: 'running', resume: vi.fn(), createOscillator: vi.fn(() => osc), createGain: vi.fn(() => gain), destination: {} };
  const Ctor = vi.fn(() => ctx) as unknown as typeof AudioContext;
  return { Ctor, ctx, osc };
}

describe('createSfx', () => {
  it('creates an oscillator when not muted', () => {
    const { Ctor, ctx } = fakeAudioCtx();
    const sfx = createSfx(() => false, Ctor);
    sfx.select();
    expect(ctx.createOscillator).toHaveBeenCalledTimes(1);
  });
  it('creates no oscillator when muted', () => {
    const { Ctor, ctx } = fakeAudioCtx();
    const sfx = createSfx(() => true, Ctor);
    sfx.select(); sfx.confirm(); sfx.back();
    expect(ctx.createOscillator).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/useSfx.test.ts`
Expected: FAIL — cannot resolve `./useSfx`.

- [ ] **Step 3: Implement `lib/useSfx.ts`** (tone params verbatim from PROTOTYPE 368–383)

```ts
'use client';
import { useRef } from 'react';

export type Sfx = { select: () => void; confirm: () => void; back: () => void };

export function createSfx(getMuted: () => boolean, AudioCtx: typeof AudioContext): Sfx {
  let ctx: AudioContext | null = null;
  const ac = (): AudioContext | null => {
    if (getMuted()) return null;
    try {
      if (!ctx) ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch { return null; }
  };
  const tone = (freq: number, dur: number, type: OscillatorType, vol: number, glide?: number) => {
    const c = ac(); if (!c) return;
    const t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.02);
  };
  return {
    select: () => tone(1180, 0.06, 'square', 0.09),
    confirm: () => { tone(720, 0.05, 'square', 0.11); setTimeout(() => tone(1090, 0.12, 'square', 0.11, 1300), 45); },
    back: () => tone(520, 0.08, 'square', 0.10, 360),
  };
}

export function useSfx(muted: boolean): Sfx {
  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  const ref = useRef<Sfx | null>(null);
  if (!ref.current) {
    const AC = (typeof window !== 'undefined'
      ? (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)
      : undefined) as typeof AudioContext | undefined;
    ref.current = AC ? createSfx(() => mutedRef.current, AC)
      : { select() {}, confirm() {}, back() {} };
  }
  return ref.current;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/useSfx.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/useSfx.ts lib/useSfx.test.ts
git commit -m "feat: add synthesized SFX hook with mute gating"
```

---

### Task 7: Clock hook (`lib/useClock.ts`)

**Files:**
- Create: `lib/useClock.ts`
- Test: `lib/useClock.test.ts`

**Interfaces:**
- Produces:
  - `formatClock(now: Date): { time: string; day: string }` — `time` = `HH:MM` zero-padded; `day` = `['SUN','MON','TUE','WED','THU','FRI','SAT'][now.getDay()]`. (PROTOTYPE lines 402–405, 429.)
  - `useClock(): { time: string; day: string }` — recomputes on an interval; safe pre-mount (returns a value for the current time immediately).

- [ ] **Step 1: Write the failing test** — `lib/useClock.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { formatClock } from './useClock';

describe('formatClock', () => {
  it('zero-pads hours and minutes', () => {
    const d = new Date(2026, 6, 3, 9, 5); // Fri
    expect(formatClock(d)).toEqual({ time: '09:05', day: 'FRI' });
  });
  it('handles midnight and Sunday', () => {
    const d = new Date(2026, 6, 5, 0, 0); // Sun
    expect(formatClock(d)).toEqual({ time: '00:00', day: 'SUN' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/useClock.test.ts`
Expected: FAIL — cannot resolve `./useClock`.

- [ ] **Step 3: Implement `lib/useClock.ts`**

```ts
'use client';
import { useEffect, useState } from 'react';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function formatClock(now: Date): { time: string; day: string } {
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return { time: `${hh}:${mm}`, day: DAYS[now.getDay()] };
}

export function useClock(): { time: string; day: string } {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(id);
  }, []);
  return formatClock(now);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/useClock.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/useClock.ts lib/useClock.test.ts
git commit -m "feat: add live clock hook"
```

---

### Task 8: ImageSlot component (`components/ImageSlot.tsx`)

**Files:**
- Create: `components/ImageSlot.tsx`
- Test: `components/ImageSlot.test.tsx`

**Interfaces:**
- Produces: `ImageSlot(props: { src?: string; alt?: string; placeholder: string; mask?: string; className?: string; style?: CSSProperties })` — renders an `<img>` when `src` is set and hasn't errored; on `onError` or when `src` is empty, renders the P5 placeholder (centered uppercase `placeholder` text, dashed border, camera glyph). `mask` applies `clipPath`. This replaces the prototype's drop-to-fill `<image-slot>` (drop persistence is out of scope — see spec §11); a real image is supplied by dropping a file in `/public` and passing its path as `src`.

- [ ] **Step 1: Write the failing test** — `components/ImageSlot.test.tsx`

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageSlot } from './ImageSlot';

describe('ImageSlot', () => {
  it('shows the placeholder when no src', () => {
    render(<ImageSlot placeholder="DROP YOUR PHOTO" />);
    expect(screen.getByText('DROP YOUR PHOTO')).toBeInTheDocument();
  });
  it('renders an image when src is provided', () => {
    render(<ImageSlot src="/avatar.jpg" alt="me" placeholder="DROP YOUR PHOTO" />);
    expect(screen.getByAltText('me')).toBeInTheDocument();
  });
  it('falls back to placeholder if the image errors', () => {
    render(<ImageSlot src="/missing.jpg" alt="me" placeholder="DROP YOUR PHOTO" />);
    fireEvent.error(screen.getByAltText('me'));
    expect(screen.getByText('DROP YOUR PHOTO')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/ImageSlot.test.tsx`
Expected: FAIL — cannot resolve `./ImageSlot`.

- [ ] **Step 3: Implement `components/ImageSlot.tsx`**

```tsx
'use client';
import { useState, type CSSProperties } from 'react';

export function ImageSlot({ src, alt = '', placeholder, mask, className, style }: {
  src?: string; alt?: string; placeholder: string; mask?: string; className?: string; style?: CSSProperties;
}) {
  const [errored, setErrored] = useState(false);
  const showImg = !!src && !errored;
  const base: CSSProperties = { position: 'relative', overflow: 'hidden', clipPath: mask, ...style };
  if (showImg) {
    return (
      <div className={className} style={base}>
        <img src={src} alt={alt} onError={() => setErrored(true)}
             style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    );
  }
  return (
    <div className={className} style={{ ...base, background: 'rgba(244,241,234,.04)', border: '2px dashed rgba(244,241,234,.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 12 }}>
      <span style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.16em', fontSize: 14,
        color: 'rgba(244,241,234,.7)' }}>{placeholder}</span>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/ImageSlot.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add components/ImageSlot.tsx components/ImageSlot.test.tsx
git commit -m "feat: add ImageSlot with graceful placeholder"
```

---

### Task 9: Backdrop component (`components/Backdrop.tsx`)

**Files:**
- Create: `components/Backdrop.tsx`

**Interfaces:**
- Consumes: `MARQUEE` from `lib/data.ts`.
- Produces: `Backdrop()` — renders the five background layers (PROTOTYPE lines 33–37) plus the diagonal scrolling marquee band (lines 40–45). Marquee renders `MARQUEE` twice (second copy `aria-hidden`) inside the `p5marquee`-animated flex row.

- [ ] **Step 1: Implement `components/Backdrop.tsx`**

Port the exact inline styles from **PROTOTYPE lines 33–45**. Structure:

```tsx
import { MARQUEE } from '@/lib/data';

export function Backdrop() {
  return (
    <>
      {/* halftone dots — PROTOTYPE line 33 */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--accent,#E4002B) 1.3px, transparent 1.4px)', backgroundSize: '15px 15px', opacity: .16, pointerEvents: 'none' }} />
      {/* diagonal hatch — line 34 */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(112deg, transparent 0 9px, rgba(228,0,43,.05) 9px 10px)', pointerEvents: 'none' }} />
      {/* red shard — line 35 */}
      <div style={{ position: 'absolute', top: '-14%', left: '-8%', width: '52%', height: '130%', background: 'var(--accent,#E4002B)', opacity: .9, clipPath: 'polygon(0 0, 100% 0, 62% 100%, 0% 100%)', pointerEvents: 'none' }} />
      {/* red shard dots — line 36 */}
      <div style={{ position: 'absolute', top: '-14%', left: '-8%', width: '52%', height: '130%', backgroundImage: 'radial-gradient(#0b0a0a 1.6px, transparent 1.7px)', backgroundSize: '12px 12px', opacity: .22, clipPath: 'polygon(0 0, 100% 0, 62% 100%, 0% 100%)', pointerEvents: 'none' }} />
      {/* outlined shard — line 37 */}
      <div style={{ position: 'absolute', bottom: '-30%', right: '-6%', width: '46%', height: '80%', background: 'transparent', border: '3px solid var(--accent,#E4002B)', opacity: .35, clipPath: 'polygon(18% 0, 100% 12%, 84% 100%, 0 82%)', pointerEvents: 'none', transform: 'rotate(-4deg)' }} />
      {/* marquee band — lines 40–45 */}
      <div style={{ position: 'absolute', bottom: '6%', left: '-10%', width: '130%', transform: 'rotate(-4deg)', overflow: 'hidden', pointerEvents: 'none', opacity: .9, zIndex: 1 }}>
        <div style={{ display: 'flex', width: 'max-content', whiteSpace: 'nowrap', animation: 'p5marquee 34s linear infinite', background: '#0b0a0a', borderTop: '2px solid var(--accent,#E4002B)', borderBottom: '2px solid var(--accent,#E4002B)' }}>
          <span style={{ fontFamily: "'Anton', var(--font-anton), sans-serif", fontSize: 16, letterSpacing: '.32em', color: 'var(--accent,#E4002B)', padding: '5px 0' }}>{MARQUEE}{MARQUEE}</span>
          <span aria-hidden style={{ fontFamily: "'Anton', var(--font-anton), sans-serif", fontSize: 16, letterSpacing: '.32em', color: 'var(--accent,#E4002B)', padding: '5px 0' }}>{MARQUEE}{MARQUEE}</span>
        </div>
      </div>
    </>
  );
}
```

Note: the prototype's marquee string already contains two repeats; here `MARQUEE` is one repeat rendered twice per span (`{MARQUEE}{MARQUEE}`) and the span itself is duplicated, matching the `translateX(-50%)` loop.

- [ ] **Step 2: Verify render**

Temporarily edit `app/page.tsx` to render `<div style={{position:'relative',height:'100vh'}}><Backdrop/></div>`. Run `npm run dev`, open http://localhost:3000: expect the red diagonal shard top-left, halftone dots, and a scrolling marquee band near the bottom. Revert `app/page.tsx` to the scaffold placeholder. Stop server.

- [ ] **Step 3: Commit**

```bash
git add components/Backdrop.tsx
git commit -m "feat: add background layers and marquee"
```

---

### Task 10: MenuRow + MenuView (`components/MenuRow.tsx`, `components/MenuView.tsx`)

**Files:**
- Create: `components/MenuRow.tsx`, `components/MenuView.tsx`

**Interfaces:**
- Consumes: `rowStyle` (Task 4), `SECTIONS`/`CF_DEFAULTS`/`SOLVED` (data), `useCodeforces` (Task 5), `useClock` (Task 7), `ImageSlot` (Task 8).
- Produces:
  - `MenuRow(props: { section: Section; index: number; hovered: number | null; onEnter: (i: number) => void; onOpen: (id: SectionId) => void })` — renders one row using `rowStyle(hovered, index)`, with `data-p5row="1"`, inner content counter-skewed `skewX(9deg)` (PROTOTYPE lines 64–69).
  - `MenuView(props: { hovered: number | null; muted: boolean; onToggleMute: () => void; onEnter: (i: number) => void; onOpen: (id: SectionId) => void; onClearHover: () => void })` — the full menu layout (PROTOTYPE lines 49–109): title block, menu list, avatar cluster, status bars, clock, controls hint, and a mute button. CF rating bar uses `useCodeforces()`; clock uses `useClock()`.

- [ ] **Step 1: Implement `components/MenuRow.tsx`** (port PROTOTYPE 64–69)

```tsx
'use client';
import type { Section, SectionId } from '@/lib/data';
import { rowStyle } from '@/lib/rowStyle';

export function MenuRow({ section, index, hovered, onEnter, onOpen }: {
  section: Section; index: number; hovered: number | null;
  onEnter: (i: number) => void; onOpen: (id: SectionId) => void;
}) {
  return (
    <div data-p5row="1" onMouseEnter={() => onEnter(index)} onClick={() => onOpen(section.id)} style={rowStyle(hovered, index)}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, transform: 'skewX(9deg)' }}>
        <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 'clamp(14px,1.3vw,20px)', opacity: .65, minWidth: 34 }}>{section.n}</span>
        <span style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(20px,2.7vw,38px)', lineHeight: .92, letterSpacing: '.005em' }}>{section.label}</span>
        <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 'clamp(12px,1.1vw,17px)', letterSpacing: '.18em', opacity: .7, alignSelf: 'center' }}>{section.sub}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Implement `components/MenuView.tsx`**

Port PROTOTYPE **lines 49–109** exactly (title block 52–59, menu list wrapper 62–72 mapping `SECTIONS` to `MenuRow`, status bars 75–84, avatar cluster 88–97 using `ImageSlot` with the hexagon `mask="polygon(14% 0, 100% 6%, 92% 100%, 0 90%)"` and `src="/avatar.jpg"`, clock 100–103, controls hint 106–109). Key wiring:
- The menu-list wrapper gets `onMouseLeave={onClearHover}` (matches prototype `onMouseLeave` on line 62; harmless with the global mousemove clear).
- The CF rating status bar (PROTOTYPE 77–78) uses live data: `const cf = useCodeforces();` → label `CF RATING`, value `` `${cf.rating} / MAX ${cf.maxRating}` ``, and bar `width` from `cmProgressPct(cf.rating) + '%'` (fallback stays 48% only if you prefer the static look — use `cmProgressPct` for live).
- The problems bar (PROTOTYPE 81–82) uses `SOLVED` (472) with static `width: '72%'`.
- Add a **mute button** just after the controls hint block: a small skewed button, `onClick={onToggleMute}`, showing `♪ SFX ON` / `SFX MUTED` per `muted`. Style to match: `fontFamily: var(--font-bebas)`, `border: 2px solid var(--accent)`, `background:#0b0a0a`, `padding:6px 12px`, `transform:skewX(-6deg)`, positioned top-right under the controls hint (e.g. `position:absolute; top:clamp(52px,6vw,86px); right:clamp(24px,4vw,70px); zIndex:7`).
- The avatar codename card (PROTOTYPE 93–96) and title (54) use the fixed codename `RAMENNAGI` (the prototype's `codename` prop default).

Signature and skeleton:

```tsx
'use client';
import { SECTIONS, SOLVED, type SectionId } from '@/lib/data';
import { useCodeforces, cmProgressPct } from '@/lib/codeforces';
import { useClock } from '@/lib/useClock';
import { ImageSlot } from './ImageSlot';
import { MenuRow } from './MenuRow';

export function MenuView({ hovered, muted, onToggleMute, onEnter, onOpen, onClearHover }: {
  hovered: number | null; muted: boolean; onToggleMute: () => void;
  onEnter: (i: number) => void; onOpen: (id: SectionId) => void; onClearHover: () => void;
}) {
  const cf = useCodeforces();
  const { time, day } = useClock();
  // ... full layout ported from PROTOTYPE 49–109; menu list:
  //   {SECTIONS.map((s, i) => <MenuRow key={s.id} section={s} index={i} hovered={hovered} onEnter={onEnter} onOpen={onOpen} />)}
  // CF bar value: `${cf.rating} / MAX ${cf.maxRating}` ; bar width: cmProgressPct(cf.rating)+'%'
  // Avatar: <ImageSlot src="/avatar.jpg" alt="RAMENNAGI" placeholder="DROP YOUR PHOTO"
  //   mask="polygon(14% 0, 100% 6%, 92% 100%, 0 90%)" style={{ width:'clamp(220px,24vw,360px)', height:'clamp(300px,32vw,470px)', display:'block', position:'relative' }} />
  return (/* ... */);
}
```

- [ ] **Step 3: Verify render**

Temporarily render `<div style={{position:'relative',height:'100vh',overflow:'hidden'}}><Backdrop/><MenuView hovered={null} muted={false} onToggleMute={()=>{}} onEnter={()=>{}} onOpen={()=>{}} onClearHover={()=>{}} /></div>` in `app/page.tsx`. `npm run dev`: expect the full menu — skewed RAMENNAGI title with red drop-shadow, tag chips, 6 menu rows, avatar placeholder (hexagon) on the right, status bars showing `1445 / MAX 1452` and `472`, clock bottom-right, controls hint + mute button top-right. Revert `app/page.tsx`. Stop server.

- [ ] **Step 4: Commit**

```bash
git add components/MenuRow.tsx components/MenuView.tsx
git commit -m "feat: add menu view and rows"
```

---

### Task 11: Section content components (`components/sections/*.tsx`)

**Files:**
- Create: `components/sections/About.tsx`, `Cp.tsx`, `Projects.tsx`, `Skills.tsx`, `Education.tsx`, `Contact.tsx`

**Interfaces:**
- Consumes: `SKILLS` (data), `useCodeforces`/`cmProgressPct` (Cp), `ImageSlot` (Projects).
- Produces: one default-styled component per section, each returning the inner content block (NOT the panel chrome — that's Task 12). Port exactly:
  - `About` — PROTOTYPE lines 135–156.
  - `Cp` — lines 159–192. Wire the rating card (165–166) and the climb bar (188) to `useCodeforces()`: rating number = `cf.rating`; "Peak `cf.maxRating` · `cf.rank`"; bar width = `cmProgressPct(cf.rating)+'%'`. The `TOTAL · SOLVED` card (172) stays `472`.
  - `Projects` — lines 195–230. The SINAG screenshot uses `<ImageSlot src="/sinag.jpg" alt="Project SINAG" placeholder="PROJECT SINAG SCREENSHOT" style={{ width:'100%', height:190, display:'block' }} />`.
  - `Skills` — lines 233–245, mapping `SKILLS` with `barStyle` = `{ height:'100%', background:'var(--accent,#E4002B)', width: sk.w }`.
  - `Education` — lines 248–269.
  - `Contact` — lines 272–287.

- [ ] **Step 1: Implement the six section files**

Each is a straight port of its cited line range into a single exported function returning the block's JSX (convert `style="..."` → `style={{...}}`, `class` → `className`, keep all hex/`clamp()`/transform values). Example header for each: `export function About() { return (/* PROTOTYPE 135–156 */); }`. For `Cp` and `Projects`, add the `'use client'` directive (they use hooks / interactive image) and the wiring described above.

- [ ] **Step 2: Verify render**

Temporarily render each section inside a `<div style={{position:'relative', padding:40}}>` in `app/page.tsx` (one at a time or stacked). `npm run dev`: confirm About cards, CP stat cards + progress bar (rating 1445 / peak 1452 Specialist), Projects cards with SINAG placeholder + tags + VISIT SITE link, Skills bars (8 rows), Education cards, Contact links (Codeforces/AtCoder/GitHub/Discord). Revert `app/page.tsx`. Stop server.

- [ ] **Step 3: Commit**

```bash
git add components/sections
git commit -m "feat: add six section content components"
```

---

### Task 12: SectionPanel (`components/SectionPanel.tsx`)

**Files:**
- Create: `components/SectionPanel.tsx`

**Interfaces:**
- Consumes: `SECTIONS`, the six section components, `SectionId`.
- Produces: `SectionPanel(props: { view: Exclude<SectionId, never>; onBack: () => void })` — renders the panel background + `p5panelIn` animated container + back header (`◄ BACK`, `curSub`, `curLabel` from `SECTIONS.find(s=>s.id===view)`) + the divider, then switches on `view` to render the matching section component. Ports PROTOTYPE lines 114–132 for the chrome.

- [ ] **Step 1: Implement `components/SectionPanel.tsx`**

```tsx
'use client';
import { SECTIONS, type SectionId } from '@/lib/data';
import { About } from './sections/About';
import { Cp } from './sections/Cp';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';
import { Education } from './sections/Education';
import { Contact } from './sections/Contact';

const BODY: Record<SectionId, () => JSX.Element> = {
  about: About, cp: Cp, projects: Projects, skills: Skills, education: Education, contact: Contact,
};

export function SectionPanel({ view, onBack }: { view: SectionId; onBack: () => void }) {
  const cur = SECTIONS.find(s => s.id === view)!;
  const Body = BODY[view];
  // Port PROTOTYPE 114–132 for wrapper + header + divider; back div uses onClick={onBack}.
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20, background: '#0b0a0a', overflowY: 'auto' }}>
      {/* panel bg — PROTOTYPE 117–118 */}
      {/* animated content wrapper — 120 (animation: 'p5panelIn .32s cubic-bezier(.2,.9,.3,1) both') */}
      {/*   header — 122–130: BACK button (onClick={onBack}), curSub={cur.sub}, curLabel={cur.label} */}
      {/*   divider — 132 */}
      <Body />
    </div>
  );
}
```

Fill in the commented regions by porting the exact styles from the cited lines.

- [ ] **Step 2: Verify render**

Temporarily render `<div style={{position:'relative',height:'100vh'}}><SectionPanel view="cp" onBack={()=>{}} /></div>` in `app/page.tsx`. `npm run dev`: expect the CP panel with the red shard top-right, `◄ BACK` chip, `BATTLE RECORD` / `COMP. PROGRAMMING` header, divider, and the CP content. Revert. Stop server.

- [ ] **Step 3: Commit**

```bash
git add components/SectionPanel.tsx
git commit -m "feat: add section panel chrome and switch"
```

---

### Task 13: Portfolio root — state, input handling, composition (`components/Portfolio.tsx`, `app/page.tsx`)

**Files:**
- Create: `components/Portfolio.tsx`
- Modify: `app/page.tsx` (final — render `<Portfolio/>`)

**Interfaces:**
- Consumes: everything above (`Backdrop`, `MenuView`, `SectionPanel`, `useSfx`, `wrapIndex`, `sectionIndexForDigit`, `SECTIONS`, `SectionId`).
- Produces: `Portfolio()` — the root client component holding `view`, `hovered`, `muted` state; global `keydown` + `mousemove` handlers; composes `Backdrop` always, `MenuView` when `view === 'menu'`, `SectionPanel` otherwise.

- [ ] **Step 1: Implement `components/Portfolio.tsx`**

Port the behavior from PROTOTYPE `componentDidMount`/handlers (lines 320–344) and `_open`/`_back`/`_hover` (385–387), adapted to hooks. Keybindings include **Z (open, alias Enter)** and **C (back, alias Esc)** per Global Constraints.

```tsx
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SECTIONS, type SectionId } from '@/lib/data';
import { wrapIndex, sectionIndexForDigit } from '@/lib/nav';
import { useSfx } from '@/lib/useSfx';
import { Backdrop } from './Backdrop';
import { MenuView } from './MenuView';
import { SectionPanel } from './SectionPanel';

type View = 'menu' | SectionId;

export function Portfolio() {
  const [view, setView] = useState<View>('menu');
  const [hovered, setHovered] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const sfx = useSfx(muted);

  const viewRef = useRef<View>(view);
  const hoveredRef = useRef<number | null>(hovered);
  viewRef.current = view; hoveredRef.current = hovered;

  const open = useCallback((id: SectionId) => { sfx.confirm(); setView(id); }, [sfx]);
  const goMenu = useCallback(() => { sfx.back(); setView('menu'); setHovered(null); }, [sfx]);
  const enter = useCallback((i: number) => {
    setHovered(prev => { if (prev !== i) sfx.select(); return i; });
  }, [sfx]);
  const clearHover = useCallback(() => setHovered(prev => (prev == null ? prev : null)), []);
  const move = useCallback((dir: 1 | -1) => {
    setHovered(prev => { const next = wrapIndex(prev, dir, SECTIONS.length); sfx.select(); return next; });
  }, [sfx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const v = viewRef.current;
      if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') { if (v !== 'menu') goMenu(); return; }
      if (v !== 'menu') return;
      const digit = sectionIndexForDigit(e.key);
      if (digit >= 0) { setHovered(digit); sfx.select(); open(SECTIONS[digit].id); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter' || e.key === 'z' || e.key === 'Z') {
        const h = hoveredRef.current; if (h != null) open(SECTIONS[h].id);
      }
    };
    const onMove = (e: MouseEvent) => {
      if (viewRef.current !== 'menu' || hoveredRef.current == null) return;
      const t = e.target as HTMLElement | null;
      if (t && t.closest && t.closest('[data-p5row]')) return;
      setHovered(null);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousemove', onMove);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('mousemove', onMove); };
  }, [goMenu, move, open, sfx]);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', height: '100vh', overflow: 'hidden',
      background: '#0b0a0a', color: '#F4F1EA', fontFamily: 'var(--font-oswald), sans-serif', userSelect: 'none' }}>
      <Backdrop />
      {view === 'menu'
        ? <MenuView hovered={hovered} muted={muted} onToggleMute={() => setMuted(m => !m)}
            onEnter={enter} onOpen={open} onClearHover={clearHover} />
        : <SectionPanel view={view} onBack={goMenu} />}
    </div>
  );
}
```

- [ ] **Step 2: Finalize `app/page.tsx`**

```tsx
import { Portfolio } from '@/components/Portfolio';
export default function Page() { return <Portfolio />; }
```

- [ ] **Step 3: Verify all interactions**

Run `npm run dev`, open http://localhost:3000 and confirm:
- Arrow keys move the highlight (rows skew/translate, dim others); `1`–`6` jump to and open a section; `Enter`/`Z` open the highlighted row; `Esc`/`C` return to menu.
- Mouse hover highlights a row and clicking opens it; moving the mouse off the rows clears the highlight, but keyboard selection persists.
- Section panels animate in; `◄ BACK` returns to menu.
- Mute button toggles label and silences the blips.
- Live CF rating loads (may briefly show 1445 then refresh).

- [ ] **Step 4: Commit**

```bash
git add components/Portfolio.tsx app/page.tsx
git commit -m "feat: wire portfolio root with keyboard/mouse nav and SFX"
```

---

### Task 14: Responsive rework (`components/Portfolio.tsx`, `components/MenuView.tsx`)

**Files:**
- Modify: `components/Portfolio.tsx`, `components/MenuView.tsx`

**Interfaces:**
- No signature changes. Adds a `< lg` (max-width: 1023px) layout that restacks the menu into a scrollable column.

- [ ] **Step 1: Add a viewport hook** — extend `lib/useClock.ts`? No — create `lib/useIsMobile.ts`

```ts
'use client';
import { useEffect, useState } from 'react';
export function useIsNarrow(query = '(max-width: 1023px)'): boolean {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setNarrow(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return narrow;
}
```

- [ ] **Step 2: Apply in `Portfolio.tsx`**

Import `useIsNarrow`. When narrow and on the menu, drop the fixed-height clamp so the page scrolls: change the root's `height`/`overflow` to `{ height: narrow ? 'auto' : '100vh', minHeight: '100vh', overflow: narrow ? 'visible' : 'hidden' }` and pass `narrow` into `MenuView`.

- [ ] **Step 3: Apply in `MenuView.tsx`**

Add a `narrow?: boolean` prop. When `narrow`, switch the two absolutely-positioned clusters (the title/menu column and the avatar cluster) to static/relative flow in a single scrolling column ordered title → menu → avatar → status bars; hide the bottom-right clock and top-right controls hint (keep the mute button reachable, e.g. inline near the title). Keep all skew/aesthetic styles. Use conditional `position`/`inset` values rather than duplicating the JSX.

- [ ] **Step 4: Verify responsive**

Run `npm run dev`. In devtools set viewport to 390px wide: expect the menu to become a vertical, scrollable column (title, menu rows, avatar, status bars) with no horizontal overflow and preserved skew styling. Open a section — panels already reflow via their `auto-fit` grids. Resize back to ≥1024px: expect the exact desktop layout. Stop server.

- [ ] **Step 5: Commit**

```bash
git add components/Portfolio.tsx components/MenuView.tsx lib/useIsMobile.ts
git commit -m "feat: responsive column layout below lg"
```

---

### Task 15: Production build, README, and image-swap docs

**Files:**
- Create: `README.md`
- Create: `public/.gitkeep`

**Interfaces:** none.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all suites pass (data, nav, rowStyle, codeforces, useSfx, useClock, ImageSlot).

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds; a static `out/` directory is produced (from `output: 'export'`). Fix any type or lint errors surfaced.

- [ ] **Step 3: Write `README.md`**

Include: project summary; `npm install` / `npm run dev` / `npm run build`; **how to add real images** — "drop `avatar.jpg` (or `.png`/`.webp`) and `sinag.jpg` into `public/`; the avatar and Project SINAG slots pick them up automatically (update the `src` extension in `MenuView.tsx` / `Projects.tsx` if not `.jpg`)"; note that Codeforces rating is fetched live from the public API for handle `RamenNagi`, with `472` solved kept as a manual constant in `lib/data.ts`; deploy note (any static host — the `out/` folder — or Vercel).

- [ ] **Step 4: Add `public/.gitkeep`** so the empty folder is tracked.

- [ ] **Step 5: Commit**

```bash
git add README.md public/.gitkeep
git commit -m "docs: add README and image-swap instructions"
```

---

## Self-Review

**Spec coverage:**
- §2 stack → Task 1. §3 experience → Tasks 9–13. §4 state → Task 13. §5 components → Tasks 2–13 (every file mapped). §6 visual fidelity → Tasks 9–12 (line-range ports) + Task 1 (globals/keyframes/scrollbar). §7 content → Task 2 (data) + Tasks 10–11 (rendered copy). §8 interactions → Task 13 (keys incl. Z/C, mouse) + Task 6 (SFX) + Task 7 (clock). §9 responsive → Task 14. §9a Codeforces → Task 5 (+ consumed in Tasks 10–11). §10 images → Task 8 (+ used in 10–11). §11 out-of-scope respected (no accent switcher, no drop persistence). §12 verification → Tasks 13–15.
- Gap check: the design's static `48%` CF bar and `72%` solved bar — CF bar is now derived live via `cmProgressPct` (documented deviation, more correct); the 72% solved bar stays static (Task 10). No uncovered requirement remains.

**Placeholder scan:** No "TBD"/"implement later". Visual tasks cite exact PROTOTYPE line ranges (authoritative source in-repo) rather than duplicating ~440 lines; logic tasks contain full code. This is deliberate and actionable, not a placeholder.

**Type consistency:** `SectionId`, `Section`, `Skill`, `CfStats`, `Sfx` used consistently. `wrapIndex`/`sectionIndexForDigit`/`rowStyle`/`mapCfResponse`/`cmProgressPct`/`useCodeforces`/`createSfx`/`useSfx`/`formatClock`/`useClock`/`ImageSlot` names match between their producing task and consumers. `MenuView` prop set is identical in Tasks 10, 13, 14 (14 adds optional `narrow`).
