# About Me Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the About Me section's content with honest, recruiter-forward copy and add a hand-built SVG "attributes" radar, with no new dependencies.

**Architecture:** Three focused changes — (1) add an `ATTRIBUTES` data export to `lib/data.ts`, (2) build a self-contained `AttributesRadar` SVG component that reads that data, (3) rewrite `components/sections/About.tsx` to use the new copy/cards and mount the radar below the existing row. All geometry is deterministic (SSR-safe); styling reuses the existing `AngularCard` frame and display fonts.

**Tech Stack:** Next.js 15 (React 19, static export), TypeScript, inline SVG, Vitest + Testing Library. No charting library.

## Global Constraints

- No new runtime dependencies — pure inline SVG only.
- Copy must stay honest: no "ships software", no "builds products at hackathons". Competitive-programming stats live only in the CP section, not About.
- Tone: clear professional prose with a light theme wink.
- Accent crimson is `var(--accent, #E4002B)`; near-black card bg is `#141212`; bone frame is handled by `AngularCard`.
- Display fonts via CSS vars already set in `app/layout.tsx`: `var(--font-anton)`, `var(--font-bebas)`, `var(--font-oswald)`.
- Radar geometry must be deterministic (no `Math.random`) to avoid hydration mismatch.
- Bio copy is fixed and must be used verbatim (see Task 3).

---

### Task 1: Add ATTRIBUTES data export

**Files:**
- Modify: `lib/data.ts`
- Test: `lib/data.test.ts`

**Interfaces:**
- Produces: `export interface Attribute { axis: string; value: number }` and `export const ATTRIBUTES: Attribute[]` — a 6-element array, each `value` in 0–100. Consumed by `AttributesRadar` (Task 2).

- [ ] **Step 1: Write the failing test**

Add to `lib/data.test.ts` — import `ATTRIBUTES` in the existing import line, then add:

```ts
it('has six attributes with 0-100 values', () => {
  expect(ATTRIBUTES).toHaveLength(6);
  expect(ATTRIBUTES.map(a => a.axis)).toEqual([
    'KNOWLEDGE', 'PROFICIENCY', 'GUTS', 'DILIGENCE', 'INGENUITY', 'ADAPTABILITY',
  ]);
  ATTRIBUTES.forEach(a => {
    expect(a.value).toBeGreaterThanOrEqual(0);
    expect(a.value).toBeLessThanOrEqual(100);
  });
});
```

Update the import at the top of the file to:

```ts
import { SECTIONS, SKILLS, CF_DEFAULTS, SOLVED, ATTRIBUTES } from './data';
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/data.test.ts`
Expected: FAIL — `ATTRIBUTES` is undefined / not exported.

- [ ] **Step 3: Add the data**

Append to `lib/data.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/data.test.ts`
Expected: PASS (all data tests green).

- [ ] **Step 5: Commit**

```bash
git add lib/data.ts lib/data.test.ts
git commit -m "feat: add ATTRIBUTES data for about-me radar"
```

---

### Task 2: Build the AttributesRadar SVG component

**Files:**
- Create: `components/AttributesRadar.tsx`
- Test: `components/AttributesRadar.test.tsx`

**Interfaces:**
- Consumes: `ATTRIBUTES` / `Attribute` from `lib/data.ts`.
- Produces: `export function AttributesRadar(): JSX.Element` — a self-contained inline `<svg>` (no props) rendering a 6-axis hexagonal radar from `ATTRIBUTES`.

**Geometry notes (deterministic):**
- 6 axes, angle for index `i`: `-90° + i*60°`, i.e. `const ang = (-90 + i*60) * Math.PI/180`.
- Center `(cx, cy) = (150, 150)`, `maxR = 110` in a `viewBox="0 0 300 300"`.
- Point on an axis at fraction `f` (0–1): `x = cx + Math.cos(ang)*maxR*f`, `y = cy + Math.sin(ang)*maxR*f`.
- Grid rings at `f = 0.25, 0.5, 0.75, 1` (hexagon polygons through all 6 axes).
- Stat polygon uses each attribute's `value/100` as `f`.
- Labels sit just outside the outer ring at `f = 1.18`; anchor `middle`.

- [ ] **Step 1: Write the failing test**

Create `components/AttributesRadar.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AttributesRadar } from './AttributesRadar';
import { ATTRIBUTES } from '@/lib/data';

describe('AttributesRadar', () => {
  it('renders an svg with a label for every attribute', () => {
    const { container, getByText } = render(<AttributesRadar />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    ATTRIBUTES.forEach(a => expect(getByText(a.axis)).toBeInTheDocument());
  });

  it('draws the filled stat polygon', () => {
    const { container } = render(<AttributesRadar />);
    // one filled crimson polygon for the stats, plus grid polygons
    expect(container.querySelectorAll('polygon').length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/AttributesRadar.test.tsx`
Expected: FAIL — cannot resolve `./AttributesRadar`.

- [ ] **Step 3: Implement the component**

Create `components/AttributesRadar.tsx`:

```tsx
import { ATTRIBUTES } from '@/lib/data';

const CX = 150;
const CY = 150;
const MAX_R = 110;
const ACCENT = 'var(--accent, #E4002B)';

function pt(i: number, f: number): [number, number] {
  const ang = (-90 + i * 60) * (Math.PI / 180);
  return [CX + Math.cos(ang) * MAX_R * f, CY + Math.sin(ang) * MAX_R * f];
}

function ringPoints(f: number): string {
  return ATTRIBUTES.map((_, i) => pt(i, f).join(',')).join(' ');
}

export function AttributesRadar() {
  const statPoints = ATTRIBUTES.map((a, i) => pt(i, a.value / 100).join(',')).join(' ');
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox="0 0 300 300" width="100%" role="img" aria-label="Attributes radar" style={{ maxWidth: 340, display: 'block', margin: '0 auto' }}>
      {/* grid rings */}
      {rings.map(f => (
        <polygon key={f} points={ringPoints(f)} fill="none" stroke="rgba(244,241,234,.18)" strokeWidth={1} />
      ))}
      {/* spokes */}
      {ATTRIBUTES.map((_, i) => {
        const [x, y] = pt(i, 1);
        return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="rgba(244,241,234,.18)" strokeWidth={1} />;
      })}
      {/* stat polygon */}
      <polygon points={statPoints} fill={ACCENT} fillOpacity={0.32} stroke={ACCENT} strokeWidth={2.5} strokeLinejoin="miter" />
      {/* vertex dots */}
      {ATTRIBUTES.map((a, i) => {
        const [x, y] = pt(i, a.value / 100);
        return <circle key={i} cx={x} cy={y} r={3} fill={ACCENT} />;
      })}
      {/* labels */}
      {ATTRIBUTES.map((a, i) => {
        const [x, y] = pt(i, 1.18);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F4F1EA"
            style={{ fontFamily: 'var(--font-bebas), sans-serif', fontSize: 13, letterSpacing: '.12em' }}
          >
            {a.axis} <tspan fill={ACCENT}>{a.value}</tspan>
          </text>
        );
      })}
    </svg>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/AttributesRadar.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/AttributesRadar.tsx components/AttributesRadar.test.tsx
git commit -m "feat: add hexagonal SVG attributes radar"
```

---

### Task 3: Rewrite About.tsx content and mount the radar

**Files:**
- Modify: `components/sections/About.tsx`

**Interfaces:**
- Consumes: `AttributesRadar` from `@/components/AttributesRadar`; existing `AngularCard` from `@/components/AngularCard`.

- [ ] **Step 1: Replace the bio prose**

In `components/sections/About.tsx`, replace the two `<p>` elements' text (inside the first `AngularCard`) with the two paragraphs below, keeping the existing `<p>` styling. First paragraph:

> A third-year Computer Science student at the **Ateneo de Manila University**, in it for the problem-solving. Competitive programming enthusiast. Chasing cleaner logic and tighter solutions for the thrill of the solve with **C++ and Python**.

Second paragraph:

> Lately I've been pointing that same drive toward **AI/ML and data science**, and toward actually building things, starting with this site, my first passion project. On the web, I work in **Next.js and React**.

Use the existing accent-bold pattern for the bolded terms: wrap **Ateneo de Manila University** in `<b style={{ color: 'var(--accent,#E4002B)' }}>`, and wrap **C++ and Python**, **AI/ML and data science**, and **Next.js and React** in plain `<b>` (matching the current `<b>shipping real software</b>` style). Remove the old "steal the win / phantom thief" copy entirely.

- [ ] **Step 2: Update the big highlighted block**

In the accent-colored `AngularCard` (currently `RANK` / `SPECIALIST`), change the label text `RANK` → `CLASS` and the value text `SPECIALIST` → `COMPETITIVE PROGRAMMER`. Keep all existing styles. Note the value string is longer — leave the existing `fontSize: 'clamp(24px,2.4vw,34px)'` and `lineHeight: 1` as-is (it wraps to two lines, which is fine).

- [ ] **Step 3: Replace the quick-facts rows**

In the second dark `AngularCard`, replace the three fact rows (Focus / Weapon / Based in) with five rows using the identical row markup (`display:flex; justify-content:space-between`, `<span style={{opacity:.7}}>` label + `<b>` value):

| label span | value `<b>` |
|---|---|
| `Year` | `3rd Year · Ateneo` |
| `Focus` | `Problem Solving · AI/ML` |
| `Languages` | `C++ · Python` |
| `Web` | `Next.js · React` |
| `Based in` | `Philippines` |

(Use a middle-dot `·`. `3rd Year · Ateneo` keeps the row from overflowing; full school name already appears in the bio.)

- [ ] **Step 4: Mount the radar below the existing row**

Wrap the current top-level grid `<div>` and a new radar block in a fragment or outer flex column. Add the import at the top:

```tsx
import { AttributesRadar } from '@/components/AttributesRadar';
```

After the existing grid `</div>` (the `repeat(auto-fit,minmax(280px,1fr))` grid), add the radar inside an `AngularCard` matching the section's framed look:

```tsx
<div style={{ maxWidth: 1200, marginTop: 22 }}>
  <AngularCard style={{ transform: 'skewX(-2deg)' }}>
    <div style={{ background: '#141212', padding: '26px 24px' }}>
      <div style={{ transform: 'skewX(2deg)' }}>
        <div style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '.2em', fontSize: 15, opacity: .7, marginBottom: 8, textAlign: 'center' }}>
          ATTRIBUTES
        </div>
        <AttributesRadar />
      </div>
    </div>
  </AngularCard>
</div>
```

Ensure the component's outermost return wraps both the grid and this new block (e.g. in a `<div style={{ display:'flex', flexDirection:'column', gap:0 }}>` or a React fragment `<>...</>`). Counter-skew (`skewX(2deg)`) already offsets the card's `-2deg` so the radar itself is not visibly skewed.

- [ ] **Step 5: Run the full test suite**

Run: `npm test`
Expected: PASS — all existing tests plus the new data and radar tests.

- [ ] **Step 6: Visually verify in the dev server**

Start the dev server, open the About Me section, and confirm: new bio copy, `CLASS / COMPETITIVE PROGRAMMER` block, five quick-fact rows, and a crimson hexagonal radar with six labeled axes below. Fix any layout issues (e.g. label clipping) before committing.

- [ ] **Step 7: Commit**

```bash
git add components/sections/About.tsx
git commit -m "feat: revamp About Me copy, cards, and mount attributes radar"
```

---

## Self-Review

- **Spec coverage:** bio copy (Task 3.1), CLASS/COMPETITIVE PROGRAMMER block (3.2), 5-row quick facts (3.3), SVG radar with 6 traits + placeholder values (Tasks 1–2, 3.4), no new dependency (inline SVG only), CP stats untouched (no CP edits), Skills section untouched. All covered.
- **Placeholder scan:** none — all steps carry real code/copy.
- **Type consistency:** `Attribute { axis; value }` and `ATTRIBUTES` defined in Task 1, consumed identically in Task 2; `AttributesRadar()` no-prop signature defined in Task 2, imported in Task 3.
