export function BirthdayCardSkeleton() {
  return (
    <div className="relative flex aspect-[7/8] w-full animate-pulse flex-col items-center rounded-t-full rounded-b-2xl bg-accent-100 px-4 pb-4 pt-[8%] text-center">
      <div className="aspect-[4/5] w-[42%] flex-shrink-0 rounded-2xl bg-accent-200" />

      <div className="mt-auto flex w-full flex-col items-center gap-2">
        <div className="h-3 w-2/3 rounded bg-accent-200" />
        <div className="h-4 w-1/2 rounded bg-accent-200" />
        <div className="h-3 w-1/3 rounded bg-accent-200" />
        <div className="h-3 w-1/4 rounded bg-accent-200" />
      </div>
    </div>
  );
}