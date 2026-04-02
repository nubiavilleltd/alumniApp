import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { SEO } from '@/shared/common/SEO';
import { ROUTES } from '@/shared/constants/routes';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { ProjectNotFoundPage } from '../components/ProjectNotFoundPage';

function ProjectDetailsSkeleton() {
  return (
    <div className="container-custom py-10 animate-pulse">
      {/* Title */}
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>

      {/* Main Image */}
      <div className="w-full h-80 bg-gray-200 rounded-lg mb-4"></div>

      {/* Thumbnails */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 w-16 bg-gray-200 rounded-md" />
        ))}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
}

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { data: projects = [], isLoading } = useProjects();

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

  const project = projects.find((p) => String(p.id) === id);

  const [activeImage, setActiveImage] = useState(0);

  // Show skeleton while loading
  if (isLoading) return <ProjectDetailsSkeleton />;

  if (!project) return <ProjectNotFoundPage />;

  const images = project.images?.length ? project.images : placeholderImages;

  const breadcrumbItems = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Projects', href: ROUTES.PROJECTS.ROOT },
    { label: project.title },
  ];

  return (
    <>
      <SEO title="Our Projects" description={project.title} />
      <Breadcrumbs items={breadcrumbItems} />
      <div className="container-custom py-10">
        <h1 className="text-2xl font-bold mb-6">{project.title}</h1>

        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          {/* Main Image */}
          <div className="w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
            <img src={images[activeImage]} className="w-full h-full object-cover" />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`h-16 w-16 rounded-md overflow-hidden border-2 ${
                  activeImage === index ? 'border-primary-500' : 'border-transparent'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="mt-6 text-gray-600">{project.description}</p>
      </div>
    </>
  );
}

// export default function ProjectDetailsPage() {
//   const { id } = useParams();
//   const { data: projects = [] } = useProjects();

// //   console.log("type", typeof id, typeof projects[0].id, {projects})
//   console.log("type", {projects})

//   const project = projects.find((p) => String(p.id) === id);

//   const [activeImage, setActiveImage] = useState(0);

//   if (!project) return <div>Project not found</div>;

//   const hasImages = project.images.length > 0;

//   return (
//     <div className="container-custom py-10">
//       <h1 className="text-2xl font-bold mb-6">{project.title}</h1>

//       {/* Image Gallery */}
//       <div className="flex flex-col gap-4">
//         {/* Main Image */}
//         <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
//           <img
//              src={
//     hasImages
//       ? project.images[activeImage]
//       : "https://source.unsplash.com/600x400/?construction"
//   }
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Thumbnails */}
//         <div className="flex gap-2 overflow-x-auto">
//           {project.images.map((img, index) => (
//             <button
//               key={index}
//               onClick={() => setActiveImage(index)}
//               className={`h-16 w-16 rounded-md overflow-hidden border-2 ${
//                 activeImage === index
//                   ? "border-primary-500"
//                   : "border-transparent"
//               }`}
//             >
//               <img
//                 src={img}
//                 className="w-full h-full object-cover"
//               />
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Description */}
//       <p className="mt-6 text-gray-600">{project.description}</p>
//     </div>
//   );
// }
