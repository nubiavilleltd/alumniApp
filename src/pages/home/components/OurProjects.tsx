
import { AppLink } from '@/shared/components/ui/AppLink';

import { useProjects } from '@/features/projects/hooks/useProjects';
import { Project } from '@/features/projects/types/project.types';

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-44 overflow-hidden bg-gray-100">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <AppLink
          href={`/projects/${project.id}`}
          className="text-primary-500 font-semibold text-sm hover:underline"
        >
          {project.title}
        </AppLink>
        <p className="text-gray-500 text-xs mt-1 mb-3">{project.description}</p>
        <span className="inline-block bg-primary-500 text-white text-xs px-3 py-1 rounded-full">
          {project.budget}
        </span>
      </div>
    </div>
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-6 bg-gray-200 rounded w-24 rounded-full" />
      </div>
    </div>
  );
}

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
            : projects.slice(0, 3).map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>

        <div className="mt-6 text-right">
          <AppLink
            href="/projects"
            className="text-primary-500 text-sm font-semibold hover:underline inline-flex items-center gap-1"
          >
            See More
          </AppLink>
        </div>
      </div>
    </section>
  );
}
