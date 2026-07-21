// import { useEffect, useMemo, useState } from 'react';
// import type { Product, ProductVariant, ProductSize } from '../types/product.types';
// import type { CartItem } from '../types/cart.types';

// interface UseProductSelectionOptions {
//   cartItem?: CartItem | null;
//   allCartItems?: CartItem[];
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
//   /** Raw stock from inventory — used for "Only N left" display, not affected by cart */
//   rawStock: number;
//   /** maxStock = rawStock - already carted (what user can still add) */
//   maxStock: number;
//   canAddToCart: boolean;
//   allImages: string[];
//   variantImageStartIndex: number;
// }

// export function useProductSelection(
//   product: Product | null,
//   options: UseProductSelectionOptions = {},
// ): ProductSelectionState {
//   const { cartItem, allCartItems = [] } = options;

//   const [selectedColor, setSelectedColorRaw] = useState('');
//   const [selectedSize, setSelectedSize] = useState('');
//   const [quantity, setQuantityRaw] = useState(1);
//   const [imageIndex, setImageIndex] = useState(0);

//   useEffect(() => {
//     if (!product) return;
//     const firstVariant = product.variants[0];
//     if (cartItem) {
//       setSelectedColorRaw(cartItem.color ?? firstVariant?.color ?? '');
//       setSelectedSize(cartItem.size ?? firstVariant?.sizes[0]?.size ?? '');
//       setQuantityRaw(cartItem.quantity ?? 1);
//     } else {
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

//   const activeVariant = useMemo(() => {
//     if (!product) return undefined;
//     return product.variants.find((v) => v.color === selectedColor) ?? product.variants[0];
//   }, [product, selectedColor]);

//   const sizes = activeVariant?.sizes ?? [];

//   const generalImages = product?.generalImages ?? [];
//   const variantImageStartIndex = generalImages.length;
//   const allImages = useMemo(() => {
//     return [...generalImages, ...(activeVariant?.images ?? [])];
//   }, [generalImages, activeVariant]);

//   // Raw stock from inventory only — not affected by cart state
//   const rawStock = useMemo(() => {
//     if (!product) return 0;
//     if (!product.hasSizes) return activeVariant?.sizes[0]?.stock ?? 0;
//     return sizes.find((s) => s.size === selectedSize)?.stock ?? 0;
//   }, [product, activeVariant, sizes, selectedSize]);

//   // How many of this exact combo are already in cart (excluding the item being edited)
//   const cartedQty = useMemo(() => {
//     if (!product) return 0;
//     const comboId = `${product.id}-${selectedColor}-${selectedSize}`;
//     return allCartItems
//       .filter((i) => i.id === comboId && i.id !== cartItem?.id)
//       .reduce((s, i) => s + i.quantity, 0);
//   }, [product, selectedColor, selectedSize, allCartItems, cartItem]);

//   // What the user can still add = raw stock minus what's already locked in cart
//   const maxStock = Math.max(0, rawStock - cartedQty);

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

//   // Clamp quantity when maxStock drops below current qty
//   useEffect(() => {
//     if (maxStock > 0 && quantity > maxStock) {
//       setQuantityRaw(1);
//     }
//   }, [maxStock, quantity]);

//   const setQuantity = (qty: number) => {
//     setQuantityRaw(Math.max(1, Math.min(qty, maxStock || 99)));
//   };

//   const canAddToCart = maxStock > 0 && (product?.hasSizes ? selectedSize !== '' : true);

//   return {
//     selectedColor, setSelectedColor,
//     selectedSize, setSelectedSize,
//     quantity, setQuantity,
//     imageIndex, setImageIndex,
//     activeVariant, sizes,
//     rawStock,
//     maxStock,
//     canAddToCart,
//     allImages,
//     variantImageStartIndex,
//   };
// }





import { useEffect, useMemo, useState } from 'react';
import type { Product, ProductVariant, ProductSize } from '../types/product.types';
import type { CartItem } from '../types/cart.types';

interface UseProductSelectionOptions {
  cartItem?: CartItem | null;
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
  rawStock: number;
  maxStock: number;
  canAddToCart: boolean;
  /** generalImages + active variant image, deduplicated */
  allImages: string[];
  /** Index where the variant image starts in allImages */
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

  // ── Reset on product/cartItem change ──────────────────────────────────────
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

  // ── Active variant ─────────────────────────────────────────────────────────
  const activeVariant = useMemo(() => {
    if (!product) return undefined;
    return product.variants.find((v) => v.color === selectedColor) ?? product.variants[0];
  }, [product, selectedColor]);

  const sizes = activeVariant?.sizes ?? [];

  // ── All images: generalImages first, then the active variant's single image ─
  // Deduplicate in case the variant image is already in generalImages
  const generalImages = product?.generalImages ?? [];
  const variantImageStartIndex = generalImages.length;

  const allImages = useMemo(() => {
    const variantImage = activeVariant?.image;
    if (!variantImage || generalImages.includes(variantImage)) {
      return generalImages;
    }
    return [...generalImages, variantImage];
  }, [generalImages, activeVariant]);

  // ── Stock ──────────────────────────────────────────────────────────────────
  const rawStock = useMemo(() => {
    if (!product) return 0;
    if (!product.hasSizes) return activeVariant?.sizes[0]?.stock ?? 0;
    return sizes.find((s) => s.size === selectedSize)?.stock ?? 0;
  }, [product, activeVariant, sizes, selectedSize]);

  const cartedQty = useMemo(() => {
    if (!product) return 0;
    const comboId = `${product.id}-${selectedColor}-${selectedSize}`;
    return allCartItems
      .filter((i) => i.id === comboId && i.id !== cartItem?.id)
      .reduce((s, i) => s + i.quantity, 0);
  }, [product, selectedColor, selectedSize, allCartItems, cartItem]);

  const maxStock = Math.max(0, rawStock - cartedQty);

  // ── Colour change: reset size + imageIndex ─────────────────────────────────
  const setSelectedColor = (color: string) => {
    setSelectedColorRaw(color);
    if (!product) return;
    const variant = product.variants.find((v) => v.color === color);
    if (product.hasSizes && variant) {
      const firstInStock = variant.sizes.find((s) => s.stock > 0);
      setSelectedSize(firstInStock?.size ?? variant.sizes[0]?.size ?? '');
    }
    // Jump to the variant image (after general images)
    const generalCount = product.generalImages?.length ?? 0;
    setImageIndex(generalCount);
  };

  // ── Clamp quantity when maxStock drops ────────────────────────────────────
  useEffect(() => {
    if (maxStock > 0 && quantity > maxStock) {
      setQuantityRaw(1);
    }
  }, [maxStock, quantity]);

  const setQuantity = (qty: number) => {
    setQuantityRaw(Math.max(1, Math.min(qty, maxStock || 99)));
  };

  const canAddToCart =
    maxStock > 0 && (product?.hasSizes ? selectedSize !== '' : true);

  return {
    selectedColor, setSelectedColor,
    selectedSize, setSelectedSize,
    quantity, setQuantity,
    imageIndex, setImageIndex,
    activeVariant, sizes,
    rawStock, maxStock,
    canAddToCart,
    allImages,
    variantImageStartIndex,
  };
}