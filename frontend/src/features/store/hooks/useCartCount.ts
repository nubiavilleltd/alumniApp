// import { useCartStore } from '../stores/useCartStore';

// export const useCartCount = () =>
//   useCartStore((state) =>
//     state.items.reduce(
//       (sum, item) => sum + item.quantity,
//       0,
//     ),
//   );



import { useCartStore } from '../stores/useCartStore';

export const useCartCount = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );