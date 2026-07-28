import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/shared/components/ui/Toast';
import { adminStoreService } from '../services/adminStore.service';
import type { CreateProductFormData, PinProductPayload, UpdateProductFormData } from '../types/adminStore.types';

export const adminStoreKeys = {
  all: ['admin-products'] as const,
  list: () => [...adminStoreKeys.all, 'list'] as const,
};

export function useAdminProducts() {
  return useQuery({
    queryKey: adminStoreKeys.list(),
    queryFn: () => adminStoreService.fetchAll(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductFormData) => adminStoreService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminStoreKeys.all });
      toast.success('Product created successfully.');
    },
    onError: (error: any) => toast.fromError(error),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProductFormData) => adminStoreService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminStoreKeys.all });
      toast.success('Product updated successfully.');
    },
    onError: (error: any) => toast.fromError(error),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => adminStoreService.delete(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminStoreKeys.all });
      toast.success('Product deleted.');
    },
    onError: (error: any) => toast.fromError(error),
  });
}
export function usePinProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data:PinProductPayload) => adminStoreService.pin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminStoreKeys.all })

    },
    onError: (error: any) => console.log(error),
  });
}