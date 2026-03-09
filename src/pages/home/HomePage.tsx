import { Icon } from '@iconify/react';
import { getBlogPosts, getSiteConfig } from '@/data/content';
import { getAlumni, getEvents } from '@/data/site-data';
import { Layout } from '@/shared/components/layout/Layout';
import { AppLink } from '@/shared/components/ui/AppLink';
import { SEO } from '@/shared/common/SEO';
import Button from '@/shared/components/ui/Button';
import HeroBg from '../../../public/hero-bg.png';
import OurStory from './components/OurStory';
import NewsAndStories from './components/NewsAndStories';
import Leadership from './components/Leadership';
import OurProjects from './components/OurProjects';
import UpcomingEvents from './components/UpcomingEvents';
import HomeStats from './components/HomeStats';
import HeroSection from './components/HeroSection';

export function HomePage() {
  const config = getSiteConfig();
  const events = getEvents();
  const blogPosts = getBlogPosts();

  const alumni = getAlumni();

  const featuredAlumni = alumni.slice(0, config.content.featured_alumni_count ?? 3);

  const latestEvents = [...events]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, config.content.latest_events_count ?? 4);

  const latestBlogPosts = [...blogPosts]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 3);

  return (
    // <Layout title={config.site.name} description={config.site.description}>
    <>
      <SEO title={config.site.name} description={config.site.description} />
  
    <HeroSection />

      <HomeStats />

 

      <OurStory />

      <OurProjects />

      <UpcomingEvents />

      {/* <section className="section">
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
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
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
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-accent-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                  {event.title}
                </h3>
                <p className="text-accent-600 mb-4 line-clamp-2">{event.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-accent-500">
                    <Icon icon="mdi:map-marker" className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <AppLink
                    href={`/events/${event.slug}`}
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
      </section> */}

      {/* <section className="section bg-gradient-to-br from-accent-50 to-primary-50">
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
      </section> */}

      {/* <section className="section">
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
      </section> */}

      <NewsAndStories />

      <Leadership />

      {/* <section className="section bg-gradient-to-br from-primary-400 to-primary-900">
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
      </section> */}
    </>
  );
}
