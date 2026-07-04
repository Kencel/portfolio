# About Me Revamp — Design

**Date:** 2026-07-04
**Scope:** Rewrite the content of the About Me section and add a hand-built SVG "attributes" radar. Single-component change plus one small data addition. No new site section.

## Goals & audience

Priority order for who this speaks to:
1. Recruiters / internships
2. General showcase / personal brand
3. Fellow students / compprog community

Guiding constraint: **stay honest.** No "ships software," no "builds products at hackathons." One onsite hackathon so far; this portfolio is the first passion project. Competitive-programming stats stay in the CP section — the About block does not repeat them.

Tone: clear, professional prose with a light wink of the game-menu theme (not heavy flavor).

## Content changes

### Bio prose (left card)

Replace the two paragraphs with the user-approved copy verbatim:

> A third-year Computer Science student at the Ateneo de Manila University, in it for the problem-solving. Competitive programming enthusiast. Chasing cleaner logic and tighter solutions for the thrill of the solve with C++ and Python.
>
> Lately I've been pointing that same drive toward AI/ML and data science, and toward actually building things, starting with this site, my first passion project. On the web, I work in Next.js and React.

Keep the existing accent-bold treatment on key terms (e.g. **Ateneo de Manila University**, **C++ and Python**, **AI/ML and data science**, **Next.js and React**).

### Right column — big highlighted block

- Small label: `CLASS` (was `RANK`)
- Big value: `COMPETITIVE PROGRAMMER` (was `SPECIALIST`)

### Right column — quick-facts card

Replace the Focus / Weapon / Based in rows with:

| Label | Value |
|---|---|
| Year | 3rd Year · Ateneo de Manila |
| Focus | Problem Solving · AI/ML |
| Languages | C++ · Python |
| Web | Next.js · React |
| Based in | Philippines |

Five rows instead of three; same skewed-row styling as the current card.

## New part — Attributes radar (SVG)

A hexagonal stat web added **below** the existing bio + right-column row, within the same About Me section. Reads as the section's "stat sheet."

**Axes and placeholder values** (Persona-style social stats mapped to real developer traits; values are placeholders the user will fine-tune after seeing it rendered):

| Axis | Meaning | Value (0–100) |
|---|---|---|
| Knowledge | theory / algorithms | 88 |
| Proficiency | implementation / clean code | 84 |
| Guts | hard problems, contest pressure | 82 |
| Diligence | consistency, the grind | 80 |
| Ingenuity | creative problem approaches | 78 |
| Adaptability | picking up new stacks | 72 |

**Implementation:**
- Pure inline SVG, no charting dependency. Consistent with static export and the existing hand-rolled SVG/CSS approach.
- 6 axes evenly spaced (60° apart), starting at the top (−90°).
- Concentric hexagonal grid rings (e.g. 4 rings) in a bone/ink tone for the backdrop; radial spokes to each axis.
- Filled crimson stat polygon (accent `#E4002B`) with reduced opacity fill + solid stroke and small vertex dots.
- Axis labels in the condensed display font (Bebas/Oswald) positioned outside each vertex; numeric value optionally shown with each label.
- Value → radius mapping: `r = (value / 100) * maxRadius`.
- Wrap the radar in an `AngularCard` so it matches the framed, skewed treatment of the other cards. Counter-skew the SVG contents if the card is skewed, matching the existing bio card pattern.
- Deterministic geometry (no randomness) → SSR-safe, no hydration concerns.

**Data location:** add an `ATTRIBUTES` export (array of `{ axis, value }`) to `lib/data.ts` alongside `SKILLS`, so values are easy to tweak and testable. Add/extend a data test if the existing `lib/data.test.ts` covers similar exports.

## Files touched

- `components/sections/About.tsx` — new copy, updated cards, new radar sub-component (or a sibling component imported here).
- `lib/data.ts` — add `ATTRIBUTES` export; the big-block/quick-facts strings may stay inline in About.tsx (they're presentational).
- `lib/data.test.ts` — extend if it asserts on data shape.
- Possibly a new `components/AttributesRadar.tsx` if the SVG warrants its own file (preferred for focus).

## Non-goals

- No changes to other sections (CP, Projects, Skills, Education, Contact).
- No new nav entry / section id.
- No charting library or other new dependency.
- Not touching the Skills section despite conceptual overlap — the radar is traits, Skills is tools.

## Success criteria

- About Me shows the new honest copy, `CLASS / COMPETITIVE PROGRAMMER` block, and the 5-row quick facts.
- A crimson hexagonal radar renders below, on-theme (angular, framed), SSR-safe, with the six placeholder values.
- No new runtime dependency; existing tests still pass.
