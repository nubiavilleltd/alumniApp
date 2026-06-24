// // export interface ProductSize {
// //   size: string;
// //   stock: number;
// // }

// // export interface ProductVariant {
// //   color: string;
// //   images: string[];
// //   sizes: ProductSize[];
// // }

// // export interface Product {
// //   id: string;
// //   name: string;
// //   category: string;
// //   price: number;

// //   image: string; // default/fallback image (for cards)
// //   description?: string;

// //   hasSizes: boolean;

// //   variants: ProductVariant[];
// // }




// // ─── Size entry per variant ───────────────────────────────────────────────────
// export interface ProductSize {
//   size: string;
//   stock: number;
// }

// // ─── One colour variant, with its own images + sizes ─────────────────────────
// export interface ProductVariant {
//   color: string;
//   /** hex or CSS colour for the swatch circle, e.g. '#FFFFFF' */
//   colorHex?: string;
//   images: string[];
//   sizes: ProductSize[];
// }

// // ─── Top-level product ────────────────────────────────────────────────────────
// export interface Product {
//   id: string;
//   name: string;
//   category: string;
//   price: number;
//   /** Thumbnail shown on the store grid – taken from the first variant image */
//   image: string;
//   description?: string;
//   supportNote?: string;
//   /** If false, size selector is hidden and each variant has a single "One Size" entry */
//   hasSizes: boolean;
//   variants: ProductVariant[];
// }







export interface ProductSize {
  size: string;
  stock: number;
}

export interface ProductVariant {
  color: string;
  colorHex?: string;
  /** Images specific to this colour variant */
  images: string[];
  sizes: ProductSize[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  /** Default thumbnail for the store grid card */
  image: string;
  description?: string;
  supportNote?: string;
  /**
   * General/overview images uploaded by admin (shown first in carousel).
   * Colour-variant images are appended after these.
   */
  generalImages?: string[];
  hasSizes: boolean;
  variants: ProductVariant[];
}