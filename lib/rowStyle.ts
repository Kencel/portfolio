import type { CSSProperties } from 'react';
import { angular } from './angular';

export function rowStyle(hovered: number | null, i: number): CSSProperties {
  const shape = i % 4; // vary the cut per row for irregularity
  const base: CSSProperties = {
    cursor: 'pointer', padding: '10px 24px 10px 18px',
    transition: 'transform .16s cubic-bezier(.2,.9,.3,1), background .16s, opacity .16s, color .16s, filter .16s',
    transform: 'skewX(-9deg) translateX(0)', opacity: 1, background: '#151313', color: '#F4F1EA',
    ...angular(shape, '3px 3px 0 rgba(0,0,0,.6)'),
  };
  if (hovered == null) return base;
  if (hovered === i) return {
    ...base, transform: 'skewX(-9deg) translateX(30px) scale(1.03)', background: 'var(--accent,#E4002B)',
    color: '#0b0a0a', ...angular(shape, '7px 7px 0 rgba(0,0,0,.7)'),
  };
  return { ...base, transform: 'skewX(-9deg) translateX(-6px)', opacity: 0.5 };
}
