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

import type {
  Business,
  CreateListingFormData,
  UpdateListingFormData,
} from '../../types/marketplace.types';
import { generateSlug, parseImages, extractList } from '@/lib/utils/adapters';

// ─── Inbound (backend → frontend) ────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') ?? '';

function getNestedRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function isRealPhotoUrl(value: unknown): value is string {
  const photo = typeof value === 'string' ? value.trim() : '';

  return Boolean(
    photo &&
    photo !== 'default.png' &&
    !photo.includes('ui-avatars.com') &&
    !photo.includes('default-avatar'),
  );
}

function resolvePhotoUrl(value: unknown): string | undefined {
  if (!isRealPhotoUrl(value)) return undefined;

  const photo = value.trim();
  const isAbsolute = /^(https?:)?\/\//i.test(photo) || /^(data|blob):/i.test(photo);

  if (isAbsolute || !API_BASE_URL) return photo;
  return photo.startsWith('/') ? `${API_BASE_URL}${photo}` : `${API_BASE_URL}/${photo}`;
}

function resolveOwnerPhoto(raw: Record<string, unknown>): string | undefined {
  const profile = getNestedRecord(raw.profile);
  const user = getNestedRecord(raw.user);
  const seller = getNestedRecord(raw.seller);
  const owner = getNestedRecord(raw.owner);

  return resolvePhotoUrl(
    raw.seller_avatar ??
      raw.seller_photo ??
      raw.owner_avatar ??
      raw.owner_photo ??
      raw.user_avatar ??
      raw.user_photo ??
      raw.profile_photo ??
      raw.avatar ??
      raw.photo ??
      seller.avatar ??
      seller.photo ??
      owner.avatar ??
      owner.photo ??
      user.avatar ??
      user.photo ??
      profile.avatar ??
      profile.photo,
  );
}

export function mapBackendListingToBusiness(raw: unknown): Business {
  const d = raw as Record<string, unknown>;

  return {
    businessId: String(d.id ?? ''),
    ownerId: String(d.user_id ?? ''),
    owner: String(d.seller_name ?? 'Unknown'),
    ownerPhoto: resolveOwnerPhoto(d),
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
// export function mapBusinessToUpdatePayload(
//   businessId: string,
//   formData: UpdateListingFormData,
// ): FormData | Record<string, unknown> {
//   const base: Record<string, unknown> = {
//     id: businessId,
//     function_type: 'update',
//     title: formData.name,
//     description: formData.description,
//     category: formData.category,
//     location: formData.location,
//     phone: formData.phone,
//     status: 'active',
//     image_action: formData.imageAction
//   };

//   console.log("formData", {formData})

//   if (formData.website?.trim()) base.website = formData.website.trim();

//     if (formData.removeImages?.length) {
//     base.remove_images = JSON.stringify(formData.removeImages);
//   }

//     const hasNewImages = (formData.images?.length ?? 0) > 0;
// //   if (formData.images.length > 0) {
// //     const fd = new FormData();
// //     Object.entries(base).forEach(([k, v]) => fd.append(k, String(v ?? '')));
// //     formData.images.forEach((img) => fd.append('images[]', img));
// //     return fd;
// //   }

//   if (hasNewImages) {
//     const fd = new FormData();
//     Object.entries(base).forEach(([k, v]) => fd.append(k, String(v ?? '')));
//     formData.images!.forEach((img) => fd.append('images', img));

//      console.log("fd => ", {fd})
//     return fd;
//   }

//   console.log("base => ", {base})

//   return base;
// }

export function mapBusinessToUpdatePayload(
  businessId: string,
  formData: UpdateListingFormData,
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

  if (formData.website?.trim()) {
    base.website = formData.website.trim();
  }

  // ✅ Only set if defined
  if (formData.imageAction) {
    base.image_action = formData.imageAction;
  }

  // ✅ Required for deletion
  if (formData.removeImages?.length) {
    base.remove_images = JSON.stringify(formData.removeImages);
  }

  const hasNewImages = (formData.images?.length ?? 0) > 0;

  if (hasNewImages) {
    const fd = new FormData();

    Object.entries(base).forEach(([k, v]) => {
      fd.append(k, String(v ?? ''));
    });

    // ✅ FIXED HERE
    formData.images!.forEach((img) => {
      fd.append('images', img);
    });

    console.log('fd => ', { fd });

    return fd;
  }

  console.log('base => ', { base, formData });
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
