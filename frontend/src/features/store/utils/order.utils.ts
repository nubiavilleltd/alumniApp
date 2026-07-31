// /feature/store/utils/order.utils.ts

import { Order, FlattenedOrderItem } from '../types/order.types';
import { AdminOrderStatus } from '../types/order.types';
import { DeliveryMethod } from '../types/checkout.types';

/** Expands each order's items into individual rows, each carrying
 * the shared fields it inherits from its parent order. */
export function flattenOrders(orders: Order[]): FlattenedOrderItem[] {
  return orders.flatMap((order) =>
    order.items.map((item) => ({
      id: `${order.id}-${item.id}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      placedAt: order.placedAt,
      item,
      lineTotal: item.price * item.quantity,
    }))
  );
}

/** Item-level search over already-flattened rows: a row matches if
 * its OWN item's name matches, or its parent order's number matches.
 * Sibling items in the same order that don't match are excluded. */
export function filterFlattenedItems(
  flatItems: FlattenedOrderItem[],
  search: string,
): FlattenedOrderItem[] {
  const searchLower = search.trim().toLowerCase();
  if (!searchLower) return flatItems;

  return flatItems.filter((row) => {
    const orderNumberMatch = row.orderNumber?.toLowerCase().includes(searchLower);
    const productNameMatch = row.item.productName?.toLowerCase().includes(searchLower);
    return orderNumberMatch || productNameMatch;
  });
}



export type RawOrderStatus = 'shipped' | 'delivered';

interface StatusTransition {
  buttonLabel: string;
  nextRawStatus: RawOrderStatus;
}

/** Drives the admin "Mark as X" button. Only forward transitions are
 * possible — returns null (no button rendered) once Completed, so an
 * order can never be moved backward or skipped from this UI. */
export function getNextStatusTransition(
  status: AdminOrderStatus,
  deliveryType: DeliveryMethod,
): StatusTransition | null {
  switch (status) {
    case 'New Order':
      return {
        buttonLabel: deliveryType === 'delivery' ? 'Mark as Out for Delivery' : 'Mark as Ready for Pickup',
        nextRawStatus: 'shipped',
      };
    case 'Out for Delivery':
    case 'Ready for Pickup':
      return { buttonLabel: 'Mark as Completed', nextRawStatus: 'delivered' };
    case 'Completed':
    default:
      return null;
  }
}