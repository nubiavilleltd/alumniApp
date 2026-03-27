import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { SearchInput } from '@/shared/components/ui/input/SearchInput';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
import EmptyState from '@/shared/components/ui/EmptyState';
import { useAlumni } from '@/features/alumni/hooks/useAlumni';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { getMockAccountByMemberId } from '@/features/authentication/lib/mockAuth';
import { defaultPrivacySettings } from '@/features/authentication/types/auth.types';
import { isFieldVisible, getPhotoDisplay } from '@/features/alumni/utils/privacyHelpers';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function AlumnaeCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse flex flex-col">
      <div className="h-57 w-full bg-gray-200" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="flex gap-1.5 mt-1">
          <div className="flex-1 h-7 bg-gray-200 rounded" />
          <div className="flex-1 h-7 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

// ─── Alumnae Card ─────────────────────────────────────────────────────────────
interface AlumnaeCardProps {
  entry: {
    name: string;
    slug: string;
    year: number;
    photo?: string;
    short_bio: string;
    location?: string;
    memberId?: string;
  };
  currentUser: any;
}

function AlumnaeCard({ entry, currentUser }: AlumnaeCardProps) {
  // Get privacy settings for this alumnus
  const alumnusAccount = entry.memberId ? getMockAccountByMemberId(entry.memberId) : undefined;
  const privacy = { ...defaultPrivacySettings, ...alumnusAccount?.privacy };
  const alumnusWithPrivacy = { ...entry, privacy, id: entry.memberId };

  // Check field visibility
  const photoVisible = isFieldVisible(alumnusWithPrivacy, 'photo', currentUser);
  const cityVisible = isFieldVisible(alumnusWithPrivacy, 'city', currentUser);

  const initials = entry.name
    .split(' ')
    .map((s) => s[0])
    .join('')
    .toUpperCase();

  const classLabel = `Class '${String(entry.year).slice(-2)}`;

  // Determine photo display
  const displayPhoto = getPhotoDisplay(entry.photo, photoVisible);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      {/* <div className="h-57 w-full overflow-hidden bg-gray-100"> */}
      <div className="h-57 w-full overflow-hidden bg-gray-100 min-h-[228px]">
        {displayPhoto ? (
          <img
            src={displayPhoto}
            alt={entry.name}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 relative">
            <Icon icon="mdi:account-circle" className="w-32 h-32 text-gray-300" />
            {!photoVisible && entry.photo && (
              <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-80 rounded-full p-1.5">
                <Icon icon="mdi:lock" className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1.5">
        <h3 className="text-primary-500 font-bold text-sm leading-tight">{entry.name}</h3>
        <div className="flex items-center gap-2 text-gray-400 text-[11px]">
          <span>{classLabel}</span>
          {entry.location && (
            <>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-0.5">
                <Icon icon="mdi:map-marker-outline" className="w-3 h-3" />
                {cityVisible ? (
                  entry.location
                ) : (
                  <span className="inline-flex items-center gap-0.5 italic">
                    <Icon icon="mdi:lock" className="w-2.5 h-2.5" />
                    Private
                  </span>
                )}
              </span>
            </>
          )}
        </div>
        <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">{entry.short_bio}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <button
            type="button"
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-[11px] font-medium py-1.5 rounded transition-colors"
          >
            Send Message
          </button>
          <AppLink
            href={`/alumni/profiles/${entry.memberId}`}
            className="flex-1 text-center border border-gray-300 text-gray-600 hover:border-primary-400 hover:text-primary-500 text-[11px] font-medium py-1.5 rounded transition-colors"
          >
            View Profile
          </AppLink>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 12;

export function AlumniDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // ── Get current user for privacy checks ───────────────────────────────────
  const currentUser = useAuthStore((state) => state.user);

  // ── Hook ───────────────────────────────────────────────────────────────────
  const { data: alumni = [], isLoading } = useAlumni();

  // ── Derived data ───────────────────────────────────────────────────────────
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
              placeholder="Search by Name or Set"
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
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-10">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <AlumnaeCardSkeleton key={i} />
              ))}
            </div>
          ) : visibleAlumni.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-10">
              {visibleAlumni.map((entry) => (
                <AlumnaeCard key={entry.slug} entry={entry} currentUser={currentUser} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="mdi:account-search"
              title="No alumnae found"
              description="Try adjusting your search or filter."
            />
          )}

          {/* Load More */}
          {hasMore && !isLoading && (
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
