// Codeforces contest performance, computed the way the Carrot extension does it
// (github.com/meooow25/carrot, background/predict.js): performance is the
// pre-contest rating at which this contestant's rating delta would have been
// zero, found by re-running CF's rating algorithm over the contest.
// Pure — the caller fetches contest.standings and contest.ratingChanges.

export interface CfContestant { handle: string; points: number; penalty: number; rating: number }

const MIN_RATING = -500;
const MAX_RATING = 6000;
const RANGE = MAX_RATING - MIN_RATING;
const DEFAULT_RATING = 1400;
// From this contest on, CF reports unrated newcomers as oldRating 0; Carrot
// treats them as the 1400 the algorithm actually seeds them with.
const FAKE_RATINGS_SINCE_CONTEST = 1360;

// ELO[d + RANGE] = probability that a contestant rated x beats one rated x + d.
const ELO = new Float64Array(2 * RANGE + 1);
for (let d = -RANGE; d <= RANGE; d++) ELO[d + RANGE] = 1 / (1 + Math.pow(10, d / 400));
const winProb = (x: number, y: number) => ELO[y - x + RANGE];

function binarySearch(lo: number, hi: number, pred: (x: number) => boolean): number {
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (pred(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}

const clampRating = (r: number) => Math.min(Math.max(r, MIN_RATING), MAX_RATING - 1);

function resultOf(json: unknown): unknown {
  const j = json as { status?: string; result?: unknown } | null | undefined;
  return j && j.status === 'OK' ? j.result : undefined;
}

type RatingChange = { handle: string; rank: number; rating: number };

function ratingChanges(json: unknown, contestId: number): RatingChange[] {
  const result = resultOf(json);
  const out: RatingChange[] = [];
  for (const raw of Array.isArray(result) ? result : []) {
    const c = raw as { handle?: unknown; rank?: unknown; oldRating?: unknown } | null;
    if (!c || typeof c.handle !== 'string' || typeof c.rank !== 'number' || typeof c.oldRating !== 'number') continue;
    const rating = contestId >= FAKE_RATINGS_SINCE_CONTEST && c.oldRating === 0 ? DEFAULT_RATING : c.oldRating;
    out.push({ handle: c.handle, rank: c.rank, rating: clampRating(rating) });
  }
  return out;
}

// Carrot's input: the standings rows of everyone the contest rated, each with
// their pre-contest rating from ratingChanges. Malformed rows are dropped.
export function cfContestants(standingsJson: unknown, ratingChangesJson: unknown, contestId: number): CfContestant[] {
  const before = new Map(ratingChanges(ratingChangesJson, contestId).map(c => [c.handle, c.rating]));
  const rows = (resultOf(standingsJson) as { rows?: unknown } | undefined)?.rows;
  const out: CfContestant[] = [];
  for (const raw of Array.isArray(rows) ? rows : []) {
    const r = raw as { party?: { members?: { handle?: unknown }[] }; points?: unknown; penalty?: unknown } | null;
    const handle = r?.party?.members?.[0]?.handle;
    if (typeof handle !== 'string' || typeof r!.points !== 'number' || typeof r!.penalty !== 'number') continue;
    const rating = before.get(handle);
    if (rating !== undefined) out.push({ handle, points: r!.points, penalty: r!.penalty, rating });
  }
  return out;
}

// Fallback for contestants the anonymous standings leave out: CF only serves
// the official standings, so e.g. an account with under five rated contests is
// rated in a Div. 3 but listed as unofficial (Carrot shows no performance for
// them). Ranks everyone by their ratingChanges place instead — same algorithm,
// slightly different field.
export function cfContestantsByRank(ratingChangesJson: unknown, contestId: number): CfContestant[] {
  return ratingChanges(ratingChangesJson, contestId).map(c => ({ handle: c.handle, points: -c.rank, penalty: 0, rating: c.rating }));
}

// Returns null if the handle isn't among `contestants`, or if they won outright
// (Carrot shows ∞ for rank 1: no finite rating makes the winner's delta zero).
export function cfPerformance(contestants: CfContestant[], handle: string): number | null {
  const cs = [...contestants].sort((a, b) => b.points - a.points || a.penalty - b.penalty);
  const n = cs.length;
  const me = cs.findIndex(c => c.handle === handle);
  if (me < 0) return null;

  // Tied contestants all take the worst place in their group.
  const rank = new Array<number>(n);
  for (let i = n - 1; i >= 0; i--) {
    const tiedWithNext = i + 1 < n && cs[i + 1].points === cs[i].points && cs[i + 1].penalty === cs[i].penalty;
    rank[i] = tiedWithNext ? rank[i + 1] : i + 1;
  }
  if (rank[me] === 1) return null;

  // seed[r - MIN_RATING] = expected rank of an outsider rated r had they entered.
  const counts = new Map<number, number>();
  for (const c of cs) counts.set(c.rating, (counts.get(c.rating) ?? 0) + 1);
  const seed = new Float64Array(RANGE + 1).fill(1);
  for (const [v, k] of counts) {
    for (let r = MIN_RATING; r <= MAX_RATING; r++) seed[r - MIN_RATING] += k * winProb(v, r);
  }
  // Expected rank of the contestant actually rated `self`, had they been rated r.
  const getSeed = (r: number, self: number) => seed[r - MIN_RATING] - winProb(self, r);
  // Last rating at which the expected rank is still >= `target`.
  const rankToRating = (target: number, self: number) =>
    binarySearch(2, MAX_RATING, r => getSeed(r, self) < target) - 1;
  const calcDelta = (i: number, assumed: number) => {
    const mid = Math.sqrt(rank[i] * getSeed(assumed, cs[i].rating));
    return Math.trunc((rankToRating(mid, cs[i].rating) - assumed) / 2);
  };

  // CF's two zero-sum corrections, applied to everyone alike.
  const delta = cs.map((c, i) => calcDelta(i, c.rating));
  const inc1 = Math.trunc(-delta.reduce((a, b) => a + b, 0) / n) - 1;
  const byRating = [...cs.keys()].sort((a, b) => cs[b].rating - cs[a].rating);
  const top = Math.min(4 * Math.round(Math.sqrt(n)), n);
  let topSum = 0;
  for (let k = 0; k < top; k++) topSum += delta[byRating[k]] + inc1;
  const inc2 = Math.min(Math.max(Math.trunc(-topSum / top), -10), 0);
  const adjustment = inc1 + inc2;

  return binarySearch(MIN_RATING, MAX_RATING, a => calcDelta(me, a) + adjustment <= 0);
}
