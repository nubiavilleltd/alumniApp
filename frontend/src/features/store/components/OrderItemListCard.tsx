// /feature/store/components/orders/OrderItemListCard.tsx

import { FlattenedOrderItem } from '../types/order.types';
import { OrderStatusBadge } from './OrderStatusBadge';
import CopyButton from '@/shared/components/ui/CopyButton';

interface OrderItemListCardProps {
  flatItem: FlattenedOrderItem;
  action?: React.ReactNode;
  onAddToCart?: (flatItem: FlattenedOrderItem) => void;
}

export default function OrderItemListCard({
  flatItem,
  action,
  onAddToCart,
}: OrderItemListCardProps) {
  const { item, status, placedAt, orderNumber, lineTotal } = flatItem;

  const formattedDate = new Date(placedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const relativeDate = (() => {
    const diffDays = Math.floor(
      (Date.now() - new Date(placedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return formattedDate;
  })();

  return (
    <div className="bg-white rounded-2xl p-7">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <OrderStatusBadge status={status} />
          <span className="text-gray-300">•</span>
          <span className="text-gray-500">{relativeDate}</span>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex gap-1">
            <span className="text-sm text-gray-500">
              Order Number:{' '}
              <span className="text-gray-700">
                {orderNumber || 'Not populated by the backend dev'}
              </span>
            </span>
            <CopyButton value={orderNumber} />
          </div>
          {action}
        </div>
      </div>

      {/* Single item row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={item.image}
              alt={item.productName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {item.productName}
            </p>
            <p className="text-sm text-gray-600">
              ₦{item.price.toLocaleString()} × {item.quantity}
            </p>
            {item.color && item.size && (
              <p className="text-xs text-gray-400">
                {item.color}/{item.size}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
            Total: ₦{lineTotal.toLocaleString()}
          </p>
          {onAddToCart && (
            <button
              type="button"
              onClick={() => onAddToCart(flatItem)}
              className="text-xs bg-primary-500 hover:bg-primary-600 text-white px-4 py-1.5 rounded-full transition-colors"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}