import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

// import { renderMarkdown } from '@/data/content';
import { Layout } from '@/shared/components/layout/Layout';
import { AppLink } from '@/shared/components/ui/AppLink';
import { getBlogPostBySlug } from '@/data/site-data';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { renderMarkdown } from '@/shared/utils/markdown';

export function BlogPostPage() {
  const { slug = '' } = useParams();
  const post = getBlogPostBySlug(slug);
  console.log("post", post)

  if (!post) {
    return (
      <Layout title="Post Not Found">
        <section className="section">
          <div className="container-custom text-center">
            <h1 className="text-3xl font-bold mb-4">Blog post not found</h1>
            <AppLink href="/blog" className="btn btn-primary">
              Back to Blog
            </AppLink>
          </div>
        </section>
      </Layout>
    );
  }

  const html = useMemo(() => renderMarkdown(post.content), [post.content]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post.title },
  ];

  return (
    <Layout title={post.title} description={post.description} image={post.image}>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="section">
        <div className="container-custom">
          <article className="prose max-w-none prose-headings:text-accent-900 prose-a:text-primary-600">
            <h1 className="mb-2">{post.title}</h1>
            <p className="text-gray-500 mb-6">{new Date(post.publishDate).toDateString()}</p>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </article>
        </div>
      </section>
    </Layout>
  );
}
