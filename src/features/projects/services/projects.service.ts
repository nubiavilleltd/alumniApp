// import { apiClient } from '@/lib/api/client';
// import { API_ENDPOINTS } from '@/lib/api/endpoints';
// import { getProjects, getProjectById } from '@/data/site-data';
// import type { DonatePayload, Project } from '@/features/projects/types/project.types';

// export const projectsService = {
//   getAll: async (): Promise<Project[]> => {
//     // 🔴 TODO: replace with real API call
//     // const { data } = await apiClient.get(API_ENDPOINTS.PROJECTS.LIST);
//     // return data;
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     // 🟢 MOCK — delete when API is ready
//     return getProjects();
//   },

//   getById: async (id: string): Promise<Project | undefined> => {
//     // 🔴 TODO: replace with real API call
//     // const { data } = await apiClient.get(API_ENDPOINTS.PROJECTS.DETAIL(id));
//     // return data;

//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     // 🟢 MOCK — delete when API is ready
//     return getProjectById(id);
//   },

//   donate: async (id: string, payload: DonatePayload): Promise<void> => {
//     await apiClient.post(API_ENDPOINTS.PROJECTS.DONATE(id), payload);
//   },
// };

// features/projects/services/projects.service.ts

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import { getProjects, getProjectById } from '@/data/site-data';
import type { DonatePayload, Project } from '@/features/projects/types/project.types';

export const projectsService = {
  async getAll(): Promise<Project[]> {
    // 🔴 TODO: replace mock with real API call when endpoint is available
    // try {
    //   const { data } = await apiClient.post(API_ENDPOINTS.PROJECTS.LIST);
    //   return data.projects ?? data.data ?? data;
    // } catch (error) {
    //   throw handleApiError(error, 'Unable to load projects.', 'projectsService.getAll');
    // }
    return getProjects();
  },

  async getById(id: string): Promise<Project | undefined> {
    // 🔴 TODO: replace mock with real API call when endpoint is available
    // try {
    //   const { data } = await apiClient.post(API_ENDPOINTS.PROJECTS.DETAIL(id));
    //   return data.project ?? data.data ?? data;
    // } catch (error: any) {
    //   if (error.response?.status === 404) return undefined;
    //   throw handleApiError(error, 'Unable to load this project.', 'projectsService.getById');
    // }
    return getProjectById(id);
  },

  async donate(id: string, payload: DonatePayload): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.PROJECTS.DONATE(id), payload);
    } catch (error) {
      throw handleApiError(
        error,
        'Your donation could not be processed. Please try again.',
        'projectsService.donate',
      );
    }
  },
};
