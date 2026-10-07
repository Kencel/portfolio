import { unstable_cache } from 'next/cache';
import { Portfolio } from '@/components/Portfolio';
import { getProjects } from '@/lib/projectsDb';
import { getCompetitions } from '@/lib/competitionsDb';
import { getCompprogStats, withCfPerformances, type PerfCache } from '@/lib/compprog/fetchStats';

// ISR: re-render at most once a minute. DB reads run every revalidation;
// the CF/AtCoder fetches have their own longer per-request cache TTLs.
export const revalidate = 60;

// A CF contest's performance is fixed once it's rated, but computing it means
// downloading that contest's multi-MB ratingChanges — so each result (a single
// number) is cached for good. Applied outside getCompprogStatsCached — see
// withCfPerformances for why. Bump the version if the computation changes.
const cfPerfCache: PerfCache = (contestId, compute) =>
  unstable_cache(compute, ['cf-perf-v1', String(contestId)], { revalidate: false })();

// The kenkoooo difficulty file (~4MB) exceeds Vercel's 2MB per-item data-cache
// limit, so per-fetch TTLs alone can't stop refetching it on every ISR pass.
// Caching the reduced CompprogStats (a few KB) runs the upstream fetches at most
// once an hour regardless. Bump the version if the mapping changes.
const getCompprogStatsCached = unstable_cache(() => getCompprogStats(), ['compprog-stats-v2'], { revalidate: 3600 });

export default async function Page() {
  const [projects, competitions, compprogStats] = await Promise.all([
    getProjects(),
    getCompetitions(),
    getCompprogStatsCached().then(stats => withCfPerformances(stats, cfPerfCache)),
  ]);
  return <Portfolio projects={projects} competitions={competitions} compprogStats={compprogStats} />;
}
