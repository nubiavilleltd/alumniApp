import { useMemo } from "react";
import { AdminOrderStatus } from "@/features/store/types/order.types";
import { AdminOrderService } from "../services/adminOrder.service";
import { useOrdersBase } from "@/features/store/hooks/useOrdersBase";

export const adminOrderKeys = {
  all: ['admin-orders'] as const,
  list: () => [...adminOrderKeys.all, 'list'] as const,
  detail: (id: string) => [...adminOrderKeys.all, 'detail', id] as const,
};

interface UseAdminOrdersParams {
  search?: string;
  status?: string; // 'all' | 'new_order' | 'out_for_delivery' | 'completed'
  dateFrom?: string;
  dateTo?: string;
}

const statusMap: Record<string, AdminOrderStatus[]> = {
  'new_order': ['New Order'],
  'out_for_delivery': ['Out for Delivery', 'Ready for Pickup'],
  'completed': ['Completed'],
};

export function useAdminOrders(params: UseAdminOrdersParams = {}) {
  const { search = '', status = 'all', dateFrom = '', dateTo = '' } = params;

  const base = useOrdersBase({
    queryKey: adminOrderKeys.list(),
    queryFn: () => AdminOrderService.getAdminOrders(),
    search,
    status,
    statusMap,
    dateFrom,
    dateTo,
    matchesSearch: (order, searchLower) => {
      if (order.orderNumber?.toLowerCase().includes(searchLower)) return true;
      const fullName = `${order.firstName} ${order.lastName}`.toLowerCase();
      return fullName.includes(searchLower);
    },
  });

  const counts = useMemo(() => {
    const orders = base.allOrders;
    return {
      total: orders.length,
      newOrders: orders.filter((o) => o.status === 'New Order').length,
      outForDelivery: orders.filter(
        (o) => o.status === 'Out for Delivery' || o.status === 'Ready for Pickup'
      ).length,
      completed: orders.filter((o) => o.status === 'Completed').length,
    };
  }, [base.allOrders]);

  return { ...base, counts };
}