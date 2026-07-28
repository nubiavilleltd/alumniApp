// // ─── API response shape (exactly what the backend sends) ─────────────────────

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

export interface ApiProductMeta {
  total_products: number;
  total_pinned: number;
  max_pinned: number;
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
  meta: ApiProductMeta;
  pin_item:boolean;
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

export interface ProductMeta {
  totalProducts: number;
  totalPinned: number;
  maxPinned: number;
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
  isPinned:boolean;
  meta:ProductMeta;
}