import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { addressService } from '../services/address.service';

import type {
  AddAddressPayload,
  EditAddressPayload,
} from '../types/address.types';

const QUERY_KEY = ['store-addresses'];

export function useAddresses() {
  const queryClient = useQueryClient();

  const addresses = useQuery({
    queryKey: QUERY_KEY,
    queryFn: addressService.fetchAddresses,
  });

  const addAddress = useMutation({
    mutationFn: (payload: AddAddressPayload) =>
      addressService.addAddress(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });

  const editAddress = useMutation({
    mutationFn: (payload: EditAddressPayload) =>
      addressService.editAddress(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });

  const deleteAddress = useMutation({
    mutationFn: (addressId: string) =>
      addressService.deleteAddress(addressId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });

  return {
    ...addresses,

    addAddress,
    editAddress,
    deleteAddress,
  };
}