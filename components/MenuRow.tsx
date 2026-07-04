'use client';
import type { Section, SectionId } from '@/lib/data';
import { rowState } from '@/lib/rowStyle';
import { AngularCard } from './AngularCard';

// PROTOTYPE lines 64-69, housed in a white encasing frame (AngularCard). The
// skew + hover transform live on the frame, so the white border stays concentric
// with the content and tracks the hover slide/scale as one unit.
export function MenuRow({ section, index, hovered, onEnter, onOpen }: {
  section: Section; index: number; hovered: number | null;
  onEnter: (i: number) => void; onOpen: (id: SectionId) => void;
}) {
  const st = rowState(hovered, index);
  return (
    <AngularCard
      pop={st.pop}
      rowMarker
      onMouseEnter={() => onEnter(index)}
      onClick={() => onOpen(section.id)}
      style={{
        cursor: 'pointer', opacity: st.opacity, transform: st.transform,
        transition: 'transform .16s cubic-bezier(.2,.9,.3,1), opacity .16s',
      }}
    >
      <div style={{ background: st.background, color: st.color, padding: '9px 22px 9px 16px', transition: 'background .16s, color .16s' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, transform: 'skewX(9deg)' }}>
          <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 'clamp(14px,1.3vw,20px)', opacity: .65, minWidth: 34 }}>{section.n}</span>
          <span style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(20px,2.7vw,38px)', lineHeight: .92, letterSpacing: '.005em' }}>{section.label}</span>
          <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 'clamp(12px,1.1vw,17px)', letterSpacing: '.18em', opacity: .7, alignSelf: 'center' }}>{section.sub}</span>
        </div>
      </div>
    </AngularCard>
  );
}
