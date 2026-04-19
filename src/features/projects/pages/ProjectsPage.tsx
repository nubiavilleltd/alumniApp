// // features/projects/pages/ProjectsPage.tsx

// import { useState, useMemo } from 'react';
// import { Icon } from '@iconify/react';
// import { SEO } from '@/shared/common/SEO';
// import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
// import { SearchInput } from '@/shared/components/ui/input/SearchInput';
// import EmptyState from '@/shared/components/ui/EmptyState';
// import { useProjects } from '../hooks/useProjects';
// import { ProjectCard, ProjectCardSkeleton } from '../components/ProjectCard';
// import { ProjectFormModal } from '../components/ProjectFormModal';
// import type { Project } from '../types/project.types';
// import { ROUTES } from '@/shared/constants/routes';
// import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';

// const ITEMS_PER_PAGE = 9;

// export default function ProjectsPage() {
//   const currentUser = useIdentityStore((state) => state.user);
//   const isAdmin = currentUser?.role === 'admin';

//   const [searchTerm, setSearchTerm] = useState('');
//   const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
//   const [showFormModal, setShowFormModal] = useState(false);
//   const [editProject, setEditProject] = useState<Project | null>(null);

//   const { data: projects = [], isLoading } = useProjects();

//   const filtered = useMemo(() => {
//     const q = searchTerm.trim().toLowerCase();
//     if (!q) return projects;
//     return projects.filter(
//       (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
//     );
//   }, [projects, searchTerm]);

//   const visible = filtered.slice(0, visibleCount);
//   const hasMore = visibleCount < filtered.length;

//   const openCreate = () => {
//     setEditProject(null);
//     setShowFormModal(true);
//   };
//   const openEdit = (p: Project) => {
//     setEditProject(p);
//     setShowFormModal(true);
//   };
//   const closeModal = () => {
//     setShowFormModal(false);
//     setEditProject(null);
//   };

//   const breadcrumbItems = [{ label: 'Home', href: ROUTES.HOME }, { label: 'Projects' }];

//   return (
//     <>
//       <SEO
//         title="Our Projects"
//         description="Through the generosity of our alumni, we continue to support and improve our beloved school."
//       />
//       <Breadcrumbs items={breadcrumbItems} />

//       <section className="section">
//         <div className="container-custom">
//           {/* Header */}
//           <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
//             <div className="text-center sm:text-left">
//               <h1 className="text-3xl md:text-4xl font-bold mb-2">
//                 Our <span className="text-primary-500 italic">Projects</span>
//               </h1>
//               <p className="text-gray-500 text-sm max-w-md">
//                 Through the generosity of our alumni, we continue to support and improve our beloved
//                 school
//               </p>
//             </div>
//             {isAdmin && (
//               <button
//                 type="button"
//                 onClick={openCreate}
//                 className="flex-shrink-0 flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors self-start sm:self-auto"
//               >
//                 <Icon icon="mdi:plus" className="w-4 h-4" />
//                 Create Project
//               </button>
//             )}
//           </div>

//           {/* Search */}
//           <div className="mb-8">
//             <SearchInput
//               label="Search Projects"
//               value={searchTerm}
//               onValueChange={(value) => {
//                 setSearchTerm(value);
//                 setVisibleCount(ITEMS_PER_PAGE);
//               }}
//               placeholder="Search projects..."
//               className="max-w-md"
//             />
//           </div>

//           {/* Grid */}
//           {isLoading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
//               {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
//                 <ProjectCardSkeleton key={i} />
//               ))}
//             </div>
//           ) : visible.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
//               {visible.map((project) => (
//                 <ProjectCard
//                   key={project.id}
//                   project={project}
//                   showAdminActions={isAdmin}
//                   onEdit={isAdmin ? openEdit : undefined}
//                 />
//               ))}
//             </div>
//           ) : (
//             <EmptyState
//               icon="mdi:folder-outline"
//               title="No projects found"
//               description={
//                 searchTerm
//                   ? 'Try adjusting your search.'
//                   : isAdmin
//                     ? 'No projects yet. Create the first one!'
//                     : 'Check back later for updates.'
//               }
//               actionLabel={isAdmin && !searchTerm ? 'Create Project' : undefined}
//               onAction={isAdmin && !searchTerm ? openCreate : undefined}
//             />
//           )}

//           {/* Load More */}
//           {hasMore && !isLoading && (
//             <div className="text-center">
//               <button
//                 type="button"
//                 onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
//                 className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-8 py-3 rounded-full transition-colors"
//               >
//                 Load More Projects
//               </button>
//             </div>
//           )}
//         </div>
//       </section>

//       <ProjectFormModal isOpen={showFormModal} onClose={closeModal} editData={editProject} />
//     </>
//   );
// }

// features/projects/pages/ProjectsPage.tsx
//
// Redesigned to match the screenshot:
// - Left-aligned "Our Projects" heading with subtitle
// - Filter row: search left, "Filter by Year" dropdown right (same pattern as AlumniDirectoryPage)
// - 4-column card grid with blue-overlay cards
// - Pagination component (replaces load-more)
// - Admin Create button in the header (visible only to admins)
// - Cream/off-white background

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { SearchInput } from '@/shared/components/ui/input/SearchInput';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
import { Pagination } from '@/shared/components/ui/Pagination';
import EmptyState from '@/shared/components/ui/EmptyState';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard, ProjectCardSkeleton } from '../components/ProjectCard';
import { ProjectFormModal } from '../components/ProjectFormModal';
import type { Project } from '../types/project.types';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';

// ─── Responsive items per page (mirrors AlumniDirectoryPage) ─────────────────

function useItemsPerPage() {
  const [items, setItems] = useState(12);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640)
        setItems(6); // mobile  — 1 col × 6
      else if (window.innerWidth < 1024)
        setItems(8); // tablet  — 2 col × 4
      else setItems(12); // desktop — 4 col × 3
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return items;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const currentUser = useIdentityStore((state) => state.user);
  const isAdmin = currentUser?.role === 'admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const ITEMS_PER_PAGE = useItemsPerPage();

  const { data: projects = [], isLoading } = useProjects();

  // Year options derived from projects
  const years = useMemo(
    () =>
      [
        ...new Set(
          projects
            .map((p) => (p.createdAt ? new Date(p.createdAt).getFullYear() : null))
            .filter(Boolean) as number[],
        ),
      ].sort((a, b) => b - a),
    [projects],
  );

  // Filtered list
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesSearch =
        !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchesYear =
        !yearFilter ||
        (p.createdAt && new Date(p.createdAt).getFullYear().toString() === yearFilter);
      return matchesSearch && matchesYear;
    });
  }, [projects, searchTerm, yearFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const visible = filtered.slice(pageStart, pageStart + ITEMS_PER_PAGE);

  const changePage = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setCurrentPage(1);
  };

  const openCreate = () => {
    setEditProject(null);
    setShowFormModal(true);
  };
  const openEdit = (p: Project) => {
    setEditProject(p);
    setShowFormModal(true);
  };
  const closeModal = () => {
    setShowFormModal(false);
    setEditProject(null);
  };

  return (
    <>
      <SEO
        title="Our Projects"
        description="Through the generosity of our alumni, we continue to support and improve our beloved school."
      />

      <section className="bg-gray-100 min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            {/* Text */}
            <div className="max-w-2xl">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Our Projects
              </h1>
              <p className="text-gray-500 text-sm sm:text-base mt-1">
                Through the generosity of our alumni, we continue to support and improve the world
                around us
              </p>
            </div>

            {/* Admin: Create Project button */}
            {isAdmin && visible.length > 0 && (
              <button
                type="button"
                onClick={openCreate}
                className="
        w-full sm:w-auto
        flex items-center justify-center gap-1.5
        bg-primary-500 hover:bg-primary-600
        text-white text-sm font-semibold
        px-4 py-2.5 rounded-lg transition-colors
      "
              >
                <Icon icon="mdi:plus" className="w-4 h-4" />
                Create Project
              </button>
            )}
          </div>

          {/* Filter row — identical layout to AlumniDirectoryPage */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-8">
            <div className="flex-1 w-full sm:max-w-xl">
              <SearchInput
                value={searchTerm}
                onValueChange={resetFilters(setSearchTerm)}
                placeholder="Search here"
              />
            </div>
            <div className="w-full sm:w-auto">
              <FilterDropdown
                value={yearFilter}
                onChange={resetFilters(setYearFilter)}
                placeholder="Filter by Year"
                options={years.map((y) => ({ label: String(y), value: String(y) }))}
              />
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : visible.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {visible.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  showAdminActions={isAdmin}
                  onEdit={isAdmin ? openEdit : undefined}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="mdi:folder-outline"
              title="No projects found"
              description={
                searchTerm || yearFilter
                  ? 'Try adjusting your search or filter.'
                  : isAdmin
                    ? 'No projects yet. Create the first one!'
                    : 'Check back later for updates.'
              }
              actionLabel={isAdmin && !searchTerm && !yearFilter ? 'Create Project' : undefined}
              onAction={isAdmin && !searchTerm && !yearFilter ? openCreate : undefined}
            />
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="sticky bottom-0 bg-gray-100 py-4 mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={changePage}
              />
            </div>
          )}
        </div>
      </section>

      <ProjectFormModal isOpen={showFormModal} onClose={closeModal} editData={editProject} />
    </>
  );
}
