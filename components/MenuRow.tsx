'use client';
import type { Section, SectionId } from '@/lib/data';
import { rowStyle } from '@/lib/rowStyle';

// PROTOTYPE lines 64-69
export function MenuRow({ section, index, hovered, onEnter, onOpen }: {
  section: Section; index: number; hovered: number | null;
  onEnter: (i: number) => void; onOpen: (id: SectionId) => void;
}) {
  return (
    <div data-p5row="1" onMouseEnter={() => onEnter(index)} onClick={() => onOpen(section.id)} style={rowStyle(hovered, index)}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, transform: 'skewX(9deg)' }}>
        <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 'clamp(14px,1.3vw,20px)', opacity: .65, minWidth: 34 }}>{section.n}</span>
        <span style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(20px,2.7vw,38px)', lineHeight: .92, letterSpacing: '.005em' }}>{section.label}</span>
        <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 'clamp(12px,1.1vw,17px)', letterSpacing: '.18em', opacity: .7, alignSelf: 'center' }}>{section.sub}</span>
      </div>
    </div>
  );
}
