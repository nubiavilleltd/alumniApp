// // // // // // // // import { apiClient } from '@/lib/api/client';
// // // // // // // // import { API_ENDPOINTS } from '@/lib/api/endpoints';
// // // // // // // // import { getAlumni, getAlumnusBySlug } from '@/data/site-data';
// // // // // // // // import { defaultMockAccounts } from '@/features/authentication/constants/mockAccounts';
// // // // // // // // import type { Alumni } from '@/features/alumni/types/alumni.types';

// // // // // // // // export interface GetAlumniParams {
// // // // // // // //   search?: string;
// // // // // // // //   year?: string;
// // // // // // // //   page?: number;
// // // // // // // //   limit?: number;
// // // // // // // // }

// // // // // // // // // Build a fast lookup: memberId → accountStatus
// // // // // // // // const accountStatusMap = new Map(defaultMockAccounts.map((a) => [a.memberId, a.accountStatus]));

// // // // // // // // function isActiveAccount(memberId: string): boolean {
// // // // // // // //   const status = accountStatusMap.get(memberId);
// // // // // // // //   // If no account found (shouldn't happen), show them
// // // // // // // //   // If account found, only show active members
// // // // // // // //   return !status || status === 'active';
// // // // // // // // }

// // // // // // // // export const alumniService = {
// // // // // // // //   getAll: async (_params?: GetAlumniParams): Promise<Alumni[]> => {
// // // // // // // //     // 🔴 TODO: replace with real API call
// // // // // // // //     // const { data } = await apiClient.post(API_ENDPOINTS.ALUMNI.LIST, { ..._params });
// // // // // // // //     // return data;

// // // // // // // //     // Filter out suspended/closed accounts
// // // // // // // //     return getAlumni().filter((a) => isActiveAccount(a.memberId));
// // // // // // // //   },

// // // // // // // //   getBySlug: async (slug: string): Promise<Alumni | undefined> => {
// // // // // // // //     // 🔴 TODO: replace with real API call
// // // // // // // //     // const { data } = await apiClient.post(API_ENDPOINTS.ALUMNI.DETAIL, { slug });
// // // // // // // //     // return data;

// // // // // // // //     const alumnus = getAlumnusBySlug(slug);
// // // // // // // //     if (!alumnus) return undefined;

// // // // // // // //     // Don't return profile of suspended/closed account
// // // // // // // //     if (!isActiveAccount(alumnus.memberId)) return undefined;

// // // // // // // //     return alumnus;
// // // // // // // //   },

// // // // // // // //   update: async (id: string, payload: FormData): Promise<Alumni> => {
// // // // // // // //     const { data } = await apiClient.put(API_ENDPOINTS.ALUMNI.UPDATE(id), payload);
// // // // // // // //     return data;
// // // // // // // //   },
// // // // // // // // };

// // // // // // // // import { apiClient } from '@/lib/api/client';
// // // // // // // // import { API_ENDPOINTS } from '@/lib/api/endpoints';
// // // // // // // // import { getAlumni, getAlumnusBySlug } from '@/data/site-data';
// // // // // // // // import type { Alumni } from '@/features/alumni/types/alumni.types';

// // // // // // // // export interface GetAlumniParams {
// // // // // // // //   search?: string;
// // // // // // // //   year?: string;
// // // // // // // //   page?: number;
// // // // // // // //   limit?: number;
// // // // // // // // }

// // // // // // // // export const alumniService = {
// // // // // // // //   getAll: async (params?: GetAlumniParams): Promise<Alumni[]> => {
// // // // // // // //     // 🔴 TODO: replace with real API call
// // // // // // // //     // const { data } = await apiClient.get(API_ENDPOINTS.ALUMNI.LIST, { params });
// // // // // // // //     // return data;

// // // // // // // //     // 🟢 MOCK — delete when API is ready
// // // // // // // //     return getAlumni();
// // // // // // // //   },

// // // // // // // //   getBySlug: async (slug: string): Promise<Alumni | undefined> => {
// // // // // // // //     // 🔴 TODO: replace with real API call
// // // // // // // //     // const { data } = await apiClient.get(API_ENDPOINTS.ALUMNI.DETAIL(slug));
// // // // // // // //     // return data;
// // // // // // // //     // 🟢 MOCK — delete when API is ready
// // // // // // // //     return getAlumnusBySlug(slug);
// // // // // // // //   },

// // // // // // // //   update: async (id: string, payload: FormData): Promise<Alumni> => {
// // // // // // // //     const { data } = await apiClient.put(API_ENDPOINTS.ALUMNI.UPDATE(id), payload);
// // // // // // // //     return data;
// // // // // // // //   },
// // // // // // // // };

// // // // // // // import { apiClient } from '@/lib/api/client';
// // // // // // // import { API_ENDPOINTS } from '@/lib/api/endpoints';
// // // // // // // import { getAlumni, getAlumnusBySlug } from '@/data/site-data';
// // // // // // // import { defaultMockAccounts } from '@/features/authentication/constants/mockAccounts';
// // // // // // // import type { Alumni } from '@/features/alumni/types/alumni.types';
// // // // // // // import { mapBackendAlumniList, mapBackendAlumniToFrontend } from '../api/adapters/alumni.adapter';

// // // // // // // export interface GetAlumniParams {
// // // // // // //   search?: string;
// // // // // // //   year?: string;
// // // // // // //   page?: number;
// // // // // // //   limit?: number;
// // // // // // // }

// // // // // // // // Build a fast lookup: memberId → accountStatus
// // // // // // // const accountStatusMap = new Map(defaultMockAccounts.map((a) => [a.memberId, a.accountStatus]));

// // // // // // // function isActiveAccount(memberId: string): boolean {
// // // // // // //   const status = accountStatusMap.get(memberId);
// // // // // // //   // If no account found (shouldn't happen), show them
// // // // // // //   // If account found, only show active members
// // // // // // //   return !status || status === 'active';
// // // // // // // }

// // // // // // // export const alumniService = {
// // // // // // //   getAll: async (_params?: GetAlumniParams): Promise<Alumni[]> => {
// // // // // // //     // ═══════════════════════════════════════════════════════════════════
// // // // // // //     // REAL API CALL (with adapter to handle messy backend data)
// // // // // // //     // ═══════════════════════════════════════════════════════════════════
// // // // // // //     try {
// // // // // // //       const { data } = await apiClient.post(API_ENDPOINTS.ALUMNI.LIST);

// // // // // // //       // Transform messy backend data to clean frontend format
// // // // // // //       const cleanedData = mapBackendAlumniList(data.users);

// // // // // // //       // Filter out suspended/closed accounts (if needed)
// // // // // // //       return cleanedData.filter((a) => isActiveAccount(a.memberId));
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Failed to fetch alumni from API:', error);

// // // // // // //       // ═══════════════════════════════════════════════════════════════
// // // // // // //       // FALLBACK: Use mock data if API fails (for development)
// // // // // // //       // ═══════════════════════════════════════════════════════════════
// // // // // // //       console.warn('Falling back to mock data');
// // // // // // //       return getAlumni().filter((a) => isActiveAccount(a.memberId));
// // // // // // //     }
// // // // // // //   },

// // // // // // //   getBySlug: async (slug: string): Promise<Alumni | undefined> => {
// // // // // // //     // ═══════════════════════════════════════════════════════════════════
// // // // // // //     // REAL API CALL (with adapter to handle messy backend data)
// // // // // // //     // ═══════════════════════════════════════════════════════════════════
// // // // // // //     try {
// // // // // // //       const { data } = await apiClient.get(API_ENDPOINTS.ALUMNI.DETAIL(slug));

// // // // // // //       // Transform messy backend data to clean frontend format
// // // // // // //       const alumnus = mapBackendAlumniToFrontend(data);

// // // // // // //       // Don't return profile of suspended/closed account
// // // // // // //       if (!isActiveAccount(alumnus.memberId)) return undefined;

// // // // // // //       return alumnus;
// // // // // // //     } catch (error: any) {
// // // // // // //       // If 404, alumnus doesn't exist
// // // // // // //       if (error.response?.status === 404) {
// // // // // // //         return undefined;
// // // // // // //       }

// // // // // // //       console.error('Failed to fetch alumnus from API:', error);

// // // // // // //       // ═══════════════════════════════════════════════════════════════
// // // // // // //       // FALLBACK: Use mock data if API fails (for development)
// // // // // // //       // ═══════════════════════════════════════════════════════════════
// // // // // // //       console.warn('Falling back to mock data for slug:', slug);
// // // // // // //       const alumnus = getAlumnusBySlug(slug);
// // // // // // //       if (!alumnus) return undefined;
// // // // // // //       if (!isActiveAccount(alumnus.memberId)) return undefined;
// // // // // // //       return alumnus;
// // // // // // //     }
// // // // // // //   },

// // // // // // //   update: async (id: string, payload: FormData): Promise<Alumni> => {
// // // // // // //     const { data } = await apiClient.put(API_ENDPOINTS.ALUMNI.UPDATE(id), payload);
// // // // // // //     return data;
// // // // // // //   },
// // // // // // // };

// // // // // // // features/alumni/services/alumni.service.ts

// // // // // // import { apiClient } from '@/lib/api/client';
// // // // // // import { API_ENDPOINTS } from '@/lib/api/endpoints';
// // // // // // import type { Alumni } from '@/features/alumni/types/alumni.types';
// // // // // // import { mapBackendAlumniToFrontend, mapBackendAlumniList } from '../api/adapters/alumni.adapter';

// // // // // // export interface GetAlumniParams {
// // // // // //   search?: string;
// // // // // //   year?: string;
// // // // // //   page?: number;
// // // // // //   limit?: number;
// // // // // // }

// // // // // // export const alumniService = {
// // // // // //   /**
// // // // // //    * Get all alumni
// // // // // //    * GET /get_users_by_action
// // // // // //    */
// // // // // //   getAll: async (params?: GetAlumniParams): Promise<Alumni[]> => {
// // // // // //     try {
// // // // // //       // Use GET with query params based on your endpoint
// // // // // //       const response = await apiClient.get(API_ENDPOINTS.ALUMNI.LIST, { params });

// // // // // //       // Handle response structure
// // // // // //       let alumniList = [];
// // // // // //       if (response.data.users && Array.isArray(response.data.users)) {
// // // // // //         alumniList = response.data.users;
// // // // // //       } else if (Array.isArray(response.data)) {
// // // // // //         alumniList = response.data;
// // // // // //       } else if (response.data.data && Array.isArray(response.data.data)) {
// // // // // //         alumniList = response.data.data;
// // // // // //       } else {
// // // // // //         alumniList = [];
// // // // // //       }

// // // // // //       return mapBackendAlumniList(alumniList);
// // // // // //     } catch (error) {
// // // // // //       console.error('Failed to fetch alumni:', error);
// // // // // //       return [];
// // // // // //     }
// // // // // //   },

// // // // // //   /**
// // // // // //    * Get a single alumnus by ID or slug
// // // // // //    * GET /alumni/{slug}
// // // // // //    */
// // // // // //   getBySlug: async (slug: string): Promise<Alumni | null> => {
// // // // // //     try {
// // // // // //       console.log('Fetching alumnus with slug:', slug);
// // // // // //       const response = await apiClient.get(API_ENDPOINTS.ALUMNI.DETAIL(slug));
// // // // // //       console.log('Alumnus response:', response.data);

// // // // // //       // Handle response structure
// // // // // //       let alumnusData = null;
// // // // // //       if (response.data.user) {
// // // // // //         alumnusData = response.data.user;
// // // // // //       } else if (response.data.data) {
// // // // // //         alumnusData = response.data.data;
// // // // // //       } else {
// // // // // //         alumnusData = response.data;
// // // // // //       }

// // // // // //       if (!alumnusData) return null;
// // // // // //       return mapBackendAlumniToFrontend(alumnusData);
// // // // // //     } catch (error: any) {
// // // // // //       if (error.response?.status === 404) {
// // // // // //         console.log('Alumnus not found with slug:', slug);
// // // // // //         return null;
// // // // // //       }
// // // // // //       console.error('Failed to fetch alumnus:', error);
// // // // // //       return null;
// // // // // //     }
// // // // // //   },

// // // // // //   /**
// // // // // //    * Get a single alumnus by ID
// // // // // //    * GET /alumni/{id}
// // // // // //    */
// // // // // //   getById: async (id: string): Promise<Alumni | null> => {
// // // // // //     return alumniService.getBySlug(id);
// // // // // //   },

// // // // // //   update: async (id: string, payload: FormData): Promise<Alumni> => {
// // // // // //     const response = await apiClient.put(API_ENDPOINTS.ALUMNI.UPDATE(id), payload);
// // // // // //     let alumnusData = response.data.user || response.data.data || response.data;
// // // // // //     return mapBackendAlumniToFrontend(alumnusData);
// // // // // //   },
// // // // // // };

// // // // // // features/alumni/services/alumni.service.ts

// // // // // import { apiClient } from '@/lib/api/client';
// // // // // import { API_ENDPOINTS } from '@/lib/api/endpoints';
// // // // // import type { Alumni } from '@/features/alumni/types/alumni.types';
// // // // // import { mapBackendAlumniToFrontend, mapBackendAlumniList } from '../api/adapters/alumni.adapter';

// // // // // export interface GetAlumniParams {
// // // // //   search?: string;
// // // // //   year?: string;
// // // // //   page?: number;
// // // // //   limit?: number;
// // // // // }

// // // // // export const alumniService = {
// // // // //   /**
// // // // //    * Get all alumni
// // // // //    * GET /get_users_by_action
// // // // //    */
// // // // //   getAll: async (params?: GetAlumniParams): Promise<Alumni[]> => {
// // // // //     try {
// // // // //       const response = await apiClient.get(API_ENDPOINTS.ALUMNI.LIST, { params });

// // // // //       let alumniList = [];
// // // // //       if (response.data.users && Array.isArray(response.data.users)) {
// // // // //         alumniList = response.data.users;
// // // // //       } else if (Array.isArray(response.data)) {
// // // // //         alumniList = response.data;
// // // // //       } else if (response.data.data && Array.isArray(response.data.data)) {
// // // // //         alumniList = response.data.data;
// // // // //       } else {
// // // // //         alumniList = [];
// // // // //       }

// // // // //       return mapBackendAlumniList(alumniList);
// // // // //     } catch (error) {
// // // // //       console.error('Failed to fetch alumni:', error);
// // // // //       return [];
// // // // //     }
// // // // //   },

// // // // //   /**
// // // // //    * Get a single alumnus by ID
// // // // //    * GET /alumni/{id}
// // // // //    */
// // // // //   getById: async (id: string): Promise<Alumni | null> => {
// // // // //     try {
// // // // //       console.log('Fetching alumnus with ID:', id);
// // // // //       const response = await apiClient.get(API_ENDPOINTS.ALUMNI.DETAIL(id));
// // // // //       console.log('Alumnus response:', response.data);

// // // // //       let alumnusData = response.data.user || response.data.data || response.data;
// // // // //       if (!alumnusData) return null;
// // // // //       return mapBackendAlumniToFrontend(alumnusData);
// // // // //     } catch (error: any) {
// // // // //       if (error.response?.status === 404) {
// // // // //         console.log('Alumnus not found with ID:', id);
// // // // //         return null;
// // // // //       }
// // // // //       console.error('Failed to fetch alumnus:', error);
// // // // //       return null;
// // // // //     }
// // // // //   },

// // // // //   /**
// // // // //    * Get a single alumnus by slug (deprecated - use getById)
// // // // //    * Kept for backward compatibility
// // // // //    */
// // // // //   getBySlug: async (slug: string): Promise<Alumni | null> => {
// // // // //     console.warn('getBySlug is deprecated, use getById instead');
// // // // //     return null;
// // // // //   },

// // // // //   update: async (id: string, payload: FormData): Promise<Alumni> => {
// // // // //     const response = await apiClient.put(API_ENDPOINTS.ALUMNI.UPDATE(id), payload);
// // // // //     let alumnusData = response.data.user || response.data.data || response.data;
// // // // //     return mapBackendAlumniToFrontend(alumnusData);
// // // // //   },
// // // // // };

// // // // // features/alumni/services/alumni.service.ts

// // // // import { apiClient } from '@/lib/api/client';
// // // // import { API_ENDPOINTS } from '@/lib/api/endpoints';
// // // // import type { Alumni } from '@/features/alumni/types/alumni.types';
// // // // import { mapBackendAlumniToFrontend, mapBackendAlumniList } from '../api/adapters/alumni.adapter';

// // // // export interface GetAlumniParams {
// // // //   search?: string;
// // // //   year?: string;
// // // //   page?: number;
// // // //   limit?: number;
// // // // }

// // // // export const alumniService = {
// // // //   /**
// // // //    * Get all alumni
// // // //    * POST /get_users_by_action
// // // //    */
// // // //   getAll: async (params?: GetAlumniParams): Promise<Alumni[]> => {
// // // //     try {
// // // //       // Use POST - token will be injected by interceptor
// // // //       const response = await apiClient.post(API_ENDPOINTS.ALUMNI.LIST, params || {});

// // // //       // Handle response structure
// // // //       let alumniList = [];
// // // //       if (response.data.users && Array.isArray(response.data.users)) {
// // // //         alumniList = response.data.users;
// // // //       } else if (Array.isArray(response.data)) {
// // // //         alumniList = response.data;
// // // //       } else if (response.data.data && Array.isArray(response.data.data)) {
// // // //         alumniList = response.data.data;
// // // //       } else {
// // // //         alumniList = [];
// // // //       }

// // // //       return mapBackendAlumniList(alumniList);
// // // //     } catch (error) {
// // // //       console.error('Failed to fetch alumni:', error);
// // // //       return [];
// // // //     }
// // // //   },

// // // //   /**
// // // //    * Get a single alumnus by ID
// // // //    * POST /alumni/{id} with body { id: "1" }
// // // //    */
// // // //   getById: async (id: string): Promise<Alumni | null> => {
// // // //     try {
// // // //       console.log('Fetching alumnus with ID:', id);
// // // //       // Use POST with body containing the ID
// // // //       const response = await apiClient.post(API_ENDPOINTS.ALUMNI.DETAIL(id), { id });
// // // //       console.log('Alumnus response:', response.data);

// // // //       let alumnusData = response.data.user || response.data.data || response.data;
// // // //       if (!alumnusData) return null;
// // // //       return mapBackendAlumniToFrontend(alumnusData);
// // // //     } catch (error: any) {
// // // //       if (error.response?.status === 404) {
// // // //         console.log('Alumnus not found with ID:', id);
// // // //         return null;
// // // //       }
// // // //       console.error('Failed to fetch alumnus:', error);
// // // //       return null;
// // // //     }
// // // //   },

// // // //   /**
// // // //    * Update alumni profile
// // // //    * POST /alumni/{id} with form-data for file uploads
// // // //    */
// // // //   update: async (id: string, payload: FormData): Promise<Alumni> => {
// // // //     const response = await apiClient.post(API_ENDPOINTS.ALUMNI.UPDATE(id), payload, {
// // // //       headers: {
// // // //         'Content-Type': 'multipart/form-data',
// // // //       },
// // // //     });
// // // //     let alumnusData = response.data.user || response.data.data || response.data;
// // // //     return mapBackendAlumniToFrontend(alumnusData);
// // // //   },
// // // // };

// // // // features/alumni/services/alumni.service.ts

// // // import { apiClient } from '@/lib/api/client';
// // // import { API_ENDPOINTS } from '@/lib/api/endpoints';
// // // import type { Alumni } from '@/features/alumni/types/alumni.types';
// // // import { mapBackendAlumniToFrontend, mapBackendAlumniList } from '../api/adapters/alumni.adapter';

// // // export interface GetAlumniParams {
// // //   search?: string;
// // //   year?: string;
// // //   page?: number;
// // //   limit?: number;
// // // }

// // // export const alumniService = {
// // //   /**
// // //    * Get all alumni
// // //    * POST /get_users_by_action
// // //    */
// // //   getAll: async (params?: GetAlumniParams): Promise<Alumni[]> => {
// // //     try {
// // //       // Use POST - token will be injected by interceptor
// // //       const response = await apiClient.post(API_ENDPOINTS.ALUMNI.LIST, params || {});

// // //       // Handle response structure
// // //       let alumniList = [];
// // //       if (response.data.users && Array.isArray(response.data.users)) {
// // //         alumniList = response.data.users;
// // //       } else if (Array.isArray(response.data)) {
// // //         alumniList = response.data;
// // //       } else if (response.data.data && Array.isArray(response.data.data)) {
// // //         alumniList = response.data.data;
// // //       } else {
// // //         alumniList = [];
// // //       }

// // //       return mapBackendAlumniList(alumniList);
// // //     } catch (error) {
// // //       console.error('Failed to fetch alumni:', error);
// // //       return [];
// // //     }
// // //   },

// // //   /**
// // //    * Get a single alumnus by ID
// // //    * POST /get_users_by_action with body { user_id: "32" }
// // //    */
// // //   getById: async (id: string): Promise<Alumni | null> => {
// // //     try {
// // //       console.log('Fetching alumnus with ID:', id);
// // //       // Use the same endpoint as getAll, but with user_id in body
// // //       const response = await apiClient.post(API_ENDPOINTS.ALUMNI.LIST, { user_id: id });
// // //       console.log('Alumnus response:', response.data);

// // //       // Handle response - might be a single user or array with one user
// // //       let alumnusData = null;
// // //       if (response.data.user) {
// // //         alumnusData = response.data.user;
// // //       } else if (response.data.users && Array.isArray(response.data.users) && response.data.users.length > 0) {
// // //         alumnusData = response.data.users[0];
// // //       } else if (response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
// // //         alumnusData = response.data.data[0];
// // //       } else if (response.data && !Array.isArray(response.data)) {
// // //         alumnusData = response.data;
// // //       }

// // //       if (!alumnusData) return null;
// // //       return mapBackendAlumniToFrontend(alumnusData);
// // //     } catch (error: any) {
// // //       if (error.response?.status === 404) {
// // //         console.log('Alumnus not found with ID:', id);
// // //         return null;
// // //       }
// // //       console.error('Failed to fetch alumnus:', error);
// // //       return null;
// // //     }
// // //   },

// // //   /**
// // //    * Update alumni profile
// // //    * POST /update_profile (or similar - need to confirm)
// // //    */
// // //   update: async (id: string, payload: FormData): Promise<Alumni> => {
// // //     // TODO: Confirm the correct update endpoint
// // //     const response = await apiClient.post('/update_profile', payload, {
// // //       headers: {
// // //         'Content-Type': 'multipart/form-data',
// // //       },
// // //     });
// // //     let alumnusData = response.data.user || response.data.data || response.data;
// // //     return mapBackendAlumniToFrontend(alumnusData);
// // //   },
// // // };

// // // features/alumni/services/alumni.service.ts

// // import { apiClient } from '@/lib/api/client';
// // import { API_ENDPOINTS } from '@/lib/api/endpoints';
// // import type { Alumni } from '@/features/alumni/types/alumni.types';
// // import { mapBackendAlumniToFrontend, mapBackendAlumniList } from '../api/adapters/alumni.adapter';

// // export interface GetAlumniParams {
// //   search?: string;
// //   year?: string;
// //   page?: number;
// //   limit?: number;
// // }

// // export const alumniService = {
// //   /**
// //    * Get all alumni
// //    * POST /get_users_by_action
// //    */
// //   getAll: async (params?: GetAlumniParams): Promise<Alumni[]> => {
// //     try {
// //       const response = await apiClient.post(API_ENDPOINTS.ALUMNI.LIST, params || {});

// //       let alumniList = [];
// //       if (response.data.users && Array.isArray(response.data.users)) {
// //         alumniList = response.data.users;
// //       } else if (Array.isArray(response.data)) {
// //         alumniList = response.data;
// //       } else if (response.data.data && Array.isArray(response.data.data)) {
// //         alumniList = response.data.data;
// //       } else {
// //         alumniList = [];
// //       }

// //       return mapBackendAlumniList(alumniList);
// //     } catch (error) {
// //       console.error('Failed to fetch alumni:', error);
// //       return [];
// //     }
// //   },

// //   /**
// //    * Get a single alumnus by ID
// //    * POST /get_users_by_action with body { user_id: "38" }
// //    */
// //   getById: async (id: string): Promise<Alumni | null> => {
// //     try {
// //       console.log('🔍 Fetching alumnus with ID:', id);
// //       console.log('📤 Sending payload:', { user_id: id });

// //       const response = await apiClient.post(API_ENDPOINTS.ALUMNI.LIST, { user_id: id });
// //       console.log('📥 Full response:', response.data);
// //       console.log('📥 Response status:', response.status);
// //       console.log('📥 Response headers:', response.headers);

// //       // Log the response structure to understand what we're getting
// //       if (response.data) {
// //         console.log('Response data type:', typeof response.data);
// //         console.log('Response data keys:', Object.keys(response.data));

// //         // Check if it's an array or object
// //         if (Array.isArray(response.data)) {
// //           console.log('Response is an array with length:', response.data.length);
// //           console.log('First item:', response.data[0]);
// //         } else if (response.data.users) {
// //           console.log('Response has users array with length:', response.data.users.length);
// //           console.log('First user:', response.data.users[0]);
// //         } else if (response.data.user) {
// //           console.log('Response has single user:', response.data.user);
// //         }
// //       }

// //       // Try to extract the user with matching ID
// //       let alumnusData = null;

// //       if (response.data.users && Array.isArray(response.data.users)) {
// //         alumnusData = response.data.users.find((u: any) => String(u.id) === String(id));
// //         console.log('Found in users array:', alumnusData);
// //       }
// //       else if (response.data.user && String(response.data.user.id) === String(id)) {
// //         alumnusData = response.data.user;
// //         console.log('Found in user object:', alumnusData);
// //       }
// //       else if (Array.isArray(response.data)) {
// //         alumnusData = response.data.find((u: any) => String(u.id) === String(id));
// //         console.log('Found in direct array:', alumnusData);
// //       }
// //       else if (response.data.id && String(response.data.id) === String(id)) {
// //         alumnusData = response.data;
// //         console.log('Found in direct object:', alumnusData);
// //       }

// //       if (!alumnusData) {
// //         console.warn(`⚠️ No alumnus found with ID: ${id}`);
// //         console.log('Available users in response:',
// //           response.data.users?.map((u: any) => ({ id: u.id, name: u.name })) ||
// //           response.data.user?.id ||
// //           'No users found'
// //         );
// //         return null;
// //       }

// //       console.log('✅ Found alumnus:', { id: alumnusData.id, name: alumnusData.name });
// //       return mapBackendAlumniToFrontend(alumnusData);
// //     } catch (error: any) {
// //       console.error('❌ Failed to fetch alumnus:', error);
// //       console.error('Error response:', error.response?.data);
// //       console.error('Error status:', error.response?.status);
// //       return null;
// //     }
// //   },

// //   update: async (id: string, payload: FormData): Promise<Alumni> => {
// //     const response = await apiClient.post('/update_profile', payload, {
// //       headers: {
// //         'Content-Type': 'multipart/form-data',
// //       },
// //     });
// //     let alumnusData = response.data.user || response.data.data || response.data;
// //     return mapBackendAlumniToFrontend(alumnusData);
// //   },
// // };

// // features/alumni/services/alumni.service.ts - Cleaned up version

// import { apiClient } from '@/lib/api/client';
// import { API_ENDPOINTS } from '@/lib/api/endpoints';
// import type { Alumni } from '@/features/alumni/types/alumni.types';
// import { mapBackendAlumniToFrontend, mapBackendAlumniList } from '../api/adapters/alumni.adapter';

// export interface GetAlumniParams {
//   search?: string;
//   year?: string;
//   page?: number;
//   limit?: number;
// }

// export const alumniService = {
//   getAll: async (params?: GetAlumniParams): Promise<Alumni[]> => {
//     try {
//       const response = await apiClient.post(API_ENDPOINTS.ALUMNI.LIST, params || {});

//       let alumniList = [];
//       if (response.data.users && Array.isArray(response.data.users)) {
//         alumniList = response.data.users;
//       } else if (Array.isArray(response.data)) {
//         alumniList = response.data;
//       } else if (response.data.data && Array.isArray(response.data.data)) {
//         alumniList = response.data.data;
//       }

//       return mapBackendAlumniList(alumniList);
//     } catch (error) {
//       console.error('Failed to fetch alumni:', error);
//       return [];
//     }
//   },

//   getById: async (id: string): Promise<Alumni | null> => {
//     try {
//       const response = await apiClient.post(API_ENDPOINTS.ALUMNI.LIST, { user_id: id });

//       let alumnusData = null;
//       if (response.data.users && Array.isArray(response.data.users)) {
//         alumnusData = response.data.users.find((u: any) => String(u.id) === String(id));
//       } else if (response.data.user && String(response.data.user.id) === String(id)) {
//         alumnusData = response.data.user;
//       } else if (Array.isArray(response.data)) {
//         alumnusData = response.data.find((u: any) => String(u.id) === String(id));
//       }

//       if (!alumnusData) return null;
//       return mapBackendAlumniToFrontend(alumnusData);
//     } catch (error) {
//       console.error('Failed to fetch alumnus:', error);
//       return null;
//     }
//   },

//   update: async (id: string, payload: FormData): Promise<Alumni> => {
//     const response = await apiClient.post('/update_profile', payload, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     let alumnusData = response.data.user || response.data.data || response.data;
//     return mapBackendAlumniToFrontend(alumnusData);
//   },
// };

// features/alumni/services/alumni.service.ts - Cleaned up version

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Alumni } from '@/features/alumni/types/alumni.types';
import { mapBackendAlumniToFrontend, mapBackendAlumniList } from '../api/adapters/alumni.adapter';

export interface GetAlumniParams {
  search?: string;
  year?: string;
  page?: number;
  limit?: number;
}

export const alumniService = {
  getAll: async (params?: GetAlumniParams): Promise<Alumni[]> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ALUMNI.LIST, params || {});

      let alumniList = [];
      if (response.data.users && Array.isArray(response.data.users)) {
        alumniList = response.data.users;
      } else if (Array.isArray(response.data)) {
        alumniList = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        alumniList = response.data.data;
      }

      return mapBackendAlumniList(alumniList);
    } catch (error) {
      console.error('Failed to fetch alumni:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<Alumni | null> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ALUMNI.LIST, { user_id: id });

      let alumnusData = null;
      if (response.data.users && Array.isArray(response.data.users)) {
        alumnusData = response.data.users.find((u: any) => String(u.id) === String(id));
      } else if (response.data.user && String(response.data.user.id) === String(id)) {
        alumnusData = response.data.user;
      } else if (Array.isArray(response.data)) {
        alumnusData = response.data.find((u: any) => String(u.id) === String(id));
      }

      if (!alumnusData) return null;
      return mapBackendAlumniToFrontend(alumnusData);
    } catch (error) {
      console.error('Failed to fetch alumnus:', error);
      return null;
    }
  },

  update: async (id: string, payload: FormData): Promise<Alumni> => {
    const response = await apiClient.post('/update_profile', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    let alumnusData = response.data.user || response.data.data || response.data;
    return mapBackendAlumniToFrontend(alumnusData);
  },
};
