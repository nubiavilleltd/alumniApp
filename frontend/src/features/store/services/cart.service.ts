import { apiClient } from '@/lib/api/client';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import type {
  CartItem,
  ServerCart,
  AddToCartPayload,
  UpdateCartPayload,
  RemoveFromCartPayload,
} from '../types/cart.types';

// ─── Adapter ──────────────────────────────────────────────────────────────────

export function adaptServerCartItem(raw: ServerCart['items'][number]): CartItem {
  const variantId = raw.variant?.id;
  const id = variantId
    ? `${raw.product_id}-${variantId}`
    : `${raw.product_id}-novariant`;

  return {
    cartItemId: raw.cart_item_id,
    id,
    productId: raw.product_id,
    variantId: variantId ?? undefined,
    productName: raw.product_name,
    image: raw.image?.image_url ?? '',
    price: parseFloat(raw.unit_price),
    quantity: parseInt(raw.quantity, 10),
    color: raw.variant?.color ?? undefined,
    size: raw.variant?.size ?? undefined,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const cartService = {
  /** GET /product/fetch_cart */
  async fetchCart(): Promise<{ cartId: number; items: CartItem[] }> {
    try {
      const { data } = await apiClient.get('/product/fetch_cart');
      const cart: ServerCart = data?.data;

      console.log("my cart", {items:cart})
      return {
        cartId: cart?.cart_id ?? 0,
        items: (cart?.items ?? []).map(adaptServerCartItem),
      };
    } catch (error) {
      throw handleApiError(error, 'Failed to load cart.', 'cartService.fetchCart');
    }
  },

  /** POST /product/add_to_cart */
  async addToCart(payload: AddToCartPayload): Promise<void> {
    try {
      await apiClient.post('/product/add_to_cart', payload);
    } catch (error) {
      throw handleApiError(error, 'Failed to add item to cart.', 'cartService.addToCart');
    }
  },

  /** POST /product/update_cart */
  async updateCart(payload: UpdateCartPayload): Promise<void> {
    try {
      await apiClient.post('/product/update_cart', payload);
    } catch (error) {
      throw handleApiError(error, 'Failed to update cart.', 'cartService.updateCart');
    }
  },

  /** POST /product/remove_from_cart */
  async removeFromCart(payload: RemoveFromCartPayload): Promise<void> {
    try {
      await apiClient.post('/product/remove_from_cart', payload);
    } catch (error) {
      throw handleApiError(error, 'Failed to remove item.', 'cartService.removeFromCart');
    }
  },

  /** POST /product/clear_cart */
  async clearCart(): Promise<void> {
    try {
      await apiClient.post('/product/clear_cart');
    } catch (error) {
      throw handleApiError(error, 'Failed to clear cart.', 'cartService.clearCart');
    }
  },
};