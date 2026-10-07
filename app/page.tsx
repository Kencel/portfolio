import { unstable_cache } from 'next/cache';
import { Portfolio } from '@/components/Portfolio';
import { getProjects } from '@/lib/projectsDb';
import { getCompetitions } from '@/lib/competitionsDb';
import { getCompprogStats, withCfPerformances, withCooldown, type PerfCache } from '@/lib/compprog/fetchStats';
import type { CompprogStats } from '@/lib/compprog/types';

// ISR: re-render at most once a minute. DB reads run every revalidation;
// the CF/AtCoder fetches have their own longer per-request cache TTLs.
export const revalidate = 60;

// A CF contest's performance is fixed once it's rated, but computing it means
// downloading that contest's multi-MB ratingChanges — so each result (a single
// number) is cached for good. Applied outside getCompprogStatsCached — see
// withCfPerformances for why. Bump the version if the computation changes.
// Contests that just failed sit out a cooldown (see withCooldown).
const cfPerfCache: PerfCache = withCooldown(
  (contestId, compute) => unstable_cache(compute, ['cf-perf-v1', String(contestId)], { revalidate: false })(),
  new Map(),
);

// The kenkoooo difficulty file (~4MB) exceeds Vercel's 2MB per-item data-cache
// limit, so per-fetch TTLs alone can't stop refetching it on every ISR pass.
// Caching the reduced CompprogStats (a few KB) runs the upstream fetches at most
// once an hour regardless. Bump the version if the mapping changes.
const getCompprogStatsCached = unstable_cache(() => getCompprogStats(), ['compprog-stats-v2'], { revalidate: 3600 });

const UNAVAILABLE: CompprogStats = { cf: null, atcoder: null };

export default async function Page() {
  // Comp prog stats are not awaited: their upstream APIs can be slow, so the
  // page streams out without them and the client fills them in as they land —
  // first with CF's approximate performances, then the real ones (each of
  // which may cost several big CF downloads). The fetchers never throw; the
  // catches are a last guard so a stage can't reject across to the client.
  const base = getCompprogStatsCached().catch(() => UNAVAILABLE);
  const full = base.then(stats => withCfPerformances(stats, cfPerfCache)).catch(() => base);
  const [projects, competitions] = await Promise.all([getProjects(), getCompetitions()]);
  return <Portfolio projects={projects} competitions={competitions} compprogStages={[base, full]} />;
}
