import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { SEO } from '@/shared/common/SEO';
import { AppLink } from '@/shared/components/ui/AppLink';
import { ButtonLink } from '@/shared/components/ui/Button';
import { useAnnouncement } from '@/features/announcements/hooks/useAnnouncements';
import { ANNOUNCEMENT_ROUTES } from '@/features/announcements/routes';
import { ADMIN_ROUTES } from '@/features/admin/routes';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';

const FALLBACK_IMAGE = '/news-1.png';

function formatAnnouncementDate(date?: string) {
  if (!date) return '';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function splitAnnouncementContent(content?: string, excerpt?: string) {
  const source = content?.trim() || excerpt?.trim() || '';
  if (!source) return [];

  return source
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default function BlogPostPage() {
  const { slug = '' } = useParams();
  const user = useIdentityStore((state) => state.user);
  const { data: announcement, isLoading } = useAnnouncement(slug);

  const bodyParagraphs = splitAnnouncementContent(announcement?.content, announcement?.excerpt);
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <SEO
        title={announcement?.title || 'Announcement'}
        description={
          announcement?.excerpt || 'Read the latest announcement from the alumnae community.'
        }
        image={announcement?.image}
      />

      <main className="announcements-page">
        <section className="announcements-shell">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <AppLink
              href={ANNOUNCEMENT_ROUTES.ROOT}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              <Icon icon="mdi:arrow-left" className="h-4 w-4" />
              Back to announcements
            </AppLink>

            {isAdmin && (
              <ButtonLink href={ADMIN_ROUTES.ANNOUNCEMENTS} variant="outline" size="sm">
                Manage announcements
              </ButtonLink>
            )}
          </div>

          {isLoading ? (
            <div className="mt-6 overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-accent-100 animate-pulse">
              <div className="aspect-[16/8] bg-accent-100" />
              <div className="space-y-4 p-6 md:p-8">
                <div className="h-4 w-40 rounded bg-accent-100" />
                <div className="h-10 w-3/4 rounded bg-accent-100" />
                <div className="h-4 w-full rounded bg-accent-100" />
                <div className="h-4 w-5/6 rounded bg-accent-100" />
                <div className="h-4 w-4/6 rounded bg-accent-100" />
              </div>
            </div>
          ) : !announcement ? (
            <div className="mt-6 rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-accent-100">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-50">
                <Icon icon="mdi:file-document-alert-outline" className="h-7 w-7 text-accent-700" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-accent-900">Announcement not found</h1>
              <p className="mt-2 text-sm text-accent-500">
                It may have been removed or the link may no longer be valid.
              </p>
            </div>
          ) : (
            <article className="mt-6 overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-accent-100">
              <div className="aspect-[16/8] overflow-hidden bg-accent-100">
                <img
                  src={announcement.image || FALLBACK_IMAGE}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">
                    {announcement.type}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm text-accent-500">
                    <Icon icon="mdi:clock-time-three-outline" className="h-4 w-4" />
                    {formatAnnouncementDate(announcement.startsAt || announcement.date)}
                  </span>
                </div>

                <h1 className="mt-4 text-3xl font-bold leading-tight text-accent-950 md:text-4xl">
                  {announcement.title}
                </h1>

                {announcement.excerpt && (
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-accent-600">
                    {announcement.excerpt}
                  </p>
                )}

                {(announcement.chapterId || announcement.year || announcement.endsAt) && (
                  <div className="mt-6 grid gap-3 rounded-2xl bg-accent-50 p-4 text-sm text-accent-700 md:grid-cols-3">
                    {announcement.chapterId && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-400">
                          Chapter
                        </p>
                        <p className="mt-1 font-medium">#{announcement.chapterId}</p>
                      </div>
                    )}
                    {announcement.year && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-400">
                          Year
                        </p>
                        <p className="mt-1 font-medium">{announcement.year}</p>
                      </div>
                    )}
                    {announcement.endsAt && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-400">
                          Ends
                        </p>
                        <p className="mt-1 font-medium">
                          {formatAnnouncementDate(announcement.endsAt)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-8 space-y-5 text-base leading-8 text-accent-700">
                  {bodyParagraphs.length > 0 ? (
                    bodyParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
                  ) : (
                    <p>This announcement does not have a full body yet.</p>
                  )}
                </div>
              </div>
            </article>
          )}
        </section>
      </main>
    </>
  );
}
