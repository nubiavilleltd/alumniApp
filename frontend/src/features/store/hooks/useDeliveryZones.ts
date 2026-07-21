import { useQuery } from '@tanstack/react-query';

import { addressService } from '../services/address.service';

export function useDeliveryZones() {
  return useQuery({
    queryKey: ['delivery-zones'],
    queryFn: addressService.fetchDeliveryZones,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}