'use client';
import { useCodeforces, cmProgressPct } from '@/lib/codeforces';
import { AngularCard } from '@/components/AngularCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { COLOR, FONT } from '@/lib/tokens';

// PROTOTYPE lines 159-192
export function Cp() {
  const cf = useCodeforces();
  return (
    <div style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 18, marginBottom: 24 }}>
        <AngularCard style={{ transform: 'skewX(-3deg)' }}>
          <div style={{ background: COLOR.panel, padding: '22px 24px' }}>
            <div style={{ transform: 'skewX(3deg)' }}>
              <div style={{ fontFamily: FONT.bebas, letterSpacing: '.18em', fontSize: 15, color: COLOR.cfteal }}>CODEFORCES · RATING</div>
              <div style={{ fontFamily: FONT.anton, fontSize: 'clamp(44px,5vw,66px)', lineHeight: .9 }}>{cf.rating}</div>
              <div style={{ fontFamily: FONT.oswald, fontSize: 16, opacity: .8 }}>Peak <b style={{ color: COLOR.cfteal }}>{cf.maxRating} · {cf.rank}</b> · @RamenNagi</div>
            </div>
          </div>
        </AngularCard>
        <AngularCard style={{ transform: 'skewX(-3deg)' }}>
          <div style={{ background: COLOR.panel, padding: '22px 24px' }}>
            <div style={{ transform: 'skewX(3deg)' }}>
              <div style={{ fontFamily: FONT.bebas, letterSpacing: '.18em', fontSize: 15, color: COLOR.accent }}>TOTAL · SOLVED</div>
              <div style={{ fontFamily: FONT.anton, fontSize: 'clamp(44px,5vw,66px)', lineHeight: .9 }}>472</div>
              <div style={{ fontFamily: FONT.oswald, fontSize: 16, opacity: .8 }}>problems all-time</div>
            </div>
          </div>
        </AngularCard>
        <AngularCard style={{ transform: 'skewX(-3deg)' }}>
          <div style={{ background: COLOR.panel, padding: '22px 24px' }}>
            <div style={{ transform: 'skewX(3deg)' }}>
              <div style={{ fontFamily: FONT.bebas, letterSpacing: '.18em', fontSize: 15 }}>ATCODER</div>
              <div style={{ fontFamily: FONT.anton, fontSize: 'clamp(30px,3vw,42px)', lineHeight: 1, marginTop: 8 }}>@RamenNagi</div>
              <div style={{ fontFamily: FONT.oswald, fontSize: 16, opacity: .8 }}>active competitor</div>
            </div>
          </div>
        </AngularCard>
      </div>
      <AngularCard style={{ transform: 'skewX(-1.5deg)', maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ background: COLOR.panel, padding: '24px 26px' }}>
          <div style={{ transform: 'skewX(1.5deg)' }}>
            <div style={{ fontFamily: FONT.bebas, letterSpacing: '.2em', fontSize: 16, color: COLOR.accent, marginBottom: 14 }}>CLIMB TO CANDIDATE MASTER</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT.oswald, fontSize: 15, marginBottom: 5 }}>
              <span>Newbie</span><span>Pupil</span><span style={{ color: COLOR.cfteal, fontWeight: 600 }}>▲ Specialist</span><span>Expert</span><span>CM</span>
            </div>
            <ProgressBar pct={`${cmProgressPct(cf.rating)}%`} fill="linear-gradient(90deg,#808080,#17A2A2)" height={16} />
          </div>
        </div>
      </AngularCard>
    </div>
  );
}
