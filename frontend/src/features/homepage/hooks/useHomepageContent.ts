import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/shared/components/ui/Toast';
import { useTokenStore } from '@/features/authentication/stores/useTokenStore';
import { homepageService } from '../services/homepage.service';
import type {
  CreateCarouselImageInput,
  ReorderCarouselImageInput,
  UpdateCarouselImageInput,
  UpdateHomepageTextInput,
} from '../services/homepage.service';

export const homepageContentKeys = {
  all: ['homepage-content'] as const,
  detail: () => [...homepageContentKeys.all, 'detail'] as const,
};

export function useHomepageContent() {
  return useQuery({
    queryKey: homepageContentKeys.detail(),
    queryFn: () => homepageService.getHomepage(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminHomepageContent() {
  const accessToken = useTokenStore((state) => state.accessToken);

  return useQuery({
    queryKey: [...homepageContentKeys.detail(), 'admin'] as const,
    queryFn: () => homepageService.getHomepage({ admin: true }),
    enabled: Boolean(accessToken),
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateHomepageText() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateHomepageTextInput) => homepageService.updateHomepageText(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homepageContentKeys.all });
    },
    onError: (error: any) => toast.fromError(error),
  });
}

export function useCreateCarouselImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCarouselImageInput) => homepageService.createCarouselImage(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homepageContentKeys.all });
    },
    onError: (error: any) => toast.fromError(error),
  });
}

export function useUpdateCarouselImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCarouselImageInput) => homepageService.updateCarouselImage(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homepageContentKeys.all });
    },
    onError: (error: any) => toast.fromError(error),
  });
}

export function useReorderCarousel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (images: ReorderCarouselImageInput[]) => homepageService.reorderCarousel(images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homepageContentKeys.all });
    },
    onError: (error: any) => toast.fromError(error),
  });
}

export function useDeleteCarouselImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => homepageService.deleteCarouselImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homepageContentKeys.all });
    },
    onError: (error: any) => toast.fromError(error),
  });
}
