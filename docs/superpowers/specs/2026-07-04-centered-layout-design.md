# Centered Layout Redesign

**Date:** 2026-07-04
**Branch:** `feat/centered-layout`
**Status:** Approved (design), pending implementation

## Goal

Move the portfolio from an edge-anchored composition (content pinned to the left,
right, and corners of the screen) to a **balanced two-column block centered on
screen**. Preserve the phantom-ui aesthetic entirely — crimson / ink / bone
palette, skew, ransom-note title, hard offset shadows, red shard, dot texture,
SFX. Only the *composition* changes, not the visual language.

Approved via visual companion mockup: **Option B — centered balanced frame.**

## Scope

Whole site, holistically:
- Menu landing (`MenuView`)
- Section panels (`SectionPanel` header + the six section bodies)
- A shared centered-frame convention so both read as one system

Section body *internals* (card grids, radar, copy) are not being redesigned —
only the frame/alignment that wraps them.

## Design

### Shared convention: centered frame

Introduce a single max-width, horizontally-centered container used by both the
menu and the section panels:

- `max-width: ~1180px`, `margin: 0 auto`, horizontal padding that collapses on
  narrow screens (reuse the existing `clamp()` scale).
- On the menu (desktop), the frame is also **vertically centered** in the
  viewport so the block floats in balanced whitespace rather than filling from a
  corner.
- The red shard and radial-dot texture stay **ambient** behind the frame
  (screen-anchored), so the kinetic background is preserved while the functional
  content is centered.

This can be a small presentational component (e.g. `CenterFrame`) or a shared
style object in `lib/`. Implementation plan will pick; the contract is: "centered
max-width wrapper that both views opt into."

### Menu landing (`MenuView`)

Replace the current absolute edge-positioning with the centered frame containing:

- **Slim HUD top strip** (inside the frame): controls hint (`↑↓ / 1-6 SELECT ·
  ENTER OPEN`) on the left, mute toggle on the right. These move *out* of the
  screen corners and *into* the frame.
- **Two balanced columns**, vertically centered:
  - **Left:** ransom title `RAMENNAGI`, the two tag chips, the menu list
    (`MenuRow` ×6).
  - **Right:** avatar (masked, red shard behind it) + `CODENAME` card.
- **Footer strip** (inside the frame): status bars (CF rating, problems solved)
  on the left, the clock + "TAKE YOUR TIME" on the right — balanced, replacing
  the bottom-right corner clock.

Decision (my call, per brainstorm): clock, controls, and mute **move into the
frame**; shard + dot texture **stay ambient**. Screen corners read clean.

### Section panels (`SectionPanel`)

- Wrap the animated content wrapper in the same centered frame (max-width,
  `margin: 0 auto`).
- **Back button + section header** (sub-label, ransom title) centered within the
  frame; the skewed divider centered under the header rather than left-anchored.
- Section bodies already use `maxWidth: 1200` — align them to `margin: 0 auto`
  inside the frame so they sit centered and consistent with the header.
- Keep the red shard and dot bg ambient, matching the menu.

### Responsive / narrow

- The existing `narrow` branch already stacks into a single centered-ish column.
  Keep that behavior; ensure the new frame degrades to full-width with the
  existing `clamp()` padding on narrow screens (no fixed max-width squeeze on
  mobile).
- Desktop single-screen (no-scroll) menu should be preserved where the centered
  frame fits within `100vh`; if content exceeds it, allow scroll rather than
  clipping.

## Non-goals

- No palette, typography, or component-style changes.
- No new sections or content.
- No redesign of section body internals (cards, radar, copy).
- No change to keyboard nav, SFX, or data.

## Success criteria

- Menu and section panels present content in a centered, balanced frame with
  symmetric margins — nothing pinned to a screen corner except ambient
  shard/texture.
- Phantom-ui aesthetic visually unchanged (skew, ransom, shard, palette intact).
- Keyboard nav, SFX, mute, clock, and CF status all still work.
- Narrow/mobile layout still stacks cleanly and is not squeezed by a desktop
  max-width.
- Existing tests (radar label guards, ImageSlot) still pass.
