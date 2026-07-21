import { cartService } from './cart.service';
import type { CartItem } from '../types/cart.types';

interface SynchronizeCartParams {
  localItems: CartItem[];
  serverItems: CartItem[];
}

export async function synchronizeGuestCart({
  localItems,
  serverItems,
}: SynchronizeCartParams): Promise<void> {
  const guestOnlyItems: CartItem[] = [];

  const duplicateItems: Array<{
    local: CartItem;
    server: CartItem;
  }> = [];

  for (const local of localItems) {
    const server = serverItems.find((s) => s.id === local.id);

    if (server) {
      duplicateItems.push({
        local,
        server,
      });
    } else {
      guestOnlyItems.push(local);
    }
  }

  await Promise.all([
    ...guestOnlyItems.map((item) =>
      cartService.addToCart({
        product_id: Number(item.productId),
        ...(item.variantId
          ? { variant_id: Number(item.variantId) }
          : {}),
        quantity: item.quantity,
      }),
    ),

    ...duplicateItems
      .filter(
        ({ local, server }) =>
          local.quantity !== server.quantity &&
          server.cartItemId,
      )
      .map(({ local, server }) =>
        cartService.updateCart({
          cart_item_id: Number(server.cartItemId),
          quantity: local.quantity,
        }),
      ),
  ]);
}