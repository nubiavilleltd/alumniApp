import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { getAlumni, getAlumnusBySlug } from '@/data/site-data';
import type { Alumni } from '@/features/alumni/types/alumni.types';

export interface GetAlumniParams {
  search?: string;
  year?: string;
  page?: number;
  limit?: number;
}

export const alumniService = {
  getAll: async (params?: GetAlumniParams): Promise<Alumni[]> => {
    // 🔴 TODO: replace with real API call
    // const { data } = await apiClient.get(API_ENDPOINTS.ALUMNI.LIST, { params });
    // return data;

    // 🟢 MOCK — delete when API is ready
    return getAlumni();
  },

  getBySlug: async (slug: string): Promise<Alumni | undefined> => {
    // 🔴 TODO: replace with real API call
    // const { data } = await apiClient.get(API_ENDPOINTS.ALUMNI.DETAIL(slug));
    // return data;

    // 🟢 MOCK — delete when API is ready
    return getAlumnusBySlug(slug);
  },

  update: async (id: string, payload: FormData): Promise<Alumni> => {
    const { data } = await apiClient.put(API_ENDPOINTS.ALUMNI.UPDATE(id), payload);
    return data;
  },
};
