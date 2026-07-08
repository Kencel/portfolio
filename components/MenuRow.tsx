'use client';
import type { CSSProperties } from 'react';
import type { Section, SectionId } from '@/lib/data';
import { rowState } from '@/lib/rowStyle';
import { AngularCard } from './AngularCard';
import { COLOR, FONT, SKEW } from '@/lib/tokens';

// PROTOTYPE lines 64-69, housed in a white encasing frame (AngularCard). The
// skew + hover transform live on the frame, so the white border stays concentric
// with the content and tracks the hover slide/scale as one unit.
export function MenuRow({ section, index, hovered, onEnter, onOpen, visit }: {
  section: Section; index: number; hovered: number | null;
  onEnter: (i: number) => void; onOpen: (id: SectionId) => void; visit: number;
}) {
  const st = rowState(hovered, index);
  const isHovered = hovered === index;
  const entrance = visit > 0
    ? `p5rowIn .3s cubic-bezier(.2,.9,.3,1) ${index * 0.055}s backwards`
    : undefined;
  const boxBase: CSSProperties = {
    position: 'absolute', inset: -8, pointerEvents: 'none',
    opacity: 0.6, mixBlendMode: 'screen',
  };
  return (
    <div style={{ position: 'relative' }}>
      {isHovered && (
        <>
          <div style={{ ...boxBase, background: COLOR.neonRed, transform: 'skewX(14deg) translateX(-10px)', animation: 'p5hoverJitter .45s ease-in-out infinite' }} />
          <div style={{ ...boxBase, background: COLOR.neonCyan, transform: 'skewX(-14deg) translateX(10px)', animation: 'p5hoverJitter .65s ease-in-out infinite reverse', animationDelay: '-0.2s' }} />
        </>
      )}
      <AngularCard
        pop={st.pop}
        seed={index + 1}
        rowMarker
        onMouseEnter={() => onEnter(index)}
        onClick={() => onOpen(section.id)}
        style={{
          cursor: 'pointer', opacity: st.opacity, transform: st.transform,
          transition: 'transform .16s cubic-bezier(.2,.9,.3,1), opacity .16s',
          animation: entrance,
        }}
      >
        <div style={{ background: st.background, color: st.color, padding: '9px 22px 9px 16px', transition: 'background .16s, color .16s' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, transform: `skewX(${-SKEW.row}deg)` }}>
            <span style={{ fontFamily: FONT.bebas, fontSize: 'clamp(14px,1.3vw,20px)', opacity: .65, minWidth: 34 }}>{section.n}</span>
            <span style={{ fontFamily: FONT.anton, fontSize: 'clamp(20px,2.7vw,38px)', lineHeight: .92, letterSpacing: '.005em' }}>{section.label}</span>
            <span style={{ fontFamily: FONT.bebas, fontSize: 'clamp(12px,1.1vw,17px)', letterSpacing: '.18em', opacity: .7, alignSelf: 'center' }}>{section.sub}</span>
          </div>
        </div>
      </AngularCard>
    </div>
  );
}
