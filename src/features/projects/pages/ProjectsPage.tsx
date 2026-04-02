import { Icon } from '@iconify/react';
import { useState, useMemo } from 'react';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { SearchInput } from '@/shared/components/ui/input/SearchInput';
import EmptyState from '@/shared/components/ui/EmptyState';
import { useProjects } from '@/features/projects/hooks/useProjects';
import type { Project } from '@/features/projects/types/project.types';
import { ROUTES } from '@/shared/constants/routes';
import { AppLink } from '@/shared/components/ui/AppLink';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse flex flex-col">
      <div className="h-48 w-full bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="flex items-center justify-between mt-2">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-8 bg-gray-200 rounded-full w-28" />
        </div>
      </div>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
// function ProjectCard({ project }: { project: Project }) {
//   return (
//     <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
//       {/* Image */}
//       <div className="h-48 w-full overflow-hidden bg-gray-100">
//         <img
//           src={project?.images[0] || "https://source.unsplash.com/600x400/?construction"}
//           alt={project.title}
//           className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//           loading="lazy"
//         />
//       </div>

//       {/* Info */}
//       <div className="p-4 flex flex-col gap-2 flex-1">
//         <h3 className="text-primary-500 font-bold text-sm leading-snug">{project.title}</h3>
//         <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">
//           {project.description}
//         </p>

//         {/* Budget + Action */}
//         <div className="mt-auto pt-3 flex items-center justify-between">
//           {project.amountRaised && (
//             <div className="flex items-center gap-1 text-gray-600 text-xs font-semibold">
//               <Icon icon="mdi:cash-outline" className="w-3.5 h-3.5 text-primary-400" />
//               {project.amountRaised}
//             </div>
//           )}
//           <AppLink
//             href={ROUTES.PROJECTS.DETAIL(project.id)}
//             className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
//           >
//             <Icon icon="mdi:heart-outline" className="w-3.5 h-3.5" />
//             View Project
//           </AppLink>
//         </div>
//       </div>
//     </div>
//   );
// }

function ProjectCard({ project }: { project: Project }) {
  // Define a fallback image (local or online)
  const placeholderImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80';
  // const placeholderImage = "https://dummyimage.com/600x400/ccc/000?text=No+Image";
  const mainImage = project.images?.[0] || placeholderImage;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      {/* Image */}
      <div className="h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={project.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-primary-500 font-bold text-sm leading-snug">{project.title}</h3>
        <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Budget + Action */}
        <div className="mt-auto pt-3 flex items-center justify-between">
          {project.amountRaised && (
            <div className="flex items-center gap-1 text-gray-600 text-xs font-semibold">
              {/* <Icon icon="mdi:cash-outline" className="w-3.5 h-3.5 text-primary-400" /> */}
              <span className="inline-block bg-primary-500 text-white text-xs px-3 py-1 rounded-full">
                {`₦${project.amountRaised.toLocaleString()}`}
              </span>
            </div>
          )}
          <AppLink
            href={ROUTES.PROJECTS.DETAIL(project.id)}
            className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
          >
            <Icon icon="mdi:heart-outline" className="w-3.5 h-3.5" />
            View Project
          </AppLink>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 9;

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // ── Hook ───────────────────────────────────────────────────────────────────
  const { data: projects = [], isLoading } = useProjects();

  console.log('data => ', { projects });

  // ── Client-side filtering ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [projects, searchTerm]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const breadcrumbItems = [{ label: 'Home', href: ROUTES.HOME }, { label: 'Projects' }];

  return (
    <>
      <SEO
        title="Our Projects"
        description="Through the generosity of our alumni, we continue to support and improve our beloved school."
      />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Our <span className="text-primary-500 italic">Projects</span>
            </h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Through the generosity of our alumni, we continue to support and improve our beloved
              school
            </p>
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row items-end gap-3 mb-8">
            <SearchInput
              label="Search Projects"
              value={searchTerm}
              onValueChange={(value) => {
                setSearchTerm(value);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              placeholder="Search projects..."
              className="flex-1"
            />
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : visible.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {visible.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="mdi:folder-outline"
              title="No projects found"
              description="Try adjusting your search or check back later."
            />
          )}

          {/* Load More */}
          {hasMore && !isLoading && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-8 py-3 rounded-full transition-colors"
              >
                Load More Projects
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
