// // ─── API response shape (exactly what the backend sends) ─────────────────────

// export interface ApiProductImage {
//   id: string;
//   image_path: string;
//   is_spotlight: boolean;
//   image_url: string;
// }

// export interface ApiProductVariant {
//   id: string;
//   color: string | null;
//   size: string | null;
//   quantity: string;
//   image_id: string | null;
// }

// export interface ApiProduct {
//   id: string;
//   user_id: string;
//   product_name: string;
//   category: string;
//   price: string;
//   description: string;
//   has_size: boolean;
//   has_color: boolean;
//   quantity: string | null;
//   status: 'active' | 'inactive';
//   created_at: string;
//   updated_at: string;
//   images: ApiProductImage[];
//   variants: ApiProductVariant[];
//   total_stock: number;
// }

// // ─── Internal shape consumed by all components ────────────────────────────────

// export interface ProductSize {
//   size: string;
//   stock: number;
// }

// export interface ProductVariant {
//   color: string;
//   colorHex?: string;
//   /** The image URL tied to this colour */
//   image: string;
//   sizes: ProductSize[];
// }

// export interface Product {
//   id: string;
//   name: string;
//   category: string;
//   price: number;
//   /** Spotlight image — used on the store grid card */
//   image: string;
//   description?: string;
//   supportNote?: string;
//   /** Non-spotlight images shown in the carousel alongside variant images */
//   generalImages: string[];
//   hasSizes: boolean;
//   hasColors: boolean;
//   variants: ProductVariant[];
//   totalStock: number;
//   status: 'active' | 'inactive';
// }







// ─── API response shape ───────────────────────────────────────────────────────

export interface ApiProductImage {
  id: string;
  image_path: string;
  is_spotlight: boolean;
  image_url: string;
}

export interface ApiProductVariant {
  id: string;
  color: string | null;
  size: string | null;
  quantity: string;
  image_id: string | null;
}

export interface ApiProduct {
  id: string;
  user_id: string;
  product_name: string;
  category: string;
  price: string;
  description: string;
  has_size: boolean;
  has_color: boolean;
  quantity: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  images: ApiProductImage[];
  variants: ApiProductVariant[];
  total_stock: number;
}

// ─── Internal shape consumed by components ────────────────────────────────────

export interface ProductSize {
  size: string;
  stock: number;
}

export interface ProductVariant {
  /** DB variant id — sent as variant_id when adding to cart */
  variantId?: string;
  color: string;
  colorHex?: string;
  image: string;
  sizes: ProductSize[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  supportNote?: string;
  generalImages: string[];
  hasSizes: boolean;
  hasColors: boolean;
  variants: ProductVariant[];
  totalStock: number;
  status: 'active' | 'inactive';
}