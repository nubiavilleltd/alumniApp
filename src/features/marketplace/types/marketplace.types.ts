// features/marketplace/types/marketplace.types.ts

// ─── Business entity ──────────────────────────────────────────────────────────
export interface Business {
  // ── Relational keys ──────────────────────────────────────────────────────
  businessId: string; // 'BIZ-{year}-{seq}' — stable unique ID
  ownerId: string; // FK → MockAuthAccount.memberId

  // ── Identity ──────────────────────────────────────────────────────────────
  slug: string;
  name: string;
  owner: string; // display name — denormalised for convenience

  // ── Details ───────────────────────────────────────────────────────────────
  category: string;
  description: string;
  location: string;
  phone: string;
  website?: string;
  images: string[];
}

// ─── Service params / payloads ────────────────────────────────────────────────
export interface GetMarketplaceParams {
  search?: string;
  category?: string;
  page?: number;
}

export interface PostBusinessPayload {
  name: string;
  category: string;
  description: string;
  location: string;
  phone: string;
  website?: string;
  images: File[];
}

export interface CreateListingFormData {
  name: string;
  category: string;
  description: string;
  location: string;
  phone: string;
  website?: string;
  images: File[];
}

export interface UpdateListingFormData extends Partial<CreateListingFormData> {
  // imageAction controls how existing images are handled on update
  imageAction?: 'add' | 'replace';
  // removeImages: array of existing image URLs to delete
  removeImages?: string[];
}
