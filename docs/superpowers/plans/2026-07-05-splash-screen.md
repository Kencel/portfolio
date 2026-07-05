# P5R Splash Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Persona 5 Royal-style boot splash: a ramen bowl SVG spins over black with "TAKE YOUR TIME" ransom-note text, then a bowl-shaped window onto the site zooms out until the whole site is visible. Once per session, skippable.

**Architecture:** A `SplashScreen` client component rendered by `Portfolio` as a fixed overlay above the site. A timer-driven phase machine (`spin` → `reveal` → done; `fade` when reduced motion) owns all state transitions — CSS keyframe animations are purely presentational, which keeps the component testable under jsdom fake timers. The reveal is a full-viewport SVG sheet with a bowl-shaped hole (SVG `<mask>`) that scales up 30× so the hole swallows the viewport. Session gating lives in a tiny `lib/splashSession.ts` helper; `Portfolio` is the single owner of the "seen" write.

**Tech Stack:** Next.js 15 / React 19, inline styles + keyframes in `app/globals.css` (site convention), vitest + @testing-library/react + jsdom. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-05-splash-screen-design.md`

## Global Constraints

- Palette: the splash is MONOCHROME — ink `#0b0a0a` and bone `#F4F1EA` only. No crimson (`#E4002B`) anywhere in the splash, including the ransom text tiles. (The rest of the site keeps its existing palette.)
- sessionStorage key: `p5r-splash-seen`, value `'1'`.
- Timings: spin `1900ms`, reveal `1100ms`, reduced-motion fade `300ms`.
- New keyframes follow the existing `p5*` naming in `app/globals.css`.
- Styling via inline `style` props (site convention — no Tailwind classes, no CSS modules).
- Tests co-located: `components/Foo.test.tsx`, `lib/foo.test.ts`. Run with `npx vitest run <path>` or `npm test` for the suite.
- No `Math.random()`/`Date.now()` in render paths (SSR hydration safety — same rule as `RansomText`).

---

### Task 1: Session-storage helper

**Files:**
- Create: `lib/splashSession.ts`
- Test: `lib/splashSession.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `hasSeenSplash(): boolean` and `markSplashSeen(): void`, exported from `lib/splashSession.ts`. Task 3 imports both.

- [ ] **Step 1: Write the failing test**

Create `lib/splashSession.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { hasSeenSplash, markSplashSeen } from './splashSession';

describe('splashSession', () => {
  beforeEach(() => { window.sessionStorage.clear(); });

  it('reports not seen on a fresh session', () => {
    expect(hasSeenSplash()).toBe(false);
  });

  it('reports seen after marking', () => {
    markSplashSeen();
    expect(hasSeenSplash()).toBe(true);
    expect(window.sessionStorage.getItem('p5r-splash-seen')).toBe('1');
  });

  it('ignores foreign values under the key', () => {
    window.sessionStorage.setItem('p5r-splash-seen', 'yes');
    expect(hasSeenSplash()).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/splashSession.test.ts`
Expected: FAIL — cannot resolve `./splashSession`.

- [ ] **Step 3: Write minimal implementation**

Create `lib/splashSession.ts`:

```ts
const KEY = 'p5r-splash-seen';

// try/catch: sessionStorage access can throw (privacy modes, sandboxed
// iframes). Failing open means the splash just plays again — harmless.
export function hasSeenSplash(): boolean {
  try { return window.sessionStorage.getItem(KEY) === '1'; } catch { return false; }
}

export function markSplashSeen(): void {
  try { window.sessionStorage.setItem(KEY, '1'); } catch { /* non-fatal */ }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/splashSession.test.ts`
Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add lib/splashSession.ts lib/splashSession.test.ts
git commit -m "feat: session-storage gate for splash screen"
```

---

### Task 2: SplashScreen component

**Files:**
- Create: `components/SplashScreen.tsx`
- Modify: `app/globals.css` (append keyframes after the existing `@keyframes p5pulse` line)
- Modify: `components/RansomText.tsx` (add optional `tiles` prop; default behavior unchanged)
- Test: `components/SplashScreen.test.tsx`

**Interfaces:**
- Consumes: `RansomText` from `components/RansomText.tsx` (`<RansomText text="..." seed={n} style={...} />`).
- Modifies: `RansomText` gains an optional prop `tiles?: ReadonlyArray<readonly [string, string]>` ([background, text] pairs) defaulting to the existing `TILES` constant, so callers can restrict the palette. No other callers change.
- Produces: `SplashScreen({ onDone }: { onDone: () => void })` plus exported timing constants `SPIN_MS = 1900`, `REVEAL_MS = 1100`, `FADE_MS = 300`. Task 3 imports `SplashScreen`. The root element carries `data-splash-phase="spin" | "reveal" | "fade"` (used by tests).

- [ ] **Step 1: Write the failing test**

Create `components/SplashScreen.test.tsx`:

```tsx
import { render, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SplashScreen, SPIN_MS, REVEAL_MS, FADE_MS } from './SplashScreen';

function phaseOf(container: HTMLElement): string | null {
  const root = container.querySelector('[data-splash-phase]');
  return root ? root.getAttribute('data-splash-phase') : null;
}

describe('SplashScreen', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  it('starts in the spin phase with the bowl and TAKE YOUR TIME text', () => {
    const { container } = render(<SplashScreen onDone={() => {}} />);
    expect(phaseOf(container)).toBe('spin');
    // RansomText renders one span per character; spaces are empty spacer spans.
    expect(container.textContent).toContain('TAKEYOURTIME');
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('is monochrome: no crimson in the rendered markup', () => {
    const { container } = render(<SplashScreen onDone={() => {}} />);
    // Inline styles serialize hex to rgb() in jsdom; check both spellings.
    expect(container.innerHTML).not.toMatch(/#E4002B/i);
    expect(container.innerHTML).not.toMatch(/228,\s*0,\s*43/);
  });

  it('advances spin -> reveal -> onDone on the timer', () => {
    const onDone = vi.fn();
    const { container } = render(<SplashScreen onDone={onDone} />);
    act(() => { vi.advanceTimersByTime(SPIN_MS); });
    expect(phaseOf(container)).toBe('reveal');
    expect(onDone).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(REVEAL_MS); });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('skips to reveal on keydown during the spin', () => {
    const onDone = vi.fn();
    const { container } = render(<SplashScreen onDone={onDone} />);
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(phaseOf(container)).toBe('reveal');
    expect(onDone).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(REVEAL_MS); });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('skips to reveal on pointerdown during the spin', () => {
    const { container } = render(<SplashScreen onDone={() => {}} />);
    fireEvent.pointerDown(window);
    expect(phaseOf(container)).toBe('reveal');
  });

  it('a skip input during the reveal does not restart or double-finish', () => {
    const onDone = vi.fn();
    const { container } = render(<SplashScreen onDone={onDone} />);
    fireEvent.keyDown(window, { key: 'Enter' });
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(phaseOf(container)).toBe('reveal');
    act(() => { vi.advanceTimersByTime(REVEAL_MS + SPIN_MS); });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('uses a plain fade when prefers-reduced-motion is set', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    const onDone = vi.fn();
    const { container } = render(<SplashScreen onDone={onDone} />);
    expect(phaseOf(container)).toBe('fade');
    act(() => { vi.advanceTimersByTime(FADE_MS); });
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/SplashScreen.test.tsx`
Expected: FAIL — cannot resolve `./SplashScreen`.

- [ ] **Step 3: Add keyframes to globals.css**

In `app/globals.css`, after the `@keyframes p5pulse` line, add:

```css
@keyframes p5splashSpin { 0% { transform: perspective(600px) rotateY(0deg) scale(.7); } 67% { transform: perspective(600px) rotateY(1080deg) scale(1.06); } 84% { transform: perspective(600px) rotateY(1080deg) scale(1); } 100% { transform: perspective(600px) rotateY(1080deg) scale(1); } }
@keyframes p5splashReveal { from { transform: scale(1); } to { transform: scale(30); } }
@keyframes p5splashFadeOut { from { opacity: 1; } to { opacity: 0; } }
```

- [ ] **Step 4: Write the implementation**

First, in `components/RansomText.tsx`, make the tile set injectable. Add `tiles = TILES` to the props (type `tiles?: ReadonlyArray<readonly [string, string]>`) and change the tile lookup line to use it:

```tsx
export function RansomText({
  text,
  className,
  style,
  seed = 0,
  tiles = TILES,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  seed?: number;
  tiles?: ReadonlyArray<readonly [string, string]>;
}) {
```

and inside the map:

```tsx
const [bg, color] = tiles[Math.floor(rand(i + 1) * tiles.length)];
```

Everything else in `RansomText.tsx` stays as-is (the default `TILES` keeps every existing caller pixel-identical).

Then create `components/SplashScreen.tsx`:

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { RansomText } from './RansomText';

export const SPIN_MS = 1900;
export const REVEAL_MS = 1100;
export const FADE_MS = 300;

type Phase = 'spin' | 'reveal' | 'fade';

const INK = '#0b0a0a';
const BONE = '#F4F1EA';

// Monochrome ransom tiles — the splash allows no crimson.
const MONO_TILES: ReadonlyArray<readonly [string, string]> = [
  [BONE, INK],
  [INK, BONE],
];

// Bowl silhouette in a 200x200 box: lower hemisphere (r=72) plus the rim
// ellipse top. Doubles as the reveal hole, so it must stay a closed path.
const BOWL_SILHOUETTE = 'M28 88 A72 72 0 0 0 172 88 A72 14 0 0 0 28 88 Z';
const BOWL_FOOT = 'M84 150 h32 v20 h-32 Z';

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// The spinning splash art: bone bowl, ink band, chopsticks, noodles, steam.
function RamenBowl() {
  return (
    <svg width="180" height="180" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <clipPath id="p5splash-bowl-clip"><path d="M28 88 A72 72 0 0 0 172 88 Z" /></clipPath>
      </defs>
      {/* steam */}
      <path d="M78 44 q6 -10 0 -20 q-5 -9 2 -16" fill="none" stroke={BONE} strokeWidth="6" strokeLinecap="square" opacity=".75" />
      <path d="M116 48 q6 -10 0 -20 q-5 -9 2 -16" fill="none" stroke={BONE} strokeWidth="6" strokeLinecap="square" opacity=".55" />
      {/* chopsticks, leaning out of the bowl */}
      <rect x="120" y="6" width="7" height="86" rx="2" transform="rotate(24 123 49)" fill={BONE} stroke={INK} strokeWidth="3" />
      <rect x="136" y="12" width="7" height="82" rx="2" transform="rotate(31 139 53)" fill={BONE} stroke={INK} strokeWidth="3" />
      {/* foot, then bowl body over it */}
      <path d={BOWL_FOOT} fill={BONE} stroke={INK} strokeWidth="5" />
      <path d="M28 88 A72 72 0 0 0 172 88 Z" fill={BONE} stroke={INK} strokeWidth="5" />
      <rect x="24" y="112" width="152" height="22" fill={INK} clipPath="url(#p5splash-bowl-clip)" />
      {/* rim + broth + noodles + narutomaki */}
      <ellipse cx="100" cy="88" rx="72" ry="14" fill={BONE} stroke={INK} strokeWidth="5" />
      <ellipse cx="100" cy="88" rx="58" ry="9" fill={INK} />
      <path d="M52 88 q12 -8 24 0 t24 0 t24 0 t24 0" fill="none" stroke={BONE} strokeWidth="4" />
      <circle cx="100" cy="85" r="7" fill={BONE} stroke={INK} strokeWidth="3" />
    </svg>
  );
}

/**
 * P5R-style boot splash. A timer-driven phase machine owns the transitions
 * (spin -> reveal -> onDone; fade -> onDone under reduced motion); the CSS
 * animations are purely presentational so jsdom tests can drive it with
 * fake timers.
 */
export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('spin');
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Reduced-motion swap happens in an effect, not the initializer: the server
  // always renders the spin tree, so hydration must produce it too. (An
  // initializer branch here hydration-mismatches for reduced-motion clients.)
  useEffect(() => { if (prefersReducedMotion()) setPhase('fade'); }, []);

  useEffect(() => {
    const ms = phase === 'spin' ? SPIN_MS : phase === 'reveal' ? REVEAL_MS : FADE_MS;
    const t = window.setTimeout(() => {
      if (phase === 'spin') setPhase('reveal');
      else onDoneRef.current();
    }, ms);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Any key or click during the spin skips ahead to the reveal.
  useEffect(() => {
    if (phase !== 'spin') return;
    const skip = () => setPhase('reveal');
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [phase]);

  if (phase === 'reveal') {
    return (
      <div data-splash-phase="reveal" role="presentation" aria-hidden="true"
        style={{ position: 'fixed', inset: 0, zIndex: 100, overflow: 'hidden' }}>
        {/* Ink sheet with a bowl-shaped hole; scaling it 30x makes the hole
            swallow the viewport. slice + xMidYMid pins the hole to screen
            center, which is also the transform origin. */}
        <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice"
          style={{ position: 'absolute', inset: 0, transformOrigin: '50% 50%',
            animation: `p5splashReveal ${REVEAL_MS}ms cubic-bezier(.55,0,.85,.35) both` }}>
          <defs>
            <mask id="p5splash-hole">
              <rect x="-2900" y="-2900" width="6000" height="6000" fill="#fff" />
              <g transform="translate(100 100) scale(.28) translate(-100 -122)">
                <path d={BOWL_SILHOUETTE} fill="#000" />
                <path d={BOWL_FOOT} fill="#000" />
              </g>
            </mask>
          </defs>
          <rect x="-2900" y="-2900" width="6000" height="6000" fill={INK} mask="url(#p5splash-hole)" />
        </svg>
      </div>
    );
  }

  if (phase === 'fade') {
    return (
      <div data-splash-phase="fade" role="presentation" aria-hidden="true"
        style={{ position: 'fixed', inset: 0, zIndex: 100, background: INK, pointerEvents: 'none',
          animation: `p5splashFadeOut ${FADE_MS}ms ease-out both` }} />
    );
  }

  return (
    <div data-splash-phase="spin" role="presentation" aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: INK, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28,
        cursor: 'pointer', userSelect: 'none' }}>
      <div style={{ animation: `p5splashSpin ${SPIN_MS}ms cubic-bezier(.22,.9,.3,1) both` }}>
        {/* Keyframes hold the final ~16% as an intentional settle beat before reveal. */}
        <RamenBowl />
      </div>
      <div style={{ fontSize: 'clamp(20px, 3.4vw, 34px)', animation: 'p5pulse 1.6s ease-in-out infinite' }}>
        <RansomText text="TAKE YOUR TIME" seed={42} tiles={MONO_TILES} />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run components/SplashScreen.test.tsx`
Expected: 7 passed.

Also run the full suite to confirm the `RansomText` change broke nothing: `npm test` — all pass.

- [ ] **Step 6: Commit**

```bash
git add components/SplashScreen.tsx components/SplashScreen.test.tsx components/RansomText.tsx app/globals.css
git commit -m "feat: monochrome P5R-style splash screen with spin and bowl-window reveal"
```

---

### Task 3: Portfolio integration

**Files:**
- Modify: `components/Portfolio.tsx`
- Test: run the full suite (Portfolio itself has no unit test; `useSfx`/AudioContext make it a poor jsdom candidate — behavior is verified in Task 4).

**Interfaces:**
- Consumes: `SplashScreen` from Task 2; `hasSeenSplash` / `markSplashSeen` from Task 1.
- Produces: nothing new — wires the splash into the page.

- [ ] **Step 1: Add splash state and gating to Portfolio**

In `components/Portfolio.tsx`:

Add imports:

```tsx
import { SplashScreen } from './SplashScreen';
import { hasSeenSplash, markSplashSeen } from '@/lib/splashSession';
```

Inside `Portfolio()`, alongside the existing state (after the `narrow` line):

```tsx
// Splash starts true on server and client alike (no hydration mismatch);
// the effect below hides it before paint matters for repeat visitors —
// the one dark frame is invisible against the site's own background.
const [splash, setSplash] = useState(true);
const splashRef = useRef(splash);
splashRef.current = splash;
useEffect(() => { if (hasSeenSplash()) setSplash(false); }, []);
const splashDone = useCallback(() => { markSplashSeen(); setSplash(false); }, []);
```

At the top of the existing `onKey` handler (first line of the function body), suppress menu navigation while the splash is up so a skip keypress doesn't also drive the menu:

```tsx
if (splashRef.current) return;
```

Add `splash` to the `useEffect` dependency array? No — the handler reads `splashRef.current`, same pattern as `viewRef`/`hoveredRef`; the dependency array stays `[goMenu, move, open, sfx]`.

In the JSX, render the splash last inside the root div (it must sit above `MenuView`/`SectionPanel`; its own `zIndex: 100` handles stacking):

```tsx
{view === 'menu'
  ? <MenuView hovered={hovered} muted={muted} onToggleMute={() => setMuted(m => !m)}
      onEnter={enter} onOpen={open} narrow={narrow} />
  : <SectionPanel view={view} onBack={goMenu} />}
{splash && <SplashScreen onDone={splashDone} />}
```

(The `MenuView`/`SectionPanel` lines are unchanged from the current file — only the `{splash && ...}` line is new.)

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: all tests pass (the new SplashScreen and splashSession tests plus every pre-existing test).

- [ ] **Step 3: Commit**

```bash
git add components/Portfolio.tsx
git commit -m "feat: gate site entry behind once-per-session splash"
```

---

### Task 4: Visual verification and polish

**Files:**
- Possibly modify: `components/SplashScreen.tsx` (bowl art / timing tweaks only)

**Interfaces:**
- Consumes: everything above.
- Produces: screenshot proof; any art tweaks committed.

- [ ] **Step 1: Run the dev server and watch the sequence**

Use the preview tools (`preview_start` with the dev config, then `preview_screenshot`). sessionStorage is per-tab, so to replay the splash run `sessionStorage.removeItem('p5r-splash-seen'); location.reload()` via `preview_eval`.

Verify, capturing screenshots mid-spin and mid-reveal:
1. Bowl reads as a ramen bowl while spinning (silhouette holds up under rotation).
2. "TAKE YOUR TIME" tiles are legible and pulse.
3. Reveal hole is bowl-shaped, starts centered and small, and the zoom fully clears the viewport with no ink slivers left at the edges (check a wide and a narrow viewport via `preview_resize`).
4. A keypress during the spin skips to the reveal, and the same keypress does not move the menu selection.
5. Reload without clearing sessionStorage → no splash.
6. The whole splash (bowl + text) is strictly ink/bone monochrome — no crimson anywhere until the site shows through the reveal hole.
7. No console errors (`preview_console_logs`).

- [ ] **Step 2: Fix anything that looks wrong**

Expected trouble spots and their knobs, all in `SplashScreen.tsx`:
- Hole not centered on screen → adjust the inner translate in the mask group (`translate(-100 -122)` — the `122` is the silhouette's vertical centroid).
- Hole starts too big/small → the `scale(.28)` in the mask group.
- Ink slivers at reveal end on ultrawide screens → raise the end scale in `p5splashReveal` (globals.css) above 30.
- Bowl art proportions → the `RamenBowl` path data.

Re-run `npx vitest run components/SplashScreen.test.tsx` after any change.

- [ ] **Step 3: Commit any tweaks**

```bash
git add components/SplashScreen.tsx app/globals.css
git commit -m "fix: splash art and reveal tuning after visual pass"
```
