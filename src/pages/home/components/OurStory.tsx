import { AppLink } from '@/shared/components/ui/AppLink';
import { ROUTES } from '@/shared/constants/routes';

export default function OurStory() {
  return (
    <section className="home-about-section" aria-labelledby="home-about-title">
      <div className="container-custom">
        <div className="home-about-card">
          <div className="home-about-eyebrow">
            <span>About Us</span>
          </div>

          <h2 id="home-about-title" className="home-about-title">
            A Legacy Woven in Crimson &amp; Gold
          </h2>

          <div className="home-about-copy">
            <p>
              Federal Government Girls' College stands among Nigeria's most revered institutions, a
              place where countless women first discovered their voice, their strength, and their
              purpose. From dormitory friendships forged by candlelight to classroom debates that
              shaped futures, FGGC made us who we are.
            </p>

            <p>
              The Alumnae Association exists to honour that legacy: connecting women across
              generations and continents, investing in current students, and ensuring the school
              continues to produce Nigeria's finest daughters.{' '}
              <AppLink href={ROUTES.ABOUT} className="home-about-read-more">
                read more
              </AppLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
