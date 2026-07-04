import type { CSSProperties } from 'react';

// Hard offset "sticker" shadows so a container pops off the near-black page.
export const BLACK_POP = '7px 7px 0 rgba(0,0,0,.85)';
export const ACCENT_POP = '7px 7px 0 rgba(228,0,43,.7)';

// Torn-paper silhouettes — irregular pentagons. Paired with a thick white
// border they read as hand-cut calling-card cutouts, and the white outline
// traces a shape distinct from the rectangular content sitting inside it.
// Top-left cuts stay <=15px so left-aligned content clears the angle.
export const ANGULAR_SHAPES: readonly string[] = [
  'polygon(0 13px, 15px 0, 100% 5px, calc(100% - 9px) 100%, 7px calc(100% - 5px))',
  'polygon(7px 0, 100% 11px, calc(100% - 6px) 100%, 9px calc(100% - 3px), 0 calc(100% - 15px))',
  'polygon(0 6px, calc(100% - 13px) 0, 100% calc(100% - 9px), 13px 100%, 0 calc(100% - 3px))',
  'polygon(11px 0, 100% 0, calc(100% - 7px) calc(100% - 11px), 7px 100%, 0 13px)',
];

/**
 * Calling-card container treatment: a THICK WHITE torn-edged border whose
 * clipped silhouette is a different (irregular) shape than the content, plus a
 * hard offset pop shadow. box-shadow is clipped away by clip-path, so the pop
 * lives in `filter`. Spread LAST into a container's style. Pass ACCENT_POP for
 * a crimson pop on feature blocks.
 */
export function angular(shape = 0, pop: string = BLACK_POP): CSSProperties {
  const clip = ANGULAR_SHAPES[((shape % ANGULAR_SHAPES.length) + ANGULAR_SHAPES.length) % ANGULAR_SHAPES.length];
  return {
    border: '5px solid #F4F1EA',
    clipPath: clip,
    filter: `drop-shadow(${pop})`,
    boxShadow: 'none',
  };
}
