import { AppLink } from '@/components/AppLink';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Layout } from '@/components/Layout';
import { getSiteConfig } from '@/data/content';

export function YearsPage() {
  const config = getSiteConfig();

  const years = Array.from(
    { length: config.years.end - config.years.start + 1 },
    (_, index) => config.years.end - index,
  );

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Profiles', href: '/alumni/profiles' },
    { label: 'Years' },
  ];

  return (
    <Layout title="Years">
      <Breadcrumbs items={breadcrumbItems} />
      <section className="section">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-6">Browse by Year</h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {years.map((year) => (
              <AppLink className="card p-4 text-center" href={`/alumni/years/${year}`} key={year}>
                {year}
              </AppLink>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
