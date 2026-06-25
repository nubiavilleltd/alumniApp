import { ArrowLeft, Clock3, FileSearch } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { SEO } from '@/shared/common/SEO';
import { AppLink } from '@/shared/components/ui/AppLink';
import { useBlogPostDetail } from '../hooks/useBlogs';
import { ANNOUNCEMENT_ROUTES } from '@/features/announcements/routes';

const FALLBACK_IMAGE = '/news-1.png';

function formatBlogDate(value?: string | null) {
  if (!value) return 'Not published';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatReadTime(minutes?: number | null) {
  const resolvedMinutes = minutes && minutes > 0 ? minutes : 1;
  return `${resolvedMinutes} min${resolvedMinutes === 1 ? '' : 's'} read`;
}

export function BlogDetailPage() {
  const { slug = '' } = useParams();
  const { data: post, isLoading } = useBlogPostDetail(slug);

  return (
    <>
      <SEO
        title={post?.title || 'Blog'}
        description={post?.excerpt || 'Read the latest blog post from the alumnae community.'}
        image={post?.coverImageUrl || undefined}
      />

      <main className="min-h-screen bg-[#F8F8F7] text-[#071116]">
        <section className="container-custom pb-16 pt-4 sm:pb-14 sm:pt-5">
          <AppLink
            href={ANNOUNCEMENT_ROUTES.BLOG}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
            Back to blog
          </AppLink>

          {isLoading ? (
            <div className="mt-6 animate-pulse">
              <div className="aspect-[16/8] rounded-t-[2rem] bg-accent-100" />
              <div className="space-y-4 py-6 md:py-8">
                <div className="h-4 w-40 rounded bg-accent-100" />
                <div className="h-10 w-3/4 rounded bg-accent-100" />
                <div className="h-4 w-full rounded bg-accent-100" />
                <div className="h-4 w-5/6 rounded bg-accent-100" />
              </div>
            </div>
          ) : !post ? (
            <div className="mt-6 rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-accent-100">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-50">
                <FileSearch className="h-7 w-7 text-accent-700" strokeWidth={2.2} />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-accent-900">Blog post not found</h1>
              <p className="mt-2 text-sm text-accent-500">
                It may have been removed or the link may no longer be valid.
              </p>
            </div>
          ) : (
            <article className="mt-6">
              <div className="overflow-hidden rounded-t-[2rem] bg-accent-100">
                <img
                  src={post.coverImageUrl || FALLBACK_IMAGE}
                  alt=""
                  className="block max-h-[36rem] w-full object-cover"
                />
              </div>

              <div className="py-6 md:py-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">
                    {post.categoryName || 'Blog'}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm text-accent-500">
                    <Clock3 className="h-4 w-4" strokeWidth={2.2} />
                    {formatBlogDate(post.publishedAt || post.createdAt)}
                  </span>
                  <span className="text-sm font-semibold text-accent-500">
                    {formatReadTime(post.readTimeMinutes)}
                  </span>
                </div>

                <h1 className="type-section-title mt-4 text-accent-950">{post.title}</h1>

                {post.excerpt ? (
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-accent-600">{post.excerpt}</p>
                ) : null}

                <div className="mt-8 space-y-8 text-base leading-8 text-accent-700">
                  {post.sections.length > 0 ? (
                    post.sections.map((section) => (
                      <section key={section.id ?? section.heading}>
                        <h2 className="text-2xl font-bold leading-tight text-accent-950">
                          {section.heading}
                        </h2>
                        <p className="mt-3 whitespace-pre-line">{section.body}</p>
                      </section>
                    ))
                  ) : (
                    <p>This blog post does not have a full body yet.</p>
                  )}
                </div>

                {post.galleryImages.length > 1 ? (
                  <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {post.galleryImages.slice(1).map((image) => (
                      <img
                        key={image.id}
                        src={image.imageUrl}
                        alt={image.altText || ''}
                        className="aspect-[16/10] w-full rounded-2xl object-cover"
                        loading="lazy"
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          )}
        </section>
      </main>
    </>
  );
}
