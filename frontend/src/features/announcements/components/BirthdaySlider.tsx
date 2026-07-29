import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface BirthdaySliderProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  getKey: (item: T) => string | number;
}

const CARD_WIDTH_CLASS = 'w-[clamp(150px,42vw,220px)] sm:w-[clamp(180px,26vw,220px)] lg:w-[220px]';

export function BirthdaySlider<T>({ items, renderItem, getKey }: BirthdaySliderProps<T>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrowState = () => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollLeft(track.scrollLeft > 4);
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrowState();
    const track = trackRef.current;
    if (!track) return;

    track.addEventListener('scroll', updateArrowState, { passive: true });
    window.addEventListener('resize', updateArrowState);

    return () => {
      track.removeEventListener('scroll', updateArrowState);
      window.removeEventListener('resize', updateArrowState);
    };
  }, [items.length]);

  const scrollByCard = (dir: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('[data-slider-card]');
    const step = (card?.offsetWidth ?? 220) + 16; // card width + gap
    track.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <div className="relative flex items-center gap-1 sm:gap-2">
      <button
        type="button"
        onClick={() => scrollByCard('left')}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
        className="hidden h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-accent-100 bg-white text-accent-700 shadow-sm transition-opacity disabled:opacity-0 sm:flex hover:bg-accent-50"
      >
        <ChevronLeft size={18} />
      </button>

      <div
        ref={trackRef}
        className="flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div key={getKey(item)} data-slider-card className={`shrink-0 snap-start ${CARD_WIDTH_CLASS}`}>
            {renderItem(item)}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByCard('right')}
        disabled={!canScrollRight}
        aria-label="Scroll right"
        className="hidden h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-accent-100 bg-white text-accent-700 shadow-sm transition-opacity disabled:opacity-0 sm:flex hover:bg-accent-50"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}