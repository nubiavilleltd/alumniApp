export type DeliveryMethod = 'pickup' | 'delivery';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  phone: string;
  altPhone?: string;
  address: string;
  landmark?: string;
  state: string;
  area: string;
}