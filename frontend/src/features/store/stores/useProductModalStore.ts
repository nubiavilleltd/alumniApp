import { create } from 'zustand';
import type { Product } from '../types/product.types';
import type { CartItem } from '../types/cart.types';

interface ProductModalStore {
  isOpen: boolean;
  mode: 'add' | 'edit';
  product: Product | null;
  cartItem: CartItem | null;
  openForAdd: (product: Product) => void;
  openForEdit: (product: Product, cartItem: CartItem) => void;
  close: () => void;
}

export const useProductModalStore = create<ProductModalStore>((set) => ({
  isOpen: false,
  mode: 'add',
  product: null,
  cartItem: null,

  openForAdd: (product) =>
    set({ isOpen: true, mode: 'add', product, cartItem: null }),

  openForEdit: (product, cartItem) =>
    set({ isOpen: true, mode: 'edit', product, cartItem }),

  close: () =>
    set({ isOpen: false, product: null, cartItem: null }),
}));