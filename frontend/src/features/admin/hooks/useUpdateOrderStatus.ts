import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminOrderService } from '../services/adminOrder.service';
import { adminOrderKeys } from './useAdminOrders';
import type { RawOrderStatus } from '@/features/store/utils/order.utils';

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: RawOrderStatus }) =>
      AdminOrderService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminOrderKeys.all });
    },
  });
}