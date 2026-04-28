// // features/projects/services/projects.service.ts

// import { apiClient } from '@/lib/api/client';
// import { API_ENDPOINTS } from '@/lib/api/endpoints';
// import { handleApiError } from '@/lib/errors/apiErrorHandler';
// import { getProjects, getProjectById } from '@/data/site-data';
// import type { DonatePayload, Project } from '@/features/projects/types/project.types';
// import { mapBackendProject } from '../adapters/project.adapter';

// export const projectsService = {
//   async getAll(): Promise<Project[]> {
//     try {
//       const { data } = await apiClient.post(API_ENDPOINTS.PROJECTS.LIST);

//       console.log('from back', { data, projects: data.projects });

//       return (data.projects ?? []).map(mapBackendProject);
//     } catch (error) {
//       throw handleApiError(error, 'Unable to load projects.', 'projectsService.getAll');
//     }
//   },

//   async getById(id: string): Promise<Project | undefined> {
//     try {
//       const { data } = await apiClient.post(API_ENDPOINTS.PROJECTS.LIST, {
//         id,
//       });

//       return data.projects?.[0]; // backend returns array
//     } catch (error: any) {
//       if (error.response?.status === 404) return undefined;

//       throw handleApiError(error, 'Unable to load this project.', 'projectsService.getById');
//     }
//   },

//   async donate(id: string, payload: DonatePayload): Promise<void> {
//     try {
//       await apiClient.post(API_ENDPOINTS.PROJECTS.DONATE(id), payload);
//     } catch (error) {
//       throw handleApiError(
//         error,
//         'Your donation could not be processed. Please try again.',
//         'projectsService.donate',
//       );
//     }
//   },
// };

// features/projects/services/projects.service.ts

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import type {
  DonatePayload,
  Project,
  CreateProjectFormData,
  UpdateProjectFormData,
} from '../types/project.types';
import {
  mapBackendProject,
  mapBackendProjectList,
  mapGetProjectsPayload,
  mapGetSingleProjectPayload,
  mapProjectToCreatePayload,
  mapProjectToDeletePayload,
  mapProjectToUpdatePayload,
} from '../adapters/project.adapter';

export const projectsService = {
  /** Fetch all projects. POST /get_projects */
  async getAll(params?: { limit?: number; offset?: number }): Promise<Project[]> {
    try {
      const { data } = await apiClient.post(
        API_ENDPOINTS.PROJECTS.LIST,
        mapGetProjectsPayload(params),
      );
      return mapBackendProjectList(data.projects ?? data.data ?? []);
    } catch (error) {
      throw handleApiError(error, 'Unable to load projects.', 'projectsService.getAll');
    }
  },

  /** Fetch a single project by ID. POST /get_projects { id } */
  async getById(id: string): Promise<Project | undefined> {
    try {
      const { data } = await apiClient.post(
        API_ENDPOINTS.PROJECTS.LIST,
        mapGetSingleProjectPayload(id),
      );
      const raw = data.projects?.[0] ?? data.project ?? null;
      if (!raw) return undefined;
      return mapBackendProject(raw);
    } catch (error: any) {
      if (error.response?.status === 404) return undefined;
      throw handleApiError(error, 'Unable to load this project.', 'projectsService.getById');
    }
  },

  /** Create a new project (admin only). POST /create_project */
  async create(formData: CreateProjectFormData): Promise<Project> {
    try {
      const payload = mapProjectToCreatePayload(formData);
      const { data } = await apiClient.post(API_ENDPOINTS.PROJECTS.CREATE, payload);
      const created = data.project ?? data.data ?? null;
      if (created?.id) return mapBackendProject(created);
      const newId = data.id ?? data.project_id;
      if (newId) {
        const fetched = await projectsService.getById(String(newId));
        if (fetched) return fetched;
      }
      throw new Error('Project created but response did not include project data.');
    } catch (error) {
      throw handleApiError(
        error,
        'Failed to create the project. Please try again.',
        'projectsService.create',
      );
    }
  },

  /** Update an existing project (admin only). POST /manage_project */
  async update(id: string, formData: UpdateProjectFormData): Promise<Project> {
    try {
      const payload = mapProjectToUpdatePayload(id, formData);
      const { data } = await apiClient.post(API_ENDPOINTS.PROJECTS.MANAGE, payload);
      const updated = data.project ?? data.data ?? null;
      if (updated?.id) return mapBackendProject(updated);
      const refetched = await projectsService.getById(id);
      if (!refetched) throw new Error('Project updated but could not be retrieved.');
      return refetched;
    } catch (error) {
      throw handleApiError(
        error,
        'Failed to update the project. Please try again.',
        'projectsService.update',
      );
    }
  },

  /** Delete a project (admin only). POST /manage_project */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.PROJECTS.MANAGE, mapProjectToDeletePayload(id));
    } catch (error) {
      throw handleApiError(
        error,
        'Failed to delete the project. Please try again.',
        'projectsService.delete',
      );
    }
  },

  /** Donate to a project. */
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
