// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import type { CartItem } from '../types/cart.types';

// interface CartStore {
//   items: CartItem[];
//   addItem: (item: CartItem, maxStock?: number) => void;
//   updateItem: (id: string, updates: Partial<CartItem>) => void;
//   removeItem: (id: string) => void;
//   removeMany: (ids: string[]) => void;
//   clearCart: () => void;
// }

// export const useCartStore = create<CartStore>()(
//   persist(
//     (set, get) => ({
//       items: [],

//       addItem: (item, maxStock) => {
//         const existing = get().items.find((i) => i.id === item.id);
//         if (existing) {
//           // Same product+colour+size already in cart → ADD quantities, cap at maxStock
//           const merged = existing.quantity + item.quantity;
//           const finalQty = maxStock !== undefined ? Math.min(merged, maxStock) : merged;
//           set((state) => ({
//             items: state.items.map((i) =>
//               i.id === item.id ? { ...i, quantity: finalQty } : i,
//             ),
//           }));
//         } else {
//           set((state) => ({ items: [...state.items, item] }));
//         }
//       },

//       updateItem: (id, updates) =>
//         set((state) => ({
//           items: state.items.map((i) =>
//             i.id === id ? { ...i, ...updates } : i,
//           ),
//         })),

//       removeItem: (id) =>
//         set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

//       removeMany: (ids) =>
//         set((state) => ({ items: state.items.filter((i) => !ids.includes(i.id)) })),

//       clearCart: () => set({ items: [] }),
//     }),
//     { name: 'store-cart' },
//   ),
// );








import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types/cart.types';

export type CartSyncStatus = 'idle' | 'syncing' | 'error';

interface CartStore {
    items: CartItem[];
    syncStatus: CartSyncStatus;
    cartId: number | null;

    addItemLocally: (item: CartItem) => void;
    updateItemLocally: (id: string, quantity: number) => void;
    removeItemLocally: (id: string) => void;
    removeManyLocally: (ids: string[]) => void;
    setItems: (items: CartItem[], cartId?: number) => void;
    patchItem: (localId: string, patch: Partial<CartItem>) => void;
    clearCart: () => void;
    setSyncStatus: (status: CartSyncStatus) => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            syncStatus: 'idle',
            cartId: null,

            addItemLocally: (item) =>
                set((state) => {
                    const existing = state.items.find((i) => i.id === item.id);
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i,
                            ),
                        };
                    }
                    return { items: [...state.items, item] };
                }),

            updateItemLocally: (id, quantity) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id || i.cartItemId === id ? { ...i, quantity } : i,
                    ),
                })),

            removeItemLocally: (id) =>
                set((state) => ({
                    items: state.items.filter(
                        (i) => i.id !== id && i.cartItemId !== id,
                    ),
                })),

            removeManyLocally: (ids) =>
                set((state) => ({
                    items: state.items.filter(
                        (i) => !ids.includes(i.id) && !ids.includes(i.cartItemId ?? ''),
                    ),
                })),

            setItems: (items, cartId) =>
                set({ items, ...(cartId !== undefined ? { cartId } : {}) }),

            patchItem: (localId, patch) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === localId ? { ...i, ...patch } : i,
                    ),
                })),

            clearCart: () => set({ items: [], cartId: null }),

            setSyncStatus: (syncStatus) => set({ syncStatus }),
        }),
        {
            name: 'store-cart',
            partialize: (state) => ({
                items: state.items,
            }),
        }
    ),
);