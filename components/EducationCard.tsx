import { COLOR, FONT } from '@/lib/tokens';

// Was its own menu section; it now sits beside the attributes radar in ABOUT
// ME, so the school/degree pair stacks instead of sharing a baseline — the
// column is roughly half the width the old full-bleed panel had.
function Entry({ school, tag, children }: {
  school: string; tag: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ fontFamily: FONT.bebas, letterSpacing: '.16em', fontSize: 16, color: COLOR.accent }}>{tag}</div>
      <div style={{ fontFamily: FONT.anton, fontSize: 'clamp(19px,1.8vw,26px)', lineHeight: 1.05, marginTop: 3 }}>{school}</div>
      <p style={{ fontFamily: FONT.oswald, fontWeight: 300, fontSize: 16, lineHeight: 1.5, opacity: .9, margin: '8px 0 0' }}>
        {children}
      </p>
    </div>
  );
}

export function EducationCard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Entry school="ATENEO DE MANILA UNIVERSITY" tag="BS COMPUTER SCIENCE">
        Member of <b>CompSAt</b>, Ateneo&apos;s computer science organization. Served as a{' '}
        <b style={{ color: COLOR.accent }}>Trainer for Learn-2-Dev 2026</b> and taught development
        fundamentals to other students.
      </Entry>
      <div style={{ height: 3, background: COLOR.accent, opacity: .55, transform: 'skewX(-40deg)', width: '70%' }} />
      <Entry school="PHILIPPINE SCIENCE HS — MAIN CAMPUS" tag="PSHS-MC">
        Took <b>CS5 (Data Structures &amp; Algorithms)</b> as an elective. That class is where the
        competitive programming started.
      </Entry>
    </div>
  );
}
