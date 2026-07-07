'use client';
import { AngularCard } from '@/components/AngularCard';
import { COLOR, FONT } from '@/lib/tokens';
import { formatMonthYear, type Competition } from '@/lib/competitions';

const themedLine = {
  fontFamily: FONT.bebas, letterSpacing: '.2em', fontSize: 22,
  color: COLOR.ink, opacity: .75, textAlign: 'center' as const, padding: '40px 0',
};

export function CompetitionsList({ competitions }: { competitions: Competition[] }) {
  if (competitions.length === 0) {
    return <p style={themedLine}>NO BATTLE RECORDS YET — CHECK BACK SOON</p>;
  }
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 860, marginLeft: 'auto', marginRight: 'auto' }}>
      {competitions.map(c => (
        <AngularCard key={c.id} seed={70 + c.id} style={{ transform: 'skewX(-1.5deg)' }}>
          <div style={{ background: COLOR.panel, padding: '20px 24px' }}>
            <div style={{ transform: 'skewX(1.5deg)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 12 }}>
                <span data-testid="competition-name" style={{ fontFamily: FONT.anton, fontSize: 'clamp(18px,2vw,24px)' }}>{c.name}</span>
                <span style={{ fontFamily: FONT.bebas, letterSpacing: '.18em', fontSize: 14, color: COLOR.accent }}>{formatMonthYear(c.eventDate)}</span>
                {c.team && (
                  <span style={{ fontFamily: FONT.bebas, letterSpacing: '.12em', fontSize: 14, border: `1px solid ${COLOR.tagBorder}`, padding: '2px 10px' }}>{c.team}</span>
                )}
              </div>
              <div style={{ fontFamily: FONT.oswald, fontSize: 16, marginTop: 8 }}>
                <b>{c.result}</b>
                {c.placement && c.placement !== c.result && <span style={{ opacity: .85 }}> · {c.placement}</span>}
              </div>
              {c.note && <div style={{ fontFamily: FONT.oswald, fontSize: 14, opacity: .75, marginTop: 4 }}>{c.note}</div>}
              {c.certImageUrl && (
                <a href={c.certImageUrl} target="_blank" rel="noreferrer"
                  style={{ display: 'inline-block', marginTop: 12, fontFamily: FONT.bebas, letterSpacing: '.14em', fontSize: 14, color: COLOR.base, background: COLOR.ink, padding: '4px 12px' }}>
                  VIEW CERTIFICATE ►
                </a>
              )}
            </div>
          </div>
        </AngularCard>
      ))}
    </div>
  );
}
