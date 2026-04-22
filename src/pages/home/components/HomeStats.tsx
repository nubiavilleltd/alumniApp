import { Icon } from '@iconify/react';
import { useAlumni } from '@/features/alumni/hooks/useAlumni';
import { useAllEvents } from '@/features/events/hooks/useEvents';

function formatCount(count: number) {
  if (count > 100) return `${Math.floor(count / 100) * 100}+`;
  if (count > 50) return `${Math.floor(count / 10) * 10}+`;
  return String(count);
}

function formatEventCount(count: number) {
  if (count === 0) return '0';
  return formatCount(count).endsWith('+') ? formatCount(count) : `${count}+`;
}

export default function HomeStats() {
  const { data: alumni = [] } = useAlumni();
  const { data: events = [] } = useAllEvents();

  const stats = [
    {
      label: 'Active Members',
      value: formatCount(alumni.length),
      icon: 'mdi:account-group-outline',
      className: 'home-stats-card--light',
    },
    {
      label: 'Founded',
      value: '1985',
      icon: 'mdi:bank-outline',
      className: 'home-stats-card--dark',
    },
    {
      label: 'Annual Events',
      value: formatEventCount(events.length),
      icon: 'mdi:calendar-sync-outline',
      className: 'home-stats-card--blue',
    },
    {
      label: 'Raised for Welfare',
      value: '-',
      icon: 'mdi:hand-heart-outline',
      className: 'home-stats-card--navy',
    },
  ];

  return (
    <section className="home-stats-section">
      <div className="container-custom">
        <div className="home-stats-grid">
          {stats.map((stat) => (
            <article key={stat.label} className={`home-stats-card ${stat.className}`}>
              <Icon icon={stat.icon} className="home-stats-card__icon" />
              <div className="home-stats-card__copy">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
