// Pure mappers from Codeforces API JSON to compprog dashboard types. Fetching lives
// in lib/compprog/fetchStats.ts; keeping these pure makes them unit-testable.
import type { CompprogContest } from './types';

type CfEnvelope = { status?: string; result?: unknown[] };

function resultRows(json: unknown): unknown[] {
  const j = json as CfEnvelope | null | undefined;
  return j && j.status === 'OK' && Array.isArray(j.result) ? j.result : [];
}

function titleCase(s: string): string {
  return s.replace(/\b\w/g, ch => ch.toUpperCase());
}

// Placeholder until the real figure is computed (lib/compprog/cfPerf.ts, via
// withCfPerformances): CF's update is roughly new = old + (perf - old)/2. Can be
// off by a few hundred, especially in an account's first contests.
export function cfPerfApprox(oldRating: number, newRating: number): number {
  return oldRating + 2 * (newRating - oldRating);
}

const CONTEST_URL = /^https:\/\/codeforces\.com\/contest\/(\d+)$/;

// Recovers the id from a CompprogContest built by mapCfContests.
export function cfContestId(contest: { url: string }): number | null {
  const m = CONTEST_URL.exec(contest.url);
  return m ? Number(m[1]) : null;
}

export function mapCfInfo(json: unknown): { rating: number; peakRating: number; rankLabel: string } | null {
  const u = resultRows(json)[0] as { rating?: unknown; maxRating?: unknown; rank?: unknown } | undefined;
  if (!u || typeof u.rating !== 'number' || typeof u.maxRating !== 'number') return null;
  return {
    rating: u.rating,
    peakRating: u.maxRating,
    rankLabel: typeof u.rank === 'string' ? titleCase(u.rank) : '',
  };
}

export function mapCfContests(json: unknown): CompprogContest[] {
  const out: CompprogContest[] = [];
  for (const raw of resultRows(json)) {
    if (!raw || typeof raw !== 'object') continue;
    const r = raw as {
      contestId?: unknown; contestName?: unknown; rank?: unknown;
      ratingUpdateTimeSeconds?: unknown; oldRating?: unknown; newRating?: unknown;
    };
    if (
      typeof r.contestId !== 'number' || typeof r.rank !== 'number' ||
      typeof r.ratingUpdateTimeSeconds !== 'number' ||
      typeof r.oldRating !== 'number' || typeof r.newRating !== 'number'
    ) continue;
    out.push({
      name: typeof r.contestName === 'string' ? r.contestName : `Contest ${r.contestId}`,
      url: `https://codeforces.com/contest/${r.contestId}`,
      date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10),
      ratingAfter: r.newRating,
      delta: r.newRating - r.oldRating,
      performance: cfPerfApprox(r.oldRating, r.newRating),
      rank: r.rank,
    });
  }
  return out;
}

export function mapCfSolved(json: unknown): { solved: number; ratings: number[] } {
  const seen = new Set<string>();
  const ratings: number[] = [];
  for (const raw of resultRows(json)) {
    if (!raw || typeof raw !== 'object') continue;
    const s = raw as { verdict?: unknown; problem?: { contestId?: unknown; index?: unknown; rating?: unknown } };
    if (s.verdict !== 'OK' || !s.problem) continue;
    const key = `${s.problem.contestId}-${s.problem.index}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (typeof s.problem.rating === 'number') ratings.push(s.problem.rating);
  }
  return { solved: seen.size, ratings };
}
