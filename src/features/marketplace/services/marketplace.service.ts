// // features/marketplace/services/marketplace.service.ts

// import { apiClient } from '@/lib/api/client';
// import {
//   mapBackendListingList,
//   mapBackendListingToBusiness,
//   mapBusinessToCreatePayload,
//   mapBusinessToUpdatePayload,
//   mapBusinessToDeletePayload,
//   mapFilterListingsPayload,
//   mapGetSingleListingPayload,
// } from '../api/adapters/marketplace.adapter';
// import type { Business, GetMarketplaceParams } from '../types/marketplace.types';

// // API endpoints (using the exact endpoints from the backend contract)
// const ENDPOINTS = {
//   CREATE_LISTING: '/create_listing',
//   MANAGE_LISTING: '/manage_listing',
//   GET_LISTINGS: '/get_listings',
// };

// export const marketplaceService = {
//   /**
//    * Get all listings with optional filters
//    * POST /api/get_listings
//    */
//   getAll: async (params?: GetMarketplaceParams): Promise<Business[]> => {
//     try {
//       const payload = mapFilterListingsPayload({
//         search: params?.search,
//         category: params?.category,
//         status: 'active',
//       });

//       console.log('🔍 Fetching listings with payload:', payload);
//       const response = await apiClient.post(ENDPOINTS.GET_LISTINGS, payload);
//       console.log('📥 Get all response:', response.data);

//       // Handle different response structures
//       let listings = [];
//       if (response.data.listings && Array.isArray(response.data.listings)) {
//         listings = response.data.listings;
//       } else if (Array.isArray(response.data)) {
//         listings = response.data;
//       } else if (response.data.data && Array.isArray(response.data.data)) {
//         listings = response.data.data;
//       } else {
//         console.warn('Unexpected response structure:', response.data);
//         listings = [];
//       }

//       const mappedListings = mapBackendListingList(listings);
//       console.log(`✅ Mapped ${mappedListings.length} listings`);
//       return mappedListings;
//     } catch (error) {
//       console.error('Failed to fetch listings:', error);
//       return []; // Return empty array on error for graceful degradation
//     }
//   },

//   /**
//    * Get a single listing by ID
//    * POST /api/get_listings with { id: "1" }
//    */
//   getById: async (id: string): Promise<Business | null> => {
//     try {
//       const payload = mapGetSingleListingPayload(id);
//       console.log(`🔍 Fetching listing ${id} with payload:`, payload);
//       const response = await apiClient.post(ENDPOINTS.GET_LISTINGS, payload);
//       console.log(`📥 Get by ID response for ${id}:`, response.data);

//       // Response might be a single listing or wrapped in a data object
//       let listing = null;
//       if (response.data.listing) {
//         listing = response.data.listing;
//       } else if (response.data.data) {
//         listing = response.data.data;
//       } else {
//         listing = response.data;
//       }

//       if (!listing) return null;
//       return mapBackendListingToBusiness(listing);
//     } catch (error) {
//       console.error(`Failed to fetch listing ${id}:`, error);
//       return null;
//     }
//   },

//   /**
//    * Get listings by owner ID
//    * Uses getAll and filters client-side since backend doesn't have direct owner filter
//    */
//   getByOwner: async (ownerId: string): Promise<Business[]> => {
//     try {
//       console.log(`🔍 Fetching listings for owner: ${ownerId}`);
//       // Get all listings and filter by user_id
//       const response = await apiClient.post(ENDPOINTS.GET_LISTINGS, {
//         status: 'active',
//       });

//       let listings = [];
//       if (response.data.listings && Array.isArray(response.data.listings)) {
//         listings = response.data.listings;
//       } else if (Array.isArray(response.data)) {
//         listings = response.data;
//       } else {
//         listings = [];
//       }

//       // Filter by user_id (ownerId)
//       const userListings = listings.filter(
//         (listing: any) => String(listing.user_id) === String(ownerId),
//       );

//       console.log(`✅ Found ${userListings.length} listings for owner ${ownerId}`);
//       return mapBackendListingList(userListings);
//     } catch (error) {
//       console.error(`Failed to fetch listings for owner ${ownerId}:`, error);
//       return [];
//     }
//   },

//   /**
//    * Get categories
//    * Returns static categories from the backend contract
//    */
//   getCategories: async (): Promise<string[]> => {
//     // TODO: Replace with real API call when available
//     // const { data } = await apiClient.post('/api/get_categories', {});
//     // return data.categories;

//     console.log('📁 Getting categories (static list)');
//     return ['jobs', 'housing', 'items', 'services', 'tutoring', 'other'];
//   },

//   /**
//    * Create a new listing
//    * POST /api/create_listing
//    * Accepts either FormData (with images) or plain object (no images)
//    */
//   create: async (payload: FormData | Record<string, any>): Promise<Business> => {
//     let response;

//     // Check if payload is FormData
//     if (payload instanceof FormData) {
//       console.log('📤 Sending create request as FormData with images');
//       response = await apiClient.post(ENDPOINTS.CREATE_LISTING, payload, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//     } else {
//       console.log('📤 Sending create request as JSON:', payload);
//       response = await apiClient.post(ENDPOINTS.CREATE_LISTING, payload);
//     }

//     console.log('📥 Create response:', response.data);

//     // Try to get the created listing from response
//     let createdListing = response.data.listing || response.data.data || response.data;

//     if (createdListing && createdListing.id) {
//       console.log(`✅ Created listing with ID: ${createdListing.id}`);
//       return mapBackendListingToBusiness(createdListing);
//     }

//     // If we have an ID in response, fetch it
//     if (response.data.id) {
//       console.log(`🔄 Fetching newly created listing with ID: ${response.data.id}`);
//       const business = await marketplaceService.getById(response.data.id);
//       if (business) return business;
//     }

//     throw new Error('Failed to get created listing data');
//   },

//   /**
//    * Update an existing listing
//    * POST /api/manage_listing with function_type: "update"
//    */
//   update: async (id: string, payload: FormData | Record<string, any>): Promise<Business> => {
//     let response;

//     if (payload instanceof FormData) {
//       console.log(`📤 Sending update request for ${id} as FormData`);
//       response = await apiClient.post(ENDPOINTS.MANAGE_LISTING, payload, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//     } else {
//       console.log(`📤 Sending update request for ${id} as JSON:`, payload);
//       response = await apiClient.post(ENDPOINTS.MANAGE_LISTING, payload);
//     }

//     console.log(`📥 Update response for ${id}:`, response.data);

//     // After update, fetch the updated listing
//     console.log(`🔄 Fetching updated listing ${id}`);
//     const updated = await marketplaceService.getById(id);
//     if (!updated) {
//       throw new Error('Failed to fetch updated listing');
//     }

//     console.log(`✅ Successfully updated listing ${id}`);
//     return updated;
//   },

//   /**
//    * Delete a listing
//    * POST /api/manage_listing with function_type: "delete"
//    */
//   delete: async (id: string): Promise<void> => {
//     const payload = mapBusinessToDeletePayload(id);
//     console.log(`🗑️ Deleting listing ${id} with payload:`, payload);
//     await apiClient.post(ENDPOINTS.MANAGE_LISTING, payload);
//     console.log(`✅ Successfully deleted listing ${id}`);
//   },
// };

// features/marketplace/services/marketplace.service.ts

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import { extractList } from '@/lib/utils/adapters';
import {
  mapBackendListingList,
  mapBackendListingToBusiness,
  mapBusinessToCreatePayload,
  mapBusinessToUpdatePayload,
  mapBusinessToDeletePayload,
  mapFilterListingsPayload,
  mapGetSingleListingPayload,
  type CreateListingFormData,
} from '../api/adapters/marketplace.adapter';
import type { Business, GetMarketplaceParams } from '../types/marketplace.types';

export const marketplaceService = {
  /**
   * Fetch all active listings with optional filters.
   * POST /get_listings
   */
  async getAll(params?: GetMarketplaceParams): Promise<Business[]> {
    try {
      const payload = mapFilterListingsPayload({
        search: params?.search,
        category: params?.category,
        status: 'active',
      });

      const { data } = await apiClient.post(API_ENDPOINTS.MARKETPLACE.GET_LISTINGS, payload);
      const list = extractList(data, ['listings', 'data']);
      return mapBackendListingList(list);
    } catch (error) {
      throw handleApiError(
        error,
        'Unable to load marketplace listings. Please try again.',
        'marketplaceService.getAll',
      );
    }
  },

  /**
   * Fetch a single listing by its backend ID.
   * POST /get_listings  { id: "1" }
   */
  async getById(id: string): Promise<Business | null> {
    try {
      const payload = mapGetSingleListingPayload(id);
      const { data } = await apiClient.post(API_ENDPOINTS.MARKETPLACE.GET_LISTINGS, payload);

      // Response may be a single object or a one-item list
      const raw =
        (data as Record<string, unknown>).listing ??
        (data as Record<string, unknown>).data ??
        extractList(data, ['listings'])[0] ??
        null;

      if (!raw) return null;
      return mapBackendListingToBusiness(raw);
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw handleApiError(
        error,
        'Unable to load this listing. Please try again.',
        'marketplaceService.getById',
      );
    }
  },

  /**
   * Fetch listings belonging to a specific user.
   * POST /get_listings  { user_id: "5", status: "active" }
   *
   * NOTE: Pass the backend numeric user ID (user.id), NOT the frontend memberId.
   */
  async getByOwner(userId: string): Promise<Business[]> {
    try {
      const payload = mapFilterListingsPayload({ userId, status: 'active' });
      const { data } = await apiClient.post(API_ENDPOINTS.MARKETPLACE.GET_LISTINGS, payload);
      const list = extractList(data, ['listings', 'data']);
      return mapBackendListingList(list);
    } catch (error) {
      throw handleApiError(
        error,
        'Unable to load your business listings. Please try again.',
        'marketplaceService.getByOwner',
      );
    }
  },

  /**
   * Static category list — matches the backend contract values.
   * TODO: replace with a real endpoint if the backend adds one.
   */
  async getCategories(): Promise<string[]> {
    return ['jobs', 'housing', 'items', 'services', 'tutoring', 'other'];
  },

  /**
   * Create a new listing.
   * POST /create_listing  (JSON or FormData depending on whether images exist)
   */
  async create(
    formData: CreateListingFormData,
    userId: string,
    chapterId?: string,
  ): Promise<Business> {
    try {
      const payload = mapBusinessToCreatePayload(formData, userId, chapterId);
      const { data } = await apiClient.post(API_ENDPOINTS.MARKETPLACE.CREATE_LISTING, payload);

      // Try to extract the created listing from the response
      const created =
        (data as Record<string, unknown>).listing ?? (data as Record<string, unknown>).data ?? null;

      if (created) return mapBackendListingToBusiness(created);

      // If backend returns an ID but not the full object, fetch it
      const newId = (data as Record<string, unknown>).id;
      if (newId) {
        const fetched = await marketplaceService.getById(String(newId));
        if (fetched) return fetched;
      }

      throw new Error('Listing created but could not be retrieved.');
    } catch (error) {
      throw handleApiError(
        error,
        'Failed to create your listing. Please check your details and try again.',
        'marketplaceService.create',
      );
    }
  },

  /**
   * Update an existing listing.
   * POST /manage_listing  { function_type: "update", ... }
   */
  async update(id: string, formData: CreateListingFormData): Promise<Business> {
    try {
      const payload = mapBusinessToUpdatePayload(id, formData);
      await apiClient.post(API_ENDPOINTS.MARKETPLACE.MANAGE_LISTING, payload);

      // Backend doesn't reliably return the updated object — re-fetch
      const updated = await marketplaceService.getById(id);
      if (!updated) throw new Error('Listing updated but could not be retrieved.');
      return updated;
    } catch (error) {
      throw handleApiError(
        error,
        'Failed to update your listing. Please try again.',
        'marketplaceService.update',
      );
    }
  },

  /**
   * Delete a listing.
   * POST /manage_listing  { function_type: "delete", id }
   */
  async delete(id: string): Promise<void> {
    try {
      const payload = mapBusinessToDeletePayload(id);
      await apiClient.post(API_ENDPOINTS.MARKETPLACE.MANAGE_LISTING, payload);
    } catch (error) {
      throw handleApiError(
        error,
        'Failed to delete your listing. Please try again.',
        'marketplaceService.delete',
      );
    }
  },
};
