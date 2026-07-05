# Design System Tokens & Shared Primitives — Design Spec

**Date:** 2026-07-05
**Owner:** Kenaz Celestino
**Driver:** Consistency/maintainability — hardcoded colors, skew angles, shadow offsets,
clip-path shapes, and font-role strings are scattered across `components/`, making future
tweaks error-prone. This is an internal refactor for this app only, not a portable/exported
design system.

## 1. Goal

Consolidate the portfolio's existing P5-Royal visual language (established in
`docs/superpowers/specs/2026-07-03-persona5-portfolio-design.md`) into:

1. A single token module (`lib/tokens.ts`) that replaces scattered literal values.
2. A small set of shared primitive components (`components/ui/`) that replace patterns
   currently copy-pasted across multiple files.

This is a **pure refactor**: no visual output should change. Scope is internal to this app —
not a package intended for reuse elsewhere or sync to Claude Design.

## 2. Current state (why this is needed)

- `tailwind.config.ts` defines `ink`/`base`/`panel`/`row` colors that **nothing references** —
  all styling is inline styles with raw hex, not Tailwind classes.
- `--accent` (in `globals.css`) is the only real token in use today, referenced as
  `var(--accent,#E4002B)` at ~15 call sites.
- `lib/angular.ts` already centralizes two shadow constants (`BLACK_POP`, `ACCENT_POP`) —
  the one existing precedent for a "tokens module" in this codebase.
- `lib/rowStyle.ts` independently redefines its own shadow strings (`BASE_POP`/`SELECTED_POP`)
  instead of reusing `lib/angular.ts` — accidental duplication of the same idiom.
- Four visual patterns are copy-pasted verbatim (differing only in parameters) across
  `Backdrop.tsx`, `SectionPanel.tsx`, `MenuRow.tsx`, `Cp.tsx`, `Skills.tsx`:
  - **Halftone dot texture** (`radial-gradient(...) backgroundSize`) — 4 instances.
  - **Shard** (clip-path polygon + companion dot-overlay of the same shape) — 3 instances.
  - **Skew box** (outer `skewX(-N)` + inner counter-`skewX(+N)` to keep text upright) —
    repeated in `MenuRow`, `SectionPanel`'s back button/title block, `Cp`'s cards.
  - **Progress bar** (track `height`/`background:#1c1a1a`/`border:1px solid #333` + fill
    `width`/`background`) — duplicated in `Skills.tsx` and `Cp.tsx`.
- Three font roles (Anton=display, Bebas=label, Oswald=body) with matching `clamp()` size
  strings are repeated as raw literals throughout.

## 3. `lib/tokens.ts`

Single module, following the existing `lib/angular.ts` convention (which it absorbs and
replaces):

- **`COLOR`** — `accent` (`#E4002B`, absorbing `--accent`), `base` (`#0b0a0a`), `ink`
  (`#F4F1EA`), `panel` (`#141212`), `row` (`#151313`), plus small utility grays currently
  inlined (`trackBg: '#1c1a1a'`, `trackBorder: '#333'`), `cfteal` (`#17A2A2`),
  `discord` (`#5865F2`).
- **`POP`** — hard-shadow strings. Consolidates `lib/angular.ts`'s `BLACK_POP`/`ACCENT_POP`
  and `lib/rowStyle.ts`'s duplicate `BASE_POP`/`SELECTED_POP` into one set of named shadows
  (e.g. `POP.black`, `POP.accent`, `POP.rowBase`, `POP.rowSelected`) — one shadow authority
  instead of two.
- **`FONT`** — the three role strings (`anton`, `bebas`, `oswald`), each the full
  `var(--font-*), sans-serif` fallback chain, so components stop repeating it.
- **`SKEW`** — only angles that are a genuinely reused fixed vocabulary: `row` (`-9`),
  `panel` (`-8`). One-off decorative skews (Cp's card `-3`/`-1.5`, Skills' `-6`) stay as
  literals in place — they vary per-element for visual texture, not because they share
  meaning, so forcing them into named constants would misrepresent them as a shared token.

`lib/angular.ts` is deleted once its two exports move into `lib/tokens.ts` and all imports
are updated.

## 4. Shared primitives (`components/ui/`)

- **`HalftoneLayer`** — props `color`, `dotSize`, `gap`, `opacity`, optional `clipPath`.
  Replaces the 4 near-identical dot-texture blocks in `Backdrop.tsx`/`SectionPanel.tsx`.
- **`Shard`** — a clip-path polygon shape plus its companion dot-overlay (same shape,
  different fill) as one unit, since every shard in the app appears as that pair. Props:
  `clipPath`, `fill`, `opacity`, optional dot-overlay override (defaults to the standard
  dark-dot texture). Replaces 3 shard+dots pairs in `Backdrop.tsx`/`SectionPanel.tsx`.
- **`SkewBox`** — outer `skewX(-N)` wrapper that auto counter-skews its children
  `skewX(+N)`, so callers stop hand-writing both halves. Used by `MenuRow`,
  `SectionPanel`'s back button/title block, and `Cp`/`Skills` card content.
- **`ProgressBar`** — the track + fill pair. Props: `pct`, `fill` (color or gradient),
  `height`. Replaces duplicated markup in `Skills.tsx` and `Cp.tsx`.

`AngularCard.tsx` stays as-is structurally (it's already a working shared primitive), but
its `pop` prop default sources from `POP` in `lib/tokens.ts` instead of a local import.

## 5. Migration approach

1. Build `lib/tokens.ts` and the four `components/ui/*` primitives first, in isolation —
   no existing component touched yet.
2. Migrate consumers one file at a time (`Backdrop`, `SectionPanel`, `MenuRow`/`rowStyle`,
   `Cp`, `Skills`, `AngularCard`), swapping hardcoded literals/markup for the token/primitive
   equivalent. Each migration should produce **zero visual diff** — this is a refactor, not
   a redesign.
3. Delete `lib/angular.ts` once all imports point at `lib/tokens.ts`.
4. Remove the dead `ink`/`base`/`panel`/`row` entries from `tailwind.config.ts` and the
   now-unused `--accent` custom property from `globals.css`, once all
   `var(--accent,...)` call sites are switched to `COLOR.accent`.

## 6. Verification

- Existing test files (`AttributesRadar.test.tsx`, `CenterFrame.test.tsx`, `rowStyle.test.ts`,
  etc.) must keep passing unchanged — a pure refactor shouldn't require test edits; if one
  does need edits, that's a signal a value drifted during migration.
- Manual pass: run the dev server and visually compare each migrated section against current
  `master` (menu, all 6 section panels, hover/selected row states, progress bars) to confirm
  no visual regression.
- No new tests needed for the primitives themselves — they're pure presentational wrappers
  around markup already implicitly covered by whatever renders them.

## 7. Out of scope (YAGNI)

- Any Tailwind-utility-class migration — inline styles stay the pattern; tokens are consumed
  as TS values, not Tailwind theme entries.
- Componentizing anything beyond the 4 primitives identified above (e.g. no generic `Card`,
  no theming/variant system).
- Packaging this as a reusable/exportable design system, or syncing it via `/design-sync` —
  this portfolio remains a single-app codebase, not a component library.
