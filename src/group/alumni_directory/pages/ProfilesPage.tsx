import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import { AppLink } from '@/components/AppLink';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Layout } from '@/components/Layout';
import { getSiteConfig } from '@/data/content';
import { getAlumni } from '@/data/site-data';

type SortMode = 'name' | 'year';

export function ProfilesPage() {
  const config = getSiteConfig();
  const alumni = getAlumni();

  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortMode>('name');
  const [currentPage, setCurrentPage] = useState(1);

  const years = useMemo(
    () => [...new Set(alumni.map((entry) => entry.year))].sort((a, b) => b - a),
    [alumni],
  );

  const filteredAlumni = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return [...alumni]
      .filter((entry) => {
        const matchesSearch =
          !normalizedSearch ||
          entry.name.toLowerCase().includes(normalizedSearch) ||
          entry.short_bio.toLowerCase().includes(normalizedSearch);
        const matchesYear = !yearFilter || entry.year.toString() === yearFilter;

        return matchesSearch && matchesYear;
      })
      .sort((a, b) => {
        if (sortBy === 'year') {
          return b.year - a.year;
        }
        return a.name.localeCompare(b.name);
      });
  }, [alumni, searchTerm, sortBy, yearFilter]);

  const itemsPerPage = config.content.alumni_per_page;
  const totalPages = Math.max(1, Math.ceil(filteredAlumni.length / itemsPerPage));

  const pagedAlumni = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * itemsPerPage;
    return filteredAlumni.slice(start, start + itemsPerPage);
  }, [currentPage, filteredAlumni, itemsPerPage, totalPages]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Profiles', href: '/alumni' },
    { label: 'Directory' },
  ];

  const onFilterChange = (): void => {
    setCurrentPage(1);
  };

  const visiblePage = Math.min(currentPage, totalPages);

  return (
    <Layout title="Alumni Directory" description="Browse alumni by year and search.">
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-accent-900 mb-4">
              Alumni Directory
            </h1>
            <p className="text-xl text-accent-600 max-w-3xl mx-auto">
              Connect with fellow alumni from {config.organization.name}. Browse profiles by
              graduation year, or search for specific alumni.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-2xl text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="mdi:account-group" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary-900">{alumni.length}</h3>
              <p className="text-primary-700">Total Alumni</p>
            </div>
            <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-6 rounded-2xl text-center">
              <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="mdi:calendar" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-accent-900">{years.length}</h3>
              <p className="text-accent-700">Graduation Years</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-accent-100 p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-accent-700 mb-2">
                  Search Alumni
                </label>
                <div className="search-wrapper">
                  <Icon icon="mdi:magnify" className="search-icon" />
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by name or skills..."
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      onFilterChange();
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="year-filter"
                  className="block text-sm font-medium text-accent-700 mb-2"
                >
                  Graduation Year
                </label>
                <select
                  id="year-filter"
                  className="select"
                  value={yearFilter}
                  onChange={(event) => {
                    setYearFilter(event.target.value);
                    onFilterChange();
                  }}
                >
                  <option value="">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-accent-600">
              Showing <span>{filteredAlumni.length}</span> of {alumni.length} alumni
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-accent-600">Sort by:</span>
              <select
                id="sort-by"
                className="select w-auto"
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value as SortMode);
                  setCurrentPage(1);
                }}
              >
                <option value="name">Name</option>
                <option value="year">Graduation Year</option>
              </select>
            </div>
          </div>

          <div className="grid-responsive-lg mb-8">
            {pagedAlumni.map((entry) => {
              const initials = entry.name
                .split(' ')
                .map((segment) => segment[0])
                .join('')
                .toUpperCase();

              return (
                <div className="profile-card" key={entry.slug}>
                  <div className="relative">
                    {entry.photo ? (
                      <img
                        src={entry.photo}
                        alt={entry.name}
                        className="profile-avatar"
                        loading="lazy"
                      />
                    ) : (
                      <div className="profile-avatar-placeholder">{initials}</div>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-accent-900 mb-2">{entry.name}</h3>
                  <p className="text-accent-600 mb-3">{entry.short_bio}</p>

                  <div className="flex items-center justify-between text-sm text-accent-500">
                    <span>Class of {entry.year}</span>
                    <AppLink
                      href={`/alumni/profiles/${entry.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View Profile →
                    </AppLink>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center space-x-2">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={visiblePage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              <Icon icon="mdi:chevron-left" className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  type="button"
                  key={pageNumber}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    pageNumber === visiblePage
                      ? 'bg-primary-600 text-white'
                      : 'text-accent-600 hover:text-accent-900 hover:bg-accent-100'
                  }`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={visiblePage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
              <Icon icon="mdi:chevron-right" className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
