// // import { Icon } from '@iconify/react';
// // import { useParams } from 'react-router-dom';
// // import { useAlumnus } from '@/features/alumni/hooks/useAlumni';
// // import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// // import { getMockAccountByMemberId } from '@/features/authentication/lib/mockAuth';
// // import { defaultPrivacySettings } from '@/features/authentication/types/auth.types';
// // import type { PrivacySettings } from '@/features/authentication/types/auth.types';
// // import { Layout } from '@/shared/components/layout/Layout';
// // import { AppLink } from '@/shared/components/ui/AppLink';
// // import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
// // import { SEO } from '@/shared/common/SEO';
// // import {
// //   isFieldVisible,
// //   getPrivateFieldDisplay,
// //   getPhotoDisplay,
// // } from '@/features/alumni/utils/privacyHelpers';

// // // ─── Skeleton ─────────────────────────────────────────────────────────────────
// // function ProfileSkeleton() {
// //   return (
// //     <section className="section py-12">
// //       <div className="container mx-auto px-4">
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
// //           <aside className="lg:col-span-1 bg-white shadow-md rounded-2xl p-6 flex flex-col items-center gap-3">
// //             <div className="w-36 h-36 rounded-full bg-gray-200" />
// //             <div className="h-5 bg-gray-200 rounded w-2/3" />
// //             <div className="h-4 bg-gray-200 rounded w-1/3" />
// //             <div className="w-full mt-2 space-y-2">
// //               <div className="h-3 bg-gray-200 rounded w-full" />
// //               <div className="h-3 bg-gray-200 rounded w-5/6" />
// //               <div className="h-3 bg-gray-200 rounded w-4/6" />
// //             </div>
// //           </aside>
// //           <main className="lg:col-span-2 space-y-6">
// //             {Array.from({ length: 3 }).map((_, i) => (
// //               <div key={i} className="bg-white shadow-md rounded-2xl p-6 space-y-3">
// //                 <div className="h-5 bg-gray-200 rounded w-1/4" />
// //                 <div className="h-3 bg-gray-200 rounded w-full" />
// //                 <div className="h-3 bg-gray-200 rounded w-full" />
// //                 <div className="h-3 bg-gray-200 rounded w-3/4" />
// //               </div>
// //             ))}
// //           </main>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // // ─── Main Page ────────────────────────────────────────────────────────────────
// // export function AlumniProfilePage() {
// //   const { slug = '' } = useParams();
// //   const currentUser = useAuthStore((state) => state.user);
// //   const isSignedIn = !!currentUser;

// //   const { data: alumnus, isLoading } = useAlumnus(slug);

// //   if (isLoading) return <ProfileSkeleton />;

// //   if (!alumnus) {
// //     return (
// //       // <div className="min-h-screen flex items-center justify-center flex-col bg-white text-gray-900 font-sans antialiased">
// //       <section className="section">
// //         <div className="container-custom text-center">
// //           <h1 className="text-3xl font-bold mb-4">Alumni profile not found</h1>
// //           <AppLink href="/alumni/profiles" className="btn btn-primary">
// //             Browse Directory
// //           </AppLink>
// //         </div>
// //       </section>
// //       // </div>
// //     );
// //   }

// //   // ── Merge session data for own profile ────────────────────────────────────
// //   // If viewing own profile, show latest data from session (Edit Profile changes)
// //   // instead of stale mock data. This ensures social links and other updates appear immediately.
// //   const isOwnProfile = currentUser?.slug === slug;

// //   // Handle backward compatibility: mock data might have nested social object
// //   const getAlumnusSocial = (field: 'linkedin' | 'twitter' | 'instagram') => {
// //     // @ts-ignore - handling backward compatibility with nested social object
// //     return alumnus[field] || alumnus.social?.[field];
// //   };

// //   const displayAlumnus =
// //     isOwnProfile && currentUser
// //       ? {
// //           ...alumnus,
// //           // Override with latest session data
// //           photo: currentUser.photo || alumnus.photo,
// //           alternativePhone: currentUser.alternativePhone || alumnus.alternativePhone,
// //           birthDate: currentUser.birthDate || alumnus.birthDate,
// //           residentialAddress: currentUser.residentialAddress || alumnus.residentialAddress,
// //           area: currentUser.area || alumnus.area,
// //           city: currentUser.city || alumnus.city,
// //           employmentStatus: currentUser.employmentStatus || alumnus.employmentStatus,
// //           occupations: currentUser.occupations || alumnus.occupations,
// //           industrySectors: currentUser.industrySectors || alumnus.industrySectors,
// //           yearsOfExperience: currentUser.yearsOfExperience ?? alumnus.yearsOfExperience,
// //           isVolunteer: currentUser.isVolunteer ?? alumnus.isVolunteer,
// //           linkedin: currentUser.linkedin || getAlumnusSocial('linkedin'),
// //           twitter: currentUser.twitter || getAlumnusSocial('twitter'),
// //           instagram: currentUser.instagram || getAlumnusSocial('instagram'),
// //         }
// //       : {
// //           ...alumnus,
// //           // For other profiles, also extract from nested social if needed
// //           linkedin: alumnus.linkedin || getAlumnusSocial('linkedin'),
// //           twitter: alumnus.twitter || getAlumnusSocial('twitter'),
// //           instagram: alumnus.instagram || getAlumnusSocial('instagram'),
// //         };

// //   // ── Resolve privacy settings for this alumnus ──────────────────────────────
// //   // Look up their MockAuthAccount to get stored privacy settings.
// //   // Falls back to defaultPrivacySettings if not found.
// //   const alumnusAccount = displayAlumnus.memberId
// //     ? getMockAccountByMemberId(displayAlumnus.memberId)
// //     : undefined;

// //   const privacy: PrivacySettings = {
// //     ...defaultPrivacySettings,
// //     ...alumnusAccount?.privacy,
// //     // If viewing own profile, use session privacy settings
// //     ...(isOwnProfile && currentUser?.privacy ? currentUser.privacy : {}),
// //   };

// //   // Create alumnus object with privacy for helper functions
// //   const alumnusWithPrivacy = { ...displayAlumnus, privacy, id: displayAlumnus.memberId };

// //   const alum = { ...displayAlumnus };

// //   // Social links - direct fields on user object
// //   const hasAnySocial = alum.linkedin || alum.twitter || alum.instagram;

// //   const breadcrumbItems = [
// //     { label: 'Home', href: '/' },
// //     { label: 'Profiles', href: '/alumni/profiles' },
// //     { label: alum.name },
// //   ];

// //   return (
// //     <>
// //       <SEO title={alum.name} description={alum.short_bio} />
// //       <Breadcrumbs items={breadcrumbItems} />

// //       <section className="section py-12">
// //         <div className="container mx-auto px-4">
// //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //             {/* ── Sidebar ──────────────────────────────────────────────── */}
// //             <aside className="lg:col-span-1 bg-white shadow-md rounded-2xl p-6 text-center">
// //               {/* Photo — respects privacy */}
// //               {getPhotoDisplay(
// //                 alum.photo,
// //                 isFieldVisible(alumnusWithPrivacy, 'photo', currentUser),
// //               ) ? (
// //                 <img
// //                   src={alum.photo || '/logo.svg'}
// //                   alt={alum.name}
// //                   className="w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover border mx-auto mb-4"
// //                 />
// //               ) : (
// //                 <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gray-100 border flex flex-col items-center justify-center mx-auto mb-4">
// //                   <Icon icon="mdi:lock" className="w-12 h-12 text-gray-300" />
// //                   <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-0.5">
// //                     <Icon icon="mdi:lock" className="w-3 h-3" />
// //                     Private
// //                   </span>
// //                 </div>
// //               )}

// //               <h1 className="text-2xl font-bold">{alum.name}</h1>
// //               <p className="text-primary-600 mt-1">Class of {alum.year}</p>

// //               {isSignedIn ? (
// //                 <>
// //                   <div className="mt-4 space-y-2 text-sm text-gray-700 text-left">
// //                     {alum.position && (
// //                       <p>
// //                         <strong>Position:</strong> {alum.position}
// //                       </p>
// //                     )}
// //                     {alum.company && (
// //                       <p>
// //                         <strong>Company:</strong> {alum.company}
// //                       </p>
// //                     )}
// //                     {alum.location && (
// //                       <p>
// //                         <strong>Location:</strong>{' '}
// //                         {getPrivateFieldDisplay(
// //                           alum.location,
// //                           isFieldVisible(alumnusWithPrivacy, 'city', currentUser),
// //                         )}
// //                       </p>
// //                     )}
// //                     {alum.email && (
// //                       <p className="flex items-center gap-1 flex-wrap">
// //                         <strong>Email:</strong>
// //                         <AppLink
// //                           href={`mailto:${alum.email}`}
// //                           className="text-primary-600 hover:underline"
// //                         >
// //                           {alum.email}
// //                         </AppLink>
// //                       </p>
// //                     )}
// //                   </div>

// //                   {hasAnySocial && (
// //                     <div className="mt-6 flex justify-center gap-5 text-gray-600">
// //                       {alum.linkedin && (
// //                         <AppLink
// //                           href={alum.linkedin}
// //                           target="_blank"
// //                           className="hover:text-primary-600"
// //                         >
// //                           <Icon icon="mdi:linkedin" className="w-6 h-6" />
// //                         </AppLink>
// //                       )}
// //                       {alum.twitter && (
// //                         <AppLink
// //                           href={alum.twitter}
// //                           target="_blank"
// //                           className="hover:text-primary-600"
// //                         >
// //                           <Icon icon="mdi:twitter" className="w-6 h-6" />
// //                         </AppLink>
// //                       )}
// //                       {alum.instagram && (
// //                         <AppLink
// //                           href={alum.instagram}
// //                           target="_blank"
// //                           className="hover:text-primary-600"
// //                         >
// //                           <Icon icon="mdi:instagram" className="w-6 h-6" />
// //                         </AppLink>
// //                       )}
// //                     </div>
// //                   )}
// //                 </>
// //               ) : (
// //                 <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50 p-4 text-left">
// //                   <p className="text-sm font-semibold text-primary-900">Member-only profile</p>
// //                   <p className="mt-2 text-sm leading-6 text-primary-900/80">
// //                     Sign in to view this alumnus's biography, work details, contact information, and
// //                     full profile sections.
// //                   </p>
// //                   <AppLink
// //                     href="/auth/login"
// //                     className="btn btn-primary btn-sm mt-4 w-full justify-center"
// //                   >
// //                     Sign in to continue
// //                   </AppLink>
// //                 </div>
// //               )}
// //             </aside>

// //             {/* ── Main Content ─────────────────────────────────────────── */}
// //             <main className="lg:col-span-2 space-y-8">
// //               {isSignedIn ? (
// //                 <>
// //                   <section className="bg-white shadow-md rounded-2xl p-6">
// //                     <h2 className="text-xl font-semibold mb-3">About</h2>
// //                     <p className="text-gray-700">{alum.long_bio}</p>
// //                   </section>

// //                   {/* Professional Information */}
// //                   {(alum.employmentStatus ||
// //                     alum.occupations ||
// //                     alum.industrySectors ||
// //                     alum.yearsOfExperience) && (
// //                     <section className="bg-white shadow-md rounded-2xl p-6">
// //                       <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
// //                         <Icon icon="mdi:briefcase-outline" className="w-5 h-5 text-primary-500" />
// //                         Professional Information
// //                       </h2>
// //                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
// //                         {alum.employmentStatus && (
// //                           <div>
// //                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
// //                               Employment Status
// //                             </p>
// //                             <p className="font-medium text-gray-800">
// //                               {getPrivateFieldDisplay(
// //                                 alum.employmentStatus
// //                                   .replace(/-/g, ' ')
// //                                   .replace(/\b\w/g, (c) => c.toUpperCase()),
// //                                 isFieldVisible(alumnusWithPrivacy, 'employmentStatus', currentUser),
// //                               )}
// //                             </p>
// //                           </div>
// //                         )}
// //                         {alum.occupations && alum.occupations.length > 0 && (
// //                           <div>
// //                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
// //                               Occupation
// //                             </p>
// //                             <p className="font-medium text-gray-800">
// //                               {getPrivateFieldDisplay(
// //                                 alum.occupations
// //                                   .map((o) =>
// //                                     o.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
// //                                   )
// //                                   .join(', '),
// //                                 isFieldVisible(alumnusWithPrivacy, 'occupations', currentUser),
// //                               )}
// //                             </p>
// //                           </div>
// //                         )}
// //                         {alum.industrySectors && alum.industrySectors.length > 0 && (
// //                           <div>
// //                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
// //                               Industry Sector
// //                             </p>
// //                             <p className="font-medium text-gray-800">
// //                               {getPrivateFieldDisplay(
// //                                 alum.industrySectors
// //                                   .map((s) =>
// //                                     s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
// //                                   )
// //                                   .join(', '),
// //                                 isFieldVisible(alumnusWithPrivacy, 'industrySectors', currentUser),
// //                               )}
// //                             </p>
// //                           </div>
// //                         )}
// //                         {alum.yearsOfExperience !== undefined &&
// //                           alum.yearsOfExperience !== null && (
// //                             <div>
// //                               <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
// //                                 Years of Experience
// //                               </p>
// //                               <p className="font-medium text-gray-800">
// //                                 {getPrivateFieldDisplay(
// //                                   `${alum.yearsOfExperience}+ years`,
// //                                   isFieldVisible(
// //                                     alumnusWithPrivacy,
// //                                     'yearsOfExperience',
// //                                     currentUser,
// //                                   ),
// //                                 )}
// //                               </p>
// //                             </div>
// //                           )}
// //                       </div>
// //                     </section>
// //                   )}

// //                   {/* Location Information */}
// //                   {(alum.city || alum.area || alum.residentialAddress) && (
// //                     <section className="bg-white shadow-md rounded-2xl p-6">
// //                       <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
// //                         <Icon icon="mdi:map-marker-outline" className="w-5 h-5 text-primary-500" />
// //                         Location
// //                       </h2>
// //                       <div className="space-y-3 text-sm">
// //                         {alum.city && (
// //                           <div>
// //                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
// //                               City
// //                             </p>
// //                             <p className="font-medium text-gray-800">
// //                               {getPrivateFieldDisplay(
// //                                 alum.city.charAt(0).toUpperCase() + alum.city.slice(1),
// //                                 isFieldVisible(alumnusWithPrivacy, 'city', currentUser),
// //                               )}
// //                             </p>
// //                           </div>
// //                         )}
// //                         {alum.area && (
// //                           <div>
// //                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
// //                               Area
// //                             </p>
// //                             <p className="font-medium text-gray-800">
// //                               {getPrivateFieldDisplay(
// //                                 alum.area.charAt(0).toUpperCase() + alum.area.slice(1),
// //                                 isFieldVisible(alumnusWithPrivacy, 'area', currentUser),
// //                               )}
// //                             </p>
// //                           </div>
// //                         )}
// //                         {alum.residentialAddress && (
// //                           <div>
// //                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
// //                               Residential Address
// //                             </p>
// //                             <p className="font-medium text-gray-800">
// //                               {getPrivateFieldDisplay(
// //                                 alum.residentialAddress,
// //                                 isFieldVisible(
// //                                   alumnusWithPrivacy,
// //                                   'residentialAddress',
// //                                   currentUser,
// //                                 ),
// //                               )}
// //                             </p>
// //                           </div>
// //                         )}
// //                       </div>
// //                     </section>
// //                   )}

// //                   {/* Personal Information */}
// //                   {alum.birthDate && (
// //                     <section className="bg-white shadow-md rounded-2xl p-6">
// //                       <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
// //                         <Icon icon="mdi:calendar-outline" className="w-5 h-5 text-primary-500" />
// //                         Personal
// //                       </h2>
// //                       <div className="text-sm">
// //                         <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
// //                           Date of Birth
// //                         </p>
// //                         <p className="font-medium text-gray-800">
// //                           {getPrivateFieldDisplay(
// //                             new Date(alum.birthDate).toLocaleDateString('en-US', {
// //                               year: 'numeric',
// //                               month: 'long',
// //                               day: 'numeric',
// //                             }),
// //                             isFieldVisible(alumnusWithPrivacy, 'birthDate', currentUser),
// //                           )}
// //                         </p>
// //                       </div>
// //                     </section>
// //                   )}

// //                   {/* Contact Information (WhatsApp/Alternative Phone) */}
// //                   {alum.alternativePhone && (
// //                     <section className="bg-white shadow-md rounded-2xl p-6">
// //                       <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
// //                         <Icon icon="mdi:phone-outline" className="w-5 h-5 text-primary-500" />
// //                         Additional Contact
// //                       </h2>
// //                       <div className="space-y-3 text-sm">
// //                         {alum.alternativePhone && (
// //                           <div>
// //                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
// //                               Alternative Phone
// //                             </p>
// //                             <p className="font-medium text-gray-800">
// //                               {getPrivateFieldDisplay(
// //                                 alum.alternativePhone,
// //                                 isFieldVisible(alumnusWithPrivacy, 'alternativePhone', currentUser),
// //                               )}
// //                             </p>
// //                           </div>
// //                         )}
// //                       </div>
// //                     </section>
// //                   )}

// //                   {/* Volunteer Status */}
// //                   {alum.isVolunteer && (
// //                     <section className="bg-white shadow-md rounded-2xl p-6">
// //                       <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
// //                         <Icon icon="mdi:hand-heart-outline" className="w-5 h-5 text-primary-500" />
// //                         Community
// //                       </h2>
// //                       <div className="flex items-center gap-2 text-sm">
// //                         <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-500" />
// //                         <span className="text-gray-700">Available for volunteer opportunities</span>
// //                       </div>
// //                     </section>
// //                   )}

// //                   {/* Privacy notice — only shown when viewing someone else's profile */}
// //                   {currentUser?.memberId !== alumnus.memberId && (
// //                     <p className="text-xs text-gray-400 text-center pb-2">
// //                       Some fields may be hidden based on this member's privacy settings.
// //                     </p>
// //                   )}
// //                 </>
// //               ) : (
// //                 <section className="bg-white shadow-md rounded-2xl p-6">
// //                   <h2 className="text-xl font-semibold mb-3">Profile access limited</h2>
// //                   <p className="text-gray-700 leading-7">
// //                     Sign in to view full profile information including professional background,
// //                     location details, and contact information.
// //                   </p>
// //                 </section>
// //               )}
// //             </main>
// //           </div>
// //         </div>
// //       </section>
// //     </>
// //   );
// // }

// // features/alumni/pages/AlumniProfilePage.tsx

// import { Icon } from '@iconify/react';
// import { useParams } from 'react-router-dom';
// import { useAlumnusById } from '@/features/alumni/hooks/useAlumni';
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// import { getMockAccountByMemberId } from '@/features/authentication/lib/mockAuth';
// import { defaultPrivacySettings } from '@/features/authentication/types/auth.types';
// import type { PrivacySettings } from '@/features/authentication/types/auth.types';
// import { Layout } from '@/shared/components/layout/Layout';
// import { AppLink } from '@/shared/components/ui/AppLink';
// import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
// import { SEO } from '@/shared/common/SEO';
// import {
//   isFieldVisible,
//   getPrivateFieldDisplay,
//   getPhotoDisplay,
// } from '@/features/alumni/utils/privacyHelpers';

// // ─── Skeleton ─────────────────────────────────────────────────────────────────
// function ProfileSkeleton() {
//   return (
//     <section className="section py-12">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
//           <aside className="lg:col-span-1 bg-white shadow-md rounded-2xl p-6 flex flex-col items-center gap-3">
//             <div className="w-36 h-36 rounded-full bg-gray-200" />
//             <div className="h-5 bg-gray-200 rounded w-2/3" />
//             <div className="h-4 bg-gray-200 rounded w-1/3" />
//             <div className="w-full mt-2 space-y-2">
//               <div className="h-3 bg-gray-200 rounded w-full" />
//               <div className="h-3 bg-gray-200 rounded w-5/6" />
//               <div className="h-3 bg-gray-200 rounded w-4/6" />
//             </div>
//           </aside>
//           <main className="lg:col-span-2 space-y-6">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <div key={i} className="bg-white shadow-md rounded-2xl p-6 space-y-3">
//                 <div className="h-5 bg-gray-200 rounded w-1/4" />
//                 <div className="h-3 bg-gray-200 rounded w-full" />
//                 <div className="h-3 bg-gray-200 rounded w-full" />
//                 <div className="h-3 bg-gray-200 rounded w-3/4" />
//               </div>
//             ))}
//           </main>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────
// export function AlumniProfilePage() {
//   const { slug = '' } = useParams(); // slug is actually the ID now
//   const currentUser = useAuthStore((state) => state.user);
//   const isSignedIn = !!currentUser;

//   // Use the ID to fetch alumni
//   const { data: alumnus, isLoading, error } = useAlumnusById(slug);

//   console.log('AlumniProfilePage - ID:', slug);
//   console.log('AlumniProfilePage - isLoading:', isLoading);
//   console.log('AlumniProfilePage - error:', error);
//   console.log('AlumniProfilePage - alumnus:', alumnus);

//   if (isLoading) return <ProfileSkeleton />;

//   if (error) {
//     return (
//       <section className="section">
//         <div className="container-custom text-center py-12">
//           <Icon icon="mdi:alert-circle-outline" className="w-16 h-16 text-red-400 mx-auto mb-4" />
//           <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
//           <p className="text-gray-600 mb-6">
//             There was an error loading this profile. Please try again later.
//           </p>
//           <div className="flex gap-4 justify-center">
//             <AppLink href="/alumni/profiles" className="btn btn-primary">
//               Browse Directory
//             </AppLink>
//             <button
//               onClick={() => window.location.reload()}
//               className="btn btn-outline"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (!alumnus) {
//     return (
//       <section className="section">
//         <div className="container-custom text-center py-12">
//           <Icon icon="mdi:account-alert" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <h1 className="text-3xl font-bold mb-4">Alumni profile not found</h1>
//           <p className="text-gray-600 mb-6">
//             The profile you're looking for doesn't exist or has been removed.
//           </p>
//           <div className="flex gap-4 justify-center">
//             <AppLink href="/alumni/profiles" className="btn btn-primary">
//               Browse Directory
//             </AppLink>
//             <button
//               onClick={() => window.location.reload()}
//               className="btn btn-outline"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // ── Merge session data for own profile ────────────────────────────────────
//   const isOwnProfile = currentUser?.memberId === alumnus.memberId;

//   const displayAlumnus =
//     isOwnProfile && currentUser
//       ? {
//           ...alumnus,
//           photo: currentUser.photo || alumnus.photo,
//           alternativePhone: currentUser.alternativePhone || alumnus.alternativePhone,
//           birthDate: currentUser.birthDate || alumnus.birthDate,
//           residentialAddress: currentUser.residentialAddress || alumnus.residentialAddress,
//           area: currentUser.area || alumnus.area,
//           city: currentUser.city || alumnus.city,
//           employmentStatus: currentUser.employmentStatus || alumnus.employmentStatus,
//           occupations: currentUser.occupations || alumnus.occupations,
//           industrySectors: currentUser.industrySectors || alumnus.industrySectors,
//           yearsOfExperience: currentUser.yearsOfExperience ?? alumnus.yearsOfExperience,
//           isVolunteer: currentUser.isVolunteer ?? alumnus.isVolunteer,
//           linkedin: currentUser.linkedin || alumnus.linkedin,
//           twitter: currentUser.twitter || alumnus.twitter,
//           instagram: currentUser.instagram || alumnus.instagram,
//         }
//       : alumnus;

//   // ── Resolve privacy settings ──────────────────────────────────────────────
//   const alumnusAccount = displayAlumnus.memberId
//     ? getMockAccountByMemberId(displayAlumnus.memberId)
//     : undefined;

//   const privacy: PrivacySettings = {
//     ...defaultPrivacySettings,
//     ...alumnusAccount?.privacy,
//     ...(isOwnProfile && currentUser?.privacy ? currentUser.privacy : {}),
//   };

//   const alumnusWithPrivacy = { ...displayAlumnus, privacy, id: displayAlumnus.memberId };
//   const alum = { ...displayAlumnus };

//   const hasAnySocial = alum.linkedin || alum.twitter || alum.instagram;

//   const breadcrumbItems = [
//     { label: 'Home', href: '/' },
//     { label: 'Profiles', href: '/alumni/profiles' },
//     { label: alum.name },
//   ];

//   return (
//     <>
//       <SEO title={alum.name} description={alum.short_bio} />
//       <Breadcrumbs items={breadcrumbItems} />

//       <section className="section py-12">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* ── Sidebar ──────────────────────────────────────────────── */}
//             <aside className="lg:col-span-1 bg-white shadow-md rounded-2xl p-6 text-center">
//               {getPhotoDisplay(
//                 alum.photo,
//                 isFieldVisible(alumnusWithPrivacy, 'photo', currentUser),
//               ) ? (
//                 <img
//                   src={alum.photo || '/logo.svg'}
//                   alt={alum.name}
//                   className="w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover border mx-auto mb-4"
//                 />
//               ) : (
//                 <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gray-100 border flex flex-col items-center justify-center mx-auto mb-4">
//                   <Icon icon="mdi:lock" className="w-12 h-12 text-gray-300" />
//                   <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-0.5">
//                     <Icon icon="mdi:lock" className="w-3 h-3" />
//                     Private
//                   </span>
//                 </div>
//               )}

//               <h1 className="text-2xl font-bold">{alum.name}</h1>
//               <p className="text-primary-600 mt-1">Class of {alum.year}</p>

//               {isSignedIn ? (
//                 <>
//                   <div className="mt-4 space-y-2 text-sm text-gray-700 text-left">
//                     {alum.position && (
//                       <p>
//                         <strong>Position:</strong> {alum.position}
//                       </p>
//                     )}
//                     {alum.company && (
//                       <p>
//                         <strong>Company:</strong> {alum.company}
//                       </p>
//                     )}
//                     {alum.location && (
//                       <p>
//                         <strong>Location:</strong>{' '}
//                         {getPrivateFieldDisplay(
//                           alum.location,
//                           isFieldVisible(alumnusWithPrivacy, 'city', currentUser),
//                         )}
//                       </p>
//                     )}
//                     {alum.email && (
//                       <p className="flex items-center gap-1 flex-wrap">
//                         <strong>Email:</strong>
//                         <AppLink
//                           href={`mailto:${alum.email}`}
//                           className="text-primary-600 hover:underline"
//                         >
//                           {alum.email}
//                         </AppLink>
//                       </p>
//                     )}
//                   </div>

//                   {hasAnySocial && (
//                     <div className="mt-6 flex justify-center gap-5 text-gray-600">
//                       {alum.linkedin && (
//                         <AppLink
//                           href={alum.linkedin}
//                           target="_blank"
//                           className="hover:text-primary-600"
//                         >
//                           <Icon icon="mdi:linkedin" className="w-6 h-6" />
//                         </AppLink>
//                       )}
//                       {alum.twitter && (
//                         <AppLink
//                           href={alum.twitter}
//                           target="_blank"
//                           className="hover:text-primary-600"
//                         >
//                           <Icon icon="mdi:twitter" className="w-6 h-6" />
//                         </AppLink>
//                       )}
//                       {alum.instagram && (
//                         <AppLink
//                           href={alum.instagram}
//                           target="_blank"
//                           className="hover:text-primary-600"
//                         >
//                           <Icon icon="mdi:instagram" className="w-6 h-6" />
//                         </AppLink>
//                       )}
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50 p-4 text-left">
//                   <p className="text-sm font-semibold text-primary-900">Member-only profile</p>
//                   <p className="mt-2 text-sm leading-6 text-primary-900/80">
//                     Sign in to view this alumnus's biography, work details, contact information, and
//                     full profile sections.
//                   </p>
//                   <AppLink
//                     href="/auth/login"
//                     className="btn btn-primary btn-sm mt-4 w-full justify-center"
//                   >
//                     Sign in to continue
//                   </AppLink>
//                 </div>
//               )}
//             </aside>

//             {/* ── Main Content ─────────────────────────────────────────── */}
//             <main className="lg:col-span-2 space-y-8">
//               {isSignedIn ? (
//                 <>
//                   <section className="bg-white shadow-md rounded-2xl p-6">
//                     <h2 className="text-xl font-semibold mb-3">About</h2>
//                     <p className="text-gray-700">{alum.long_bio || alum.short_bio || 'No bio available.'}</p>
//                   </section>

//                   {/* Professional Information */}
//                   {(alum.employmentStatus ||
//                     alum.occupations ||
//                     alum.industrySectors ||
//                     alum.yearsOfExperience) && (
//                     <section className="bg-white shadow-md rounded-2xl p-6">
//                       <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                         <Icon icon="mdi:briefcase-outline" className="w-5 h-5 text-primary-500" />
//                         Professional Information
//                       </h2>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                         {alum.employmentStatus && (
//                           <div>
//                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                               Employment Status
//                             </p>
//                             <p className="font-medium text-gray-800">
//                               {getPrivateFieldDisplay(
//                                 alum.employmentStatus
//                                   .replace(/-/g, ' ')
//                                   .replace(/\b\w/g, (c) => c.toUpperCase()),
//                                 isFieldVisible(alumnusWithPrivacy, 'employmentStatus', currentUser),
//                               )}
//                             </p>
//                           </div>
//                         )}
//                         {alum.occupations && alum.occupations.length > 0 && (
//                           <div>
//                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                               Occupation
//                             </p>
//                             <p className="font-medium text-gray-800">
//                               {getPrivateFieldDisplay(
//                                 alum.occupations
//                                   .map((o) =>
//                                     o.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
//                                   )
//                                   .join(', '),
//                                 isFieldVisible(alumnusWithPrivacy, 'occupations', currentUser),
//                               )}
//                             </p>
//                           </div>
//                         )}
//                         {alum.industrySectors && alum.industrySectors.length > 0 && (
//                           <div>
//                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                               Industry Sector
//                             </p>
//                             <p className="font-medium text-gray-800">
//                               {getPrivateFieldDisplay(
//                                 alum.industrySectors
//                                   .map((s) =>
//                                     s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
//                                   )
//                                   .join(', '),
//                                 isFieldVisible(alumnusWithPrivacy, 'industrySectors', currentUser),
//                               )}
//                             </p>
//                           </div>
//                         )}
//                         {alum.yearsOfExperience !== undefined &&
//                           alum.yearsOfExperience !== null && (
//                             <div>
//                               <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                                 Years of Experience
//                               </p>
//                               <p className="font-medium text-gray-800">
//                                 {getPrivateFieldDisplay(
//                                   `${alum.yearsOfExperience}+ years`,
//                                   isFieldVisible(
//                                     alumnusWithPrivacy,
//                                     'yearsOfExperience',
//                                     currentUser,
//                                   ),
//                                 )}
//                               </p>
//                             </div>
//                           )}
//                       </div>
//                     </section>
//                   )}

//                   {/* Location Information */}
//                   {(alum.city || alum.area || alum.residentialAddress) && (
//                     <section className="bg-white shadow-md rounded-2xl p-6">
//                       <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                         <Icon icon="mdi:map-marker-outline" className="w-5 h-5 text-primary-500" />
//                         Location
//                       </h2>
//                       <div className="space-y-3 text-sm">
//                         {alum.city && (
//                           <div>
//                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                               City
//                             </p>
//                             <p className="font-medium text-gray-800">
//                               {getPrivateFieldDisplay(
//                                 alum.city.charAt(0).toUpperCase() + alum.city.slice(1),
//                                 isFieldVisible(alumnusWithPrivacy, 'city', currentUser),
//                               )}
//                             </p>
//                           </div>
//                         )}
//                         {alum.area && (
//                           <div>
//                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                               Area
//                             </p>
//                             <p className="font-medium text-gray-800">
//                               {getPrivateFieldDisplay(
//                                 alum.area.charAt(0).toUpperCase() + alum.area.slice(1),
//                                 isFieldVisible(alumnusWithPrivacy, 'area', currentUser),
//                               )}
//                             </p>
//                           </div>
//                         )}
//                         {alum.residentialAddress && (
//                           <div>
//                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                               Residential Address
//                             </p>
//                             <p className="font-medium text-gray-800">
//                               {getPrivateFieldDisplay(
//                                 alum.residentialAddress,
//                                 isFieldVisible(
//                                   alumnusWithPrivacy,
//                                   'residentialAddress',
//                                   currentUser,
//                                 ),
//                               )}
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     </section>
//                   )}

//                   {/* Personal Information */}
//                   {alum.birthDate && (
//                     <section className="bg-white shadow-md rounded-2xl p-6">
//                       <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                         <Icon icon="mdi:calendar-outline" className="w-5 h-5 text-primary-500" />
//                         Personal
//                       </h2>
//                       <div className="text-sm">
//                         <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                           Date of Birth
//                         </p>
//                         <p className="font-medium text-gray-800">
//                           {getPrivateFieldDisplay(
//                             new Date(alum.birthDate).toLocaleDateString('en-US', {
//                               year: 'numeric',
//                               month: 'long',
//                               day: 'numeric',
//                             }),
//                             isFieldVisible(alumnusWithPrivacy, 'birthDate', currentUser),
//                           )}
//                         </p>
//                       </div>
//                     </section>
//                   )}

//                   {/* Contact Information */}
//                   {alum.alternativePhone && (
//                     <section className="bg-white shadow-md rounded-2xl p-6">
//                       <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                         <Icon icon="mdi:phone-outline" className="w-5 h-5 text-primary-500" />
//                         Additional Contact
//                       </h2>
//                       <div className="space-y-3 text-sm">
//                         {alum.alternativePhone && (
//                           <div>
//                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                               Alternative Phone
//                             </p>
//                             <p className="font-medium text-gray-800">
//                               {getPrivateFieldDisplay(
//                                 alum.alternativePhone,
//                                 isFieldVisible(alumnusWithPrivacy, 'alternativePhone', currentUser),
//                               )}
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     </section>
//                   )}

//                   {/* Volunteer Status */}
//                   {alum.isVolunteer && (
//                     <section className="bg-white shadow-md rounded-2xl p-6">
//                       <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
//                         <Icon icon="mdi:hand-heart-outline" className="w-5 h-5 text-primary-500" />
//                         Community
//                       </h2>
//                       <div className="flex items-center gap-2 text-sm">
//                         <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-500" />
//                         <span className="text-gray-700">Available for volunteer opportunities</span>
//                       </div>
//                     </section>
//                   )}

//                   {/* Privacy notice */}
//                   {currentUser?.memberId !== alumnus.memberId && (
//                     <p className="text-xs text-gray-400 text-center pb-2">
//                       Some fields may be hidden based on this member's privacy settings.
//                     </p>
//                   )}
//                 </>
//               ) : (
//                 <section className="bg-white shadow-md rounded-2xl p-6">
//                   <h2 className="text-xl font-semibold mb-3">Profile access limited</h2>
//                   <p className="text-gray-700 leading-7">
//                     Sign in to view full profile information including professional background,
//                     location details, and contact information.
//                   </p>
//                 </section>
//               )}
//             </main>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// // features/alumni/pages/AlumniProfilePage.tsx

// import { Icon } from '@iconify/react';
// import { useParams } from 'react-router-dom';
// import { useAlumnus } from '@/features/alumni/hooks/useAlumni';
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// import { getMockAccountByMemberId } from '@/features/authentication/lib/mockAuth';
// import { defaultPrivacySettings } from '@/features/authentication/types/auth.types';
// import type { PrivacySettings } from '@/features/authentication/types/auth.types';
// import { AppLink } from '@/shared/components/ui/AppLink';
// import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
// import { SEO } from '@/shared/common/SEO';
// import {
//   isFieldVisible,
//   getPrivateFieldDisplay,
//   getPhotoDisplay,
// } from '@/features/alumni/utils/privacyHelpers';

// // ─── Skeleton ─────────────────────────────────────────────────────────────────
// function ProfileSkeleton() {
//   return (
//     <section className="section py-12">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
//           <aside className="lg:col-span-1 bg-white shadow-md rounded-2xl p-6 flex flex-col items-center gap-3">
//             <div className="w-36 h-36 rounded-full bg-gray-200" />
//             <div className="h-5 bg-gray-200 rounded w-2/3" />
//             <div className="h-4 bg-gray-200 rounded w-1/3" />
//             <div className="w-full mt-2 space-y-2">
//               <div className="h-3 bg-gray-200 rounded w-full" />
//               <div className="h-3 bg-gray-200 rounded w-5/6" />
//               <div className="h-3 bg-gray-200 rounded w-4/6" />
//             </div>
//           </aside>
//           <main className="lg:col-span-2 space-y-6">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <div key={i} className="bg-white shadow-md rounded-2xl p-6 space-y-3">
//                 <div className="h-5 bg-gray-200 rounded w-1/4" />
//                 <div className="h-3 bg-gray-200 rounded w-full" />
//                 <div className="h-3 bg-gray-200 rounded w-full" />
//                 <div className="h-3 bg-gray-200 rounded w-3/4" />
//               </div>
//             ))}
//           </main>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────
// export function AlumniProfilePage() {
//   const { slug = '' } = useParams(); // slug is actually the ID now (e.g., "16")
//   const currentUser = useAuthStore((state) => state.user);
//   const isSignedIn = !!currentUser;

//   // Fetch alumnus by ID
//   const { data: alumnus, isLoading, error } = useAlumnus(slug);

//   console.log('AlumniProfilePage - ID:', slug);
//   console.log('AlumniProfilePage - isLoading:', isLoading);
//   console.log('AlumniProfilePage - error:', error);
//   console.log('AlumniProfilePage - alumnus:', alumnus);

//   if (isLoading) return <ProfileSkeleton />;

//   if (error) {
//     return (
//       <section className="section">
//         <div className="container-custom text-center py-12">
//           <Icon icon="mdi:alert-circle-outline" className="w-16 h-16 text-red-400 mx-auto mb-4" />
//           <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
//           <p className="text-gray-600 mb-6">
//             There was an error loading this profile. Please try again later.
//           </p>
//           <div className="flex gap-4 justify-center">
//             <AppLink href="/alumni/profiles" className="btn btn-primary">
//               Browse Directory
//             </AppLink>
//             <button onClick={() => window.location.reload()} className="btn btn-outline">
//               Try Again
//             </button>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (!alumnus) {
//     return (
//       <section className="section">
//         <div className="container-custom text-center py-12">
//           <Icon icon="mdi:account-alert" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <h1 className="text-3xl font-bold mb-4">Alumni profile not found</h1>
//           <p className="text-gray-600 mb-6">
//             The profile you're looking for doesn't exist or has been removed.
//           </p>
//           <div className="flex gap-4 justify-center">
//             <AppLink href="/alumni/profiles" className="btn btn-primary">
//               Browse Directory
//             </AppLink>
//             <button onClick={() => window.location.reload()} className="btn btn-outline">
//               Try Again
//             </button>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // ── Merge session data for own profile ────────────────────────────────────
//   const isOwnProfile = currentUser?.memberId === alumnus.memberId;

//   const displayAlumnus =
//     isOwnProfile && currentUser
//       ? {
//           ...alumnus,
//           photo: currentUser.photo || alumnus.photo,
//           alternativePhone: currentUser.alternativePhone || alumnus.alternativePhone,
//           birthDate: currentUser.birthDate || alumnus.birthDate,
//           residentialAddress: currentUser.residentialAddress || alumnus.residentialAddress,
//           area: currentUser.area || alumnus.area,
//           city: currentUser.city || alumnus.city,
//           employmentStatus: currentUser.employmentStatus || alumnus.employmentStatus,
//           occupations: currentUser.occupations || alumnus.occupations,
//           industrySectors: currentUser.industrySectors || alumnus.industrySectors,
//           yearsOfExperience: currentUser.yearsOfExperience ?? alumnus.yearsOfExperience,
//           isVolunteer: currentUser.isVolunteer ?? alumnus.isVolunteer,
//           linkedin: currentUser.linkedin || alumnus.linkedin,
//           twitter: currentUser.twitter || alumnus.twitter,
//           instagram: currentUser.instagram || alumnus.instagram,
//         }
//       : alumnus;

//   // ── Resolve privacy settings ──────────────────────────────────────────────
//   const alumnusAccount = displayAlumnus.memberId
//     ? getMockAccountByMemberId(displayAlumnus.memberId)
//     : undefined;

//   const privacy: PrivacySettings = {
//     ...defaultPrivacySettings,
//     ...alumnusAccount?.privacy,
//     ...(isOwnProfile && currentUser?.privacy ? currentUser.privacy : {}),
//   };

//   const alumnusWithPrivacy = { ...displayAlumnus, privacy, id: displayAlumnus.memberId };
//   const alum = { ...displayAlumnus };

//   const hasAnySocial = alum.linkedin || alum.twitter || alum.instagram;

//   const breadcrumbItems = [
//     { label: 'Home', href: '/' },
//     { label: 'Profiles', href: '/alumni/profiles' },
//     { label: alum.name },
//   ];

//   return (
//     <>
//       <SEO title={alum.name} description={alum.short_bio} />
//       <Breadcrumbs items={breadcrumbItems} />

//       <section className="section py-12">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* ── Sidebar ──────────────────────────────────────────────── */}
//             <aside className="lg:col-span-1 bg-white shadow-md rounded-2xl p-6 text-center">
//               {getPhotoDisplay(
//                 alum.photo,
//                 isFieldVisible(alumnusWithPrivacy, 'photo', currentUser),
//               ) ? (
//                 <img
//                   src={alum.photo || '/logo.svg'}
//                   alt={alum.name}
//                   className="w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover border mx-auto mb-4"
//                 />
//               ) : (
//                 <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gray-100 border flex flex-col items-center justify-center mx-auto mb-4">
//                   <Icon icon="mdi:lock" className="w-12 h-12 text-gray-300" />
//                   <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-0.5">
//                     <Icon icon="mdi:lock" className="w-3 h-3" />
//                     Private
//                   </span>
//                 </div>
//               )}

//               <h1 className="text-2xl font-bold">{alum.name}</h1>
//               <p className="text-primary-600 mt-1">Class of {alum.year}</p>

//               {isSignedIn ? (
//                 <>
//                   <div className="mt-4 space-y-2 text-sm text-gray-700 text-left">
//                     {alum.position && (
//                       <p>
//                         <strong>Position:</strong> {alum.position}
//                       </p>
//                     )}
//                     {alum.company && (
//                       <p>
//                         <strong>Company:</strong> {alum.company}
//                       </p>
//                     )}
//                     {alum.location && (
//                       <p>
//                         <strong>Location:</strong>{' '}
//                         {getPrivateFieldDisplay(
//                           alum.location,
//                           isFieldVisible(alumnusWithPrivacy, 'city', currentUser),
//                         )}
//                       </p>
//                     )}
//                     {alum.email && (
//                       <p className="flex items-center gap-1 flex-wrap">
//                         <strong>Email:</strong>
//                         <AppLink
//                           href={`mailto:${alum.email}`}
//                           className="text-primary-600 hover:underline"
//                         >
//                           {alum.email}
//                         </AppLink>
//                       </p>
//                     )}
//                   </div>

//                   {hasAnySocial && (
//                     <div className="mt-6 flex justify-center gap-5 text-gray-600">
//                       {alum.linkedin && (
//                         <AppLink
//                           href={alum.linkedin}
//                           target="_blank"
//                           className="hover:text-primary-600"
//                         >
//                           <Icon icon="mdi:linkedin" className="w-6 h-6" />
//                         </AppLink>
//                       )}
//                       {alum.twitter && (
//                         <AppLink
//                           href={alum.twitter}
//                           target="_blank"
//                           className="hover:text-primary-600"
//                         >
//                           <Icon icon="mdi:twitter" className="w-6 h-6" />
//                         </AppLink>
//                       )}
//                       {alum.instagram && (
//                         <AppLink
//                           href={alum.instagram}
//                           target="_blank"
//                           className="hover:text-primary-600"
//                         >
//                           <Icon icon="mdi:instagram" className="w-6 h-6" />
//                         </AppLink>
//                       )}
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50 p-4 text-left">
//                   <p className="text-sm font-semibold text-primary-900">Member-only profile</p>
//                   <p className="mt-2 text-sm leading-6 text-primary-900/80">
//                     Sign in to view this alumnus's biography, work details, contact information, and
//                     full profile sections.
//                   </p>
//                   <AppLink
//                     href="/auth/login"
//                     className="btn btn-primary btn-sm mt-4 w-full justify-center"
//                   >
//                     Sign in to continue
//                   </AppLink>
//                 </div>
//               )}
//             </aside>

//             {/* ── Main Content ─────────────────────────────────────────── */}
//             <main className="lg:col-span-2 space-y-8">
//               {isSignedIn ? (
//                 <>
//                   <section className="bg-white shadow-md rounded-2xl p-6">
//                     <h2 className="text-xl font-semibold mb-3">About</h2>
//                     <p className="text-gray-700">
//                       {alum.long_bio || alum.short_bio || 'No bio available.'}
//                     </p>
//                   </section>

//                   {/* Professional Information */}
//                   {(alum.employmentStatus ||
//                     alum.occupations?.length ||
//                     alum.industrySectors?.length ||
//                     alum.yearsOfExperience !== undefined) && (
//                     <section className="bg-white shadow-md rounded-2xl p-6">
//                       <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                         <Icon icon="mdi:briefcase-outline" className="w-5 h-5 text-primary-500" />
//                         Professional Information
//                       </h2>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                         {alum.employmentStatus && (
//                           <div>
//                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                               Employment Status
//                             </p>
//                             <p className="font-medium text-gray-800">
//                               {getPrivateFieldDisplay(
//                                 alum.employmentStatus
//                                   .replace(/-/g, ' ')
//                                   .replace(/\b\w/g, (c) => c.toUpperCase()),
//                                 isFieldVisible(alumnusWithPrivacy, 'employmentStatus', currentUser),
//                               )}
//                             </p>
//                           </div>
//                         )}
//                         {alum.occupations && alum.occupations.length > 0 && (
//                           <div>
//                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                               Occupation
//                             </p>
//                             <p className="font-medium text-gray-800">
//                               {getPrivateFieldDisplay(
//                                 alum.occupations
//                                   .map((o) =>
//                                     o.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
//                                   )
//                                   .join(', '),
//                                 isFieldVisible(alumnusWithPrivacy, 'occupations', currentUser),
//                               )}
//                             </p>
//                           </div>
//                         )}
//                         {alum.industrySectors && alum.industrySectors.length > 0 && (
//                           <div>
//                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                               Industry Sector
//                             </p>
//                             <p className="font-medium text-gray-800">
//                               {getPrivateFieldDisplay(
//                                 alum.industrySectors
//                                   .map((s) =>
//                                     s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
//                                   )
//                                   .join(', '),
//                                 isFieldVisible(alumnusWithPrivacy, 'industrySectors', currentUser),
//                               )}
//                             </p>
//                           </div>
//                         )}
//                         {alum.yearsOfExperience !== undefined &&
//                           alum.yearsOfExperience !== null && (
//                             <div>
//                               <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                                 Years of Experience
//                               </p>
//                               <p className="font-medium text-gray-800">
//                                 {getPrivateFieldDisplay(
//                                   `${alum.yearsOfExperience}+ years`,
//                                   isFieldVisible(
//                                     alumnusWithPrivacy,
//                                     'yearsOfExperience',
//                                     currentUser,
//                                   ),
//                                 )}
//                               </p>
//                             </div>
//                           )}
//                       </div>
//                     </section>
//                   )}

//                   {/* Location Information */}
//                   {(alum.city || alum.area || alum.residentialAddress) && (
//                     <section className="bg-white shadow-md rounded-2xl p-6">
//                       <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                         <Icon icon="mdi:map-marker-outline" className="w-5 h-5 text-primary-500" />
//                         Location
//                       </h2>
//                       <div className="space-y-3 text-sm">
//                         {alum.city && (
//                           <div>
//                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                               City
//                             </p>
//                             <p className="font-medium text-gray-800">
//                               {getPrivateFieldDisplay(
//                                 alum.city.charAt(0).toUpperCase() + alum.city.slice(1),
//                                 isFieldVisible(alumnusWithPrivacy, 'city', currentUser),
//                               )}
//                             </p>
//                           </div>
//                         )}
//                         {alum.area && (
//                           <div>
//                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                               Area
//                             </p>
//                             <p className="font-medium text-gray-800">
//                               {getPrivateFieldDisplay(
//                                 alum.area.charAt(0).toUpperCase() + alum.area.slice(1),
//                                 isFieldVisible(alumnusWithPrivacy, 'area', currentUser),
//                               )}
//                             </p>
//                           </div>
//                         )}
//                         {alum.residentialAddress && (
//                           <div>
//                             <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                               Residential Address
//                             </p>
//                             <p className="font-medium text-gray-800">
//                               {getPrivateFieldDisplay(
//                                 alum.residentialAddress,
//                                 isFieldVisible(
//                                   alumnusWithPrivacy,
//                                   'residentialAddress',
//                                   currentUser,
//                                 ),
//                               )}
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     </section>
//                   )}

//                   {/* Personal Information */}
//                   {alum.birthDate && (
//                     <section className="bg-white shadow-md rounded-2xl p-6">
//                       <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                         <Icon icon="mdi:calendar-outline" className="w-5 h-5 text-primary-500" />
//                         Personal
//                       </h2>
//                       <div className="text-sm">
//                         <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                           Date of Birth
//                         </p>
//                         <p className="font-medium text-gray-800">
//                           {getPrivateFieldDisplay(
//                             new Date(alum.birthDate).toLocaleDateString('en-US', {
//                               year: 'numeric',
//                               month: 'long',
//                               day: 'numeric',
//                             }),
//                             isFieldVisible(alumnusWithPrivacy, 'birthDate', currentUser),
//                           )}
//                         </p>
//                       </div>
//                     </section>
//                   )}

//                   {/* Contact Information */}
//                   {alum.alternativePhone && (
//                     <section className="bg-white shadow-md rounded-2xl p-6">
//                       <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                         <Icon icon="mdi:phone-outline" className="w-5 h-5 text-primary-500" />
//                         Additional Contact
//                       </h2>
//                       <div className="space-y-3 text-sm">
//                         <div>
//                           <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
//                             Alternative Phone
//                           </p>
//                           <p className="font-medium text-gray-800">
//                             {getPrivateFieldDisplay(
//                               alum.alternativePhone,
//                               isFieldVisible(alumnusWithPrivacy, 'alternativePhone', currentUser),
//                             )}
//                           </p>
//                         </div>
//                       </div>
//                     </section>
//                   )}

//                   {/* Volunteer Status */}
//                   {alum.isVolunteer && (
//                     <section className="bg-white shadow-md rounded-2xl p-6">
//                       <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
//                         <Icon icon="mdi:hand-heart-outline" className="w-5 h-5 text-primary-500" />
//                         Community
//                       </h2>
//                       <div className="flex items-center gap-2 text-sm">
//                         <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-500" />
//                         <span className="text-gray-700">Available for volunteer opportunities</span>
//                       </div>
//                     </section>
//                   )}

//                   {/* Privacy notice */}
//                   {currentUser?.memberId !== alumnus.memberId && (
//                     <p className="text-xs text-gray-400 text-center pb-2">
//                       Some fields may be hidden based on this member's privacy settings.
//                     </p>
//                   )}
//                 </>
//               ) : (
//                 <section className="bg-white shadow-md rounded-2xl p-6">
//                   <h2 className="text-xl font-semibold mb-3">Profile access limited</h2>
//                   <p className="text-gray-700 leading-7">
//                     Sign in to view full profile information including professional background,
//                     location details, and contact information.
//                   </p>
//                 </section>
//               )}
//             </main>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// features/alumni/pages/AlumniProfilePage.tsx

import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { useAlumnus } from '@/features/alumni/hooks/useAlumni';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { getMockAccountByMemberId } from '@/features/authentication/lib/mockAuth';
import { defaultPrivacySettings } from '@/features/authentication/types/auth.types';
import type { PrivacySettings, FieldVisibility } from '@/features/authentication/types/auth.types';
import { AppLink } from '@/shared/components/ui/AppLink';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { SEO } from '@/shared/common/SEO';
import {
  isFieldVisible,
  getPrivateFieldDisplay,
  getPhotoDisplay,
} from '@/features/alumni/utils/privacyHelpers';
import {
  areaOptions,
  employmentStatusOptions,
  industrySectorOptions,
  occupationOptions,
} from '@/features/authentication/constants/profileOptions';

// ─── Helper Functions ─────────────────────────────────────────────────────────
function resolveLabel(
  value: string | undefined,
  options: readonly { label: string; value: string }[],
): string | undefined {
  if (!value) return undefined;
  return options.find((o) => o.value === value)?.label ?? value;
}

function formatDate(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <section className="section py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
          <aside className="lg:col-span-1 bg-white shadow-md rounded-2xl p-6 flex flex-col items-center gap-3">
            <div className="w-36 h-36 rounded-full bg-gray-200" />
            <div className="h-5 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="w-full mt-2 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
              <div className="h-3 bg-gray-200 rounded w-4/6" />
            </div>
          </aside>
          <main className="lg:col-span-2 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white shadow-md rounded-2xl p-6 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </main>
        </div>
      </div>
    </section>
  );
}

// ─── Field Row Components ─────────────────────────────────────────────────────
function FieldRow({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number;
  icon: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Icon icon={icon} className="w-4 h-4" />
        {label}
      </div>
      <p className={`text-sm font-medium ${value ? 'text-gray-700' : 'text-gray-300 italic'}`}>
        {value ?? 'Not added'}
      </p>
    </div>
  );
}

function FieldRowWithPrivacy({
  label,
  value,
  icon,
  privacy,
  currentUser,
  viewerIsOwner,
}: {
  label: string;
  value?: string | number;
  icon: string;
  privacy?: FieldVisibility;
  currentUser: any;
  viewerIsOwner: boolean;
}) {
  const isVisible = viewerIsOwner ? true : privacy === 'public';
  const displayValue = isVisible ? value : 'Private';
  const isValueEmpty = !value || (typeof value === 'string' && value.trim() === '');

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Icon icon={icon} className="w-4 h-4" />
        {label}
      </div>
      <div className="flex items-center gap-2">
        <p
          className={`text-sm font-medium ${
            !isVisible
              ? 'text-gray-400 italic flex items-center gap-1'
              : isValueEmpty
                ? 'text-gray-300 italic'
                : 'text-gray-700'
          }`}
        >
          {!isVisible ? (
            <>
              <Icon icon="mdi:lock" className="w-3 h-3" />
              Private
            </>
          ) : isValueEmpty ? (
            'Not added'
          ) : (
            displayValue
          )}
        </p>
        {privacy && viewerIsOwner && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
              privacy === 'public'
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
            title={privacy === 'public' ? 'Visible to everyone' : 'Only visible to you'}
          >
            <Icon
              icon={privacy === 'public' ? 'mdi:eye-outline' : 'mdi:lock'}
              className="w-3 h-3"
            />
            {privacy === 'public' ? 'Public' : 'Private'}
          </span>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white shadow-md rounded-2xl p-6">
      <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-5">
        <Icon icon={icon} className="w-5 h-5 text-primary-400" />
        {title}
      </h2>
      {children}
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function AlumniProfilePage() {
  const { slug = '' } = useParams(); // slug is actually the ID now (e.g., "16")
  const currentUser = useAuthStore((state) => state.user);
  const isSignedIn = !!currentUser;

  // Fetch alumnus by ID
  const { data: alumnus, isLoading, error } = useAlumnus(slug);

  if (isLoading) return <ProfileSkeleton />;

  if (error) {
    return (
      <section className="section">
        <div className="container-custom text-center py-12">
          <Icon icon="mdi:alert-circle-outline" className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">
            There was an error loading this profile. Please try again later.
          </p>
          <div className="flex gap-4 justify-center">
            <AppLink href="/alumni/profiles" className="btn btn-primary">
              Browse Directory
            </AppLink>
            <button onClick={() => window.location.reload()} className="btn btn-outline">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!alumnus) {
    return (
      <section className="section">
        <div className="container-custom text-center py-12">
          <Icon icon="mdi:account-alert" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Alumni profile not found</h1>
          <p className="text-gray-600 mb-6">
            The profile you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex gap-4 justify-center">
            <AppLink href="/alumni/profiles" className="btn btn-primary">
              Browse Directory
            </AppLink>
            <button onClick={() => window.location.reload()} className="btn btn-outline">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ── Check if viewing own profile ────────────────────────────────────────────
  const isOwnProfile = currentUser?.memberId === alumnus.memberId;

  // ── Merge session data for own profile ────────────────────────────────────
  const displayAlumnus =
    isOwnProfile && currentUser
      ? {
          ...alumnus,
          photo: currentUser.photo || alumnus.photo,
          alternativePhone: currentUser.alternativePhone || alumnus.alternativePhone,
          birthDate: currentUser.birthDate || alumnus.birthDate,
          residentialAddress: currentUser.residentialAddress || alumnus.residentialAddress,
          area: currentUser.area || alumnus.area,
          city: currentUser.city || alumnus.city,
          employmentStatus: currentUser.employmentStatus || alumnus.employmentStatus,
          occupations: currentUser.occupations || alumnus.occupations,
          industrySectors: currentUser.industrySectors || alumnus.industrySectors,
          yearsOfExperience: currentUser.yearsOfExperience ?? alumnus.yearsOfExperience,
          isVolunteer: currentUser.isVolunteer ?? alumnus.isVolunteer,
          linkedin: currentUser.linkedin || alumnus.linkedin,
          twitter: currentUser.twitter || alumnus.twitter,
          instagram: currentUser.instagram || alumnus.instagram,
          whatsappPhone: currentUser.whatsappPhone || (alumnus as any).whatsappPhone,
          privacy: currentUser.privacy || (alumnus as any).privacy,
        }
      : alumnus;

  // ── Resolve privacy settings ──────────────────────────────────────────────
  const alumnusAccount = displayAlumnus.memberId
    ? getMockAccountByMemberId(displayAlumnus.memberId)
    : undefined;

  const privacy: PrivacySettings = {
    ...defaultPrivacySettings,
    ...alumnusAccount?.privacy,
    ...(isOwnProfile && currentUser?.privacy ? currentUser.privacy : {}),
  };

  const alum = { ...displayAlumnus, privacy };

  // Resolved labels
  const occupationLabel = resolveLabel(alum.occupations?.[0], occupationOptions);
  const employmentLabel = resolveLabel(alum.employmentStatus, employmentStatusOptions);
  const areaLabel = resolveLabel(alum.area, areaOptions);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Profiles', href: '/alumni/profiles' },
    { label: alum.name || 'Profile' },
  ];

  return (
    <>
      <SEO title={alum.name || 'Alumni Profile'} description={alum.short_bio} />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section py-12">
        <div className="container-custom">
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* ── Sidebar ──────────────────────────────────────────────── */}
            <aside className="space-y-4 lg:col-span-1 h-fit">
              <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary-100 bg-primary-50 flex items-center justify-center mb-4">
                    {getPhotoDisplay(
                      alum.photo,
                      isOwnProfile || alum.privacy?.photo === 'public',
                    ) ? (
                      <img
                        src={alum.photo}
                        alt={alum.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-primary-400">
                        {alum.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase() || '??'}
                      </span>
                    )}
                  </div>
                  {/* Photo Privacy Badge - only show for owner */}
                  {isOwnProfile && alum.privacy?.photo && (
                    <span
                      className={`absolute bottom-3 right-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        alum.privacy.photo === 'public'
                          ? 'bg-green-50 text-green-600 border border-green-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-300'
                      }`}
                    >
                      <Icon
                        icon={alum.privacy.photo === 'public' ? 'mdi:eye-outline' : 'mdi:lock'}
                        className="w-3 h-3"
                      />
                    </span>
                  )}
                </div>

                <h1 className="text-lg font-bold text-gray-800">{alum.name || 'Unknown'}</h1>

                {alum.nameInSchool && alum.nameInSchool !== alum.name && (
                  <p className="text-xs text-gray-400 mt-0.5">née {alum.nameInSchool}</p>
                )}

                <p className="text-sm text-primary-500 mt-0.5">Class of {alum.year}</p>

                {/* Employment summary */}
                {occupationLabel && (
                  <p className="text-xs text-gray-500 mt-1">
                    {occupationLabel}
                    {employmentLabel ? ` · ${employmentLabel}` : ''}
                  </p>
                )}

                {/* Location */}
                {alum.city && (
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Icon icon="mdi:map-marker-outline" className="w-3.5 h-3.5" />
                    {alum.city}
                    {areaLabel ? `, ${areaLabel}` : ''}
                  </p>
                )}

                {/* Volunteer Badge */}
                {alum.isVolunteer && (
                  <div className="mt-4 bg-primary-50 border border-primary-100 rounded-2xl px-3 py-2 flex items-center gap-2">
                    <Icon icon="mdi:hand-heart-outline" className="w-4 h-4 text-primary-500" />
                    <p className="text-xs text-primary-700 font-medium">Volunteer</p>
                  </div>
                )}
              </div>
            </aside>

            {/* ── Main content ─────────────────────────────────────────── */}
            <main className="space-y-6 lg:col-span-2">
              {/* About Section */}
              <SectionCard title="About" icon="mdi:information-outline">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {alum.long_bio || alum.short_bio || 'No bio available.'}
                </p>
              </SectionCard>

              {/* Identity Section */}
              <SectionCard title="Identity" icon="mdi:account-outline">
                <div className="divide-y divide-gray-50">
                  <FieldRow label="Full Name" value={alum.name} icon="mdi:account-outline" />
                  <FieldRow
                    label="Name in School"
                    value={alum.nameInSchool}
                    icon="mdi:school-outline"
                  />
                  <FieldRow label="Email" value={alum.email} icon="mdi:email-outline" />
                  <FieldRowWithPrivacy
                    label="WhatsApp"
                    value={(alum as any).whatsappPhone}
                    icon="mdi:whatsapp"
                    privacy={alum.privacy?.whatsappPhone}
                    currentUser={currentUser}
                    viewerIsOwner={isOwnProfile}
                  />
                  <FieldRowWithPrivacy
                    label="Alt. Phone"
                    value={alum.alternativePhone}
                    icon="mdi:phone-outline"
                    privacy={alum.privacy?.alternativePhone}
                    currentUser={currentUser}
                    viewerIsOwner={isOwnProfile}
                  />
                  <FieldRowWithPrivacy
                    label="Date of Birth"
                    value={formatDate(alum.birthDate)}
                    icon="mdi:calendar-outline"
                    privacy={alum.privacy?.birthDate}
                    currentUser={currentUser}
                    viewerIsOwner={isOwnProfile}
                  />
                </div>
              </SectionCard>

              {/* Address Section */}
              <SectionCard title="Address" icon="mdi:map-marker-outline">
                <div className="divide-y divide-gray-50">
                  <FieldRowWithPrivacy
                    label="Residential Address"
                    value={alum.residentialAddress}
                    icon="mdi:home-outline"
                    privacy={alum.privacy?.residentialAddress}
                    currentUser={currentUser}
                    viewerIsOwner={isOwnProfile}
                  />
                  <FieldRowWithPrivacy
                    label="Area"
                    value={areaLabel}
                    icon="mdi:map-outline"
                    privacy={alum.privacy?.area}
                    currentUser={currentUser}
                    viewerIsOwner={isOwnProfile}
                  />
                  <FieldRowWithPrivacy
                    label="City"
                    value={alum.city}
                    icon="mdi:city-variant-outline"
                    privacy={alum.privacy?.city}
                    currentUser={currentUser}
                    viewerIsOwner={isOwnProfile}
                  />
                </div>
              </SectionCard>

              {/* Work Section */}
              <SectionCard title="Work" icon="mdi:briefcase-outline">
                <div className="divide-y divide-gray-50">
                  <FieldRowWithPrivacy
                    label="Employment Status"
                    value={employmentLabel}
                    icon="mdi:briefcase-outline"
                    privacy={alum.privacy?.employmentStatus}
                    currentUser={currentUser}
                    viewerIsOwner={isOwnProfile}
                  />
                  <FieldRowWithPrivacy
                    label="Occupation"
                    value={alum.occupations
                      ?.map((o) => resolveLabel(o, occupationOptions))
                      .join(', ')}
                    icon="mdi:account-hard-hat-outline"
                    privacy={alum.privacy?.occupations}
                    currentUser={currentUser}
                    viewerIsOwner={isOwnProfile}
                  />
                  <FieldRowWithPrivacy
                    label="Industry Sector"
                    value={alum.industrySectors
                      ?.map((s) => resolveLabel(s, industrySectorOptions))
                      .join(', ')}
                    icon="mdi:domain"
                    privacy={alum.privacy?.industrySectors}
                    currentUser={currentUser}
                    viewerIsOwner={isOwnProfile}
                  />
                  <FieldRowWithPrivacy
                    label="Years of Experience"
                    value={
                      alum.yearsOfExperience !== undefined
                        ? `${alum.yearsOfExperience} years`
                        : undefined
                    }
                    icon="mdi:chart-timeline-variant"
                    privacy={alum.privacy?.yearsOfExperience}
                    currentUser={currentUser}
                    viewerIsOwner={isOwnProfile}
                  />
                </div>
              </SectionCard>

              {/* Social Links */}
              {(alum.linkedin || alum.twitter || alum.instagram) && (
                <SectionCard title="Social Links" icon="mdi:link-variant">
                  <div className="divide-y divide-gray-50">
                    {alum.linkedin && (
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Icon icon="mdi:linkedin" className="w-4 h-4" />
                          LinkedIn
                        </div>
                        <a
                          href={alum.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary-500 hover:text-primary-600 hover:underline transition-colors"
                        >
                          View Profile
                        </a>
                      </div>
                    )}
                    {alum.twitter && (
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Icon icon="mdi:twitter" className="w-4 h-4" />
                          Twitter / X
                        </div>
                        <a
                          href={alum.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary-500 hover:text-primary-600 hover:underline transition-colors"
                        >
                          View Profile
                        </a>
                      </div>
                    )}
                    {alum.instagram && (
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Icon icon="mdi:instagram" className="w-4 h-4" />
                          Instagram
                        </div>
                        <a
                          href={alum.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary-500 hover:text-primary-600 hover:underline transition-colors"
                        >
                          View Profile
                        </a>
                      </div>
                    )}
                  </div>
                </SectionCard>
              )}

              {/* Privacy notice for non-owners */}
              {!isOwnProfile && isSignedIn && (
                <p className="text-xs text-gray-400 text-center pb-2">
                  Some fields may be hidden based on this member's privacy settings.
                </p>
              )}

              {/* Sign in prompt for non-logged in users */}
              {!isSignedIn && (
                <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 text-center">
                  <Icon
                    icon="mdi:lock-outline"
                    className="w-10 h-10 text-primary-400 mx-auto mb-3"
                  />
                  <h3 className="text-lg font-semibold text-primary-800 mb-2">
                    Sign in to view full profile
                  </h3>
                  <p className="text-sm text-primary-600 mb-4">
                    Join our alumni network to connect with fellow alumnae and access complete
                    profiles.
                  </p>
                  <AppLink href="/auth/login" className="btn btn-primary btn-sm">
                    Sign In
                  </AppLink>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
