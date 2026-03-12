import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { businesses, categories } from '@/data/site-data';

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

export const marketplaceService = {
  getAll: async (params?: GetMarketplaceParams) => {
    // 🔴 TODO: replace with real API call
    // const { data } = await apiClient.get(API_ENDPOINTS.MARKETPLACE.LIST, { params });
    // return data;


    // 🟢 MOCK — delete when API is ready
    return businesses;
  },

  getById: async (id: string) => {
    // 🔴 TODO: replace with real API call
    // const { data } = await apiClient.get(API_ENDPOINTS.MARKETPLACE.DETAIL(id));
    // return data;

    // 🟢 MOCK — delete when API is ready
    return businesses.find((b) => b.slug === id);
  },

  getCategories: async (): Promise<string[]> => {
    // 🔴 TODO: replace with real API call
    // const { data } = await apiClient.get(API_ENDPOINTS.MARKETPLACE.CATEGORIES);
    // return data;

    // 🟢 MOCK — delete when API is ready
    return categories;
  },

  create: async (payload: FormData) => {
    const { data } = await apiClient.post(API_ENDPOINTS.MARKETPLACE.CREATE, payload);
    return data;
  },

  update: async (id: string, payload: FormData) => {
    const { data } = await apiClient.put(API_ENDPOINTS.MARKETPLACE.UPDATE(id), payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.MARKETPLACE.DELETE(id));
  },
};
