'use client';
import { useRef } from 'react';

export type Sfx = {
  select: () => void; confirm: () => void; back: () => void;
  hover: () => void; tap: () => void;
};

export function createSfx(getMuted: () => boolean, AudioCtx: typeof AudioContext): Sfx {
  let ctx: AudioContext | null = null;
  const ac = (): AudioContext | null => {
    if (getMuted()) return null;
    try {
      if (!ctx) ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch { return null; }
  };
  const tone = (freq: number, dur: number, type: OscillatorType, vol: number, glide?: number) => {
    const c = ac(); if (!c) return;
    const t = c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.02);
  };
  return {
    select: () => tone(1180, 0.06, 'square', 0.09),
    confirm: () => { tone(720, 0.05, 'square', 0.11); setTimeout(() => tone(1090, 0.12, 'square', 0.11, 1300), 45); },
    back: () => tone(520, 0.08, 'square', 0.10, 360),
    hover: () => tone(1500, 0.03, 'square', 0.045),
    tap: () => tone(950, 0.05, 'square', 0.07),
  };
}

export function useSfx(muted: boolean): Sfx {
  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  const ref = useRef<Sfx | null>(null);
  if (!ref.current) {
    const AC = (typeof window !== 'undefined'
      ? (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)
      : undefined) as typeof AudioContext | undefined;
    ref.current = AC ? createSfx(() => mutedRef.current, AC)
      : { select() {}, confirm() {}, back() {}, hover() {}, tap() {} };
  }
  return ref.current;
}
