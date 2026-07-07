import type { Bucket, CpContest } from './types';

// Histogram over fixed-width buckets. Buckets run contiguously from the lowest
// to the highest occupied bucket so the bar chart has no gaps in its x axis.
export function bucketize(values: number[], width: number): Bucket[] {
  if (values.length === 0) return [];
  const lo = (v: number) => Math.floor(v / width) * width;
  const counts = new Map<number, number>();
  for (const v of values) counts.set(lo(v), (counts.get(lo(v)) ?? 0) + 1);
  const min = Math.min(...counts.keys());
  const max = Math.max(...counts.keys());
  const out: Bucket[] = [];
  for (let b = min; b <= max; b += width) out.push({ lo: b, count: counts.get(b) ?? 0 });
  return out;
}

export function highlights(contests: CpContest[]): { bestRank: number | null; biggestGain: number | null; joined: number } {
  if (contests.length === 0) return { bestRank: null, biggestGain: null, joined: 0 };
  return {
    bestRank: Math.min(...contests.map(c => c.rank)),
    biggestGain: Math.max(...contests.map(c => c.delta)),
    joined: contests.length,
  };
}
