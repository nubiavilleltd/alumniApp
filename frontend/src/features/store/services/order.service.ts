import { apiClient } from "@/lib/api/client";
import { adaptOrder } from "../adapters/order.adapter";
import { Order, OrderResponse } from "../types/order.types";
import { handleApiError } from "@/lib/errors/apiErrorHandler";
import { API_ENDPOINTS } from "@/lib/api/endpoints";


export const OrderService = {
    async getOrders(): Promise<Order[]> {
        try {
            const { data } = await apiClient.get(API_ENDPOINTS.ORDER.FETCH_ORDERS);
            const raw: OrderResponse[] = data?.data ?? data?.orders ?? [];
            return raw.map(adaptOrder);
        } catch (error) {
            throw handleApiError(error, 'Failed to load orders.', 'getOrders');
        }
    }
}