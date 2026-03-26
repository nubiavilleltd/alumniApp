// import { apiClient } from '@/lib/api/client';
// import { API_ENDPOINTS } from '@/lib/api/endpoints';
// import { getAlumni, getAlumnusBySlug } from '@/data/site-data';
// import { defaultMockAccounts } from '@/features/authentication/constants/mockAccounts';
// import type { Alumni } from '@/features/alumni/types/alumni.types';

// export interface GetAlumniParams {
//   search?: string;
//   year?: string;
//   page?: number;
//   limit?: number;
// }

// // Build a fast lookup: memberId → accountStatus
// const accountStatusMap = new Map(defaultMockAccounts.map((a) => [a.memberId, a.accountStatus]));

// function isActiveAccount(memberId: string): boolean {
//   const status = accountStatusMap.get(memberId);
//   // If no account found (shouldn't happen), show them
//   // If account found, only show active members
//   return !status || status === 'active';
// }

// export const alumniService = {
//   getAll: async (_params?: GetAlumniParams): Promise<Alumni[]> => {
//     // 🔴 TODO: replace with real API call
//     // const { data } = await apiClient.post(API_ENDPOINTS.ALUMNI.LIST, { ..._params });
//     // return data;

//     // Filter out suspended/closed accounts
//     return getAlumni().filter((a) => isActiveAccount(a.memberId));
//   },

//   getBySlug: async (slug: string): Promise<Alumni | undefined> => {
//     // 🔴 TODO: replace with real API call
//     // const { data } = await apiClient.post(API_ENDPOINTS.ALUMNI.DETAIL, { slug });
//     // return data;

//     const alumnus = getAlumnusBySlug(slug);
//     if (!alumnus) return undefined;

//     // Don't return profile of suspended/closed account
//     if (!isActiveAccount(alumnus.memberId)) return undefined;

//     return alumnus;
//   },

//   update: async (id: string, payload: FormData): Promise<Alumni> => {
//     const { data } = await apiClient.put(API_ENDPOINTS.ALUMNI.UPDATE(id), payload);
//     return data;
//   },
// };

// import { apiClient } from '@/lib/api/client';
// import { API_ENDPOINTS } from '@/lib/api/endpoints';
// import { getAlumni, getAlumnusBySlug } from '@/data/site-data';
// import type { Alumni } from '@/features/alumni/types/alumni.types';

// export interface GetAlumniParams {
//   search?: string;
//   year?: string;
//   page?: number;
//   limit?: number;
// }

// export const alumniService = {
//   getAll: async (params?: GetAlumniParams): Promise<Alumni[]> => {
//     // 🔴 TODO: replace with real API call
//     // const { data } = await apiClient.get(API_ENDPOINTS.ALUMNI.LIST, { params });
//     // return data;

//     // 🟢 MOCK — delete when API is ready
//     return getAlumni();
//   },

//   getBySlug: async (slug: string): Promise<Alumni | undefined> => {
//     // 🔴 TODO: replace with real API call
//     // const { data } = await apiClient.get(API_ENDPOINTS.ALUMNI.DETAIL(slug));
//     // return data;
//     // 🟢 MOCK — delete when API is ready
//     return getAlumnusBySlug(slug);
//   },

//   update: async (id: string, payload: FormData): Promise<Alumni> => {
//     const { data } = await apiClient.put(API_ENDPOINTS.ALUMNI.UPDATE(id), payload);
//     return data;
//   },
// };

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { getAlumni, getAlumnusBySlug } from '@/data/site-data';
import { defaultMockAccounts } from '@/features/authentication/constants/mockAccounts';
import type { Alumni } from '@/features/alumni/types/alumni.types';
import { mapBackendAlumniList, mapBackendAlumniToFrontend } from '../api/adapters/alumni.adapter';

export interface GetAlumniParams {
  search?: string;
  year?: string;
  page?: number;
  limit?: number;
}

// Build a fast lookup: memberId → accountStatus
const accountStatusMap = new Map(defaultMockAccounts.map((a) => [a.memberId, a.accountStatus]));

function isActiveAccount(memberId: string): boolean {
  const status = accountStatusMap.get(memberId);
  // If no account found (shouldn't happen), show them
  // If account found, only show active members
  return !status || status === 'active';
}

export const alumniService = {
  getAll: async (_params?: GetAlumniParams): Promise<Alumni[]> => {
    // ═══════════════════════════════════════════════════════════════════
    // REAL API CALL (with adapter to handle messy backend data)
    // ═══════════════════════════════════════════════════════════════════
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.ALUMNI.LIST);

      // Transform messy backend data to clean frontend format
      const cleanedData = mapBackendAlumniList(data.users);

      // Filter out suspended/closed accounts (if needed)
      return cleanedData.filter((a) => isActiveAccount(a.memberId));
    } catch (error) {
      console.error('Failed to fetch alumni from API:', error);

      // ═══════════════════════════════════════════════════════════════
      // FALLBACK: Use mock data if API fails (for development)
      // ═══════════════════════════════════════════════════════════════
      console.warn('Falling back to mock data');
      return getAlumni().filter((a) => isActiveAccount(a.memberId));
    }
  },

  getBySlug: async (slug: string): Promise<Alumni | undefined> => {
    // ═══════════════════════════════════════════════════════════════════
    // REAL API CALL (with adapter to handle messy backend data)
    // ═══════════════════════════════════════════════════════════════════
    try {
      const { data } = await apiClient.get(API_ENDPOINTS.ALUMNI.DETAIL(slug));

      // Transform messy backend data to clean frontend format
      const alumnus = mapBackendAlumniToFrontend(data);

      // Don't return profile of suspended/closed account
      if (!isActiveAccount(alumnus.memberId)) return undefined;

      return alumnus;
    } catch (error: any) {
      // If 404, alumnus doesn't exist
      if (error.response?.status === 404) {
        return undefined;
      }

      console.error('Failed to fetch alumnus from API:', error);

      // ═══════════════════════════════════════════════════════════════
      // FALLBACK: Use mock data if API fails (for development)
      // ═══════════════════════════════════════════════════════════════
      console.warn('Falling back to mock data for slug:', slug);
      const alumnus = getAlumnusBySlug(slug);
      if (!alumnus) return undefined;
      if (!isActiveAccount(alumnus.memberId)) return undefined;
      return alumnus;
    }
  },

  update: async (id: string, payload: FormData): Promise<Alumni> => {
    const { data } = await apiClient.put(API_ENDPOINTS.ALUMNI.UPDATE(id), payload);
    return data;
  },
};
