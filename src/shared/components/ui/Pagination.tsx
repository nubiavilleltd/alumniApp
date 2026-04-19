// shared/components/ui/Pagination.tsx
//
// Reusable pagination component.
// Shows numbered pages with prev/next arrows and smart ellipsis.
//
// Usage:
//   <Pagination
//     currentPage={page}
//     totalPages={Math.ceil(total / perPage)}
//     onPageChange={setPage}
//   />

import { Icon } from '@iconify/react';

interface PaginationProps {
  currentPage: number; // 1-based
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Max page buttons visible before collapsing with ellipsis. Default: 5 */
  maxVisible?: number;
}

/**
 * Build the list of page numbers (and null = ellipsis) to render.
 * Always shows first page, last page, current page, and neighbours.
 */
function buildPages(current: number, total: number, maxVisible: number): (number | null)[] {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Always show first, last, and a window around current
  const half = Math.floor((maxVisible - 2) / 2); // slots around current
  let start = Math.max(2, current - half);
  let end = Math.min(total - 1, current + half);

  // Shift window if it's pushed against either edge
  if (end - start < maxVisible - 3) {
    if (start === 2) end = Math.min(total - 1, start + maxVisible - 3);
    if (end === total - 1) start = Math.max(2, end - (maxVisible - 3));
  }

  const pages: (number | null)[] = [1];
  if (start > 2) pages.push(null); // left ellipsis
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push(null); // right ellipsis
  pages.push(total);

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages, maxVisible);

  const baseBtn =
    'min-w-[40px] h-10 px-3 rounded-xl text-sm font-semibold flex items-center justify-center transition-all';

  const btn = (page: number, content: React.ReactNode) => (
    <button
      key={page}
      type="button"
      onClick={() => onPageChange(page)}
      className={`${baseBtn} ${
        page === currentPage
          ? 'bg-primary-500 text-white shadow-md'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {content}
    </button>
  );

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 mt-6"
    >
      {/* Prev */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseBtn} bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <Icon icon="mdi:chevron-left" className="w-5 h-5" />
      </button>

      {/* Pages */}
      {pages.map((p, i) =>
        p === null ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-500 text-sm">
            ...
          </span>
        ) : (
          btn(p, p)
        ),
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseBtn} bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <Icon icon="mdi:chevron-right" className="w-5 h-5" />
      </button>
    </nav>
  );
}
