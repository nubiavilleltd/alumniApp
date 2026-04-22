import { Icon } from '@iconify/react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { useProjects } from '@/features/projects/hooks/useProjects';
import type { Project } from '@/features/projects/types/project.types';
import { ROUTES } from '@/shared/constants/routes';
import EmptyState from '@/shared/components/ui/EmptyState';
import { HomeSectionHeader } from './HomeSectionHeader';

const PROJECT_FALLBACK_IMAGES = [
  '/project-1.png',
  '/project-2.png',
  '/project-3.png',
  '/news-3.png',
];

function getProjectImage(project: Project, index: number) {
  return project.images?.[0] || PROJECT_FALLBACK_IMAGES[index % PROJECT_FALLBACK_IMAGES.length];
}

function getProjectMeta(project: Project) {
  const location = project.chapterName || 'FGGC Owerri';
  const year = project.createdAt ? new Date(project.createdAt).getFullYear().toString() : 'Ongoing';
  return { location, year };
}

function HomeProjectCard({ project, index }: { project: Project; index: number }) {
  const meta = getProjectMeta(project);

  return (
    <AppLink href={ROUTES.PROJECTS.DETAIL(project.id)} className="home-project-card">
      <img src={getProjectImage(project, index)} alt="" className="home-project-card__image" />

      <div className="home-project-card__panel">
        <h3>{project.title}</h3>
        <p>{project.description}</p>

        <div className="home-project-card__meta">
          <span>
            <Icon icon="mdi:map-marker-outline" aria-hidden="true" />
            {meta.location}
          </span>
          <span>
            <Icon icon="mdi:clock-outline" aria-hidden="true" />
            {meta.year}
          </span>
        </div>

        <span className="home-card-link">
          View Details
          <Icon icon="mdi:chevron-right" aria-hidden="true" />
        </span>
      </div>
    </AppLink>
  );
}

function HomeProjectSkeleton() {
  return (
    <div className="home-project-card home-project-card--skeleton">
      <div className="home-project-card__panel">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export default function OurProjects() {
  const { data: projects = [], isLoading } = useProjects();

  const isEmpty = !isLoading && projects.length === 0;

  return (
    <section className="home-feature-section">
      <div className="container-custom">
        <HomeSectionHeader
          eyebrow="Our Projects"
          title="Through the generosity of our alumnae, we continue to support and improve our beloved school"
          href={ROUTES.PROJECTS.ROOT}
        />

        {isEmpty ? (
          <EmptyState
            icon="mdi:hammer-wrench-outline"
            title="No projects available right now"
            description="No projects to display yet. New initiatives to support and improve our school will appear here."
          />
        ) : (
          <div className="home-projects-grid">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <HomeProjectSkeleton key={i} />)
              : projects
                  .slice(0, 4)
                  .map((project, index) => (
                    <HomeProjectCard key={project.id} project={project} index={index} />
                  ))}
          </div>
        )}
      </div>
    </section>
  );
}
