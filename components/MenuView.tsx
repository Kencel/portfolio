'use client';
import { SECTIONS, type SectionId } from '@/lib/data';
import { useClock } from '@/lib/useClock';
import { ImageSlot } from './ImageSlot';
import { MenuRow } from './MenuRow';
import { RansomText } from './RansomText';
import { AngularCard } from './AngularCard';
import { COLOR, FONT, POP } from '@/lib/tokens';
import { CenterFrame } from './CenterFrame';
import { FitToViewport } from './FitToViewport';

const CODENAME = 'RAMENNAGI';

export function MenuView({ hovered, muted, onToggleMute, onEnter, onOpen, narrow, menuVisit }: {
  hovered: number | null; muted: boolean; onToggleMute: () => void;
  onEnter: (i: number) => void; onOpen: (id: SectionId) => void; narrow?: boolean; menuVisit: number;
}) {
  const { time, day } = useClock();

  // current-focus card — mirrors the AngularCard + panel shell the sections use.
  // Replaces the old CF/solved stat bars (those stats live in COMP. PROG now).
  // Copy is grounded in the About section — evergreen, no stale numbers.
  const STATUS: [string, string][] = [
    ['LEARNING', 'AI/ML & DATA SCIENCE'],
    ['BUILDING', 'THIS SITE'],
    ['GRINDING', 'COMPETITIVE PROGRAMMING'],
  ];
  const statusCard = (
    <AngularCard seed={11} style={{ width: 'min(360px,100%)', transform: 'skewX(-4deg)' }}>
    <div style={{ background: COLOR.panel, padding: '18px 22px' }}>
      <div style={{ transform: 'skewX(4deg)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {STATUS.map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontFamily: FONT.bebas, letterSpacing: '.12em', fontSize: 18 }}>
            <span style={{ color: COLOR.accent }}>{k}</span>
            <span style={{ textAlign: 'right' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
    </AngularCard>
  );

  // reusable fragments (composed differently for desktop vs narrow)
  // top-HUD controls — matched to the sections' skill-chip idiom
  // (row bg, tag border, hard POP.rowBase offset shadow, skew).
  const controlsHint = (
    <div style={{ fontFamily: FONT.bebas, letterSpacing: '.16em', fontSize: 14, display: 'inline-flex', gap: 14, background: COLOR.row, padding: '7px 14px', border: `2px solid ${COLOR.tagBorder}`, boxShadow: POP.rowBase, transform: 'skewX(-6deg)' }}>
      <span style={{ display: 'inline-flex', gap: 14, transform: 'skewX(6deg)' }}>
        <span><span style={{ color: COLOR.accent }}>↑↓</span> SELECT</span>
        <span><span style={{ color: COLOR.accent }}>Z</span> OPEN</span>
      </span>
    </div>
  );

  const muteButton = (
    <button
      onClick={onToggleMute}
      style={{
        fontFamily: FONT.bebas, border: `2px solid ${COLOR.accent}`,
        background: COLOR.row, color: COLOR.ink, padding: '7px 14px', letterSpacing: '.16em',
        fontSize: 14, transform: 'skewX(-6deg)', boxShadow: POP.rowBase, cursor: 'pointer',
      }}
    >
      {!muted ? '♪ SFX ON' : 'SFX MUTED'}
    </button>
  );

  const clockBlock = (
    <div style={{ textAlign: 'right', transform: 'skewX(-6deg)', marginRight: 'clamp(20px,7vw,120px)' }}>
      <div style={{ fontFamily: FONT.anton, fontSize: 'clamp(30px,4vw,58px)', lineHeight: .9, textShadow: '3px 3px 0 rgba(0,0,0,.9)' }}>{time}</div>
      <div style={{ fontFamily: FONT.bebas, letterSpacing: '.3em', fontSize: 'clamp(14px,1.4vw,20px)', color: COLOR.ink }}>{day} · TAKE YOUR TIME</div>
    </div>
  );

  const titleBlock = (
    <div>
      <div style={{ display: 'inline-block', fontSize: 'clamp(34px,5.4vw,82px)', lineHeight: .9, letterSpacing: '.01em', padding: '2px 0' }}>
        <RansomText text={CODENAME} />
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14, transform: 'skewX(-8deg)', flexWrap: 'wrap' }}>
        <span style={{ background: COLOR.ink, color: COLOR.accent, fontFamily: FONT.bebas, fontSize: 'clamp(15px,1.5vw,22px)', letterSpacing: '.14em', padding: '3px 12px' }}>CS · ATENEO DE MANILA</span>
        <span style={{ border: `2px solid ${COLOR.ink}`, fontFamily: FONT.bebas, fontSize: 'clamp(15px,1.5vw,22px)', letterSpacing: '.14em', padding: '2px 12px' }}>COMPETITIVE PROGRAMMER</span>
      </div>
    </div>
  );

  const menuList = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px,1vh,11px)' }}>
      {SECTIONS.map((s, i) => (
        <MenuRow key={`${s.id}-${menuVisit}`} section={s} index={i} hovered={hovered} onEnter={onEnter} onOpen={onOpen} visit={menuVisit} />
      ))}
    </div>
  );

  const avatarCluster = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, transform: 'skewX(-6deg)' }}>
      <div style={{ position: 'relative' }}>
        {/* red frame with the same hard offset pop the AngularCards use (POP.black) */}
        <div style={{ position: 'absolute', inset: -14, background: COLOR.accent, clipPath: 'polygon(14% 0, 100% 6%, 92% 100%, 0 90%)', filter: `drop-shadow(${POP.black})` }} />
        <ImageSlot
          src="/avatar.jpg"
          alt="RAMENNAGI"
          placeholder="DROP YOUR PHOTO"
          mask="polygon(14% 0, 100% 6%, 92% 100%, 0 90%)"
          style={{ width: 'clamp(220px,24vw,360px)', height: 'clamp(300px,32vw,470px)', display: 'block', position: 'relative' }}
        />
      </div>
      <AngularCard seed={12} style={{ transform: 'skewX(-2deg)' }} pop={POP.accent}>
        <div style={{ background: COLOR.panel, padding: '10px 18px', textAlign: 'center' }}>
          <div style={{ fontFamily: FONT.bebas, fontSize: 14, letterSpacing: '.24em', color: COLOR.accent }}>CODENAME</div>
          <div style={{ fontSize: 'clamp(22px,2vw,30px)', lineHeight: 1, marginTop: 4, display: 'flex', justifyContent: 'center' }}>
            <RansomText text={CODENAME} seed={1} />
          </div>
        </div>
      </AngularCard>
    </div>
  );

  return (
    // PROTOTYPE lines 49-52 — root scroll region unchanged (dynamic height, top-anchored)
    <div style={{ position: 'relative', zIndex: 5, width: '100%', minHeight: '100vh', padding: 'clamp(16px,2.5vh,44px) clamp(20px,4vw,64px)' }}>
      {narrow ? (
        // narrow: single-column stack (title → mute → menu → avatar → status)
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px,2.2vh,28px)', width: '100%' }}>
          {titleBlock}
          <div>{muteButton}</div>
          {menuList}
          <div style={{ marginTop: 'clamp(10px,2vh,20px)' }}>{avatarCluster}</div>
          {statusCard}
        </div>
      ) : (
        // desktop: centered frame — HUD strip, two columns, footer strip.
        // FitToViewport scales the whole HUD down on short viewports so the
        // menu never scrolls; at full height it renders unscaled.
        <FitToViewport>
        <CenterFrame maxWidth={1180}>
          {/* HUD top strip: controls left, mute right */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(16px,2.4vh,32px)' }}>
            {controlsHint}
            {muteButton}
          </div>

          {/* two top-aligned columns */}
          <div style={{ display: 'flex', gap: 'clamp(24px,4vw,64px)', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px,2.2vh,28px)', flex: '1 1 auto', minWidth: 0 }}>
              {titleBlock}
              {menuList}
            </div>
            <div style={{ flex: '0 0 auto' }}>
              {avatarCluster}
            </div>
          </div>

          {/* footer strip: status card left, clock right */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'clamp(20px,3vw,48px)', marginTop: 'clamp(20px,3vh,40px)' }}>
            <div style={{ flex: '1 1 auto' }}>{statusCard}</div>
            {clockBlock}
          </div>
        </CenterFrame>
        </FitToViewport>
      )}
    </div>
  );
}
