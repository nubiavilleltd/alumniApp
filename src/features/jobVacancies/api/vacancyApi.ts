import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { apiClient } from '@/lib/api/client';

import {
  createDeleteVacancyPayload,
  createUpdateVacancyPayload,
  createVacancyFormData,
} from './adapters';
import {
  CreateVacancyPayload,
  DeleteVacancyPayload,
  GetVacanciesFilters,
  JobVacancy,
  UpdateVacancyPayload,
} from '../types/jobVacancies.types';

type GetVacanciesResponse = {
  status?: number;
  message?: string;
  vacancies?: JobVacancy[];
  data?: JobVacancy[];
};

type VacancyResponse = {
  status?: number;
  message?: string;
  vacancy?: JobVacancy;
  data?: JobVacancy;
};

export const vacancyApi = {
  async getVacancies(filters: GetVacanciesFilters = {}) {
    const response = await apiClient.post<GetVacanciesResponse>(
      API_ENDPOINTS.JOB_VACANCIES.GET,
      filters,
    );

    return response.data.vacancies ?? response.data.data ?? [];
  },

  async createVacancy(payload: CreateVacancyPayload) {
    const formData = createVacancyFormData(payload);

    const response = await apiClient.post<VacancyResponse>(
      API_ENDPOINTS.JOB_VACANCIES.CREATE,
      formData,
    );

    return response.data;
  },

  async updateVacancy(payload: UpdateVacancyPayload) {
    const response = await apiClient.post<VacancyResponse>(
      API_ENDPOINTS.JOB_VACANCIES.MANAGE,
      createUpdateVacancyPayload(payload),
    );

    return response.data;
  },

  async deleteVacancy(payload: DeleteVacancyPayload) {
    const response = await apiClient.post<VacancyResponse>(
      API_ENDPOINTS.JOB_VACANCIES.MANAGE,
      createDeleteVacancyPayload(payload.id),
    );

    return response.data;
  },
};
