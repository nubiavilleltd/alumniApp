// import { useMemo } from "react";
// import { OrderService } from "../services/order.service";
// import { OrderStatus } from "../types/order.types";
// import { useOrdersBase } from "./useOrdersBase";

// export const orderKeys = {
//   all: ['orders'] as const,
//   list: () => [...orderKeys.all, 'list'] as const,
//   detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
// };

// interface UseOrdersParams {
//   search?: string;
//   status?: string; // 'all' | 'processing' | 'out_for_delivery' | 'completed'
// }

// const statusMap: Record<string, OrderStatus[]> = {
//   'processing': ['Processing'],
//   'out_for_delivery': ['Out for Delivery', 'Ready for Pickup'],
//   'completed': ['Completed'],
// };

// export function useOrders(params: UseOrdersParams = {}) {
//   const { search = '', status = 'all' } = params;

//   const base = useOrdersBase({
//     queryKey: orderKeys.list(),
//     queryFn: () => OrderService.getOrders(),
//     search,
//     status,
//     statusMap,
//     matchesSearch: (order, searchLower) =>
//       !!order.orderNumber?.toLowerCase().includes(searchLower) ||
//       !!order.items?.some((item) =>
//         item.productName?.toLowerCase().includes(searchLower)
//       ),
//   });

//   const counts = useMemo(() => {
//     const orders = base.allOrders;
//     return {
//       total: orders.length,
//       processing: orders.filter((o) => o.status === 'Processing').length,
//       outForDelivery: orders.filter(
//         (o) => o.status === 'Out for Delivery' || o.status === 'Ready for Pickup'
//       ).length,
//       completed: orders.filter((o) => o.status === 'Completed').length,
//     };
//   }, [base.allOrders]);

//   return { ...base, counts };
// }








// // useOrders.ts

// import { useMemo } from "react";
// import { OrderService } from "../services/order.service";
// import { FlattenedOrderItem, OrderStatus } from "../types/order.types";
// import { useOrdersBase } from "./useOrdersBase";

// export const orderKeys = {
//   all: ['orders'] as const,
//   list: () => [...orderKeys.all, 'list'] as const,
//   detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
// };

// interface UseOrdersParams {
//   search?: string;
//   status?: string;
// }

// const statusMap: Record<string, OrderStatus[]> = {
//   'processing': ['Processing'],
//   'out_for_delivery': ['Out for Delivery', 'Ready for Pickup'],
//   'completed': ['Completed'],
// };

// export function useOrders(params: UseOrdersParams = {}) {
//   const { search = '', status = 'all' } = params;

//   const base = useOrdersBase({
//     queryKey: orderKeys.list(),
//     queryFn: () => OrderService.getOrders(),
//     search,
//     status,
//     statusMap,
//     matchesSearch: (order, searchLower) =>
//       !!order.orderNumber?.toLowerCase().includes(searchLower) ||
//       !!order.items?.some((item) =>
//         item.productName?.toLowerCase().includes(searchLower)
//       ),
//   });

//   // Counts stay based on ORDERS, not flattened items — "Processing (1)"
//   // means 1 order, matching screenshot 1. Flag me if that's wrong.
//   const counts = useMemo(() => {
//     const orders = base.allOrders;
//     return {
//       total: orders.length,
//       processing: orders.filter((o) => o.status === 'Processing').length,
//       outForDelivery: orders.filter(
//         (o) => o.status === 'Out for Delivery' || o.status === 'Ready for Pickup'
//       ).length,
//       completed: orders.filter((o) => o.status === 'Completed').length,
//     };
//   }, [base.allOrders]);

//   // Flatten: expand each already-filtered order's items into its own row.
//   const flattenedItems = useMemo<FlattenedOrderItem[]>(() => {
//     return base.orders.flatMap((order) =>
//       order.items.map((item) => ({
//         id: `${order.id}-${item.id}`,
//         orderId: order.id,
//         orderNumber: order.orderNumber,
//         status: order.status,
//         placedAt: order.placedAt,
//         item,
//         lineTotal: item.price * item.quantity,
//       }))
//     );
//   }, [base.orders]);

//   return { ...base, counts, flattenedItems };
// }







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