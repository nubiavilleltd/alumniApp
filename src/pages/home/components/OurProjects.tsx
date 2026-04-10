// pages/home/components/OurProjects.tsx

import { AppLink } from '@/shared/components/ui/AppLink';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { ProjectCard, ProjectCardSkeleton } from '@/features/projects/components/ProjectCard';
import { ROUTES } from '@/shared/constants/routes';

export default function OurProjects() {
  const { data: projects = [], isLoading } = useProjects();

  return (
    <section className="section">
      <div className="container-custom">
        <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-1 flex items-center gap-2">
          <span className="inline-block w-6 h-px bg-primary-500" />
          Our Projects
        </p>
        <p className="text-gray-600 text-sm mb-8">
          Through the generosity of our alumni, we continue to support and improve our beloved
          school
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <ProjectCardSkeleton key={i} />)
            : projects.slice(0, 3).map((project) => (
                // Homepage is always view-only — no admin actions shown here
                <ProjectCard key={project.id} project={project} showAdminActions={false} />
              ))}
        </div>

        <div className="mt-6 text-right">
          <AppLink
            href={ROUTES.PROJECTS.ROOT}
            className="text-primary-500 text-sm font-semibold hover:underline inline-flex items-center gap-1"
          >
            See More →
          </AppLink>
        </div>
      </div>
    </section>
  );
}
