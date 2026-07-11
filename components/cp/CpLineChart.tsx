'use client';
import { useState } from 'react';
import { HoverQuad } from '@/components/ui/HoverQuad';
import { COLOR, FONT, POP } from '@/lib/tokens';
import type { CpContest, RatingBand } from '@/lib/cp/types';

const W = 640, H = 240;
const PAD = { l: 46, r: 14, t: 12, b: 26 };

// Y range padded ±60 then rounded out to 100s, so the line never kisses the
// frame and gridlines land on round numbers. Floor at 0 (ratings can't go below).
export function yDomain(values: number[]): { lo: number; hi: number } {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return {
    lo: Math.max(0, Math.floor((min - 60) / 100) * 100),
    hi: Math.ceil((max + 60) / 100) * 100,
  };
}

export function CpLineChart({ title, contests, value, detail, bands, accent = COLOR.cfteal }: {
  title: string;
  contests: CpContest[];
  value: (c: CpContest) => number;
  detail: (c: CpContest) => string;
  bands: RatingBand[];
  accent?: string; // platform accent for the popup's contest link
}) {
  const [active, setActive] = useState<number | null>(null);
  if (contests.length === 0) return null;

  const vals = contests.map(value);
  const { lo, hi } = yDomain(vals);
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const x = (i: number) => PAD.l + (contests.length === 1 ? plotW / 2 : (i * plotW) / (contests.length - 1));
  const y = (v: number) => PAD.t + plotH - ((v - lo) / (hi - lo)) * plotH;

  const visible = bands.filter(b => b.hi > lo && b.lo < hi);
  // Tick lines at band edges inside the domain, plus the domain ends.
  const ticks = [...new Set([lo, hi, ...visible.map(b => b.lo), ...visible.map(b => b.hi)])]
    .filter(t => t >= lo && t <= hi).sort((a, b) => a - b);
  const cur = active == null ? null : contests[active];

  // Popup anchor in percent of the chart box — the svg fills its wrapper and
  // keeps the viewBox aspect ratio, so viewBox coords map 1:1 to percentages.
  const xPct = active == null ? 0 : (x(active) / W) * 100;
  const yPct = cur == null ? 0 : (y(value(cur)) / H) * 100;
  // Clamp near the edges so the popup never overflows the chart horizontally.
  const shiftX = xPct < 18 ? '0%' : xPct > 82 ? '-100%' : '-50%';

  return (
    <div>
      <div style={{ fontFamily: FONT.bebas, letterSpacing: '.18em', fontSize: 15, color: COLOR.ink, opacity: .85, marginBottom: 6 }}>{title}</div>
      <div data-testid="chart-body" style={{ position: 'relative' }} onMouseLeave={() => setActive(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}
        style={{ width: '100%', display: 'block', background: COLOR.trackBg, border: `1px solid ${COLOR.trackBorder}` }}>
        {visible.map(b => {
          const top = y(Math.min(b.hi, hi));
          return <rect key={b.lo} x={PAD.l} width={plotW} y={top} height={y(Math.max(b.lo, lo)) - top} fill={b.color} opacity={0.16} />;
        })}
        {ticks.map(t => (
          <g key={t}>
            <line x1={PAD.l} x2={PAD.l + plotW} y1={y(t)} y2={y(t)} stroke={COLOR.trackBorder} strokeDasharray="3 4" />
            <text x={PAD.l - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill={COLOR.ink} opacity={0.7} fontFamily={FONT.oswald}>{t}</text>
          </g>
        ))}
        <text x={x(0)} y={H - 8} textAnchor="middle" fontSize={10} fill={COLOR.ink} opacity={0.7} fontFamily={FONT.oswald}>1</text>
        {contests.length > 1 && (
          <text x={x(contests.length - 1)} y={H - 8} textAnchor="middle" fontSize={10} fill={COLOR.ink} opacity={0.7} fontFamily={FONT.oswald}>{contests.length}</text>
        )}
        <polyline points={contests.map((c, i) => `${x(i)},${y(value(c))}`).join(' ')} fill="none" stroke={COLOR.ink} strokeWidth={2} />
        {contests.map((c, i) => (
          <circle key={i} data-testid={`pt-${i}`} cx={x(i)} cy={y(value(c))} r={5}
            fill={active === i ? COLOR.accent : COLOR.ink} stroke={COLOR.base} strokeWidth={1.5}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} />
        ))}
      </svg>
      {cur && (
        <div data-testid="chart-popup" style={{
          position: 'absolute', left: `${xPct}%`, top: `${yPct}%`,
          transform: `translate(${shiftX}, calc(-100% - 12px)) skewX(-3deg)`,
          background: COLOR.panel, border: `1px solid ${COLOR.ink}`, boxShadow: POP.rowBase,
          padding: '8px 14px', whiteSpace: 'nowrap', zIndex: 5,
        }}>
          <div style={{ transform: 'skewX(3deg)' }}>
            <HoverQuad seed={9}>
              <a href={cur.url} target="_blank" rel="noreferrer"
                style={{ display: 'block', color: accent, fontFamily: FONT.bebas, letterSpacing: '.1em', fontSize: 15, textDecoration: 'none' }}>
                {cur.name} ►
              </a>
            </HoverQuad>
            <div style={{ fontFamily: FONT.oswald, fontSize: 13, opacity: .8 }}>{cur.date} · {detail(cur)}</div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
