// features/projects/pages/ProjectDetailsPage.tsx

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { SEO } from '@/shared/common/SEO';
import { useBreadcrumbOverride } from '@/shared/contexts/BreadcrumbContext';
import { useProjects } from '../hooks/useProjects';
import { ProjectNotFoundPage } from '../components/ProjectNotFoundPage';
import { ROUTES } from '@/shared/constants/routes';
import { formatDateRange } from '@/shared/utils/dateHelpers';
import { Calendar, MapPin, User } from 'lucide-react';
import placeholderImg from '/placeholder-image.png';


// const PLACEHOLDER = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProjectDetailsSkeleton() {
  return (
    <div className="container-custom py-6 sm:py-8 md:py-10 animate-pulse">
      <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 mb-4 sm:mb-6" />
      <div className="w-full h-56 sm:h-72 md:h-80 bg-gray-200 rounded-lg mb-4" />
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 w-14 sm:h-16 sm:w-16 bg-gray-200 rounded-md flex-shrink-0" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
}



// ─── Delete confirmation ──────────────────────────────────────────────────────


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();



  const { data: projects = [], isLoading } = useProjects();

  const [activeImage, setActiveImage] = useState(0);


  // const placeholderImages = ['https://placehold.co/80x80/E5E7EB/6B7280?text=No+Image'];
  const placeholderImages = [placeholderImg];
  const project = projects.find((p) => String(p.id) === id);


  useBreadcrumbOverride(
    project
      ? [
          { label: 'Home', href: ROUTES.HOME },
          { label: 'Projects', href: ROUTES.PROJECTS.ROOT },
          { label: project.title },
        ]
      : null
  );

  if (isLoading) return <ProjectDetailsSkeleton />;

  if (!project) return <ProjectNotFoundPage />;

  const images = project.images?.length ? project.images : placeholderImages;

  const dateRange = formatDateRange(project.startDate, project.endDate, {
    locale: 'en-GB',
    formatOptions: {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  });





  return (
    <>
      <SEO title={project.title} description={project.description} />

      <section className="section">
        <div className="container-custom">
          {/* Image gallery */}
          <div className="flex flex-col gap-3 mb-6 sm:mb-8">

            <div className="w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[420px] bg-gray-100 rounded-3xl overflow-hidden">
              <img
                src={images[activeImage]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === index
                        ? 'border-primary-500 ring-2 ring-primary-200'
                        : 'border-transparent hover:border-gray-300'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${project.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-primary-100 text-primary-700'
                    }`}
                >
                  {project.status === 'completed' ? 'Completed' : 'Ongoing'}
                </span>

              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                {project.title}
              </h1>
              {project.conductedBy && (
                <p className="mt-1 text-sm text-gray-600 flex items-center gap-1 flex-wrap">
                  {/* <Icon icon="mdi:account-outline" className="w-4 h-4" /> */}
                  <User size={15} />
                  {project.conductedBy}
                </p>
              )}
              {project.location && (
                <p className="mt-1 text-sm text-gray-600 flex items-center gap-1 flex-wrap">
                  {/* <Icon icon="mdi:map-marker-outline" className="w-4 h-4" /> */}
                  <MapPin size={15} />
                  {project.location}
                </p>
              )}
              {dateRange && (
                <p className="mt-1 text-sm text-gray-600 flex items-center gap-1 flex-wrap">
                  {/* <Icon icon="mdi:clock-outline" className="w-4 h-4" /> */}
                  <Calendar size={15} />
                  {dateRange}
                </p>
              )}
            </div>

          </div>


          {/* Description */}
          <div className="mt-6 sm:mt-8">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
              About this project
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
              {project.description}
            </p>
          </div>


        </div>
      </section>




    </>
  );
}
