import { apiClient } from "@/lib/api/client";
import { handleApiError } from "@/lib/errors/apiErrorHandler";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Order, OrderResponse } from "@/features/store/types/order.types";
import { adaptOrder } from "@/features/store/adapters/order.adapter";


export const AdminOrderService = {
    async getAdminOrders(): Promise<Order[]> {
        try {
            const { data } = await apiClient.get(API_ENDPOINTS.ORDER.FETCH_ORDERS_MANAGEMENT);
            const raw: OrderResponse[] = data?.data ?? data?.orders ?? [];
            return raw.map(adaptOrder);
        } catch (error) {
            throw handleApiError(error, 'Failed to load orders.', 'getAdminOrders');
        }
    }
}