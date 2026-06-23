import { useEffect, useMemo, useState } from 'react';
import type { Product } from '../types/product.types';

export function useProductSelection(product: Product | null) {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);

  const variants = product?.variants ?? [];

  useEffect(() => {
    if (!product) return;

    setSelectedColor(product.variants[0]?.color ?? '');
    setSelectedSize('');
    setQuantity(1);
    setImageIndex(0);
  }, [product]);

  const activeVariant = useMemo(
    () => variants.find(v => v.color === selectedColor) ?? variants[0],
    [selectedColor, variants],
  );

  const sizes = activeVariant?.sizes ?? [];

  const maxStock = useMemo(() => {
    const found = sizes.find(s => s.size === selectedSize);
    return found?.stock ?? 0;
  }, [sizes, selectedSize]);

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
  };
}