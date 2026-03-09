import { Icon } from '@iconify/react';
import { useState, useMemo } from 'react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { businesses, categories } from '@/data/site-data';

import { PostBusinessModal } from '../components/PostYourBusinessModal';

// ─── Reusable Search Input ────────────────────────────────────────────────────
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

function SearchInput({ value, onChange, placeholder = 'Search for service, product, or business', label }: SearchInputProps) {
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

// ─── Reusable Category Dropdown ───────────────────────────────────────────────
interface CategoryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

function CategoryDropdown({ value, onChange, label }: CategoryDropdownProps) {
  return (
    <div className="w-full sm:w-52">
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm text-gray-700 shadow-sm outline-none focus:border-primary-400 cursor-pointer"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <Icon icon="mdi:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

// ─── Business Card ────────────────────────────────────────────────────────────
interface Business {
  slug: string;
  name: string;
  category: string;
  description: string;
  images: string[];
  location: string;
  phone: string;
  website: string;
  owner: string;
  slug_owner: string;
}

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
        <img
          src={business.images[imgIndex]}
          alt={business.name}
          className="w-full h-full object-cover transition-all duration-300"
          loading="lazy"
        />

        {/* Carousel arrows */}
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

        {/* Category tag */}
        <span className="absolute top-2 left-2 bg-primary-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
          {business.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <h3 className="text-gray-900 font-bold text-sm leading-tight">{business.name}</h3>
        <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-3">{business.description}</p>

        <div className="flex flex-col gap-1 mt-1">
          <span className="flex items-center gap-1 text-gray-400 text-[11px]">
            <Icon icon="mdi:map-marker-outline" className="w-3 h-3 flex-shrink-0" />
            {business.location}
          </span>
          <span className="flex items-center gap-1 text-gray-400 text-[11px]">
            <Icon icon="mdi:phone-outline" className="w-3 h-3 flex-shrink-0" />
            {business.phone}
          </span>
          <span className="flex items-center gap-1 text-gray-400 text-[11px]">
            <Icon icon="mdi:web" className="w-3 h-3 flex-shrink-0" />
            {business.website}
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

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return businesses.filter((b) => {
      const matchesSearch = !q || b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q);
      const matchesCategory = !category || b.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, category]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Marketplace' },
  ];

  return (
    <>
      <SEO title="Marketplace" description="Discover and support businesses owned by Our Sisters." />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section">
        <div className="container-custom">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <h1 className="text-3xl md:text-4xl font-bold italic mb-1">
                Market <span className="text-primary-500">Place</span>
              </h1>
              <p className="text-gray-500 text-sm">Discover and support businesses owned by Our Sisters.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowPostModal(true)}
              className="flex-shrink-0 flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Icon icon="mdi:plus" className="w-4 h-4" />
              Post Your Business
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-end gap-3 mb-8">
            <SearchInput
              label="Search"
              value={searchTerm}
              onChange={handleFilterChange(setSearchTerm)}
            />
            <CategoryDropdown
              label="Select Category"
              value={category}
              onChange={handleFilterChange(setCategory)}
            />
          </div>

          {/* Grid */}
          {visible.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {visible.map((business) => (
                <BusinessCard key={business.slug} business={business} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Icon icon="mdi:store-search" className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No businesses found matching your search.</p>
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