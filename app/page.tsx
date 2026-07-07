import { Portfolio } from '@/components/Portfolio';
import { getProjects } from '@/lib/projectsDb';

// ISR: re-fetch projects from Postgres at most once a minute.
export const revalidate = 60;

export default async function Page() {
  const projects = await getProjects();
  return <Portfolio projects={projects} />;
}
