import { DeliveryMethod } from "./checkout.types";

export type OrderStatus =
  | 'Processing'       // user-facing name for "new_order"
  | 'Out for Delivery'
  | 'Ready for Pickup'
  | 'Completed'

export type AdminOrderStatus =
  | 'New Order'
  | 'Out for Delivery'
  | 'Ready for Pickup'
  | 'Completed';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  variantId?: string;
}


export interface Order {
  id: string;
  userId:string;
  paymentReference:string;
  orderNumber: string;
  status: OrderStatus | AdminOrderStatus;
  deliveryType: DeliveryMethod
  placedAt: string;
  paidAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  firstName: string;
  lastName: string;
  address: string;
  landmark?: string;
  area: string;
  state: string;
  phone: string;
  additionalPhone:string;
  items: OrderItem[];
}

// order.types.ts — add below the Order interface

/** One row in the flattened "My Order History" list — a single item
 * paired with the shared fields it inherits from its parent order. */
export interface FlattenedOrderItem {
  id: string;              // unique row key: `${orderId}-${item.id}`
  orderId: string;         // for the "View Details" link → /orders/{orderId}
  orderNumber: string;
  status: OrderStatus | AdminOrderStatus;
  placedAt: string;
  item: OrderItem;
  lineTotal: number;       // item.price * item.quantity
}


export type DeliveryMethodResponse = 'door_delivery' | 'self_pickup';


export interface OrderResponse {
  id: string;
  user_id: string;
  order_number: string;
  paystack_reference: string;
  subtotal: string;
  shipping_fee: string;
  amount: string;
  delivery_type: DeliveryMethodResponse;
  first_name: string;
  last_name: string;
  phone: string;
  additional_phone: string;
  address: string;
  landmark?: string;
  state: string;
  area: string;
  status: OrderStatus | AdminOrderStatus;
  paid_at?: string;
  completion_date?: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItemResponse
}

export interface OrderItemResponse {
  id: string;
  product_id: string;
  variant_id: string | null;
  product_name: string;
  color: string | null;
  size: string | null;
  unit_price: string;
  quantity: string;
  line_total: string;
  image_url: string;
}

