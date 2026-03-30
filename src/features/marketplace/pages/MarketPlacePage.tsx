// features/marketplace/pages/MarketPlacePage.tsx

import { Icon } from '@iconify/react';
import { useState, useMemo } from 'react';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { PostBusinessModal } from '../components/PostYourBusinessModal';
import { SearchInput } from '@/shared/components/ui/input/SearchInput';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
import EmptyState from '@/shared/components/ui/EmptyState';
import {
  useMarketplace,
  useMarketplaceCategories,
} from '@/features/marketplace/hooks/useMarketplace';
import type { Business } from '../types/marketplace.types';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function BusinessCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse flex flex-col">
      <div className="h-44 w-full bg-gray-200" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="h-7 bg-gray-200 rounded w-full mt-1" />
      </div>
    </div>
  );
}

// ─── Business Card ────────────────────────────────────────────────────────────
function BusinessCard({ business }: { business: Business }) {
  const [imgIndex, setImgIndex] = useState(0);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex((i) => (i === 0 ? business.images.length - 1 : i - 1));
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex((i) => (i === business.images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      {/* Image carousel */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-100 group">
        {business.images.length > 0 ? (
          <img
            src={business.images[imgIndex]}
            alt={business.name}
            className="w-full h-full object-cover transition-all duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <Icon icon="mdi:storefront-outline" className="w-12 h-12 text-gray-300" />
          </div>
        )}
        {business.images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon icon="mdi:chevron-left" className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon icon="mdi:chevron-right" className="w-4 h-4 text-gray-700" />
            </button>
          </>
        )}
        <span className="absolute top-2 left-2 bg-primary-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
          {business.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <h3 className="text-gray-900 font-bold text-sm leading-tight">{business.name}</h3>
        <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-3">
          {business.description}
        </p>
        <div className="flex flex-col gap-1 mt-1">
          <span className="flex items-center gap-1 text-gray-400 text-[11px]">
            <Icon icon="mdi:map-marker-outline" className="w-3 h-3 flex-shrink-0" />
            {business.location}
          </span>
          <span className="flex items-center gap-1 text-gray-400 text-[11px]">
            <Icon icon="mdi:phone-outline" className="w-3 h-3 flex-shrink-0" />
            {business.phone}
          </span>
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary-500 hover:text-primary-600 text-[11px] truncate"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon icon="mdi:web" className="w-3 h-3 flex-shrink-0" />
              {business.website}
            </a>
          )}
          <span className="flex items-center gap-1 text-gray-400 text-[11px]">
            <Icon icon="mdi:account-outline" className="w-3 h-3 flex-shrink-0" />
            {business.owner}
          </span>
        </div>
        <button
          type="button"
          className="mt-2 w-full bg-primary-500 hover:bg-primary-600 text-white text-[11px] font-medium py-1.5 rounded transition-colors"
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 9;

export default function MarketPlacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showPostModal, setShowPostModal] = useState(false);
  const currentUser = useAuthStore((state) => state.user);

  const { data: businesses = [], isLoading, error } = useMarketplace();
  const { data: categoriesList = [] } = useMarketplaceCategories();

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return businesses.filter((b) => {
      const matchesSearch =
        !q || b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q);
      const matchesCategory = !category || b.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [businesses, searchTerm, category]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Marketplace' }];

  return (
    <>
      <SEO
        title="Marketplace"
        description="Discover and support businesses owned by Our Sisters."
      />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section">
        <div className="container-custom">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <h1 className="text-3xl md:text-4xl font-bold italic mb-1">
                Market <span className="text-primary-500">Place</span>
              </h1>
              <p className="text-gray-500 text-sm">
                Discover and support businesses owned by Our Sisters.
              </p>
            </div>

            {currentUser && (
              <button
                type="button"
                onClick={() => setShowPostModal(true)}
                className="flex-shrink-0 flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                <Icon icon="mdi:plus" className="w-4 h-4" />
                Post Your Business
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-end gap-3 mb-8">
            <SearchInput
              label="Search"
              value={searchTerm}
              onValueChange={handleFilterChange(setSearchTerm)}
              placeholder="Search for service, product, or business"
              className="flex-1"
            />
            <FilterDropdown
              label="Select Category"
              value={category}
              onChange={handleFilterChange(setCategory)}
              options={categoriesList.map((cat) => ({ label: cat, value: cat }))}
            />
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <Icon
                icon="mdi:alert-circle-outline"
                className="w-16 h-16 text-red-400 mx-auto mb-4"
              />
              <p className="text-gray-500">Failed to load businesses. Please try again later.</p>
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <BusinessCardSkeleton key={i} />
              ))}
            </div>
          ) : !error && visible.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {visible.map((business) => (
                <BusinessCard key={business.businessId} business={business} />
              ))}
            </div>
          ) : !error && visible.length === 0 ? (
            <EmptyState
              icon="mdi:storefront-outline"
              title="No businesses found"
              description="Try adjusting your search or be the first to list your business."
              actionLabel={currentUser ? 'Post Your Business' : ''}
              onAction={() => setShowPostModal(true)}
            />
          ) : null}

          {/* Load More */}
          {hasMore && !isLoading && !error && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-8 py-3 rounded-full transition-colors"
              >
                Load More Businesses
              </button>
            </div>
          )}
        </div>
      </section>

      <PostBusinessModal isOpen={showPostModal} onClose={() => setShowPostModal(false)} />
    </>
  );
}
