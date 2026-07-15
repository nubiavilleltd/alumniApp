// ─────────────────────────────────────────────────────────────────────────────
// Frontend address model
// ─────────────────────────────────────────────────────────────────────────────

export interface Address {
  id: string;

  firstName: string;
  lastName: string;

  phone: string;
  additionalPhone?: string;

  address: string;
  landmark?: string;

  state: string;
  area: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Server address model
// ─────────────────────────────────────────────────────────────────────────────

export interface ServerAddress {
  id: string;

  first_name: string;
  last_name: string;

  phone: string;
  additional_phone?: string;

  address: string;
  landmark?: string;

  state: string;
  area: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Delivery zones
// ─────────────────────────────────────────────────────────────────────────────

export interface DeliveryArea {
  area: string;
  fee: number;
}

export interface DeliveryZone {
  state: string;
  areas: DeliveryArea[];
}

// Backend response
export interface ServerDeliveryArea {
  area: string;
  fee: string;
}

export interface ServerDeliveryZone {
  state: string;
  areas: ServerDeliveryArea[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Frontend payloads
// ─────────────────────────────────────────────────────────────────────────────

export interface AddAddressPayload {
  firstName: string;
  lastName: string;

  phone: string;
  additionalPhone?: string;

  address: string;
  landmark?: string;

  state: string;
  area: string;
}

export interface EditAddressPayload extends AddAddressPayload {
  id: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Server payloads
// ─────────────────────────────────────────────────────────────────────────────

export interface ServerAddAddressPayload {
  first_name: string;
  last_name: string;

  phone: string;
  additional_phone?: string;

  address: string;
  landmark?: string;

  state: string;
  area: string;
}

export interface ServerEditAddressPayload
  extends ServerAddAddressPayload {
  id: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Checkout payloads
// ─────────────────────────────────────────────────────────────────────────────

export type CheckoutPayload =
  | {
      deliveryType: 'self_pickup';
    }
  | {
      deliveryType: 'door_delivery';
      addressId: number;
    };

export type ServerCheckoutPayload =
  | {
      delivery_type: 'self_pickup';
    }
  | {
      delivery_type: 'door_delivery';
      address_id: number;
    };

// ─────────────────────────────────────────────────────────────────────────────
// Checkout responses (temporary until backend response is finalized)
// ─────────────────────────────────────────────────────────────────────────────

export interface InitiateCheckoutResponse {
  reference: string;
  accessCode: string;
  amount: number;
  email: string;
}

export interface VerifyPaymentResponse {
  status: boolean;
  orderId?: string;
  message?: string;
}