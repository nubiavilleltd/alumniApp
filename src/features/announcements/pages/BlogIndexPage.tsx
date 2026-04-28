import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import { SEO } from '@/shared/common/SEO';
import { ButtonLink } from '@/shared/components/ui/Button';
import { AppLink } from '@/shared/components/ui/AppLink';
import { ROUTES } from '@/shared/constants/routes';
import { EVENT_ROUTES } from '@/features/events/routes';
import { ADMIN_ROUTES } from '@/features/admin/routes';
import { useAnnouncements } from '@/features/announcements/hooks/useAnnouncements';
import { ANNOUNCEMENT_ROUTES } from '@/features/announcements/routes';
import type { AnnouncementType, NewsItem } from '@/features/announcements/types/announcement.types';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';

const FALLBACK_IMAGE = '/news-1.png';

const typeFilters: Array<{ label: string; value: 'all' | AnnouncementType }> = [
  { label: 'All updates', value: 'all' },
  { label: 'Info', value: 'info' },
  { label: 'Events', value: 'event' },
  { label: 'Success', value: 'success' },
  { label: 'Warnings', value: 'warning' },
];

function formatAnnouncementDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getAnnouncementSummary(item: NewsItem) {
  return item.excerpt?.trim() || item.content?.trim() || 'Read the latest community update.';
}

function AnnouncementCard({ item }: { item: NewsItem }) {
  return (
    <AppLink href={ANNOUNCEMENT_ROUTES.DETAIL(item.slug)} className="announcements-card">
      <div className="announcements-card__image-wrap">
        <img src={item.image || FALLBACK_IMAGE} alt="" className="announcements-card__image" />
      </div>

      <div className="announcements-card__body">
        <h3 className="announcements-card__title">{item.title}</h3>
        <p className="announcements-card__summary">{getAnnouncementSummary(item)}</p>
        <p className="announcements-time">
          <Icon icon="mdi:clock-time-three-outline" />
          {formatAnnouncementDate(item.startsAt || item.date)}
        </p>
      </div>
    </AppLink>
  );
}

function AnnouncementCardSkeleton() {
  return (
    <div className="announcements-card animate-pulse">
      <div className="announcements-card__image-wrap bg-accent-100" />
      <div className="announcements-card__body">
        <div className="h-4 w-2/3 rounded bg-accent-100" />
        <div className="mt-3 h-3 w-full rounded bg-accent-100" />
        <div className="mt-2 h-3 w-5/6 rounded bg-accent-100" />
        <div className="mt-4 h-3 w-1/3 rounded bg-accent-100" />
      </div>
    </div>
  );
}

export default function BlogIndexPage() {
  const user = useIdentityStore((state) => state.user);
  const [selectedType, setSelectedType] = useState<'all' | AnnouncementType>('all');

  const { data: announcements = [], isLoading } = useAnnouncements(
    selectedType === 'all' ? undefined : { type: selectedType },
  );

  const sortedAnnouncements = useMemo(
    () =>
      [...announcements].sort(
        (a, b) =>
          new Date(b.startsAt || b.date).getTime() - new Date(a.startsAt || a.date).getTime(),
      ),
    [announcements],
  );

  const [featured, ...latest] = sortedAnnouncements;
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <SEO
        title="Announcements"
        description="Read the latest FGGC Owerri Alumnae Association updates, event notices, welfare reminders, and project news."
      />

      <main className="announcements-page">
        <section className="announcements-shell" aria-labelledby="announcements-title">
          <header className="announcements-header">
            <div>
              <h1 id="announcements-title" className="announcements-title">
                Announcements
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                {typeFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setSelectedType(filter.value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      selectedType === filter.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-accent-700 shadow-sm ring-1 ring-accent-100 hover:bg-primary-50'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="announcements-actions">
              {isAdmin && (
                <ButtonLink
                  href={ADMIN_ROUTES.ANNOUNCEMENTS}
                  variant="primary"
                  className="announcements-action"
                >
                  Manage announcements
                </ButtonLink>
              )}
              <ButtonLink
                href={ROUTES.PROJECTS.ROOT}
                variant="outline"
                className="announcements-action"
              >
                Go to our Projects
              </ButtonLink>
              <ButtonLink
                href={EVENT_ROUTES.ROOT}
                variant="outline"
                className="announcements-action"
              >
                Go to Events
              </ButtonLink>
            </div>
          </header>

          <div className="announcements-board">
            {isLoading ? (
              <>
                <AnnouncementCardSkeleton />
                <div className="announcements-side-list">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <AnnouncementCardSkeleton key={index} />
                  ))}
                </div>
                <div className="announcements-continuation">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <AnnouncementCardSkeleton key={index} />
                  ))}
                </div>
              </>
            ) : featured ? (
              <>
                <article className="announcements-featured">
                  <div className="announcements-featured__image-wrap">
                    <img
                      src={featured.image || FALLBACK_IMAGE}
                      alt=""
                      className="announcements-featured__image"
                    />
                  </div>

                  <div className="announcements-featured__body">
                    <p className="announcements-time">
                      <Icon icon="mdi:clock-time-three-outline" />
                      {formatAnnouncementDate(featured.startsAt || featured.date)}
                    </p>
                    <h2 className="announcements-featured__title">{featured.title}</h2>
                    <p className="announcements-featured__summary">
                      {getAnnouncementSummary(featured)} <span>read more</span>
                    </p>
                    <div className="mt-5">
                      <ButtonLink
                        href={ANNOUNCEMENT_ROUTES.DETAIL(featured.slug)}
                        variant="primary"
                      >
                        Open announcement
                      </ButtonLink>
                    </div>
                  </div>
                </article>

                <div className="announcements-side-list">
                  {latest.slice(0, 3).map((item) => (
                    <AnnouncementCard key={item.slug} item={item} />
                  ))}
                </div>

                <div className="announcements-continuation">
                  {latest.slice(3).map((item) => (
                    <AnnouncementCard key={item.slug} item={item} />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-accent-100">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
                  <Icon icon="mdi:bullhorn-outline" className="h-7 w-7 text-primary-500" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-accent-900">No announcements yet</h2>
                <p className="mt-2 text-sm text-accent-500">
                  Fresh updates will appear here as soon as the admin team publishes them.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
