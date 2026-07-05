import type { CSSProperties } from 'react';

// Deterministic pseudo-random in [0,1) from an integer seed. Stable across
// SSR and client render (no Math.random / Date) so the ransom-note tiles never
// cause a hydration mismatch — the same letter always gets the same treatment.
function rand(seed: number): number {
  const x = Math.sin(seed * 99991.7) * 10000;
  return x - Math.floor(x);
}

const FONTS = [
  'var(--font-anton), sans-serif',
  'var(--font-bebas), sans-serif',
  'var(--font-oswald), sans-serif',
];

// [background, text] tiles — bone / crimson / ink, the phantom-ui palette.
const TILES: ReadonlyArray<readonly [string, string]> = [
  ['#F4F1EA', '#0b0a0a'],
  ['#E4002B', '#0b0a0a'],
  ['#0b0a0a', '#F4F1EA'],
  ['#F4F1EA', '#E4002B'],
  ['#E4002B', '#F4F1EA'],
];

/**
 * Ransom-note / calling-card lettering: each character is a pasted-on tile with
 * a mixed font, size, tilt, baseline jitter, harsh black keyline and hard
 * offset shadow. Sizing is in `em` so it scales with the parent's font-size
 * (keep the existing clamp() on the wrapping element).
 */
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
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.05em',
        lineHeight: 1.05,
        ...style,
      }}
    >
      {[...text].map((ch, idx) => {
        const i = idx + seed * 131;
        if (ch === ' ') return <span key={idx} style={{ width: '0.3em' }} />;
        const [bg, color] = tiles[Math.floor(rand(i + 1) * tiles.length)];
        const font = FONTS[Math.floor(rand(i + 7) * FONTS.length)];
        const rot = (rand(i + 13) * 15 - 7.5).toFixed(1);
        const dy = (rand(i + 19) * 0.16 - 0.08).toFixed(3);
        const fs = (0.84 + rand(i + 7) * 0.34).toFixed(2);
        const px = (0.09 + rand(i + 23) * 0.13).toFixed(2);
        return (
          <span
            key={idx}
            style={{
              display: 'inline-block',
              fontFamily: font,
              fontSize: `${fs}em`,
              fontWeight: 700,
              textTransform: 'uppercase',
              background: bg,
              color,
              padding: `0.03em ${px}em`,
              border: '2px solid #0b0a0a',
              boxShadow: '2px 2px 0 rgba(0,0,0,.6)',
              transform: `rotate(${rot}deg) translateY(${dy}em)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}
