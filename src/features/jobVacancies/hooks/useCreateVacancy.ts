import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vacancyApi } from '../api/vacancyApi';
import { CreateVacancyPayload } from '../types/jobVacancies.types';

export function useCreateVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVacancyPayload) => vacancyApi.createVacancy(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['job-vacancies'],
      });
    },
  });
}
