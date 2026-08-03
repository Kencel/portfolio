'use client';
import { useEffect, useRef, useState } from 'react';
import { COLOR } from '@/lib/tokens';
import { RansomText } from './RansomText';
import { RamenIcon, BowlSilhouette, BOWL_CENTER, BOWL_ORIGIN } from './RamenIcon';

export const SPIN_MS = 1900;
export const REVEAL_MS = 1100;
export const FADE_MS = 300;

type Phase = 'spin' | 'reveal' | 'fade';

const INK = COLOR.base;
const BONE = COLOR.ink;

// Monochrome ransom tiles — the splash allows no crimson.
const MONO_TILES: ReadonlyArray<readonly [string, string]> = [
  [BONE, INK],
  [INK, BONE],
];

// Start size of the hole: the bowl silhouette (123 art units wide) shrunk into
// ~25 units of the reveal's 200x200 viewBox. Sized against the spin it follows
// — the spun bowl ends ~126px wide, and 0.224 here would match that exactly on
// a typical desktop — so sitting just under it lets the hole read as growing
// out of the bowl rather than popping open wider than it. Paired with the
// scale(49) end of p5splashReveal, which is raised from 30 by the same factor
// this was lowered, so the hole still ends up swallowing the viewport.
const HOLE_SCALE = 0.2;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
        {/* Ink sheet with a bowl-shaped hole; scaling it 49x makes the hole
            swallow the viewport. slice + xMidYMid pins the hole to screen
            center, which is also the transform origin. */}
        <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice"
          style={{ position: 'absolute', inset: 0, transformOrigin: '50% 50%',
            animation: `p5splashReveal ${REVEAL_MS}ms cubic-bezier(.55,0,.85,.35) both` }}>
          <defs>
            <mask id="p5splash-hole">
              <rect x="-2900" y="-2900" width="6000" height="6000" fill="#fff" />
              <g transform={`translate(100 100) scale(${HOLE_SCALE}) translate(${-BOWL_CENTER.x} ${-BOWL_CENTER.y})`}>
                <BowlSilhouette fill="#000" />
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
      <div style={{ transformOrigin: BOWL_ORIGIN,
        animation: `p5splashSpin ${SPIN_MS}ms cubic-bezier(.22,.9,.3,1) both` }}>
        {/* Keyframes hold the final ~16% as an intentional settle beat before reveal. */}
        <RamenIcon />
      </div>
      <div style={{ fontSize: 'clamp(20px, 3.4vw, 34px)', animation: 'p5pulse 1.6s ease-in-out infinite' }}>
        <RansomText text="TAKE YOUR TIME" seed={42} tiles={MONO_TILES} />
      </div>
    </div>
  );
}
