'use client';
import { ImageSlot } from '@/components/ImageSlot';
import { AngularCard } from '@/components/AngularCard';
import { COLOR, FONT } from '@/lib/tokens';

// PROTOTYPE lines 195-230
export function Projects() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 22, maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' }}>
      <AngularCard seed={61} style={{ transform: 'skewX(-1.5deg)' }}>
        <div style={{ background: COLOR.panel, overflow: 'hidden' }}>
          <div style={{ transform: 'skewX(1.5deg)' }}>
            <ImageSlot src="/sinag.jpg" alt="Project SINAG" placeholder="PROJECT SINAG SCREENSHOT" style={{ width: '100%', height: 190, display: 'block' }} />
            <div style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: FONT.anton, fontSize: 'clamp(26px,2.6vw,36px)' }}>PROJECT SINAG</span>
                <span style={{ background: COLOR.accent, color: COLOR.base, fontFamily: FONT.bebas, letterSpacing: '.14em', padding: '2px 10px', fontSize: 15 }}>TEAM McCODERS</span>
              </div>
              <p style={{ fontFamily: FONT.oswald, fontWeight: 300, fontSize: 17, lineHeight: 1.5, opacity: .9, margin: '10px 0 14px' }}>
                Full-stack web product built as Team McCoders. Next.js on both ends, typed data with Prisma over PostgreSQL, styled with Tailwind &amp; shadcn/ui.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
                <span style={{ border: `1px solid ${COLOR.accent}`, color: COLOR.accent, fontFamily: FONT.bebas, letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>NEXT.JS</span>
                <span style={{ border: `1px solid ${COLOR.tagBorder}`, fontFamily: FONT.bebas, letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>TAILWIND</span>
                <span style={{ border: `1px solid ${COLOR.tagBorder}`, fontFamily: FONT.bebas, letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>SHADCN/UI</span>
                <span style={{ border: `1px solid ${COLOR.tagBorder}`, fontFamily: FONT.bebas, letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>NITRO</span>
                <span style={{ border: `1px solid ${COLOR.tagBorder}`, fontFamily: FONT.bebas, letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>PRISMA</span>
                <span style={{ border: `1px solid ${COLOR.tagBorder}`, fontFamily: FONT.bebas, letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>POSTGRESQL</span>
              </div>
              <a href="https://project-sinag.cjuy.dev/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: COLOR.ink, color: COLOR.base, fontFamily: FONT.bebas, letterSpacing: '.14em', padding: '8px 18px', textDecoration: 'none', fontSize: 17 }}>VISIT SITE ►</a>
            </div>
          </div>
        </div>
      </AngularCard>
      <AngularCard seed={62} style={{ transform: 'skewX(-1.5deg)' }}>
        <div style={{ background: COLOR.panel, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ transform: 'skewX(1.5deg)' }}>
            <span style={{ fontFamily: FONT.anton, fontSize: 'clamp(26px,2.6vw,36px)' }}>BLUE HACKS</span>
            <p style={{ fontFamily: FONT.oswald, fontWeight: 300, fontSize: 17, lineHeight: 1.5, opacity: .9, margin: '10px 0 0' }}>
              Hackathon competitor — building and shipping working products under pressure alongside a team, from idea to demo within the event window.
            </p>
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ border: `1px solid ${COLOR.accent}`, color: COLOR.accent, fontFamily: FONT.bebas, letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>HACKATHON</span>
              <span style={{ border: `1px solid ${COLOR.tagBorder}`, fontFamily: FONT.bebas, letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>FULL-STACK</span>
              <span style={{ border: `1px solid ${COLOR.tagBorder}`, fontFamily: FONT.bebas, letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>TEAMWORK</span>
            </div>
          </div>
        </div>
      </AngularCard>
    </div>
  );
}
