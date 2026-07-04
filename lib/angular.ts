import type { CSSProperties } from 'react';

// Hard offset "sticker" shadows so a container pops off the near-black page.
export const BLACK_POP = '8px 8px 0 rgba(0,0,0,.9)';
export const ACCENT_POP = '8px 8px 0 rgba(228,0,43,.6)';

/**
 * Exaggerated-quadrilateral container treatment. Each container keeps its own
 * skewX transform (a slanted 4-sided box); this adds a bold outline and a hard
 * offset shadow so the quad pops. Deliberately NO clip-path — a real box-shadow
 * gives the crisp offset a clipped silhouette would hide, and avoids the jagged
 * cut-corner look. The first arg is kept for call-site compatibility (callers
 * pass a shape index) but no longer varies the shape.
 */
export function angular(_shape = 0, pop: string = BLACK_POP): CSSProperties {
  return {
    border: '2px solid #000',
    boxShadow: pop,
  };
}
