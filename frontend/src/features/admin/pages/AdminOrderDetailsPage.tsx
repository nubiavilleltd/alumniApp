import { useParams } from 'react-router-dom';
import { SEO } from '@/shared/common/SEO';
import ContainerBackground from '@/shared/containers/ContainerBackground';
import { useAdminOrders } from '../hooks/useAdminOrders';
import { useUpdateOrderStatus } from '../hooks/useUpdateOrderStatus';
import { getNextStatusTransition } from '@/features/store/utils/order.utils';
import { AdminOrderStatus } from '@/features/store/types/order.types';
import { OrderStatusBadge } from '@/features/store/components/OrderStatusBadge';
import OrderInfoCard from '@/features/store/components/OrderInfoCard';
import OrderItemDetailRow from '@/features/store/components/OrderItemDetailRow';
import OrderSummaryCard from '@/features/store/components/OrderSummaryCard';
import OrderAddressCard from '@/features/store/components/OrderAddressCard';


export default function AdminOrderDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { orders, isLoading, isError, error } = useAdminOrders();
    const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

    const order = orders.find((o) => o.orderNumber === id);

    if (isLoading) {
        return <ContainerBackground><p>Loading order...</p></ContainerBackground>;
    }

    if (isError) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="text-red-500">Error loading order: {error?.message}</div>
            </div>
        );
    }

    if (!order) {
        return <ContainerBackground><p>Order not found.</p></ContainerBackground>;
    }

    const transition = getNextStatusTransition(order.status as AdminOrderStatus, order.deliveryType);

    return (
        <>
            <SEO title="Order Details" />

            <ContainerBackground>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <h1 className="type-section-title">Order Details</h1>
                        <OrderStatusBadge status={order.status} />
                    </div>

                    {transition && (
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={() => updateStatus({ orderId: order.id, status: transition.nextRawStatus })}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'Updating...' : transition.buttonLabel}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    <OrderInfoCard order={order} showPlacedBy />
                    {order.deliveryType === 'delivery' && <OrderAddressCard order={order} />}
                </div>

                <div className="flex flex-col gap-5 mb-5">
                    {order.items.map((item) => (
                        <OrderItemDetailRow key={item.id} item={item} />
                    ))}
                </div>

                <OrderSummaryCard
                    subtotal={order.subtotal}
                    shippingFee={order.shippingFee}
                    total={order.total}
                />
            </ContainerBackground>
        </>
    );
}