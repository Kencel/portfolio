'use client';
import { useId, type CSSProperties, type ReactNode } from 'react';
import { POP } from '@/lib/tokens';

// Stable per-instance seed from useId (matches on server + client, so the
// randomised corners never cause a hydration mismatch).
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}
function rand(seed: number): number {
  const x = Math.sin(seed * 99991.7) * 10000;
  return x - Math.floor(x);
}

// A quadrilateral — exactly one vertex per corner — with a small deterministic
// inward offset on each corner, so the white frame is a slightly-off quad that
// differs from the rectangular content. Every offset stays <= the frame padding,
// so the white still fully encases the content, and the clip only ever removes
// from the element's own box, so it never bleeds into a neighbour.
function quadClip(seed: number, maxOff: number): string {
  const o = (k: number) => (rand(seed * 8 + k + 1) * maxOff).toFixed(1) + 'px';
  return `polygon(${o(0)} ${o(1)}, calc(100% - ${o(2)}) ${o(3)}, calc(100% - ${o(4)}) calc(100% - ${o(5)}), ${o(6)} calc(100% - ${o(7)}))`;
}

/**
 * White calling-card frame behind a container. It's a thin (default 7px) white
 * border that ENCASES the content, clipped to a slightly-irregular quadrilateral
 * so its shape differs a touch from the content's rectangle. The pop lives in a
 * `filter` drop-shadow (clip-path hides box-shadow). A skew passed via `style`
 * skews the whole frame, keeping it aligned with the content it wraps.
 */
export function AngularCard({
  children,
  pop = POP.black,
  frame = 7,
  seed,
  style,
  onClick,
  onMouseEnter,
  rowMarker = false,
}: {
  children: ReactNode;
  pop?: string;
  frame?: number;
  seed?: number;
  style?: CSSProperties;
  onClick?: () => void;
  onMouseEnter?: () => void;
  rowMarker?: boolean;
}) {
  const autoId = useId();
  const s = seed ?? hashStr(autoId);
  const clip = quadClip(s, Math.max(1, frame - 2));
  return (
    <div
      style={{ position: 'relative', background: '#F4F1EA', padding: frame, clipPath: clip, filter: `drop-shadow(${pop})`, ...style }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      {...(rowMarker ? { 'data-p5row': '1' } : {})}
    >
      {children}
    </div>
  );
}
