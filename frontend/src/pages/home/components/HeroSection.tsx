import { useContext } from 'react';
import { AppLink } from '@/shared/components/ui/AppLink';
import Button from '@/shared/components/ui/Button';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { useHomepageContent } from '@/features/homepage/hooks/useHomepageContent';
import { parseHeroTitleAnimation } from '@/features/homepage/utils/heroTitleAnimation';
import { HeroCarousel } from '@/features/homepage/components/HeroCarousel';
import { HeroReadinessContext } from '@/features/homepage/components/HeroReadinessContext';
import { useHeroTimeOfDay } from '@/features/homepage/utils/heroTimeOfDay';
import { ROUTES } from '@/shared/constants/routes';
import HomeStats from './HomeStats';

function renderHeroHeading(text?: string) {
  if (!text) return null;

  const { animatedWords, displayTitle, shouldAnimate } = parseHeroTitleAnimation(text);

  if (!shouldAnimate) {
    return displayTitle;
  }

  const titleParts = displayTitle.match(/^(.*?)(\S+)$/);
  if (!titleParts) return displayTitle;

  const prefix = titleParts[1].trimEnd();

  return (
    <>
      {prefix ? `${prefix} ` : ''}
      <span className="hero-word-rotator" aria-label={animatedWords.join(' ')}>
        <span className="hero-word-rotator__stack" aria-hidden="true">
          {animatedWords.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </span>
      </span>
    </>
  );
}

export default function HeroSection() {
  const currentUser = useIdentityStore((state) => state.user);
  const { data: homepageContent, isLoading, isError } = useHomepageContent();
  const timeOfDay = useHeroTimeOfDay();
  const onHeroReady = useContext(HeroReadinessContext);
  const allCarouselImages = homepageContent?.carouselImages ?? [];
  const timeOfDayImages = allCarouselImages.filter((image) => image.timeOfDay === timeOfDay);
  const carouselImages = timeOfDayImages.length > 0 ? timeOfDayImages : allCarouselImages;
  const headingText = isError ? 'Homepage unavailable' : homepageContent?.greetingTitle;
  const messageText = isError
    ? 'Homepage content could not be loaded right now.'
    : homepageContent?.greetingMessage;

  return (
    <HeroCarousel
      images={carouselImages}
      pending={isLoading}
      onReady={onHeroReady}
    >
      {(activeImage) => {
        const shouldShowHeroContent = activeImage?.showGreetingMessage !== false;
        return (
          <>
            {shouldShowHeroContent ? (
              <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(2,30,68,0.72)_0%,rgba(2,30,68,0.64)_48%,rgba(0,119,204,0.44)_78%,rgba(2,30,68,0.38)_100%)]" />
            ) : null}

            {shouldShowHeroContent ? (
              <div className="relative z-10 flex w-full justify-center px-[var(--app-page-inline-padding)]">
                <div className="mx-auto flex w-full max-w-[64rem] flex-col items-center text-center">
                  <h1 className="type-hero mb-4 whitespace-nowrap text-4xl font-bold text-white md:text-[80px]">
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
                        className="type-button min-w-[18.5rem] justify-center rounded-full border-0 bg-[#0077CC] px-6 py-5 text-white shadow-none"
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
          </>
        );
      }}
    </HeroCarousel>
  );
}
