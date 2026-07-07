import { describe, it, expect } from 'vitest';
import { clipDifficulty, mapAtcoderContests, atcoderRankLabel, mapAtcoderSolved } from './atcoder';

const history = [
  { IsRated: true,  Place: 512, OldRating: 0,   NewRating: 120, Performance: 400,
    ContestScreenName: 'abc300.contest.atcoder.jp', ContestName: 'ABC 300', EndTime: '2023-04-30T22:40:00+09:00' },
  { IsRated: false, Place: 999, OldRating: 120, NewRating: 120, Performance: 0,
    ContestScreenName: 'agc064.contest.atcoder.jp', ContestName: 'AGC 064', EndTime: '2023-06-04T22:40:00+09:00' },
  { IsRated: true,  Place: 300, OldRating: 120, NewRating: 250, Performance: 700,
    ContestScreenName: 'abc310.contest.atcoder.jp', ContestName: 'ABC 310', EndTime: '2023-07-15T22:40:00+09:00' },
];
const submissions = [
  { problem_id: 'abc300_a', result: 'AC' },
  { problem_id: 'abc300_a', result: 'AC' },  // dup solve
  { problem_id: 'abc300_b', result: 'WA' },  // not solved
  { problem_id: 'abc310_c', result: 'AC' },
  { problem_id: 'abc310_d', result: 'AC' },  // no model entry
];
const models = {
  abc300_a: { difficulty: -1000 }, // clipped
  abc310_c: { difficulty: 1250 },
  abc310_x: {},                    // no difficulty field
};

describe('clipDifficulty', () => {
  it('is identity at/above 400 and clips smoothly below', () => {
    expect(clipDifficulty(1250)).toBe(1250);
    expect(clipDifficulty(400)).toBe(400);
    expect(clipDifficulty(0)).toBe(Math.round(400 / Math.E)); // 147
    expect(clipDifficulty(-1000)).toBeGreaterThan(0);
    expect(clipDifficulty(-1000)).toBeLessThan(50);
  });
});

describe('mapAtcoderContests', () => {
  it('maps rated rows only, deriving url from screen name', () => {
    const out = mapAtcoderContests(history);
    expect(out).toHaveLength(2);
    expect(out[0]).toEqual({
      name: 'ABC 300',
      url: 'https://atcoder.jp/contests/abc300',
      date: '2023-04-30',
      ratingAfter: 120, delta: 120, performance: 400, rank: 512,
    });
  });
  it('returns [] for malformed payloads', () => {
    expect(mapAtcoderContests({ not: 'an array' })).toEqual([]);
    expect(mapAtcoderContests([{ IsRated: true }])).toEqual([]);
  });
  it('skips null entries in array', () => {
    const out = mapAtcoderContests([
      null,
      { IsRated: true,  Place: 512, OldRating: 0,   NewRating: 120, Performance: 400,
        ContestScreenName: 'abc300.contest.atcoder.jp', ContestName: 'ABC 300', EndTime: '2023-04-30T22:40:00+09:00' },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0].name).toBe('ABC 300');
  });
});

describe('atcoderRankLabel', () => {
  it('names the color band', () => {
    expect(atcoderRankLabel(250)).toBe('Gray');
    expect(atcoderRankLabel(450)).toBe('Brown');
  });
});

describe('mapAtcoderSolved', () => {
  it('counts distinct AC; collects clipped difficulties where modeled', () => {
    expect(mapAtcoderSolved(submissions, models)).toEqual({
      solved: 3,
      difficulties: [clipDifficulty(-1000), 1250], // abc310_d has no model → excluded
    });
  });
  it('returns zero state on malformed payloads', () => {
    expect(mapAtcoderSolved(null, null)).toEqual({ solved: 0, difficulties: [] });
  });
  it('skips null and non-object entries in submissions array', () => {
    expect(mapAtcoderSolved([null, 'junk'], {})).toEqual({ solved: 0, difficulties: [] });
  });
});
