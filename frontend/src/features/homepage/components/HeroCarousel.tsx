import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { HomepageCarouselImage } from '../types/homepage.types';
import { heroImageKey, heroImageSources } from '../utils/heroImageSources';

const EMPTY_IMAGES: HomepageCarouselImage[] = [];
type ImageStatus = 'ready' | 'error';

function HeroSlide({
  image,
  active,
  first,
  status,
  onSettled,
}: {
  image: HomepageCarouselImage;
  active: boolean;
  first: boolean;
  status?: ImageStatus;
  onSettled: (key: string, status: ImageStatus) => void;
}) {
  const key = heroImageKey(image);
  const [useOriginal, setUseOriginal] = useState(false);
  const sources = useOriginal ? { src: image.imageUrl } : heroImageSources(image);
  const canFallback = !useOriginal && sources.src !== image.imageUrl;

  const fail = useCallback(() => {
    if (canFallback) setUseOriginal(true);
    else onSettled(key, 'error');
  }, [canFallback, key, onSettled]);

  useEffect(() => {
    if (status) return;
    // A stalled/broken image must not hold the skeleton or the queue forever.
    const timeout = window.setTimeout(fail, 30000);
    return () => window.clearTimeout(timeout);
  }, [fail, status]);

  return (
    <img
      {...sources}
      alt={active ? image.altText : ''}
      aria-hidden={!active}
      data-hero-slide={image.id}
      data-ready={status === 'ready'}
      data-active={active}
      loading="eager"
      fetchPriority={first ? 'high' : 'low'}
      decoding="async"
      onLoad={async (event) => {
        const element = event.currentTarget;
        const source = element.currentSrc;
        try {
          // Wait for pixels to be decoded on the SAME element we display.
          // Preloading another element and then remounting can flash on phones.
          await element.decode();
          if (element.isConnected && element.currentSrc === source) onSettled(key, 'ready');
        } catch {
          if (element.isConnected && element.currentSrc === source) fail();
        }
      }}
      onError={fail}
      className={`absolute inset-0 z-0 h-full w-full object-cover object-center transition-opacity duration-700 motion-reduce:transition-none ${active ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}

export function HeroCarousel({
  images = EMPTY_IMAGES,
  pending,
  onReady,
  children,
}: {
  images?: HomepageCarouselImage[];
  pending: boolean;
  onReady: () => void;
  children: (activeImage: HomepageCarouselImage | undefined) => ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [requested, setRequested] = useState<Set<string>>(() => new Set());
  const [statuses, setStatuses] = useState<Record<string, ImageStatus>>({});
  const [currentKey, setCurrentKey] = useState<string>();
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [reducedMotion, setReducedMotion] = useState(false);
  const readyImages = images.filter((image) => statuses[heroImageKey(image)] === 'ready');
  const readyKeys = readyImages.map(heroImageKey);
  const readyKeysRef = useRef(readyKeys);
  const activeImage =
    readyImages.find((image) => heroImageKey(image) === currentKey) ?? readyImages[0];
  const activeKey = activeImage && heroImageKey(activeImage);
  const stillLoading =
    pending || (!activeImage && images.some((image) => statuses[heroImageKey(image)] !== 'error'));
  const canRotate = readyImages.length > 1 && inView && pageVisible && !reducedMotion;

  const settle = useCallback((key: string, status: ImageStatus) => {
    setStatuses((previous) => (previous[key] ? previous : { ...previous, [key]: status }));
  }, []);

  useEffect(() => {
    readyKeysRef.current = readyKeys;
  }, [readyKeys]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    document.addEventListener('visibilitychange', updateVisibility);
    media.addEventListener('change', updateMotion);
    return () => {
      document.removeEventListener('visibilitychange', updateVisibility);
      media.removeEventListener('change', updateMotion);
    };
  }, []);

  useEffect(() => {
    if (pending || !inView || !pageVisible) return;
    if (
      images.some((image) => requested.has(heroImageKey(image)) && !statuses[heroImageKey(image)])
    )
      return;
    const next = images.find((image) => !requested.has(heroImageKey(image)));
    if (!next) return;
    // Assign a source to just one new element. Completed elements retain their
    // source and remain mounted, including while the hero is offscreen.
    setRequested((previous) => new Set(previous).add(heroImageKey(next)));
  }, [images, inView, pageVisible, pending, requested, statuses]);

  useEffect(() => {
    if (!canRotate) return;
    const timer = window.setInterval(() => {
      const keys = readyKeysRef.current;
      setCurrentKey((previous) => {
        const index = Math.max(0, keys.indexOf(previous ?? keys[0]));
        return keys[(index + 1) % keys.length];
      });
    }, 5000);
    return () => window.clearInterval(timer);
  }, [canRotate]);

  useEffect(() => {
    if (!stillLoading) onReady();
  }, [onReady, stillLoading]);

  return (
    <section
      ref={sectionRef}
      className="home-hero relative flex min-h-[72vh] items-center overflow-hidden bg-primary-950 px-0 pb-36 pt-20 lg:h-[728px] lg:min-h-[728px] lg:pb-44 lg:pt-28"
      aria-label="Welcome"
      aria-busy={stillLoading}
    >
      {images.map((image, index) => {
        const key = heroImageKey(image);
        if (!requested.has(key) || statuses[key] === 'error') return null;
        return (
          <HeroSlide
            key={key}
            image={image}
            first={index === 0}
            active={key === activeKey}
            status={statuses[key]}
            onSettled={settle}
          />
        );
      })}

      {/* Preserve the real content's dimensions, but do not expose covered
          controls to keyboards or screen readers while the skeleton is shown. */}
      <div className={`w-full ${stillLoading ? 'invisible' : ''}`} inert={stillLoading}>
        {children(activeImage)}
      </div>

      {stillLoading && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-primary-700 px-[var(--app-page-inline-padding)]"
          role="status"
        >
          <span className="sr-only">Loading homepage images…</span>
          <div className="w-full max-w-[64rem] motion-safe:animate-pulse" aria-hidden="true">
            <div className="mx-auto mb-6 h-14 w-4/5 max-w-3xl rounded-full bg-white/25 md:h-20" />
            <div className="mx-auto mb-3 h-6 w-full max-w-2xl rounded-full bg-white/20 md:h-8" />
            <div className="mx-auto mb-8 h-6 w-3/4 max-w-xl rounded-full bg-white/20 md:h-8" />
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="h-14 w-44 rounded-full bg-white/30" />
              <div className="h-14 w-56 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
