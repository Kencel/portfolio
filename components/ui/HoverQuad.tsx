'use client';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { useSfxContext } from '@/lib/SfxContext';
import { COLOR } from '@/lib/tokens';

const VARIANTS = ['p5quadJitterA', 'p5quadJitterB', 'p5quadJitterC'] as const;

// Single red quad behind a clickable child — the small-button sibling of the
// menu rows' two-layer hover boxes. Corners jitter via clip-path keyframes;
// seed picks variant + phase so neighbours never move in sync. The children
// sit in a positioned layer so the quad paints behind them (fringe only),
// matching how AngularCard (position: relative) covers the row hover boxes.
export function HoverQuad({ seed, children, style, clickSound = 'tap' }: {
  seed: number;
  children: ReactNode;
  style?: CSSProperties;
  clickSound?: 'tap' | 'none';
}) {
  const sfx = useSfxContext();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ position: 'relative', ...style }}
      onMouseEnter={() => { setHovered(true); sfx.hover(); }}
      onMouseLeave={() => setHovered(false)}
      onClick={clickSound === 'tap' ? () => sfx.tap() : undefined}
    >
      {hovered && (
        <div aria-hidden data-testid="hover-quad" style={{
          position: 'absolute', inset: -6, pointerEvents: 'none',
          background: COLOR.neonRed, mixBlendMode: 'screen', opacity: 0.6,
          animation: `${VARIANTS[seed % VARIANTS.length]} 1.4s linear infinite`,
          animationDelay: `${(-(seed % 7) * 0.2).toFixed(1)}s`,
        }} />
      )}
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}
