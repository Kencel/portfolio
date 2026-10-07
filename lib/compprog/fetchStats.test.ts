import { describe, it, expect, vi } from 'vitest';
import { getCompprogStats, fetchAtcoderSubmissions, getCfPerfs, withCfPerformances, type PerfCache } from './fetchStats';
import { cfContestants, cfContestantsByRank, cfPerformance } from './cfPerf';

const noSleep = () => Promise.resolve();

// Minimal Response stand-in the orchestrator needs: ok + json().
const jsonRes = (body: unknown, ok = true) =>
  ({ ok, status: ok ? 200 : 500, json: () => Promise.resolve(body) }) as Response;

const cfInfo = { status: 'OK', result: [{ rating: 1445, maxRating: 1452, rank: 'specialist' }] };
const cfRating = { status: 'OK', result: [
  { contestId: 1900, contestName: 'Round A', rank: 1543, ratingUpdateTimeSeconds: 1735689600, oldRating: 1400, newRating: 1445 },
] };
const cfChanges = { status: 'OK', result: [
  { handle: 'tourist', rank: 1, oldRating: 1600 },
  { handle: 'newbie', rank: 2, oldRating: 0 },
  { handle: 'RamenNagi', rank: 3, oldRating: 1400 },
] };
const cfStandings = { status: 'OK', result: { rows: ['tourist', 'RamenNagi', 'newbie'].map((handle, i) => (
  { party: { members: [{ handle }] }, points: 3000 - 1000 * i, penalty: 0 })) } };
const cfStatus = { status: 'OK', result: [
  { problem: { contestId: 1, index: 'A', rating: 800 }, verdict: 'OK' },
] };
const acHistory = [
  { IsRated: true, Place: 512, OldRating: 0, NewRating: 120, Performance: 400,
    ContestScreenName: 'abc300.contest.atcoder.jp', ContestName: 'ABC 300', EndTime: '2023-04-30T22:40:00+09:00' },
];
const acSubs = [{ problem_id: 'abc300_a', result: 'AC', epoch_second: 100 }];
const acModels = { abc300_a: { difficulty: 500 } };

function fakeFetch(overrides: Record<string, unknown | ((url: string) => Response)> = {}) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    for (const [frag, body] of Object.entries(overrides)) {
      if (url.includes(frag)) return typeof body === 'function' ? (body as (u: string) => Response)(url) : jsonRes(body);
    }
    if (url.includes('user.info')) return jsonRes(cfInfo);
    if (url.includes('user.rating')) return jsonRes(cfRating);
    if (url.includes('user.status')) return jsonRes(cfStatus);
    if (url.includes('contest.ratingChanges')) return jsonRes(cfChanges);
    if (url.includes('contest.standings')) return jsonRes(cfStandings);
    if (url.includes('history/json')) return jsonRes(acHistory);
    if (url.includes('user/submissions')) return jsonRes(acSubs);
    if (url.includes('problem-models')) return jsonRes(acModels);
    throw new Error('unexpected url ' + url);
  }) as unknown as typeof fetch;
}

describe('getCompprogStats', () => {
  it('assembles both platforms from mocked endpoints', async () => {
    const stats = await getCompprogStats(fakeFetch(), noSleep);
    expect(stats.cf).toMatchObject({ rating: 1445, peakRating: 1452, rankLabel: 'Specialist', solved: 1 });
    expect(stats.cf!.contests).toHaveLength(1);
    expect(stats.cf!.buckets).toEqual([{ lo: 800, count: 1 }]);
    expect(stats.atcoder).toMatchObject({ rating: 120, peakRating: 120, rankLabel: 'Gray', solved: 1 });
    expect(stats.atcoder!.buckets).toEqual([{ lo: 400, count: 1 }]);
  });

  it('one platform failing does not sink the other', async () => {
    const stats = await getCompprogStats(fakeFetch({ 'codeforces.com': () => jsonRes({}, false) }), noSleep);
    expect(stats.cf).toBeNull();
    expect(stats.atcoder).not.toBeNull();
  });

  it('empty atcoder history yields null platform', async () => {
    const stats = await getCompprogStats(fakeFetch({ 'history/json': [] }), noSleep);
    expect(stats.atcoder).toBeNull();
  });
});

describe('withCfPerformances', () => {
  const noCache: PerfCache = (_id, compute) => compute();

  it('swaps in the computed CF performance', async () => {
    const stats = await getCompprogStats(fakeFetch(), noSleep);
    expect(stats.cf!.contests[0].performance).toBe(1490); // approximation, old + 2*delta
    const out = await withCfPerformances(stats, noCache, fakeFetch(), noSleep);
    const expected = cfPerformance(cfContestants(cfStandings, cfChanges, 1900), 'RamenNagi');
    expect(expected).not.toBe(1490);
    expect(out.cf!.contests[0].performance).toBe(expected);
    expect(out.atcoder).toBe(stats.atcoder);
  });

  it.each(['contest.ratingChanges', 'contest.standings'])('keeps the approximation when %s fails', async endpoint => {
    const stats = await getCompprogStats(fakeFetch(), noSleep);
    const out = await withCfPerformances(stats, noCache, fakeFetch({ [endpoint]: () => jsonRes({}, false) }), noSleep);
    expect(out.cf!.contests[0].performance).toBe(1490);
  });

  it('ranks by ratingChanges when the handle is missing from the official standings', async () => {
    const stats = await getCompprogStats(fakeFetch(), noSleep);
    const official = { status: 'OK', result: { rows: cfStandings.result.rows.filter(r => r.party.members[0].handle !== 'RamenNagi') } };
    const out = await withCfPerformances(stats, noCache, fakeFetch({ 'contest.standings': official }), noSleep);
    const expected = cfPerformance(cfContestantsByRank(cfChanges, 1900), 'RamenNagi');
    expect(expected).not.toBe(cfPerformance(cfContestants(cfStandings, cfChanges, 1900), 'RamenNagi'));
    expect(out.cf!.contests[0].performance).toBe(expected);
  });

  it('passes through a missing CF platform', async () => {
    const stats = { cf: null, atcoder: null };
    expect(await withCfPerformances(stats, noCache, fakeFetch(), noSleep)).toBe(stats);
  });
});

describe('getCfPerfs', () => {
  const ids = [1, 2, 3, 4, 5, 6];
  const urls = (f: typeof fetch) => (f as unknown as ReturnType<typeof vi.fn>).mock.calls.map(c => String(c[0]));

  it('computes at most 3 uncached contests per pass, newest first, pacing CF calls', async () => {
    const fetcher = fakeFetch();
    const sleep = vi.fn(noSleep);
    const perfs = await getCfPerfs(fetcher, sleep, (_id, compute) => compute(), ids);
    expect([...perfs.keys()]).toEqual([6, 5, 4]);
    expect(urls(fetcher)).toHaveLength(6);
    expect(urls(fetcher)[1]).toBe('https://codeforces.com/api/contest.standings?contestId=6'); // no extra params
    expect(sleep).toHaveBeenCalledTimes(6);
    expect(sleep).toHaveBeenCalledWith(2000);
  });

  it('cache hits cost no budget or fetches', async () => {
    const fetcher = fakeFetch();
    const cached: PerfCache = async (id, compute) => (id >= 3 ? 1000 + id : compute());
    const perfs = await getCfPerfs(fetcher, noSleep, cached, ids);
    expect(perfs.get(6)).toBe(1006);
    expect(urls(fetcher).map(u => u.split('=')[1])).toEqual(['2', '2', '1', '1']);
  });

  it('throws (so nothing is cached) when the handle is missing from the rated standings', async () => {
    const fetcher = fakeFetch({ 'contest.ratingChanges': { status: 'OK', result: [] } });
    const seen: unknown[] = [];
    const recording: PerfCache = (_id, compute) => compute().then(v => { seen.push(v); return v; });
    const perfs = await getCfPerfs(fetcher, noSleep, recording, [1]);
    expect(perfs.size).toBe(0);
    expect(seen).toEqual([]);
  });
});

describe('fetchAtcoderSubmissions', () => {
  it('pages with from_second and stops on a short page', async () => {
    const page1 = Array.from({ length: 500 }, (_, i) => ({ problem_id: `p${i}`, result: 'AC', epoch_second: i }));
    const page2 = [{ problem_id: 'last', result: 'AC', epoch_second: 999 }];
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      return jsonRes(url.includes('from_second=0') ? page1 : page2);
    }) as unknown as typeof fetch;
    const sleep = vi.fn(noSleep);
    const all = await fetchAtcoderSubmissions(fetcher, sleep);
    expect(all).toHaveLength(501);
    expect(String((fetcher as ReturnType<typeof vi.fn>).mock.calls[1][0])).toContain('from_second=500'); // last epoch 499 + 1
    expect(sleep).toHaveBeenCalledTimes(1);
    expect(sleep).toHaveBeenCalledWith(1000);
  });

  it('caps pagination at 40 pages even if upstream keeps returning full pages', async () => {
    const fullPage = Array.from({ length: 500 }, (_, i) => ({ problem_id: `p${i}`, result: 'AC', epoch_second: i }));
    const fetcher = vi.fn(async () => jsonRes(fullPage)) as unknown as typeof fetch;
    const sleep = vi.fn(noSleep);
    const all = await fetchAtcoderSubmissions(fetcher, sleep);
    expect(all).toHaveLength(40 * 500);
    expect(fetcher).toHaveBeenCalledTimes(40);
  });
});
