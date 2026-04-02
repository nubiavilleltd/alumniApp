// features/projects/components/ProjectCard.tsx
//
// Single shared card used by ProjectsPage, OurProjects (homepage), and anywhere
// else a project is listed. Admin actions only appear when showAdminActions=true.

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { AppLink } from '@/shared/components/ui/AppLink';
import { useDeleteProject } from '../hooks/useProjects';
import type { Project } from '../types/project.types';
import { ROUTES } from '@/shared/constants/routes';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80';

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ raised, target }: { raised: number; target: number }) {
  const pct = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] text-gray-500">
        <span>₦{raised.toLocaleString()} raised</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {target > 0 && (
        <p className="text-[10px] text-gray-400 text-right">Goal: ₦{target.toLocaleString()}</p>
      )}
    </div>
  );
}

// ─── Delete confirmation modal ────────────────────────────────────────────────

function DeleteConfirmModal({
  title,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-1">Delete Project?</h3>
            <p className="text-gray-600 text-sm">
              Are you sure you want to delete <span className="font-semibold">{title}</span>? This
              action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-end mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting && <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />}
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: Project;
  /** When true, renders Edit and Delete controls (admin only). Default: false */
  showAdminActions?: boolean;
  /** Called when the Edit button is clicked. If omitted, navigates to edit route. */
  onEdit?: (project: Project) => void;
}

export function ProjectCard({ project, showAdminActions = false, onEdit }: ProjectCardProps) {
  const navigate = useNavigate();
  const deleteMutation = useDeleteProject();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const mainImage = project.images?.[0] || PLACEHOLDER;
  const isCompleted = project.status === 'completed';

  const handleDelete = () => {
    deleteMutation.mutate(project.id, {
      onSuccess: () => setShowDeleteModal(false),
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <img
            src={mainImage}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Status badge */}
          <span
            className={`absolute top-2 left-2 text-[10px] font-semibold px-2.5 py-1 rounded-full ${
              isCompleted ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'
            }`}
          >
            {isCompleted ? 'Completed' : 'Active'}
          </span>
          {/* Image count badge */}
          {project.images.length > 1 && (
            <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Icon icon="mdi:image-multiple-outline" className="w-3 h-3" />
              {project.images.length}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <h3 className="text-primary-600 font-bold text-sm leading-snug">{project.title}</h3>

          {project.createdByName && (
            <p className="text-gray-400 text-[10px] flex items-center gap-1">
              <Icon icon="mdi:account-outline" className="w-3 h-3" />
              {project.createdByName}
            </p>
          )}

          <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">
            {project.description}
          </p>

          {/* Progress */}
          <div className="mt-1">
            {project.targetAmount ? (
              <ProgressBar raised={project.amountRaised} target={project.targetAmount} />
            ) : (
              <p className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                <Icon icon="mdi:cash-outline" className="w-3.5 h-3.5 text-primary-400" />₦
                {project.amountRaised.toLocaleString()} raised
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto pt-3 flex items-center justify-between">
            <AppLink
              href={ROUTES.PROJECTS.DETAIL(project.id)}
              className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
            >
              <Icon icon="mdi:eye-outline" className="w-3.5 h-3.5" />
              View Project
            </AppLink>

            {showAdminActions && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onEdit
                      ? onEdit(project)
                      : navigate(`${ROUTES.PROJECTS.DETAIL(project.id)}/edit`)
                  }
                  className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 transition-colors"
                >
                  <Icon icon="mdi:pencil-outline" className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
                >
                  <Icon icon="mdi:trash-can-outline" className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          title={project.title}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse flex flex-col">
      <div className="h-48 w-full bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-2 bg-gray-200 rounded-full w-full mt-1" />
        <div className="flex items-center justify-between mt-2">
          <div className="h-8 bg-gray-200 rounded-full w-28" />
        </div>
      </div>
    </div>
  );
}
