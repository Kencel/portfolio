# Persona 5 Royal Portfolio — Design Spec

**Date:** 2026-07-03
**Source:** Claude Design handoff bundle (`_handoff/persona-5-royal-portfolio/`), primary file `Persona5 Portfolio.dc.html`.
**Owner:** Kenaz Celestino (codename RAMENNAGI / GitHub @Kencel).

## 1. Goal

Recreate the Persona 5 Royal–styled personal portfolio prototype pixel-faithfully as a real,
deployable site. The prototype is a `.dc.html` React design-tool artifact; we reproduce its
**visual output and interactions**, not its internal runtime (`support.js` / `image-slot.js` are
the design tool's plumbing and are not reused).

## 2. Stack & deployment

- **Next.js (App Router) + React + TypeScript + Tailwind CSS.**
- Single route (`/`). No backend, no data fetching. Static-export friendly so it deploys to
  GitHub Pages / Netlify / Vercel with no server.
- Fonts via `next/font/google`: **Anton** (display), **Bebas Neue** (labels/tags), **Oswald**
  weights 300–700 (body).

## 3. Experience overview

One full-viewport interactive screen with two top-level modes driven by local state:

- **Menu view** — skewed name/title block, a 6-item navigable menu, hexagon-masked avatar
  cluster, CF/problems status bars, live clock, controls hint, and a diagonal scrolling marquee.
- **Section panel** — when a menu item is opened, a panel slides in (`p5panelIn` animation) with a
  Back control and the selected section's content. Six sections: About, Comp. Programming,
  Projects, Skills, Education, Contact.

## 4. State (root client component)

- `view`: `'menu' | 'about' | 'cp' | 'projects' | 'skills' | 'education' | 'contact'`
- `hovered`: `number | null` — highlighted menu index
- `muted`: `boolean` — SFX toggle (default: unmuted, but no audio until first user gesture)

## 5. Component structure

```
app/
  layout.tsx      — fonts, <html>/<body>, global background
  page.tsx        — renders <Portfolio/>
  globals.css     — keyframes, custom scrollbar, --accent var, resets
components/
  Portfolio.tsx   — root client component: state, keydown + mousemove handlers, clock interval, sfx wiring
  Backdrop.tsx    — 4 background layers (halftone dots, diagonal hatch, red clip-path shard + its dots, outlined shard) + scrolling marquee band
  MenuView.tsx    — title block, menu list, avatar cluster, status bars, clock, controls hint, mute button
  MenuRow.tsx     — a single skewed menu item with idle/selected/dimmed states
  SectionPanel.tsx— back header (curSub + curLabel) + panel background + renders the active section
  sections/
    About.tsx, Cp.tsx, Projects.tsx, Skills.tsx, Education.tsx, Contact.tsx
  ImageSlot.tsx   — styled P5 placeholder; auto-uses a /public image when present
lib/
  data.ts         — sections[] and skills[] arrays (ported from the prototype)
  useSfx.ts        — Web Audio hook (select/confirm/back tones + mute)
```

## 6. Visual fidelity (exact values from the prototype)

- **Palette:** bg `#0b0a0a`; ink `#F4F1EA`; panels `#141212` / rows `#151313`; borders `#2a2727`,
  `#333`, `#2a2727`; accent `--accent: #E4002B` (hardcoded P5 red — **no** accent switcher);
  Codeforces teal `#17A2A2`; Discord `#5865F2`.
- **P5 skew idiom:** outer elements `skewX(-8/-9deg)` with counter-skewed inner content;
  `text-shadow` offsets (e.g. `5px 5px 0 var(--accent)`) as faux-3D; halftone radial-dot
  backgrounds; `clip-path` polygon shards.
- **Type scales:** preserve the prototype's `clamp()` expressions verbatim (e.g. title
  `clamp(34px,5.4vw,82px)`).
- **Animations (in globals.css):** port those actually used — `p5marquee` (marquee band),
  `p5panelIn` (section entrance). `p5rowIn`/`p5pulse` kept only if wired to a row/element; the
  prototype's unused `p5spin`/`p5starpop` are dropped. Custom red webkit scrollbar retained.
- **Menu row states** (ported from prototype `_rowStyle`):
  - idle: `#151313`, transparent borders, `skewX(-9deg)`.
  - selected: accent fill, `#0b0a0a` text, white border + black left border,
    `skewX(-9deg) translateX(30px) scale(1.03)`, `box-shadow: 5px 5px 0 rgba(0,0,0,.55)`.
  - non-selected while another is hovered: `opacity .5`, `translateX(-6px)`.

## 7. Content (ported verbatim from the prototype)

- **Sections:** 01 ABOUT ME / PROFILE · 02 COMP. PROGRAMMING / BATTLE RECORD ·
  03 PROJECTS / TREASURES · 04 SKILLS / ARCANA · 05 EDUCATION / STATUS ·
  06 CONTACT / CONFIDANTS.
- **Skills bars:** C++/Algorithms 92% MAIN, Next.js/React 85% WEB, TailwindCSS 84% WEB,
  shadcn/ui 78% WEB, Nitro 70% API, Prisma 74% DATA, PostgreSQL 72% DATA, pnpm/Git 80% TOOL.
- **CP stats:** Codeforces rating 1445 (peak 1452, Specialist, @RamenNagi); 472 solved; AtCoder
  @RamenNagi; climb-to-CM progress bar at 48%.
- **Projects:** PROJECT SINAG (Team McCoders — Next.js/Tailwind/shadcn/Nitro/Prisma/PostgreSQL,
  link https://project-sinag.cjuy.dev/); BLUE HACKS (hackathon).
- **Education:** Ateneo de Manila University — BS Computer Science (CompSAt member, Learn-2-Dev
  2026 Trainer); Philippine Science HS — Main Campus (CS5 elective).
- **Contact:** Codeforces @RamenNagi, AtCoder @RamenNagi, GitHub @Kencel, Discord ramen.nagi.
- **Status bars (menu):** CF RATING 1445 / MAX 1452 (48% bar); PROBLEMS SOLVED 472 (72% bar).
- **Marquee text:** `RAMENNAGI ✦ PHANTOM THIEF OF ALGORITHMS ✦ TAKE YOUR HEART ✦ SPECIALIST ✦ 472 SOLVED ✦` (repeated).

## 8. Interactions

- **Keyboard:**
  - `↑` / `↓` — move highlight (wraps).
  - `1`–`6` — jump to and open that section.
  - `Enter` **or `Z`** — open the highlighted section.
  - `Esc` **or `C`** — back to menu from a section.
- **Mouse:** hover a row highlights it (+ select tone); click opens (+ confirm tone). A real
  mousemove that isn't over a row clears the highlight, so keyboard selection persists
  (keyboard emits no mousemove).
- **SFX (`useSfx`):** synthesized square-wave tones — select `1180Hz`, confirm `720→1090Hz`
  glide, back `520→360Hz` glide. AudioContext created lazily on first gesture (autoplay policy);
  visible **mute toggle**; muted state suppresses all tones. Original tones only (no copyrighted
  game audio).
- **Clock:** live `HH:MM` + weekday (`SUN`…`SAT`), refreshed on an interval.

## 9. Responsive plan

- **≥ 1024px (`lg`):** pixel-faithful desktop — absolute-positioned clusters, `100vh`, menu does
  not scroll.
- **< 1024px:** root switches from absolute to a scrollable single column, order
  title → menu → avatar → status bars; `100vh`/`overflow:hidden` dropped so the page scrolls.
  Clock and controls-hint hidden or folded in. P5 skew/aesthetic preserved. Section panels already
  use `auto-fit minmax()` grids, so they reflow with no extra work.

## 10. Images (deferred, placeholders now)

- `ImageSlot` renders the P5 placeholder styling (`DROP YOUR PHOTO`, `PROJECT SINAG SCREENSHOT`)
  matching the design.
- Each slot auto-displays a real image when the corresponding file exists in `/public`
  (`avatar.*` for the hexagon avatar, `sinag.*` for the SINAG card) via `next/image`.
- Avatar uses the hexagon `clip-path: polygon(14% 0, 100% 6%, 92% 100%, 0 90%)` mask with the
  accent shard behind it. SINAG uses a plain rectangle, height 190px.

## 11. Out of scope (YAGNI)

- Accent color switcher (hardcode red).
- Image drag-drop / reframe persistence from `image-slot.js` (placeholders + `/public` swap
  instead).
- Multi-page routing, CMS, analytics, unit-test harness.

## 12. Verification

Run the dev server and confirm: all six sections open and close; keyboard nav (`↑↓`, `1–6`,
`Enter`/`Z`, `Esc`/`C`); hover highlight + dimming; mute toggle silences SFX; live clock ticks;
marquee scrolls; the `< lg` breakpoint restacks to a scrollable column without overflow.
