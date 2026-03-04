import { useParams } from 'react-router-dom';
import { AppLink } from '@/components/AppLink';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Layout } from '@/components/Layout';
import { getAlumni } from '@/data/content';

export function YearPage() {
  const { year = '' } = useParams();
  const alumni = getAlumni().filter((entry) => entry.data.year.toString() === year);

  const yearLabel = `Class of ${year}`;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Profiles', href: '/alumni/profiles' },
    { label: 'Years', href: '/alumni/years' },
    { label: yearLabel },
  ];

  return (
    <Layout title={yearLabel}>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-accent-900 mb-4">{yearLabel}</h1>
            <p className="text-xl text-accent-600 max-w-3xl mx-auto">
              Meet the talented alumni who graduated in {year}. Connect with your classmates and
              discover what they&apos;ve been up to since graduation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-2xl text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-900">{alumni.length}</h3>
              <p className="text-primary-700">Total Alumni</p>
            </div>
            <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-6 rounded-2xl text-center">
              <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-accent-900">{year}</h3>
              <p className="text-accent-700">Graduation Year</p>
            </div>
          </div>

          {alumni.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.map((entry) => {
                const initials = entry.data.name
                  .split(' ')
                  .map((segment) => segment[0])
                  .join('')
                  .toUpperCase();

                return (
                  <AppLink
                    href={`/alumni/profiles/${entry.data.slug}`}
                    className="card card-hover block"
                    key={entry.slug}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        {entry.data.photo ? (
                          <img
                            src={entry.data.photo}
                            alt={entry.data.name}
                            className="w-16 h-16 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-lg border">
                            {initials}
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold">{entry.data.name}</h3>
                          <p className="text-sm text-primary-600">Class of {entry.data.year}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{entry.data.short_bio}</p>
                    </div>
                  </AppLink>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-accent-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-accent-900 mb-2">No Alumni Found</h3>
              <p className="text-accent-600 mb-6">
                We don&apos;t have any alumni records for the Class of {year} yet.
              </p>
              <AppLink href="/alumni/profiles" className="btn btn-primary">
                Browse All Alumni
              </AppLink>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
