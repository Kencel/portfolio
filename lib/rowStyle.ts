import type { CSSProperties } from 'react';
import { angular } from './angular';

// Menu rows get the SAME calling-card treatment as the containers: a hard
// -9deg skew, a thick white torn-edged border (irregular silhouette) and a hard
// offset pop shadow. Because the border is part of the element it tracks the
// row's hover translate/scale, so nothing misaligns.
export function rowStyle(hovered: number | null, i: number): CSSProperties {
  const shape = i % 4;
  const base: CSSProperties = {
    cursor: 'pointer', padding: '12px 26px 12px 22px',
    transition: 'transform .16s cubic-bezier(.2,.9,.3,1), background .16s, opacity .16s, color .16s, filter .16s',
    transform: 'skewX(-9deg) translateX(0)', opacity: 1, background: '#151313', color: '#F4F1EA',
    ...angular(shape, '4px 4px 0 rgba(0,0,0,.85)'),
  };
  if (hovered == null) return base;
  if (hovered === i) return {
    ...base, transform: 'skewX(-9deg) translateX(30px) scale(1.03)', background: 'var(--accent,#E4002B)',
    color: '#0b0a0a', ...angular(shape, '8px 8px 0 rgba(0,0,0,.9)'),
  };
  return { ...base, transform: 'skewX(-9deg) translateX(-6px)', opacity: 0.5 };
}
