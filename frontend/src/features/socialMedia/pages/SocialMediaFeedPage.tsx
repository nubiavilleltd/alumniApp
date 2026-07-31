import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';

const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/instagram/';

const socialPosts = [
  {
    id: 'community',
    image: '/alumni-hero-img6.jpg',
    alt: 'Alumnae collaborating with laptops',
    type: 'carousel',
  },
  {
    id: 'sisters',
    image: '/alumni-hero-img4.jpg',
    alt: 'Alumnae sharing a conversation',
    type: 'image',
  },
  {
    id: 'event',
    image: '/alumni-hero-img2.jpg',
    alt: 'Alumnae at an event',
    type: 'reel',
  },
] as const;

function FeedPostIcon({ type }: { type: (typeof socialPosts)[number]['type'] }) {
  if (type === 'carousel') {
    return <Icon icon="mdi:cards-outline" className="h-7 w-7 text-white drop-shadow" />;
  }

  if (type === 'reel') {
    return <Icon icon="mdi:video" className="h-8 w-8 text-white drop-shadow" />;
  }

  return null;
}

export default function SocialMediaFeedPage() {
  return (
    <>
      <SEO
        title="Social Media Feed"
        description="Follow FFGC Alumnae Association on Instagram."
      />

      <main className="min-h-screen bg-[#F8F8F7]">
        <div className="container-custom py-8 sm:py-10">
          <header className="mb-8">
            <h1 className="type-section-title mb-2 text-gray-900">Social Media Feed</h1>
            <p className="type-card-body max-w-2xl text-gray-600">
              Follow FFGC Alumnae Association on Instagram
            </p>
          </header>

          <section
            aria-label="Instagram preview"
            className="rounded-2xl bg-white px-5 py-6 shadow-sm sm:px-7 sm:py-7 lg:px-9"
          >
            <div className="mx-auto mb-6 flex max-w-[55rem] flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 rounded-full bg-[linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)] p-[3px]">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white p-1">
                    <img
                      src="/fggc-logo.jpeg"
                      alt="FFGC Alumnae Association"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <h2 className="max-w-[13rem] text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
                    FFGC Alumnae Association
                  </h2>
                  <p className="mt-1 text-sm font-semibold leading-tight text-gray-500 sm:text-base">
                    @fggcalumnae
                  </p>
                </div>
              </div>

              <dl className="grid grid-cols-3 gap-5 text-center sm:gap-8">
                {[
                  ['126', 'Posts'],
                  ['2.4K', 'Followers'],
                  ['1.9K', 'Following'],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="text-lg font-bold leading-tight text-gray-900 sm:text-xl">
                      {value}
                    </dt>
                    <dd className="text-xs font-bold leading-tight text-gray-500 sm:text-sm">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>

              <a
                href={INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 min-w-[8.75rem] items-center justify-center gap-2 rounded-full bg-[#ed0000] px-5 text-sm font-bold text-white transition-colors hover:bg-[#d90000] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-red-200 sm:text-base"
              >
                <Icon icon="mdi:instagram" className="h-5 w-5 sm:h-6 sm:w-6" />
                Follow
              </a>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {socialPosts.map((post) => (
                <a
                  key={post.id}
                  href={INSTAGRAM_PROFILE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-[0.9rem] bg-[#e9edf1] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-primary-200"
                >
                  <img
                    src={post.image}
                    alt={post.alt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <span className="absolute right-4 top-4">
                    <FeedPostIcon type={post.type} />
                  </span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
