import { describe, it, expect } from 'vitest';
import { cfContestants, cfContestantsByRank, cfPerformance } from './cfPerf';

// 40 contestants: points fall with i, a three-way tie (same points and penalty)
// at u9..u11, u20/u21 level on points but split by penalty, and every 7th a
// newcomer seeded at 1400.
const contestants = Array.from({ length: 40 }, (_, i) => ({
  handle: `u${i}`,
  points: i >= 9 && i <= 11 ? 3000 - 9 * 60 : i === 21 ? 3000 - 20 * 60 : 3000 - i * 60,
  penalty: i === 21 ? 50 : 10,
  rating: i % 7 === 3 ? 1400 : 2350 - ((i * 37) % 1550),
}));

describe('cfPerformance', () => {
  // Expected values come from running Carrot's own predict.js on this contest.
  it('matches Carrot', () => {
    const perf = (h: string) => cfPerformance(contestants, h);
    expect(perf('u3')).toBe(2291);  // a newcomer
    expect(perf('u9')).toBe(1827);  // tied — all three take 12th
    expect(perf('u10')).toBe(1854);
    expect(perf('u11')).toBe(1831);
    expect(perf('u20')).toBe(1491);
    expect(perf('u21')).toBe(1458); // same points as u20, more penalty
    expect(perf('u39')).toBe(-30);  // last place
  });

  it('ranks by points and penalty, not input order', () => {
    expect(cfPerformance([...contestants].reverse(), 'u20')).toBe(1491);
  });

  it('returns null for the winner and for absent handles', () => {
    expect(cfPerformance(contestants, 'u0')).toBeNull();
    expect(cfPerformance(contestants, 'nobody')).toBeNull();
  });
});

describe('cfContestants', () => {
  const row = (handle: unknown, points: unknown, penalty: unknown) => ({ party: { members: [{ handle }] }, points, penalty });
  const standings = { status: 'OK', result: { rows: [
    row('a', 3000, 10),
    row('unrated', 2500, 20),  // in standings, not in ratingChanges
    row('newbie', 2000, 30),
    row('b', '1500', 40),      // malformed
    null,
  ] } };
  const ratingChanges = { status: 'OK', result: [
    { handle: 'a', rank: 1, oldRating: 1700 },
    { handle: 'newbie', rank: 2, oldRating: 0 },
    { handle: 'b', rank: 3, oldRating: 1500 },
  ] };

  it('keeps rated standings rows, seeding newcomers at 1400 on modern contests', () => {
    expect(cfContestants(standings, ratingChanges, 2000)).toEqual([
      { handle: 'a', points: 3000, penalty: 10, rating: 1700 },
      { handle: 'newbie', points: 2000, penalty: 30, rating: 1400 },
    ]);
  });

  it('takes oldRating 0 literally before contest 1360', () => {
    expect(cfContestants(standings, ratingChanges, 1000)[1].rating).toBe(0);
  });

  it('returns [] on malformed payloads', () => {
    expect(cfContestants({ status: 'FAILED' }, ratingChanges, 2000)).toEqual([]);
    expect(cfContestants(standings, undefined, 2000)).toEqual([]);
  });
});

describe('cfContestantsByRank', () => {
  it('ranks by ratingChanges place, ties staying tied', () => {
    const changes = { status: 'OK', result: [
      { handle: 'a', rank: 1, oldRating: 1700 },
      { handle: 'b', rank: 2, oldRating: 0 },
      { handle: 'c', rank: 2, oldRating: 1500 },
      { handle: 'd', rank: '4', oldRating: 1500 }, // malformed
    ] };
    expect(cfContestantsByRank(changes, 2000)).toEqual([
      { handle: 'a', points: -1, penalty: 0, rating: 1700 },
      { handle: 'b', points: -2, penalty: 0, rating: 1400 },
      { handle: 'c', points: -2, penalty: 0, rating: 1500 },
    ]);
    expect(cfContestantsByRank({ status: 'FAILED' }, 2000)).toEqual([]);
  });
});
