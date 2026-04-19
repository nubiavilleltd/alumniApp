// import { Icon } from '@iconify/react';
// import { useMemo, useState } from 'react';
// import { AppLink } from '@/shared/components/ui/AppLink';
// import { SEO } from '@/shared/common/SEO';
// import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
// import { SearchInput } from '@/shared/components/ui/input/SearchInput';
// import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
// import EmptyState from '@/shared/components/ui/EmptyState';
// import { useAlumni } from '@/features/alumni/hooks/useAlumni';
// import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
// import { isFieldVisible, getPhotoDisplay } from '@/features/alumni/utils/privacyHelpers';
// import { ALUMNI_ROUTES } from '../routes';
// import { ROUTES } from '@/shared/constants/routes';
// import { useStartDirectConversation } from '@/features/messages/hooks/useStartDirectConversation';
// import { Alumni } from '../types/alumni.types';

// // ─── Skeleton ─────────────────────────────────────────────────────────────────
// function AlumnaeCardSkeleton() {
//   return (
//     <div className="flex h-full min-h-[24rem] flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm animate-pulse">
//       <div className="h-56 w-full flex-shrink-0 bg-gray-200 sm:h-64" />
//       <div className="flex flex-1 flex-col gap-2 p-3">
//         <div className="h-4 bg-gray-200 rounded w-3/4" />
//         <div className="h-3 bg-gray-200 rounded w-1/2" />
//         <div className="h-3 bg-gray-200 rounded w-full" />
//         <div className="h-3 bg-gray-200 rounded w-5/6" />
//         <div className="mt-auto flex gap-1.5 pt-2">
//           <div className="flex-1 h-7 bg-gray-200 rounded" />
//           <div className="flex-1 h-7 bg-gray-200 rounded" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Alumnae Card ─────────────────────────────────────────────────────────────
// interface AlumnaeCardProps {
//   entry: Alumni;
//   currentUser: any;
//   onMessageClick: (entry: Alumni) => void;
//   isMessagePending: boolean;
// }

// function AlumnaeCard({ entry, currentUser, onMessageClick, isMessagePending }: AlumnaeCardProps) {
//   // Get privacy settings for this alumnus
//   // const alumnusAccount = entry.memberId ? getMockAccountByMemberId(entry.memberId) : undefined;
//   // const privacy = { ...defaultPrivacySettings, ...alumnusAccount?.privacy };
//   // const alumnusWithPrivacy = { ...entry };
//   const photoVisible = isFieldVisible(entry, 'photo', currentUser);

//   // Check field visibility
//   const cityVisible = isFieldVisible(entry, 'city', currentUser);

//   const classLabel = `Class '${String(entry.graduationYear).slice(-2)}`;
//   const isOwnProfile = entry.memberId === currentUser?.memberId;

//   // Determine photo display
//   const displayPhoto = getPhotoDisplay(entry.photo, photoVisible);

//   return (
//     <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
//       {/* <div className="h-57 w-full overflow-hidden bg-gray-100"> */}
//       {/* <div className="h-57 w-full overflow-hidden bg-gray-100 min-h-[228px]"> */}
//       {/* <div className="w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-gray-100"> */}
//       <div className="w-full overflow-hidden bg-gray-100 h-48 sm:h-52 lg:h-56">
//         {displayPhoto ? (
//           <img
//             src={displayPhoto}
//             alt={entry.name}
//             className="w-full h-full object-cover object-center"
//             loading="lazy"
//           />
//         ) : (
//           <div className="relative flex h-full w-full items-center justify-center bg-gray-100">
//             <Icon icon="mdi:account-circle" className="w-32 h-32 text-gray-300" />
//             {!photoVisible && entry.photo && (
//               <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-80 rounded-full p-1.5">
//                 <Icon icon="mdi:lock" className="w-3.5 h-3.5 text-white" />
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//       <div className="flex flex-1 flex-col gap-1.5 p-3">
//         <h3 className="text-primary-500 font-bold text-sm leading-tight">{entry.name}</h3>
//         <div className="flex items-center gap-2 text-gray-400 text-[11px]">
//           <span>{classLabel}</span>
//           {entry.location && (
//             <>
//               <span className="text-gray-300">|</span>
//               <span className="flex items-center gap-0.5">
//                 <Icon icon="mdi:map-marker-outline" className="w-3 h-3" />
//                 {cityVisible ? (
//                   entry.location
//                 ) : (
//                   <span className="inline-flex items-center gap-0.5 italic">
//                     <Icon icon="mdi:lock" className="w-2.5 h-2.5" />
//                     Private
//                   </span>
//                 )}
//               </span>
//             </>
//           )}
//         </div>
//         <p className="min-h-[2.75rem] text-[11px] leading-relaxed text-gray-500 line-clamp-2">
//           {entry.bio}
//         </p>
//         <div className="mt-auto flex items-center gap-1.5 pt-2">
//           <button
//             type="button"
//             onClick={() => onMessageClick(entry)}
//             disabled={!entry.memberId || isOwnProfile || isMessagePending}
//             className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-[11px] font-medium py-1.5 rounded transition-colors disabled:cursor-not-allowed disabled:bg-primary-200"
//           >
//             {isMessagePending ? 'Opening...' : 'Send Message'}
//           </button>
//           <AppLink
//             href={ALUMNI_ROUTES.PROFILE(entry.memberId as string)}
//             className="flex-1 text-center border border-gray-300 text-gray-600 hover:border-primary-400 hover:text-primary-500 text-[11px] font-medium py-1.5 rounded transition-colors"
//           >
//             View Profile
//           </AppLink>
//         </div>
//       </div>
//     </div>
//   );
// }

// //─── Main Page ────────────────────────────────────────────────────────────────

// const ITEMS_PER_PAGE = 12;

// export function AlumniDirectoryPage() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [yearFilter, setYearFilter] = useState('');
//   const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

//   // ── Get current user for privacy checks ───────────────────────────────────
//   const currentUser = useIdentityStore((state) => state.user);
//   const { startDirectConversation, isPending: isStartingConversation } =
//     useStartDirectConversation();
//   const [pendingConversationMemberId, setPendingConversationMemberId] = useState<string | null>(
//     null,
//   );

//   // ── Hook ───────────────────────────────────────────────────────────────────
//   const { data: alumni = [], isLoading } = useAlumni({ action_type: 'approved' });

//   // ── Derived data ───────────────────────────────────────────────────────────
//   const years = useMemo(
//     () => [...new Set(alumni.map((e) => e.graduationYear))].sort((a, b) => b - a),
//     [alumni],
//   );

//   const filteredAlumni = useMemo(() => {
//     const q = searchTerm.trim().toLowerCase();
//     return alumni.filter((e) => {
//       const matchesSearch =
//         !q || e.name.toLowerCase().includes(q) || e.bio.toLowerCase().includes(q);
//       const matchesYear = !yearFilter || e.graduationYear.toString() === yearFilter;
//       return matchesSearch && matchesYear;
//     });
//   }, [alumni, searchTerm, yearFilter]);

//   const visibleAlumni = filteredAlumni.slice(0, visibleCount);
//   const hasMore = visibleCount < filteredAlumni.length;

//   const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
//     setter(value);
//     setVisibleCount(ITEMS_PER_PAGE);
//   };

//   const breadcrumbItems = [{ label: 'Home', href: ROUTES.HOME }, { label: 'Profiles' }];

//   async function handleStartConversation(entry: {
//     name: string;
//     year?: number;
//     photo?: string;
//     location?: string;
//     memberId?: string;
//   }) {
//     if (!entry.memberId) return;

//     setPendingConversationMemberId(entry.memberId);
//     await startDirectConversation({
//       participantMemberId: entry.memberId,
//       topic: `Alumni connection with ${entry.name}`,
//       recipientProfile: {
//         fullName: entry.name,
//         avatar: entry.photo,
//         headline: entry.year ? `Class of ${entry.year}` : 'FGGC alumna',
//         location: entry.location,
//         graduationYear: entry.year,
//         profileHref: `/alumni/profiles/${entry.memberId}`,
//       },
//     });
//     setPendingConversationMemberId((current) => (current === entry.memberId ? null : current));
//   }

//   return (
//     <>
//       <SEO
//         title="Alumnae Directory"
//         description="Find your classmates, connect with fellow alumnae from your state, or discover women across every profession worldwide."
//       />
//       <Breadcrumbs items={breadcrumbItems} />

//       <section className="section">
//         <div className="container-custom">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold italic mb-2">
//               Alumnae <span className="text-primary-500">Directory</span>
//             </h1>
//             <p className="text-gray-500 text-sm max-w-md mx-auto">
//               Find your classmates, connect with fellow alumnae from your state, or discover women
//               across every profession worldwide.
//             </p>
//           </div>

//           {/* Filters */}
//           <div className="flex flex-col sm:flex-row items-end gap-3 mb-8">
//             <SearchInput
//               label="Search Alumnae"
//               value={searchTerm}
//               onValueChange={handleFilterChange(setSearchTerm)}
//               placeholder="Search by Name or Set"
//               className="flex-1"
//             />
//             <FilterDropdown
//               label="Graduation Year"
//               value={yearFilter}
//               onChange={handleFilterChange(setYearFilter)}
//               placeholder="All Years"
//               options={years.map((y) => ({ label: String(y), value: String(y) }))}
//             />
//           </div>

//           {/* Grid */}
//           {isLoading ? (
//             // <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-10">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-4 mb-10">
//               {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
//                 <AlumnaeCardSkeleton key={i} />
//               ))}
//             </div>
//           ) : visibleAlumni.length > 0 ? (
//             // <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-10">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-4 mb-10">
//               {visibleAlumni.map((entry) => (
//                 <AlumnaeCard
//                   key={entry.id}
//                   entry={entry}
//                   currentUser={currentUser}
//                   onMessageClick={handleStartConversation}
//                   isMessagePending={
//                     isStartingConversation && pendingConversationMemberId === entry.memberId
//                   }
//                 />
//               ))}
//             </div>
//           ) : (
//             <EmptyState
//               icon="mdi:account-search"
//               title="No alumnae found"
//               description="Try adjusting your search or filter."
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
//                 Load More Alumnae
//               </button>
//             </div>
//           )}
//         </div>
//       </section>
//     </>
//   );
// }

// features/alumni/pages/AlumniDirectoryPage.tsx
//
// Redesigned to match the provided screenshot:
// - Full-bleed photo card with blue overlay panel at bottom
// - Name / class / title / buttons all inside the overlay
// - 4-column grid (desktop), 2-column (tablet), 1-column (mobile)
// - Server-side-style pagination (client-side slice, same UX)
// - Plain left-aligned "Alumnae Directory" heading, no subtitle
// - Search left + Graduation Year dropdown right on one row

import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { SearchInput } from '@/shared/components/ui/input/SearchInput';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
import EmptyState from '@/shared/components/ui/EmptyState';
import { Pagination } from '@/shared/components/ui/Pagination';
import { useAlumni } from '@/features/alumni/hooks/useAlumni';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { isFieldVisible, getPhotoDisplay } from '@/features/alumni/utils/privacyHelpers';
import { ALUMNI_ROUTES } from '../routes';
import { ROUTES } from '@/shared/constants/routes';
import { useStartDirectConversation } from '@/features/messages/hooks/useStartDirectConversation';
import { Alumni } from '../types/alumni.types';

// ─── Card skeleton ────────────────────────────────────────────────────────────

function AlumnaeCardSkeleton() {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-sm bg-gray-200 animate-pulse aspect-[3/4]">
      {/* Photo placeholder */}
      <div className="absolute inset-0 bg-gray-200" />
      {/* Overlay placeholder */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-300 rounded-b-2xl p-4 space-y-2">
        <div className="h-4 bg-gray-400 rounded w-3/4" />
        <div className="h-3 bg-gray-400 rounded w-1/2" />
        <div className="h-3 bg-gray-400 rounded w-2/3" />
        <div className="flex gap-2 mt-3">
          <div className="flex-1 h-7 bg-gray-400 rounded-full" />
          <div className="flex-1 h-7 bg-gray-400 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface AlumnaeCardProps {
  entry: Alumni;
  currentUser: any;
  onMessageClick: (entry: Alumni) => void;
  isMessagePending: boolean;
}

function AlumnaeCard({ entry, currentUser, onMessageClick, isMessagePending }: AlumnaeCardProps) {
  const photoVisible = isFieldVisible(entry, 'photo', currentUser);
  const displayPhoto = getPhotoDisplay(entry.photo, photoVisible);
  const classLabel = `Class '${String(entry.graduationYear).slice(-2)}`;
  const isOwnProfile = entry.memberId === currentUser?.memberId;

  // Occupation / role — shown as third line in the overlay
  const occupation = (entry as any).position || (entry as any).occupations?.[0] || '';

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[3/4] group cursor-pointer">
      {/* Full-bleed photo */}
      <div className="absolute inset-0">
        {displayPhoto ? (
          <img
            src={displayPhoto}
            alt={entry.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Icon icon="mdi:account-circle" className="w-24 h-24 text-gray-300" />
            {!photoVisible && entry.photo && (
              <div className="absolute bottom-36 right-3 bg-black/60 rounded-full p-1.5">
                <Icon icon="mdi:lock" className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Blue overlay panel — sits at the bottom, rounded to match card */}
      <div className="absolute bottom-0 left-0 right-0 bg-primary-500 backdrop-blur-[2px] rounded-2xl px-4 pt-3.5 pb-4">
        {/* Name */}
        <p className="text-white font-bold text-[15px] leading-snug truncate">{entry.name}</p>

        {/* Class year */}
        <p className="text-white/90 text-[13px] mt-0.5">{classLabel}</p>

        {/* Occupation */}
        {occupation && <p className="text-white/80 text-[12px] mt-0.5 truncate">{occupation}</p>}

        {/* Buttons */}
        <div className="flex items-center gap-2 mt-3">
          <AppLink
            href={ALUMNI_ROUTES.PROFILE(entry.memberId as string)}
            className="flex-1 text-center border border-white text-white text-[12px] font-semibold py-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            View Profile
          </AppLink>
          <button
            type="button"
            onClick={() => onMessageClick(entry)}
            disabled={!entry.memberId || isOwnProfile || isMessagePending}
            className="flex-1 bg-white text-primary-600 text-[12px] font-semibold py-1.5 rounded-full hover:bg-white/90 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isMessagePending ? 'Opening…' : 'Send Message'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 12;

export function AlumniDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const currentUser = useIdentityStore((state) => state.user);
  const { startDirectConversation, isPending: isStartingConversation } =
    useStartDirectConversation();
  const [pendingConversationMemberId, setPendingConversationMemberId] = useState<string | null>(
    null,
  );

  const { data: alumni = [], isLoading } = useAlumni({ action_type: 'approved' });

  // Year filter options
  const years = useMemo(
    () => [...new Set(alumni.map((e) => e.graduationYear))].sort((a, b) => b - a),
    [alumni],
  );

  // Filtered list
  const filteredAlumni = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return alumni.filter((e) => {
      const matchesSearch =
        !q || e.name.toLowerCase().includes(q) || e.bio?.toLowerCase().includes(q);
      const matchesYear = !yearFilter || e.graduationYear.toString() === yearFilter;
      return matchesSearch && matchesYear;
    });
  }, [alumni, searchTerm, yearFilter]);

  // Reset to page 1 when filters change
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };
  const handleYearFilter = (value: string) => {
    setYearFilter(value);
    setCurrentPage(1);
  };

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filteredAlumni.length / ITEMS_PER_PAGE));
  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleAlumni = filteredAlumni.slice(pageStart, pageStart + ITEMS_PER_PAGE);

  async function handleStartConversation(entry: Alumni) {
    if (!entry.memberId) return;
    setPendingConversationMemberId(entry.memberId);
    await startDirectConversation({
      participantMemberId: entry.memberId,
      topic: `Alumni connection with ${entry.name}`,
      recipientProfile: {
        fullName: entry.name,
        avatar: entry.photo,
        headline: entry.graduationYear ? `Class of ${entry.graduationYear}` : 'FGGC alumna',
        location: entry.location,
        graduationYear: entry.graduationYear,
        profileHref: `/alumni/profiles/${entry.memberId}`,
      },
    });
    setPendingConversationMemberId((c) => (c === entry.memberId ? null : c));
  }

  const breadcrumbItems = [{ label: 'Home', href: ROUTES.HOME }, { label: 'Profiles' }];

  return (
    <>
      <SEO
        title="Alumnae Directory"
        description="Find your classmates, connect with fellow alumnae from your state, or discover women across every profession worldwide."
      />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section bg-gray-50 min-h-screen">
        <div className="container-custom">
          {/* Heading */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Alumnae Directory</h1>

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row items-end gap-3 mb-8">
            <div className="flex-1 w-full">
              <SearchInput
                value={searchTerm}
                onValueChange={handleSearch}
                placeholder="Search by name"
              />
            </div>
            <FilterDropdown
              label=""
              value={yearFilter}
              onChange={handleYearFilter}
              placeholder="Graduation Year"
              options={years.map((y) => ({ label: String(y), value: String(y) }))}
            />
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <AlumnaeCardSkeleton key={i} />
              ))}
            </div>
          ) : visibleAlumni.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {visibleAlumni.map((entry) => (
                <AlumnaeCard
                  key={entry.id}
                  entry={entry}
                  currentUser={currentUser}
                  onMessageClick={handleStartConversation}
                  isMessagePending={
                    isStartingConversation && pendingConversationMemberId === entry.memberId
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="mdi:account-search"
              title="No alumnae found"
              description="Try adjusting your search or filter."
            />
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-4 mb-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
