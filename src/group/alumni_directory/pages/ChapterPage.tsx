import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { AppLink } from '@/components/AppLink';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Layout } from '@/components/Layout';
import { getAlumni, getSiteConfig } from '@/data/content';

export function ChapterPage() {
  const { chapter = '' } = useParams();
  const config = getSiteConfig();

  const alumni = getAlumni().filter((entry) =>
    entry.data.chapter.toLowerCase().includes(chapter.toLowerCase()),
  );

  const chapterName = config.chapters.find((item) => item.slug === chapter)?.name ?? chapter;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Profiles', href: '/alumni/profiles' },
    { label: 'Chapters', href: '/alumni/chapters' },
    { label: chapterName },
  ];

  return (
    <Layout title={chapterName}>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="section">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-6">{chapterName}</h1>

          {alumni.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.map((entry) => (
                <AppLink
                  href={`/alumni/profiles/${entry.data.slug}`}
                  className="card card-hover block"
                  key={entry.slug}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={entry.data.photo || '/logo.svg'}
                        alt={entry.data.name}
                        className="w-16 h-16 rounded-full object-cover border"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{entry.data.name}</h3>
                        <p className="text-sm text-primary-600">Class of {entry.data.year}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{entry.data.short_bio}</p>
                  </div>
                </AppLink>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-6">
                <Icon
                  icon="mdi:alert-circle-outline"
                  className="w-16 h-16 text-primary-500 mx-auto mb-4"
                />
              </div>
              <h3 className="text-xl font-semibold text-accent-900 mb-2">No Alumni Found</h3>
              <p className="text-accent-600 mb-6">
                We don&apos;t have any alumni records for the {chapterName} chapter yet.
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
