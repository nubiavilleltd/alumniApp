import { useQuery } from '@tanstack/react-query';
import { vacancyApi } from '../api/vacancyApi';
import { vacancyToViewModel } from '../api/adapters';
import { GetVacanciesFilters } from '../types/jobVacancies.types';

export function useJobVacancies(filters: GetVacanciesFilters = {}) {
  return useQuery({
    queryKey: ['job-vacancies', filters],
    queryFn: async () => {
      const vacancies = await vacancyApi.getVacancies(filters);
      return vacancies.map(vacancyToViewModel);
    },
  });
}
