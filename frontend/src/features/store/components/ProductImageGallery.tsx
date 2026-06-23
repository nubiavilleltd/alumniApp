import { useEffect, useRef } from 'react';
import type { ProductVariant } from '../types/product.types';

interface Props {
  variant: ProductVariant | undefined;
  imageIndex: number;
  onChangeIndex: (index: number) => void;
}

export function ProductImageGallery({
  variant,
  imageIndex,
  onChangeIndex,
}: Props) {
  const images = variant?.images ?? [];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current?.children?.[imageIndex] as HTMLElement;
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [imageIndex]);

  return (
    <div className="flex gap-3">
      {/* A: vertical thumbnails */}
      <div
        ref={containerRef}
        className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1"
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => onChangeIndex(i)}
            className={`border rounded-lg overflow-hidden ${
              i === imageIndex
                ? 'border-primary-500'
                : 'border-gray-200 opacity-70'
            }`}
          >
            <img
              src={img}
              className="w-14 h-14 object-cover"
              alt="thumb"
            />
          </button>
        ))}
      </div>

      {/* B: main image */}
      <div className="flex-1">
        <img
          src={images[imageIndex]}
          className="w-full h-[320px] object-cover rounded-xl"
          alt="product"
        />
      </div>
    </div>
  );
}