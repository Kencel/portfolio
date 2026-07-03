// PROTOTYPE lines 135-156
export function About() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 22, maxWidth: 1200 }}>
      <div style={{ background: '#141212', border: '2px solid #2a2727', padding: '26px 28px', transform: 'skewX(-2deg)' }}>
        <div style={{ transform: 'skewX(2deg)' }}>
          <p style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 300, fontSize: 'clamp(16px,1.4vw,21px)', lineHeight: 1.55, margin: '0 0 16px' }}>
            A Computer Science student at the <b style={{ color: 'var(--accent,#E4002B)' }}>Ateneo de Manila University</b> who lives at the intersection of <b>competitive programming</b> and <b>shipping real software</b>. By day I chase tighter time complexities; by night I build products at hackathons.
          </p>
          <p style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 300, fontSize: 'clamp(16px,1.4vw,21px)', lineHeight: 1.55, margin: 0 }}>
            The goal is simple: steal the win — one clean algorithm and one polished feature at a time.
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: 'var(--accent,#E4002B)', color: '#0b0a0a', padding: '18px 22px', transform: 'skewX(-4deg)' }}>
          <div style={{ transform: 'skewX(4deg)' }}>
            <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.2em', fontSize: 15 }}>RANK</div>
            <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(24px,2.4vw,34px)', lineHeight: 1 }}>SPECIALIST</div>
          </div>
        </div>
        <div style={{ background: '#141212', border: '2px solid #2a2727', padding: '18px 22px', transform: 'skewX(-4deg)' }}>
          <div style={{ transform: 'skewX(4deg)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "var(--font-oswald), sans-serif", fontSize: 17 }}><span style={{ opacity: .7 }}>Focus</span><b>Algorithms · Web</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "var(--font-oswald), sans-serif", fontSize: 17 }}><span style={{ opacity: .7 }}>Weapon</span><b>C++ &amp; Next.js</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "var(--font-oswald), sans-serif", fontSize: 17 }}><span style={{ opacity: .7 }}>Based in</span><b>Philippines</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}
