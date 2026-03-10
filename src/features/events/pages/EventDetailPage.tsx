import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { AppLink } from '@/shared/components/ui/AppLink';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { Layout } from '@/shared/components/layout/Layout';
import { renderMarkdown } from '@/data/content';
import { getEventBySlug } from '@/data/site-data';
import { SEO } from '@/shared/common/SEO';

export function EventDetailPage() {
  const { slug = '' } = useParams();
  const event = getEventBySlug(slug);

  if (!event) {
    return (
      <Layout title="Event Not Found">
        <section className="section">
          <div className="container-custom text-center">
            <h1 className="text-3xl font-bold mb-4">Event not found</h1>
            <AppLink href="/events" className="btn btn-primary">
              Back to Events
            </AppLink>
          </div>
        </section>
      </Layout>
    );
  }

  const markdown = useMemo(() => renderMarkdown(event.content), [event.content]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: event.title },
  ];

  return (
    <>
      <SEO title={event.title} description={event.description} />
      <Breadcrumbs items={breadcrumbItems} />
      <section className="section">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card p-6">
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <p className="text-gray-600 mb-4">{event.description}</p>
              {event.image && <img src={event.image} alt={event.title} className="rounded mb-4" />}
              <div
                className="prose max-w-none prose-headings:text-accent-900 prose-a:text-primary-600"
                dangerouslySetInnerHTML={{ __html: markdown }}
              />
            </div>
            <div className="lg:col-span-1 space-y-4">
              <div className="card p-6">
                <h2 className="font-semibold mb-3">Details</h2>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    <strong>Date:</strong> {new Date(event.date).toDateString()}
                  </li>
                  {event.location && (
                    <li>
                      <strong>Location:</strong> {event.location}
                    </li>
                  )}
                </ul>
                   <AppLink
                    href="#"
                    target="_blank"
                    className="btn btn-primary btn-sm mt-4 w-full"
                  >
                    Register
                  </AppLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
