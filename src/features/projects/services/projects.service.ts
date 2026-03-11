import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { getProjects, getProjectById } from '@/data/site-data';
import type { DonatePayload, Project } from '@/features/projects/types/project.types';

export const projectsService = {
  getAll: async (): Promise<Project[]> => {
    // 🔴 TODO: replace with real API call
    // const { data } = await apiClient.get(API_ENDPOINTS.PROJECTS.LIST);
    // return data;

    // 🟢 MOCK — delete when API is ready
    return getProjects();
  },

  getById: async (id: string): Promise<Project | undefined> => {
    // 🔴 TODO: replace with real API call
    // const { data } = await apiClient.get(API_ENDPOINTS.PROJECTS.DETAIL(id));
    // return data;

    // 🟢 MOCK — delete when API is ready
    return getProjectById(id);
  },

  donate: async (id: string, payload: DonatePayload): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.PROJECTS.DONATE(id), payload);
  },
};
