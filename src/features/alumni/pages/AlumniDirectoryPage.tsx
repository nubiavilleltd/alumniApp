

import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import { getSiteConfig } from '@/data/content';
import { getAlumni } from '@/data/site-data';
import { AppLink } from '@/shared/components/ui/AppLink';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { SearchInput } from '@/shared/components/ui/input/SearchInput';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';

type SortMode = 'name' | 'year';





// ─── Alumnae Card ────────────────────────────────────────────────────────────
interface AlumnaeCardProps {
  entry: {
    name: string;
    slug: string;
    year: number;
    photo?: string;
    short_bio: string;
    location?: string;
  };
}

function AlumnaeCard({ entry }: AlumnaeCardProps) {
  const initials = entry.name
    .split(' ')
    .map((s) => s[0])
    .join('')
    .toUpperCase();

  // Format as "Class '90" from full year e.g. 1990
  const classLabel = `Class '${String(entry.year).slice(-2)}`;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      {/* Photo */}
      {/* <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100"> */}
      <div className="h-57 w-full overflow-hidden bg-gray-100">
        {entry.photo ? (
          <img
            src={entry.photo}
            alt={entry.name}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-50">
            <span className="text-3xl font-bold text-primary-400">{initials}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        <h3 className="text-primary-500 font-bold text-sm leading-tight">{entry.name}</h3>

        {/* Class + Location row */}
        <div className="flex items-center gap-2 text-gray-400 text-[11px]">
          <span>{classLabel}</span>
          {entry.location && (
            <>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-0.5">
                <Icon icon="mdi:map-marker-outline" className="w-3 h-3" />
                {entry.location}
              </span>
            </>
          )}
        </div>

        {/* Bio */}
        <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">{entry.short_bio}</p>

        {/* Actions */}
        <div className="flex items-center gap-1.5 mt-1">
          <button
            type="button"
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-[11px] font-medium py-1.5 rounded transition-colors"
          >
            Send Message
          </button>
          <AppLink
            href={`/alumni/profiles/${entry.slug}`}
            className="flex-1 text-center border border-gray-300 text-gray-600 hover:border-primary-400 hover:text-primary-500 text-[11px] font-medium py-1.5 rounded transition-colors"
          >
            View Profile
          </AppLink>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 12;

export function AlumniDirectoryPage() {
  const alumni = getAlumni();

  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const years = useMemo(
    () => [...new Set(alumni.map((e) => e.year))].sort((a, b) => b - a),
    [alumni],
  );

  const filteredAlumni = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return alumni.filter((e) => {
      const matchesSearch =
        !q || e.name.toLowerCase().includes(q) || e.short_bio.toLowerCase().includes(q);
      const matchesYear = !yearFilter || e.year.toString() === yearFilter;
      return matchesSearch && matchesYear;
    });
  }, [alumni, searchTerm, yearFilter]);

  const visibleAlumni = filteredAlumni.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAlumni.length;

  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Profiles', href: '/alumni' },
    { label: 'Directory' },
  ];

  return (
    <>
      <SEO
        title="Alumnae Directory"
        description="Find your classmates, connect with fellow alumnae from your state, or discover women across every profession worldwide."
      />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold italic mb-2">
              Alumnae <span className="text-primary-500">Directory</span>
            </h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Find your classmates, connect with fellow alumnae from your state, or discover women
              across every profession worldwide.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-end gap-3 mb-8">
            <SearchInput
              label="Search Alumnae"
              value={searchTerm}
              onValueChange={handleFilterChange(setSearchTerm)}
              placeholder='Search by Name or Set'
              className="flex-1"
            />
            <FilterDropdown
              label="Graduation Year"
              value={yearFilter}
              onChange={handleFilterChange(setYearFilter)}
              placeholder="All Years"
              options={years.map((y) => ({ label: String(y), value: String(y) }))}
            />
          </div>

          {/* Grid */}
          {visibleAlumni.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-10">
              {visibleAlumni.map((entry) => (
                <AlumnaeCard key={entry.slug} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Icon icon="mdi:account-search" className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No alumnae found matching your search.</p>
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
                Load More Alumnae
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
