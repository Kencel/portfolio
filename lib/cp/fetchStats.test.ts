import { describe, it, expect, vi } from 'vitest';
import { getCpStats, fetchAtcoderSubmissions } from './fetchStats';

const noSleep = () => Promise.resolve();

// Minimal Response stand-in the orchestrator needs: ok + json().
const jsonRes = (body: unknown, ok = true) =>
  ({ ok, status: ok ? 200 : 500, json: () => Promise.resolve(body) }) as Response;

const cfInfo = { status: 'OK', result: [{ rating: 1445, maxRating: 1452, rank: 'specialist' }] };
const cfRating = { status: 'OK', result: [
  { contestId: 1900, contestName: 'Round A', rank: 1543, ratingUpdateTimeSeconds: 1735689600, oldRating: 1400, newRating: 1445 },
] };
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
    if (url.includes('history/json')) return jsonRes(acHistory);
    if (url.includes('user/submissions')) return jsonRes(acSubs);
    if (url.includes('problem-models')) return jsonRes(acModels);
    throw new Error('unexpected url ' + url);
  }) as unknown as typeof fetch;
}

describe('getCpStats', () => {
  it('assembles both platforms from mocked endpoints', async () => {
    const stats = await getCpStats(fakeFetch(), noSleep);
    expect(stats.cf).toMatchObject({ rating: 1445, peakRating: 1452, rankLabel: 'Specialist', solved: 1 });
    expect(stats.cf!.contests).toHaveLength(1);
    expect(stats.cf!.buckets).toEqual([{ lo: 800, count: 1 }]);
    expect(stats.atcoder).toMatchObject({ rating: 120, peakRating: 120, rankLabel: 'Gray', solved: 1 });
    expect(stats.atcoder!.buckets).toEqual([{ lo: 400, count: 1 }]);
  });

  it('one platform failing does not sink the other', async () => {
    const stats = await getCpStats(fakeFetch({ 'codeforces.com': () => jsonRes({}, false) }), noSleep);
    expect(stats.cf).toBeNull();
    expect(stats.atcoder).not.toBeNull();
  });

  it('empty atcoder history yields null platform', async () => {
    const stats = await getCpStats(fakeFetch({ 'history/json': [] }), noSleep);
    expect(stats.atcoder).toBeNull();
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
