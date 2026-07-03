import { angular } from '@/lib/angular';

// PROTOTYPE lines 272-287
export function Contact() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16, maxWidth: 1000 }}>
      <a href="https://codeforces.com/profile/RamenNagi" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#F4F1EA', background: '#141212', padding: '22px 24px', transform: 'skewX(-4deg)', display: 'block', ...angular(1) }}>
        <div style={{ transform: 'skewX(4deg)' }}>
          <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.2em', fontSize: 15, color: '#17A2A2' }}>CODEFORCES</div>
          <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(24px,2.4vw,32px)' }}>@RamenNagi ►</div>
        </div>
      </a>
      <a href="https://atcoder.jp/users/RamenNagi" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#F4F1EA', background: '#141212', padding: '22px 24px', transform: 'skewX(-4deg)', display: 'block', ...angular(1) }}>
        <div style={{ transform: 'skewX(4deg)' }}>
          <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.2em', fontSize: 15, color: 'var(--accent,#E4002B)' }}>ATCODER</div>
          <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(24px,2.4vw,32px)' }}>@RamenNagi ►</div>
        </div>
      </a>
      <a href="https://github.com/Kencel" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#F4F1EA', background: '#141212', padding: '22px 24px', transform: 'skewX(-4deg)', display: 'block', ...angular(1) }}>
        <div style={{ transform: 'skewX(4deg)' }}>
          <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.2em', fontSize: 15, opacity: .8 }}>GITHUB</div>
          <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(24px,2.4vw,32px)' }}>@Kencel ►</div>
        </div>
      </a>
      <div style={{ color: '#F4F1EA', background: '#141212', padding: '22px 24px', transform: 'skewX(-4deg)', ...angular(3) }}>
        <div style={{ transform: 'skewX(4deg)' }}>
          <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.2em', fontSize: 15, color: '#5865F2' }}>DISCORD</div>
          <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(24px,2.4vw,32px)' }}>ramen.nagi</div>
        </div>
      </div>
    </div>
  );
}
