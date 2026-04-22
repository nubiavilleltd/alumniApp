import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';

const announcementFilters = ['All', 'Association', 'Events', 'Welfare', 'Projects'];

const announcements = [
  {
    title: 'Association Awards New Scholarships to Outstanding Students',
    category: 'Association',
    date: 'Apr 18, 2026',
    image: '/news-1.png',
    summary:
      'The alumnae association has opened the next scholarship cycle for students with strong academic records and demonstrated leadership.',
    readTime: '3 min read',
  },
  {
    title: 'North America Chapter Opens Registration for Summer Mixer',
    category: 'Events',
    date: 'Apr 12, 2026',
    image: '/news-2.png',
    summary:
      'Alumnae in Canada and the United States can now register for the summer mixer and regional networking dinner.',
    readTime: '2 min read',
  },
  {
    title: 'Mentorship Circle Applications Close This Friday',
    category: 'Welfare',
    date: 'Apr 08, 2026',
    image: '/news-3.png',
    summary:
      'Final reminders have been sent to members interested in joining the professional mentorship circle for the new quarter.',
    readTime: '2 min read',
  },
  {
    title: 'Library Renovation Committee Publishes Progress Update',
    category: 'Projects',
    date: 'Apr 02, 2026',
    image: '/news-4.png',
    summary:
      'The committee shared new milestones, procurement updates, and the next volunteer workstream for the school library project.',
    readTime: '4 min read',
  },
  {
    title: 'Digital Yearbook Archive Review Begins Next Month',
    category: 'Association',
    date: 'Mar 28, 2026',
    image: '/news-5.png',
    summary:
      'Set representatives are invited to review archive submissions before the next public update to the digital yearbook.',
    readTime: '3 min read',
  },
];

const noticeBoardItems = [
  {
    label: 'Next general meeting',
    value: 'May 04, 2026',
    icon: 'mdi:calendar-month-outline',
  },
  {
    label: 'Volunteer sign-ups',
    value: 'Open now',
    icon: 'mdi:account-heart-outline',
  },
  {
    label: 'Chapter reports',
    value: 'Due this month',
    icon: 'mdi:file-document-check-outline',
  },
];

function AnnouncementCard({ item }: { item: (typeof announcements)[number] }) {
  return (
    <article className="announcements-card">
      <div className="announcements-card__image-wrap">
        <img src={item.image} alt="" className="announcements-card__image" />
      </div>

      <div className="announcements-card__body">
        <div className="announcements-card__meta">
          <span>{item.category}</span>
          <span>{item.date}</span>
        </div>
        <h3 className="announcements-card__title">{item.title}</h3>
        <p className="announcements-card__summary">{item.summary}</p>
        <p className="announcements-card__read-time">{item.readTime}</p>
      </div>
    </article>
  );
}

export default function BlogIndexPage() {
  const [featured, ...latest] = announcements;

  return (
    <>
      <SEO
        title="Announcements"
        description="Read the latest FGGC Owerri Alumnae Association updates, event notices, welfare reminders, and project news."
      />

      <main className="announcements-page">
        <section className="announcements-hero" aria-labelledby="announcements-title">
          <div className="announcements-hero__copy">
            <p className="announcements-eyebrow">
              <Icon icon="mdi:bullhorn-outline" />
              Announcements
            </p>
            <h1 id="announcements-title" className="announcements-hero__title">
              Stay close to every alumnae update.
            </h1>
            <p className="announcements-hero__text">
              Official notices, chapter updates, event reminders, and community milestones from the
              FGGC Owerri Alumnae Association.
            </p>

            <div className="announcements-filter-row" aria-label="Announcement categories">
              {announcementFilters.map((filter) => (
                <span key={filter} className="announcements-filter-chip">
                  {filter}
                </span>
              ))}
            </div>
          </div>

          <article className="announcements-featured">
            <div className="announcements-featured__image-wrap">
              <img src={featured.image} alt="" className="announcements-featured__image" />
            </div>

            <div className="announcements-featured__body">
              <div className="announcements-featured__meta">
                <span>{featured.category}</span>
                <span>{featured.date}</span>
              </div>
              <h2 className="announcements-featured__title">{featured.title}</h2>
              <p className="announcements-featured__summary">{featured.summary}</p>
              <div className="announcements-featured__footer">
                <span>Featured update</span>
                <span>{featured.readTime}</span>
              </div>
            </div>
          </article>
        </section>

        <section className="announcements-content" aria-labelledby="latest-announcements-title">
          <div className="announcements-content__main">
            <div className="announcements-section-heading">
              <p>Latest notices</p>
              <h2 id="latest-announcements-title">Announcements for the community</h2>
            </div>

            <div className="announcements-card-grid">
              {latest.map((item) => (
                <AnnouncementCard key={item.title} item={item} />
              ))}
            </div>
          </div>

          <aside className="announcements-notice-board" aria-labelledby="notice-board-title">
            <p className="announcements-notice-board__label">Notice board</p>
            <h2 id="notice-board-title" className="announcements-notice-board__title">
              Quick reminders
            </h2>

            <div className="announcements-notice-board__list">
              {noticeBoardItems.map((item) => (
                <div key={item.label} className="announcements-notice-board__item">
                  <span className="announcements-notice-board__icon" aria-hidden="true">
                    <Icon icon={item.icon} />
                  </span>
                  <div>
                    <p>{item.label}</p>
                    <strong>{item.value}</strong>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
