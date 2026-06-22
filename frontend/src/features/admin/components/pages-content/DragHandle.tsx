export function DragHandle() {
  return (
    <div
      className="grid w-9 cursor-grab grid-cols-3 gap-1 active:cursor-grabbing"
      aria-hidden="true"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <span key={index} className="h-1.5 w-1.5 rounded-full bg-cms-drag-dot" />
      ))}
    </div>
  );
}
