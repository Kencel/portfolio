import type { CSSProperties } from 'react';

export function rowStyle(hovered: number | null, i: number): CSSProperties {
  const base: CSSProperties = {
    cursor: 'pointer', padding: '7px 22px 7px 14px',
    transition: 'transform .16s cubic-bezier(.2,.9,.3,1), background .16s, opacity .16s, color .16s, box-shadow .16s',
    transform: 'skewX(-9deg) translateX(0)', opacity: 1, background: '#151313', color: '#F4F1EA',
    border: '2px solid transparent', borderLeft: '5px solid transparent', boxShadow: 'none',
  };
  if (hovered == null) return base;
  if (hovered === i) return {
    ...base, transform: 'skewX(-9deg) translateX(30px) scale(1.03)', background: 'var(--accent,#E4002B)',
    color: '#0b0a0a', border: '2px solid #F4F1EA', borderLeft: '5px solid #0b0a0a',
    boxShadow: '5px 5px 0 rgba(0,0,0,.55)',
  };
  return { ...base, transform: 'skewX(-9deg) translateX(-6px)', opacity: 0.5 };
}
