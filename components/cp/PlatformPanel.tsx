'use client';
import { AngularCard } from '@/components/AngularCard';
import { HoverQuad } from '@/components/ui/HoverQuad';
import { COLOR, FONT } from '@/lib/tokens';
import { highlights } from '@/lib/cp/stats';
import type { PlatformStats } from '@/lib/cp/types';
import { CpLineChart } from './CpLineChart';
import { CpBarChart } from './CpBarChart';

export interface PlatformConfig {
  title: string;        // "CODEFORCES"
  accent: string;       // heading color for the big-number cards
  handleUrl: string;    // profile link
  perfApprox: boolean;  // CF: true → chart titled "PERFORMANCE (APPROX)"
  seedBase: number;     // AngularCard seeds (keep clip-paths hydration-safe)
}

const bigCard = (seed: number, label: string, color: string, value: string, sub: string) => (
  <AngularCard seed={seed} style={{ transform: 'skewX(-3deg)' }}>
    <div style={{ background: COLOR.panel, padding: '22px 24px', height: '100%' }}>
      <div style={{ transform: 'skewX(3deg)' }}>
        <div style={{ fontFamily: FONT.bebas, letterSpacing: '.18em', fontSize: 15, color }}>{label}</div>
        <div style={{ fontFamily: FONT.anton, fontSize: 'clamp(40px,4.5vw,60px)', lineHeight: .95 }}>{value}</div>
        <div style={{ fontFamily: FONT.oswald, fontSize: 15, opacity: .8 }}>{sub}</div>
      </div>
    </div>
  </AngularCard>
);

const hlChip = (label: string, value: string) => (
  <div style={{ border: `1px solid ${COLOR.tagBorder}`, transform: 'skewX(-8deg)', padding: '4px 14px', fontFamily: FONT.bebas, letterSpacing: '.12em', fontSize: 15 }}>
    <span style={{ display: 'inline-block', transform: 'skewX(8deg)' }}>
      {label} <b style={{ color: COLOR.accent }}>{value}</b>
    </span>
  </div>
);

export function PlatformPanel({ stats, config }: { stats: PlatformStats; config: PlatformConfig }) {
  const hl = highlights(stats.contests);
  return (
    <div data-testid="platform-panel">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 18, marginBottom: 18 }}>
        {bigCard(config.seedBase, `${config.title} · RATING`, config.accent, String(stats.rating), stats.rankLabel)}
        {bigCard(config.seedBase + 1, 'PEAK · RATING', config.accent, String(stats.peakRating), 'all-time high')}
        {bigCard(config.seedBase + 2, 'TOTAL · SOLVED', COLOR.accent, String(stats.solved), 'distinct problems')}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
        {hl.bestRank != null && hlChip('BEST RANK', `#${hl.bestRank}`)}
        {hl.biggestGain != null && hlChip('BIGGEST GAIN', hl.biggestGain >= 0 ? `+${hl.biggestGain}` : String(hl.biggestGain))}
        {hlChip('CONTESTS', String(hl.joined))}
        <HoverQuad seed={config.seedBase + 3} style={{ marginLeft: 'auto', alignSelf: 'center' }}>
          <a href={config.handleUrl} target="_blank" rel="noreferrer"
            style={{ display: 'inline-block', transform: 'skewX(-8deg)',
              backgroundColor: config.accent, color: COLOR.base, textDecoration: 'none',
              fontFamily: FONT.bebas, letterSpacing: '.14em', fontSize: 14, padding: '4px 12px' }}>
            <span style={{ display: 'inline-block', transform: 'skewX(8deg)' }}>@RamenNagi ►</span>
          </a>
        </HoverQuad>
      </div>
      <div style={{ display: 'grid', gap: 24 }}>
        <div data-testid="line-charts" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 24 }}>
          <CpLineChart title="RATING" contests={stats.contests} value={c => c.ratingAfter}
            detail={c => (c.delta >= 0 ? `Δ +${c.delta}` : `Δ ${c.delta}`)} accent={config.accent} />
          <CpLineChart title={config.perfApprox ? 'PERFORMANCE (APPROX)' : 'PERFORMANCE'} contests={stats.contests}
            value={c => c.performance} detail={c => `PERF ${c.performance}`} accent={config.accent} />
        </div>
        <CpBarChart title="SOLVED BY DIFFICULTY" buckets={stats.buckets} accent={config.accent} />
      </div>
    </div>
  );
}
