export interface ShippingAddress {
  id: string;

  firstName: string;
  lastName: string;

  phone: string;
  altPhone?: string;

  address: string;
  landmark?: string;

  state: string;
  area: string;
}