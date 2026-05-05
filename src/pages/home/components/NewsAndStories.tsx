import { Icon } from '@iconify/react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { useLatestAnnouncements } from '@/features/announcements/hooks/useAnnouncements';
import type { NewsItem } from '@/features/announcements/types/announcement.types';
import { ANNOUNCEMENT_ROUTES } from '@/features/announcements/routes';

const FALLBACK_IMAGE = '/news-1.png';

function formatAnnouncementDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function SectionHeading() {
  return (
    <header className="mb-10 flex items-start justify-between gap-6">
      <div className="min-w-0">
        <div className="relative inline-flex">
          <span
            aria-hidden="true"
            className="absolute -left-2 top-1/2 h-5 w-[2px] -translate-y-1/2 bg-[#0077cc]"
          />
          <span
            aria-hidden="true"
            className="absolute -top-2 right-[-10px] h-[2px] w-4 bg-[#0077cc]"
          />
          <span
            aria-hidden="true"
            className="absolute -top-2 right-[-10px] h-4 w-[2px] bg-[#0077cc]"
          />

          <p className="text-base font-semibold leading-none text-[#071116]">Announcements</p>
        </div>

        <h2 className="mt-7 max-w-5xl text-[2rem] font-extrabold leading-tight tracking-[0.01em] text-[#071116] sm:text-[2.35rem] lg:text-[2.05rem] xl:text-[2.15rem]">
          Important news and updates from the alumnae community
        </h2>
      </div>

      <AppLink
        href={ANNOUNCEMENT_ROUTES.ROOT}
        className="mt-1 hidden shrink-0 items-center gap-1 text-base font-bold text-[#0077cc] transition-colors duration-200 hover:text-[#005fa3] md:inline-flex"
      >
        See All
        <Icon icon="mdi:chevron-right" aria-hidden="true" className="h-5 w-5" />
      </AppLink>
    </header>
  );
}

function AnnouncementMeta({ date }: { date: string }) {
  return (
    <p className="inline-flex items-center gap-1.5 text-[0.95rem] font-medium leading-none text-[#556070]">
      <Icon icon="mdi:clock-time-three-outline" aria-hidden="true" className="h-5 w-5" />
      <span>{formatAnnouncementDate(date)}</span>
    </p>
  );
}

function FeaturedAnnouncementCard({ item }: { item: NewsItem }) {
  return (
    <AppLink
      href={ANNOUNCEMENT_ROUTES.DETAIL(item.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] bg-white text-[#071116] shadow-[0_16px_38px_rgba(7,17,22,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(7,17,22,0.12)]"
    >
      <div className="h-[280px] overflow-hidden bg-[#e9edf1] sm:h-[340px] lg:h-[384px]">
        <img
          src={item.image || FALLBACK_IMAGE}
          alt={item.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col px-4 pb-5 pt-4 sm:px-5">
        <AnnouncementMeta date={item.date} />

        <h3 className="mt-4 line-clamp-2 text-[1.55rem] font-extrabold leading-[1.15] tracking-[0.01em] text-[#071116] sm:text-[1.65rem]">
          {item.title}
        </h3>

        {item.excerpt ? (
          <p className="mt-3 line-clamp-3 text-[1.05rem] font-medium leading-[1.25] tracking-[0.01em] text-[#556070]">
            {item.excerpt}{' '}
            <span className="font-bold text-[#0077cc] transition-colors duration-200 group-hover:text-[#005fa3]">
              Read more
            </span>
          </p>
        ) : (
          <span className="mt-3 inline-flex text-[1rem] font-bold text-[#0077cc] transition-colors duration-200 group-hover:text-[#005fa3]">
            Read more
          </span>
        )}
      </div>
    </AppLink>
  );
}

function AnnouncementListCard({ item }: { item: NewsItem }) {
  return (
    <AppLink
      href={ANNOUNCEMENT_ROUTES.DETAIL(item.slug)}
      className="group grid overflow-hidden rounded-[1.4rem] bg-white p-4 text-[#071116] shadow-[0_16px_38px_rgba(7,17,22,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(7,17,22,0.12)] sm:grid-cols-[240px_1fr] sm:gap-4"
    >
      <div className="h-[150px] overflow-hidden rounded-xl bg-[#e9edf1] sm:h-[138px]">
        <img
          src={item.image || FALLBACK_IMAGE}
          alt={item.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-4 flex min-w-0 flex-col sm:mt-0">
        <h3 className="line-clamp-2 text-[1.18rem] font-extrabold leading-[1.18] tracking-[0.01em] text-[#071116]">
          {item.title}
        </h3>

        {item.excerpt ? (
          <p className="mt-2 line-clamp-3 text-[1.03rem] font-medium leading-[1.22] tracking-[0.01em] text-[#556070]">
            {item.excerpt}
          </p>
        ) : null}

        <div className="mt-auto pt-3">
          <AnnouncementMeta date={item.date} />
        </div>
      </div>
    </AppLink>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-[1.4rem] bg-white shadow-[0_16px_38px_rgba(7,17,22,0.08)]">
      <div className="h-[280px] bg-[#e5e7eb] sm:h-[340px] lg:h-[384px]" />
      <div className="flex flex-col gap-3 px-5 pb-5 pt-4">
        <span className="h-4 w-36 rounded-full bg-[#e5e7eb]" />
        <span className="h-7 w-5/6 rounded-full bg-[#e5e7eb]" />
        <span className="h-4 w-full rounded-full bg-[#e5e7eb]" />
        <span className="h-4 w-2/3 rounded-full bg-[#e5e7eb]" />
      </div>
    </div>
  );
}

function AnnouncementSkeleton() {
  return (
    <div className="grid animate-pulse overflow-hidden rounded-[1.4rem] bg-white p-4 shadow-[0_16px_38px_rgba(7,17,22,0.08)] sm:grid-cols-[240px_1fr] sm:gap-4">
      <div className="h-[150px] rounded-xl bg-[#e5e7eb] sm:h-[138px]" />

      <div className="mt-4 flex flex-col gap-3 sm:mt-0">
        <span className="h-5 w-5/6 rounded-full bg-[#e5e7eb]" />
        <span className="h-4 w-full rounded-full bg-[#e5e7eb]" />
        <span className="h-4 w-3/4 rounded-full bg-[#e5e7eb]" />
        <span className="mt-auto h-4 w-36 rounded-full bg-[#e5e7eb]" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[1.4rem] bg-white p-8 text-[#071116] shadow-[0_16px_38px_rgba(7,17,22,0.08)] lg:col-span-2">
      <p className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-[#556070]">
        <Icon icon="mdi:bullhorn-outline" aria-hidden="true" className="h-5 w-5" />
        Updates
      </p>

      <h3 className="mt-4 text-[1.6rem] font-extrabold leading-tight tracking-[0.01em] text-[#071116]">
        No announcements yet
      </h3>

      <p className="mt-3 max-w-2xl text-[1rem] font-medium leading-[1.5] text-[#556070]">
        New community updates will appear here as soon as they are published.
      </p>
    </div>
  );
}

export default function HomeAnnouncements() {
  const { data: items = [], isLoading } = useLatestAnnouncements(4);

  const featured = items.find((item) => item.featured) ?? items[0];
  const sidebar = featured ? items.filter((item) => item.id !== featured.id).slice(0, 3) : [];

  return (
    <section className="bg-[#f8f8f7] px-4 py-12 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-[82rem]">
        <SectionHeading />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.025fr)]">
          {isLoading ? (
            <>
              <FeaturedSkeleton />

              <div className="flex flex-col gap-8">
                {Array.from({ length: 3 }).map((_, index) => (
                  <AnnouncementSkeleton key={index} />
                ))}
              </div>
            </>
          ) : !featured ? (
            <EmptyState />
          ) : (
            <>
              <FeaturedAnnouncementCard item={featured} />

              <div className="flex flex-col gap-8">
                {sidebar.map((item) => (
                  <AnnouncementListCard key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </div>

        <AppLink
          href={ANNOUNCEMENT_ROUTES.ROOT}
          className="mt-8 inline-flex items-center gap-1 text-base font-bold text-[#0077cc] transition-colors duration-200 hover:text-[#005fa3] md:hidden"
        >
          See All
          <Icon icon="mdi:chevron-right" aria-hidden="true" className="h-5 w-5" />
        </AppLink>
      </div>
    </section>
  );
}
