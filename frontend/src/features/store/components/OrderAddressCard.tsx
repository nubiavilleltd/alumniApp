// /feature/store/components/orders/AddressCard.tsx
import { MapPin } from 'lucide-react';
import { Order } from '../types/order.types';

interface OrderAddressCardProps {
  order: Order;
}

export default function OrderAddressCard({ order }: OrderAddressCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-1">
      <MapPin className="text-gray-400 mb-2" size={20} />
      <p className="text-gray-900 font-medium">{order.firstName} {order.lastName}</p>
      <p className="text-gray-900 leading-relaxed">
        {[order.address, order.landmark].filter(Boolean).join(', ')}, {order.area}, {order.state}
      </p>
      <p className="text-gray-900">{order.phone}</p>
    </div>
  );
}