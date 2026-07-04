import type { CSSProperties } from 'react';

// Menu rows are exaggerated quadrilaterals: a hard -9deg skew (a slanted box)
// plus a bold outline and a hard offset shadow that pops off the page. No
// clip-path, so the real box-shadow shows.
export function rowStyle(hovered: number | null, i: number): CSSProperties {
  const base: CSSProperties = {
    cursor: 'pointer', padding: '9px 22px 9px 16px',
    transition: 'transform .16s cubic-bezier(.2,.9,.3,1), background .16s, opacity .16s, color .16s, box-shadow .16s',
    transform: 'skewX(-9deg) translateX(0)', opacity: 1, background: '#151313', color: '#F4F1EA',
    border: '2px solid #000', boxShadow: '5px 5px 0 rgba(0,0,0,.85)',
  };
  if (hovered == null) return base;
  if (hovered === i) return {
    ...base, transform: 'skewX(-9deg) translateX(30px) scale(1.03)', background: 'var(--accent,#E4002B)',
    color: '#0b0a0a', border: '2px solid #F4F1EA', boxShadow: '9px 9px 0 rgba(0,0,0,.9)',
  };
  return { ...base, transform: 'skewX(-9deg) translateX(-6px)', opacity: 0.5 };
}
