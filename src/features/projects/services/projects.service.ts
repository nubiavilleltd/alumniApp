// features/projects/services/projects.service.ts

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import { getProjects, getProjectById } from '@/data/site-data';
import type { DonatePayload, Project } from '@/features/projects/types/project.types';
import { mapBackendProject } from '../adapters/project.adapter';

export const projectsService = {
  async getAll(): Promise<Project[]> {
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.PROJECTS.LIST, {
        token: import.meta.env.VITE_API_TOKEN,
      });

      console.log('from back', { data, projects: data.projects });

      return (data.projects ?? []).map(mapBackendProject);
    } catch (error) {
      throw handleApiError(error, 'Unable to load projects.', 'projectsService.getAll');
    }
  },

  async getById(id: string): Promise<Project | undefined> {
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.PROJECTS.LIST, {
        id,
      });

      return data.projects?.[0]; // backend returns array
    } catch (error: any) {
      if (error.response?.status === 404) return undefined;

      throw handleApiError(error, 'Unable to load this project.', 'projectsService.getById');
    }
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
