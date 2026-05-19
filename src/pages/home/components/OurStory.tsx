import { AppLink } from '@/shared/components/ui/AppLink';
import { ROUTES } from '@/shared/constants/routes';

export default function OurStory() {
  return (
    <section
      className="relative overflow-hidden bg-[url('/realAboutBg.png')] bg-cover bg-center px-0 py-10 md:py-16"
      aria-labelledby="home-about-title"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(33,90,130,0.102)_0%,rgba(101,188,250,0.102)_36%,rgba(82,177,245,0.102)_80%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_32%)]"
      />

      <div className="relative z-10 container-custom">
        <div className="relative z-10">
          <div className="relative mb-6 inline-flex items-center px-[0.9rem] py-3 text-base font-extrabold leading-none text-[#071116]">
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-[1.45rem] w-[1.45rem] border-b-2 border-l-2 border-primary-500"
            />
            <span
              aria-hidden="true"
              className="absolute top-0 right-0 h-[1.45rem] w-[1.45rem] border-t-2 border-r-2 border-primary-500"
            />
            <span>About Us</span>
          </div>

          <h2
            id="home-about-title"
            className="m-0 text-[clamp(1.5rem,2.7vw,2.6rem)] font-extrabold leading-[1.15] text-[#071116] md:tracking-[0.06em]"
          >
            A Legacy Woven in Crimson &amp; Gold
          </h2>

          <div className="mt-6 max-w-[72rem] text-sm md:text-base font-normal leading-[1.36] tracking-[0.03em] text-[#071116] md:mt-[2.3rem] md:tracking-[0.08em]">
            <p className="m-0">
              Federal Government Girls' College stands among Nigeria's most revered institutions, a
              place where countless women first discovered their voice, their strength, and their
              purpose. From dormitory friendships forged by candlelight to classroom debates that
              shaped futures, FGGC made us who we are.
            </p>

            <p className="mt-7 m-0">
              The Alumnae Association exists to honour that legacy: connecting women across
              generations and continents, investing in current students, and ensuring the school
              continues to produce Nigeria's finest daughters.{' '}
              <AppLink
                href={ROUTES.ABOUT}
                className="whitespace-nowrap font-extrabold text-primary-500 no-underline transition-colors hover:text-primary-600"
              >
                read more
              </AppLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
