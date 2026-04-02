// import { useParams } from 'react-router-dom';
// import { useState } from 'react';
// import { useProjects } from '@/features/projects/hooks/useProjects';
// import { SEO } from '@/shared/common/SEO';
// import { ROUTES } from '@/shared/constants/routes';
// import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
// import { ProjectNotFoundPage } from '../components/ProjectNotFoundPage';

// function ProjectDetailsSkeleton() {
//   return (
//     <div className="container-custom py-10 animate-pulse">
//       {/* Title */}
//       <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>

//       {/* Main Image */}
//       <div className="w-full h-80 bg-gray-200 rounded-lg mb-4"></div>

//       {/* Thumbnails */}
//       <div className="flex gap-2 mb-6">
//         {Array.from({ length: 4 }).map((_, i) => (
//           <div key={i} className="h-16 w-16 bg-gray-200 rounded-md" />
//         ))}
//       </div>

//       {/* Description */}
//       <div className="space-y-2">
//         <div className="h-4 bg-gray-200 rounded w-full"></div>
//         <div className="h-4 bg-gray-200 rounded w-5/6"></div>
//         <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//       </div>
//     </div>
//   );
// }

// export default function ProjectDetailsPage() {
//   const { id } = useParams();
//   const { data: projects = [], isLoading } = useProjects();

//   //   const placeholderImages = [
//   //   "https://dummyimage.com/200x200/ccc/000?text=1",
//   //   "https://dummyimage.com/200x200/ccc/000?text=2",
//   //   "https://dummyimage.com/200x200/ccc/000?text=3",
//   //   "https://dummyimage.com/200x200/ccc/000?text=4",
//   // ];
//   const placeholderImages = [
//     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80',
//     'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80',
//     'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80',
//     ,
//   ];

//   const project = projects.find((p) => String(p.id) === id);

//   const [activeImage, setActiveImage] = useState(0);

//   // Show skeleton while loading
//   if (isLoading) return <ProjectDetailsSkeleton />;

//   if (!project) return <ProjectNotFoundPage />;

//   const images = project.images?.length ? project.images : placeholderImages;

//   const breadcrumbItems = [
//     { label: 'Home', href: ROUTES.HOME },
//     { label: 'Projects', href: ROUTES.PROJECTS.ROOT },
//     { label: project.title },
//   ];

//   return (
//     <>
//       <SEO title="Our Projects" description={project.title} />
//       <Breadcrumbs items={breadcrumbItems} />
//       <div className="container-custom py-10">
//         <h1 className="text-2xl font-bold mb-6">{project.title}</h1>

//         {/* Image Gallery */}
//         <div className="flex flex-col gap-4">
//           {/* Main Image */}
//           <div className="w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
//             <img src={images[activeImage]} className="w-full h-full object-cover" />
//           </div>

//           {/* Thumbnails */}
//           <div className="flex gap-2 overflow-x-auto">
//             {images.map((img, index) => (
//               <button
//                 key={index}
//                 onClick={() => setActiveImage(index)}
//                 className={`h-16 w-16 rounded-md overflow-hidden border-2 ${
//                   activeImage === index ? 'border-primary-500' : 'border-transparent'
//                 }`}
//               >
//                 <img src={img} className="w-full h-full object-cover" />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Description */}
//         <p className="mt-6 text-gray-600">{project.description}</p>
//       </div>
//     </>
//   );
// }

// // export default function ProjectDetailsPage() {
// //   const { id } = useParams();
// //   const { data: projects = [] } = useProjects();

// // //   console.log("type", typeof id, typeof projects[0].id, {projects})
// //   console.log("type", {projects})

// //   const project = projects.find((p) => String(p.id) === id);

// //   const [activeImage, setActiveImage] = useState(0);

// //   if (!project) return <div>Project not found</div>;

// //   const hasImages = project.images.length > 0;

// //   return (
// //     <div className="container-custom py-10">
// //       <h1 className="text-2xl font-bold mb-6">{project.title}</h1>

// //       {/* Image Gallery */}
// //       <div className="flex flex-col gap-4">
// //         {/* Main Image */}
// //         <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
// //           <img
// //              src={
// //     hasImages
// //       ? project.images[activeImage]
// //       : "https://source.unsplash.com/600x400/?construction"
// //   }
// //             className="w-full h-full object-cover"
// //           />
// //         </div>

// //         {/* Thumbnails */}
// //         <div className="flex gap-2 overflow-x-auto">
// //           {project.images.map((img, index) => (
// //             <button
// //               key={index}
// //               onClick={() => setActiveImage(index)}
// //               className={`h-16 w-16 rounded-md overflow-hidden border-2 ${
// //                 activeImage === index
// //                   ? "border-primary-500"
// //                   : "border-transparent"
// //               }`}
// //             >
// //               <img
// //                 src={img}
// //                 className="w-full h-full object-cover"
// //               />
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Description */}
// //       <p className="mt-6 text-gray-600">{project.description}</p>
// //     </div>
// //   );
// // }

// features/projects/pages/ProjectDetailsPage.tsx

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { AppLink } from '@/shared/components/ui/AppLink';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { useProjects, useDeleteProject } from '../hooks/useProjects';
import { ProjectFormModal } from '../components/ProjectFormModal';
import { ProjectNotFoundPage } from '../components/ProjectNotFoundPage';
import type { Project } from '../types/project.types';
import { ROUTES } from '@/shared/constants/routes';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProjectDetailsSkeleton() {
  return (
    <div className="container-custom py-10 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-6" />
      <div className="w-full h-80 bg-gray-200 rounded-lg mb-4" />
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 w-16 bg-gray-200 rounded-md" />
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

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressSection({ project }: { project: Project }) {
  const { amountRaised, targetAmount } = project;
  const pct =
    targetAmount && targetAmount > 0
      ? Math.min(100, Math.round((amountRaised / targetAmount) * 100))
      : 0;

  return (
    <div className="bg-primary-50 rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
            Amount Raised
          </p>
          <p className="text-2xl font-bold text-primary-600">₦{amountRaised.toLocaleString()}</p>
        </div>
        {targetAmount && (
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Goal</p>
            <p className="text-xl font-bold text-gray-700">₦{targetAmount.toLocaleString()}</p>
          </div>
        )}
      </div>
      {targetAmount && (
        <>
          <div className="h-3 rounded-full bg-primary-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-right">{pct}% of goal reached</p>
        </>
      )}
    </div>
  );
}

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
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting && <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />}
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const currentUser = useAuthStore((state) => state.user);
  const isAdmin = currentUser?.role === 'admin';

  const { data: projects = [], isLoading } = useProjects();
  const deleteMutation = useDeleteProject();

  const [activeImage, setActiveImage] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  //   const placeholderImages = [
  //   "https://dummyimage.com/200x200/ccc/000?text=1",
  //   "https://dummyimage.com/200x200/ccc/000?text=2",
  //   "https://dummyimage.com/200x200/ccc/000?text=3",
  //   "https://dummyimage.com/200x200/ccc/000?text=4",
  // ];
  const placeholderImages = [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80',
    ,
  ];

  if (isLoading) return <ProjectDetailsSkeleton />;

  const project = projects.find((p) => String(p.id) === id);
  if (!project) return <ProjectNotFoundPage />;

  const images = project.images?.length ? project.images : placeholderImages;

  const breadcrumbItems = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Projects', href: ROUTES.PROJECTS.ROOT },
    { label: project.title },
  ];

  const handleDelete = () => {
    deleteMutation.mutate(project.id, {
      onSuccess: () => navigate(ROUTES.PROJECTS.ROOT),
    });
  };

  return (
    <>
      <SEO title={project.title} description={project.description} />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section">
        <div className="container-custom max-w-4xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    project.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-primary-100 text-primary-700'
                  }`}
                >
                  {project.status === 'completed' ? 'Completed' : 'Active'}
                </span>
                {Boolean(project.isFeatured) && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{project.title}</h1>
              {project.createdByName && (
                <p className="mt-1 text-sm text-gray-400 flex items-center gap-1">
                  <Icon icon="mdi:account-outline" className="w-4 h-4" />
                  {project.createdByName}
                  {project.chapterName && ` · ${project.chapterName}`}
                </p>
              )}
            </div>

            {/* Admin actions */}
            {isAdmin && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-1.5 border border-primary-200 text-primary-500 hover:bg-primary-50 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  <Icon icon="mdi:pencil-outline" className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  <Icon icon="mdi:trash-can-outline" className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Image gallery */}
          <div className="flex flex-col gap-3 mb-8">
            {/* Main image */}
            <div className="w-full h-[400px] md:h-[500px] bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={images[activeImage]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails — only when multiple images */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === index
                        ? 'border-primary-500 ring-2 ring-primary-200'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Progress */}
          <ProgressSection project={project} />

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About this project</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {/* Back link */}
          <div className="mt-10">
            <AppLink
              href={ROUTES.PROJECTS.ROOT}
              className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 text-sm font-semibold"
            >
              <Icon icon="mdi:arrow-left" className="w-4 h-4" />
              Back to all projects
            </AppLink>
          </div>
        </div>
      </section>

      {/* Edit modal */}
      <ProjectFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        editData={project}
      />

      {/* Delete confirmation */}
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
