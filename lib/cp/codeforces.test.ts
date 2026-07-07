import { describe, it, expect } from 'vitest';
import { cfPerformance, mapCfInfo, mapCfContests, mapCfSolved } from './codeforces';

const info = { status: 'OK', result: [{ handle: 'RamenNagi', rating: 1445, maxRating: 1452, rank: 'specialist' }] };
const ratingHistory = {
  status: 'OK',
  result: [
    { contestId: 1900, contestName: 'Round A', rank: 1543, ratingUpdateTimeSeconds: 1735689600, oldRating: 1400, newRating: 1445 },
    { contestId: 1901, contestName: 'Round B', rank: 800,  ratingUpdateTimeSeconds: 1738368000, oldRating: 1445, newRating: 1430 },
  ],
};
const status = {
  status: 'OK',
  result: [
    { problem: { contestId: 1, index: 'A', rating: 800 },  verdict: 'OK' },
    { problem: { contestId: 1, index: 'A', rating: 800 },  verdict: 'OK' },            // dup solve
    { problem: { contestId: 1, index: 'B', rating: 1200 }, verdict: 'WRONG_ANSWER' },  // not solved
    { problem: { contestId: 2, index: 'C', rating: 1500 }, verdict: 'OK' },
    { problem: { contestId: 3, index: 'A' },               verdict: 'OK' },            // unrated problem
  ],
};

describe('cfPerformance', () => {
  it('approximates perf as old + 2*delta', () => {
    expect(cfPerformance(1400, 1445)).toBe(1490);
    expect(cfPerformance(1445, 1430)).toBe(1415);
  });
});

describe('mapCfInfo', () => {
  it('maps rating, peak, title-cased rank', () => {
    expect(mapCfInfo(info)).toEqual({ rating: 1445, peakRating: 1452, rankLabel: 'Specialist' });
  });
  it('returns null on malformed payloads', () => {
    expect(mapCfInfo({ status: 'FAILED' })).toBeNull();
    expect(mapCfInfo({ status: 'OK', result: [{ rating: 'x' }] })).toBeNull();
    expect(mapCfInfo(null)).toBeNull();
  });
});

describe('mapCfContests', () => {
  it('maps history rows to CpContest', () => {
    const out = mapCfContests(ratingHistory);
    expect(out).toHaveLength(2);
    expect(out[0]).toEqual({
      name: 'Round A',
      url: 'https://codeforces.com/contest/1900',
      date: '2025-01-01',
      ratingAfter: 1445, delta: 45, performance: 1490, rank: 1543,
    });
  });
  it('returns [] on malformed payloads and skips malformed rows', () => {
    expect(mapCfContests({ status: 'FAILED' })).toEqual([]);
    expect(mapCfContests({ status: 'OK', result: [{ contestName: 'no numbers' }] })).toEqual([]);
  });
  it('skips null and non-object entries in result array', () => {
    const out = mapCfContests({
      status: 'OK',
      result: [null, { contestId: 1900, contestName: 'Round A', rank: 1543, ratingUpdateTimeSeconds: 1735689600, oldRating: 1400, newRating: 1445 }],
    });
    expect(out).toHaveLength(1);
    expect(out[0].name).toBe('Round A');
  });
});

describe('mapCfSolved', () => {
  it('counts distinct OK problems; collects only rated ones into ratings', () => {
    expect(mapCfSolved(status)).toEqual({ solved: 3, ratings: [800, 1500] });
  });
  it('returns zero state on malformed payloads', () => {
    expect(mapCfSolved(undefined)).toEqual({ solved: 0, ratings: [] });
  });
  it('skips null and non-object entries in result array', () => {
    const out = mapCfSolved({
      status: 'OK',
      result: [null, 'junk', { problem: { contestId: 1, index: 'A', rating: 800 }, verdict: 'OK' }],
    });
    expect(out).toEqual({ solved: 1, ratings: [800] });
  });
});
