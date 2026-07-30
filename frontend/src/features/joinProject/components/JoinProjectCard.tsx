// features/join-projects/components/JoinProjectCard.tsx

import { Clock, MapPin } from 'lucide-react';
import { formatDateRange } from '@/shared/utils/dateHelpers';

import placeholderImg from '/placeholder-image.png';
import { Project } from '@/features/projects/types/project.types';

interface JoinProjectCardProps {
  project: Project;
  onJoin?: (project: Project) => void;
}

export function JoinProjectCard({ project, onJoin }: JoinProjectCardProps) {
  const mainImage = project.images?.[0] || placeholderImg;

  const dateRange = formatDateRange(project.startDate, project.endDate, {
    locale: 'en-GB',
    formatOptions: {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  });

  const handleJoin = () => {
    if (onJoin) {
      onJoin(project);
    } else {
      console.log('Join project:', project.id);
    }
  };

  return (
    // <div className="bg-white rounded-3xl shadow-md overflow-hidden">
    <div className="bg-white border border-primary-200 rounded-2xl shadow-md overflow-hidden h-full flex flex-col">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden rounded-b-3xl">
        <img
          src={mainImage}
          alt={project.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-gray-900 font-bold text-xl leading-snug">{project.title}</h3>

        <p className="text-gray-500 text-sm leading-relaxed mt-2 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 mb-4">
          {project.location && (
            <span className="flex items-center gap-1.5 text-gray-500 text-sm">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              {project.location}
            </span>
          )}

          {dateRange && (
            <span className="flex items-center gap-1.5 text-gray-500 text-sm">
              <Clock className="w-4 h-4 flex-shrink-0" />
              {dateRange}
            </span>
          )}
        </div>

       <button
          type="button"
          onClick={handleJoin}
          className="mt-auto self-start inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary-500 hover:bg-primary-700 text-white font-bold text-sm transition-colors"
        >
          Join Now
        </button>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function JoinProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-5 space-y-2">
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="flex gap-4 mt-1">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
        <div className="h-9 bg-gray-200 rounded-full w-28 mt-3" />
      </div>
    </div>
  );
}