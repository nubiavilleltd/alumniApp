import { useState, useEffect } from 'react';
import { AppLink } from '@/shared/components/ui/AppLink';
import Button from '@/shared/components/ui/Button';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { useHomepageContent } from '@/features/homepage/hooks/useHomepageContent';
import { ROUTES } from '@/shared/constants/routes';
import HomeStats from './HomeStats';

function HeroSectionSkeleton() {
  return (
    <section
      className="relative flex min-h-[72vh] items-center overflow-hidden bg-primary-700 px-0 lg:min-h-[78vh]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-pulse bg-[linear-gradient(90deg,#021E4480_0%,#021E4480_52%,rgba(2,30,68,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[#021E4480]" />

      <div className="relative z-10 w-full px-[var(--app-page-inline-padding)]">
        <div className="max-w-3xl animate-pulse text-left">
          <div className="mb-6 h-14 w-4/5 rounded-full bg-white/25 md:h-20" />
          <div className="mb-3 h-6 w-full max-w-2xl rounded-full bg-white/20 md:h-8" />
          <div className="mb-8 h-6 w-3/4 max-w-xl rounded-full bg-white/20 md:h-8" />

          <div className="flex flex-col items-start gap-4">
            <div className="h-14 w-44 rounded-full bg-white/30" />
            <div className="h-14 w-56 rounded-full bg-white/20" />
          </div>
        </div>
      </div>
    </section>
  );
}

function renderHeroHeading(text?: string) {
  if (!text) return null;

  const trimmedText = text.trim();
  const homeMatch = trimmedText.match(/^(.*?)(\s+home)$/i);

  if (!homeMatch) {
    return trimmedText;
  }

  return (
    <>
      {homeMatch[1]}
      <span className="bg-[linear-gradient(95deg,#ffffff_0%,#d9eefb_45%,#7bbbe8_100%)] bg-clip-text text-transparent">
        {homeMatch[2]}
      </span>
    </>
  );
}

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const currentUser = useIdentityStore((state) => state.user);
  const { data: homepageContent, isLoading, isError } = useHomepageContent();
  const heroImages = homepageContent?.carouselImages ?? [];
  const hasHeroImages = heroImages.length > 0;
  const currentHeroImage = heroImages[current];
  const shouldShowHeroContent = !hasHeroImages || currentHeroImage?.showGreetingMessage !== false;
  const headingText = isLoading
    ? 'Loading homepage...'
    : isError
      ? 'Homepage unavailable'
      : homepageContent?.greetingTitle;
  const messageText = isError
    ? 'Homepage content could not be loaded right now.'
    : homepageContent?.greetingMessage;

  useEffect(() => {
    if (heroImages.length < 2) {
      return undefined;
    }

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    if (current >= heroImages.length) {
      setCurrent(0);
    }
  }, [current, heroImages.length]);

  if (isLoading) {
    return <HeroSectionSkeleton />;
  }

  return (
    <section
      className="home-hero relative flex min-h-[72vh] items-center overflow-hidden px-0 pb-36 pt-20 lg:h-[728px] lg:min-h-[728px] lg:pb-44 lg:pt-28"
      aria-busy={isLoading}
    >
      {/* ── Background Images ─────────────────────────────────────────────── */}
      {hasHeroImages ? (
        heroImages.map((image, i) => (
          <div
            key={image.id || image.imageUrl}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.imageUrl}
              alt={image.altText}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))
      ) : (
        <div className="absolute inset-0 z-0 bg-[#021E4480]" />
      )}

      {shouldShowHeroContent ? (
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,#021E4480_0%,#021E4480_52%,rgba(2,30,68,0.18)_100%)]" />
      ) : null}

      {shouldShowHeroContent ? (
        <div className="relative z-10 flex w-full justify-center px-[var(--app-page-inline-padding)]">
          <div className="mx-auto flex max-w-[43.125rem] flex-col items-center text-center">
            <h1 className="type-hero mb-4 text-4xl font-bold text-white md:text-[80px]">
              {renderHeroHeading(headingText)}
            </h1>
            <p className="mb-[38px] max-w-[43.125rem] text-lg font-[500] text-white md:text-[24px]">
              {messageText}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {!currentUser ? (
                <AppLink href={AUTH_ROUTES.REGISTER}>
                  <Button
                    size="lg"
                    className="type-button min-w-[13.5rem] justify-center rounded-full bg-white px-16 py-5 text-primary-500 shadow-none hover:bg-white/90"
                  >
                    Join Us
                  </Button>
                </AppLink>
              ) : null}

              <AppLink href={ROUTES.DONATION}>
                <Button
                  size="lg"
                  className="type-button min-w-[18.5rem] justify-center rounded-full border-0 bg-[#0077CC] px-6 py-5 text-white shadow-none hover:bg-[#6d28d9]"
                >
                  Make a Donation
                  <img
                    src="/donationIcon.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0"
                  />
                </Button>
              </AppLink>
            </div>
          </div>
        </div>
      ) : null}

      {shouldShowHeroContent ? <HomeStats /> : null}
    </section>
  );
}
