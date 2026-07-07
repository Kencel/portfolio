'use client';
import { useState } from 'react';
import { AngularCard } from '@/components/AngularCard';
import { SkewBox } from '@/components/ui/SkewBox';
import { COLOR, FONT, POP } from '@/lib/tokens';
import { formatMonthYear, type Competition } from '@/lib/competitions';

const themedLine = {
  fontFamily: FONT.bebas, letterSpacing: '.2em', fontSize: 22,
  color: COLOR.ink, opacity: .75, textAlign: 'center' as const, padding: '40px 0',
};

export function CompetitionsList({ competitions }: { competitions: Competition[] }) {
  // Competition whose certificate is open in the modal; null = closed.
  const [cert, setCert] = useState<Competition | null>(null);
  if (competitions.length === 0) {
    return <p style={themedLine}>NO BATTLE RECORDS YET — CHECK BACK SOON</p>;
  }
  return (
    <>
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
                <button onClick={() => setCert(c)}
                  style={{ display: 'inline-block', marginTop: 12, fontFamily: FONT.bebas, letterSpacing: '.14em', fontSize: 14, color: COLOR.base, background: COLOR.ink, padding: '4px 12px', border: 'none', cursor: 'pointer' }}>
                  VIEW CERTIFICATE ►
                </button>
              )}
            </div>
          </div>
        </AngularCard>
      ))}
    </div>
    {cert?.certImageUrl && (
      <div data-testid="cert-backdrop" onClick={() => setCert(null)}
        style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div role="dialog" aria-modal="true" aria-label={`${cert.name} certificate`} onClick={e => e.stopPropagation()}
          style={{ position: 'relative' }}>
          {/* bigger black plate behind, skewed opposite to the red frame */}
          <div aria-hidden style={{ position: 'absolute', inset: '-18px -26px', transform: 'skewX(4deg)', background: COLOR.base, boxShadow: POP.black }} />
          <SkewBox deg={-4} style={{ position: 'relative', background: COLOR.accent, boxShadow: POP.rowBase, padding: 16 }}>
            <img src={cert.certImageUrl} alt={`${cert.name} certificate`}
              style={{ display: 'block', maxWidth: 'min(84vw, 880px)', maxHeight: '76vh' }} />
          </SkewBox>
          <button aria-label="CLOSE" onClick={() => setCert(null)}
            style={{ position: 'absolute', top: -32, right: -34, zIndex: 1, background: COLOR.base, color: COLOR.ink, border: `2px solid ${COLOR.ink}`, fontFamily: FONT.bebas, fontSize: 18, lineHeight: 1, padding: '7px 11px', cursor: 'pointer', transform: 'skewX(-4deg)' }}>
            ✕
          </button>
        </div>
      </div>
    )}
    </>
  );
}
