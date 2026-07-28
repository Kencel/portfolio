import { AngularCard } from '@/components/AngularCard';
import { AttributesRadar } from '@/components/AttributesRadar';
import { EducationCard } from '@/components/EducationCard';
import { COLOR, FONT } from '@/lib/tokens';

// PROTOTYPE lines 135-156
export function About() {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 22, maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' }}>
        <AngularCard seed={21} style={{ transform: 'skewX(-2deg)' }}>
          <div style={{ background: COLOR.panel, padding: '26px 28px' }}>
            <div style={{ transform: 'skewX(2deg)' }}>
              <p style={{ fontFamily: FONT.oswald, fontWeight: 300, fontSize: 'clamp(16px,1.4vw,21px)', lineHeight: 1.55, margin: '0 0 16px' }}>
                I&apos;m a third-year Computer Science student at the <b style={{ color: COLOR.accent }}>Ateneo de Manila University</b>, and most of my time goes to competitive programming. I write contest solutions in <b>C++ and Python</b>. What keeps me there is the part where a messy problem turns into something short and correct.
              </p>
              <p style={{ fontFamily: FONT.oswald, fontWeight: 300, fontSize: 'clamp(16px,1.4vw,21px)', lineHeight: 1.55, margin: 0 }}>
                Lately I've been putting more of that time into <b>AI/ML and data science</b>, and into actually building things rather than only solving problems. This site is my first passion project. My team also took <b>Yardshtick</b>, a listings app, to 3rd place at an OpenAI buildathon in Manila. On the web I work in <b>Next.js</b>.
              </p>
            </div>
          </div>
        </AngularCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AngularCard seed={22} style={{ transform: 'skewX(-4deg)' }}>
            <div style={{ background: COLOR.accent, color: COLOR.base, padding: '18px 22px' }}>
              <div style={{ transform: 'skewX(4deg)' }}>
                <div style={{ fontFamily: FONT.bebas, letterSpacing: '.2em', fontSize: 15 }}>CLASS</div>
                <div style={{ fontFamily: FONT.anton, fontSize: 'clamp(24px,2.4vw,34px)', lineHeight: 1 }}>COMPETITIVE PROGRAMMER</div>
              </div>
            </div>
          </AngularCard>
          <AngularCard seed={23} style={{ transform: 'skewX(-4deg)' }}>
            <div style={{ background: COLOR.panel, padding: '18px 22px' }}>
              <div style={{ transform: 'skewX(4deg)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT.oswald, fontSize: 17 }}><span style={{ opacity: .7 }}>Year</span><b>3rd Year · Ateneo</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT.oswald, fontSize: 17 }}><span style={{ opacity: .7 }}>Focus</span><b>Problem Solving · AI/ML</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT.oswald, fontSize: 17 }}><span style={{ opacity: .7 }}>Languages</span><b>C++ · Python</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT.oswald, fontSize: 17 }}><span style={{ opacity: .7 }}>Web</span><b>Next.js · React</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT.oswald, fontSize: 17 }}><span style={{ opacity: .7 }}>Based in</span><b>Philippines</b></div>
              </div>
            </div>
          </AngularCard>
        </div>
      </div>
      {/* The radar tops out at 340px wide, so on its own it left a lot of dead
          panel either side — education shares the row with it now. */}
      <div data-testid="about-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 22, maxWidth: 1200, marginTop: 22, marginLeft: 'auto', marginRight: 'auto' }}>
        <AngularCard seed={24} style={{ transform: 'skewX(-2deg)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: COLOR.panel, padding: '26px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ transform: 'skewX(2deg)' }}>
              <div style={{ fontFamily: FONT.bebas, letterSpacing: '.2em', fontSize: 15, opacity: .7, marginBottom: 8, textAlign: 'center' }}>
                ATTRIBUTES
              </div>
              <AttributesRadar />
            </div>
          </div>
        </AngularCard>
        <AngularCard seed={25} style={{ transform: 'skewX(-2deg)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: COLOR.panel, padding: '26px 24px', flex: 1 }}>
            <div style={{ transform: 'skewX(2deg)' }}>
              <div style={{ fontFamily: FONT.bebas, letterSpacing: '.2em', fontSize: 15, opacity: .7, marginBottom: 14, textAlign: 'center' }}>
                EDUCATION
              </div>
              <EducationCard />
            </div>
          </div>
        </AngularCard>
      </div>
    </>
  );
}
