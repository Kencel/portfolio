'use client';
import { ImageSlot } from '@/components/ImageSlot';

// PROTOTYPE lines 195-230
export function Projects() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 22, maxWidth: 1200 }}>
      <div style={{ background: '#141212', border: '2px solid #2a2727', overflow: 'hidden', transform: 'skewX(-1.5deg)' }}>
        <div style={{ transform: 'skewX(1.5deg)' }}>
          <ImageSlot src="/sinag.jpg" alt="Project SINAG" placeholder="PROJECT SINAG SCREENSHOT" style={{ width: '100%', height: 190, display: 'block' }} />
          <div style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(26px,2.6vw,36px)' }}>PROJECT SINAG</span>
              <span style={{ background: 'var(--accent,#E4002B)', color: '#0b0a0a', fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.14em', padding: '2px 10px', fontSize: 15 }}>TEAM McCODERS</span>
            </div>
            <p style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 300, fontSize: 17, lineHeight: 1.5, opacity: .9, margin: '10px 0 14px' }}>
              Full-stack web product built as Team McCoders. Next.js on both ends, typed data with Prisma over PostgreSQL, styled with Tailwind &amp; shadcn/ui.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
              <span style={{ border: '1px solid var(--accent,#E4002B)', color: 'var(--accent,#E4002B)', fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>NEXT.JS</span>
              <span style={{ border: '1px solid #444', fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>TAILWIND</span>
              <span style={{ border: '1px solid #444', fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>SHADCN/UI</span>
              <span style={{ border: '1px solid #444', fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>NITRO</span>
              <span style={{ border: '1px solid #444', fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>PRISMA</span>
              <span style={{ border: '1px solid #444', fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>POSTGRESQL</span>
            </div>
            <a href="https://project-sinag.cjuy.dev/" target="_blank" style={{ display: 'inline-block', background: '#F4F1EA', color: '#0b0a0a', fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.14em', padding: '8px 18px', textDecoration: 'none', fontSize: 17 }}>VISIT SITE ►</a>
          </div>
        </div>
      </div>
      <div style={{ background: '#141212', border: '2px solid #2a2727', padding: 22, transform: 'skewX(-1.5deg)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ transform: 'skewX(1.5deg)' }}>
          <span style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(26px,2.6vw,36px)' }}>BLUE HACKS</span>
          <p style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 300, fontSize: 17, lineHeight: 1.5, opacity: .9, margin: '10px 0 0' }}>
            Hackathon competitor — building and shipping working products under pressure alongside a team, from idea to demo within the event window.
          </p>
          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ border: '1px solid var(--accent,#E4002B)', color: 'var(--accent,#E4002B)', fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>HACKATHON</span>
            <span style={{ border: '1px solid #444', fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>FULL-STACK</span>
            <span style={{ border: '1px solid #444', fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>TEAMWORK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
