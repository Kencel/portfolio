// Server-only: fetches CF + AtCoder data during ISR revalidation and reduces it
// to a compact CpStats. Never throws — CI builds offline, and an upstream
// outage must not take the page down (the affected tab shows a fallback).
import type { CpStats, PlatformStats } from './types';
import { bucketize } from './stats';
import { mapCfInfo, mapCfContests, mapCfSolved } from './codeforces';
import { mapAtcoderContests, mapAtcoderSolved, atcoderRankLabel } from './atcoder';

const CF_HANDLE = 'RamenNagi';
const ATCODER_HANDLE = 'RamenNagi';

// kenkoooo asks API users to identify themselves and pace their requests.
const UA = { 'user-agent': 'ramennagi-portfolio/1.0 (github.com/Kencel; contact: kenaz.celestino@gmail.com)' };
const KENKOOOO_PAGE = 500;

const HOUR = 3600;

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
  for (;;) {
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

async function getCf(fetcher: Fetcher): Promise<PlatformStats | null> {
  try {
    const base = 'https://codeforces.com/api';
    const [info, rating, status] = await Promise.all([
      getJson(fetcher, `${base}/user.info?handles=${CF_HANDLE}`, HOUR),
      getJson(fetcher, `${base}/user.rating?handle=${CF_HANDLE}`, HOUR),
      getJson(fetcher, `${base}/user.status?handle=${CF_HANDLE}`, HOUR),
    ]);
    const head = mapCfInfo(info);
    if (!head) return null;
    const { solved, ratings } = mapCfSolved(status);
    return { ...head, solved, contests: mapCfContests(rating), buckets: bucketize(ratings, 100) };
  } catch (err) {
    console.error('getCpStats: codeforces failed:', err);
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
    if (contests.length === 0) return null;
    const { solved, difficulties } = mapAtcoderSolved(submissions, models);
    const rating = contests[contests.length - 1].ratingAfter;
    return {
      rating,
      peakRating: Math.max(...contests.map(c => c.ratingAfter)),
      rankLabel: atcoderRankLabel(rating),
      solved,
      contests,
      buckets: bucketize(difficulties, 400),
    };
  } catch (err) {
    console.error('getCpStats: atcoder failed:', err);
    return null;
  }
}

export async function getCpStats(fetcher: Fetcher = fetch, sleep: Sleep = defaultSleep): Promise<CpStats> {
  const [cf, atcoder] = await Promise.all([getCf(fetcher), getAtcoder(fetcher, sleep)]);
  return { cf, atcoder };
}
