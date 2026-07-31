import { useMemo } from "react";
import { OrderService } from "../services/order.service";
import { FlattenedOrderItem, OrderStatus } from "../types/order.types";
import { useOrdersBase } from "./useOrdersBase";
import { flattenOrders, filterFlattenedItems } from "../utils/order.utils";

export const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
};

interface UseOrdersParams {
  search?: string;
  status?: string;
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
    search: '', // search is applied post-flatten below, not here
    status,
    statusMap,
    matchesSearch: () => true, // unused — search is always '' at this level
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

  const flattenedItems = useMemo<FlattenedOrderItem[]>(() => {
    const flat = flattenOrders(base.orders); // status-filtered orders only
    return filterFlattenedItems(flat, search);
  }, [base.orders, search]);

  return { ...base, counts, flattenedItems };
}