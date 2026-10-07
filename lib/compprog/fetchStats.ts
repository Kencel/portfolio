// Server-only: fetches CF + AtCoder data during ISR revalidation and reduces it
// to a compact CompprogStats. Never throws — CI builds offline, and an upstream
// outage must not take the page down (the affected tab shows a fallback).
import type { CompprogStats, PlatformStats } from './types';
import { bucketize } from './stats';
import { mapCfInfo, mapCfContests, mapCfSolved, cfContestId } from './codeforces';
import { cfContestants, cfContestantsByRank, cfPerformance, type CfContestant } from './cfPerf';
import { mapAtcoderContests, mapAtcoderSolved, atcoderRankLabel, ATCODER_BUCKET_WIDTH } from './atcoder';

const CF_HANDLE = 'RamenNagi';
const ATCODER_HANDLE = 'RamenNagi';

// kenkoooo asks API users to identify themselves and pace their requests.
const UA = { 'user-agent': 'ramennagi-portfolio/1.0 (github.com/Kencel; contact: kenaz.celestino@gmail.com)' };
const KENKOOOO_PAGE = 500;
// Safety valve: 40 pages * 500 = 20k submissions, far above this account's
// ~1k history. Bounds a pathological upstream loop to a truncated-but-rendered chart.
const MAX_PAGES = 40;

const HOUR = 3600;

// A real CF performance needs the contest's full ratingChanges and standings
// (~2-4MB and ~5-10MB). The result never changes once a contest is rated, so
// the caller supplies a permanent per-contest cache, and each pass computes at
// most this many uncached contests (newest first) — the rest keep the
// approximation until a later pass fills them in. Keeps a cold cache from
// turning one ISR pass into dozens of big downloads.
const CF_PERF_BUDGET = 3;
// CF's API allows one call every 2 seconds.
const CF_API_GAP_MS = 2000;

export type PerfCache = (contestId: number, compute: () => Promise<number | null>) => Promise<number | null>;

type Fetcher = typeof fetch;
type Sleep = (ms: number) => Promise<void>;
const defaultSleep: Sleep = ms => new Promise(res => setTimeout(res, ms));

async function getJson(fetcher: Fetcher, url: string, revalidate: number, headers?: Record<string, string>): Promise<unknown> {
  // `next.revalidate` is Next's per-request data-cache TTL; plain fetch ignores it.
  const res = await fetcher(url, { headers, next: { revalidate } } as RequestInit);
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

export async function fetchAtcoderSubmissions(fetcher: Fetcher, sleep: Sleep): Promise<unknown[]> {
  const all: unknown[] = [];
  let from = 0;
  for (let pages = 0; pages < MAX_PAGES; pages++) {
    const page = await getJson(
      fetcher,
      `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${ATCODER_HANDLE}&from_second=${from}`,
      6 * HOUR,
      UA,
    );
    if (!Array.isArray(page) || page.length === 0) break;
    all.push(...page);
    if (page.length < KENKOOOO_PAGE) break;
    const last = page[page.length - 1] as { epoch_second?: unknown };
    if (typeof last.epoch_second !== 'number') break;
    from = last.epoch_second + 1;
    await sleep(1000);
  }
  return all;
}

const CF_API = 'https://codeforces.com/api';
class BudgetSpent extends Error {}

export async function getCfPerfs(
  fetcher: Fetcher, sleep: Sleep, cache: PerfCache, contestIds: number[],
): Promise<Map<number, number>> {
  const perfs = new Map<number, number>();
  let budget = CF_PERF_BUDGET;
  let skipped = 0;
  for (const id of [...contestIds].reverse()) {
    try {
      const perf = await cache(id, async () => {
        // Throwing (rather than returning null) keeps the miss out of the cache.
        if (budget <= 0) throw new BudgetSpent();
        budget--;
        await sleep(CF_API_GAP_MS);
        const changes = await getJson(fetcher, `${CF_API}/contest.ratingChanges?contestId=${id}`, 24 * HOUR);
        await sleep(CF_API_GAP_MS);
        // CF only serves contest standings to anonymous callers with no extra
        // query parameters — and that view omits some rated contestants. Carrot
        // ranks from the same view, so its numbers match ours.
        const standings = await getJson(fetcher, `${CF_API}/contest.standings?contestId=${id}`, 24 * HOUR);
        const rated = (cs: CfContestant[]) => cs.some(c => c.handle === CF_HANDLE);
        let contestants = cfContestants(standings, changes, id);
        if (!rated(contestants)) contestants = cfContestantsByRank(changes, id);
        if (!rated(contestants)) throw new Error(`contest ${id}: ${CF_HANDLE} not in ratingChanges`);
        return cfPerformance(contestants, CF_HANDLE);
      });
      if (perf !== null) perfs.set(id, perf);
    } catch (err) {
      if (err instanceof BudgetSpent) skipped++;
      else console.warn('getCompprogStats: codeforces performance failed:', err);
    }
  }
  if (skipped > 0) console.info(`getCompprogStats: ${skipped} CF contest(s) left on approximate performance this pass`);
  return perfs;
}

// Swaps each CF contest's approximate performance for the real one where it can
// get it. Runs outside the hourly stats cache on purpose: Next bypasses cache
// reads for an unstable_cache nested inside another, which would make every
// per-contest lookup a miss. Never throws.
export async function withCfPerformances(
  stats: CompprogStats, cache: PerfCache, fetcher: Fetcher = fetch, sleep: Sleep = defaultSleep,
): Promise<CompprogStats> {
  if (!stats.cf) return stats;
  const ids = stats.cf.contests.map(cfContestId).filter((id): id is number => id !== null);
  const perfs = await getCfPerfs(fetcher, sleep, cache, ids);
  const contests = stats.cf.contests.map(c => {
    const perf = perfs.get(cfContestId(c) ?? NaN);
    return perf === undefined ? c : { ...c, performance: perf };
  });
  return { ...stats, cf: { ...stats.cf, contests } };
}

async function getCf(fetcher: Fetcher): Promise<PlatformStats | null> {
  try {
    const [info, rating, status] = await Promise.all([
      getJson(fetcher, `${CF_API}/user.info?handles=${CF_HANDLE}`, HOUR),
      getJson(fetcher, `${CF_API}/user.rating?handle=${CF_HANDLE}`, HOUR),
      getJson(fetcher, `${CF_API}/user.status?handle=${CF_HANDLE}`, HOUR),
    ]);
    const head = mapCfInfo(info);
    if (!head) {
      console.error('getCompprogStats: codeforces user.info unusable');
      return null;
    }
    const { solved, ratings } = mapCfSolved(status);
    return { ...head, solved, contests: mapCfContests(rating), buckets: bucketize(ratings, 100) };
  } catch (err) {
    console.error('getCompprogStats: codeforces failed:', err);
    return null;
  }
}

async function getAtcoder(fetcher: Fetcher, sleep: Sleep): Promise<PlatformStats | null> {
  try {
    const [history, submissions, models] = await Promise.all([
      getJson(fetcher, `https://atcoder.jp/users/${ATCODER_HANDLE}/history/json`, HOUR),
      fetchAtcoderSubmissions(fetcher, sleep),
      getJson(fetcher, 'https://kenkoooo.com/atcoder/resources/problem-models.json', 24 * HOUR, UA),
    ]);
    const contests = mapAtcoderContests(history);
    if (contests.length === 0) {
      console.warn('getCompprogStats: atcoder history empty or unusable');
      return null;
    }
    const { solved, difficulties } = mapAtcoderSolved(submissions, models);
    const rating = contests[contests.length - 1].ratingAfter;
    return {
      rating,
      peakRating: Math.max(...contests.map(c => c.ratingAfter)),
      rankLabel: atcoderRankLabel(rating),
      solved,
      contests,
      buckets: bucketize(difficulties, ATCODER_BUCKET_WIDTH),
    };
  } catch (err) {
    console.error('getCompprogStats: atcoder failed:', err);
    return null;
  }
}

export async function getCompprogStats(fetcher: Fetcher = fetch, sleep: Sleep = defaultSleep): Promise<CompprogStats> {
  const [cf, atcoder] = await Promise.all([getCf(fetcher), getAtcoder(fetcher, sleep)]);
  return { cf, atcoder };
}
