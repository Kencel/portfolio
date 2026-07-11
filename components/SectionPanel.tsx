'use client';
import type { JSX } from 'react';
import type { Project } from '@/lib/projects';
import type { Competition } from '@/lib/competitions';
import type { CpStats } from '@/lib/cp/types';
import { SECTIONS, type SectionId } from '@/lib/data';
import { RansomText } from './RansomText';
import { CenterFrame } from './CenterFrame';
import { HalftoneLayer } from './ui/HalftoneLayer';
import { Shard } from './ui/Shard';
import { SkewBox } from './ui/SkewBox';
import { HoverQuad } from './ui/HoverQuad';
import { COLOR, FONT, SKEW } from '@/lib/tokens';
import { About } from './sections/About';
import { Cp } from './sections/Cp';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';
import { Education } from './sections/Education';
import { Contact } from './sections/Contact';

const BODY: Record<Exclude<SectionId, 'projects' | 'cp'>, () => JSX.Element> = {
  about: About, skills: Skills, education: Education, contact: Contact,
};

export function SectionPanel({ view, onBack, projects, competitions, cpStats }: {
  view: SectionId; onBack: () => void; projects: Project[];
  competitions: Competition[]; cpStats: CpStats;
}) {
  const cur = SECTIONS.find(s => s.id === view)!;
  const Body = view === 'projects' || view === 'cp' ? null : BODY[view];

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20, background: COLOR.base, overflow: 'hidden' }}>
      {/* fixed decoration layer — clipped to the viewport, does not scroll or extend the scroll area */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* panel bg — PROTOTYPE 117 */}
        <HalftoneLayer color={COLOR.accent} dotRadius={1.3} gap={15} opacity={.12} />
        {/* red shard + its dots — PROTOTYPE 118 */}
        <Shard
          clipPath="polygon(30% 0, 100% 0, 100% 100%, 8% 100%)"
          fill={COLOR.accent}
          opacity={.9}
          style={{ top: '-10%', right: '-10%', width: '40%', height: '120%' }}
          dots={{ color: COLOR.base, radius: 1.6, gap: 12, opacity: .22 }}
        />
      </div>

      {/* scroll layer — vertical scroll only, content defines its own height */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        {/* animated content wrapper — PROTOTYPE 120 */}
        <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(20px,3.5vw,52px)', animation: 'p5panelIn .32s cubic-bezier(.2,.9,.3,1) both' }}>
          <CenterFrame maxWidth={1180}>
            {/* header — centered — PROTOTYPE 122-130 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
              <HoverQuad seed={1} clickSound="none">
                <SkewBox
                  deg={SKEW.panel}
                  onClick={onBack}
                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, background: COLOR.ink, color: COLOR.base, fontFamily: FONT.bebas, letterSpacing: '.14em', fontSize: 18, padding: '7px 16px' }}
                >
                  <span>◄ BACK</span>
                </SkewBox>
              </HoverQuad>
              <div style={{ transform: `skewX(${SKEW.panel}deg)` }}>
                <div style={{ fontFamily: FONT.bebas, letterSpacing: '.3em', fontSize: 'clamp(14px,1.4vw,20px)', color: COLOR.accent }}>{cur.sub}</div>
                <div style={{ transform: `skewX(${-SKEW.panel}deg)`, fontSize: 'clamp(38px,6vw,84px)', lineHeight: .9, marginTop: 6 }}>
                  <RansomText text={cur.label} />
                </div>
              </div>
            </div>

            {/* divider — centered — PROTOTYPE 132 */}
            <div style={{ height: 4, background: COLOR.accent, margin: '22px auto 30px', transform: 'skewX(-40deg)', width: 'min(560px,70%)' }} />

            {Body
              ? <Body />
              : view === 'projects'
                ? <Projects projects={projects} />
                : <Cp stats={cpStats} competitions={competitions} />}
          </CenterFrame>
        </div>
      </div>
    </div>
  );
}
