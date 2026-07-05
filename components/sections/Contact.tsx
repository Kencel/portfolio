import { AngularCard } from '@/components/AngularCard';
import { COLOR } from '@/lib/tokens';

// PROTOTYPE lines 272-287
export function Contact() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16, maxWidth: 1000, marginLeft: 'auto', marginRight: 'auto' }}>
      <AngularCard style={{ transform: 'skewX(-4deg)' }}>
        <a href="https://codeforces.com/profile/RamenNagi" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#F4F1EA', background: '#141212', padding: '22px 24px', display: 'block' }}>
          <div style={{ transform: 'skewX(4deg)' }}>
            <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.2em', fontSize: 15, color: '#17A2A2' }}>CODEFORCES</div>
            <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(24px,2.4vw,32px)' }}>@RamenNagi ►</div>
          </div>
        </a>
      </AngularCard>
      <AngularCard style={{ transform: 'skewX(-4deg)' }}>
        <a href="https://atcoder.jp/users/RamenNagi" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#F4F1EA', background: '#141212', padding: '22px 24px', display: 'block' }}>
          <div style={{ transform: 'skewX(4deg)' }}>
            <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.2em', fontSize: 15, color: COLOR.accent }}>ATCODER</div>
            <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(24px,2.4vw,32px)' }}>@RamenNagi ►</div>
          </div>
        </a>
      </AngularCard>
      <AngularCard style={{ transform: 'skewX(-4deg)' }}>
        <a href="https://github.com/Kencel" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#F4F1EA', background: '#141212', padding: '22px 24px', display: 'block' }}>
          <div style={{ transform: 'skewX(4deg)' }}>
            <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.2em', fontSize: 15, opacity: .8 }}>GITHUB</div>
            <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(24px,2.4vw,32px)' }}>@Kencel ►</div>
          </div>
        </a>
      </AngularCard>
      <AngularCard style={{ transform: 'skewX(-4deg)' }}>
        <div style={{ color: '#F4F1EA', background: '#141212', padding: '22px 24px' }}>
          <div style={{ transform: 'skewX(4deg)' }}>
            <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.2em', fontSize: 15, color: '#5865F2' }}>DISCORD</div>
            <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(24px,2.4vw,32px)' }}>ramen.nagi</div>
          </div>
        </div>
      </AngularCard>
    </div>
  );
}
