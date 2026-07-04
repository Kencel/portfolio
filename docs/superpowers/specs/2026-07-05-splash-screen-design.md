# Splash Screen — P5R-Style Boot Sequence

**Date:** 2026-07-05
**Status:** Approved design

## Goal

A Persona 5 Royal-style splash screen on site entry: a ramen bowl SVG (in place of Joker) spins a few times over a black screen with "TAKE YOUR TIME" in the ransom-note lettering, then the splash gives way to a ramen-bowl-shaped window onto the site that zooms out until the whole site is visible.

## Decisions

- **Frequency:** once per session, keyed on `sessionStorage['p5r-splash-seen']`. Refreshes and back-navigation in the same tab skip it.
- **Skippable:** yes — any keydown or pointerdown during the spin jumps straight to the reveal.
- **Total duration:** ~3s (spin ~1.9s, reveal ~1.1s).
- **Motion:** the bowl does the full rotations; "TAKE YOUR TIME" holds steady with a subtle opacity pulse.
- **Approach:** pure CSS/SVG overlay component (no new dependencies). Rejected alternatives: Framer Motion (adds a dependency for what CSS keyframes handle), and clipping the site container itself via `clip-path`/`mask` (fragile with `position: fixed` descendants, non-responsive `path()` units).

## Architecture

New client component `components/SplashScreen.tsx`, rendered by `Portfolio` as a fixed full-viewport overlay above the site. The site renders underneath from frame one.

### State & mounting

- `Portfolio` holds `splash: boolean`, initialized `true` on both server and client (no hydration mismatch).
- A `useEffect` checks `sessionStorage['p5r-splash-seen']`; if set, flips `splash` to `false` immediately. The single black frame this can show is invisible against the site's `#0b0a0a` background.
- While `splash` is true, Portfolio's global keyboard handler returns early so a skip keypress doesn't also drive the menu.
- When the splash finishes it calls `onDone`; Portfolio sets `splash` to `false` (unmounting the overlay) and writes the sessionStorage key.

### Phase 1 — spin (~1.9s)

- Full-viewport black (`#0b0a0a`) overlay.
- Centered inline ramen bowl SVG (~180px), drawn in the phantom palette: bone (`#F4F1EA`) bowl with a crimson (`#E4002B`) swirl stripe, ink keylines, chopsticks, noodle waves, hard-edged steam strokes.
- Bowl animates 3 full turns with an ease-out (visibly decelerating, like the P5 loading icon) plus a subtle scale pop as it settles.
- Below the bowl: `TAKE YOUR TIME` via the existing `RansomText`, with a gentle opacity pulse (reuse/adapt `p5pulse`).

### Phase 2 — reveal (~1.1s)

- Splash content (bowl + text) snaps away.
- The overlay becomes a single full-viewport SVG: an ink sheet with a bowl-silhouette hole punched via an SVG `<mask>` (white sheet, black bowl shape). The hole starts small at screen center, site visible through it.
- The sheet animates `transform: scale()` from 1 to ~30 with ease-in, transform-origin center, until the hole swallows the viewport.
- On animation end: `onDone` fires; Portfolio unmounts the overlay and writes the sessionStorage key (Portfolio is the single owner of that write).

### Skip & accessibility

- Keydown/pointerdown during phase 1 → jump to phase 2 (reveal still plays).
- `prefers-reduced-motion: reduce` → no spin, no zoom; plain 300ms opacity fade instead.
- Overlay is `aria-hidden="true"` / `role="presentation"`. No focus management needed; it unmounts entirely.

### Keyframes

New keyframes added to `app/globals.css` following the existing `p5*` naming: `p5splashSpin`, `p5splashReveal` (and reuse `p5pulse` for the text).

## Testing

`components/SplashScreen.test.tsx`, following the existing component-test pattern:

- Renders spin phase (bowl + TAKE YOUR TIME) when not yet seen.
- Keydown/pointerdown advances to reveal phase.
- Completion invokes `onDone`.

The sessionStorage gating lives in a small `lib/splashSession.ts` helper (`hasSeenSplash` / `markSplashSeen`) with its own unit tests; Portfolio wires it and remains the single call site of the write. Portfolio itself has no jsdom unit test (AudioContext makes it a poor candidate) — the integration is verified in the browser.
