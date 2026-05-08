import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SEO } from '@/shared/common/SEO';
import { AppLink } from '@/shared/components/ui/AppLink';
import { AnnouncementEditorModal } from '@/features/announcements/components/AnnouncementEditorModal';
import {
  useAnnouncement,
  useDeleteAnnouncement,
} from '@/features/announcements/hooks/useAnnouncements';
import { ANNOUNCEMENT_ROUTES } from '@/features/announcements/routes';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';

const FALLBACK_IMAGE = '/news-1.png';

function formatAnnouncementDate(date?: string) {
  if (!date) return '';

  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const parsed = new Date(isDateOnly ? `${date}T00:00:00` : date);
  if (Number.isNaN(parsed.getTime())) return date;

  if (isDateOnly) {
    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

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
  const navigate = useNavigate();
  const user = useIdentityStore((state) => state.user);
  const { data: announcement, isLoading } = useAnnouncement(slug);
  const deleteAnnouncement = useDeleteAnnouncement();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const bodyParagraphs = splitAnnouncementContent(announcement?.content, announcement?.excerpt);
  const isAdmin = user?.role === 'admin';

  async function handleDeleteAnnouncement() {
    if (!announcement || deleteAnnouncement.isPending) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete "${announcement.title}"? This action cannot be undone.`,
    );

    if (!shouldDelete) {
      return;
    }

    await deleteAnnouncement.mutateAsync(String(announcement.id));
    navigate(ANNOUNCEMENT_ROUTES.ROOT, { replace: true });
  }

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
        <section className="announcements-shell container-custom">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <AppLink
              href={ANNOUNCEMENT_ROUTES.ROOT}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              <Icon icon="mdi:arrow-left" className="h-4 w-4" />
              Back to announcements
            </AppLink>

            {isAdmin && announcement && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(true)}
                  disabled={deleteAnnouncement.isPending}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-primary-500 bg-white px-3 py-2 text-xs font-semibold text-primary-500 shadow-sm transition-colors hover:bg-primary-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm whitespace-nowrap"
                >
                  Edit Announcement
                </button>

                <button
                  type="button"
                  onClick={() => void handleDeleteAnnouncement()}
                  disabled={deleteAnnouncement.isPending}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-red-500 bg-white px-3 py-2 text-xs font-semibold text-red-500 shadow-sm transition-colors hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm whitespace-nowrap"
                >
                  <Icon
                    icon={deleteAnnouncement.isPending ? 'mdi:loading' : 'mdi:delete-outline'}
                    className={`h-4 w-4 ${deleteAnnouncement.isPending ? 'animate-spin' : ''}`}
                  />
                  <span>
                    {deleteAnnouncement.isPending ? 'Deleting...' : 'Delete Announcement'}
                  </span>
                </button>
              </div>
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

                {(announcement.year || announcement.endsAt) && (
                  <div className="mt-6 grid gap-3 rounded-2xl bg-accent-50 p-4 text-sm text-accent-700 md:grid-cols-2">
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

      <AnnouncementEditorModal
        announcement={announcement}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSubmitted={(updatedAnnouncement) => {
          navigate(ANNOUNCEMENT_ROUTES.DETAIL(updatedAnnouncement.slug), { replace: true });
        }}
      />
    </>
  );
}
