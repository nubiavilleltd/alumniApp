import { useState, useEffect } from 'react';
import { AppLink } from '@/shared/components/ui/AppLink';
import Button from '@/shared/components/ui/Button';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { useHomepageContent } from '@/features/homepage/hooks/useHomepageContent';
import { ROUTES } from '@/shared/constants/routes';

function HeroSectionSkeleton() {
  return (
    <section
      className="relative flex min-h-[72vh] items-center overflow-hidden bg-primary-700 px-0 lg:min-h-[78vh]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800" />
      <div className="absolute inset-0 bg-primary-900/25" />

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

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const currentUser = useIdentityStore((state) => state.user);
  const { data: homepageContent, isLoading, isError } = useHomepageContent();
  const heroImages = homepageContent?.carouselImages ?? [];
  const hasHeroImages = heroImages.length > 0;
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
      className="relative flex min-h-[72vh] items-center overflow-hidden px-0 lg:min-h-[78vh]"
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
        <div className="absolute inset-0 z-0 bg-primary-700" />
      )}

      {/* ── Blue overlay ──────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-primary-700/90 via-primary-600/72 to-primary-900/28" />
      <div className="absolute inset-0 z-[1] bg-primary-500/20" />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full px-[var(--app-page-inline-padding)]">
        <div className="max-w-3xl text-left">
          <h1 className="type-hero text-4xl md:text-[80px] font-[500] mb-6 text-white">
            {headingText}
          </h1>
          <p className="text-lg md:text-[24px] font-[500] text-white/90 mb-8 max-w-2xl">
            {messageText}
          </p>
          <div className="flex flex-col items-start gap-4">
            {!currentUser ? (
              <AppLink href={AUTH_ROUTES.REGISTER}>
                <Button
                  size="lg"
                  className="type-button justify-center rounded-full bg-white px-16 py-5 text-primary-500 shadow-none hover:bg-white/90"
                >
                  Join Us
                </Button>
              </AppLink>
            ) : null}

            <AppLink href={ROUTES.DONATION}>
              <Button
                size="lg"
                className="type-button justify-center rounded-full border-0 bg-[#7c3aed] px-6 py-5 text-white shadow-none hover:bg-[#6d28d9]"
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
    </section>
  );
}
