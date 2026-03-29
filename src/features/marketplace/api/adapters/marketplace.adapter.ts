// // features/marketplace/api/adapters/marketplace.adapter.ts

// import type { Business } from '../../types/marketplace.types';

// /**
//  * ============================================================================
//  * MARKETPLACE DATA ADAPTER
//  * ============================================================================
//  *
//  * This adapter transforms the backend listing data into the frontend Business format.
//  *
//  * BACKEND (listing) → FRONTEND (business)
//  * - id → businessId
//  * - user_id → ownerId
//  * - seller_name → owner
//  * - title → name
//  * - description → description
//  * - category → category
//  * - location → location
//  * - phone → phone
//  * - website → website
//  * - images → images
//  *
//  * ============================================================================
//  */

// /**
//  * Convert a single backend listing to frontend Business type
//  */
// export function mapBackendListingToBusiness(backendData: any): Business {
//   // Handle image URLs - ensure it's always an array
//   const images = parseImages(backendData.images);

//   // Generate slug from title and id
//   const slug = generateSlug(backendData.title || 'business', backendData.id);

//   return {
//     businessId: String(backendData.id),
//     ownerId: String(backendData.user_id),
//     owner: backendData.seller_name || 'Unknown',
//     slug,
//     name: backendData.title || 'Untitled',
//     category: backendData.category || 'other',
//     description: backendData.description || '',
//     location: backendData.location || '',
//     phone: backendData.phone || '',
//     website: backendData.website || undefined,
//     images,
//   };
// }

// /**
//  * Convert array of backend listings to frontend Business array
//  */
// export function mapBackendListingList(backendList: any[]): Business[] {
//   if (!Array.isArray(backendList)) {
//     console.error('Expected array of listings, got:', typeof backendList);
//     return [];
//   }

//   return backendList
//     .map((item) => {
//       try {
//         return mapBackendListingToBusiness(item);
//       } catch (error) {
//         console.error('Failed to map listing:', item, error);
//         return null;
//       }
//     })
//     .filter((item): item is Business => item !== null);
// }

// /**
//  * Convert frontend business form data to backend create listing payload
//  * Returns FormData if images exist, otherwise returns plain object
//  */
// export function mapBusinessToCreatePayload(
//   formData: {
//     name: string;
//     category: string;
//     description: string;
//     location: string;
//     phone: string;
//     website?: string;
//     images: File[];
//   },
//   userId: string,
//   chapterId?: string,
// ): FormData | Record<string, any> {
//   // Base data that will be sent
//   const baseData: Record<string, any> = {
//     user_id: userId,
//     title: formData.name,
//     description: formData.description,
//     category: formData.category,
//     location: formData.location,
//     phone: formData.phone,
//     status: 'active',
//     year: new Date().getFullYear().toString(),
//     price: '0.00',
//     price_type: 'free',
//     business_name: formData.name,
//     is_featured: '0',
//     contact_info: formData.phone,
//   };

//   // Only add chapter_id if it exists
//   if (chapterId) {
//     baseData.chapter_id = chapterId;
//   }

//   // Only add website if it has a value
//   if (formData.website && formData.website.trim()) {
//     baseData.website = formData.website.trim();
//   }

//   // If there are images, use FormData
//   if (formData.images && formData.images.length > 0) {
//     const payload = new FormData();

//     // Append all base fields to FormData
//     Object.entries(baseData).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         payload.append(key, String(value));
//       }
//     });

//     // Append images
//     formData.images.forEach((image) => {
//       payload.append('images[]', image);
//     });

//     console.log('📦 Sending FormData with images, fields:', Array.from(payload.keys()));
//     return payload;
//   }

//   // No images - send as JSON
//   console.log('📦 Sending JSON without images:', baseData);
//   return baseData;
// }

// /**
//  * Convert frontend business form data to backend update listing payload
//  */
// export function mapBusinessToUpdatePayload(
//   businessId: string,
//   formData: {
//     name: string;
//     category: string;
//     description: string;
//     location: string;
//     phone: string;
//     website?: string;
//     images: File[];
//   },
//   existingImages: string[],
// ): FormData | Record<string, any> {
//   const baseData: Record<string, any> = {
//     id: businessId,
//     function_type: 'update',
//     title: formData.name,
//     description: formData.description,
//     category: formData.category,
//     location: formData.location,
//     phone: formData.phone,
//     status: 'active',
//   };

//   // Only add website if it has a value
//   if (formData.website && formData.website.trim()) {
//     baseData.website = formData.website.trim();
//   }

//   // If there are new images, use FormData (though backend might not support image updates)
//   if (formData.images && formData.images.length > 0) {
//     const payload = new FormData();

//     Object.entries(baseData).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         payload.append(key, String(value));
//       }
//     });

//     formData.images.forEach((image) => {
//       payload.append('images[]', image);
//     });

//     console.log('📦 Sending update FormData with images');
//     return payload;
//   }

//   console.log('📦 Sending update JSON:', baseData);
//   return baseData;
// }

// /**
//  * Create payload for deleting a listing
//  */
// export function mapBusinessToDeletePayload(businessId: string): any {
//   return {
//     id: businessId,
//     function_type: 'delete',
//   };
// }

// /**
//  * Create payload for fetching a single listing
//  */
// export function mapGetSingleListingPayload(listingId: string): any {
//   return {
//     id: listingId,
//   };
// }

// /**
//  * Create payload for filtering listings
//  */
// export function mapFilterListingsPayload(params: {
//   search?: string;
//   category?: string;
//   chapterId?: string;
//   year?: string;
//   status?: string;
// }): any {
//   const payload: any = {};

//   if (params.search) payload.search = params.search;
//   if (params.category) payload.category = params.category;
//   if (params.chapterId) payload.chapter_id = params.chapterId;
//   if (params.year) payload.year = params.year;
//   if (params.status) payload.status = params.status;
//   else payload.status = 'active'; // Default to active listings

//   return payload;
// }

// // ═══════════════════════════════════════════════════════════════════════════
// // HELPER FUNCTIONS
// // ═══════════════════════════════════════════════════════════════════════════

// /**
//  * Parse images from backend response
//  * Backend might return images as array, string, or null
//  */
// function parseImages(images: any): string[] {
//   if (!images) return [];
//   if (Array.isArray(images)) return images;
//   if (typeof images === 'string') {
//     // Could be comma-separated or JSON string
//     try {
//       const parsed = JSON.parse(images);
//       if (Array.isArray(parsed)) return parsed;
//     } catch {
//       // Not JSON, try comma-separated
//       return images.split(',').map((s) => s.trim());
//     }
//   }
//   return [];
// }

// /**
//  * Generate URL-friendly slug from title and ID
//  */
// function generateSlug(title: string, id: string): string {
//   if (!title || !title.trim()) {
//     return `business-${id}`;
//   }

//   return (
//     title
//       .toLowerCase()
//       .trim()
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/^-+|-+$/g, '')
//       .substring(0, 50) || // Limit length
//     `business-${id}`
//   );
// }

// features/marketplace/api/adapters/marketplace.adapter.ts
//
// Transforms between backend listing format and frontend Business type.
// UPDATE THIS FILE when the backend changes — nothing else needs to touch.
//
// Backend → Frontend field map:
//   id          → businessId
//   user_id     → ownerId
//   seller_name → owner
//   title       → name

import type { Business } from '../../types/marketplace.types';
import { generateSlug, parseImages, extractList } from '@/lib/utils/adapters';

// ─── Inbound (backend → frontend) ────────────────────────────────────────────

export function mapBackendListingToBusiness(raw: unknown): Business {
  const d = raw as Record<string, unknown>;

  return {
    businessId: String(d.id ?? ''),
    ownerId: String(d.user_id ?? ''),
    owner: String(d.seller_name ?? 'Unknown'),
    slug: generateSlug(String(d.title ?? ''), String(d.id ?? ''), 'business'),
    name: String(d.title ?? 'Untitled'),
    category: String(d.category ?? 'other'),
    description: String(d.description ?? ''),
    location: String(d.location ?? ''),
    phone: String(d.phone ?? ''),
    website: d.website ? String(d.website) : undefined,
    images: parseImages(d.images),
  };
}

export function mapBackendListingList(rawResponse: unknown): Business[] {
  const list = extractList(rawResponse, ['listings', 'data']);

  return list
    .map((item) => {
      try {
        return mapBackendListingToBusiness(item);
      } catch {
        return null;
      }
    })
    .filter((item): item is Business => item !== null);
}

// ─── Outbound (frontend → backend) ───────────────────────────────────────────

export interface CreateListingFormData {
  name: string;
  category: string;
  description: string;
  location: string;
  phone: string;
  website?: string;
  images: File[];
}

/**
 * Build the create-listing payload.
 * Returns FormData when images are present, plain object otherwise.
 * The axios interceptor adds token + jwt automatically.
 */
export function mapBusinessToCreatePayload(
  formData: CreateListingFormData,
  userId: string,
  chapterId?: string,
): FormData | Record<string, unknown> {
  const base: Record<string, unknown> = {
    user_id: userId,
    title: formData.name,
    description: formData.description,
    category: formData.category,
    location: formData.location,
    phone: formData.phone,
    business_name: formData.name,
    contact_info: formData.phone,
    status: 'active',
    year: new Date().getFullYear().toString(),
    price: '0.00',
    price_type: 'free',
    is_featured: '0',
  };

  if (chapterId) base.chapter_id = chapterId;
  if (formData.website?.trim()) base.website = formData.website.trim();

  if (formData.images.length > 0) {
    const fd = new FormData();
    Object.entries(base).forEach(([k, v]) => fd.append(k, String(v ?? '')));
    formData.images.forEach((img) => fd.append('images[]', img));
    return fd;
  }

  return base;
}

/**
 * Build the update-listing payload.
 * Sends to /manage_listing with function_type: "update".
 */
export function mapBusinessToUpdatePayload(
  businessId: string,
  formData: CreateListingFormData,
): FormData | Record<string, unknown> {
  const base: Record<string, unknown> = {
    id: businessId,
    function_type: 'update',
    title: formData.name,
    description: formData.description,
    category: formData.category,
    location: formData.location,
    phone: formData.phone,
    status: 'active',
  };

  if (formData.website?.trim()) base.website = formData.website.trim();

  if (formData.images.length > 0) {
    const fd = new FormData();
    Object.entries(base).forEach(([k, v]) => fd.append(k, String(v ?? '')));
    formData.images.forEach((img) => fd.append('images[]', img));
    return fd;
  }

  return base;
}

/** Build the delete-listing payload for /manage_listing. */
export function mapBusinessToDeletePayload(businessId: string): Record<string, unknown> {
  return { id: businessId, function_type: 'delete' };
}

/** Build payload to fetch a single listing by ID. */
export function mapGetSingleListingPayload(listingId: string): Record<string, unknown> {
  return { id: listingId };
}

/** Build payload to filter listings. Only includes defined params. */
export function mapFilterListingsPayload(params: {
  search?: string;
  category?: string;
  userId?: string;
  chapterId?: string;
  year?: string;
  status?: string;
}): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    status: params.status ?? 'active',
  };

  if (params.search) payload.search = params.search;
  if (params.category) payload.category = params.category;
  if (params.userId) payload.user_id = params.userId;
  if (params.chapterId) payload.chapter_id = params.chapterId;
  if (params.year) payload.year = params.year;

  return payload;
}
