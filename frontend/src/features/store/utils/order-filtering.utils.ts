// /feature/store/utils/order-filtering.utils.ts
import { Order } from '../types/order.types';

export interface OrderFilterOptions<TStatus extends string> {
  status: TStatus;
  statusMap: Record<string, Order['status'][]>;
  search: string;
  matchesSearch: (order: Order, searchLower: string) => boolean;
  dateFrom?: string;
  dateTo?: string;
}

/** Pure filtering pipeline: status -> search -> date range.
 * No React, no query cache — testable directly with plain arrays. */
export function filterOrders<TStatus extends string>(
  orders: Order[],
  { status, statusMap, search, matchesSearch, dateFrom = '', dateTo = '' }: OrderFilterOptions<TStatus>,
): Order[] {
  return orders.filter((order) => {
    if (status !== 'all') {
      const allowedStatuses = statusMap[status] || [];
      if (!allowedStatuses.includes(order.status)) return false;
    }

    if (search.trim()) {
      if (!matchesSearch(order, search.toLowerCase().trim())) return false;
    }

    if (dateFrom && order.placedAt < dateFrom) return false;
    if (dateTo && order.placedAt > dateTo) return false;

    return true;
  });
}