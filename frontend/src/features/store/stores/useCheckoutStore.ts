// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import type { DeliveryMethod, ShippingAddress } from '../types/checkout.types';

// interface CheckoutStore {
//   deliveryMethod: DeliveryMethod;
//   shippingAddress: ShippingAddress | null;
//   shippingFee: number;

//   setDeliveryMethod: (m: DeliveryMethod) => void;
//   setShippingAddress: (a: ShippingAddress) => void;
//   setShippingFee: (fee: number) => void;
//   resetCheckout: () => void;
// }

// export const useCheckoutStore = create<CheckoutStore>()(
//   persist(
//     (set) => ({
//       deliveryMethod: 'pickup',
//       shippingAddress: null,
//       shippingFee: 0,

//       setDeliveryMethod: (deliveryMethod) => set({ deliveryMethod }),
//       setShippingAddress: (shippingAddress) => set({ shippingAddress }),
//       setShippingFee: (shippingFee) => set({ shippingFee }),

//       resetCheckout: () =>
//         set({
//           deliveryMethod: 'pickup',
//           shippingAddress: null,
//           shippingFee: 0,
//         }),
//     }),
//     {
//       name: 'checkout-store',
//     },
//   ),
// );




import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DeliveryMethod } from '../types/checkout.types';
import type { ShippingAddress } from '../types/address.types';

interface CheckoutStore {
  deliveryMethod: DeliveryMethod;

  shippingAddress: ShippingAddress | null;

  shippingFee: number;

  setDeliveryMethod: (m: DeliveryMethod) => void;

  setShippingAddress: (a: ShippingAddress) => void;

  setShippingFee: (fee: number) => void;

  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      deliveryMethod: 'pickup',
      shippingAddress: null,
      shippingFee: 0,

      setDeliveryMethod: (deliveryMethod) =>
        set({ deliveryMethod }),

      setShippingAddress: (shippingAddress) =>
        set({ shippingAddress }),

      setShippingFee: (shippingFee) =>
        set({ shippingFee }),

      resetCheckout: () =>
        set({
          deliveryMethod: 'pickup',
          shippingAddress: null,
          shippingFee: 0,
        }),
    }),
    {
      name: 'checkout-store',
    },
  ),
);