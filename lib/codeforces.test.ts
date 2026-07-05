import { describe, it, expect } from 'vitest';
import { mapCfResponse, cmProgressPct } from './codeforces';

const fallback = { rating: 1445, maxRating: 1452, rank: 'Specialist' };

describe('mapCfResponse', () => {
  it('maps a valid OK response and title-cases the rank', () => {
    const json = { status: 'OK', result: [{ rating: 1500, maxRating: 1600, rank: 'expert' }] };
    expect(mapCfResponse(json, fallback)).toEqual({ rating: 1500, maxRating: 1600, rank: 'Expert' });
  });
  it('falls back on a FAILED status', () => {
    expect(mapCfResponse({ status: 'FAILED', comment: 'nope' }, fallback)).toEqual(fallback);
  });
  it('falls back on malformed json', () => {
    expect(mapCfResponse(null, fallback)).toEqual(fallback);
    expect(mapCfResponse({ status: 'OK', result: [] }, fallback)).toEqual(fallback);
    expect(mapCfResponse({ status: 'OK', result: [{ rating: 'x' }] }, fallback)).toEqual(fallback);
  });
});

describe('cmProgressPct', () => {
  it('clamps and scales rating onto 0-100', () => {
    expect(cmProgressPct(800)).toBe(0);
    expect(cmProgressPct(1900)).toBe(100);
    expect(cmProgressPct(1445)).toBe(59);
    expect(cmProgressPct(400)).toBe(0);
  });
});
