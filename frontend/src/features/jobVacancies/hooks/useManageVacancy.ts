import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vacancyApi } from '../api/vacancyApi';
import { DeleteVacancyPayload, UpdateVacancyPayload } from '../types/jobVacancies.types';

export function useUpdateVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateVacancyPayload) => vacancyApi.updateVacancy(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['job-vacancies'],
      });
    },
  });
}

export function useDeleteVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteVacancyPayload) => vacancyApi.deleteVacancy(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['job-vacancies'],
      });
    },
  });
}
