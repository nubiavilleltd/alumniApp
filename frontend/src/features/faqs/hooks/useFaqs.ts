import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/shared/components/ui/Toast';
import { useTokenStore } from '@/features/authentication/stores/useTokenStore';
import { faqService } from '../services/faq.service';
import type { CreateFaqInput, ReorderFaqInput, UpdateFaqInput } from '../services/faq.service';

export const faqKeys = {
  all: ['faqs'] as const,
  list: () => [...faqKeys.all, 'list'] as const,
};

export function usePublishedFaqs() {
  return useQuery({
    queryKey: faqKeys.list(),
    queryFn: () => faqService.getPublishedFaqs(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminFaqs() {
  const accessToken = useTokenStore((state) => state.accessToken);

  return useQuery({
    queryKey: [...faqKeys.list(), 'admin'] as const,
    queryFn: () => faqService.getAdminFaqs(),
    enabled: Boolean(accessToken),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateFaqInput) => faqService.createFaq(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.all });
    },
    onError: (error: any) => toast.fromError(error),
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateFaqInput) => faqService.updateFaq(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.all });
    },
    onError: (error: any) => toast.fromError(error),
  });
}

export function useReorderFaqs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (faqs: ReorderFaqInput[]) => faqService.reorderFaqs(faqs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.all });
    },
    onError: (error: any) => toast.fromError(error),
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => faqService.deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.all });
    },
    onError: (error: any) => toast.fromError(error),
  });
}
