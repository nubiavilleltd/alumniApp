import { apiClient } from "@/lib/api/client";
import { handleApiError } from "@/lib/errors/apiErrorHandler";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Order, OrderResponse } from "@/features/store/types/order.types";
import { adaptOrder } from "@/features/store/adapters/order.adapter";
import { RawOrderStatus } from "@/features/store/utils/order.utils";


export const AdminOrderService = {
    async getAdminOrders(): Promise<Order[]> {
        try {
            const { data } = await apiClient.get(API_ENDPOINTS.ORDER.FETCH_ORDERS_MANAGEMENT);
            const raw: OrderResponse[] = data?.data ?? data?.orders ?? [];
            return raw.map(adaptOrder);
        } catch (error) {
            throw handleApiError(error, 'Failed to load orders.', 'getAdminOrders');
        }
    },

    async updateOrderStatus(
        orderId: string,
        status: RawOrderStatus,
        extra?: { rider_details?: string; note?: string }
    ): Promise<void> {
        try {
            await apiClient.post(API_ENDPOINTS.ORDER.UPDATE_ORDER_STATUS, {
                order_id: orderId,
                status,
                ...(extra?.rider_details ? { rider_details: extra.rider_details } : {}),
                ...(extra?.note ? { note: extra.note } : {}),
            });
        } catch (error) {
            throw handleApiError(error, 'Failed to update order status.', 'updateOrderStatus');
        }
    },

    //     async updateOrderStatus(orderId: string, status: RawOrderStatus): Promise<void> {
    //     try {
    //         await apiClient.post(API_ENDPOINTS.ORDER.UPDATE_ORDER_STATUS, {
    //             order_id: orderId,
    //             status,
    //         });
    //     } catch (error) {
    //         throw handleApiError(error, 'Failed to update order status.', 'updateOrderStatus');
    //     }
    // },
}


