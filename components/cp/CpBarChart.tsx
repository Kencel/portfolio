'use client';
import { COLOR, FONT } from '@/lib/tokens';
import type { Bucket } from '@/lib/cp/types';

const W = 640, H = 200;
const PAD = { l: 14, r: 14, t: 18, b: 22 };

export function CpBarChart({ title, buckets, accent }: {
  title: string;
  buckets: Bucket[];
  accent: string;
}) {
  if (buckets.length === 0) return null;
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const maxCount = Math.max(1, ...buckets.map(b => b.count));
  const slot = plotW / buckets.length;
  const barW = Math.min(46, slot * 0.72);
  // Harder buckets render more opaque — encodes difficulty without foreign hues.
  const barOpacity = (i: number) =>
    buckets.length === 1 ? 1 : Math.round((0.4 + (0.6 * i) / (buckets.length - 1)) * 100) / 100;

  return (
    <div>
      <div style={{ fontFamily: FONT.bebas, letterSpacing: '.18em', fontSize: 15, color: COLOR.ink, opacity: .85, marginBottom: 6 }}>{title}</div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}
        style={{ width: '100%', display: 'block', background: COLOR.trackBg, border: `1px solid ${COLOR.trackBorder}` }}>
        {buckets.map((b, i) => {
          const h = (b.count / maxCount) * plotH;
          const cx = PAD.l + slot * i + slot / 2;
          return (
            <g key={b.lo}>
              <rect data-testid={`bar-${b.lo}`} x={cx - barW / 2} y={PAD.t + plotH - h} width={barW} height={h}
                fill={accent} opacity={barOpacity(i)} />
              {b.count > 0 && (
                <text x={cx} y={PAD.t + plotH - h - 4} textAnchor="middle" fontSize={10}
                  fill={COLOR.ink} fontFamily={FONT.oswald}>{b.count}</text>
              )}
              <text x={cx} y={H - 6} textAnchor="middle" fontSize={9}
                fill={COLOR.ink} opacity={0.7} fontFamily={FONT.oswald}>{b.lo}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
