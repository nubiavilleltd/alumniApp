interface StoreSkeletonProps {
  count?: number;
}

export function StoreSkeleton({
  count = 8,
}: StoreSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="
            bg-white
            rounded-3xl
            overflow-hidden
            animate-pulse
            border border-gray-100
          "
        >
          <div className="relative h-[260px] bg-gray-100">
            <div className="absolute top-4 left-4 h-7 w-24 rounded-full bg-gray-200" />
          </div>

          <div className="p-4 flex justify-between gap-4">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
            </div>

            <div className="h-6 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}