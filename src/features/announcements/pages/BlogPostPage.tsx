import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { getBlogPostBySlug, renderMarkdown } from '@/data/content';
import { Layout } from '@/shared/components/layout/Layout';
import { AppLink } from '@/shared/components/ui/AppLink';

export function BlogPostPage() {
  const { slug = '' } = useParams();
  const post = getBlogPostBySlug(slug);

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
    { label: post.data.title },
  ];

  return (
    <Layout title={post.data.title} description={post.data.description} image={post.data.image}>
      <Breadcrumbs items={breadcrumbItems} />
      <section className="section">
        <div className="container-custom">
          <article className="prose max-w-none prose-headings:text-accent-900 prose-a:text-primary-600">
            <h1 className="mb-2">{post.data.title}</h1>
            <p className="text-gray-500 mb-6">{new Date(post.data.publishDate).toDateString()}</p>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </article>
        </div>
      </section>
    </Layout>
  );
}
