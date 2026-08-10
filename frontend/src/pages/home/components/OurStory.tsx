import { AppLink } from '@/shared/components/ui/AppLink';
import { ROUTES } from '@/shared/constants/routes';

export default function OurStory() {
  return (
    <section
      className="px-[var(--app-page-inline-padding)] py-12 md:py-[50px]"
      aria-labelledby="home-about-title"
    >
      <div className="mx-auto flex max-w-[82rem] flex-col items-center text-center">
        <p className="mb-2 text-base font-semibold leading-normal tracking-[0.03em] text-[#0077cc]">
          About Us
        </p>

        <h2
          id="home-about-title"
          className="m-0 text-[clamp(1.75rem,2.25vw,2rem)] font-semibold leading-normal tracking-[0.03em] text-[#000e17]"
        >
          A Legacy Woven in Crimson &amp; Gold
        </h2>

        <div className="mt-2 max-w-[82rem] text-base font-normal leading-normal tracking-[0.03em] text-[#000e17] md:text-[20px]">
          <p className="m-0">
            Federal Government Girls' College stands among Nigeria's most revered institutions, a
            place where countless women first discovered their voice, their strength, and their
            purpose. From dormitory friendships forged by candlelight to classroom debates that
            shaped futures, FGGC made us who we are.
          </p>

          <p className="m-0 mt-8">
            The Alumnae Association exists to honour that legacy: connecting women across
            generations and continents, investing in current students, and ensuring the school
            continues to produce Nigeria's finest daughters.{' '}
            <AppLink
              href={ROUTES.ABOUT}
              className="whitespace-nowrap font-semibold text-[#021e44] no-underline transition-colors hover:text-[#0077cc]"
            >
              Read more
            </AppLink>
          </p>
        </div>
      </div>
    </section>
  );
}
