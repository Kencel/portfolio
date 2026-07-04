'use client';
import { useCodeforces, cmProgressPct } from '@/lib/codeforces';
import { angular } from '@/lib/angular';

// PROTOTYPE lines 159-192
export function Cp() {
  const cf = useCodeforces();
  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 18, marginBottom: 24 }}>
        <div style={{ background: '#141212', padding: '22px 24px', transform: 'skewX(-3deg)', ...angular(0) }}>
          <div style={{ transform: 'skewX(3deg)' }}>
            <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.18em', fontSize: 15, color: '#17A2A2' }}>CODEFORCES · RATING</div>
            <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(44px,5vw,66px)', lineHeight: .9 }}>{cf.rating}</div>
            <div style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: 16, opacity: .8 }}>Peak <b style={{ color: '#17A2A2' }}>{cf.maxRating} · {cf.rank}</b> · @RamenNagi</div>
          </div>
        </div>
        <div style={{ background: '#141212', padding: '22px 24px', transform: 'skewX(-3deg)', ...angular(1) }}>
          <div style={{ transform: 'skewX(3deg)' }}>
            <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.18em', fontSize: 15, color: 'var(--accent,#E4002B)' }}>TOTAL · SOLVED</div>
            <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(44px,5vw,66px)', lineHeight: .9 }}>472</div>
            <div style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: 16, opacity: .8 }}>problems all-time</div>
          </div>
        </div>
        <div style={{ background: '#141212', padding: '22px 24px', transform: 'skewX(-3deg)', ...angular(2) }}>
          <div style={{ transform: 'skewX(3deg)' }}>
            <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.18em', fontSize: 15 }}>ATCODER</div>
            <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(30px,3vw,42px)', lineHeight: 1, marginTop: 8 }}>@RamenNagi</div>
            <div style={{ fontFamily: "var(--font-oswald), sans-serif", fontSize: 16, opacity: .8 }}>active competitor</div>
          </div>
        </div>
      </div>
      <div style={{ background: '#141212', padding: '24px 26px', transform: 'skewX(-1.5deg)', maxWidth: 760, ...angular(3) }}>
        <div style={{ transform: 'skewX(1.5deg)' }}>
          <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.2em', fontSize: 16, color: 'var(--accent,#E4002B)', marginBottom: 14 }}>CLIMB TO CANDIDATE MASTER</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "var(--font-oswald), sans-serif", fontSize: 15, marginBottom: 5 }}>
            <span>Newbie</span><span>Pupil</span><span style={{ color: '#17A2A2', fontWeight: 600 }}>▲ Specialist</span><span>Expert</span><span>CM</span>
          </div>
          <div style={{ height: 16, background: '#1c1a1a', border: '1px solid #333' }}>
            <div style={{ height: '100%', width: cmProgressPct(cf.rating) + '%', background: 'linear-gradient(90deg,#808080,#17A2A2)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
