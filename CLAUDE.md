# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Kenaz's personal portfolio site (ramennagi.vercel.app) — a Persona 5 Royal–inspired
menu UI built from scratch in Next.js 15 (App Router) + React 19 + TypeScript.
Deployed on Vercel; production branch is `master`.

## Commands

```bash
npm run dev                      # dev server at http://localhost:3000
npm test                         # vitest run (what CI runs)
npm test -- lib/nav.test.ts      # single test file
npm test -- -t "wraps around"    # single test by name
npm run test:watch               # vitest watch mode
npm run build                    # next build (CI gate; builds fine without DATABASE_URL)
npm run db:apply -- schema seed  # apply db/schema.sql + db/seed.sql to Neon (needs DATABASE_URL in .env.local)
```

CI (`.github/workflows/ci.yml`) runs `npm test` then `npm run build` on PRs and
pushes to master. Both must pass.

## Architecture

**One page, one server boundary.** `app/page.tsx` is the only route. It runs on
the server with ISR (`revalidate = 60`) solely to fetch data — projects and
competitions from Neon Postgres (`lib/projectsDb.ts`, `lib/competitionsDb.ts`)
and Codeforces/AtCoder stats (`lib/cp/fetchStats.ts`) — then hands everything to
the fully client-side `components/Portfolio.tsx`. Everything below that line is
`'use client'`.

**Server fetchers never throw.** CI builds offline (no `DATABASE_URL`, no
network) and an upstream outage must not take the page down — every server
fetcher degrades: `getProjects`/`getCompetitions` warn and return `[]` (one
retry absorbs Neon's scale-to-zero cold start), `getCpStats` returns `null` per
platform so the affected tab shows a fallback. `lib/projects.ts#mapRow` and
`lib/competitions.ts` sanitize each row (URL scheme allowlist, type checks) and
drop unusable rows instead of crashing, because rows are hand-edited free-text
in the Neon dashboard. Keep these invariants when touching any data path.

**CP stats caching is deliberate.** kenkoooo's ~4MB difficulty file exceeds
Vercel's 2MB per-item data-cache limit, so per-fetch TTLs can't stop it
refetching on every ISR pass — the reduced `CpStats` (a few KB) is wrapped in
hourly `unstable_cache` in `app/page.tsx`. Upstream fetches also carry their own
`next.revalidate` TTLs and a user-agent identifying the site (kenkoooo asks API
users to identify themselves and pace requests — keep the 1s page delay).

**Content lives in the DB, not the code.** Adding a project or an IRL
competition result = inserting a row in the Neon dashboard; it appears on the
live site within ~60s, no deploy. Columns and conventions are documented in
`db/README.md`.

**Client state machine.** `Portfolio.tsx` owns the view state
(`'menu' | SectionId`), global keyboard navigation (arrows/WASD/digits/Enter/Esc),
and sound effects (`lib/useSfx.ts`, synthesized — no audio assets). `MenuView`
renders the menu; `SectionPanel` renders the active section. Sections live in
`components/sections/` and are registered in the `SECTIONS` array in
`lib/data.ts` — that array drives menu order, digit shortcuts, and panel titles.

**Logic goes in `lib/`, colocated tests beside it.** Pure logic (nav math,
row styling, project filter/sort, Codeforces response mapping, fit-to-viewport
scaling) is extracted into `lib/*.ts` with a `*.test.ts` sibling; components
stay thin and have `*.test.tsx` siblings (Vitest + jsdom + Testing Library).
Follow this split for new work: testable logic in `lib/`, presentation in
`components/`.

**Design tokens, not magic values.** Colors, pop-art shadows, fonts, and skew
angles come from `lib/tokens.ts` (`COLOR`, `POP`, `FONT`, `SKEW`). Styling is
inline styles built from these tokens. Visuals (radar chart, progress bars) are
hand-built SVG — prefer that over adding a charting dependency; it matches the
angular aesthetic and keeps the bundle lean.

**Live stats with offline fallbacks.** The COMP. PROG dashboard gets its
stats server-side at ISR time (`lib/cp/`, rendered by `components/cp/`). A
client-side Codeforces fetcher with hardcoded fallbacks also exists
(`lib/codeforces.ts`, `CF_DEFAULTS` in `lib/data.ts`) — kept for reuse, though
the menu HUD no longer surfaces CF stats (they'd duplicate COMP. PROG). Any new
external data source should follow the same pattern: fallback first, live data
as enhancement.

## Content guardrails

When writing or editing section copy: audience is (1) recruiters, (2) general
showcase, (3) fellow students. Clear professional prose with only a light wink
of the Persona theme. Stay honest about Kenaz's experience — he is a 3rd-year
CS student and this is his first passion project; do not inflate (e.g. he has
attended one onsite hackathon, he does not "ship products"). CP stats belong
only in the COMP. PROG section.

## Repo conventions

- `docs/` and `.claude/` are gitignored — design specs and implementation plans
  under `docs/superpowers/` are local working documents, not published.
- `.env.local` holds `DATABASE_URL` (see `db/README.md` for the Vercel
  "Sensitive env var" gotcha). Missing var degrades gracefully to zero projects.
- Vitest excludes `.claude/**` so session worktrees don't get swept into runs.
