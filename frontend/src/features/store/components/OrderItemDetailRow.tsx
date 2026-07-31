
// /feature/store/components/orders/OrderItemDetailRow.tsx

import { OrderItem } from "../types/order.types";

interface OrderItemDetailRowProps {
  item: OrderItem;
  action?: React.ReactNode;
}

export default function OrderItemDetailRow({ item, action }: OrderItemDetailRowProps) {
  return (
    <div className="flex justify-between bg-white rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-start gap-4 min-w-0">
        <div className="w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
          <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-base sm:text-lg text-gray-800 line-clamp-2 sm:truncate">{item.productName}</p>
          <p className="text-gray-900">
            <span className="font-bold">₦{item.price.toLocaleString()}</span>{' '}
            <span className="text-gray-500">×{item.quantity}</span>
          </p>
          {(item.color || item.size) && (
            <p className="text-sm text-gray-500">{[item.color, item.size].filter(Boolean).join('/')}</p>
          )}
        </div>
      </div>

      {action && <div className="w-full sm:w-auto flex-shrink-0">{action}</div>}
    </div>
  );
}