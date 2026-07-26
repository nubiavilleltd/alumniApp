import { useMemo } from "react";
import { OrderService } from "../services/order.service";
import { OrderStatus } from "../types/order.types";
import { useOrdersBase } from "./useOrdersBase";

export const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
};

interface UseOrdersParams {
  search?: string;
  status?: string; // 'all' | 'processing' | 'out_for_delivery' | 'completed'
}

const statusMap: Record<string, OrderStatus[]> = {
  'processing': ['Processing'],
  'out_for_delivery': ['Out for Delivery', 'Ready for Pickup'],
  'completed': ['Completed'],
};

export function useOrders(params: UseOrdersParams = {}) {
  const { search = '', status = 'all' } = params;

  const base = useOrdersBase({
    queryKey: orderKeys.list(),
    queryFn: () => OrderService.getOrders(),
    search,
    status,
    statusMap,
    matchesSearch: (order, searchLower) =>
      !!order.orderNumber?.toLowerCase().includes(searchLower) ||
      !!order.items?.some((item) =>
        item.productName?.toLowerCase().includes(searchLower)
      ),
  });

  const counts = useMemo(() => {
    const orders = base.allOrders;
    return {
      total: orders.length,
      processing: orders.filter((o) => o.status === 'Processing').length,
      outForDelivery: orders.filter(
        (o) => o.status === 'Out for Delivery' || o.status === 'Ready for Pickup'
      ).length,
      completed: orders.filter((o) => o.status === 'Completed').length,
    };
  }, [base.allOrders]);

  return { ...base, counts };
}