// // features/user/components/ui/ProfileSkeleton.tsx

// export function ProfileSkeleton() {
//   return (
//     <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
//       {/* Sidebar Skeleton */}
//       <aside className="space-y-4 lg:col-span-1">
//         <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
//           <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse mb-4" />
//           <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mb-2" />
//           <div className="w-24 h-4 bg-gray-100 rounded animate-pulse mb-1" />
//           <div className="w-20 h-3 bg-gray-100 rounded animate-pulse mb-5" />
//           <div className="w-full h-10 bg-gray-100 rounded-xl animate-pulse" />
//         </div>
//       </aside>

//       {/* Main Content Skeleton */}
//       <main className="space-y-6 lg:col-span-2">
//         {[1, 2, 3].map((i) => (
//           <div key={i} className="bg-white shadow-md rounded-2xl p-6">
//             <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mb-4" />
//             <div className="space-y-3">
//               {[1, 2, 3].map((j) => (
//                 <div key={j} className="flex items-center justify-between">
//                   <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
//                   <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </main>
//     </div>
//   );
// }

// features/user/components/ProfileSkeleton.tsx
//
// Shared skeleton for both UserProfilePage and AlumniProfilePage.
// Matches the 2-column layout: sidebar left, info panels right.

export function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 animate-pulse">
      {/* Left: sidebar */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-3">
          <div className="w-28 h-28 rounded-full bg-gray-200" />
          <div className="h-5 bg-gray-200 rounded w-36" />
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-8 bg-gray-100 rounded-full w-32 mt-2" />
        </div>
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 bg-gray-100 rounded w-full" />
          ))}
        </div>
      </div>

      {/* Right: info panels */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-3"
          >
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex gap-4 py-1">
                <div className="h-3 bg-gray-100 rounded w-32 flex-shrink-0" />
                <div className="h-3 bg-gray-100 rounded flex-1" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
