'use client';
import { SECTIONS, SOLVED, type SectionId } from '@/lib/data';
import { useCodeforces, cmProgressPct } from '@/lib/codeforces';
import { useClock } from '@/lib/useClock';
import { ImageSlot } from './ImageSlot';
import { MenuRow } from './MenuRow';
import { RansomText } from './RansomText';
import { AngularCard } from './AngularCard';
import { ACCENT_POP } from '@/lib/angular';

const CODENAME = 'RAMENNAGI';

export function MenuView({ hovered, muted, onToggleMute, onEnter, onOpen, narrow }: {
  hovered: number | null; muted: boolean; onToggleMute: () => void;
  onEnter: (i: number) => void; onOpen: (id: SectionId) => void; narrow?: boolean;
}) {
  const cf = useCodeforces();
  const { time, day } = useClock();

  // status bars — PROTOTYPE lines 75-84 (shared between desktop in-column and narrow flow placements)
  const statusBars = (
    <AngularCard style={{ width: 'min(360px,100%)' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: '#141212', padding: '16px 20px' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.16em', fontSize: 14, marginBottom: 2 }}>
          <span>CF RATING</span>
          <span style={{ color: 'var(--accent,#E4002B)' }}>{cf.rating} / MAX {cf.maxRating}</span>
        </div>
        <div style={{ height: 11, background: '#1c1a1a', transform: 'skewX(-18deg)', border: '1px solid #333' }}>
          <div style={{ height: '100%', width: cmProgressPct(cf.rating) + '%', background: 'var(--accent,#E4002B)' }} />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.16em', fontSize: 14, marginBottom: 2 }}>
          <span>PROBLEMS SOLVED</span>
          <span style={{ color: '#F4F1EA' }}>{SOLVED}</span>
        </div>
        <div style={{ height: 11, background: '#1c1a1a', transform: 'skewX(-18deg)', border: '1px solid #333' }}>
          <div style={{ height: '100%', width: '72%', background: '#F4F1EA' }} />
        </div>
      </div>
    </div>
    </AngularCard>
  );

  return (
    // PROTOTYPE lines 49-52
    <div style={{ position: 'relative', zIndex: 5, width: '100%', height: narrow ? 'auto' : '100vh', overflowY: 'auto', padding: 'clamp(20px,4vw,64px)' }}>

      {/* top-left title + menu column — PROTOTYPE line 52 */}
      <div style={narrow
        ? { position: 'static', zIndex: 6, display: 'flex', flexDirection: 'column', gap: 'clamp(14px,2.2vh,28px)', width: '100%' }
        : { position: 'absolute', top: 'clamp(18px,3vw,46px)', left: 'clamp(24px,4vw,60px)', bottom: 'clamp(20px,3vw,44px)', zIndex: 6, display: 'flex', flexDirection: 'column', gap: 'clamp(14px,2.2vh,28px)', width: 'min(66vw,780px)' }}>
        <div>
          {/* title block — ransom-note hero */}
          <div style={{ display: 'inline-block', fontSize: 'clamp(34px,5.4vw,82px)', lineHeight: .9, letterSpacing: '.01em', padding: '2px 0' }}>
            <RansomText text={CODENAME} />
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14, transform: 'skewX(-8deg)', flexWrap: 'wrap' }}>
            <span style={{ background: 'var(--accent,#E4002B)', color: '#0b0a0a', fontFamily: "var(--font-bebas), sans-serif", fontSize: 'clamp(15px,1.5vw,22px)', letterSpacing: '.14em', padding: '3px 12px' }}>CS · ATENEO DE MANILA</span>
            <span style={{ border: '2px solid #F4F1EA', fontFamily: "var(--font-bebas), sans-serif", fontSize: 'clamp(15px,1.5vw,22px)', letterSpacing: '.14em', padding: '2px 12px' }}>COMPETITIVE PROGRAMMER</span>
          </div>
          {narrow && (
            <button
              onClick={onToggleMute}
              style={{
                fontFamily: 'var(--font-bebas), sans-serif', border: '2px solid var(--accent,#E4002B)',
                background: '#0b0a0a', color: '#F4F1EA', padding: '6px 12px', letterSpacing: '.16em',
                fontSize: 14, transform: 'skewX(-6deg)', cursor: 'pointer', marginTop: 14,
              }}
            >
              {!muted ? '♪ SFX ON' : 'SFX MUTED'}
            </button>
          )}
        </div>

        {/* menu list — PROTOTYPE lines 62-72 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px,1vh,11px)' }}>
          {SECTIONS.map((s, i) => (
            <MenuRow key={s.id} section={s} index={i} hovered={hovered} onEnter={onEnter} onOpen={onOpen} />
          ))}
        </div>

        {!narrow && <div style={{ marginTop: 'auto' }}>{statusBars}</div>}
      </div>

      {/* avatar / right cluster — PROTOTYPE lines 88-97 */}
      <div style={narrow
        ? { position: 'static', zIndex: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, transform: 'skewX(-6deg)', marginTop: 'clamp(24px,4vh,40px)' }
        : { position: 'absolute', right: 'clamp(20px,4vw,70px)', top: '50%', transform: 'translateY(-52%) skewX(-6deg)', zIndex: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -14, background: 'var(--accent,#E4002B)', clipPath: 'polygon(14% 0, 100% 6%, 92% 100%, 0 90%)' }} />
          <ImageSlot
            src="/avatar.jpg"
            alt="RAMENNAGI"
            placeholder="DROP YOUR PHOTO"
            mask="polygon(14% 0, 100% 6%, 92% 100%, 0 90%)"
            style={{ width: 'clamp(220px,24vw,360px)', height: 'clamp(300px,32vw,470px)', display: 'block', position: 'relative' }}
          />
        </div>
        <AngularCard style={{ transform: 'skewX(-2deg)' }} pop={ACCENT_POP}>
          <div style={{ background: '#141212', padding: '10px 18px', textAlign: 'center' }}>
            <div style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 14, letterSpacing: '.24em', color: 'var(--accent,#E4002B)' }}>CODENAME</div>
            <div style={{ fontSize: 'clamp(22px,2vw,30px)', lineHeight: 1, marginTop: 4, display: 'flex', justifyContent: 'center' }}>
              <RansomText text={CODENAME} seed={1} />
            </div>
          </div>
        </AngularCard>
      </div>

      {/* narrow flow order: title → menu → avatar → status bars */}
      {narrow && <div style={{ marginTop: 'clamp(24px,4vh,40px)' }}>{statusBars}</div>}

      {!narrow && (
        <>
          {/* bottom-right clock — PROTOTYPE lines 100-103 */}
          <div style={{ position: 'absolute', bottom: 'clamp(22px,3vw,46px)', right: 'clamp(24px,4vw,70px)', zIndex: 7, textAlign: 'right', transform: 'skewX(-6deg)' }}>
            <div style={{ fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(30px,4vw,58px)', lineHeight: .9, textShadow: '3px 3px 0 var(--accent,#E4002B)' }}>{time}</div>
            <div style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.3em', fontSize: 'clamp(14px,1.4vw,20px)', color: 'var(--accent,#E4002B)' }}>{day} · TAKE YOUR TIME</div>
          </div>

          {/* controls hint — PROTOTYPE lines 106-109 */}
          <div style={{ position: 'absolute', top: 'clamp(22px,3vw,42px)', right: 'clamp(24px,4vw,70px)', zIndex: 7, fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.16em', fontSize: 14, opacity: .75, display: 'flex', gap: 14 }}>
            <span><span style={{ color: 'var(--accent,#E4002B)' }}>↑↓ / 1-6</span> SELECT</span>
            <span><span style={{ color: 'var(--accent,#E4002B)' }}>ENTER</span> OPEN</span>
          </div>

          {/* mute button — wiring addition, not in static prototype */}
          <button
            onClick={onToggleMute}
            style={{
              fontFamily: 'var(--font-bebas), sans-serif', border: '2px solid var(--accent,#E4002B)',
              background: '#0b0a0a', color: '#F4F1EA', padding: '6px 12px', letterSpacing: '.16em',
              fontSize: 14, transform: 'skewX(-6deg)', cursor: 'pointer',
              position: 'absolute', top: 'clamp(52px,6vw,86px)', right: 'clamp(24px,4vw,70px)', zIndex: 7,
            }}
          >
            {!muted ? '♪ SFX ON' : 'SFX MUTED'}
          </button>
        </>
      )}
    </div>
  );
}
