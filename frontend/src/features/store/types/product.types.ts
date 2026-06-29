// // // export interface ProductSize {
// // //   size: string;
// // //   stock: number;
// // // }

// // // export interface ProductVariant {
// // //   color: string;
// // //   images: string[];
// // //   sizes: ProductSize[];
// // // }

// // // export interface Product {
// // //   id: string;
// // //   name: string;
// // //   category: string;
// // //   price: number;

// // //   image: string; // default/fallback image (for cards)
// // //   description?: string;

// // //   hasSizes: boolean;

// // //   variants: ProductVariant[];
// // // }




// // // ─── Size entry per variant ───────────────────────────────────────────────────
// // export interface ProductSize {
// //   size: string;
// //   stock: number;
// // }

// // // ─── One colour variant, with its own images + sizes ─────────────────────────
// // export interface ProductVariant {
// //   color: string;
// //   /** hex or CSS colour for the swatch circle, e.g. '#FFFFFF' */
// //   colorHex?: string;
// //   images: string[];
// //   sizes: ProductSize[];
// // }

// // // ─── Top-level product ────────────────────────────────────────────────────────
// // export interface Product {
// //   id: string;
// //   name: string;
// //   category: string;
// //   price: number;
// //   /** Thumbnail shown on the store grid – taken from the first variant image */
// //   image: string;
// //   description?: string;
// //   supportNote?: string;
// //   /** If false, size selector is hidden and each variant has a single "One Size" entry */
// //   hasSizes: boolean;
// //   variants: ProductVariant[];
// // }







// export interface ProductSize {
//   size: string;
//   stock: number;
// }

// export interface ProductVariant {
//   color: string;
//   colorHex?: string;
//   /** Images specific to this colour variant */
//   images: string[];
//   sizes: ProductSize[];
// }

// export interface Product {
//   id: string;
//   name: string;
//   category: string;
//   price: number;
//   /** Default thumbnail for the store grid card */
//   image: string;
//   description?: string;
//   supportNote?: string;
//   /**
//    * General/overview images uploaded by admin (shown first in carousel).
//    * Colour-variant images are appended after these.
//    */
//   generalImages?: string[];
//   hasSizes: boolean;
//   variants: ProductVariant[];
// }











// ─── API response shape (exactly what the backend sends) ─────────────────────

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

// ─── Internal shape consumed by all components ────────────────────────────────

export interface ProductSize {
  size: string;
  stock: number;
}

export interface ProductVariant {
  color: string;
  colorHex?: string;
  /** The image URL tied to this colour */
  image: string;
  sizes: ProductSize[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  /** Spotlight image — used on the store grid card */
  image: string;
  description?: string;
  supportNote?: string;
  /** Non-spotlight images shown in the carousel alongside variant images */
  generalImages: string[];
  hasSizes: boolean;
  hasColors: boolean;
  variants: ProductVariant[];
  totalStock: number;
  status: 'active' | 'inactive';
}