import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useMemo } from "react";
import { Order } from "../types/order.types";

interface UseOrdersBaseParams<TStatus extends string> {
  queryKey: readonly unknown[];
  queryFn: () => Promise<Order[]>;
  search: string;
  status: TStatus;
  statusMap: Record<string, Order['status'][]>;
  matchesSearch: (order: Order, searchLower: string) => boolean;
  dateFrom?: string;
  dateTo?: string;
  queryOptions?: Partial<UseQueryOptions<Order[]>>;
}

export function useOrdersBase<TStatus extends string>({
  queryKey,
  queryFn,
  search,
  status,
  statusMap,
  matchesSearch,
  dateFrom = '',
  dateTo = '',
  queryOptions,
}: UseOrdersBaseParams<TStatus>) {
  const query = useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5,
    ...queryOptions,
  });

  const filteredOrders = useMemo(() => {
    const orders = query.data || [];

    return orders.filter((order) => {
      if (status !== 'all') {
        const allowedStatuses = statusMap[status] || [];
        if (!allowedStatuses.includes(order.status)) {
          return false;
        }
      }

      if (search.trim()) {
        const searchLower = search.toLowerCase().trim();
        if (!matchesSearch(order, searchLower)) {
          return false;
        }
      }

      if (dateFrom && order.placedAt < dateFrom) return false;
      if (dateTo && order.placedAt > dateTo) return false;

      return true;
    });
  }, [query.data, search, status, dateFrom, dateTo, statusMap, matchesSearch]);

  return {
    orders: filteredOrders,
    allOrders: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    status: query.status,
  };
}