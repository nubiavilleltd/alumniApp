// // // features/marketplace/services/marketplace.service.ts

// // import { apiClient } from '@/lib/api/client';
// // import { API_ENDPOINTS } from '@/lib/api/endpoints';
// // import { businesses, categories } from '@/data/site-data';
// // import type {
// //   Business,
// //   GetMarketplaceParams,
// //   PostBusinessPayload,
// // } from '../types/marketplace.types';

// // export const marketplaceService = {
// //   getAll: async (_params?: GetMarketplaceParams): Promise<Business[]> => {
// //     // 🔴 TODO: replace with real API call
// //     // const { data } = await apiClient.post(API_ENDPOINTS.MARKETPLACE.LIST, { ...params });
// //     // return data;
// //     return businesses as Business[];
// //   },

// //   getBySlug: async (slug: string): Promise<Business | undefined> => {
// //     // 🔴 TODO: replace with real API call
// //     // const { data } = await apiClient.post(API_ENDPOINTS.MARKETPLACE.DETAIL, { slug });
// //     // return data;
// //     return businesses.find((b) => b.slug === slug) as Business | undefined;
// //   },

// //   getByOwner: async (ownerId: string): Promise<Business[]> => {
// //     // 🔴 TODO: replace with real API call
// //     // const { data } = await apiClient.post(API_ENDPOINTS.MARKETPLACE.BY_OWNER, { ownerId });
// //     // return data;
// //     return businesses.filter((b) => b.ownerId === ownerId) as Business[];
// //   },

// //   getCategories: async (): Promise<string[]> => {
// //     // 🔴 TODO: replace with real API call
// //     // const { data } = await apiClient.post(API_ENDPOINTS.MARKETPLACE.CATEGORIES, {});
// //     // return data;
// //     return categories;
// //   },

// //   create: async (payload: FormData): Promise<Business> => {
// //     const { data } = await apiClient.post(API_ENDPOINTS.MARKETPLACE.CREATE, payload);
// //     return data;
// //   },

// //   update: async (id: string, payload: FormData): Promise<Business> => {
// //     const { data } = await apiClient.put(API_ENDPOINTS.MARKETPLACE.UPDATE(id), payload);
// //     return data;
// //   },

// //   delete: async (id: string): Promise<void> => {
// //     await apiClient.delete(API_ENDPOINTS.MARKETPLACE.DELETE(id));
// //   },
// // };

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

// // API endpoints (you may have these in your API_ENDPOINTS constant)
// // Using the exact endpoints from the backend contract
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
//         status: 'active', // Only show active listings
//       });

//       const response = await apiClient.post(ENDPOINTS.GET_LISTINGS, payload);

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

//       return mapBackendListingList(listings);
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
//       const response = await apiClient.post(ENDPOINTS.GET_LISTINGS, payload);

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
//    * Note: In the future, if backend adds owner filter, we can update this
//    */
//   getByOwner: async (ownerId: string): Promise<Business[]> => {
//     try {
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
//         (listing: any) => String(listing.user_id) === String(ownerId)
//       );

//       return mapBackendListingList(userListings);
//     } catch (error) {
//       console.error(`Failed to fetch listings for owner ${ownerId}:`, error);
//       return [];
//     }
//   },

//   /**
//    * Get categories
//    * Since categories aren't coming from backend yet, we'll return a static list
//    * but structure it to be easily replaced when backend adds category endpoint
//    */
//   getCategories: async (): Promise<string[]> => {
//     // TODO: Replace with real API call when available
//     // const { data } = await apiClient.post('/api/get_categories', {});
//     // return data.categories;

//     // Static categories from the frontend data
//     return ['jobs', 'housing', 'items', 'services', 'tutoring', 'other'];
//   },

//   // /**
//   //  * Create a new listing
//   //  * POST /api/create_listing with FormData
//   //  */
//   // create: async (payload: FormData): Promise<Business> => {
//   //   const response = await apiClient.post(ENDPOINTS.CREATE_LISTING, payload, {
//   //     headers: {
//   //       'Content-Type': 'multipart/form-data',
//   //     },
//   //   });

//   //   // The response might contain the created listing
//   //   let createdListing = response.data.listing || response.data.data || response.data;

//   //   // If the response doesn't return the listing, fetch it by ID
//   //   if (createdListing && createdListing.id) {
//   //     return mapBackendListingToBusiness(createdListing);
//   //   }

//   //   // Fallback: try to fetch by ID if we know it
//   //   if (response.data.id) {
//   //     return await marketplaceService.getById(response.data.id).then((b) => b as Business);
//   //   }

//   //   throw new Error('Failed to get created listing data');
//   // },

//   // /**
//   //  * Update an existing listing
//   //  * POST /api/manage_listing with function_type: "update"
//   //  */
//   // update: async (id: string, payload: FormData): Promise<Business> => {
//   //   const response = await apiClient.post(ENDPOINTS.MANAGE_LISTING, payload, {
//   //     headers: {
//   //       'Content-Type': 'multipart/form-data',
//   //     },
//   //   });

//   //   // After update, fetch the updated listing
//   //   const updated = await marketplaceService.getById(id);
//   //   if (!updated) {
//   //     throw new Error('Failed to fetch updated listing');
//   //   }

//   //   return updated;
//   // },

//   // features/marketplace/services/marketplace.service.ts

// /**
//  * Create a new listing
//  * POST /api/create_listing
//  * Can send either JSON or FormData depending on whether images exist
//  */
// create: async (payload: FormData | Record<string, any>): Promise<Business> => {
//   let response;

//   // Check if payload is FormData
//   if (payload instanceof FormData) {
//     response = await apiClient.post(ENDPOINTS.CREATE_LISTING, payload, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//   } else {
//     // Send as JSON
//     response = await apiClient.post(ENDPOINTS.CREATE_LISTING, payload);
//   }

//   // The response might contain the created listing
//   let createdListing = response.data.listing || response.data.data || response.data;

//   // If the response doesn't return the listing, fetch it by ID
//   if (createdListing && createdListing.id) {
//     return mapBackendListingToBusiness(createdListing);
//   }

//   // Fallback: try to fetch by ID if we know it
//   if (response.data.id) {
//     return await marketplaceService.getById(response.data.id).then((b) => b as Business);
//   }

//   throw new Error('Failed to get created listing data');
// },

// /**
//  * Update an existing listing
//  * POST /api/manage_listing with function_type: "update"
//  */
// update: async (id: string, payload: FormData | Record<string, any>): Promise<Business> => {
//   let response;

//   if (payload instanceof FormData) {
//     response = await apiClient.post(ENDPOINTS.MANAGE_LISTING, payload, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//   } else {
//     response = await apiClient.post(ENDPOINTS.MANAGE_LISTING, payload);
//   }

//   // After update, fetch the updated listing
//   const updated = await marketplaceService.getById(id);
//   if (!updated) {
//     throw new Error('Failed to fetch updated listing');
//   }

//   return updated;
// },

//   /**
//    * Delete a listing
//    * POST /api/manage_listing with function_type: "delete"
//    */
//   delete: async (id: string): Promise<void> => {
//     const payload = mapBusinessToDeletePayload(id);
//     await apiClient.post(ENDPOINTS.MANAGE_LISTING, payload);
//   },
// };

// features/marketplace/services/marketplace.service.ts

import { apiClient } from '@/lib/api/client';
import {
  mapBackendListingList,
  mapBackendListingToBusiness,
  mapBusinessToCreatePayload,
  mapBusinessToUpdatePayload,
  mapBusinessToDeletePayload,
  mapFilterListingsPayload,
  mapGetSingleListingPayload,
} from '../api/adapters/marketplace.adapter';
import type { Business, GetMarketplaceParams } from '../types/marketplace.types';

// API endpoints (using the exact endpoints from the backend contract)
const ENDPOINTS = {
  CREATE_LISTING: '/create_listing',
  MANAGE_LISTING: '/manage_listing',
  GET_LISTINGS: '/get_listings',
};

export const marketplaceService = {
  /**
   * Get all listings with optional filters
   * POST /api/get_listings
   */
  getAll: async (params?: GetMarketplaceParams): Promise<Business[]> => {
    try {
      const payload = mapFilterListingsPayload({
        search: params?.search,
        category: params?.category,
        status: 'active',
      });

      console.log('🔍 Fetching listings with payload:', payload);
      const response = await apiClient.post(ENDPOINTS.GET_LISTINGS, payload);
      console.log('📥 Get all response:', response.data);

      // Handle different response structures
      let listings = [];
      if (response.data.listings && Array.isArray(response.data.listings)) {
        listings = response.data.listings;
      } else if (Array.isArray(response.data)) {
        listings = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        listings = response.data.data;
      } else {
        console.warn('Unexpected response structure:', response.data);
        listings = [];
      }

      const mappedListings = mapBackendListingList(listings);
      console.log(`✅ Mapped ${mappedListings.length} listings`);
      return mappedListings;
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      return []; // Return empty array on error for graceful degradation
    }
  },

  /**
   * Get a single listing by ID
   * POST /api/get_listings with { id: "1" }
   */
  getById: async (id: string): Promise<Business | null> => {
    try {
      const payload = mapGetSingleListingPayload(id);
      console.log(`🔍 Fetching listing ${id} with payload:`, payload);
      const response = await apiClient.post(ENDPOINTS.GET_LISTINGS, payload);
      console.log(`📥 Get by ID response for ${id}:`, response.data);

      // Response might be a single listing or wrapped in a data object
      let listing = null;
      if (response.data.listing) {
        listing = response.data.listing;
      } else if (response.data.data) {
        listing = response.data.data;
      } else {
        listing = response.data;
      }

      if (!listing) return null;
      return mapBackendListingToBusiness(listing);
    } catch (error) {
      console.error(`Failed to fetch listing ${id}:`, error);
      return null;
    }
  },

  /**
   * Get listings by owner ID
   * Uses getAll and filters client-side since backend doesn't have direct owner filter
   */
  getByOwner: async (ownerId: string): Promise<Business[]> => {
    try {
      console.log(`🔍 Fetching listings for owner: ${ownerId}`);
      // Get all listings and filter by user_id
      const response = await apiClient.post(ENDPOINTS.GET_LISTINGS, {
        status: 'active',
      });

      let listings = [];
      if (response.data.listings && Array.isArray(response.data.listings)) {
        listings = response.data.listings;
      } else if (Array.isArray(response.data)) {
        listings = response.data;
      } else {
        listings = [];
      }

      // Filter by user_id (ownerId)
      const userListings = listings.filter(
        (listing: any) => String(listing.user_id) === String(ownerId),
      );

      console.log(`✅ Found ${userListings.length} listings for owner ${ownerId}`);
      return mapBackendListingList(userListings);
    } catch (error) {
      console.error(`Failed to fetch listings for owner ${ownerId}:`, error);
      return [];
    }
  },

  /**
   * Get categories
   * Returns static categories from the backend contract
   */
  getCategories: async (): Promise<string[]> => {
    // TODO: Replace with real API call when available
    // const { data } = await apiClient.post('/api/get_categories', {});
    // return data.categories;

    console.log('📁 Getting categories (static list)');
    return ['jobs', 'housing', 'items', 'services', 'tutoring', 'other'];
  },

  /**
   * Create a new listing
   * POST /api/create_listing
   * Accepts either FormData (with images) or plain object (no images)
   */
  create: async (payload: FormData | Record<string, any>): Promise<Business> => {
    let response;

    // Check if payload is FormData
    if (payload instanceof FormData) {
      console.log('📤 Sending create request as FormData with images');
      response = await apiClient.post(ENDPOINTS.CREATE_LISTING, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      console.log('📤 Sending create request as JSON:', payload);
      response = await apiClient.post(ENDPOINTS.CREATE_LISTING, payload);
    }

    console.log('📥 Create response:', response.data);

    // Try to get the created listing from response
    let createdListing = response.data.listing || response.data.data || response.data;

    if (createdListing && createdListing.id) {
      console.log(`✅ Created listing with ID: ${createdListing.id}`);
      return mapBackendListingToBusiness(createdListing);
    }

    // If we have an ID in response, fetch it
    if (response.data.id) {
      console.log(`🔄 Fetching newly created listing with ID: ${response.data.id}`);
      const business = await marketplaceService.getById(response.data.id);
      if (business) return business;
    }

    throw new Error('Failed to get created listing data');
  },

  /**
   * Update an existing listing
   * POST /api/manage_listing with function_type: "update"
   */
  update: async (id: string, payload: FormData | Record<string, any>): Promise<Business> => {
    let response;

    if (payload instanceof FormData) {
      console.log(`📤 Sending update request for ${id} as FormData`);
      response = await apiClient.post(ENDPOINTS.MANAGE_LISTING, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      console.log(`📤 Sending update request for ${id} as JSON:`, payload);
      response = await apiClient.post(ENDPOINTS.MANAGE_LISTING, payload);
    }

    console.log(`📥 Update response for ${id}:`, response.data);

    // After update, fetch the updated listing
    console.log(`🔄 Fetching updated listing ${id}`);
    const updated = await marketplaceService.getById(id);
    if (!updated) {
      throw new Error('Failed to fetch updated listing');
    }

    console.log(`✅ Successfully updated listing ${id}`);
    return updated;
  },

  /**
   * Delete a listing
   * POST /api/manage_listing with function_type: "delete"
   */
  delete: async (id: string): Promise<void> => {
    const payload = mapBusinessToDeletePayload(id);
    console.log(`🗑️ Deleting listing ${id} with payload:`, payload);
    await apiClient.post(ENDPOINTS.MANAGE_LISTING, payload);
    console.log(`✅ Successfully deleted listing ${id}`);
  },
};
