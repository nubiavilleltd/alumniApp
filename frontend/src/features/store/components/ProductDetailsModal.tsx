// // // import { Modal } from '@/shared/components/ui/Modal';
// // // import Button from '@/shared/components/ui/Button';

// // // import { useCartStore } from '../stores/useCartStore';
// // // import { useProductModalStore } from '../stores/useProductModalStore';

// // // import { useProductSelection } from '../hooks/useProductSelection';

// // // import { ProductImageGallery } from './ProductImageGallery';
// // // import { ProductColorSelector } from './ProductColorSelector';
// // // import { ProductSizeSelector } from './ProductSizeSelector';
// // // import { ProductQuantitySelector } from './ProductQuantitySelector';

// // // export function ProductDetailsModal() {
// // //   const { isOpen, close, product, mode, cartItem } =
// // //     useProductModalStore();

// // //   const addItem = useCartStore((s) => s.addItem);
// // //   const updateItem = useCartStore((s) => s.updateItem);

// // //   const {
// // //     selectedColor,
// // //     setSelectedColor,
// // //     selectedSize,
// // //     setSelectedSize,
// // //     quantity,
// // //     setQuantity,
// // //     imageIndex,
// // //     setImageIndex,
// // //     activeVariant,
// // //     sizes,
// // //     maxStock,
// // //   } = useProductSelection(product);

// // //   if (!product) return null;

// // //   const handleAddToCart = () => {
// // //     const itemId =
// // //       product.id +
// // //       '-' +
// // //       selectedColor +
// // //       '-' +
// // //       selectedSize;

// // //     const payload = {
// // //       id: itemId,
// // //       productId: product.id,
// // //       productName: product.name,
// // //       image: activeVariant?.images?.[0] ?? '',
// // //       price: product.price,
// // //       quantity,
// // //       color: selectedColor,
// // //       size: selectedSize,
// // //     };

// // //     if (mode === 'edit' && cartItem) {
// // //       updateItem(cartItem.id, payload);
// // //     } else {
// // //       addItem(payload);
// // //     }

// // //     close();
// // //   };

// // //   return (
// // //     <Modal
// // //       isOpen={isOpen}
// // //       onClose={close}
// // //       title={product.name}
// // //     >
// // //       <div className="space-y-4">
// // //         {/* IMAGE */}
// // //         <ProductImageGallery
// // //           variant={activeVariant}
// // //           imageIndex={imageIndex}
// // //           onChangeIndex={setImageIndex}
// // //         />

// // //         {/* COLOR */}
// // //         <ProductColorSelector
// // //           variants={product.variants}
// // //           selected={selectedColor}
// // //           onChange={setSelectedColor}
// // //         />

// // //         {/* SIZE */}
// // //         {product.hasSizes && (
// // //           <ProductSizeSelector
// // //             sizes={sizes}
// // //             selected={selectedSize}
// // //             onChange={setSelectedSize}
// // //           />
// // //         )}

// // //         {/* QTY */}
// // //         <ProductQuantitySelector
// // //           value={quantity}
// // //           max={maxStock || 99}
// // //           onChange={setQuantity}
// // //         />

// // //         <Button
// // //           onClick={handleAddToCart}
// // //           disabled={maxStock === 0}
// // //           className="w-full"
// // //         >
// // //           {mode === 'edit'
// // //             ? 'Update Cart'
// // //             : 'Add to Cart'}
// // //         </Button>
// // //       </div>
// // //     </Modal>
// // //   );
// // // }








// // import { useCartStore } from '../stores/useCartStore';
// // import { useProductModalStore } from '../stores/useProductModalStore';
// // import { useProductSelection } from '../hooks/useProductSelection';
// // import { ProductImageGallery } from './ProductImageGallery';
// // import { ProductSizeSelector } from './ProductSizeSelector';
// // import { ProductQuantitySelector } from './ProductQuantitySelector';
// // import { useEffect } from 'react';
// // import { ProductColorSelector } from './ProductColorSelector';

// // // ─── Full-screen overlay with custom layout (not using shared Modal shell) ────
// // // The product modal has a unique two-column layout that doesn't fit the
// // // generic Modal shell. We build our own overlay here for full control,
// // // but keep the animation and lock-scroll behaviour consistent.

// // export function ProductDetailsModal() {
// //   const { isOpen, close, product, mode, cartItem } = useProductModalStore();
// //   const addItem = useCartStore((s) => s.addItem);
// //   const updateItem = useCartStore((s) => s.updateItem);

// //   const selection = useProductSelection(product, { cartItem });

// //   const {
// //     selectedColor,
// //     setSelectedColor,
// //     selectedSize,
// //     setSelectedSize,
// //     quantity,
// //     setQuantity,
// //     imageIndex,
// //     setImageIndex,
// //     activeVariant,
// //     sizes,
// //     maxStock,
// //     canAddToCart,
// //   } = selection;

// //   // Lock body scroll
// //   useEffect(() => {
// //     if (isOpen) {
// //       document.body.style.overflow = 'hidden';
// //     } else {
// //       document.body.style.overflow = '';
// //     }
// //     return () => { document.body.style.overflow = ''; };
// //   }, [isOpen]);

// //   if (!isOpen || !product) return null;

// //   // When a color image swatch is clicked, sync imageIndex too
// //   const handleColorChange = (color: string) => {
// //     setSelectedColor(color);
// //   };

// //   const handleAddToCart = () => {
// //     const itemId = `${product.id}-${selectedColor}-${selectedSize}`;
// //     const payload = {
// //       id: itemId,
// //       productId: product.id,
// //       productName: product.name,
// //       image: activeVariant?.images?.[0] ?? product.image,
// //       price: product.price,
// //       quantity,
// //       color: selectedColor,
// //       size: product.hasSizes ? selectedSize : undefined,
// //     };

// //     if (mode === 'edit' && cartItem) {
// //       updateItem(cartItem.id, payload);
// //     } else {
// //       addItem(payload);
// //     }
// //     close();
// //   };

// //   return (
// //     /* Overlay */
// //     <div
// //       className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto px-4 py-6"
// //       onClick={close}
// //     >
// //       <div className="flex min-h-full items-start sm:items-center justify-center">
// //         {/* Modal panel */}
// //         <div
// //           className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
// //           onClick={(e) => e.stopPropagation()}
// //         >
// //           {/* Close button */}
// //           <button
// //             onClick={close}
// //             className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors font-bold text-lg"
// //             aria-label="Close"
// //           >
// //             ✕
// //           </button>

// //           {/* ── Content grid ─────────────────────────────────────────────── */}
// //           <div className="flex flex-col sm:flex-row">
// //             {/* LEFT: image gallery */}
// //             <div className="sm:w-[55%] p-5 bg-gray-50">
// //               <ProductImageGallery
// //                 variant={activeVariant}
// //                 imageIndex={imageIndex}
// //                 onChangeIndex={setImageIndex}
// //                 showThumbnails={true}
// //               />
// //             </div>

// //             {/* RIGHT: product info + selectors */}
// //             <div className="sm:w-[45%] p-5 flex flex-col gap-4 overflow-y-auto max-h-[85vh]">
// //               {/* Category badge */}
// //               <span className="inline-flex w-fit bg-primary-100 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full">
// //                 {product.category}
// //               </span>

// //               {/* Name */}
// //               <h2 className="text-xl font-bold text-gray-900 leading-snug">
// //                 {product.name}
// //               </h2>

// //               {/* Description */}
// //               {product.description && (
// //                 <p className="text-sm text-gray-500 leading-relaxed">
// //                   {product.description}
// //                 </p>
// //               )}

// //               {/* Price */}
// //               <p className="text-2xl font-bold text-gray-900">
// //                 ₦{product.price.toLocaleString()}
// //               </p>

// //               {/* Support note */}
// //               {product.supportNote && (
// //                 <p className="text-xs text-gray-400 italic">
// //                   {product.supportNote}
// //                 </p>
// //               )}

// //               <hr className="border-gray-100" />

// //               {/* Color selector */}
// //               <ProductColorSelector
// //                 variants={product.variants}
// //                 selected={selectedColor}
// //                 onChange={handleColorChange}
// //               />

// //               {/* Size selector — only for products with sizes */}
// //               {product.hasSizes && (
// //                 <ProductSizeSelector
// //                   sizes={sizes}
// //                   selected={selectedSize}
// //                   onChange={setSelectedSize}
// //                 />
// //               )}

// //               {/* Quantity */}
// //               <ProductQuantitySelector
// //                 value={quantity}
// //                 max={maxStock}
// //                 onChange={setQuantity}
// //               />

// //               {/* Add to Cart CTA */}
// //               <button
// //                 onClick={handleAddToCart}
// //                 disabled={!canAddToCart}
// //                 className="mt-auto w-full py-3 rounded-full bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
// //               >
// //                 {mode === 'edit' ? 'Update Cart' : 'Add to Cart'}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }










// import { useEffect, useRef, useCallback } from 'react';
// import { ChevronLeft, ChevronRight, X } from 'lucide-react';
// import { useCartStore } from '../stores/useCartStore';
// import { useProductModalStore } from '../stores/useProductModalStore';
// import { useProductSelection } from '../hooks/useProductSelection';
// import { ProductColorSelector } from './ProductColorSelector';
// import { ProductSizeSelector } from './ProductSizeSelector';
// import { ProductQuantitySelector } from './ProductQuantitySelector';

// // ─── Carousel (horizontal, with left/right arrows) ───────────────────────────
// interface CarouselProps {
//   images: string[];
//   activeIndex: number;
//   onSelect: (index: number) => void;
// }

// function ImageCarousel({ images, activeIndex, onSelect }: CarouselProps) {
//   const trackRef = useRef<HTMLDivElement>(null);
//   const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

//   // Scroll active item into view whenever activeIndex changes
//   useEffect(() => {
//     const el = itemRefs.current[activeIndex];
//     if (el && trackRef.current) {
//       const track = trackRef.current;
//       const elLeft = el.offsetLeft;
//       const elWidth = el.offsetWidth;
//       const trackWidth = track.offsetWidth;
//       const scrollTarget = elLeft - trackWidth / 2 + elWidth / 2;
//       track.scrollTo({ left: scrollTarget, behavior: 'smooth' });
//     }
//   }, [activeIndex]);

//   const scrollBy = (dir: 'left' | 'right') => {
//     if (!trackRef.current) return;
//     trackRef.current.scrollBy({ left: dir === 'left' ? -160 : 160, behavior: 'smooth' });
//   };

//   if (images.length === 0) return null;

//   return (
//     <div className="relative flex items-center gap-1 px-1">
//       {/* Left arrow */}
//       <button
//         onClick={() => scrollBy('left')}
//         className="shrink-0 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
//         aria-label="Scroll left"
//       >
//         <ChevronLeft size={14} className="text-gray-600" />
//       </button>

//       {/* Scrollable track */}
//       <div
//         ref={trackRef}
//         className="flex gap-2 overflow-x-auto scroll-smooth flex-1"
//         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//       >
//         {images.map((img, i) => (
//           <button
//             key={i}
//             ref={(el) => { itemRefs.current[i] = el; }}
//             onClick={() => onSelect(i)}
//             className={`shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all ${
//               i === activeIndex
//                 ? 'border-primary-500 opacity-100'
//                 : 'border-gray-200 opacity-60 hover:opacity-90 hover:border-gray-300'
//             }`}
//           >
//             <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
//           </button>
//         ))}
//       </div>

//       {/* Right arrow */}
//       <button
//         onClick={() => scrollBy('right')}
//         className="shrink-0 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
//         aria-label="Scroll right"
//       >
//         <ChevronRight size={14} className="text-gray-600" />
//       </button>
//     </div>
//   );
// }

// // ─── Main modal ───────────────────────────────────────────────────────────────
// export function ProductDetailsModal() {
//   const { isOpen, close, product, mode, cartItem } = useProductModalStore();
//   const { addItem, updateItem, items: cartItems } = useCartStore();

//   const {
//     selectedColor,
//     setSelectedColor,
//     selectedSize,
//     setSelectedSize,
//     quantity,
//     setQuantity,
//     imageIndex,
//     setImageIndex,
//     activeVariant,
//     sizes,
//     maxStock,
//     canAddToCart,
//     allImages,
//     variantImageStartIndex,
//   } = useProductSelection(product, { cartItem, allCartItems: cartItems });

//   // Lock body scroll
//   useEffect(() => {
//     document.body.style.overflow = isOpen ? 'hidden' : '';
//     return () => { document.body.style.overflow = ''; };
//   }, [isOpen]);

//   // When colour swatch is clicked: update colour + jump carousel to that
//   // variant's first image (which starts at variantImageStartIndex for the
//   // currently active variant — but we need the NEW variant's start, so we
//   // compute it from the product data directly)
//   const handleColorChange = useCallback((color: string) => {
//     setSelectedColor(color); // resets imageIndex to 0 internally
//     if (!product) return;
//     const generalCount = product.generalImages?.length ?? 0;
//     // Find the position of this colour's first image in allImages
//     // allImages = generalImages + activeVariant.images (after setSelectedColor)
//     // For now, jump to start of variant images (generalCount)
//     setImageIndex(generalCount);
//   }, [product, setSelectedColor, setImageIndex]);

//   const handleAddToCart = () => {
//     if (!product) return;
//     const itemId = `${product.id}-${selectedColor}-${selectedSize}`;
//     const payload = {
//       id: itemId,
//       productId: product.id,
//       productName: product.name,
//       image: activeVariant?.images?.[0] ?? product.image,
//       price: product.price,
//       quantity,
//       color: selectedColor,
//       size: product.hasSizes ? selectedSize : undefined,
//     };

//     if (mode === 'edit' && cartItem) {
//       // If id changed (different variant selected), remove old and add new
//       if (cartItem.id !== itemId) {
//         updateItem(cartItem.id, payload);
//       } else {
//         updateItem(cartItem.id, { quantity });
//       }
//     } else {
//       addItem(payload, maxStock);
//     }
//     close();
//   };

//   if (!isOpen || !product) return null;

//   const mainImage = allImages[imageIndex] ?? allImages[0] ?? product.image;

//   return (
//     <div
//       className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto"
//       onClick={close}
//     >
//       <div className="flex min-h-full items-start sm:items-center justify-center p-4">
//         {/* Panel */}
//         <div
//           className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Close */}
//           <button
//             onClick={close}
//             className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
//             aria-label="Close"
//           >
//             <X size={18} />
//           </button>

//           {/* ── TOP: Carousel (full width, above the two-column split) ──── */}
//           {allImages.length > 0 && (
//             <div className="px-4 pt-5 pb-3 border-b border-gray-100">
//               <ImageCarousel
//                 images={allImages}
//                 activeIndex={imageIndex}
//                 onSelect={setImageIndex}
//               />
//             </div>
//           )}

//           {/* ── BOTTOM: two-column layout ─────────────────────────────── */}
//           <div className="flex flex-col sm:flex-row">
//             {/* LEFT: main preview (A) */}
//             <div className="sm:w-[48%] p-5 bg-gray-50 flex items-center justify-center min-h-[260px]">
//               <img
//                 src={mainImage}
//                 alt={product.name}
//                 className="w-full max-h-[320px] object-contain rounded-xl"
//               />
//             </div>

//             {/* RIGHT: info + selectors */}
//             <div className="sm:w-[52%] p-5 flex flex-col gap-3 overflow-y-auto max-h-[70vh] sm:max-h-[80vh]">
//               {/* Category */}
//               <span className="inline-flex w-fit bg-primary-100 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full">
//                 {product.category}
//               </span>

//               {/* Name */}
//               <h2 className="text-xl font-bold text-gray-900 leading-snug">
//                 {product.name}
//               </h2>

//               {/* Description */}
//               {product.description && (
//                 <p className="text-sm text-gray-500 leading-relaxed">
//                   {product.description}
//                 </p>
//               )}

//               {/* Price */}
//               <p className="text-2xl font-bold text-gray-900">
//                 ₦{product.price.toLocaleString()}
//               </p>

//               {/* Support note */}
//               {product.supportNote && (
//                 <p className="text-xs text-gray-400 italic leading-relaxed">
//                   {product.supportNote}
//                 </p>
//               )}

//               <hr className="border-gray-100" />

//               {/* Colour selector (B) — clicking a swatch scrolls carousel */}
//               <ProductColorSelector
//                 variants={product.variants}
//                 selected={selectedColor}
//                 onChange={handleColorChange}
//               />

//               {/* Size selector */}
//               {product.hasSizes && (
//                 <ProductSizeSelector
//                   sizes={sizes}
//                   selected={selectedSize}
//                   onChange={setSelectedSize}
//                 />
//               )}

//               {/* Quantity */}
//               <ProductQuantitySelector
//                 value={quantity}
//                 max={maxStock}
//                 onChange={setQuantity}
//               />

//               {/* CTA */}
//               <button
//                 onClick={handleAddToCart}
//                 disabled={!canAddToCart}
//                 className="mt-auto w-full py-3 rounded-full bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {mode === 'edit' ? 'Update Cart' : 'Add to Cart'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }










import { useEffect, useRef, useCallback } from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { useProductModalStore } from '../stores/useProductModalStore';
import { useProductSelection } from '../hooks/useProductSelection';
import { ProductColorSelector } from './ProductColorSelector';
import { ProductSizeSelector } from './ProductSizeSelector';
import { ProductQuantitySelector } from './ProductQuantitySelector';

// ─── Vertical thumbnail strip with up/down arrows ────────────────────────────
interface VerticalStripProps {
  images: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

function VerticalStrip({ images, activeIndex, onSelect }: VerticalStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Scroll active thumbnail into view whenever it changes
  useEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (el && trackRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeIndex]);

  const scrollBy = (dir: 'up' | 'down') => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({
      top: dir === 'up' ? -90 : 90,
      behavior: 'smooth',
    });
  };

  if (images.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-1 w-[80px] shrink-0">
      {/* Up arrow */}
      <button
        onClick={() => scrollBy('up')}
        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors shrink-0"
        aria-label="Scroll up"
      >
        <ChevronUp size={18} />
      </button>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex flex-col gap-2 overflow-y-auto flex-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          maxHeight: '320px',
        }}
      >
        {images.map((img, i) => (
          <button
            key={i}
            ref={(el) => { itemRefs.current[i] = el; }}
            onClick={() => onSelect(i)}
            className={`w-[72px] h-[72px] shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
              i === activeIndex
                ? 'border-primary-500 opacity-100'
                : 'border-gray-200 opacity-60 hover:opacity-90'
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Down arrow */}
      <button
        onClick={() => scrollBy('down')}
        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors shrink-0"
        aria-label="Scroll down"
      >
        <ChevronDown size={18} />
      </button>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export function ProductDetailsModal() {
  const { isOpen, close, product, mode, cartItem } = useProductModalStore();
  const { addItem, updateItem, items: cartItems } = useCartStore();

  const {
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    quantity,
    setQuantity,
    imageIndex,
    setImageIndex,
    activeVariant,
    sizes,
    maxStock,
    canAddToCart,
    allImages,
    variantImageStartIndex,
  } = useProductSelection(product, { cartItem, allCartItems: cartItems });

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // When colour swatch clicked: jump imageIndex to start of that variant's images
  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color);
    if (!product) return;
    const generalCount = product.generalImages?.length ?? 0;
    // generalImages come first, then variant images — jump to first variant image
    setImageIndex(generalCount);
  }, [product, setSelectedColor, setImageIndex]);

  const handleAddToCart = () => {
    if (!product) return;
    const itemId = `${product.id}-${selectedColor}-${selectedSize}`;
    const payload = {
      id: itemId,
      productId: product.id,
      productName: product.name,
      image: activeVariant?.images?.[0] ?? product.image,
      price: product.price,
      quantity,
      color: selectedColor,
      size: product.hasSizes ? selectedSize : undefined,
    };

    if (mode === 'edit' && cartItem) {
      updateItem(cartItem.id, payload);
    } else {
      // maxStock = raw stock - already carted. The real ceiling is raw stock itself.
      // Find how many of this combo are already in cart to compute raw stock.
      const alreadyCarted = cartItems
        .filter((i) => i.id === itemId)
        .reduce((s, i) => s + i.quantity, 0);
      addItem(payload, maxStock + alreadyCarted);
    }
    close();
  };

  if (!isOpen || !product) return null;

  const mainImage = allImages[imageIndex] ?? allImages[0] ?? product.image;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={close}
    >
      <div className="flex min-h-full items-start sm:items-center justify-center p-4">
        {/* Panel */}
        <div
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button — top right corner */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* ── TOP SECTION: thumbnail strip + main image + product info ── */}
          <div className="flex flex-col sm:flex-row p-5 gap-5">

            {/* Column 1: vertical thumbnail strip */}
            <VerticalStrip
              images={allImages}
              activeIndex={imageIndex}
              onSelect={setImageIndex}
            />

            {/* Column 2: main preview image (A) */}
            <div className="flex-1 min-w-0 flex items-center justify-center bg-gray-50 rounded-xl min-h-[260px] sm:min-h-[320px]">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full max-h-[320px] object-contain rounded-xl p-2"
              />
            </div>

            {/* Column 3: product info (right side) */}
            <div className="sm:w-[42%] shrink-0 flex flex-col gap-3">
              {/* Category badge */}
              <span className="inline-flex w-fit bg-primary-100 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full">
                {product.category}
              </span>

              {/* Name */}
              <h2 className="text-xl font-bold text-gray-900 leading-snug">
                {product.name}
              </h2>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-gray-500 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Price */}
              <p className="text-2xl font-bold text-gray-900">
                ₦{product.price.toLocaleString()}
              </p>

              {/* Support note */}
              {product.supportNote && (
                <p className="text-xs text-gray-400 italic leading-relaxed">
                  {product.supportNote}
                </p>
              )}
            </div>
          </div>

          {/* ── DIVIDER ───────────────────────────────────────────────────── */}
          <hr className="border-gray-100 mx-5" />

          {/* ── BOTTOM SECTION: colour, size, quantity, CTA ───────────────── */}
          <div className="p-5 flex flex-col gap-4">
            {/* Colour selector (B) */}
            <ProductColorSelector
              variants={product.variants}
              selected={selectedColor}
              onChange={handleColorChange}
            />

            {/* Size selector */}
            {product.hasSizes && (
              <ProductSizeSelector
                sizes={sizes}
                selected={selectedSize}
                onChange={setSelectedSize}
              />
            )}

            {/* Quantity */}
            <ProductQuantitySelector
              value={quantity}
              max={maxStock}
              onChange={setQuantity}
            />

            {/* CTA */}
            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className="w-full py-3.5 rounded-full bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === 'edit' ? 'Update Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}