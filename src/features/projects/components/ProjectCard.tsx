// features/projects/components/ProjectCard.tsx
//
// Full-bleed image card with a blue overlay panel at the bottom.
// Matches the design screenshot exactly.
// Admin Edit / Delete sit as icon buttons in the top-right corner of the image
// so they don't disturb the clean overlay layout.

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { useDeleteProject } from '../hooks/useProjects';
import type { Project } from '../types/project.types';
import { ROUTES } from '@/shared/constants/routes';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80';

// ─── Delete confirmation ──────────────────────────────────────────────────────

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

// ─── Card ─────────────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: Project;
  showAdminActions?: boolean;
  onEdit?: (project: Project) => void;
}

export function ProjectCard({ project, showAdminActions = false, onEdit }: ProjectCardProps) {
  const deleteMutation = useDeleteProject();
  const [showDelete, setShowDelete] = useState(false);

  const mainImage = project.images?.[0] || PLACEHOLDER;
  const isCompleted = project.status === 'completed';

  // Format amount for the location-style metadata line
  const amountLabel = project.amountRaised
    ? `₦${project.amountRaised.toLocaleString()} raised`
    : null;

  // Use createdAt year range as the "date" shown in the clock metadata
  const dateLabel = project.createdAt ? new Date(project.createdAt).getFullYear().toString() : null;

  const handleDelete = () => {
    deleteMutation.mutate(project.id, {
      onSuccess: () => setShowDelete(false),
    });
  };

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden shadow-md group aspect-[4/5] cursor-pointer">
        {/* Full-bleed image */}
        <div className="absolute inset-0">
          <img
            src={mainImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Admin controls — top-right corner, on top of image */}
        {showAdminActions && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              type="button"
              onClick={() => onEdit?.(project)}
              title="Edit project"
              className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow transition-colors"
            >
              <Icon icon="mdi:pencil-outline" className="w-3.5 h-3.5 text-primary-600" />
            </button>
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              title="Delete project"
              className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow transition-colors"
            >
              <Icon icon="mdi:trash-can-outline" className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>
        )}

        {/* Status badge — top-left */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
              isCompleted ? 'bg-green-500/90 text-white' : 'bg-primary-500/90 text-white'
            }`}
          >
            {isCompleted ? 'Completed' : 'Active'}
          </span>
        </div>

        {/* Blue overlay panel */}
        <div className="absolute bottom-0 left-0 right-0 bg-primary-600/80 backdrop-blur-[2px] rounded-2xl px-4 pt-3.5 pb-4">
          {/* Title */}
          <p className="text-white font-bold text-[15px] leading-snug line-clamp-1">
            {project.title}
          </p>

          {/* Description */}
          <p className="text-white/85 text-xs leading-relaxed mt-1 line-clamp-2">
            {project.description}
          </p>

          {/* Metadata row */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {project.chapterName && (
              <span className="flex items-center gap-1 text-white/80 text-[11px]">
                <Icon icon="mdi:map-marker-outline" className="w-3 h-3 flex-shrink-0" />
                {project.chapterName}
              </span>
            )}
            {amountLabel && (
              <span className="flex items-center gap-1 text-white/80 text-[11px]">
                <Icon icon="mdi:cash-outline" className="w-3 h-3 flex-shrink-0" />
                {amountLabel}
              </span>
            )}
            {dateLabel && (
              <span className="flex items-center gap-1 text-white/80 text-[11px]">
                <Icon icon="mdi:clock-outline" className="w-3 h-3 flex-shrink-0" />
                {dateLabel}
              </span>
            )}
          </div>

          {/* View details link */}
          <AppLink
            href={ROUTES.PROJECTS.DETAIL(project.id)}
            className="inline-flex items-center gap-0.5 text-white font-semibold text-xs mt-3 hover:text-white/80 transition-colors"
          >
            View Details
            <Icon icon="mdi:chevron-right" className="w-3.5 h-3.5" />
          </AppLink>
        </div>
      </div>

      {showDelete && (
        <DeleteConfirmModal
          title={project.title}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function ProjectCardSkeleton() {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[4/5] bg-gray-200 animate-pulse">
      <div className="absolute bottom-0 left-0 right-0 bg-gray-300 rounded-b-2xl p-4 space-y-2">
        <div className="h-4 bg-gray-400 rounded w-3/4" />
        <div className="h-3 bg-gray-400 rounded w-full" />
        <div className="h-3 bg-gray-400 rounded w-5/6" />
        <div className="flex gap-3 mt-1">
          <div className="h-2.5 bg-gray-400 rounded w-24" />
          <div className="h-2.5 bg-gray-400 rounded w-20" />
        </div>
        <div className="h-3 bg-gray-400 rounded w-16 mt-1" />
      </div>
    </div>
  );
}
