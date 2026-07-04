# Centered Layout Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the portfolio menu and section panels from an edge-anchored composition to a horizontally-centered, balanced two-column frame, preserving the phantom-ui aesthetic and keeping vertical layout dynamic.

**Architecture:** Introduce one shared presentational wrapper, `CenterFrame` (max-width + auto horizontal margins, x-axis centering only). Refactor `MenuView` to compose its existing pieces inside `CenterFrame` as a HUD-strip + two-column + footer-strip layout instead of absolute edge positioning. Wrap `SectionPanel`'s header, divider, and body in the same `CenterFrame` and center them. No visual language, palette, typography, data, or section-body internals change.

**Tech Stack:** Next.js 15, React 19, TypeScript, inline-style components, Vitest + @testing-library/react for unit tests.

## Global Constraints

- **X-axis centering only.** Use `maxWidth` + `marginLeft/Right: 'auto'`. Never vertically center (no `alignItems: center` on the page container, no auto top/bottom margins for centering). Vertical layout flows from the top and scrolls when it exceeds `100vh`.
- **Preserve the phantom-ui aesthetic exactly:** crimson `#E4002B` (via `var(--accent,#E4002B)`), ink `#0b0a0a`, bone `#F4F1EA`; skew transforms; `RansomText` title; red shard; radial-dot texture; hard offset shadows; SFX. Only composition/alignment changes.
- **Red shard + dot texture stay ambient** (screen-anchored, behind the frame). Clock, controls hint, and mute move *into* the frame.
- **Preserve all behavior:** keyboard nav, SFX, mute toggle, live clock, Codeforces status, `narrow` responsive stacking.
- **Do not modify** the six section body files (`components/sections/*.tsx`), `lib/data.ts`, SFX, or nav logic. Centering of section bodies is achieved by the `CenterFrame` wrapper, not by editing the bodies.
- Font families are referenced as `var(--font-oswald)`, `var(--font-bebas)`, `var(--font-anton)` — copy them verbatim; do not rename.

---

### Task 1: `CenterFrame` shared wrapper

**Files:**
- Create: `components/CenterFrame.tsx`
- Test: `components/CenterFrame.test.tsx`

**Interfaces:**
- Consumes: nothing (leaf component).
- Produces: `CenterFrame({ children, maxWidth = 1180, style }): JSX.Element` — renders a single `<div>` with `width: '100%'`, `maxWidth: <n>px`, `marginLeft: 'auto'`, `marginRight: 'auto'`, spreading any `style` last. Used by `MenuView` (Task 3) and `SectionPanel` (Task 2).

- [ ] **Step 1: Write the failing test**

Create `components/CenterFrame.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CenterFrame } from './CenterFrame';

describe('CenterFrame', () => {
  it('centers on the x-axis: auto horizontal margins + default max width', () => {
    render(<CenterFrame><span>hi</span></CenterFrame>);
    const frame = screen.getByText('hi').parentElement!;
    expect(frame.style.marginLeft).toBe('auto');
    expect(frame.style.marginRight).toBe('auto');
    expect(frame.style.maxWidth).toBe('1180px');
    expect(frame.style.width).toBe('100%');
  });

  it('does NOT center vertically (no auto vertical margins, no flex centering)', () => {
    render(<CenterFrame><span>hi</span></CenterFrame>);
    const frame = screen.getByText('hi').parentElement!;
    expect(frame.style.marginTop).toBe('');
    expect(frame.style.marginBottom).toBe('');
    expect(frame.style.alignItems).toBe('');
  });

  it('respects a custom maxWidth and merges extra style', () => {
    render(<CenterFrame maxWidth={900} style={{ padding: '10px' }}><span>hi</span></CenterFrame>);
    const frame = screen.getByText('hi').parentElement!;
    expect(frame.style.maxWidth).toBe('900px');
    expect(frame.style.padding).toBe('10px');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- CenterFrame`
Expected: FAIL — cannot resolve `./CenterFrame` / `CenterFrame is not defined`.

- [ ] **Step 3: Write minimal implementation**

Create `components/CenterFrame.tsx`:

```tsx
import type { CSSProperties, ReactNode } from 'react';

/**
 * Horizontally-centered max-width wrapper. X-axis centering ONLY — auto left/right
 * margins with a capped width. Never centers vertically; height stays dynamic and
 * flows from the top. Shared by the menu landing and section panels.
 */
export function CenterFrame({
  children,
  maxWidth = 1180,
  style,
}: {
  children: ReactNode;
  maxWidth?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={{ width: '100%', maxWidth, marginLeft: 'auto', marginRight: 'auto', ...style }}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- CenterFrame`
Expected: PASS (3 passing).

- [ ] **Step 5: Commit**

```bash
git add components/CenterFrame.tsx components/CenterFrame.test.tsx
git commit -m "feat: add CenterFrame x-axis centering wrapper"
```

---

### Task 2: Center `SectionPanel` header, divider, and body

**Files:**
- Modify: `components/SectionPanel.tsx:27-49` (the animated content wrapper: header block, divider, body)

**Interfaces:**
- Consumes: `CenterFrame` from Task 1 (`components/CenterFrame.tsx`).
- Produces: no new exports; visual change only. `SectionPanel({ view, onBack })` signature unchanged.

Ambient layers (dot bg line 23, red shard line 25) stay exactly as-is. Only the content wrapper starting at line 28 changes.

- [ ] **Step 1: Add the import**

At the top of `components/SectionPanel.tsx`, add alongside the existing imports:

```tsx
import { CenterFrame } from './CenterFrame';
```

- [ ] **Step 2: Wrap content in CenterFrame and center header + divider**

Replace the entire animated content wrapper block (currently lines 28-49, from `{/* animated content wrapper — PROTOTYPE 120 */}` through its closing `</div>`) with:

```tsx
      {/* animated content wrapper — PROTOTYPE 120 */}
      <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(20px,3.5vw,52px)', animation: 'p5panelIn .32s cubic-bezier(.2,.9,.3,1) both' }}>
        <CenterFrame maxWidth={1180}>
          {/* header — centered — PROTOTYPE 122-130 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div
              onClick={onBack}
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F4F1EA', color: '#0b0a0a', fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.14em', fontSize: 18, padding: '7px 16px', transform: 'skewX(-8deg)' }}
            >
              <span style={{ transform: 'skewX(8deg)' }}>◄ BACK</span>
            </div>
            <div style={{ transform: 'skewX(-8deg)' }}>
              <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.3em', fontSize: 'clamp(14px,1.4vw,20px)', color: 'var(--accent,#E4002B)' }}>{cur.sub}</div>
              <div style={{ transform: 'skewX(8deg)', fontSize: 'clamp(38px,6vw,84px)', lineHeight: .9, marginTop: 6 }}>
                <RansomText text={cur.label} />
              </div>
            </div>
          </div>

          {/* divider — centered — PROTOTYPE 132 */}
          <div style={{ height: 4, background: 'var(--accent,#E4002B)', margin: '22px auto 30px', transform: 'skewX(-40deg)', width: 'min(560px,70%)' }} />

          <Body />
        </CenterFrame>
      </div>
```

Notes: only three things changed vs. the original — `justifyContent: 'center'` added to the header flex, the divider margin changed from `'22px 0 30px'` to `'22px auto 30px'`, and the whole group is wrapped in `<CenterFrame maxWidth={1180}>`. The section bodies fill the frame and are thereby centered without editing them.

- [ ] **Step 3: Verify it compiles and existing tests pass**

Run: `npm run test`
Expected: PASS — all existing suites (AttributesRadar, ImageSlot, CenterFrame) still green; no test references SectionPanel internals.

Run: `npm run build`
Expected: Compiles successfully, no TypeScript errors.

- [ ] **Step 4: Visual check (if preview tooling available)**

Start the dev server and open the app. Click into a section (e.g. ABOUT ME). Confirm: the BACK button + title header sit centered, the red divider is centered under them, and the section content sits in a centered column with balanced left/right margins. The red shard and dot texture remain in place behind the content. If preview MCP tools are unavailable, rely on the successful build in Step 3.

- [ ] **Step 5: Commit**

```bash
git add components/SectionPanel.tsx
git commit -m "feat: center section panel header, divider, and body in CenterFrame"
```

---

### Task 3: Refactor `MenuView` into a centered two-column frame

**Files:**
- Modify: `components/MenuView.tsx` (whole return; the `statusBars` const is kept and reused)

**Interfaces:**
- Consumes: `CenterFrame` from Task 1. Existing imports unchanged: `SECTIONS`, `SOLVED`, `useCodeforces`, `cmProgressPct`, `useClock`, `ImageSlot`, `MenuRow`, `RansomText`, `AngularCard`, `ACCENT_POP`.
- Produces: no signature change. `MenuView({ hovered, muted, onToggleMute, onEnter, onOpen, narrow })` unchanged.

Desktop layout inside `CenterFrame`: (1) HUD top strip — controls hint left, mute right; (2) two top-aligned columns — left = title block + menu list, right = avatar cluster; (3) footer strip — status bars left, clock right. Narrow keeps the existing single-column stack: title → mute → menu → avatar → status bars.

- [ ] **Step 1: Add the import**

At the top of `components/MenuView.tsx`, add:

```tsx
import { CenterFrame } from './CenterFrame';
```

- [ ] **Step 2: Replace the component body**

Replace everything from `return (` to the final `);` at the end of the `MenuView` function (i.e. the entire returned JSX, currently lines 46-142) with the following. Keep the `statusBars` const (lines 21-44) exactly as it is above this return.

```tsx
  // reusable fragments (composed differently for desktop vs narrow)
  const controlsHint = (
    <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.16em', fontSize: 14, opacity: .75, display: 'flex', gap: 14 }}>
      <span><span style={{ color: 'var(--accent,#E4002B)' }}>↑↓ / 1-6</span> SELECT</span>
      <span><span style={{ color: 'var(--accent,#E4002B)' }}>ENTER</span> OPEN</span>
    </div>
  );

  const muteButton = (
    <button
      onClick={onToggleMute}
      style={{
        fontFamily: 'var(--font-bebas), sans-serif', border: '2px solid var(--accent,#E4002B)',
        background: '#0b0a0a', color: '#F4F1EA', padding: '6px 12px', letterSpacing: '.16em',
        fontSize: 14, transform: 'skewX(-6deg)', cursor: 'pointer',
      }}
    >
      {!muted ? '♪ SFX ON' : 'SFX MUTED'}
    </button>
  );

  const clockBlock = (
    <div style={{ textAlign: 'right', transform: 'skewX(-6deg)' }}>
      <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(30px,4vw,58px)', lineHeight: .9, textShadow: '3px 3px 0 var(--accent,#E4002B)' }}>{time}</div>
      <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.3em', fontSize: 'clamp(14px,1.4vw,20px)', color: 'var(--accent,#E4002B)' }}>{day} · TAKE YOUR TIME</div>
    </div>
  );

  const titleBlock = (
    <div>
      <div style={{ display: 'inline-block', fontSize: 'clamp(34px,5.4vw,82px)', lineHeight: .9, letterSpacing: '.01em', padding: '2px 0' }}>
        <RansomText text={CODENAME} />
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14, transform: 'skewX(-8deg)', flexWrap: 'wrap' }}>
        <span style={{ background: 'var(--accent,#E4002B)', color: '#0b0a0a', fontFamily: "var(--font-bebas), sans-serif", fontSize: 'clamp(15px,1.5vw,22px)', letterSpacing: '.14em', padding: '3px 12px' }}>CS · ATENEO DE MANILA</span>
        <span style={{ border: '2px solid #F4F1EA', fontFamily: "var(--font-bebas), sans-serif", fontSize: 'clamp(15px,1.5vw,22px)', letterSpacing: '.14em', padding: '2px 12px' }}>COMPETITIVE PROGRAMMER</span>
      </div>
    </div>
  );

  const menuList = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px,1vh,11px)' }}>
      {SECTIONS.map((s, i) => (
        <MenuRow key={s.id} section={s} index={i} hovered={hovered} onEnter={onEnter} onOpen={onOpen} />
      ))}
    </div>
  );

  const avatarCluster = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, transform: 'skewX(-6deg)' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', inset: -14, background: 'var(--accent,#E4002B)', clipPath: 'polygon(14% 0, 100% 6%, 92% 100%, 0 90%)' }} />
        <ImageSlot
          src="/avatar.jpg"
          alt="RAMENNAGI"
          placeholder="DROP YOUR PHOTO"
          mask="polygon(14% 0, 100% 6%, 92% 100%, 0 90%)"
          style={{ width: 'clamp(220px,24vw,360px)', height: 'clamp(300px,32vw,470px)', display: 'block', position: 'relative' }}
        />
      </div>
      <AngularCard style={{ transform: 'skewX(-2deg)' }} pop={ACCENT_POP}>
        <div style={{ background: '#141212', padding: '10px 18px', textAlign: 'center' }}>
          <div style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 14, letterSpacing: '.24em', color: 'var(--accent,#E4002B)' }}>CODENAME</div>
          <div style={{ fontSize: 'clamp(22px,2vw,30px)', lineHeight: 1, marginTop: 4, display: 'flex', justifyContent: 'center' }}>
            <RansomText text={CODENAME} seed={1} />
          </div>
        </div>
      </AngularCard>
    </div>
  );

  return (
    // PROTOTYPE lines 49-52 — root scroll region unchanged (dynamic height, top-anchored)
    <div style={{ position: 'relative', zIndex: 5, width: '100%', height: narrow ? 'auto' : '100vh', overflowY: 'auto', padding: 'clamp(20px,4vw,64px)' }}>
      {narrow ? (
        // narrow: single-column stack (title → mute → menu → avatar → status)
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px,2.2vh,28px)', width: '100%' }}>
          {titleBlock}
          <div>{muteButton}</div>
          {menuList}
          <div style={{ marginTop: 'clamp(10px,2vh,20px)' }}>{avatarCluster}</div>
          {statusBars}
        </div>
      ) : (
        // desktop: centered frame — HUD strip, two columns, footer strip
        <CenterFrame maxWidth={1180}>
          {/* HUD top strip: controls left, mute right */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(16px,2.4vh,32px)' }}>
            {controlsHint}
            {muteButton}
          </div>

          {/* two top-aligned columns */}
          <div style={{ display: 'flex', gap: 'clamp(24px,4vw,64px)', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px,2.2vh,28px)', flex: '1 1 auto', minWidth: 0 }}>
              {titleBlock}
              {menuList}
            </div>
            <div style={{ flex: '0 0 auto' }}>
              {avatarCluster}
            </div>
          </div>

          {/* footer strip: status bars left, clock right */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'clamp(20px,3vw,48px)', marginTop: 'clamp(20px,3vh,40px)' }}>
            <div style={{ flex: '1 1 auto' }}>{statusBars}</div>
            {clockBlock}
          </div>
        </CenterFrame>
      )}
    </div>
  );
```

- [ ] **Step 3: Verify it compiles and existing tests pass**

Run: `npm run test`
Expected: PASS — all suites green (no test targets MenuView internals).

Run: `npm run build`
Expected: Compiles successfully, no TypeScript errors, no unused-variable errors (every fragment — `controlsHint`, `muteButton`, `clockBlock`, `titleBlock`, `menuList`, `avatarCluster`, `statusBars` — is referenced in at least one branch).

- [ ] **Step 4: Visual check (if preview tooling available)**

Start the dev server and open the app at desktop width. Confirm: title+menu (left) and avatar+codename (right) sit in one centered block with balanced margins; controls hint + mute run along the top of that block; status bars + clock run along its bottom. Nothing is pinned to a screen corner except the ambient red shard and dot texture. Resize to mobile (≤1023px) and confirm the single-column stack still reads cleanly and is not squeezed. If preview MCP tools are unavailable, rely on the successful build.

- [ ] **Step 5: Commit**

```bash
git add components/MenuView.tsx
git commit -m "feat: center menu landing into balanced two-column frame"
```

---

### Task 4: Full-site verification pass

**Files:** none modified (verification only).

**Interfaces:** none.

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: PASS — all suites (CenterFrame, AttributesRadar, ImageSlot) green.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: Build completes with no TypeScript or lint-blocking errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: No errors (warnings acceptable if pre-existing).

- [ ] **Step 4: Visual smoke test across views (if preview tooling available)**

With the dev server running, verify at desktop width and mobile width:
- Menu landing: centered two-column frame, HUD strip top, footer strip bottom, ambient shard/texture behind, balanced horizontal margins, top-anchored (scrolls rather than vertically centering if content is tall).
- Each section (ABOUT ME, COMPETITIVE, PROJECTS, SKILLS, EDUCATION, CONTACT): centered header, centered divider, centered body.
- Keyboard nav (↑↓ / 1-6 / Enter / Esc), mute toggle, live clock, and Codeforces bars all still function.

- [ ] **Step 5: Final commit (if any verification-driven fixups were needed)**

Only if Steps 1-4 surfaced a fix:

```bash
git add -A
git commit -m "fix: address verification findings for centered layout"
```

Otherwise no commit — the work is already committed per task.
