'use client';
import { useEffect, useRef, useState } from 'react';
import { RansomText } from './RansomText';

export const SPIN_MS = 1900;
export const REVEAL_MS = 1100;
export const FADE_MS = 300;

type Phase = 'spin' | 'reveal' | 'fade';

const INK = '#0b0a0a';
const BONE = '#F4F1EA';

// Monochrome ransom tiles — the splash allows no crimson.
const MONO_TILES: ReadonlyArray<readonly [string, string]> = [
  [BONE, INK],
  [INK, BONE],
];

// Bowl silhouette in a 200x200 box: lower hemisphere (r=72) plus the rim
// ellipse top. Doubles as the reveal hole, so it must stay a closed path.
const BOWL_SILHOUETTE = 'M28 88 A72 72 0 0 0 172 88 A72 14 0 0 0 28 88 Z';
const BOWL_FOOT = 'M84 150 h32 v20 h-32 Z';

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// The spinning splash art: bone bowl, ink band, chopsticks, noodles, steam.
function RamenBowl() {
  return (
    <svg width="180" height="180" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <clipPath id="p5splash-bowl-clip"><path d="M28 88 A72 72 0 0 0 172 88 Z" /></clipPath>
      </defs>
      {/* steam */}
      <path d="M78 44 q6 -10 0 -20 q-5 -9 2 -16" fill="none" stroke='#F4F1EA' strokeWidth="6" strokeLinecap="square" opacity=".75" />
      <path d="M116 48 q6 -10 0 -20 q-5 -9 2 -16" fill="none" stroke='#F4F1EA' strokeWidth="6" strokeLinecap="square" opacity=".55" />
      {/* chopsticks, leaning out of the bowl */}
      <rect x="120" y="6" width="7" height="86" rx="2" transform="rotate(24 123 49)" fill='#F4F1EA' stroke='#0b0a0a' strokeWidth="3" />
      <rect x="136" y="12" width="7" height="82" rx="2" transform="rotate(31 139 53)" fill='#F4F1EA' stroke='#0b0a0a' strokeWidth="3" />
      {/* foot, then bowl body over it */}
      <path d='M84 150 h32 v20 h-32 Z' fill='#F4F1EA' stroke='#0b0a0a' strokeWidth="5" />
      <path d="M28 88 A72 72 0 0 0 172 88 Z" fill='#F4F1EA' stroke='#0b0a0a' strokeWidth="5" />
      {/* rim + broth + noodles + narutomaki */}
      <ellipse cx="100" cy="88" rx="72" ry="14" fill='#F4F1EA' stroke='#0b0a0a' strokeWidth="5" />
      <ellipse cx="100" cy="88" rx="58" ry="9" fill='#0b0a0a' />
      <path d="M52 88 q12 -8 24 0 t24 0 t24 0 t24 0" fill="none" stroke='#F4F1EA' strokeWidth="4" />
    </svg>
  );
}

/**
 * P5R-style boot splash. A timer-driven phase machine owns the transitions
 * (spin -> reveal -> onDone; fade -> onDone under reduced motion); the CSS
 * animations are purely presentational so jsdom tests can drive it with
 * fake timers.
 */
export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('spin');
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Reduced-motion swap happens in an effect, not the initializer: the server
  // always renders the spin tree, so hydration must produce it too.
  useEffect(() => { if (prefersReducedMotion()) setPhase('fade'); }, []);

  useEffect(() => {
    const ms = phase === 'spin' ? SPIN_MS : phase === 'reveal' ? REVEAL_MS : FADE_MS;
    const t = window.setTimeout(() => {
      if (phase === 'spin') setPhase('reveal');
      else onDoneRef.current();
    }, ms);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Lock document scroll while the splash is up: the page's crimson
  // scrollbar would otherwise sit beside the monochrome splash frame.
  useEffect(() => {
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = 'hidden';
    return () => { el.style.overflow = prev; };
  }, []);

  // Any key or click during the spin skips ahead to the reveal.
  useEffect(() => {
    if (phase !== 'spin') return;
    const skip = () => setPhase('reveal');
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [phase]);

  if (phase === 'reveal') {
    return (
      <div data-splash-phase="reveal" role="presentation" aria-hidden="true"
        style={{ position: 'fixed', inset: 0, zIndex: 100, overflow: 'hidden' }}>
        {/* Ink sheet with a bowl-shaped hole; scaling it 30x makes the hole
            swallow the viewport. slice + xMidYMid pins the hole to screen
            center, which is also the transform origin. */}
        <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice"
          style={{ position: 'absolute', inset: 0, transformOrigin: '50% 50%',
            animation: `p5splashReveal ${REVEAL_MS}ms cubic-bezier(.55,0,.85,.35) both` }}>
          <defs>
            <mask id="p5splash-hole">
              <rect x="-2900" y="-2900" width="6000" height="6000" fill="#fff" />
              <g transform="translate(100 100) scale(.28) translate(-100 -122)">
                <path d={BOWL_SILHOUETTE} fill="#000" />
                <path d={BOWL_FOOT} fill="#000" />
              </g>
            </mask>
          </defs>
          <rect x="-2900" y="-2900" width="6000" height="6000" fill={INK} mask="url(#p5splash-hole)" />
        </svg>
      </div>
    );
  }

  if (phase === 'fade') {
    return (
      <div data-splash-phase="fade" role="presentation" aria-hidden="true"
        style={{ position: 'fixed', inset: 0, zIndex: 100, background: INK, pointerEvents: 'none',
          animation: `p5splashFadeOut ${FADE_MS}ms ease-out both` }} />
    );
  }

  return (
    <div data-splash-phase="spin" role="presentation" aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: INK, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28,
        cursor: 'pointer', userSelect: 'none' }}>
      <div style={{ animation: `p5splashSpin ${SPIN_MS}ms cubic-bezier(.22,.9,.3,1) both` }}>
        {/* Keyframes hold the final ~16% as an intentional settle beat before reveal. */}
        <RamenBowl />
      </div>
      <div style={{ fontSize: 'clamp(20px, 3.4vw, 34px)', animation: 'p5pulse 1.6s ease-in-out infinite' }}>
        <RansomText text="TAKE YOUR TIME" seed={42} tiles={MONO_TILES} />
      </div>
    </div>
  );
}
