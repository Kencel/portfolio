// Pure mappers from atcoder.jp history JSON and kenkoooo AtCoder Problems JSON.
import type { CpContest } from './types';
import { ATCODER_BANDS, bandFor } from './bands';

// kenkoooo's standard clipping: raw difficulties below 400 are internal model
// values (can be hugely negative); map them into (0, 400).
export function clipDifficulty(d: number): number {
  return d >= 400 ? d : Math.round(400 / Math.exp(1 - d / 400));
}

export function atcoderRankLabel(rating: number): string {
  return bandFor(ATCODER_BANDS, rating).label;
}

export function mapAtcoderContests(json: unknown): CpContest[] {
  if (!Array.isArray(json)) return [];
  const out: CpContest[] = [];
  for (const raw of json) {
    if (!raw || typeof raw !== 'object') continue;
    const r = raw as {
      IsRated?: unknown; Place?: unknown; OldRating?: unknown; NewRating?: unknown;
      Performance?: unknown; ContestScreenName?: unknown; ContestName?: unknown; EndTime?: unknown;
    };
    if (r.IsRated !== true) continue;
    if (
      typeof r.Place !== 'number' || typeof r.OldRating !== 'number' ||
      typeof r.NewRating !== 'number' || typeof r.Performance !== 'number' ||
      typeof r.ContestScreenName !== 'string' || typeof r.EndTime !== 'string'
    ) continue;
    const slug = r.ContestScreenName.split('.')[0];
    out.push({
      name: typeof r.ContestName === 'string' ? r.ContestName : slug,
      url: `https://atcoder.jp/contests/${slug}`,
      date: r.EndTime.slice(0, 10),
      ratingAfter: r.NewRating,
      delta: r.NewRating - r.OldRating,
      performance: r.Performance,
      rank: r.Place,
    });
  }
  return out;
}

export function mapAtcoderSolved(submissions: unknown, models: unknown): { solved: number; difficulties: number[] } {
  if (!Array.isArray(submissions)) return { solved: 0, difficulties: [] };
  const m = (models ?? {}) as Record<string, { difficulty?: unknown }>;
  const seen = new Set<string>();
  for (const raw of submissions) {
    if (!raw || typeof raw !== 'object') continue;
    const s = raw as { problem_id?: unknown; result?: unknown };
    if (s.result !== 'AC' || typeof s.problem_id !== 'string') continue;
    seen.add(s.problem_id);
  }
  const difficulties: number[] = [];
  for (const id of seen) {
    const d = m[id]?.difficulty;
    if (typeof d === 'number') difficulties.push(clipDifficulty(d));
  }
  return { solved: seen.size, difficulties };
}
