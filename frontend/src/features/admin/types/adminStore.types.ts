// ─── API response types ───────────────────────────────────────────────────────

import { ApiProductMeta } from "@/features/store/types/product.types";

export interface AdminProductImage {
  id: string;
  image_path: string;
  is_spotlight: boolean;
  image_url: string;
}

export interface AdminProductVariant {
  id: string;
  color: string | null;
  size: string | null;
  quantity: string;
  image_id: string | null;
}



export interface AdminApiProduct {
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
  images: AdminProductImage[];
  variants: AdminProductVariant[];
  total_stock: number;
  pin_item:boolean;
  meta:ApiProductMeta
}

// ─── Local form state ─────────────────────────────────────────────────────────

export interface ColourEntry {
  /** Display name e.g. "Black" */
  colorName: string;
  /** blob: URL (new upload) or https: URL (existing) */
  imageUrl: string;
  /** Set when image already exists in DB (edit mode) */
  existingImageId?: string;
  /** Set when image is a new upload — index in newImageFiles array */
  newImageIndex?: number;
}

export interface SizeEntry {
  sizeName: string;
}

export interface StockCell {
  color: string;
  size: string;
  quantity: number;
}

// ─── Images in the form ───────────────────────────────────────────────────────

/** Represents one image in the unified gallery */
export interface FormImage {
  /** Unique key for React rendering */
  key: string;
  /** Display URL (blob: or https:) */
  url: string;
  /** If this is an existing image from DB */
  existingId?: string;
  /** If this is a new file upload */
  file?: File;
  isSpotlight: boolean;
}

// ─── Variant payload ──────────────────────────────────────────────────────────

export interface VariantPayloadItem {
  color?: string;
  size?: string;
  quantity: number;
  image_id?: number;
  image_index?: number;
}

// ─── Service form data ────────────────────────────────────────────────────────

export interface CreateProductFormData {
  productName: string;
  category: string;
  price: string;
  description: string;
  hasColor: boolean;
  hasSize: boolean;
  quantity?: number;
  imageFiles: File[];
  spotlightIndex: number;
  variants: VariantPayloadItem[];
}

export interface UpdateProductFormData {
  productId: string;
  productName: string;
  category: string;
  price: string;
  description: string;
  hasColor: boolean;
  hasSize: boolean;
  quantity?: number;
  newImageFiles: File[];
  deleteImageIds: string[];
  spotlightImageId?: string;
  spotlightIndex?: number;
  variants: VariantPayloadItem[];
}

export interface PinProductPayload {
  productId: string | null;
  pinItem:boolean;
}