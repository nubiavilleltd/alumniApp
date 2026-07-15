// // import { create } from 'zustand';
// // import { persist } from 'zustand/middleware';
// // import type { DeliveryMethod } from '../types/checkout.types';
// // import type { ShippingAddress } from '../types/address.types';

// // interface CheckoutStore {
// //   deliveryMethod: DeliveryMethod;

// //   shippingAddress: ShippingAddress | null;

// //   shippingFee: number;

// //   setDeliveryMethod: (m: DeliveryMethod) => void;

// //   setShippingAddress: (a: ShippingAddress) => void;

// //   setShippingFee: (fee: number) => void;

// //   resetCheckout: () => void;
// // }

// // export const useCheckoutStore = create<CheckoutStore>()(
// //   persist(
// //     (set) => ({
// //       deliveryMethod: 'pickup',
// //       shippingAddress: null,
// //       shippingFee: 0,

// //       setDeliveryMethod: (deliveryMethod) =>
// //         set({ deliveryMethod }),

// //       setShippingAddress: (shippingAddress) =>
// //         set({ shippingAddress }),

// //       setShippingFee: (shippingFee) =>
// //         set({ shippingFee }),

// //       resetCheckout: () =>
// //         set({
// //           deliveryMethod: 'pickup',
// //           shippingAddress: null,
// //           shippingFee: 0,
// //         }),
// //     }),
// //     {
// //       name: 'checkout-store',
// //     },
// //   ),
// // );




// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import type { DeliveryMethod } from '../types/checkout.types';
// import type { ShippingAddress } from '../types/address.types';
// import { getShippingFee } from '../mock/shippingRates.mock';

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

//       setDeliveryMethod: (deliveryMethod) =>
//         set((state) => ({
//           deliveryMethod,
//           // Clear fee if switching to pickup
//           shippingFee:
//             deliveryMethod === 'pickup'
//               ? 0
//               : state.shippingAddress
//                 ? getShippingFee(state.shippingAddress.state, state.shippingAddress.area)
//                 : 0,
//         })),

//       setShippingAddress: (shippingAddress) =>
//         set({
//           shippingAddress,
//           shippingFee: getShippingFee(shippingAddress.state, shippingAddress.area),
//         }),

//       setShippingFee: (shippingFee) => set({ shippingFee }),

//       resetCheckout: () =>
//         set({
//           deliveryMethod: 'pickup',
//           shippingAddress: null,
//           shippingFee: 0,
//         }),
//     }),
//     { name: 'checkout-store' },
//   ),
// );




import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DeliveryMethod } from '../types/checkout.types';
import type { Address } from '../types/address.types';
import { getShippingFee } from '../constants/shippingRates';

interface CheckoutStore {
  deliveryMethod: DeliveryMethod;
  shippingAddress: Address | null;
  shippingFee: number;
  setDeliveryMethod: (m: DeliveryMethod) => void;
  setShippingAddress: (a: Address) => void;
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
        set((state) => ({
          deliveryMethod,
          shippingFee:
            deliveryMethod === 'pickup'
              ? 0
              : state.shippingAddress
                ? getShippingFee(state.shippingAddress.state, state.shippingAddress.area)
                : 0,
        })),

      setShippingAddress: (shippingAddress) =>
        set({
          shippingAddress,
          shippingFee: getShippingFee(shippingAddress.state, shippingAddress.area),
        }),

      setShippingFee: (shippingFee) => set({ shippingFee }),

      resetCheckout: () =>
        set({ deliveryMethod: 'pickup', shippingAddress: null, shippingFee: 0 }),
    }),
    { name: 'checkout-store' },
  ),
);