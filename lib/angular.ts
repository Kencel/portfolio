import type { CSSProperties } from 'react';

// Irregular cut-corner silhouettes for the "calling-card" container look. Corner
// cuts are modest (px) so card padding keeps content clear of the angled edges.
export const ANGULAR_SHAPES: readonly string[] = [
  'polygon(0 11px, 11px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 13px) 100%, 0 100%)',
  'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 13px 100%, 0 calc(100% - 13px))',
  'polygon(0 7px, 7px 0, calc(100% - 12px) 0, 100% 13px, 100% 100%, 11px 100%, 0 calc(100% - 9px))',
  'polygon(0 0, 100% 0, 100% calc(100% - 17px), calc(100% - 17px) 100%, 0 100%)',
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
