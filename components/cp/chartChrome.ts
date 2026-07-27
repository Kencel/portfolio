import type { CSSProperties } from 'react';
import { COLOR, FONT } from '@/lib/tokens';

// Shared chrome for the CP charts: title line, svg frame, axis tick labels.
export const chartTitle: CSSProperties = {
  fontFamily: FONT.bebas, letterSpacing: '.18em', fontSize: 15,
  color: COLOR.ink, opacity: .85, marginBottom: 6,
};

export const chartFrame: CSSProperties = {
  width: '100%', display: 'block', background: COLOR.trackBg,
  border: `1px solid ${COLOR.trackBorder}`,
};

// Spread onto <text> elements: <text {...tickLabel} x={...}>.
export const tickLabel = {
  fontSize: 10, fill: COLOR.ink, opacity: 0.7, fontFamily: FONT.oswald,
} as const;
