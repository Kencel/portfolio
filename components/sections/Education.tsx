import { angular } from '@/lib/angular';

// PROTOTYPE lines 248-269
export function Education() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1000 }}>
      <div style={{ background: '#141212', padding: '24px 28px', transform: 'skewX(-2deg)', ...angular(0), borderLeft: '6px solid var(--accent,#E4002B)' }}>
        <div style={{ transform: 'skewX(2deg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(24px,2.6vw,38px)' }}>ATENEO DE MANILA UNIVERSITY</span>
            <span style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.16em', color: 'var(--accent,#E4002B)', fontSize: 18 }}>BS COMPUTER SCIENCE</span>
          </div>
          <p style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 300, fontSize: 17, lineHeight: 1.5, opacity: .9, margin: '10px 0 0' }}>
            Member of <b>CompSAt</b> (Ateneo&apos;s premier CS organization). Served as a <b style={{ color: 'var(--accent,#E4002B)' }}>Trainer for Learn-2-Dev 2026</b>, teaching development fundamentals to fellow students.
          </p>
        </div>
      </div>
      <div style={{ background: '#141212', padding: '24px 28px', transform: 'skewX(-2deg)', ...angular(2), borderLeft: '6px solid #F4F1EA' }}>
        <div style={{ transform: 'skewX(2deg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(22px,2.4vw,34px)' }}>PHILIPPINE SCIENCE HS — MAIN CAMPUS</span>
            <span style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.16em', opacity: .8, fontSize: 18 }}>PSHS-MC</span>
          </div>
          <p style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 300, fontSize: 17, lineHeight: 1.5, opacity: .9, margin: '10px 0 0' }}>
            Took <b>CS5 (Data Structures &amp; Algorithms)</b> as an elective — the first spark for the competitive-programming path.
          </p>
        </div>
      </div>
    </div>
  );
}
