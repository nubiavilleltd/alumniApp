// // import { Icon } from '@iconify/react';
// // import { useMemo, useState } from 'react';

// // import { getSiteConfig } from '@/data/content';
// // import { getAlumni } from '@/data/site-data';
// // import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
// // import { AppLink } from '@/shared/components/ui/AppLink';
// // import { SEO } from '@/shared/common/SEO';

// // type SortMode = 'name' | 'year';

// // export function AlumniDirectoryPage() {
// //   const config = getSiteConfig();
// //   const alumni = getAlumni();

// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [yearFilter, setYearFilter] = useState('');
// //   const [sortBy, setSortBy] = useState<SortMode>('name');
// //   const [currentPage, setCurrentPage] = useState(1);

// //   const years = useMemo(
// //     () => [...new Set(alumni.map((entry) => entry.year))].sort((a, b) => b - a),
// //     [alumni],
// //   );

// //   const filteredAlumni = useMemo(() => {
// //     const normalizedSearch = searchTerm.trim().toLowerCase();

// //     return [...alumni]
// //       .filter((entry) => {
// //         const matchesSearch =
// //           !normalizedSearch ||
// //           entry.name.toLowerCase().includes(normalizedSearch) ||
// //           entry.short_bio.toLowerCase().includes(normalizedSearch);
// //         const matchesYear = !yearFilter || entry.year.toString() === yearFilter;

// //         return matchesSearch && matchesYear;
// //       })
// //       .sort((a, b) => {
// //         if (sortBy === 'year') {
// //           return b.year - a.year;
// //         }
// //         return a.name.localeCompare(b.name);
// //       });
// //   }, [alumni, searchTerm, sortBy, yearFilter]);

// //   const itemsPerPage = config.content.alumni_per_page;
// //   const totalPages = Math.max(1, Math.ceil(filteredAlumni.length / itemsPerPage));

// //   const pagedAlumni = useMemo(() => {
// //     const safePage = Math.min(currentPage, totalPages);
// //     const start = (safePage - 1) * itemsPerPage;
// //     return filteredAlumni.slice(start, start + itemsPerPage);
// //   }, [currentPage, filteredAlumni, itemsPerPage, totalPages]);

// //   const breadcrumbItems = [
// //     { label: 'Home', href: '/' },
// //     { label: 'Profiles', href: '/alumni' },
// //     { label: 'Directory' },
// //   ];

// //   const onFilterChange = (): void => {
// //     setCurrentPage(1);
// //   };

// //   const visiblePage = Math.min(currentPage, totalPages);

// //   return (
// //     <>
// //       <SEO title="Alumni Directory" description="Browse alumni by year and search." />
// //       <Breadcrumbs items={breadcrumbItems} />

// //       <section className="section">
// //         <div className="container-custom">
// //           <div className="text-center mb-12">
// //             <h1 className="text-4xl md:text-5xl font-bold text-accent-900 mb-4">
// //               Alumni Directory
// //             </h1>
// //             <p className="text-xl text-accent-600 max-w-3xl mx-auto">
// //               Connect with fellow alumni from {config.organization.name}. Browse profiles by
// //               graduation year, or search for specific alumni.
// //             </p>
// //           </div>

// //           {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
// //             <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-2xl text-center">
// //               <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
// //                 <Icon icon="mdi:account-group" className="w-8 h-8 text-white" />
// //               </div>
// //               <h3 className="text-2xl font-bold text-primary-900">{alumni.length}</h3>
// //               <p className="text-primary-700">Total Alumni</p>
// //             </div>
// //             <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-6 rounded-2xl text-center">
// //               <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
// //                 <Icon icon="mdi:calendar" className="w-8 h-8 text-white" />
// //               </div>
// //               <h3 className="text-2xl font-bold text-accent-900">{years.length}</h3>
// //               <p className="text-accent-700">Graduation Years</p>
// //             </div>
// //           </div> */}

// //           <div className="bg-white rounded-2xl shadow-sm border border-accent-100 p-6 mb-8">
// //             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// //               <div className="lg:col-span-2">
// //                 <label htmlFor="search" className="block text-sm font-medium text-accent-700 mb-2">
// //                   Search Alumni
// //                 </label>
// //                 <div className="search-wrapper">
// //                   <Icon icon="mdi:magnify" className="search-icon" />
// //                   <input
// //                     type="text"
// //                     id="search"
// //                     placeholder="Search by name or skills..."
// //                     value={searchTerm}
// //                     onChange={(event) => {
// //                       setSearchTerm(event.target.value);
// //                       onFilterChange();
// //                     }}
// //                   />
// //                 </div>
// //               </div>

// //               <div>
// //                 <label
// //                   htmlFor="year-filter"
// //                   className="block text-sm font-medium text-accent-700 mb-2"
// //                 >
// //                   Graduation Year
// //                 </label>
// //                 <select
// //                   id="year-filter"
// //                   className="select"
// //                   value={yearFilter}
// //                   onChange={(event) => {
// //                     setYearFilter(event.target.value);
// //                     onFilterChange();
// //                   }}
// //                 >
// //                   <option value="">All Years</option>
// //                   {years.map((year) => (
// //                     <option key={year} value={year}>
// //                       {year}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="flex items-center justify-between mb-6">
// //             <p className="text-accent-600">
// //               Showing <span>{filteredAlumni.length}</span> of {alumni.length} alumni
// //             </p>
// //             <div className="flex items-center space-x-2">
// //               <span className="text-sm text-accent-600">Sort by:</span>
// //               <select
// //                 id="sort-by"
// //                 className="select w-auto"
// //                 value={sortBy}
// //                 onChange={(event) => {
// //                   setSortBy(event.target.value as SortMode);
// //                   setCurrentPage(1);
// //                 }}
// //               >
// //                 <option value="name">Name</option>
// //                 <option value="year">Graduation Year</option>
// //               </select>
// //             </div>
// //           </div>

// //           <div className="grid-responsive-lg mb-8">
// //             {pagedAlumni.map((entry) => {
// //               const initials = entry.name
// //                 .split(' ')
// //                 .map((segment) => segment[0])
// //                 .join('')
// //                 .toUpperCase();

// //               return (
// //                 <div className="profile-card" key={entry.slug}>
// //                   <div className="relative">
// //                     {entry.photo ? (
// //                       <img
// //                         src={entry.photo}
// //                         alt={entry.name}
// //                         className="profile-avatar"
// //                         loading="lazy"
// //                       />
// //                     ) : (
// //                       <div className="profile-avatar-placeholder">{initials}</div>
// //                     )}
// //                   </div>

// //                   <h3 className="text-xl font-semibold text-accent-900 mb-2">{entry.name}</h3>
// //                   <p className="text-accent-600 mb-3">{entry.short_bio}</p>

// //                   <div className="flex items-center justify-between text-sm text-accent-500">
// //                     <span>Class of {entry.year}</span>
// //                     <AppLink
// //                       href={`/alumni/profiles/${entry.slug}`}
// //                       className="text-primary-600 hover:text-primary-700 font-medium"
// //                     >
// //                       View Profile →
// //                     </AppLink>
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>

// //           <div className="flex items-center justify-center space-x-2">
// //             <button
// //               type="button"
// //               className="btn btn-outline btn-sm"
// //               disabled={visiblePage <= 1}
// //               onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
// //             >
// //               <Icon icon="mdi:chevron-left" className="w-4 h-4 mr-1" />
// //               Previous
// //             </button>

// //             <div className="flex items-center space-x-1">
// //               {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
// //                 <button
// //                   type="button"
// //                   key={pageNumber}
// //                   className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200 ${
// //                     pageNumber === visiblePage
// //                       ? 'bg-primary-600 text-white'
// //                       : 'text-accent-600 hover:text-accent-900 hover:bg-accent-100'
// //                   }`}
// //                   onClick={() => setCurrentPage(pageNumber)}
// //                 >
// //                   {pageNumber}
// //                 </button>
// //               ))}
// //             </div>

// //             <button
// //               type="button"
// //               className="btn btn-outline btn-sm"
// //               disabled={visiblePage >= totalPages}
// //               onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
// //             >
// //               Next
// //               <Icon icon="mdi:chevron-right" className="w-4 h-4 ml-1" />
// //             </button>
// //           </div>
// //         </div>
// //       </section>
// //     </>
// //   );
// // }

// import { Icon } from '@iconify/react';
// import { useMemo, useState } from 'react';
// import { getSiteConfig } from '@/data/content';
// import { getAlumni } from '@/data/site-data';
// import { AppLink } from '@/shared/components/ui/AppLink';
// import { SEO } from '@/shared/common/SEO';
// import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';

// type SortMode = 'name' | 'year';

// // ─── Reusable Search Input ───────────────────────────────────────────────────
// interface SearchInputProps {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   label?: string;
// }

// function SearchInput({ value, onChange, placeholder = 'Search by Name or Set', label }: SearchInputProps) {
//   return (
//     <div className="flex-1">
//       {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
//       <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
//         <div className="pl-3 text-gray-400">
//           <Icon icon="mdi:magnify" className="w-4 h-4" />
//         </div>
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder={placeholder}
//           className="flex-1 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
//         />
//         {/* <button
//           type="button"
//           className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
//         >
//           Search
//         </button> */}
//       </div>
//     </div>
//   );
// }

// // ─── Reusable Year Dropdown ──────────────────────────────────────────────────
// interface YearDropdownProps {
//   value: string;
//   onChange: (value: string) => void;
//   years: number[];
//   label?: string;
// }

// function YearDropdown({ value, onChange, years, label }: YearDropdownProps) {
//   return (
//     <div className="w-full sm:w-48">
//       {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
//       <div className="relative">
//         <select
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm text-gray-700 shadow-sm outline-none focus:border-primary-400 cursor-pointer"
//         >
//           <option value="">All Years</option>
//           {years.map((year) => (
//             <option key={year} value={year}>{year}</option>
//           ))}
//         </select>
//         <Icon icon="mdi:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//       </div>
//     </div>
//   );
// }

// // ─── Alumnae Card ────────────────────────────────────────────────────────────
// interface AlumnaeCardProps {
//   entry: {
//     name: string;
//     slug: string;
//     year: number;
//     photo?: string;
//     short_bio: string;
//     location?: string;
//   };
// }

// function AlumnaeCard({ entry }: AlumnaeCardProps) {
//   const initials = entry.name
//     .split(' ')
//     .map((s) => s[0])
//     .join('')
//     .toUpperCase();

//   return (
//     <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
//       {/* Photo */}
//       <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100">
//         {entry.photo ? (
//           <img
//             src={entry.photo}
//             alt={entry.name}
//             className="w-full h-full object-cover object-top"
//             loading="lazy"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-primary-50">
//             <span className="text-3xl font-bold text-primary-400">{initials}</span>
//           </div>
//         )}
//       </div>

//       {/* Info */}
//       <div className="p-4 flex flex-col gap-1 flex-1">
//         <h3 className="text-primary-500 font-bold text-sm">{entry.name}</h3>

//         <div className="flex items-center gap-3 text-gray-400 text-xs">
//           <span className="flex items-center gap-1">
//             <Icon icon="mdi:school-outline" className="w-3 h-3" />
//             Class {entry.year}
//           </span>
//           {entry.location && (
//             <span className="flex items-center gap-1">
//               <Icon icon="mdi:map-marker-outline" className="w-3 h-3" />
//               {entry.location}
//             </span>
//           )}
//         </div>

//         <p className="text-gray-500 text-xs leading-relaxed mt-1 line-clamp-2">{entry.short_bio}</p>

//         {/* Actions */}
//         <div className="flex items-center gap-2 mt-3">
//           <button
//             type="button"
//             className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium py-1.5 rounded-md transition-colors"
//           >
//             Send Message
//           </button>
//           <AppLink
//             href={`/alumni/profiles/${entry.slug}`}
//             className="flex-1 text-center border border-primary-500 text-primary-500 hover:bg-primary-50 text-xs font-medium py-1.5 rounded-md transition-colors"
//           >
//             View Profile
//           </AppLink>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Main Page ───────────────────────────────────────────────────────────────
// const ITEMS_PER_PAGE = 12;

// export function AlumniDirectoryPage() {
//   const alumni = getAlumni();

//   const [searchTerm, setSearchTerm] = useState('');
//   const [yearFilter, setYearFilter] = useState('');
//   const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

//   const years = useMemo(
//     () => [...new Set(alumni.map((e) => e.year))].sort((a, b) => b - a),
//     [alumni],
//   );

//   const filteredAlumni = useMemo(() => {
//     const q = searchTerm.trim().toLowerCase();
//     return alumni.filter((e) => {
//       const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.short_bio.toLowerCase().includes(q);
//       const matchesYear = !yearFilter || e.year.toString() === yearFilter;
//       return matchesSearch && matchesYear;
//     });
//   }, [alumni, searchTerm, yearFilter]);

//   const visibleAlumni = filteredAlumni.slice(0, visibleCount);
//   const hasMore = visibleCount < filteredAlumni.length;

//   const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
//     setter(value);
//     setVisibleCount(ITEMS_PER_PAGE);
//   };

//   const breadcrumbItems = [
//     { label: 'Home', href: '/' },
//     { label: 'Profiles', href: '/alumni' },
//     { label: 'Directory' },
//   ];

//   return (
//     <>
//       <SEO title="Alumnae Directory" description="Find your classmates, connect with fellow alumnae from your state, or discover women across every profession worldwide." />
//       <Breadcrumbs items={breadcrumbItems} />

//       <section className="section">
//         <div className="container-custom">

//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold italic mb-2">
//               Alumnae <span className="text-primary-500">Directory</span>
//             </h1>
//             <p className="text-gray-500 text-sm max-w-md mx-auto">
//               Find your classmates, connect with fellow alumnae from your state, or discover women across every profession worldwide.
//             </p>
//           </div>

//           {/* Filters */}
//           <div className="flex flex-col sm:flex-row items-end gap-3 mb-8">
//             <SearchInput
//               label="Search Alumnae"
//               value={searchTerm}
//               onChange={handleFilterChange(setSearchTerm)}
//             />
//             <YearDropdown
//               label="Graduation Year"
//               value={yearFilter}
//               onChange={handleFilterChange(setYearFilter)}
//               years={years}
//             />
//           </div>

//           {/* Grid */}
//           {visibleAlumni.length > 0 ? (
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-10">
//               {visibleAlumni.map((entry) => (
//                 <AlumnaeCard key={entry.slug} entry={entry} />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-20 text-gray-400">
//               <Icon icon="mdi:account-search" className="w-12 h-12 mx-auto mb-3 opacity-40" />
//               <p className="text-sm">No alumnae found matching your search.</p>
//             </div>
//           )}

//           {/* Load More */}
//           {hasMore && (
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

import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import { getSiteConfig } from '@/data/content';
import { getAlumni } from '@/data/site-data';
import { AppLink } from '@/shared/components/ui/AppLink';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';

type SortMode = 'name' | 'year';

// ─── Reusable Search Input ───────────────────────────────────────────────────
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

function SearchInput({
  value,
  onChange,
  placeholder = 'Search by Name or Set',
  label,
}: SearchInputProps) {
  return (
    <div className="flex-1">
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
      <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="pl-3 text-gray-400">
          <Icon icon="mdi:magnify" className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
        />
        {/* <button
          type="button"
          className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
        >
          Search
        </button> */}
      </div>
    </div>
  );
}

// ─── Reusable Year Dropdown ──────────────────────────────────────────────────
interface YearDropdownProps {
  value: string;
  onChange: (value: string) => void;
  years: number[];
  label?: string;
}

function YearDropdown({ value, onChange, years, label }: YearDropdownProps) {
  return (
    <div className="w-full sm:w-48">
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm text-gray-700 shadow-sm outline-none focus:border-primary-400 cursor-pointer"
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <Icon
          icon="mdi:chevron-down"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
}

// ─── Alumnae Card ────────────────────────────────────────────────────────────
interface AlumnaeCardProps {
  entry: {
    name: string;
    slug: string;
    year: number;
    photo?: string;
    short_bio: string;
    location?: string;
  };
}

function AlumnaeCard({ entry }: AlumnaeCardProps) {
  const initials = entry.name
    .split(' ')
    .map((s) => s[0])
    .join('')
    .toUpperCase();

  // Format as "Class '90" from full year e.g. 1990
  const classLabel = `Class '${String(entry.year).slice(-2)}`;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      {/* Photo */}
      {/* <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100"> */}
      <div className="h-57 w-full overflow-hidden bg-gray-100">
        {entry.photo ? (
          <img
            src={entry.photo}
            alt={entry.name}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-50">
            <span className="text-3xl font-bold text-primary-400">{initials}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        <h3 className="text-primary-500 font-bold text-sm leading-tight">{entry.name}</h3>

        {/* Class + Location row */}
        <div className="flex items-center gap-2 text-gray-400 text-[11px]">
          <span>{classLabel}</span>
          {entry.location && (
            <>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-0.5">
                <Icon icon="mdi:map-marker-outline" className="w-3 h-3" />
                {entry.location}
              </span>
            </>
          )}
        </div>

        {/* Bio */}
        <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">{entry.short_bio}</p>

        {/* Actions */}
        <div className="flex items-center gap-1.5 mt-1">
          <button
            type="button"
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-[11px] font-medium py-1.5 rounded transition-colors"
          >
            Send Message
          </button>
          <AppLink
            href={`/alumni/profiles/${entry.slug}`}
            className="flex-1 text-center border border-gray-300 text-gray-600 hover:border-primary-400 hover:text-primary-500 text-[11px] font-medium py-1.5 rounded transition-colors"
          >
            View Profile
          </AppLink>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 12;

export function AlumniDirectoryPage() {
  const alumni = getAlumni();

  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const years = useMemo(
    () => [...new Set(alumni.map((e) => e.year))].sort((a, b) => b - a),
    [alumni],
  );

  const filteredAlumni = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return alumni.filter((e) => {
      const matchesSearch =
        !q || e.name.toLowerCase().includes(q) || e.short_bio.toLowerCase().includes(q);
      const matchesYear = !yearFilter || e.year.toString() === yearFilter;
      return matchesSearch && matchesYear;
    });
  }, [alumni, searchTerm, yearFilter]);

  const visibleAlumni = filteredAlumni.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAlumni.length;

  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Profiles', href: '/alumni' },
    { label: 'Directory' },
  ];

  return (
    <>
      <SEO
        title="Alumnae Directory"
        description="Find your classmates, connect with fellow alumnae from your state, or discover women across every profession worldwide."
      />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold italic mb-2">
              Alumnae <span className="text-primary-500">Directory</span>
            </h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Find your classmates, connect with fellow alumnae from your state, or discover women
              across every profession worldwide.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-end gap-3 mb-8">
            <SearchInput
              label="Search Alumnae"
              value={searchTerm}
              onChange={handleFilterChange(setSearchTerm)}
            />
            <YearDropdown
              label="Graduation Year"
              value={yearFilter}
              onChange={handleFilterChange(setYearFilter)}
              years={years}
            />
          </div>

          {/* Grid */}
          {visibleAlumni.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-10">
              {visibleAlumni.map((entry) => (
                <AlumnaeCard key={entry.slug} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Icon icon="mdi:account-search" className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No alumnae found matching your search.</p>
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-8 py-3 rounded-full transition-colors"
              >
                Load More Alumnae
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
