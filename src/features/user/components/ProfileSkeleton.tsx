// features/user/components/ui/ProfileSkeleton.tsx

export function ProfileSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Sidebar Skeleton */}
      <aside className="space-y-4 lg:col-span-1">
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse mb-4" />
          <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="w-24 h-4 bg-gray-100 rounded animate-pulse mb-1" />
          <div className="w-20 h-3 bg-gray-100 rounded animate-pulse mb-5" />
          <div className="w-full h-10 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="space-y-6 lg:col-span-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white shadow-md rounded-2xl p-6">
            <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
