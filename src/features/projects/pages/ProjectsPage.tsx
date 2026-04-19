// features/projects/pages/ProjectsPage.tsx

import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { SearchInput } from '@/shared/components/ui/input/SearchInput';
import EmptyState from '@/shared/components/ui/EmptyState';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard, ProjectCardSkeleton } from '../components/ProjectCard';
import { ProjectFormModal } from '../components/ProjectFormModal';
import type { Project } from '../types/project.types';
import { ROUTES } from '@/shared/constants/routes';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';

const ITEMS_PER_PAGE = 9;

export default function ProjectsPage() {
  const currentUser = useIdentityStore((state) => state.user);
  const isAdmin = currentUser?.role === 'admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const { data: projects = [], isLoading } = useProjects();

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [projects, searchTerm]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

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
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Our <span className="text-primary-500 italic">Projects</span>
              </h1>
              <p className="text-gray-500 text-sm max-w-md">
                Through the generosity of our alumni, we continue to support and improve our beloved
                school
              </p>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={openCreate}
                className="flex-shrink-0 flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors self-start sm:self-auto"
              >
                <Icon icon="mdi:plus" className="w-4 h-4" />
                Create Project
              </button>
            )}
          </div>

          {/* Search */}
          <div className="mb-8">
            <SearchInput
              label="Search Projects"
              value={searchTerm}
              onValueChange={(value) => {
                setSearchTerm(value);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              placeholder="Search projects..."
              className="max-w-md"
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
                searchTerm
                  ? 'Try adjusting your search.'
                  : isAdmin
                    ? 'No projects yet. Create the first one!'
                    : 'Check back later for updates.'
              }
              actionLabel={isAdmin && !searchTerm ? 'Create Project' : undefined}
              onAction={isAdmin && !searchTerm ? openCreate : undefined}
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

      <ProjectFormModal isOpen={showFormModal} onClose={closeModal} editData={editProject} />
    </>
  );
}
