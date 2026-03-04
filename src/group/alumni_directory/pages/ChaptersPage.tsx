import { AppLink } from '@/components/AppLink';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Layout } from '@/components/Layout';
import { getSiteConfig } from '@/data/content';

export function ChaptersPage() {
  const config = getSiteConfig();

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Profiles', href: '/alumni/profiles' },
    { label: 'Chapters' },
  ];

  return (
    <Layout title="Chapters">
      <Breadcrumbs items={breadcrumbItems} />
      <section className="section">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-6">Browse by Chapter</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {config.chapters.map((chapter) => (
              <AppLink
                className="card p-6"
                href={`/alumni/chapters/${chapter.slug}`}
                key={chapter.slug}
              >
                <h3 className="text-lg font-semibold">{chapter.name}</h3>
                <p className="text-gray-600 text-sm">{chapter.description}</p>
              </AppLink>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
