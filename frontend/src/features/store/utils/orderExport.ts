// features/store/utils/orderExport.ts
import type { Order, OrderItem } from '../types/order.types';

function formatOrderDateForExport(date?: string) {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatItemsSummary(items: OrderItem[]) {
  // e.g. "Third Product x12; Another Item x1"
  return (items ?? [])
    .map((item) => `${item.productName} x${item.quantity}`)
    .join('; ');
}

/**
 * Transforms Order[] into flat row objects ready for downloadCsvFile.
 * Every field is defaulted defensively — a malformed order should
 * degrade to blank cells, never throw and abort the whole export.
 */
export function buildOrderExportRows(orders: Order[]): Record<string, string>[] {
  return orders.map((order) => {
    if (!order.orderNumber) {
      console.warn(
        '[orderExport] order missing orderNumber, exporting with blank identifier',
        order,
      );
    }

    return {
      'Order Number': order.orderNumber ?? '',
      Status: order.status ?? '',
      'Date Placed': formatOrderDateForExport(order.placedAt),
      'Customer Name': order.customerFullName ?? '',
      'Customer Email': order.customerEmail ?? '',
      'Customer Phone': order.customerPhone ?? '',
      'Delivery Type': order.deliveryType ?? '',
      Address: order.address ?? '',
      Area: order.area ?? '',
      State: order.state ?? '',
      Items: formatItemsSummary(order.items),
      Subtotal: order.subtotal != null ? String(order.subtotal) : '',
      'Shipping Fee': order.shippingFee != null ? String(order.shippingFee) : '',
      Total: order.total != null ? String(order.total) : '',
    };
  });
}

export const ORDER_EXPORT_HEADERS = [
  'Order Number',
  'Status',
  'Date Placed',
  'Customer Name',
  'Customer Email',
  'Customer Phone',
  'Delivery Type',
  'Address',
  'Area',
  'State',
  'Items',
  'Subtotal',
  'Shipping Fee',
  'Total',
];