import { Icon } from '@iconify/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SEO } from '@/shared/common/SEO';
import { ButtonLink } from '@/shared/components/ui/Button';
import { AppLink } from '@/shared/components/ui/AppLink';
import { ROUTES } from '@/shared/constants/routes';
import { EVENT_ROUTES } from '@/features/events/routes';
import { AnnouncementEditorModal } from '@/features/announcements/components/AnnouncementEditorModal';
import { useAnnouncements } from '@/features/announcements/hooks/useAnnouncements';
import { ANNOUNCEMENT_ROUTES } from '@/features/announcements/routes';
import type { AnnouncementType, NewsItem } from '@/features/announcements/types/announcement.types';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';

const FALLBACK_IMAGE = '/news-1.png';
const pageShellClassName =
  'mx-auto w-full max-w-[80rem] px-4 pb-16 pt-4 max-[1180px]:max-w-[64rem] sm:pb-14 sm:pt-5';
const cardClassName =
  'flex min-w-0 overflow-hidden rounded-2xl border border-[#eef2f5] bg-white p-3.5 shadow-[0_1px_2px_rgba(7,17,22,0.04)] no-underline transition-colors duration-200 hover:border-primary-100 max-sm:flex-col max-sm:p-0';
const cardImageWrapClassName =
  'w-[min(38%,14rem)] basis-[min(38%,14rem)] flex-shrink-0 overflow-hidden rounded-xl bg-[#e9edf1] max-sm:w-full max-sm:basis-auto max-sm:aspect-[16/9] max-sm:rounded-none';
const cardBodyClassName =
  'flex min-w-0 flex-1 flex-col justify-center px-4 py-[0.2rem] pr-[0.1rem] max-sm:p-[1.15rem]';
const metaClassName =
  'm-0 flex items-center gap-[0.55rem] text-sm font-semibold leading-[1.2] text-[#59626c]';
const actionClassName =
  'min-h-10 rounded-full border border-primary-500 bg-transparent px-5 py-2.5 text-sm font-semibold text-primary-500 transition-colors hover:bg-primary-500 hover:text-white whitespace-nowrap';
const boardClassName =
  'hidden gap-5 min-[1181px]:grid min-[1181px]:grid-cols-2 min-[1181px]:items-start';
const sideListClassName = 'grid gap-3.5 min-[1181px]:grid-rows-3 [&>*]:h-full';
const continuationGridClassName = 'mt-5 hidden gap-5 min-[1181px]:grid min-[1181px]:grid-cols-2';
const stackedListClassName = 'grid gap-5 min-[1181px]:hidden';

const typeFilters: Array<{ label: string; value: 'all' | AnnouncementType }> = [
  { label: 'All updates', value: 'all' },
  { label: 'Info', value: 'info' },
  { label: 'Events', value: 'event' },
];

const DESKTOP_SIDE_CARD_GAP_PX = 14;

function formatAnnouncementDate(date: string) {
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const parsed = new Date(isDateOnly ? `${date}T00:00:00` : date);
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

function AnnouncementCard({ item, compact = false }: { item: NewsItem; compact?: boolean }) {
  const rootClassName = compact
    ? 'flex h-full min-h-0 min-w-0 overflow-hidden rounded-2xl border border-[#eef2f5] bg-white p-2.5 shadow-[0_1px_2px_rgba(7,17,22,0.04)] no-underline transition-colors duration-200 hover:border-primary-100'
    : cardClassName;
  const imageWrapClassName = compact
    ? 'w-[min(34%,9rem)] basis-[min(34%,9rem)] flex-shrink-0 overflow-hidden rounded-[0.9rem] bg-[#e9edf1]'
    : cardImageWrapClassName;
  const bodyClassName = compact
    ? 'flex min-h-0 min-w-0 flex-1 flex-col justify-center px-2.5 py-0 pr-0'
    : cardBodyClassName;
  const titleClassName = compact
    ? 'm-0 line-clamp-2 text-[0.92rem] font-bold leading-[1.12] text-[#071116]'
    : 'm-0 text-[clamp(0.95rem,1.15vw,1.1rem)] font-bold leading-[1.18] text-[#071116]';
  const summaryClassName = compact
    ? 'mt-1 overflow-hidden text-[0.76rem] font-medium leading-[1.2] text-[#59626c] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]'
    : 'mt-[0.45rem] overflow-hidden text-sm font-medium leading-[1.35] text-[#59626c] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]';
  const metaRowClassName = compact ? `${metaClassName} mt-1.5 text-[0.76rem]` : metaClassName;

  return (
    <AppLink href={ANNOUNCEMENT_ROUTES.DETAIL(item.slug)} className={rootClassName}>
      <div className={imageWrapClassName}>
        <img src={item.image || FALLBACK_IMAGE} alt="" className="h-full w-full object-cover" />
      </div>

      <div className={bodyClassName}>
        <h3 className={titleClassName}>{item.title}</h3>
        <p className={summaryClassName}>{getAnnouncementSummary(item)}</p>
        <p className={metaRowClassName}>
          <Icon icon="mdi:clock-time-three-outline" className="h-4 w-4 flex-shrink-0" />
          {formatAnnouncementDate(item.startsAt || item.date)}
        </p>
      </div>
    </AppLink>
  );
}

function AnnouncementCardSkeleton({ compact = false }: { compact?: boolean }) {
  const rootClassName = compact
    ? 'flex h-full min-w-0 overflow-hidden rounded-2xl border border-[#eef2f5] bg-white p-3 shadow-[0_1px_2px_rgba(7,17,22,0.04)]'
    : cardClassName;
  const imageWrapClassName = compact
    ? 'w-[min(35%,10.5rem)] basis-[min(35%,10.5rem)] flex-shrink-0 overflow-hidden rounded-[1rem] bg-accent-100'
    : `${cardImageWrapClassName} bg-accent-100`;
  const bodyClassName = compact
    ? 'flex min-w-0 flex-1 flex-col justify-center px-3 py-0 pr-0'
    : cardBodyClassName;

  return (
    <div className={`${rootClassName} animate-pulse`}>
      <div className={imageWrapClassName} />
      <div className={bodyClassName}>
        <div className={`rounded bg-accent-100 ${compact ? 'h-4 w-4/5' : 'h-4 w-2/3'}`} />
        <div
          className={`rounded bg-accent-100 ${compact ? 'mt-2 h-3 w-full' : 'mt-3 h-3 w-full'}`}
        />
        <div className={`rounded bg-accent-100 ${compact ? 'mt-2 h-3 w-1/2' : 'mt-2 h-3 w-5/6'}`} />
        {!compact && <div className="mt-4 h-3 w-1/3 rounded bg-accent-100" />}
      </div>
    </div>
  );
}

export default function BlogIndexPage() {
  const user = useIdentityStore((state) => state.user);
  const [selectedType, setSelectedType] = useState<'all' | AnnouncementType>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const featuredCardRef = useRef<HTMLElement | null>(null);
  const [featuredCardHeight, setFeaturedCardHeight] = useState<number | null>(null);

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
  const compactCardHeight =
    featuredCardHeight !== null
      ? Math.max((featuredCardHeight - DESKTOP_SIDE_CARD_GAP_PX * 2) / 3, 0)
      : null;

  useEffect(() => {
    const element = featuredCardRef.current;

    if (!element || typeof window === 'undefined') {
      setFeaturedCardHeight(null);
      return;
    }

    const updateHeight = () => {
      if (window.innerWidth < 1181) {
        setFeaturedCardHeight(null);
        return;
      }

      setFeaturedCardHeight(element.getBoundingClientRect().height);
    };

    updateHeight();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    window.addEventListener('resize', updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [featured?.slug, featured?.title, featured?.image, featured?.content, featured?.excerpt]);

  return (
    <>
      <SEO
        title="Announcements"
        description="Read the latest FGGC Owerri Alumnae Association updates, event notices, welfare reminders, and project news."
      />

      <main className="min-h-full bg-[#f8f8f7] text-[#071116]">
        <section className={pageShellClassName} aria-labelledby="announcements-title">
          <header className="mb-6 flex flex-col items-start justify-between gap-4 min-[761px]:flex-row min-[761px]:items-center">
            <div>
              <h1
                id="announcements-title"
                className="m-0 text-2xl font-bold leading-tight text-[#071116] md:text-3xl"
              >
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

            <div className="flex w-full flex-wrap justify-start gap-3 min-[761px]:w-auto min-[761px]:justify-end">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(true)}
                  className={`${actionClassName} max-[760px]:basis-[11rem] max-[760px]:flex-1`}
                >
                  Create announcement
                </button>
              )}
              <ButtonLink
                href={ROUTES.PROJECTS.ROOT}
                variant="outline"
                className={`${actionClassName} max-[760px]:basis-[11rem] max-[760px]:flex-1`}
              >
                Go to our Projects
              </ButtonLink>
              <ButtonLink
                href={EVENT_ROUTES.ROOT}
                variant="outline"
                className={`${actionClassName} max-[760px]:basis-[11rem] max-[760px]:flex-1`}
              >
                Go to Events
              </ButtonLink>
            </div>
          </header>

          {isLoading ? (
            <>
              <div className={boardClassName}>
                <div className="flex flex-col overflow-hidden rounded-2xl border border-[#eef2f5] bg-white shadow-[0_1px_2px_rgba(7,17,22,0.04)]">
                  <div className="aspect-[16/9] bg-accent-100" />
                  <div className="space-y-4 p-[1.15rem_1.25rem_1.35rem]">
                    <div className="h-4 w-40 rounded bg-accent-100" />
                    <div className="h-8 w-4/5 rounded bg-accent-100" />
                    <div className="h-4 w-full rounded bg-accent-100" />
                    <div className="h-4 w-5/6 rounded bg-accent-100" />
                    <div className="h-4 w-1/3 rounded bg-accent-100" />
                  </div>
                </div>
                <div className={sideListClassName}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <AnnouncementCardSkeleton key={index} compact />
                  ))}
                </div>
              </div>

              <div className={stackedListClassName}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <AnnouncementCardSkeleton key={index} />
                ))}
              </div>
            </>
          ) : featured ? (
            <>
              <div className={boardClassName}>
                <article
                  ref={featuredCardRef}
                  className="flex flex-col overflow-hidden rounded-2xl border border-[#eef2f5] bg-white shadow-[0_1px_2px_rgba(7,17,22,0.04)]"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-[#e9edf1]">
                    <img
                      src={featured.image || FALLBACK_IMAGE}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col p-[1.15rem_1.25rem_1.35rem]">
                    <p className={metaClassName}>
                      <Icon icon="mdi:clock-time-three-outline" className="h-4 w-4 flex-shrink-0" />
                      {formatAnnouncementDate(featured.startsAt || featured.date)}
                    </p>
                    <h2 className="mt-4 text-[clamp(1.35rem,2vw,1.75rem)] font-bold leading-[1.24] text-[#071116]">
                      {featured.title}
                    </h2>
                    <p className="mt-[0.65rem] text-base font-medium leading-[1.32] text-[#59626c]">
                      {getAnnouncementSummary(featured)}{' '}
                      <span className="whitespace-nowrap font-extrabold text-primary-500">
                        read more
                      </span>
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

                <div
                  className={sideListClassName}
                  style={featuredCardHeight ? { height: `${featuredCardHeight}px` } : undefined}
                >
                  {latest.slice(0, 3).map((item) => (
                    <AnnouncementCard key={item.slug} item={item} compact />
                  ))}
                </div>
              </div>

              <div className={stackedListClassName}>
                {sortedAnnouncements.map((item) => (
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

          {(isLoading || latest.length > 3) && (
            <div
              className={continuationGridClassName}
              style={compactCardHeight ? { gridAutoRows: `${compactCardHeight}px` } : undefined}
            >
              {isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <AnnouncementCardSkeleton key={index} compact />
                  ))
                : latest
                    .slice(3)
                    .map((item) => <AnnouncementCard key={item.slug} item={item} compact />)}
            </div>
          )}
        </section>
      </main>

      <AnnouncementEditorModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />
    </>
  );
}
