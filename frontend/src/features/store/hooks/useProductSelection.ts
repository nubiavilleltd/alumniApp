// // import { useEffect, useMemo, useState } from 'react';
// // import type { Product } from '../types/product.types';

// // export function useProductSelection(product: Product | null) {
// //   const [selectedColor, setSelectedColor] = useState('');
// //   const [selectedSize, setSelectedSize] = useState('');
// //   const [quantity, setQuantity] = useState(1);
// //   const [imageIndex, setImageIndex] = useState(0);

// //   const variants = product?.variants ?? [];

// //   useEffect(() => {
// //     if (!product) return;

// //     setSelectedColor(product.variants[0]?.color ?? '');
// //     setSelectedSize('');
// //     setQuantity(1);
// //     setImageIndex(0);
// //   }, [product]);

// //   const activeVariant = useMemo(
// //     () => variants.find(v => v.color === selectedColor) ?? variants[0],
// //     [selectedColor, variants],
// //   );

// //   const sizes = activeVariant?.sizes ?? [];

// //   const maxStock = useMemo(() => {
// //     const found = sizes.find(s => s.size === selectedSize);
// //     return found?.stock ?? 0;
// //   }, [sizes, selectedSize]);

// //   return {
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
// //   };
// // }






// import { useEffect, useMemo, useState } from 'react';
// import type { Product, ProductVariant, ProductSize } from '../types/product.types';
// import type { CartItem } from '../types/cart.types';

// interface UseProductSelectionOptions {
//   /** Pre-populate selections when opening in edit mode */
//   cartItem?: CartItem | null;
// }

// export interface ProductSelectionState {
//   selectedColor: string;
//   setSelectedColor: (color: string) => void;
//   selectedSize: string;
//   setSelectedSize: (size: string) => void;
//   quantity: number;
//   setQuantity: (qty: number) => void;
//   imageIndex: number;
//   setImageIndex: (index: number) => void;
//   activeVariant: ProductVariant | undefined;
//   sizes: ProductSize[];
//   /** Stock of the currently selected size (0 if none selected) */
//   maxStock: number;
//   /** True when a valid add-to-cart action is possible */
//   canAddToCart: boolean;
// }

// export function useProductSelection(
//   product: Product | null,
//   options: UseProductSelectionOptions = {},
// ): ProductSelectionState {
//   const { cartItem } = options;

//   const [selectedColor, setSelectedColorRaw] = useState('');
//   const [selectedSize, setSelectedSize] = useState('');
//   const [quantity, setQuantityRaw] = useState(1);
//   const [imageIndex, setImageIndex] = useState(0);

//   // ── Reset whenever product changes (or modal opens) ────────────────────────
//   useEffect(() => {
//     if (!product) return;

//     const firstVariant = product.variants[0];

//     if (cartItem) {
//       // Edit mode — restore previous selections
//       setSelectedColorRaw(cartItem.color ?? firstVariant?.color ?? '');
//       setSelectedSize(cartItem.size ?? '');
//       setQuantityRaw(cartItem.quantity ?? 1);
//     } else {
//       // Add mode — default to first colour and smallest in-stock size
//       setSelectedColorRaw(firstVariant?.color ?? '');

//       if (product.hasSizes) {
//         const firstInStock = firstVariant?.sizes.find((s) => s.stock > 0);
//         setSelectedSize(firstInStock?.size ?? firstVariant?.sizes[0]?.size ?? '');
//       } else {
//         setSelectedSize(firstVariant?.sizes[0]?.size ?? 'One Size');
//       }

//       setQuantityRaw(1);
//     }

//     setImageIndex(0);
//   }, [product, cartItem]);

//   // ── When colour changes, update image index and reset size to first in-stock ─
//   const setSelectedColor = (color: string) => {
//     setSelectedColorRaw(color);
//     setImageIndex(0);

//     if (!product) return;
//     const variant = product.variants.find((v) => v.color === color);
//     if (product.hasSizes && variant) {
//       const firstInStock = variant.sizes.find((s) => s.stock > 0);
//       setSelectedSize(firstInStock?.size ?? variant.sizes[0]?.size ?? '');
//     }
//   };

//   // ── Derived ────────────────────────────────────────────────────────────────
//   const activeVariant = useMemo(() => {
//     if (!product) return undefined;
//     return product.variants.find((v) => v.color === selectedColor) ?? product.variants[0];
//   }, [product, selectedColor]);

//   const sizes = activeVariant?.sizes ?? [];

//   const maxStock = useMemo(() => {
//     if (!product) return 0;
//     if (!product.hasSizes) {
//       return activeVariant?.sizes[0]?.stock ?? 0;
//     }
//     return sizes.find((s) => s.size === selectedSize)?.stock ?? 0;
//   }, [product, activeVariant, sizes, selectedSize]);

//   const setQuantity = (qty: number) => {
//     const clamped = Math.max(1, Math.min(qty, maxStock || 99));
//     setQuantityRaw(clamped);
//   };

//   const canAddToCart =
//     maxStock > 0 && (product?.hasSizes ? selectedSize !== '' : true);

//   return {
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
//   };
// }









import { useEffect, useMemo, useState } from 'react';
import type { Product, ProductVariant, ProductSize } from '../types/product.types';
import type { CartItem } from '../types/cart.types';

interface UseProductSelectionOptions {
  cartItem?: CartItem | null;
  /** Cart items used to compute remaining stock (subtract already-carted qty) */
  allCartItems?: CartItem[];
}

export interface ProductSelectionState {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  imageIndex: number;
  setImageIndex: (index: number) => void;
  activeVariant: ProductVariant | undefined;
  sizes: ProductSize[];
  /** Remaining stock minus what's already in cart for this combo */
  maxStock: number;
  canAddToCart: boolean;
  /** All images: generalImages first, then active variant images */
  allImages: string[];
  /** Index in allImages where the active variant's images start */
  variantImageStartIndex: number;
}

export function useProductSelection(
  product: Product | null,
  options: UseProductSelectionOptions = {},
): ProductSelectionState {
  const { cartItem, allCartItems = [] } = options;

  const [selectedColor, setSelectedColorRaw] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantityRaw] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);

  // ── Reset when product/cartItem changes ────────────────────────────────────
  useEffect(() => {
    if (!product) return;
    const firstVariant = product.variants[0];

    if (cartItem) {
      setSelectedColorRaw(cartItem.color ?? firstVariant?.color ?? '');
      setSelectedSize(cartItem.size ?? firstVariant?.sizes[0]?.size ?? '');
      setQuantityRaw(cartItem.quantity ?? 1);
    } else {
      setSelectedColorRaw(firstVariant?.color ?? '');
      if (product.hasSizes) {
        const firstInStock = firstVariant?.sizes.find((s) => s.stock > 0);
        setSelectedSize(firstInStock?.size ?? firstVariant?.sizes[0]?.size ?? '');
      } else {
        setSelectedSize(firstVariant?.sizes[0]?.size ?? 'One Size');
      }
      setQuantityRaw(1);
    }
    setImageIndex(0);
  }, [product, cartItem]);

  // ── Derived: active variant ────────────────────────────────────────────────
  const activeVariant = useMemo(() => {
    if (!product) return undefined;
    return product.variants.find((v) => v.color === selectedColor) ?? product.variants[0];
  }, [product, selectedColor]);

  const sizes = activeVariant?.sizes ?? [];

  // ── All images: general first, then variant-specific ──────────────────────
  const generalImages = product?.generalImages ?? [];
  const variantImageStartIndex = generalImages.length;
  const allImages = useMemo(() => {
    return [...generalImages, ...(activeVariant?.images ?? [])];
  }, [generalImages, activeVariant]);

  // ── Max stock: raw stock minus already-carted quantity ─────────────────────
  const rawStock = useMemo(() => {
    if (!product) return 0;
    if (!product.hasSizes) return activeVariant?.sizes[0]?.stock ?? 0;
    return sizes.find((s) => s.size === selectedSize)?.stock ?? 0;
  }, [product, activeVariant, sizes, selectedSize]);

  const cartedQty = useMemo(() => {
    if (!product) return 0;
    const comboId = `${product.id}-${selectedColor}-${selectedSize}`;
    // In edit mode, exclude the item being edited from the carted count
    return allCartItems
      .filter((i) => i.id === comboId && i.id !== cartItem?.id)
      .reduce((s, i) => s + i.quantity, 0);
  }, [product, selectedColor, selectedSize, allCartItems, cartItem]);

  const maxStock = Math.max(0, rawStock - cartedQty);

  // ── Colour change: reset size + clamp quantity ─────────────────────────────
  const setSelectedColor = (color: string) => {
    setSelectedColorRaw(color);
    setImageIndex(0);
    if (!product) return;
    const variant = product.variants.find((v) => v.color === color);
    if (product.hasSizes && variant) {
      const firstInStock = variant.sizes.find((s) => s.stock > 0);
      setSelectedSize(firstInStock?.size ?? variant.sizes[0]?.size ?? '');
    }
    // Quantity will be clamped via the maxStock effect below
  };

  // ── Clamp quantity whenever maxStock drops below current qty ───────────────
  useEffect(() => {
    if (maxStock > 0 && quantity > maxStock) {
      setQuantityRaw(1);
    }
  }, [maxStock, quantity]);

  const setQuantity = (qty: number) => {
    const clamped = Math.max(1, Math.min(qty, maxStock || 99));
    setQuantityRaw(clamped);
  };

  const canAddToCart =
    maxStock > 0 && (product?.hasSizes ? selectedSize !== '' : true);

  return {
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
  };
}