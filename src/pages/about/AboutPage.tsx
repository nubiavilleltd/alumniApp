import { AUTH_ROUTES } from '@/features/authentication/routes';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { SEO } from '@/shared/common/SEO';
import { ButtonLink } from '@/shared/components/ui/Button';

const missionFeatures = [
  {
    title: 'Connect with Alumnae',
    description: 'Find and network with fellow graduates across different sets and industries.',
    icon: '/about_people.png',
  },
  {
    title: 'Stay Updated',
    description: 'Get the latest announcements, news, and important updates.',
    icon: '/about_speaker.png',
  },
  {
    title: 'Attend Events',
    description: 'Discover and participate in reunions meetups, and annual gatherings.',
    icon: '/about-balloon.png',
  },
  {
    title: 'Explore Opportunities',
    description: 'Browse the marketplace and organise collaborations.',
    icon: '/about-magnifying_glass.png',
  },
  {
    title: 'Engage with the Community',
    description: 'Join discussions, share ideas, and contribute to initiatives.',
    icon: '/about_message_bubble.png',
  },
];

function SectionEyebrow({ children }: { children: string }) {
  return (
    <div className="about-eyebrow">
      <span className="about-eyebrow__corner about-eyebrow__corner--left" />
      <span className="about-eyebrow__corner about-eyebrow__corner--right" />
      <span className="about-eyebrow__label">{children}</span>
    </div>
  );
}

export function AboutPage() {
  const currentUser = useIdentityStore((state) => state.user);

  return (
    <>
      <SEO
        title="About"
        description="Learn about our alumni network, mission, and the team behind the Open Alumns Portal."
      />

      <main className="about-page">
        <section className="about-hero">
          <div className="about-hero__inner">
            <div className="about-hero__content">
              <SectionEyebrow>Who We Are</SectionEyebrow>

              <h1 className="about-hero__title">
                <span className="block">We are a platform designed</span>
                <span className="block">to keep our sisters</span>
                <span className="block">connected across</span>
                <span className="block">generations and continents.</span>
              </h1>

              <p className="about-hero__values">
                <span>Connection</span>
                <span>•</span>
                <span>Growth</span>
                <span>•</span>
                <span>Community</span>
                <span>•</span>
                <span>Impact</span>
              </p>
            </div>

            <div className="about-hero__media">
              <div className="about-hero__image-frame">
                <img
                  src="/about_woman.png"
                  alt="FGGC alumna smiling"
                  className="about-hero__image"
                />
              </div>

              {!currentUser ? (
                <ButtonLink href={AUTH_ROUTES.REGISTER} size="lg" className="about-hero__cta">
                  Join Us
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </section>

        <section className="about-mission">
          <div className="about-mission__inner">
            <SectionEyebrow>Our Mission</SectionEyebrow>

            <div className="about-mission__copy">
              <h2 className="about-mission__title">
                To foster a strong and supportive alumni network by enabling meaningful connections,
                encouraging collaboration, and providing access to valuable opportunities.
              </h2>

              <p className="about-mission__description">
                This platform is for all alumnae; recent graduates, long-standing members, and
                everyone in between who want to stay connected, grow professionally, and give back
                to the community.
              </p>
            </div>

            <div className="about-mission__features">
              {missionFeatures.map((feature) => (
                <article key={feature.title} className="about-mission__feature">
                  <div className="about-mission__icon">
                    <img src={feature.icon} alt="" />
                  </div>

                  <h3 className="about-mission__feature-title">{feature.title}</h3>

                  <p className="about-mission__feature-description">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
