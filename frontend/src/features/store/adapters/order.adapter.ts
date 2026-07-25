import { DeliveryMethod } from "../types/checkout.types";
import { DeliveryMethodResponse, Order, OrderItem, OrderItemResponse, OrderResponse, OrderStatus } from "../types/order.types";

export function adaptOrder(
  order: OrderResponse,
): Order {
  return {
    id: order.id,
    userId: order.user_id,
    paymentReference: order.paystack_reference,
    orderNumber: order.order_number,
    status: order.status,
    deliveryType: mapDeliveryType(order.delivery_type),
    placedAt: order.created_at,
    paidAt: order.paid_at,
    deliveredAt: undefined, // Not available in response
    completedAt: order.completion_date || undefined,
    subtotal: parseFloat(order.subtotal),
    shippingFee: parseFloat(order.shipping_fee),
    total: parseFloat(order.amount),
    firstName: order.first_name,
    lastName: order.last_name,
    address: order.address,
    landmark: order.landmark,
    area: order.area,
    state: order.state,
    phone: order.phone,
    additionalPhone: order.additional_phone,
    items: Array.isArray(order.items) 
      ? order.items.map(adaptOrderItem) 
      : [],
  };
}

export function adaptOrderItem(
  orderItem: OrderItemResponse,
): OrderItem {
  return {
    id: orderItem.id,
    productId: orderItem.product_id,
    productName: orderItem.product_name,
    image: orderItem.image_url,
    price: parseFloat(orderItem.unit_price),
    quantity: parseInt(orderItem.quantity, 10),
    color: orderItem.color || undefined,
    size: orderItem.size || undefined,
    variantId: orderItem.variant_id || undefined,
  };
}

// Helper function to map delivery type
function mapDeliveryType(deliveryType: DeliveryMethodResponse): DeliveryMethod {
  const mapping: Record<DeliveryMethodResponse, DeliveryMethod> = {
    'door_delivery': 'delivery',
    'self_pickup': 'pickup',
  };
  return mapping[deliveryType];
}
