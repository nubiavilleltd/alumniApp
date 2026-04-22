import { Icon } from '@iconify/react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { useLatestAnnouncements } from '@/features/announcements/hooks/useAnnouncements';
import type { NewsItem } from '@/features/announcements/types/announcement.types';
import { ROUTES } from '@/shared/constants/routes';
import { HomeSectionHeader } from './HomeSectionHeader';

function formatAnnouncementDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function FeaturedAnnouncementCard({ item }: { item: NewsItem }) {
  return (
    <AppLink href={`${ROUTES.NEWS}/${item.slug}`} className="home-announcement-featured">
      <div className="home-announcement-featured__image-wrap">
        <img src={item.image} alt="" className="home-announcement-featured__image" />
      </div>

      <div className="home-announcement-featured__body">
        <p className="home-announcement-time">
          <Icon icon="mdi:clock-time-three-outline" aria-hidden="true" />
          {formatAnnouncementDate(item.date)}
        </p>
        <h3>{item.title}</h3>
        {item.excerpt && <p>{item.excerpt}</p>}
        <span className="home-card-link home-card-link--blue">Read more</span>
      </div>
    </AppLink>
  );
}

function AnnouncementListCard({ item }: { item: NewsItem }) {
  return (
    <AppLink href={`${ROUTES.NEWS}/${item.slug}`} className="home-announcement-card">
      <div className="home-announcement-card__image-wrap">
        <img src={item.image} alt="" className="home-announcement-card__image" />
      </div>

      <div className="home-announcement-card__body">
        <h3>{item.title}</h3>
        {item.excerpt && <p>{item.excerpt}</p>}
        <span className="home-announcement-time">
          <Icon icon="mdi:clock-time-three-outline" aria-hidden="true" />
          {formatAnnouncementDate(item.date)}
        </span>
      </div>
    </AppLink>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="home-announcement-featured home-announcement-skeleton">
      <div className="home-announcement-featured__image-wrap" />
      <div className="home-announcement-featured__body">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function AnnouncementSkeleton() {
  return (
    <div className="home-announcement-card home-announcement-skeleton">
      <div className="home-announcement-card__image-wrap" />
      <div className="home-announcement-card__body">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export default function HomeAnnouncements() {
  const { data: items = [], isLoading } = useLatestAnnouncements(4);

  const featured = items.find((n) => n.featured) ?? items[0];
  const sidebar = items.filter((n) => n.id !== featured?.id).slice(0, 3);

  return (
    <section className="home-feature-section home-feature-section--last">
      <div className="container-custom">
        <HomeSectionHeader
          eyebrow="Announcements"
          title="Important news and updates from the alumnae community"
          href={ROUTES.NEWS}
        />

        <div className="home-announcements-grid">
          {isLoading ? (
            <>
              <FeaturedSkeleton />
              <div className="home-announcements-list">
                {Array.from({ length: 3 }).map((_, i) => (
                  <AnnouncementSkeleton key={i} />
                ))}
              </div>
            </>
          ) : (
            <>
              {featured && <FeaturedAnnouncementCard item={featured} />}
              <div className="home-announcements-list">
                {sidebar.map((item) => (
                  <AnnouncementListCard key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
