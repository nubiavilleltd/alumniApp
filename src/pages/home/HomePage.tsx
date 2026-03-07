import { Icon } from '@iconify/react';
import { getBlogPosts, getEvents, getSiteConfig } from '@/data/content';
import { getAlumni } from '@/data/site-data';
import { Layout } from '@/shared/components/layout/Layout';
import { AppLink } from '@/shared/components/ui/AppLink';

export function HomePage() {
  const config = getSiteConfig();
  const events = getEvents();
  const blogPosts = getBlogPosts();

  const alumni = getAlumni();

  const featuredAlumni = alumni.slice(0, config.content.featured_alumni_count ?? 3);

  const latestEvents = [...events]
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .slice(0, config.content.latest_events_count ?? 4);

  const latestBlogPosts = [...blogPosts]
    .sort((a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime())
    .slice(0, 3);

  return (
    <Layout title={config.site.name} description={config.site.description}>
      <section className="hero section-sm">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-accent-900 mb-6 leading-tight">
                Connect with Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-900">
                  Alumni Network
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-accent-600 mb-8 leading-relaxed">
                Stay connected with fellow graduates, discover opportunities, and build lasting
                professional relationships.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <AppLink href="/alumni/profiles" className="btn btn-primary btn-lg">
                  <Icon icon="mdi:account-search" className="w-6 h-6 mr-2" />
                  Browse Alumni
                </AppLink>
                <AppLink href="/about" className="btn btn-outline btn-lg">
                  <Icon icon="mdi:information" className="w-6 h-6 mr-2" />
                  Learn More
                </AppLink>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-primary-400 to-primary-900 rounded-3xl p-8 md:p-12 shadow-2xl">
                  <div className="text-center text-white">
                    <Icon
                      icon="mdi:account-group"
                      className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6"
                    />
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Join Our Network</h3>
                    <p className="text-lg mb-6 opacity-90">
                      Connect with {alumni.length}+ alumni from {config.organization.name}
                    </p>
                    {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <AppLink
                        href="/alumni"
                        className="btn btn-secondary btn-lg text-white hover:bg-secondary-600"
                      >
                        <Icon icon="mdi:search" className="w-6 h-6 mr-2" />
                        Browse Network
                      </AppLink>
                      <AppLink
                        href={
                          config.features.alumni_registration.enabled
                            ? config.features.alumni_registration.url
                            : '#'
                        }
                        className="btn btn-white btn-lg text-secondary-600 hover:bg-secondary-50"
                        target={config.features.alumni_registration.enabled ? '_blank' : undefined}
                        rel={
                          config.features.alumni_registration.enabled
                            ? 'noopener noreferrer'
                            : undefined
                        }
                      >
                        <Icon icon="mdi:account-plus" className="w-6 h-6 mr-2" />
                        Join Now
                      </AppLink>
                    </div> */}
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary-200 rounded-full opacity-50 animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary-200 rounded-full opacity-50 animate-pulse animation-delay-1000" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm bg-gradient-to-r from-accent-50 to-accent-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Icon icon="mdi:account-group" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-primary-900 mb-2">{alumni.length}+</h3>
              <p className="text-accent-700 font-medium">Alumni</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Icon icon="mdi:calendar" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-accent-900 mb-2">
                {config.years.end - config.years.start + 1}
              </h3>
              <p className="text-accent-700 font-medium">Years</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Icon icon="mdi:map-marker" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-primary-900 mb-2">Global</h3>
              <p className="text-accent-700 font-medium">Network</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-accent-900 mb-4">Upcoming Events</h2>
            <p className="text-xl text-accent-600 max-w-3xl mx-auto">
              Stay updated with the latest events, reunions, and networking opportunities in our
              alumni community.
            </p>
          </div>

          <div className="grid-responsive mb-12">
            {latestEvents.map((event) => (
              <div className="event-card group" key={event.slug}>
                <div className="relative mb-4">
                  {event.data.image ? (
                    <img
                      src={event.data.image}
                      alt={event.data.title}
                      className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
                      <Icon icon="mdi:calendar-event" className="w-16 h-16 text-primary-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="badge badge-primary">
                      {new Date(event.data.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-accent-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                  {event.data.title}
                </h3>
                <p className="text-accent-600 mb-4 line-clamp-2">{event.data.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-accent-500">
                    <Icon icon="mdi:map-marker" className="w-4 h-4" />
                    <span>{event.data.location}</span>
                  </div>
                  <AppLink
                    href={`/events/${event.data.slug}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Learn More →
                  </AppLink>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <AppLink href="/events" className="btn btn-outline btn-lg">
              <Icon icon="mdi:calendar-multiple" className="w-6 h-6 mr-2" />
              View All Events
            </AppLink>
          </div>
        </div>
      </section>

      <section className="section bg-gradient-to-br from-accent-50 to-primary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-accent-900 mb-4">Featured Alumni</h2>
            <p className="text-xl text-accent-600 max-w-3xl mx-auto">
              Meet some of our outstanding alumni who are making a difference in their fields.
            </p>
          </div>

          <div className="grid-responsive mb-12">
            {featuredAlumni.map((alum) => {
              const initials = alum.name
                .split(' ')
                .map((name) => name[0])
                .join('')
                .toUpperCase();

              return (
                <div className="profile-card text-center group" key={alum.slug}>
                  <div className="relative mb-6">
                    {alum.photo ? (
                      <img
                        src={alum.photo}
                        alt={alum.name}
                        className="profile-avatar group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="profile-avatar-placeholder group-hover:scale-105 transition-transform duration-300">
                        {initials}
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-accent-900 mb-2">{alum.name}</h3>
                  <p className="text-accent-600 mb-4 line-clamp-3">{alum.short_bio}</p>

                  <div className="flex items-center justify-center space-x-2 mb-4">
                    {alum.social?.linkedin && (
                      <AppLink
                        href={alum.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-400 hover:text-primary-600 transition-colors duration-200"
                      >
                        <Icon icon="mdi:linkedin" className="w-5 h-5" />
                      </AppLink>
                    )}
                    {alum.social?.twitter && (
                      <AppLink
                        href={alum.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-400 hover:text-primary-600 transition-colors duration-200"
                      >
                        <Icon icon="mdi:twitter" className="w-5 h-5" />
                      </AppLink>
                    )}
                    {alum.social?.github && (
                      <AppLink
                        href={alum.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-400 hover:text-primary-600 transition-colors duration-200"
                      >
                        <Icon icon="mdi:github" className="w-5 h-5" />
                      </AppLink>
                    )}
                  </div>

                  <div className="text-sm text-accent-500 mb-4">Class of {alum.year}</div>

                  <AppLink
                    href={`/alumni/profiles/${alum.slug}`}
                    className="btn btn-primary btn-sm w-full"
                  >
                    View Profile
                  </AppLink>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <AppLink href="/alumni/profiles" className="btn btn-outline btn-lg">
              <Icon icon="mdi:account-multiple" className="w-6 h-6 mr-2" />
              Meet More Alumni
            </AppLink>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-accent-900 mb-4">
              Latest News & Insights
            </h2>
            <p className="text-xl text-accent-600 max-w-3xl mx-auto">
              Stay informed with the latest updates, stories, and insights from our alumni
              community.
            </p>
          </div>

          <div className="grid-responsive mb-12">
            {latestBlogPosts.map((post) => (
              <div className="blog-card group" key={post.slug}>
                <div className="relative mb-4">
                  {post.data.image ? (
                    <img
                      src={post.data.image}
                      alt={post.data.title}
                      className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-accent-100 to-primary-100 rounded-xl flex items-center justify-center">
                      <Icon icon="mdi:newspaper" className="w-16 h-16 text-accent-400" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="badge badge-secondary">{post.data.category}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-accent-900 mb-2 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                  {post.data.title}
                </h3>
                <p className="text-accent-600 mb-4 line-clamp-3">{post.data.description}</p>

                <div className="flex items-center justify-between text-sm text-accent-500 mb-4">
                  <span>
                    {new Date(post.data.publishDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span>By {post.data.author}</span>
                </div>

                <AppLink
                  href={`/blog/${post.slug}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Read More →
                </AppLink>
              </div>
            ))}
          </div>

          <div className="text-center">
            <AppLink href="/blog" className="btn btn-outline btn-lg">
              <Icon icon="mdi:newspaper" className="w-6 h-6 mr-2" />
              Read All Posts
            </AppLink>
          </div>
        </div>
      </section>

      <section className="section bg-gradient-to-br from-primary-400 to-primary-900">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Connect?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join our thriving alumni network and stay connected with your fellow graduates. Discover
            opportunities, share experiences, and build lasting relationships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AppLink
              href="/alumni"
              className="btn btn-primary btn-lg text-white hover:bg-primary-700 transition-colors duration-200"
            >
              <Icon icon="mdi:account-plus" className="w-6 h-6 mr-2" />
              Join the Network
            </AppLink>

            <AppLink
              href="/about"
              className="btn border border-primary-200 bg-white btn-lg text-primary-700 hover:bg-primary-700 hover:text-white transition-colors duration-200"
            >
              <Icon icon="mdi:information" className="w-6 h-6 mr-2" />
              Learn More
            </AppLink>
          </div>
        </div>
      </section>
    </Layout>
  );
}
