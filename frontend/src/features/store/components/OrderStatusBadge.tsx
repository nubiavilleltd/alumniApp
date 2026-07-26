// /feature/store/components/orders/OrderStatusBadge.tsx

import { AdminOrderStatus, OrderStatus } from "../types/order.types";


interface OrderStatusBadgeProps {
  status: OrderStatus | AdminOrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
const statusConfig: Record<OrderStatus | AdminOrderStatus, { label: string; className: string }> = {
    'Processing': {
      label: 'Processing',
      className: 'bg-blue-50 text-blue-600',
    },
    'New Order': {
      label: 'New Order',
      className: 'bg-orange-50 text-orange-600',
    },
    'Out for Delivery': {
      label: 'Out for Delivery',
      className: 'bg-orange-50 text-orange-600',
    },
    'Ready for Pickup': {
      label: 'Ready for Pickup',
      className: 'bg-purple-50 text-purple-600',
    },
    'Completed': {
      label: 'Completed',
      className: 'bg-green-50 text-green-600',
    },
  };

  const config = statusConfig[status] || {
    label: status,
    className: 'bg-gray-50 text-gray-600',
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
}