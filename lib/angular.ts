import type { CSSProperties } from 'react';

// Irregular cut-corner silhouettes for the "calling-card" container look. Corner
// cuts are modest (px) so card padding keeps content clear of the angled edges.
// Aggressive, jagged cuts. Top-left cuts stay modest (<=14px) so left-aligned
// content clears the angle; the right/bottom corners are sliced hard (22-32px)
// for the torn calling-card silhouette.
export const ANGULAR_SHAPES: readonly string[] = [
  'polygon(0 14px, 14px 0, 100% 0, 100% calc(100% - 28px), calc(100% - 26px) 100%, 0 100%)',
  'polygon(0 0, calc(100% - 30px) 0, 100% 26px, 100% 100%, 24px 100%, 0 calc(100% - 22px))',
  'polygon(0 12px, 13px 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 20px 100%, 0 calc(100% - 18px))',
  'polygon(0 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%)',
];

// Four crisp black drop-shadows = a keyline that follows the clipped (and even
// skewed) silhouette — a normal `border` gets chopped by clip-path, this does
// not. `filter` is applied after transforms so it tracks the real outline.
const OUTLINE =
  'drop-shadow(2.5px 0 0 #000) drop-shadow(-2.5px 0 0 #000) drop-shadow(0 2.5px 0 #000) drop-shadow(0 -2.5px 0 #000)';

/**
 * Angular calling-card treatment: an irregular clip-path silhouette + a harsh
 * black keyline + a hard offset "pop" shadow. Spread LAST into a card's style
 * so `border: 'none'` here overrides the card's own border (which clip-path
 * would otherwise chop). Pass a crimson `pop` to make a feature card jump.
 *
 *   style={{ ...cardStyle, ...angular(1) }}
 *   style={{ ...cardStyle, ...angular(0, ACCENT_POP) }}
 */
export function angular(shape = 0, pop = '6px 6px 0 rgba(0,0,0,.7)'): CSSProperties {
  const clip = ANGULAR_SHAPES[((shape % ANGULAR_SHAPES.length) + ANGULAR_SHAPES.length) % ANGULAR_SHAPES.length];
  return {
    clipPath: clip,
    border: 'none',
    filter: `${OUTLINE} drop-shadow(${pop})`,
  };
}

// Crimson offset shadow for feature containers (use sparingly — accent is a scalpel).
export const ACCENT_POP = '6px 6px 0 rgba(228,0,43,.7)';
