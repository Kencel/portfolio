import { describe, it, expect } from 'vitest';
import { bucketize, highlights } from './stats';
import type { CpContest } from './types';

const c = (over: Partial<CpContest>): CpContest => ({
  name: 'X', url: 'https://x', date: '2025-01-01',
  ratingAfter: 1000, delta: 0, performance: 1000, rank: 100, ...over,
});

describe('bucketize', () => {
  it('buckets by width with lo = floor(v/width)*width', () => {
    expect(bucketize([800, 850, 999, 1000], 100)).toEqual([
      { lo: 800, count: 2 }, { lo: 900, count: 1 }, { lo: 1000, count: 1 },
    ]);
  });
  it('fills empty middle buckets', () => {
    expect(bucketize([0, 1200], 400)).toEqual([
      { lo: 0, count: 1 }, { lo: 400, count: 0 }, { lo: 800, count: 0 }, { lo: 1200, count: 1 },
    ]);
  });
  it('returns [] for no values', () => {
    expect(bucketize([], 100)).toEqual([]);
  });
});

describe('highlights', () => {
  it('computes best rank, biggest gain, contest count', () => {
    const contests = [c({ rank: 900, delta: -20 }), c({ rank: 300, delta: 120 }), c({ rank: 500, delta: 40 })];
    expect(highlights(contests)).toEqual({ bestRank: 300, biggestGain: 120, joined: 3 });
  });
  it('handles the empty history', () => {
    expect(highlights([])).toEqual({ bestRank: null, biggestGain: null, joined: 0 });
  });
});
