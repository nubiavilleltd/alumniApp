// import { useEffect, useRef } from 'react';
// import type { ProductVariant } from '../types/product.types';

// interface Props {
//   variant: ProductVariant | undefined;
//   imageIndex: number;
//   onChangeIndex: (index: number) => void;
// }

// export function ProductImageGallery({
//   variant,
//   imageIndex,
//   onChangeIndex,
// }: Props) {
//   const images = variant?.images ?? [];
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const el = containerRef.current?.children?.[imageIndex] as HTMLElement;
//     el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
//   }, [imageIndex]);

//   return (
//     <div className="flex gap-3">
//       {/* A: vertical thumbnails */}
//       <div
//         ref={containerRef}
//         className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1"
//       >
//         {images.map((img, i) => (
//           <button
//             key={i}
//             onClick={() => onChangeIndex(i)}
//             className={`border rounded-lg overflow-hidden ${
//               i === imageIndex
//                 ? 'border-primary-500'
//                 : 'border-gray-200 opacity-70'
//             }`}
//           >
//             <img
//               src={img}
//               className="w-14 h-14 object-cover"
//               alt="thumb"
//             />
//           </button>
//         ))}
//       </div>

//       {/* B: main image */}
//       <div className="flex-1">
//         <img
//           src={images[imageIndex]}
//           className="w-full h-[320px] object-cover rounded-xl"
//           alt="product"
//         />
//       </div>
//     </div>
//   );
// }






import { useEffect, useRef } from 'react';
import type { ProductVariant } from '../types/product.types';

interface Props {
  variant: ProductVariant | undefined;
  imageIndex: number;
  onChangeIndex: (index: number) => void;
  /** Set to false to hide the thumbnail strip (A). Defaults to true. */
  showThumbnails?: boolean;
}

export function ProductImageGallery({
  variant,
  imageIndex,
  onChangeIndex,
  showThumbnails = true,
}: Props) {
  const images = variant?.images ?? [];
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Scroll active thumbnail into view
  useEffect(() => {
    thumbnailRefs.current[imageIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [imageIndex]);

  const mainImage = images[imageIndex] ?? images[0];

  return (
    <div className="flex gap-3">
      {/* ── A: Vertical thumbnail strip ────────────────────────────────── */}
      {showThumbnails && images.length > 1 && (
        <div className="flex flex-col gap-2 w-[72px] shrink-0 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
          {images.map((img, i) => (
            <button
              key={i}
              ref={(el) => { thumbnailRefs.current[i] = el; }}
              onClick={() => onChangeIndex(i)}
              className={`rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                i === imageIndex
                  ? 'border-primary-500 opacity-100'
                  : 'border-gray-200 opacity-60 hover:opacity-90'
              }`}
            >
              <img
                src={img}
                className="w-full h-[64px] object-cover"
                alt={`View ${i + 1}`}
              />
            </button>
          ))}
        </div>
      )}

      {/* ── B: Main preview ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        <img
          src={mainImage}
          className="w-full h-[280px] sm:h-[320px] object-cover rounded-xl bg-gray-50"
          alt="Product preview"
        />
      </div>
    </div>
  );
}