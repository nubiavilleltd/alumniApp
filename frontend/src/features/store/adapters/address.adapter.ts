import type {
  Address,
  AddAddressPayload,
  CheckoutPayload,
  DeliveryZone,
  EditAddressPayload,
  ServerAddAddressPayload,
  ServerAddress,
  ServerCheckoutPayload,
  ServerDeliveryZone,
  ServerEditAddressPayload,
} from '../types/address.types';

// ─────────────────────────────────────────────────────────────────────────────
// Server → Frontend
// ─────────────────────────────────────────────────────────────────────────────

export function mapServerAddress(
  address: ServerAddress,
): Address {
  return {
    id: address.id,
    firstName: address.first_name,
    lastName: address.last_name,
    phone: address.phone,
    additionalPhone: address.additional_phone,
    address: address.address,
    landmark: address.landmark,
    state: address.state,
    area: address.area,
  };
}

export function mapDeliveryZones(
  zones: ServerDeliveryZone[],
): DeliveryZone[] {
  return zones.map((zone) => ({
    state: zone.state,
    areas: zone.areas.map((area) => ({
      area: area.area,
      fee: Number(area.fee),
    })),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Frontend → Server (Address)
// ─────────────────────────────────────────────────────────────────────────────

export function createAddressPayload(
  address: AddAddressPayload,
): ServerAddAddressPayload {
  return {
    first_name: address.firstName,
    last_name: address.lastName,
    phone: address.phone,
    additional_phone: address.additionalPhone,
    address: address.address,
    landmark: address.landmark,
    state: address.state,
    area: address.area,
  };
}

export function createEditAddressPayload(
  address: EditAddressPayload,
): ServerEditAddressPayload {
  return {
    id: address.id,
    first_name: address.firstName,
    last_name: address.lastName,
    phone: address.phone,
    additional_phone: address.additionalPhone,
    address: address.address,
    landmark: address.landmark,
    state: address.state,
    area: address.area,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Frontend → Server (Checkout)
// ─────────────────────────────────────────────────────────────────────────────

export function createCheckoutPayload(
  payload: CheckoutPayload,
): ServerCheckoutPayload {
  if (payload.deliveryType === 'self_pickup') {
    return {
      delivery_type: 'self_pickup',
    };
  }

  return {
    delivery_type: 'door_delivery',
    address_id: payload.addressId,
  };
}