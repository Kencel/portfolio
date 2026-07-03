'use client';
import type { JSX } from 'react';
import { SECTIONS, type SectionId } from '@/lib/data';
import { RansomText } from './RansomText';
import { About } from './sections/About';
import { Cp } from './sections/Cp';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';
import { Education } from './sections/Education';
import { Contact } from './sections/Contact';

const BODY: Record<SectionId, () => JSX.Element> = {
  about: About, cp: Cp, projects: Projects, skills: Skills, education: Education, contact: Contact,
};

export function SectionPanel({ view, onBack }: { view: SectionId; onBack: () => void }) {
  const cur = SECTIONS.find(s => s.id === view)!;
  const Body = BODY[view];

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20, background: '#0b0a0a', overflowY: 'auto' }}>
      {/* panel bg — PROTOTYPE 117 */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--accent,#E4002B) 1.3px, transparent 1.4px)', backgroundSize: '15px 15px', opacity: .12, pointerEvents: 'none' }} />
      {/* red shard — PROTOTYPE 118 */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '40%', height: '120%', background: 'var(--accent,#E4002B)', opacity: .9, clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 8% 100%)', pointerEvents: 'none' }} />

      {/* animated content wrapper — PROTOTYPE 120 */}
      <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(20px,3.5vw,52px)', animation: 'p5panelIn .32s cubic-bezier(.2,.9,.3,1) both' }}>
        {/* header — PROTOTYPE 122-130 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div
            onClick={onBack}
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F4F1EA', color: '#0b0a0a', fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.14em', fontSize: 18, padding: '7px 16px', transform: 'skewX(-8deg)' }}
          >
            <span style={{ transform: 'skewX(8deg)' }}>◄ BACK</span>
          </div>
          <div style={{ transform: 'skewX(-8deg)' }}>
            <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.3em', fontSize: 'clamp(14px,1.4vw,20px)', color: 'var(--accent,#E4002B)' }}>{cur.sub}</div>
            <div style={{ transform: 'skewX(8deg)', fontSize: 'clamp(38px,6vw,84px)', lineHeight: .9, marginTop: 6 }}>
              <RansomText text={cur.label} />
            </div>
          </div>
        </div>

        {/* divider — PROTOTYPE 132 */}
        <div style={{ height: 4, background: 'var(--accent,#E4002B)', margin: '22px 0 30px', transform: 'skewX(-40deg)', width: 'min(560px,70%)' }} />

        <Body />
      </div>
    </div>
  );
}
