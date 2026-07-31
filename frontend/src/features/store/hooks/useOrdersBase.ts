import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useMemo } from "react";
import { Order } from "../types/order.types";
import { filterOrders } from "../utils/order-filtering.utils";

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

  const filteredOrders = useMemo(
    () => filterOrders(query.data || [], { status, statusMap, search, matchesSearch, dateFrom, dateTo }),
    [query.data, search, status, dateFrom, dateTo, statusMap, matchesSearch]
  );

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