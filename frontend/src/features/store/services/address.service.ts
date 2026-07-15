import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

import {
  createAddressPayload,
  createCheckoutPayload,
  createEditAddressPayload,
  mapDeliveryZones,
  mapServerAddress,
} from '../adapters/address.adapter';

import type {
  Address,
  AddAddressPayload,
  CheckoutPayload,
  DeliveryZone,
  EditAddressPayload,
  InitiateCheckoutResponse,
  ServerAddress,
  ServerDeliveryZone,
  VerifyPaymentResponse,
} from '../types/address.types';

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export const addressService = {
  // ───────────────────────────────────────────────────────────────────────────
  // Addresses
  // ───────────────────────────────────────────────────────────────────────────

  async fetchAddresses(): Promise<Address[]> {
    const { data } = await apiClient.get<ApiResponse<ServerAddress[]>>(
      API_ENDPOINTS.STORE.FETCH_ADDRESSES,
    );

    return data.data.map(mapServerAddress);
  },

  async addAddress(
    address: AddAddressPayload,
  ): Promise<void> {
    await apiClient.post(
      API_ENDPOINTS.STORE.ADD_ADDRESS,
      createAddressPayload(address),
    );
  },

  async editAddress(
    address: EditAddressPayload,
  ): Promise<void> {
    await apiClient.post(
      API_ENDPOINTS.STORE.EDIT_ADDRESS,
      createEditAddressPayload(address),
    );
  },

  async deleteAddress(
    addressId: string,
  ): Promise<void> {
    await apiClient.post(
      API_ENDPOINTS.STORE.DELETE_ADDRESS,
      {
        address_id: addressId,
      },
    );
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Delivery Zones
  // ───────────────────────────────────────────────────────────────────────────

  async fetchDeliveryZones(): Promise<DeliveryZone[]> {
    const { data } = await apiClient.get<
      ApiResponse<ServerDeliveryZone[]>
    >(API_ENDPOINTS.STORE.FETCH_DELIVERY_ZONES);

    return mapDeliveryZones(data.data);
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Checkout
  // ───────────────────────────────────────────────────────────────────────────

  async initiateCheckout(
    payload: CheckoutPayload,
  ): Promise<InitiateCheckoutResponse> {
    const { data } = await apiClient.post<InitiateCheckoutResponse>(
      API_ENDPOINTS.STORE.INITIATE_CHECKOUT,
      createCheckoutPayload(payload),
    );

    return data;
  },

  async verifyPayment(
    reference: string,
  ): Promise<VerifyPaymentResponse> {
    const { data } = await apiClient.post<VerifyPaymentResponse>(
      API_ENDPOINTS.STORE.VERIFY_PAYMENT,
      {
        reference,
      },
    );

    return data;
  },
};