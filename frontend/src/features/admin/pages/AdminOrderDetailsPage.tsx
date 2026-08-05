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
import { useState } from 'react';
import OrderRiderNoteCard from '@/features/store/components/OrderRiderNoteCard';
import { toast } from '@/shared/components/ui/Toast';


export default function AdminOrderDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { orders, isLoading, isError, error } = useAdminOrders();
    const { mutateAsync: updateStatus, isPending } = useUpdateOrderStatus();
    const [riderDetails, setRiderDetails] = useState('');
    const [note, setNote] = useState('');
    const [riderDetailsError, setRiderDetailsError] = useState<string | undefined>();

    const order = orders.find((o) => o.orderNumber === id);



    if (isLoading) {
        return <ContainerBackground><p>Loading order...</p></ContainerBackground>;
    }

    if (isError) {
        return (
            <ContainerBackground>
                <div className="text-red-500">Error loading order: {error?.message}</div>
            </ContainerBackground>
        );
    }

    if (!order) {
        return <ContainerBackground><p>Order not found.</p></ContainerBackground>;
    }

    const transition = getNextStatusTransition(order.status as AdminOrderStatus, order.deliveryType);
const requiresRiderDetails = order.deliveryType === 'delivery' && transition?.nextRawStatus === 'shipped';

    const handleStatusUpdate = async () => {
        if (!transition) return;

        if (requiresRiderDetails && !riderDetails.trim()) {
            setRiderDetailsError('Rider details are required before updating this order.');
            return;
        }

        try {
            await updateStatus({
                orderId: order.id,
                status: transition.nextRawStatus,
                riderDetails: order.deliveryType === 'delivery' ? riderDetails.trim() : undefined,
                note: note.trim() || undefined,
            });

            toast.success("Order successfully updated")

        } catch (error) {
            toast.error("An error occurred while updating order status")
            console.error("error", error)
        }




    };

    return (
        <>
            <SEO title="Order Details" />

            <ContainerBackground>


                <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="type-section-title">Order Details</h1>
                        <OrderStatusBadge status={order.status} />
                    </div>

               
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




                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start mb-5">
                    <OrderSummaryCard
                        subtotal={order.subtotal}
                        shippingFee={order.shippingFee}
                        total={order.total}
                    />
                    {transition && (
                        <div className="flex flex-col gap-4">
                            <OrderRiderNoteCard
                                showRiderDetails={requiresRiderDetails}
                                riderDetails={riderDetails}
                                onRiderDetailsChange={(value) => {
                                    setRiderDetails(value);
                                    if (riderDetailsError) setRiderDetailsError(undefined);
                                }}
                                note={note}
                                onNoteChange={setNote}
                                riderDetailsError={riderDetailsError}
                            />

                            <button
                                type="button"
                                disabled={isPending}
                                onClick={handleStatusUpdate}
                                className="w-full sm:w-auto sm:self-end bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                                {isPending ? 'Updating...' : transition.buttonLabel}
                            </button>
                        </div>
                    )}
                </div>

            </ContainerBackground>
        </>
    );
}