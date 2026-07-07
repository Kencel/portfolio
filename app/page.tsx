import { Portfolio } from '@/components/Portfolio';
import { getProjects } from '@/lib/projectsDb';
import { getCompetitions } from '@/lib/competitionsDb';
import { getCpStats } from '@/lib/cp/fetchStats';

// ISR: re-render at most once a minute. DB reads run every revalidation;
// the CF/AtCoder fetches have their own longer per-request cache TTLs.
export const revalidate = 60;

export default async function Page() {
  const [projects, competitions, cpStats] = await Promise.all([
    getProjects(),
    getCompetitions(),
    getCpStats(),
  ]);
  return <Portfolio projects={projects} competitions={competitions} cpStats={cpStats} />;
}
