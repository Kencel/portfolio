import { AngularCard } from '@/components/AngularCard';
import { AttributesRadar } from '@/components/AttributesRadar';
import { COLOR } from '@/lib/tokens';

// PROTOTYPE lines 135-156
export function About() {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 22, maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' }}>
        <AngularCard style={{ transform: 'skewX(-2deg)' }}>
          <div style={{ background: '#141212', padding: '26px 28px' }}>
            <div style={{ transform: 'skewX(2deg)' }}>
              <p style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 300, fontSize: 'clamp(16px,1.4vw,21px)', lineHeight: 1.55, margin: '0 0 16px' }}>
                A third-year Computer Science student at the <b style={{ color: COLOR.accent }}>Ateneo de Manila University</b>, in it for the problem-solving. Competitive programming enthusiast. Chasing cleaner logic and tighter solutions for the thrill of the solve with <b>C++ and Python</b>.
              </p>
              <p style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 300, fontSize: 'clamp(16px,1.4vw,21px)', lineHeight: 1.55, margin: 0 }}>
                Lately I've been pointing that same drive toward <b>AI/ML and data science</b>, and toward actually building things, starting with this site, my first passion project. On the web, I work in <b>Next.js and React</b>.
              </p>
            </div>
          </div>
        </AngularCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AngularCard style={{ transform: 'skewX(-4deg)' }}>
            <div style={{ background: COLOR.accent, color: '#0b0a0a', padding: '18px 22px' }}>
              <div style={{ transform: 'skewX(4deg)' }}>
                <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.2em', fontSize: 15 }}>CLASS</div>
                <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(24px,2.4vw,34px)', lineHeight: 1 }}>COMPETITIVE PROGRAMMER</div>
              </div>
            </div>
          </AngularCard>
          <AngularCard style={{ transform: 'skewX(-4deg)' }}>
            <div style={{ background: '#141212', padding: '18px 22px' }}>
              <div style={{ transform: 'skewX(4deg)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "var(--font-oswald), sans-serif", fontSize: 17 }}><span style={{ opacity: .7 }}>Year</span><b>3rd Year · Ateneo</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "var(--font-oswald), sans-serif", fontSize: 17 }}><span style={{ opacity: .7 }}>Focus</span><b>Problem Solving · AI/ML</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "var(--font-oswald), sans-serif", fontSize: 17 }}><span style={{ opacity: .7 }}>Languages</span><b>C++ · Python</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "var(--font-oswald), sans-serif", fontSize: 17 }}><span style={{ opacity: .7 }}>Web</span><b>Next.js · React</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "var(--font-oswald), sans-serif", fontSize: 17 }}><span style={{ opacity: .7 }}>Based in</span><b>Philippines</b></div>
              </div>
            </div>
          </AngularCard>
        </div>
      </div>
      <div style={{ maxWidth: 1200, marginTop: 22, marginLeft: 'auto', marginRight: 'auto' }}>
        <AngularCard style={{ transform: 'skewX(-2deg)' }}>
          <div style={{ background: '#141212', padding: '26px 24px' }}>
            <div style={{ transform: 'skewX(2deg)' }}>
              <div style={{ fontFamily: 'var(--font-bebas), sans-serif', letterSpacing: '.2em', fontSize: 15, opacity: .7, marginBottom: 8, textAlign: 'center' }}>
                ATTRIBUTES
              </div>
              <AttributesRadar />
            </div>
          </div>
        </AngularCard>
      </div>
    </>
  );
}
