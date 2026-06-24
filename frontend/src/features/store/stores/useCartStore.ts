// // import { create } from 'zustand';
// // import { persist } from 'zustand/middleware';
// // import type { CartItem } from '../types/cart.types';

// // interface CartStore {
// //   items: CartItem[];

// //   addItem: (item: CartItem) => void;

// //   updateItem: (id: string, updates: Partial<CartItem>) => void;

// //   removeItem: (id: string) => void;

// //   removeMany: (ids: string[]) => void;

// //   clearCart: () => void;

// //   getItemCount: () => number;

// //   getSubtotal: () => number;
// // }

// // export const useCartStore = create<CartStore>()(
// //   persist(
// //     (set, get) => ({
// //       items: [],

// //       addItem: (item) =>
// //         set((state) => ({
// //           items: [...state.items, item],
// //         })),

// //       updateItem: (id, updates) =>
// //         set((state) => ({
// //           items: state.items.map((item) =>
// //             item.id === id ? { ...item, ...updates } : item,
// //           ),
// //         })),

// //       removeItem: (id) =>
// //         set((state) => ({
// //           items: state.items.filter((i) => i.id !== id),
// //         })),

// //       removeMany: (ids) =>
// //         set((state) => ({
// //           items: state.items.filter((i) => !ids.includes(i.id)),
// //         })),

// //       clearCart: () => set({ items: [] }),

// //       getItemCount: () =>
// //         get().items.reduce((sum, i) => sum + i.quantity, 0),

// //       getSubtotal: () =>
// //         get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
// //     }),
// //     {
// //       name: 'store-cart',
// //     },
// //   ),
// // );









// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import type { CartItem } from '../types/cart.types';

// interface CartStore {
//   items: CartItem[];
//   /**
//    * Add an item. If the same id already exists, merge quantity (capped at maxStock).
//    * Returns 'added' | 'merged' | 'capped'
//    */
//   addItem: (item: CartItem, maxStock?: number) => 'added' | 'merged' | 'capped';
//   updateItem: (id: string, updates: Partial<CartItem>) => void;
//   removeItem: (id: string) => void;
//   removeMany: (ids: string[]) => void;
//   clearCart: () => void;
//   getItemById: (id: string) => CartItem | undefined;
// }

// export const useCartStore = create<CartStore>()(
//   persist(
//     (set, get) => ({
//       items: [],

//       addItem: (item, maxStock) => {
//         const existing = get().items.find((i) => i.id === item.id);
//         if (existing) {
//           const newQty = existing.quantity + item.quantity;
//           const capped = maxStock !== undefined ? Math.min(newQty, maxStock) : newQty;
//           set((state) => ({
//             items: state.items.map((i) =>
//               i.id === item.id ? { ...i, quantity: capped } : i,
//             ),
//           }));
//           return capped < newQty ? 'capped' : 'merged';
//         }
//         set((state) => ({ items: [...state.items, item] }));
//         return 'added';
//       },

//       updateItem: (id, updates) =>
//         set((state) => ({
//           items: state.items.map((item) =>
//             item.id === id ? { ...item, ...updates } : item,
//           ),
//         })),

//       removeItem: (id) =>
//         set((state) => ({
//           items: state.items.filter((i) => i.id !== id),
//         })),

//       removeMany: (ids) =>
//         set((state) => ({
//           items: state.items.filter((i) => !ids.includes(i.id)),
//         })),

//       clearCart: () => set({ items: [] }),

//       getItemById: (id) => get().items.find((i) => i.id === id),
//     }),
//     { name: 'store-cart' },
//   ),
// );









import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types/cart.types';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem, maxStock?: number) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  removeItem: (id: string) => void;
  removeMany: (ids: string[]) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, maxStock) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          // Same product+colour+size already in cart → ADD quantities, cap at maxStock
          const merged = existing.quantity + item.quantity;
          const finalQty = maxStock !== undefined ? Math.min(merged, maxStock) : merged;
          set((state) => ({
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: finalQty } : i,
            ),
          }));
        } else {
          set((state) => ({ items: [...state.items, item] }));
        }
      },

      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, ...updates } : i,
          ),
        })),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      removeMany: (ids) =>
        set((state) => ({ items: state.items.filter((i) => !ids.includes(i.id)) })),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'store-cart' },
  ),
);