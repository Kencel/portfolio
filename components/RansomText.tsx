import { memo, type CSSProperties } from 'react';
import { COLOR, FONT } from '@/lib/tokens';
import { rand } from '@/lib/rand';

const FONTS = [FONT.anton, FONT.bebas, FONT.oswald];

// [background, text] tiles — bone / crimson / ink, the phantom-ui palette.
const TILES: ReadonlyArray<readonly [string, string]> = [
  [COLOR.ink, COLOR.base],
  [COLOR.accent, COLOR.base],
  [COLOR.base, COLOR.ink],
  [COLOR.ink, COLOR.accent],
  [COLOR.accent, COLOR.ink],
];

/**
 * Ransom-note / calling-card lettering: each character is a pasted-on tile with
 * a mixed font, size, tilt, baseline jitter, harsh black keyline and hard
 * offset shadow. Sizing is in `em` so it scales with the parent's font-size
 * (keep the existing clamp() on the wrapping element).
 *
 * memo: pure in (text, seed, tiles) and recomputes per-character styling on
 * every render, so parents that re-render per keypress skip it entirely.
 */
export const RansomText = memo(function RansomText({
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
              border: `2px solid ${COLOR.base}`,
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
});
