// /feature/store/components/orders/OrderInfoCard.tsx
import { ClipboardList } from 'lucide-react';
import CopyButton from '@/shared/components/ui/CopyButton';
import { Order } from '../types/order.types';

interface OrderInfoCardProps {
  order: Order;
  showPlacedBy?: boolean; // admin only
}

export default function OrderInfoCard({ order, showPlacedBy = false }: OrderInfoCardProps) {
  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : '—';

  const deliveryTypeLabel = order.deliveryType === 'delivery' ? 'Door Delivery' : 'Self Pickup';

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-3">
      <ClipboardList className="text-gray-400" size={20} />

      <div className="flex items-center gap-1 text-sm text-gray-500">
        <span>
          Order Number:
          <span className="text-gray-900 font-medium">
            {order.orderNumber || ''}
          </span>
        </span>
        <CopyButton value={order.orderNumber} />
      </div>

      {showPlacedBy && (
        <p className="text-sm text-gray-500">
          Order Placed By:{' '}
          <span className="text-gray-900 font-medium">{order.customerFullName}</span>
        </p>
      )}

      <p className="text-sm text-gray-500">
        Order Placed On: <span className="text-gray-900 font-medium">{formatDate(order.placedAt)}</span>
      </p>
      <p className="text-sm text-gray-500">
        Paid On: <span className="text-gray-900 font-medium">{formatDate(order.paidAt)}</span>
      </p>
      <p className="text-sm text-gray-500">
        Delivery Type: <span className="text-gray-900 font-medium">{deliveryTypeLabel}</span>
      </p>
    </div>
  );
}