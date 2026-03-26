// import { Icon } from '@iconify/react';
// import { useState } from 'react';
// import { SEO } from '@/shared/common/SEO';
// import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
// import EmptyState from '@/shared/components/ui/EmptyState';
// import { PostBusinessModal } from '../components/PostYourBusinessModal';
// import { useMarketplace } from '@/features/marketplace/hooks/useMarketplace';
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// import type { Business } from '../types/marketplace.types';

// // ─── Skeleton ─────────────────────────────────────────────────────────────────
// function MyBusinessCardSkeleton() {
//   return (
//     <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse flex flex-col">
//       <div className="h-44 w-full bg-gray-200" />
//       <div className="p-4 flex flex-col gap-2">
//         <div className="h-3 bg-gray-200 rounded w-1/4" />
//         <div className="h-4 bg-gray-200 rounded w-3/4" />
//         <div className="h-3 bg-gray-200 rounded w-full" />
//         <div className="h-3 bg-gray-200 rounded w-5/6" />
//         <div className="flex flex-col gap-1.5 mt-1">
//           <div className="h-3 bg-gray-200 rounded w-2/3" />
//           <div className="h-3 bg-gray-200 rounded w-1/2" />
//         </div>
//         <div className="flex gap-2 mt-2">
//           <div className="flex-1 h-8 bg-gray-200 rounded-lg" />
//           <div className="flex-1 h-8 bg-gray-200 rounded-lg" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Business Card ────────────────────────────────────────────────────────────
// function MyBusinessCard({
//   business,
//   onEdit,
//   onDelete,
// }: {
//   business: Business;
//   onEdit: (business: Business) => void;
//   onDelete: (business: Business) => void;
// }) {
//   const [imgIndex, setImgIndex] = useState(0);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   const prev = (e: React.MouseEvent) => {
//     e.preventDefault();
//     setImgIndex((i) => (i === 0 ? business.images.length - 1 : i - 1));
//   };

//   const next = (e: React.MouseEvent) => {
//     e.preventDefault();
//     setImgIndex((i) => (i === business.images.length - 1 ? 0 : i + 1));
//   };

//   return (
//     <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
//       {/* Image carousel */}
//       <div className="relative h-44 w-full overflow-hidden bg-gray-100 group">
//         <img
//           src={business.images[imgIndex]}
//           alt={business.name}
//           className="w-full h-full object-cover transition-all duration-300"
//           loading="lazy"
//         />
//         {business.images.length > 1 && (
//           <>
//             <button
//               onClick={prev}
//               className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
//             >
//               <Icon icon="mdi:chevron-left" className="w-4 h-4 text-gray-700" />
//             </button>
//             <button
//               onClick={next}
//               className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
//             >
//               <Icon icon="mdi:chevron-right" className="w-4 h-4 text-gray-700" />
//             </button>
//           </>
//         )}
//         {business.images.length > 1 && (
//           <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
//             {business.images.map((_, i) => (
//               <span
//                 key={i}
//                 className={`block rounded-full transition-all duration-200 ${
//                   i === imgIndex ? 'w-3 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
//                 }`}
//               />
//             ))}
//           </div>
//         )}
//         <span className="absolute top-2 left-2 bg-primary-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide">
//           {business.category}
//         </span>
//       </div>

//       {/* Info */}
//       <div className="p-4 flex flex-col gap-1.5 flex-1">
//         <h3 className="text-gray-900 font-bold text-sm leading-tight">{business.name}</h3>
//         <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">
//           {business.description}
//         </p>
//         <div className="flex flex-col gap-1 mt-1">
//           <span className="flex items-center gap-1 text-gray-400 text-[11px]">
//             <Icon icon="mdi:map-marker-outline" className="w-3 h-3 flex-shrink-0" />
//             {business.location}
//           </span>
//           <span className="flex items-center gap-1 text-gray-400 text-[11px]">
//             <Icon icon="mdi:phone-outline" className="w-3 h-3 flex-shrink-0" />
//             {business.phone}
//           </span>
//           {business.website && (
//             <span className="flex items-center gap-1 text-gray-400 text-[11px]">
//               <Icon icon="mdi:web" className="w-3 h-3 flex-shrink-0" />
//               {business.website}
//             </span>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex items-center gap-2 mt-3">
//           <button
//             type="button"
//             onClick={() => onEdit(business)}
//             className="flex-1 flex items-center justify-center gap-1.5 border border-primary-200 text-primary-500 hover:bg-primary-50 text-xs font-semibold py-2 rounded-lg transition-colors"
//           >
//             <Icon icon="mdi:pencil-outline" className="w-3.5 h-3.5" />
//             Edit
//           </button>

//           {showDeleteConfirm ? (
//             <div className="flex-1 flex items-center gap-1.5">
//               <button
//                 type="button"
//                 onClick={() => onDelete(business)}
//                 className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
//               >
//                 <Icon icon="mdi:check" className="w-3.5 h-3.5" />
//                 Confirm
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setShowDeleteConfirm(false)}
//                 className="flex-1 flex items-center justify-center gap-1 border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs font-semibold py-2 rounded-lg transition-colors"
//               >
//                 <Icon icon="mdi:close" className="w-3.5 h-3.5" />
//                 Cancel
//               </button>
//             </div>
//           ) : (
//             <button
//               type="button"
//               onClick={() => setShowDeleteConfirm(true)}
//               className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold py-2 rounded-lg transition-colors"
//             >
//               <Icon icon="mdi:trash-can-outline" className="w-3.5 h-3.5" />
//               Delete
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────
// export default function MyBusinessPage() {
//   const currentUser = useAuthStore((state) => state.user);
//   const [showPostModal, setShowPostModal] = useState(false);
//   const [editBusiness, setEditBusiness] = useState<Business | null>(null);

//   const { data: allBusinesses = [], isLoading } = useMarketplace();

//   // Filter to only the current user's businesses using memberId — not slug
//   const myBusinesses = allBusinesses.filter((b) => b.ownerId === currentUser?.memberId);

//   const handleEdit = (business: Business) => {
//     setEditBusiness(business);
//     setShowPostModal(true);
//   };

//   const handleDelete = (business: Business) => {
//     // 🔴 TODO: call deleteBusinessMutation
//     // await deleteBusiness(business.businessId);
//     console.log('Deleting business:', business.businessId);
//   };

//   const handleCloseModal = () => {
//     setShowPostModal(false);
//     setEditBusiness(null);
//   };

//   const breadcrumbItems = [
//     { label: 'Home', href: '/' },
//     { label: 'Marketplace', href: '/marketplace' },
//     { label: 'My Business' },
//   ];

//   return (
//     <>
//       <SEO
//         title="My Business"
//         description="Manage your business listings on the Alumnae Marketplace."
//       />
//       <Breadcrumbs items={breadcrumbItems} />

//       <section className="section">
//         <div className="container-custom">
//           {/* Header */}
//           <div className="flex items-start justify-between mb-8">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold mb-1">
//                 My <span className="text-primary-500 italic">Business</span>
//               </h1>
//               <p className="text-gray-500 text-sm">
//                 Manage and update your business listings in the Alumnae Marketplace.
//               </p>
//             </div>
//             <button
//               type="button"
//               onClick={() => setShowPostModal(true)}
//               className="flex-shrink-0 flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
//             >
//               <Icon icon="mdi:plus" className="w-4 h-4" />
//               Add Business
//             </button>
//           </div>

//           {/* Grid */}
//           {isLoading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//               {Array.from({ length: 3 }).map((_, i) => (
//                 <MyBusinessCardSkeleton key={i} />
//               ))}
//             </div>
//           ) : myBusinesses.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//               {myBusinesses.map((business) => (
//                 <MyBusinessCard
//                   key={business.businessId}
//                   business={business}
//                   onEdit={handleEdit}
//                   onDelete={handleDelete}
//                 />
//               ))}
//             </div>
//           ) : (
//             <EmptyState
//               icon="mdi:storefront-outline"
//               title="You have no business listings yet"
//               description="Add your business to the Alumnae Marketplace and let your sisters find and support you."
//               actionLabel="Add Your Business"
//               onAction={() => setShowPostModal(true)}
//             />
//           )}
//         </div>
//       </section>

//       <PostBusinessModal
//         isOpen={showPostModal}
//         onClose={handleCloseModal}
//         editData={editBusiness}
//       />
//     </>
//   );
// }

// features/marketplace/pages/MyBusinessPage.tsx

import { Icon } from '@iconify/react';
import { useState } from 'react';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import EmptyState from '@/shared/components/ui/EmptyState';
import { PostBusinessModal } from '../components/PostYourBusinessModal';
import { useMyBusinesses, useDeleteListing } from '../hooks/useMarketplace';
import type { Business } from '../types/marketplace.types';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function MyBusinessCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse flex flex-col">
      <div className="h-44 w-full bg-gray-200" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="flex gap-2 mt-2">
          <div className="flex-1 h-8 bg-gray-200 rounded-lg" />
          <div className="flex-1 h-8 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ─── Business Card ────────────────────────────────────────────────────────────
function MyBusinessCard({
  business,
  onEdit,
  onDelete,
  isDeleting,
}: {
  business: Business;
  onEdit: (business: Business) => void;
  onDelete: (business: Business) => void;
  isDeleting: boolean;
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex((i) => (i === 0 ? business.images.length - 1 : i - 1));
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex((i) => (i === business.images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      {/* Image carousel */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-100 group">
        {business.images.length > 0 ? (
          <img
            src={business.images[imgIndex]}
            alt={business.name}
            className="w-full h-full object-cover transition-all duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <Icon icon="mdi:storefront-outline" className="w-12 h-12 text-gray-300" />
          </div>
        )}
        {business.images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon icon="mdi:chevron-left" className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon icon="mdi:chevron-right" className="w-4 h-4 text-gray-700" />
            </button>
          </>
        )}
        {business.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {business.images.map((_, i) => (
              <span
                key={i}
                className={`block rounded-full transition-all duration-200 ${
                  i === imgIndex ? 'w-3 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
        <span className="absolute top-2 left-2 bg-primary-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide">
          {business.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="text-gray-900 font-bold text-sm leading-tight">{business.name}</h3>
        <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">
          {business.description}
        </p>
        <div className="flex flex-col gap-1 mt-1">
          <span className="flex items-center gap-1 text-gray-400 text-[11px]">
            <Icon icon="mdi:map-marker-outline" className="w-3 h-3 flex-shrink-0" />
            {business.location}
          </span>
          <span className="flex items-center gap-1 text-gray-400 text-[11px]">
            <Icon icon="mdi:phone-outline" className="w-3 h-3 flex-shrink-0" />
            {business.phone}
          </span>
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary-500 hover:text-primary-600 text-[11px] truncate"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon icon="mdi:web" className="w-3 h-3 flex-shrink-0" />
              {business.website}
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={() => onEdit(business)}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-1.5 border border-primary-200 text-primary-500 hover:bg-primary-50 text-xs font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Icon icon="mdi:pencil-outline" className="w-3.5 h-3.5" />
            Edit
          </button>

          {showDeleteConfirm ? (
            <div className="flex-1 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onDelete(business)}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <Icon icon="mdi:loading" className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Icon icon="mdi:check" className="w-3.5 h-3.5" />
                )}
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-1 border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs font-semibold py-2 rounded-lg transition-colors"
              >
                <Icon icon="mdi:close" className="w-3.5 h-3.5" />
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Icon icon="mdi:trash-can-outline" className="w-3.5 h-3.5" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MyBusinessPage() {
  const [showPostModal, setShowPostModal] = useState(false);
  const [editBusiness, setEditBusiness] = useState<Business | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: myBusinesses = [], isLoading, refetch } = useMyBusinesses();
  const deleteMutation = useDeleteListing();

  const handleEdit = (business: Business) => {
    setEditBusiness(business);
    setShowPostModal(true);
  };

  const handleDelete = async (business: Business) => {
    setDeletingId(business.businessId);
    deleteMutation.mutate(business.businessId, {
      onSettled: () => {
        setDeletingId(null);
        refetch();
      },
    });
  };

  const handleCloseModal = () => {
    setShowPostModal(false);
    setEditBusiness(null);
    refetch();
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'My Business' },
  ];

  return (
    <>
      <SEO
        title="My Business"
        description="Manage your business listings on the Alumnae Marketplace."
      />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section">
        <div className="container-custom">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">
                My <span className="text-primary-500 italic">Business</span>
              </h1>
              <p className="text-gray-500 text-sm">
                Manage and update your business listings in the Alumnae Marketplace.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPostModal(true)}
              className="flex-shrink-0 flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Icon icon="mdi:plus" className="w-4 h-4" />
              Add Business
            </button>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <MyBusinessCardSkeleton key={i} />
              ))}
            </div>
          ) : myBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {myBusinesses.map((business) => (
                <MyBusinessCard
                  key={business.businessId}
                  business={business}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isDeleting={deletingId === business.businessId}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="mdi:storefront-outline"
              title="You have no business listings yet"
              description="Add your business to the Alumnae Marketplace and let your sisters find and support you."
              actionLabel="Add Your Business"
              onAction={() => setShowPostModal(true)}
            />
          )}
        </div>
      </section>

      <PostBusinessModal
        isOpen={showPostModal}
        onClose={handleCloseModal}
        editData={editBusiness}
      />
    </>
  );
}
