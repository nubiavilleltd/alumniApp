export interface ProductSize {
  size: string;
  stock: number;
}

export interface ProductVariant {
  color: string;
  images: string[];
  sizes: ProductSize[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;

  image: string; // default/fallback image (for cards)
  description?: string;

  hasSizes: boolean;

  variants: ProductVariant[];
}