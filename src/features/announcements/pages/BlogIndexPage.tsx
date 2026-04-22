import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { ButtonLink } from '@/shared/components/ui/Button';
import { ROUTES } from '@/shared/constants/routes';
import { EVENT_ROUTES } from '@/features/events/routes';

const announcements = [
  {
    title:
      'Ut facilisi id lacus montes cras congue donec lacus et proin fames facilisi in pellentesque.',
    time: '10:23 AM Today',
    image: '/news-2.png',
    summary:
      'Mattis amet accumsan a donec nullam. Accumsan purus egestas viverra in ornare quis in. Leo fames aliquet amet egestas purus pellentesque integer sapien. Fusce pharetra risus nisl viverra. Sed aliquet nisl nulla sem...',
  },
  {
    title: 'Ut facilisi id lacus montes cras congue donec lacus et proin fames facilisi in.',
    time: '03:40 PM Yesterday',
    image: '/news-1.png',
    summary:
      'Mattis amet accumsan a donec nullam. Accumsan purus egestas viverra in ornare quis in. Leo fames aliquet amet egestas purus pell...',
  },
  {
    title: 'Ut facilisi id lacus montes cras congue donec lacus et proin fames facilisi in.',
    time: '11:26 AM Nov 2, 2025',
    image: '/event-1.png',
    summary:
      'Mattis amet accumsan a donec nullam. Accumsan purus egestas viverra in ornare quis in. Leo fames aliquet amet egestas purus pell...',
  },
  {
    title: 'Ut facilisi id lacus montes cras congue donec lacus et proin fames facilisi in.',
    time: '09:10 AM Oct 28, 2025',
    image: '/news-4.png',
    summary:
      'Mattis amet accumsan a donec nullam. Accumsan purus egestas viverra in ornare quis in. Leo fames aliquet amet egestas purus pell...',
  },
  {
    title: 'Ut facilisi id lacus montes cras congue donec lacus et proin fames facilisi in.',
    time: '04:15 PM Oct 14, 2025',
    image: '/news-5.png',
    summary:
      'Mattis amet accumsan a donec nullam. Accumsan purus egestas viverra in ornare quis in. Leo fames aliquet amet egestas purus pell...',
  },
  {
    title: 'Ut facilisi id lacus montes cras congue donec lacus et proin fames facilisi in.',
    time: '01:05 PM Sep 30, 2025',
    image: '/project-1.png',
    summary:
      'Mattis amet accumsan a donec nullam. Accumsan purus egestas viverra in ornare quis in. Leo fames aliquet amet egestas purus pell...',
  },
  {
    title: 'Ut facilisi id lacus montes cras congue donec lacus et proin fames facilisi in.',
    time: '12:00 PM Sep 18, 2025',
    image: '/project-2.png',
    summary:
      'Mattis amet accumsan a donec nullam. Accumsan purus egestas viverra in ornare quis in. Leo fames aliquet amet egestas purus pell...',
  },
];

function AnnouncementCard({ item }: { item: (typeof announcements)[number] }) {
  return (
    <article className="announcements-card">
      <div className="announcements-card__image-wrap">
        <img src={item.image} alt="" className="announcements-card__image" />
      </div>

      <div className="announcements-card__body">
        <h3 className="announcements-card__title">{item.title}</h3>
        <p className="announcements-card__summary">{item.summary}</p>
        <p className="announcements-time">
          <Icon icon="mdi:clock-time-three-outline" />
          {item.time}
        </p>
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
        <section className="announcements-shell" aria-labelledby="announcements-title">
          <header className="announcements-header">
            <h1 id="announcements-title" className="announcements-title">
              Announcements
            </h1>
            <div className="announcements-actions">
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
            <article className="announcements-featured">
              <div className="announcements-featured__image-wrap">
                <img src={featured.image} alt="" className="announcements-featured__image" />
              </div>

              <div className="announcements-featured__body">
                <p className="announcements-time">
                  <Icon icon="mdi:clock-time-three-outline" />
                  {featured.time}
                </p>
                <h2 className="announcements-featured__title">{featured.title}</h2>
                <p className="announcements-featured__summary">
                  {featured.summary} <span>read more</span>
                </p>
              </div>
            </article>

            <div className="announcements-side-list">
              {latest.slice(0, 3).map((item) => (
                <AnnouncementCard key={item.time} item={item} />
              ))}
            </div>

            <div className="announcements-continuation">
              {latest.slice(3).map((item) => (
                <AnnouncementCard key={item.time} item={item} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
