
import { getBlogPosts } from '@/data/content';
import { Layout } from '@/shared/components/layout/Layout';
import { AppLink } from '@/shared/components/ui/AppLink';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';

export function BlogIndexPage() {
  const posts = getBlogPosts().sort(
    (a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime(),
  );

  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Blog' }];

  return (
    <Layout title="Blog">
      <Breadcrumbs items={breadcrumbItems} />
      <section className="section">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-6">Blog</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <AppLink
                href={`/blog/${post.slug}`}
                className="card card-hover block"
                key={post.slug}
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{post.data.title}</h3>
                  <p className="text-gray-600 mb-4">{post.data.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.data.publishDate).toDateString()}
                  </p>
                </div>
              </AppLink>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
