export function LiveNewsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Featured + sidebar row */}
      <div className="grid gap-6 lg:grid-cols-2 items-stretch">

        {/* Featured skeleton */}
        <div className="rounded-3xl bg-white shadow-sm p-3 flex flex-col gap-3">
          <div className="h-[240px] w-full rounded-3xl bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="pt-3 flex flex-col gap-3">
            <div className="h-7 w-3/4 rounded bg-gray-200" />
            <div className="h-7 w-1/2 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
          </div>
        </div>

        {/* Sidebar skeletons — 3 cards */}
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-[24px] bg-white p-4 shadow-sm">
              <div className="h-[130px] w-[160px] rounded-2xl bg-gray-200 flex-shrink-0" />
              <div className="flex flex-col gap-2 flex-1 py-1">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-4/5 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-200 mt-1" />
                <div className="h-3 w-2/3 rounded bg-gray-200" />
                <div className="h-3 w-28 rounded bg-gray-200 mt-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom grid skeletons — 4 cards */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 rounded-[24px] bg-white p-4 shadow-sm">
            <div className="h-[130px] w-[160px] rounded-2xl bg-gray-200 flex-shrink-0" />
            <div className="flex flex-col gap-2 flex-1 py-1">
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-4/5 rounded bg-gray-200" />
              <div className="h-3 w-full rounded bg-gray-200 mt-1" />
              <div className="h-3 w-2/3 rounded bg-gray-200" />
              <div className="h-3 w-28 rounded bg-gray-200 mt-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}