import { unstable_cache } from 'next/cache';
import { Portfolio } from '@/components/Portfolio';
import { getProjects } from '@/lib/projectsDb';
import { getCompetitions } from '@/lib/competitionsDb';
import { getCpStats } from '@/lib/cp/fetchStats';

// ISR: re-render at most once a minute. DB reads run every revalidation;
// the CF/AtCoder fetches have their own longer per-request cache TTLs.
export const revalidate = 60;

// The kenkoooo difficulty file (~4MB) exceeds Vercel's 2MB per-item data-cache
// limit, so per-fetch TTLs alone can't stop refetching it on every ISR pass.
// Caching the reduced CpStats (a few KB) runs the upstream fetches at most
// once an hour regardless.
const getCpStatsCached = unstable_cache(() => getCpStats(), ['cp-stats'], { revalidate: 3600 });

export default async function Page() {
  const [projects, competitions, cpStats] = await Promise.all([
    getProjects(),
    getCompetitions(),
    getCpStatsCached(),
  ]);
  return <Portfolio projects={projects} competitions={competitions} cpStats={cpStats} />;
}
