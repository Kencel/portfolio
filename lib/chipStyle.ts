import type { CSSProperties } from 'react';
import { COLOR, FONT } from './tokens';

// Skewed selectable chip (filter bars, tab bars). Wrap the label in a span
// styled with `unskew` so the text stays upright.
export const chip = (active: boolean): CSSProperties => ({
  background: active ? COLOR.accent : 'transparent',
  color: active ? COLOR.base : COLOR.ink,
  border: `1px solid ${active ? COLOR.accent : COLOR.tagBorder}`,
  fontFamily: FONT.bebas, letterSpacing: '.12em', fontSize: 15,
  padding: '4px 14px', cursor: 'pointer', transform: 'skewX(-8deg)',
});

export const unskew: CSSProperties = { display: 'inline-block', transform: 'skewX(8deg)' };
