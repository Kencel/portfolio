import { unstable_cache } from 'next/cache';
import { Portfolio } from '@/components/Portfolio';
import { getProjects } from '@/lib/projectsDb';
import { getCompetitions } from '@/lib/competitionsDb';
import { getCompprogStats } from '@/lib/compprog/fetchStats';

// ISR: re-render at most once a minute. DB reads run every revalidation;
// the CF/AtCoder fetches have their own longer per-request cache TTLs.
export const revalidate = 60;

// The kenkoooo difficulty file (~4MB) exceeds Vercel's 2MB per-item data-cache
// limit, so per-fetch TTLs alone can't stop refetching it on every ISR pass.
// Caching the reduced CompprogStats (a few KB) runs the upstream fetches at most
// once an hour regardless.
const getCompprogStatsCached = unstable_cache(() => getCompprogStats(), ['compprog-stats'], { revalidate: 3600 });

export default async function Page() {
  const [projects, competitions, compprogStats] = await Promise.all([
    getProjects(),
    getCompetitions(),
    getCompprogStatsCached(),
  ]);
  return <Portfolio projects={projects} competitions={competitions} compprogStats={compprogStats} />;
}
