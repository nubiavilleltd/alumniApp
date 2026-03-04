import { useMemo, useState } from 'react';
import { AppLink } from '@/components/AppLink';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Layout } from '@/components/Layout';
import { getEvents } from '@/data/content';

export function EventsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const events = getEvents();

  const upcoming = useMemo(() => {
    const now = new Date();
    return events
      .filter((event) => new Date(event.data.date) >= now)
      .sort((a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime());
  }, [events]);

  const past = useMemo(() => {
    const now = new Date();
    return events
      .filter((event) => new Date(event.data.date) < now)
      .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
  }, [events]);

  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Events' }];

  const isUpcoming = activeTab === 'upcoming';
  const activeList = isUpcoming ? upcoming : past;

  return (
    <Layout title="Events">
      <Breadcrumbs items={breadcrumbItems} />
      <section className="section">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-6">Events</h1>

          <div className="mb-6 flex gap-2">
            <button
              type="button"
              className={`tab-btn btn btn-outline btn-sm ${isUpcoming ? 'bg-primary-600 text-white' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </button>
            <button
              type="button"
              className={`tab-btn btn btn-outline btn-sm ${!isUpcoming ? 'bg-primary-600 text-white' : ''}`}
              onClick={() => setActiveTab('past')}
            >
              Past
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeList.map((event) => (
              <AppLink
                href={`/events/${event.data.slug}`}
                className="card card-hover block"
                key={event.slug}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`badge ${isUpcoming ? 'badge-primary' : 'badge-accent'}`}>
                      {isUpcoming ? 'Upcoming' : 'Past'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(event.data.date).toDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{event.data.title}</h3>
                  <p className="text-gray-600 mb-4">{event.data.description}</p>
                  {event.data.location && (
                    <p className="text-sm text-gray-500">{event.data.location}</p>
                  )}
                </div>
              </AppLink>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
